import fs from 'node:fs';
import path from 'node:path';

const articles=JSON.parse(fs.readFileSync(path.join(process.cwd(),'content','articles.json'),'utf8'));
const startingPoints=JSON.parse(fs.readFileSync(path.join(process.cwd(),'content','learning-evidence-starting-points.json'),'utf8'));
const roadmap=JSON.parse(fs.readFileSync(path.join(process.cwd(),'content','roadmaps','ai-engineer-roadmap.json'),'utf8'));
const roadmapReferenceUrl=roadmap?.sourceNote?.reference?.url;
const urls=[...new Set(articles.flatMap(article=>[
  ...article.sourceUrls,
  ...(article.portfolioRepository ? [article.portfolioRepository.url, ...Object.values(article.portfolioRepository.readmeUrls)] : [])
]).concat(
  startingPoints.sources.map(source=>source.officialUrl),
  typeof roadmapReferenceUrl==='string' ? [roadmapReferenceUrl] : []
))];
const httpFailures=[];
const transportFailures=[];

for(const url of urls){
  let parsed;
  try{parsed=new URL(url);}catch{httpFailures.push(`${url} (invalid URL)`);continue;}
  if(parsed.protocol!=='https:'){httpFailures.push(`${url} (HTTPS required)`);continue;}
  try{
    const response=await fetch(url,{method:'GET',redirect:'follow',headers:{'user-agent':'AI.DOG release source validator'},signal:AbortSignal.timeout(15000)});
    if(!response.ok) httpFailures.push(`${url} (${response.status})`);
    await response.body?.cancel();
  }catch(error){
    const message=error instanceof Error?error.message:'request failed';
    transportFailures.push(`${url} (${message})`);
  }
}

if(transportFailures.length===urls.length){
  throw new Error(`Source validation could not reach any of ${urls.length} URLs. No source status was established; this is a network-environment failure, not evidence that every link is broken. Run this check from an approved networked release environment.\n${transportFailures.join('\n')}`);
}

if(httpFailures.length||transportFailures.length){
  const sections=[];
  if(httpFailures.length) sections.push(`HTTP or URL failures:\n${httpFailures.join('\n')}`);
  if(transportFailures.length) sections.push(`Transport failures (status not established):\n${transportFailures.join('\n')}`);
  throw new Error(`Source validation incomplete:\n${sections.join('\n')}`);
}
console.log(`Validated ${urls.length} source URLs.`);
