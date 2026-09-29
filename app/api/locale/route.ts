import { NextResponse } from 'next/server';
import { isLocale } from '@/lib/i18n';

export function GET(request:Request){
  const url=new URL(request.url);
  const requestedLocale=url.searchParams.get('locale')??'';
  const locale=requestedLocale==='zh-HK'||requestedLocale==='zh-TW'||requestedLocale==='zh-MO'?'zh-Hant':requestedLocale;
  if(!isLocale(locale))return Response.json({ok:false},{status:400});
  const requestedPath=(url.searchParams.get('next')??`/${locale}`).replace(/^\/zh-(?:HK|TW|MO)(?=\/|$)/,`/${locale}`);
  const safePath=requestedPath.startsWith(`/${locale}`)&&!requestedPath.startsWith('//')?requestedPath:`/${locale}`;
  const response=NextResponse.redirect(new URL(safePath,url.origin),303);
  response.cookies.set('aidog_locale',locale,{httpOnly:true,sameSite:'lax',secure:url.protocol==='https:',path:'/',maxAge:31536000});
  return response;
}
