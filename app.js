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
$('#booking-form').addEventListener('submit',e=>{
 e.preventDefault();updateDateMinimum();
 if(!e.target.reportValidity())return;
 const data=Object.fromEntries(new FormData(e.target));
 const error=validateBooking(data);
 if(error){$('#form-status').textContent=error;return;}
 data.name=data.name.trim();data.location=data.location.trim();
 const [c,p]=selection();
 const link='https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent(bookingMessage(c,p,data));
 $('#whatsapp-result').href=link;$('#whatsapp-result').hidden=false;
 $('#form-status').textContent='Pengajuan siap dibuka di WhatsApp. Jika tab baru tidak terbuka, gunakan tautan di bawah. Ketersediaan tanggal dan DP dikonfirmasi oleh admin.';
 window.open(link,'_blank','noopener,noreferrer');
});
updatePackages();
