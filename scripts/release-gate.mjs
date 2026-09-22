import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const articles=JSON.parse(fs.readFileSync(path.join(root,'content','articles.json'),'utf8'));
const pending=articles.filter(article=>article.status!=='approved').map(article=>article.id);

if(process.env.OWNER_PUBLICATION_APPROVED!=='true') throw new Error('Release blocked: OWNER_PUBLICATION_APPROVED=true is required after explicit owner approval.');
if(pending.length) throw new Error(`Release blocked: articles pending approval: ${pending.join(', ')}`);
if(!process.env.SITE_ORIGIN||/localhost|preview\.invalid/.test(process.env.SITE_ORIGIN)) throw new Error('Release blocked: set the approved production SITE_ORIGIN.');
if(!process.env.PRIVACY_EMAIL) throw new Error('Release blocked: set the approved brand privacy email.');
console.log('Release gate passed.');
