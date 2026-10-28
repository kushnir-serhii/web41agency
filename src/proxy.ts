import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { resolveHomeRedirect } from './i18n/detectLocale';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);
const VARY_VALUE = 'Accept-Language, Cookie';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== '/') return handleI18nRouting(request);

  const target = resolveHomeRedirect({
    pathname,
    cookieLocale: request.cookies.get('NEXT_LOCALE')?.value,
    acceptLanguage: request.headers.get('accept-language'),
  });
  if (target) {
    const redirect = NextResponse.redirect(new URL(`/${target}`, request.url), 307);
    redirect.headers.set('Vary', VARY_VALUE);
    return redirect;
  }
  const response = handleI18nRouting(request);
  response.headers.set('Vary', VARY_VALUE);
  return response;
}

export const config = { matcher: '/((?!api|_next|_vercel|.*\\..*).*)' };
