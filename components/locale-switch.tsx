'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ui } from '@/lib/i18n';
import { LOCALES, type Locale } from '@/lib/types';

function pathFor(pathname:string,target:Locale){
  const parts=pathname.split('/');
  if(parts.length>1&&LOCALES.includes(parts[1] as Locale))parts[1]=target;
  else return `/${target}`;
  return parts.join('/')||`/${target}`;
}

export function LocaleSwitch({locale,expanded=false}:{locale:Locale;expanded?:boolean}){
  const pathname=usePathname();
  useEffect(()=>{document.documentElement.lang=locale;},[locale]);
  return <div className={expanded?'article-languages':'languages'} aria-label="Language">{LOCALES.map(target=>{const next=pathFor(pathname,target);return <Link key={target} className={target===locale?'active':''} href={`/api/locale?locale=${target}&next=${encodeURIComponent(next)}`} hrefLang={target} lang={target} prefetch={false}>{expanded?ui[target].name as string:ui[target].shortName as string}</Link>;})}</div>;
}
