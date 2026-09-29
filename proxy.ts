import { NextResponse, type NextRequest } from 'next/server';
import { createContentSecurityPolicy, createCspNonce } from '@/lib/csp';

export function proxy(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  if (/^\/zh-(?:HK|TW|MO)(?:\/|$)/.test(redirectUrl.pathname)) {
    redirectUrl.pathname = redirectUrl.pathname.replace(/^\/zh-(?:HK|TW|MO)(?=\/|$)/, '/zh-Hant');
    return NextResponse.redirect(redirectUrl, 308);
  }

  // Legacy Traditional-Chinese source assets remain on disk during migration,
  // while every public asset URL uses the canonical neutral locale.
  if (/^\/(?:downloads|templates)\//.test(redirectUrl.pathname)) {
    const sourceAssetPath = redirectUrl.pathname
      .replace(/\/zh-Hant(?=\.|\/|$)/g, '/zh-TW')
      .replace(/\.zh-Hant(?=\.)/g, '.zh-TW');
    if (sourceAssetPath !== redirectUrl.pathname) {
      redirectUrl.pathname = sourceAssetPath;
      return NextResponse.rewrite(redirectUrl);
    }
  }

  const development = process.env.NODE_ENV === 'development';
  const nonce = development ? null : createCspNonce();
  const contentSecurityPolicy = createContentSecurityPolicy(nonce, development);

  // Vinext reads CSP from forwarded request or middleware headers before it
  // serialises React's inline bootstrap/RSC scripts. Set the same policy on
  // both paths so the browser and renderer share one request-scoped nonce.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: ['/', '/:lang', '/:lang/:path*', '/downloads/:path*', '/templates/:path*']
};
