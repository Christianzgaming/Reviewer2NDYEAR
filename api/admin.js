import crypto from 'node:crypto';
import {gh,B,clean as c0,R_} from './_gh.js';
const clean=p=>R_(c0(p));
const sec=()=>process.env.SESSION_SECRET||'';
const sign=s=>crypto.createHmac('sha256',sec()).update(s).digest('hex');
const eq=(a,b)=>{a=Buffer.from(a);b=Buffer.from(b);return a.length===b.length&&crypto.timingSafeEqual(a,b)};
const mk=()=>{const e=Date.now()+8*36e5;return e+'.'+sign(''+e)};
const ok=t=>{const[e,s]=String(t||'').split('.');return !!(sec()&&e&&s&&+e>Date.now()&&eq(sign(e),s))};
const J=o=>JSON.stringify(o);
// One atomic commit via Git Data API. mut(treeEntries) -> entries to apply.
async function commit(mut,msg){
 const head=(await gh(`/git/ref/heads/${B}`)).object.sha,c=await gh(`/git/commits/${head}`);
 const t=await gh(`/git/trees/${c.tree.sha}?recursive=1`),entries=await mut(t.tree);
 if(!entries.length)throw new Error('Nothing matched that path');
 const nt=await gh('/git/trees',{method:'POST',body:J({base_tree:c.tree.sha,tree:entries})});
 const nc=await gh('/git/commits',{method:'POST',body:J({message:msg,tree:nt.sha,parents:[head]})});
 await gh(`/git/refs/heads/${B}`,{method:'PATCH',body:J({sha:nc.sha})});
}
const under=(t,p)=>t.filter(x=>x.type==='blob'&&(x.path===p||x.path.startsWith(p+'/')));
export default async(req,res)=>{
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const b=req.body||{};
 try{
  if(b.action==='login'){
   const pw=process.env.ADMIN_PASSWORD||'';
   const good=pw&&eq(crypto.createHash('sha256').update(String(b.password||'')).digest('hex'),crypto.createHash('sha256').update(pw).digest('hex'));
   if(!good){await new Promise(r=>setTimeout(r,800));return res.status(401).json({error:'Unauthorized: wrong password'})}
   return res.json({token:mk()});
  }
  if(!ok(req.headers['x-admin-token']))return res.status(401).json({error:'Unauthorized: please sign in again'});
  if(b.action==='put'){ // upload / create / edit any file (base64)
   const p=clean(b.path),blob=await gh('/git/blobs',{method:'POST',body:J({content:b.content||'',encoding:'base64'})});
   await commit(async()=>[{path:p,mode:'100644',type:'blob',sha:blob.sha}],`Update ${p}`);
  }else if(b.action==='mkdir'){
   const p=clean(b.path)+'/.gitkeep',blob=await gh('/git/blobs',{method:'POST',body:J({content:'',encoding:'utf-8'})});
   await commit(async()=>[{path:p,mode:'100644',type:'blob',sha:blob.sha}],`Create folder ${b.path}`);
  }else if(b.action==='delete'){
   const p=clean(b.path);
   await commit(async t=>under(t,p).map(x=>({path:x.path,mode:x.mode,type:'blob',sha:null})),`Delete ${p}`);
  }else if(b.action==='rename'){
   const f=clean(b.from),to=clean(b.to);
   await commit(async t=>under(t,f).flatMap(x=>[{path:to+x.path.slice(f.length),mode:x.mode,type:'blob',sha:x.sha},{path:x.path,mode:x.mode,type:'blob',sha:null}]),`Rename ${f} -> ${to}`);
  }else return res.status(400).json({error:'Unknown action'});
  res.json({ok:true});
 }catch(e){res.status(400).json({error:e.message})}
};
