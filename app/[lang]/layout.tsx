import { notFound } from 'next/navigation';
import { Footer, Header } from '@/components/site';
import { isLocale } from '@/lib/i18n';
import { LOCALES } from '@/lib/types';
export function generateStaticParams(){return LOCALES.map(lang=>({lang}));}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(!isLocale(lang))notFound();return <><Header locale={lang}/><main>{children}</main><Footer locale={lang}/></>}
