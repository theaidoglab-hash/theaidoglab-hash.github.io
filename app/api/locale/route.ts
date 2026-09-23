import { NextResponse } from 'next/server';
import { isLocale } from '@/lib/i18n';

export function GET(request:Request){
  const url=new URL(request.url);
  const locale=url.searchParams.get('locale')??'';
  if(!isLocale(locale))return Response.json({ok:false},{status:400});
  const requestedPath=url.searchParams.get('next')??`/${locale}`;
  const safePath=requestedPath.startsWith(`/${locale}`)&&!requestedPath.startsWith('//')?requestedPath:`/${locale}`;
  const response=NextResponse.redirect(new URL(safePath,url.origin),303);
  response.cookies.set('aidog_locale',locale,{httpOnly:true,sameSite:'lax',secure:url.protocol==='https:',path:'/',maxAge:31536000});
  return response;
}
