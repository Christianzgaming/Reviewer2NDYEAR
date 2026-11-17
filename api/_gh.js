const {GITHUB_TOKEN:T,GITHUB_OWNER:O,GITHUB_REPO:R,GITHUB_BRANCH:B='main'}=process.env;
export {T,O,R,B};
export const H=(x={})=>({Authorization:`Bearer ${T}`,'User-Agent':'academic-archive','Accept':'application/vnd.github+json',...x});
export const gh=async(p,o={})=>{const r=await fetch(`https://api.github.com/repos/${O}/${R}${p}`,{...o,headers:H(o.headers)});
 if(!r.ok)throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0,160)}`);return r.status===204?null:r.json()};
export const clean=p=>{p=String(p||'').replace(/^\/+|\/+$/g,'');
 if(!p||p.split('/').some(s=>!s||s==='..'||(s[0]==='.'&&s!=='.gitkeep')))throw new Error('Bad path');return p};
export const ROOT=(process.env.CONTENT_ROOT??'Reviewer').replace(/^\/+|\/+$/g,'');
export const R_=p=>ROOT?(p?ROOT+'/'+p:ROOT):p; // map site path -> repo path
