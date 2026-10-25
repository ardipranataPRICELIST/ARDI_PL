import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const allowed=new Set(['index.html','styles.css','app.js','packages.js','config.js']);
http.createServer(async(req,res)=>{
 try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';if(!allowed.has(name)){res.writeHead(404);res.end('Not found');return;}const body=await readFile(path.join(root,name));res.writeHead(200,{'Content-Type':name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8','Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(500);res.end('Server error');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));

