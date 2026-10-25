const photo='Foto (Semua File)',raw='all RAW Files available';
export const categories = [
{id:'lamaran',name:'Lamaran',hours:6,deposit:0.5,description:'Dokumentasi momen lamaran yang penuh haru dan kebahagiaan, dikemas secara elegan dan profesional.',packages:[
{name:'Paket 1',price:850000,items:[photo,'150 Foto Edit',raw,'1 Fotografer']},
{name:'Paket 2',price:2000000,items:[photo,'150 Foto Edit',raw,'Video Highlight (1–2 Menit)','1 Fotografer','1 Videografer']},
{name:'Paket 3',price:2300000,items:[photo,'200 Foto Edit',raw,'Video Highlight (3–5 Menit)','1 Fotografer','1 Videografer']}]},
{id:'prewedding',name:'Prewedding',hours:4,deposit:0.5,description:'Abadikan kisah cinta sebelum hari bahagia dengan hasil yang sinematik dan penuh makna.',packages:[
{name:'Paket 1',price:900000,items:[photo,'100 Foto Edit','1 Lokasi']},
{name:'Paket 2',price:2300000,items:[photo,'100 Foto Edit','Video Cinematic (1.5-2 Menit)','1 Lokasi']},
{name:'Paket 3',price:2500000,items:[photo,'100 Foto Edit','Video Cinematic (1.5-2 Menit)','2 Lokasi']}]},
{id:'wedding',name:'Wedding',hours:10,deposit:0.4,description:'Abadikan hari paling bersejarah dalam hidup Anda dengan dokumentasi yang elegan, sinematik, dan penuh makna.',packages:[
{name:'Paket 1',price:1800000,items:[photo,'250 Foto Edit','Akad + Resepsi','2 Fotografer']},
{name:'Paket 2',price:3600000,items:[photo,'200 Foto Edit','Wedding Teaser (1.5-2 Menit)','Akad + Resepsi','2 Fotografer','1 Videografer']},
{name:'Paket 3',price:4000000,items:[photo,'300 Foto Edit','Wedding Teaser + Wedding Clip (3-4 Menit)','Akad + Resepsi','2 Fotografer','1 Videografer']}]},
{id:'ulang-tahun',name:'Ulang Tahun',hours:6,deposit:0.5,description:'Abadikan keceriaan dan kebahagiaan di hari spesial dengan dokumentasi yang hidup dan berkesan.',packages:[
{name:'Paket 1',price:850000,items:[photo,'100 Foto Edit','1 Fotografer']},
{name:'Paket 2',price:2000000,items:[photo,'100 Foto Edit','Video Highlight (2-4 Menit)','1 Fotografer','1 Videografer']}]},
{id:'wisuda',name:'Wisuda',hours:null,deposit:0.5,description:'Abadikan momen penuh perjuangan dan kebanggaan dengan hasil yang profesional dan berkesan.',packages:[
{name:'Paket 1 Personal',price:400000,items:[photo,'1 Wisudawan','100 Foto Edit','1 Fotografer']},
{name:'Paket 2 Family',price:550000,items:[photo,'1 Wisudawan + Keluarga Inti','100 Foto Edit','1 Fotografer']},
{name:'Paket 3 Group',price:600000,items:[photo,'3 Wisudawan max','150 Foto Edit','1 Fotografer']}]},
{id:'aqiqah',name:'Aqiqah',hours:6,deposit:0.5,description:'Dokumentasi momen aqiqah yang penuh makna dengan sentuhan hangat dan natural.',packages:[
{name:'Paket 1',price:850000,items:[photo,'100 Foto Edit','1 Fotografer']},
{name:'Paket 2',price:2000000,items:[photo,'100 Foto Edit','Video Highlight (2-4 Menit)','1 Fotografer','1 Videografer']}]}];
export const money=n=>'Rp'+new Intl.NumberFormat('id-ID').format(n);
export function todayWIB(now=new Date()){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const get=t=>p.find(x=>x.type===t).value;return get('year')+'-'+get('month')+'-'+get('day');}
export function bookingMessage(c,p,d){return ['Halo Ardi Pranata, saya ingin mengajukan booking.','','Nama: '+d.name,'WhatsApp: '+d.phone,'Paket: '+c.name+' — '+p.name,'Harga: '+money(p.price),'DP minimum ('+c.deposit*100+'%): '+money(p.price*c.deposit),'Sisa setelah DP minimum: '+money(p.price*(1-c.deposit)),'Tanggal: '+d.date,'Jam mulai: '+d.time+' WIB',c.hours?'Batas waktu kerja: maksimal '+c.hours+' jam':'Durasi Wisuda: konfirmasi dengan admin','Lokasi: '+d.location,'Catatan: '+(d.notes||'—'),'','Saya memahami bahwa jadwal baru dikonfirmasi setelah ketersediaan dan pembayaran DP diverifikasi admin.'].join('\n');}

export function validateBooking(data, now=new Date()) {
 if(!data.name?.trim()||!data.location?.trim())return 'Nama dan lokasi tidak boleh kosong.';
 if(!/^(?:\+?62|0)\d{8,13}$/.test((data.phone||'').replace(/[\s()-]/g,'')))return 'Masukkan nomor WhatsApp yang valid, diawali 08 atau 62.';
 if(!/^\d{4}-\d{2}-\d{2}$/.test(data.date||'')||!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time||''))return 'Pilih tanggal dan jam acara yang valid.';
 const event=new Date(data.date+'T'+data.time+':00+07:00');
 if(!Number.isFinite(event.getTime())||todayWIB(event)!==data.date)return 'Pilih tanggal acara yang valid.';
 if(event<=now)return 'Waktu acara harus berada di masa mendatang (WIB).';
 return '';
}
