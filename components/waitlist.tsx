'use client';
import Script from 'next/script';
import { useState } from 'react';
import type { CategoryId, Locale } from '@/lib/types';
import { CATEGORY_IDS } from '@/lib/types';
import { categories, ui } from '@/lib/i18n';

export default function Waitlist({locale}:{locale:Locale}){
  const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
  async function submit(formData:FormData){
    setState('sending');
    const body={email:String(formData.get('email')||''),locale,interest:String(formData.get('interest')||'portfolio-evidence') as CategoryId,consent:formData.get('consent')==='on',sourcePath:location.pathname,turnstileToken:String(formData.get('cf-turnstile-response')||'local-preview')};
    const response=await fetch('/api/waitlist',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).catch(()=>null);
    setState(response?.ok?'success':'error');
  }
  return <section className="waitlist"><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload"/><div><p className="eyebrow">FOLLOW THE LIBRARY</p><h2>{ui[locale].waitlist as string}</h2><p>{locale==='en'?'Choose the problem you care about. No CV, employer or free-text profile is collected.':'選擇你最關心的問題。不收集 CV、僱主或自由文字個人資料。'}</p></div>{state==='success'?<p className="success" role="status">{ui[locale].success as string}</p>:<form action={submit}><input name="email" type="email" required maxLength={254} placeholder={ui[locale].email as string}/><select name="interest" defaultValue="portfolio-evidence">{CATEGORY_IDS.map(id=><option key={id} value={id}>{categories[id][locale].name}</option>)}</select><label className="consent"><input name="consent" type="checkbox" required/><span>{ui[locale].consent as string}</span></label><div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}/><button type="submit" disabled={state==='sending'}>{state==='sending'?'…':ui[locale].join as string}</button>{state==='error'&&<p className="error" role="alert">The preview waitlist is not connected yet.</p>}</form>}</section>;
}
