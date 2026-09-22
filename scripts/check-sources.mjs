import fs from 'node:fs';
import path from 'node:path';

const articles=JSON.parse(fs.readFileSync(path.join(process.cwd(),'content','articles.json'),'utf8'));
const urls=[...new Set(articles.flatMap(article=>article.sourceUrls))];
const failures=[];

for(const url of urls){
  let parsed;
  try{parsed=new URL(url);}catch{failures.push(`${url} (invalid URL)`);continue;}
  if(parsed.protocol!=='https:'){failures.push(`${url} (HTTPS required)`);continue;}
  try{
    const response=await fetch(url,{method:'GET',redirect:'follow',headers:{'user-agent':'AI.DOG release source validator'},signal:AbortSignal.timeout(15000)});
    if(!response.ok) failures.push(`${url} (${response.status})`);
    await response.body?.cancel();
  }catch(error){failures.push(`${url} (${error instanceof Error?error.message:'request failed'})`);}
}

if(failures.length) throw new Error(`Source validation failed:\n${failures.join('\n')}`);
console.log(`Validated ${urls.length} source URLs.`);
