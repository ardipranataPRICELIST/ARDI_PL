import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {categories,todayWIB,validateBooking,bookingMessage} from '../packages.js';
import {config} from '../config.js';
test('All 16 original package prices preserved',()=>assert.deepEqual(categories.map(c=>c.packages.map(p=>p.price)),[[850000,2000000,2300000],[900000,2300000,2500000],[1800000,3600000,4000000],[850000,2000000],[400000,550000,600000],[850000,2000000]]));
test('Duration and down payment rules preserved',()=>{
 assert.deepEqual(categories.map(c=>c.hours),[6,4,10,6,null,6]);
 for(const c of categories)assert.equal(c.deposit,c.id==='wedding'?.4:.5);
 assert.equal(categories[2].packages[2].price*categories[2].deposit,1600000);
 assert.equal(categories[0].packages[0].price*categories[0].deposit,425000);
});
test('Important package differences preserved',()=>{
 assert.deepEqual(categories[2].packages.map(p=>p.items[1]),['250 Foto Edit','200 Foto Edit','300 Foto Edit']);
 for(const p of categories[0].packages)assert.ok(p.items.includes('all RAW Files available'));
 assert.ok(categories[4].packages[2].items.includes('3 Wisudawan max'));
});
test('WIB date boundary',()=>{
 assert.equal(todayWIB(new Date('2026-10-25T17:30:00Z')),'2026-10-26');
 assert.equal(todayWIB(new Date('2026-10-25T16:59:00Z')),'2026-10-25');
});
const now=new Date('2026-10-25T03:00:00Z');
const data={name:'A & B',phone:'089506801472',date:'2026-11-15',time:'08:00',location:'Gedung #1',notes:'A+B'};
test('Future booking allowed without external availability service',()=>assert.equal(validateBooking(data,now),''));
test('Past, empty, impossible dates and invalid times rejected',()=>{
 for(const date of ['2026-10-24','2026-02-30','2026-13-01','', 'invalid'])assert.notEqual(validateBooking({...data,date},now),'');
 for(const time of ['','24:00','12:60'])assert.notEqual(validateBooking({...data,time},now),'');
 assert.notEqual(validateBooking({...data,date:'2026-10-25',time:'09:59'},now),'');
 assert.equal(validateBooking({...data,date:'2026-10-25',time:'10:01'},now),'');
});
test('Names, phone numbers and locations validated',()=>{
 for(const override of [{name:' '},{location:' '},{phone:'abc'},{phone:''},{phone:'123'}])assert.notEqual(validateBooking({...data,...override},now),'');
 assert.equal(validateBooking({...data,phone:'+62 895-0680-1472'},now),'');
});
test('WhatsApp recipient and full message correct',()=>{
 assert.equal(config.whatsapp,'6289506801472');
 const c=categories[2],msg=bookingMessage(c,c.packages[2],data);
 assert.match(msg,/40%.*Rp1.600.000/);assert.match(msg,/maksimal 10 jam/);assert.match(msg,/08:00 WIB/);
 assert.match(msg,/diverifikasi admin/);
 const url=new URL('https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent(msg));
 assert.equal(url.searchParams.get('text'),msg);
 assert.match(msg,/A & B/);assert.match(msg,/Gedung #1/);
});
test('No external calendar integration remains in shipped UI',()=>{
 for(const file of ['app.js','config.js','index.html']) {
  const source=readFileSync(new URL('../'+file,import.meta.url),'utf8');
  assert.doesNotMatch(source,/Google Calendar|calendarEndpoint|script.google.com|fetch\(/i);
 }
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/name="date" type="date" required/);
 assert.doesNotMatch(html,/class="button burgundy" disabled/);
 assert.match(html,/Ketersediaan jadwal akan dikonfirmasi admin melalui WhatsApp/);
});

