import { NextRequest, NextResponse } from 'next/server';
import { detectLocale } from '@/lib/i18n';

export function GET(request:NextRequest){
  const locale=detectLocale(request.headers.get('accept-language'),request.cookies.get('aidog_locale')?.value);
  const response=NextResponse.redirect(new URL(`/${locale}`,request.url),307);
  response.headers.set('Cache-Control','private, no-store');
  response.headers.set('Vary','Accept-Language, Cookie');
  return response;
}
