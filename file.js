import {O,R,B,H,clean} from './_gh.js';
const MT={html:'text/html',htm:'text/html',pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',txt:'text/plain',md:'text/plain',css:'text/css',js:'text/plain'};
export default async(req,res)=>{
 try{
  const p=clean(req.query.path),url=`https://api.github.com/repos/${O}/${R}/contents/${p.split('/').map(encodeURIComponent).join('/')}?ref=${B}`;
  const r=await fetch(url,{headers:H({Accept:'application/vnd.github.raw+json'})});
  if(!r.ok)return res.status(r.status).json({error:r.status===404?'File not found':'GitHub error '+r.status});
  const ext=p.split('.').pop().toLowerCase();
  res.setHeader('Content-Type',(MT[ext]||'application/octet-stream')+(MT[ext]?.startsWith('text')?'; charset=utf-8':''));
  // Repo HTML is untrusted-ish: sandbox it so direct visits can't touch this origin.
  res.setHeader('Content-Security-Policy','sandbox allow-scripts allow-forms allow-popups');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.query.dl)res.setHeader('Content-Disposition',`attachment; filename="${encodeURIComponent(p.split('/').pop())}"`);
  res.setHeader('Cache-Control',req.query.fresh?'no-store':'s-maxage=30, stale-while-revalidate=120');
  res.send(Buffer.from(await r.arrayBuffer()));
 }catch(e){res.status(400).json({error:e.message})}
};
