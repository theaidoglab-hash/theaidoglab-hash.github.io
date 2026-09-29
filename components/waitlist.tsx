'use client';
import Script from 'next/script';
import { useState } from 'react';
import type { CategoryId, Locale } from '@/lib/types';
import { ui } from '@/lib/i18n';

type WaitlistProps = { locale: Locale; turnstileSiteKey: string; collectionEnabled: boolean };

function pausedCopy(locale: Locale) {
  if (locale === 'en') return { title: 'Email updates are not open yet', body: 'This preview does not collect email addresses. The library remains available to read while the privacy and operating process is reviewed.' };
  if (locale === 'zh-Hans') return { title: '邮件通知尚未开放', body: '这个预览不会收集电子邮箱。资源仍可直接阅读，等待隐私与运营流程完成审核后才会开放登记。' };
  if (locale === 'zh-Hant') return { title: '電子郵件通知尚未開放', body: '這個預覽不會收集電子郵件。資源仍可直接閱讀，等待隱私與營運流程完成審核後才會開放登記。' };
  return { title: '電郵通知未開放', body: '呢個預覽唔會收集電郵。資源仍可直接閱讀，等私隱同營運流程完成審閱先會開放登記。' };
}

function activeCopy(locale: Locale) {
  if (locale === 'en') return { eyebrow: 'FOLLOW THE LIBRARY', interestPlaceholder: 'Choose what you want to do next', error: 'The waitlist could not be reached. Please try again later.' };
  if (locale === 'zh-Hans') return { eyebrow: '关注资源库', interestPlaceholder: '选择你下一步想完成的事', error: '暂时无法连接通知登记，请稍后再试。' };
  if (locale === 'zh-Hant') return { eyebrow: '追蹤資源庫', interestPlaceholder: '選擇你下一步想完成的事', error: '暫時無法連接通知登記，請稍後再試。' };
  return { eyebrow: '追蹤資源庫', interestPlaceholder: '揀你最關心嘅方向', error: '暫時連唔到通知登記，請稍後再試。' };
}

function learnerGoals(locale: Locale): Array<{ value: CategoryId; label: string }> {
  if (locale === 'en') return [
    { value: 'ai-engineering-career', label: 'Choose an AI career direction' },
    { value: 'ai-engineering-foundations', label: 'Learn AI engineering foundations' },
    { value: 'low-code-ai-builders', label: 'Build a first no-code workflow' },
    { value: 'portfolio-evidence', label: 'Turn practice into portfolio evidence' },
    { value: 'ai-engineering-interviews', label: 'Prepare for interviews' },
  ];
  if (locale === 'zh-Hans') return [
    { value: 'ai-engineering-career', label: '选择 AI 职业方向' },
    { value: 'ai-engineering-foundations', label: '学习 AI 工程基础' },
    { value: 'low-code-ai-builders', label: '完成第一个无代码 workflow' },
    { value: 'portfolio-evidence', label: '把练习整理成作品集证据' },
    { value: 'ai-engineering-interviews', label: '准备面试' },
  ];
  return [
    { value: 'ai-engineering-career', label: '選擇 AI 職涯方向' },
    { value: 'ai-engineering-foundations', label: '學習 AI 工程基礎' },
    { value: 'low-code-ai-builders', label: '完成第一個無程式 workflow' },
    { value: 'portfolio-evidence', label: '把練習整理成作品集證據' },
    { value: 'ai-engineering-interviews', label: '準備面試' },
  ];
}

export default function Waitlist({ locale, turnstileSiteKey, collectionEnabled }: WaitlistProps){
  const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const copy = activeCopy(locale);
  const goals = learnerGoals(locale);
  async function submit(formData:FormData){
    setState('sending');
    const body={email:String(formData.get('email')||''),locale,interest:String(formData.get('interest')||'') as CategoryId,consent:formData.get('consent')==='on',turnstileToken:String(formData.get('cf-turnstile-response')||'local-preview')};
    const response=await fetch('/api/waitlist',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).catch(()=>null);
    setState(response?.ok?'success':'error');
  }
  const intro=locale==='en'?'Choose the problem you care about. No CV, employer or free-text profile is collected.':locale==='zh-Hans'?'选择你最关心的问题。我们不会收集简历、雇主或自由文本个人资料。':locale==='zh-Hant'?'選擇你最關心的問題。我們不會收集履歷、雇主或自由文字個人資料。':'選擇你最關心的問題。不收集 CV、僱主或自由文字個人資料。';
  if (!collectionEnabled) {
    const paused = pausedCopy(locale);
    return <section className="waitlist waitlist-paused"><div><p className="eyebrow">{copy.eyebrow}</p><h2>{paused.title}</h2><p>{paused.body}</p></div></section>;
  }
  return <section className="waitlist"><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload"/><div><p className="eyebrow">{copy.eyebrow}</p><h2>{ui[locale].waitlist as string}</h2><p>{intro}</p></div>{state==='success'?<p className="success" role="status">{ui[locale].success as string}</p>:<form action={submit}><label><span className="sr-only">{ui[locale].email as string}</span><input name="email" type="email" required maxLength={254} placeholder={ui[locale].email as string}/></label><label><span className="sr-only">{locale === 'en' ? 'Learning goal' : locale === 'zh-Hans' ? '学习目标' : '學習目標'}</span><select name="interest" required defaultValue=""><option value="" disabled>{copy.interestPlaceholder}</option>{goals.map(goal=><option key={goal.value} value={goal.value}>{goal.label}</option>)}</select></label><label className="consent"><input name="consent" type="checkbox" required/><span>{ui[locale].consent as string}</span></label><div className="cf-turnstile" data-sitekey={turnstileSiteKey}/><button type="submit" disabled={state==='sending'}>{state==='sending'?'…':ui[locale].join as string}</button>{state==='error'&&<p className="error" role="alert">{copy.error}</p>}</form>}</section>;
}
