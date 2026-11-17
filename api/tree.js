import {gh,B,ROOT} from './_gh.js';
// Public read: whole repo tree via Git Trees API. Token stays server-side.
export default async(req,res)=>{
 try{
  const t=await gh(`/git/trees/${B}?recursive=1`);
  const pre=ROOT?ROOT+'/':'';
  const items=t.tree.filter(x=>x.path.startsWith(pre)&&x.path.length>pre.length)
   .map(x=>({...x,path:x.path.slice(pre.length)}))
   .filter(x=>!x.path.split('/').some(s=>s[0]==='.')&&x.path!=='README.md')
   .map(x=>({path:x.path,type:x.type==='tree'?'dir':'file',size:x.size||0}));
  res.setHeader('Cache-Control',req.query.fresh?'no-store':'s-maxage=15, stale-while-revalidate=60');
  res.json({items,truncated:!!t.truncated});
 }catch(e){res.status(500).json({error:e.message})}
};
