/* Bookbind tests: engine vs tests/expected.json (python oracle) + invariants. */
'use strict';
const fs=require('fs'),path=require('path');
const B=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a).slice(0,180)+' want '+JSON.stringify(b).slice(0,180));}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it.args);
  let r;
  if(it.kind==='impose')r=B.impose(it.args[0],it.args[1]);
  else if(it.kind==='thread')r=B.threadCm(it.args[0],it.args[1]);
  else r=B.boardMm(it.args[0],it.args[1],it.args[2],it.args[3]);
  if(JSON.stringify(r)===JSON.stringify(it.oracle))ok(); else bad(T,r,it.oracle);
}
/* invariants on several impositions: every padded page appears exactly once,
   front-right + back-left are consecutive, and sheet fronts descend correctly */
for(const [t,s] of [[50,16],[40,16],[33,8],[64,16],[12,4]]){
  const r=B.impose(t,s);
  const seen={};
  let good=!!r;
  if(r){
    for(const sig of r.signatures){
      for(const sh of sig.sheets){
        for(const p of [sh.front[0],sh.front[1],sh.back[0],sh.back[1]]){
          if(seen[p])good=false; seen[p]=1;
        }
        if(sh.back[0]!==sh.front[1]+1)good=false;
        if(sh.front[0]!==sh.back[1]+1)good=false;
      }
      for(let p=sig.startPage;p<sig.startPage+sig.paddedPages;p++)if(!seen[p])good=false;
    }
  }
  if(good)pass++; else bad('invariant '+t+'/'+s,r,'pages unique + consecutive');
}
/* known reference: 16-page signature sheet 2 = front [14,3], back [4,13] */
const k=B.impose(16,16);
if(k&&JSON.stringify(k.signatures[0].sheets[1])==='{"sheet":2,"front":[14,3],"back":[4,13]}')pass++;
else bad('ref sig16 sheet2',k&&k.signatures[0].sheets[1],'[14,3]/[4,13]');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
