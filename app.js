import {config} from './config.js';
import {categories,money,todayWIB,validateBooking,bookingMessage} from './packages.js';
const $=s=>document.querySelector(s);
$('#category-nav').innerHTML=categories.map(c=>'<a href="#'+c.id+'">'+c.name+'</a>').join('');
$('#packages').innerHTML=categories.map((c,i)=>'<section class="package-section" id="'+c.id+'"><div class="package-heading"><span class="section-number">0'+(i+1)+'</span><h3>'+c.name+'</h3>'+(c.hours?'<span class="badge">Maks. '+c.hours+' jam</span>':'')+'</div><p class="description">'+c.description+'</p><div class="cards '+(c.packages.length===2?'two':'')+'">'+c.packages.map((p,j)=>'<article class="card"><div class="card-top">'+p.name+'</div><ul>'+p.items.map(t=>'<li>'+t+'</li>').join('')+'</ul><div class="card-bottom"><div class="price">'+money(p.price)+'</div><div class="deposit">DP min. '+c.deposit*100+'% · '+money(p.price*c.deposit)+'</div><button class="choose" data-category="'+c.id+'" data-package="'+j+'">Pilih paket ini ↗</button></div></article>').join('')+'</div></section>').join('');
$('#category').innerHTML=categories.map(c=>'<option value="'+c.id+'">'+c.name+'</option>').join('');
function selection(){const c=categories.find(c=>c.id===$('#category').value);return [c,c.packages[Number($('#package').value)]];}
function resetResult(){$('#whatsapp-result').hidden=true;$('#whatsapp-result').removeAttribute('href');$('#form-status').textContent='';}
function updateSummary(){const [c,p]=selection();$('#summary').innerHTML='<div class="summary-title">'+c.name+' · '+p.name+'</div><div class="summary-row"><span>Harga paket</span><strong>'+money(p.price)+'</strong></div><div class="summary-row dp"><span>DP minimum '+c.deposit*100+'%</span><strong>'+money(p.price*c.deposit)+'</strong></div><div class="summary-row"><span>Sisa setelah DP minimum</span><span>'+money(p.price*(1-c.deposit))+'</span></div><small>'+(c.hours?'Batas waktu kerja maksimal '+c.hours+' jam.':'Durasi Wisuda dikonfirmasi dengan admin.')+'</small>';resetResult();}
function updatePackages() {const c=categories.find(c=>c.id===$('#category').value);$('#package').innerHTML=c.packages.map((p,i)=>'<option value="'+i+'">'+p.name+' — '+money(p.price)+'</option>').join('');updateSummary();}
$('#category').addEventListener('change',updatePackages);
$('#package').addEventListener('change',updateSummary);
$('#booking-form').addEventListener('input',resetResult);
document.querySelectorAll('.choose').forEach(b=>b.addEventListener('click',()=>{$('#category').value=b.dataset.category;updatePackages();$('#package').value=b.dataset.package;updateSummary();$('#booking').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
$('#consult').href='https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent('Halo Ardi Pranata, saya ingin konsultasi paket dan ketersediaan jadwal.');
const dateInput=$('#selected-date');
function updateDateMinimum(){dateInput.min=todayWIB();}
updateDateMinimum();
dateInput.addEventListener('focus',updateDateMinimum);
const rp=n=>money(n).replace(/\u00a0/g,' ');
const tglID=d=>d.toLocaleDateString('id-ID',{timeZone:'Asia/Pontianak',day:'numeric',month:'long',year:'numeric'});
let invoiceState={key:'',no:''};

function nomorInvoice(key){
 if(invoiceState.key===key)return invoiceState.no;
 const tgl=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Pontianak'}).replace(/-/g,'');
 const acak=Math.random().toString(36).slice(2,6).toUpperCase();
 invoiceState={key,no:'INV-'+tgl+'-'+acak};
 return invoiceState.no;
}

function getBooking(){
 const f=$('#booking-form');updateDateMinimum();
 if(!f.reportValidity())return null;
 const data=Object.fromEntries(new FormData(f));
 const error=validateBooking(data);
 if(error){$('#form-status').textContent=error;return null;}
 data.name=data.name.trim();data.location=data.location.trim();
 const [c,p]=selection();
 return {data,c,p,no:nomorInvoice(JSON.stringify([c.id,p.name,data]))};
}

function buatInvoice({data,c,p,no}){
 const {jsPDF}=window.jspdf;
 const doc=new jsPDF({unit:'mm',format:'a4'});
 const W=doc.internal.pageSize.getWidth();
 const maroon=[83,29,43],gold=[176,141,87];
 const dp=p.price*c.deposit,sisa=p.price-dp;

 doc.setFillColor(...maroon);doc.rect(0,0,W,32,'F');
 doc.setTextColor(250,245,235);
 doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text('ARDI PRANATA',14,16);
 doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text('PHOTO & VIDEO',14,22);
 doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text('INVOICE',W-14,18,{align:'right'});
 doc.setFillColor(...gold);doc.rect(0,32,W,1.2,'F');

 doc.setTextColor(40,40,40);doc.setFontSize(10);
 const info=[
  ['No. Invoice',no],['Tanggal terbit',tglID(new Date())],
  ['Nama',data.name],['WhatsApp',data.phone],
  ['Tanggal acara',tglID(new Date(data.date+'T00:00:00'))+' · '+data.time+' WIB'],
  ['Lokasi',data.location]
 ];
 let y=44;
 info.forEach(([k,v])=>{
  doc.setFont('helvetica','bold');doc.text(k,14,y);
  doc.setFont('helvetica','normal');doc.text(String(v),50,y,{maxWidth:W-64});
  y+=7;
 });

 doc.autoTable({
  startY:y+4,
  head:[['Deskripsi','Harga']],
  body:[[c.name+' - '+p.name+'\n'+p.items.map(t=>'• '+t).join('\n'),rp(p.price)]],
  headStyles:{fillColor:maroon,textColor:[250,245,235]},
  columnStyles:{1:{halign:'right',cellWidth:40}},
  styles:{fontSize:9,cellPadding:3}
 });
 doc.autoTable({
  startY:doc.lastAutoTable.finalY+2,
  margin:{left:90},
  theme:'plain',
  body:[
   ['Total',rp(p.price)],
   ['DP minimum ('+c.deposit*100+'%)',rp(dp)],
   ['Sisa setelah DP',rp(sisa)]
  ],
  styles:{fontSize:10,cellPadding:2},
  columnStyles:{0:{fontStyle:'bold'},1:{halign:'right'}}
 });

 let ny=doc.lastAutoTable.finalY+10;
 doc.setFontSize(8.5);doc.setTextColor(90,90,90);
 const catatan=[
  c.hours?'Batas waktu kerja maksimal '+c.hours+' jam.':'Durasi dikonfirmasi dengan admin.',
  'Invoice ini bukan bukti booking resmi. Jadwal resmi terkunci setelah admin mengonfirmasi ketersediaan dan memverifikasi DP.',
  'Cancel = DP hangus.'
 ];
 catatan.forEach(t=>{const L=doc.splitTextToSize('• '+t,W-28);doc.text(L,14,ny);ny+=L.length*4.5;});

 doc.setDrawColor(...gold);doc.line(14,280,W-14,280);
 doc.setFontSize(8);doc.text('Every story matters!  ·  WhatsApp 089506801472',W/2,285,{align:'center'});
 doc.save(no+'.pdf');
}

$('#invoice').addEventListener('click',()=>{
 const b=getBooking();if(!b)return;
 buatInvoice(b);
 $('#form-status').textContent='Invoice '+b.no+' terunduh. Lampirkan PDF-nya saat mengirim pengajuan di WhatsApp.';
});

$('#booking-form').addEventListener('submit',e=>{
 e.preventDefault();
 const b=getBooking();if(!b)return;
 const link='https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent(bookingMessage(b.c,b.p,b.data)+'\nNo. Invoice: '+b.no);
 $('#whatsapp-result').href=link;$('#whatsapp-result').hidden=false;
 $('#form-status').textContent='Pengajuan siap dibuka di WhatsApp. Jika tab baru tidak terbuka, gunakan tautan di bawah. Ketersediaan tanggal dan DP dikonfirmasi oleh admin.';
 window.open(link,'_blank','noopener,noreferrer');
});
updatePackages();
