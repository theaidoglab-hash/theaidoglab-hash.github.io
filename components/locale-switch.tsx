'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ui } from '@/lib/i18n';
import { LOCALES, type Locale } from '@/lib/types';

const languageNavigationLabel: Record<Locale, string> = {
  'zh-Hant': '選擇語言',
  'zh-Hans': '选择语言',
  en: 'Choose language'
};

const staticHosting = process.env.NEXT_PUBLIC_STATIC_HOSTING === 'true';

function pathFor(pathname:string,target:Locale){
  const parts=pathname.split('/');
  if(parts.length>1&&LOCALES.includes(parts[1] as Locale))parts[1]=target;
  else return `/${target}`;
  return parts.join('/')||`/${target}`;
}

function localeRedirectHref(pathname: string, target: Locale, locationSuffix = '') {
  const next = `${pathFor(pathname, target)}${locationSuffix}`;
  return staticHosting ? next : `/api/locale?locale=${target}&next=${encodeURIComponent(next)}`;
}

type NavigationItem = {
  href: string;
  label: string;
};

type NavigationGroup = {
  label: string;
  links: NavigationItem[];
};

function navigationFamily(path: string) {
  const segments = path.split(/[?#]/, 1)[0].split('/').filter(Boolean);
  const section = segments[1] ?? 'home';
  const child = segments[2];

  if (section === 'articles' || section === 'categories' || section === 'downloads') return 'resources';
  if (section === 'coding-starter-lab' || section === 'no-code-starter-lab') return 'labs';
  if (section === 'series') return child ? `series/${child}` : 'series';
  return section;
}

function isCurrentNavigationPath(pathname: string, href: string) {
  return navigationFamily(pathname) === navigationFamily(href);
}

export function NavigationLink({ href, label }: NavigationItem) {
  const pathname = usePathname();
  const isCurrent = isCurrentNavigationPath(pathname, href);
  return <Link href={href} aria-label={label} aria-current={isCurrent ? 'page' : undefined}>{label}</Link>;
}

export function DesktopNavigationMore({ summary, navigationLabel, groups }: {
  summary: string;
  navigationLabel: string;
  groups: NavigationGroup[];
}) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const links = groups.flatMap(group => group.links);
  const activeLink = links.find(link => isCurrentNavigationPath(pathname, link.href));

  useEffect(() => {
    menuRef.current?.removeAttribute('open');
  }, [pathname]);

  return <details className="site-nav-more" data-current={activeLink ? true : undefined} ref={menuRef} suppressHydrationWarning>
    <summary aria-current={activeLink ? 'page' : undefined} aria-label={activeLink ? `${summary}: ${activeLink.label}` : summary}>{summary}</summary>
    <div
      role="group"
      aria-label={navigationLabel}
      onClick={(event) => {
        if ((event.target as Element).closest('a[href]')) menuRef.current?.removeAttribute('open');
      }}
    >
      {groups.map(group => <div className="site-nav-more-group" key={group.label} role="group" aria-label={group.label}>
        <span>{group.label}</span>
        {group.links.map(link => <NavigationLink key={link.href} {...link} />)}
      </div>)}
    </div>
  </details>;
}

export function MobileNavigation({ summary, navigationLabel, moreLabel, primaryLinks, moreGroups }: {
  summary: string;
  navigationLabel: string;
  moreLabel: string;
  primaryLinks: NavigationItem[];
  moreGroups: NavigationGroup[];
}) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    menuRef.current?.removeAttribute('open');
  }, [pathname]);

  return <details className="mobile-menu" ref={menuRef} suppressHydrationWarning>
    <summary>{summary}</summary>
    <nav
      aria-label={navigationLabel}
      onClick={(event) => {
        if ((event.target as Element).closest('a[href]')) menuRef.current?.removeAttribute('open');
      }}
    >
      {primaryLinks.map(link => <NavigationLink key={link.href} {...link} />)}
      {moreGroups.length ? <span className="mobile-menu-section">{moreLabel}</span> : null}
      {moreGroups.map(group => <div className="mobile-menu-group" key={group.label} role="group" aria-label={group.label}>
        <span>{group.label}</span>
        {group.links.map(link => <NavigationLink key={link.href} {...link} />)}
      </div>)}
    </nav>
  </details>;
}

export function LocaleSwitch({locale,expanded=false}:{locale:Locale;expanded?:boolean}){
  const pathname=usePathname();
  const [locationSearch, setLocationSearch] = useState('');
  const [locationHash, setLocationHash] = useState('');
  useLayoutEffect(()=>{document.documentElement.lang=locale;},[locale]);
  useLayoutEffect(() => {
    const syncLocation = () => {
      setLocationSearch(window.location.search);
      setLocationHash(window.location.hash);
    };
    syncLocation();
    const frame = window.requestAnimationFrame(syncLocation);
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('aidog:url-state-change', syncLocation);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('aidog:url-state-change', syncLocation);
    };
  }, [pathname]);
  const locationSuffix = `${locationSearch}${locationHash}`;
  return <nav className={expanded?'article-languages':'languages'} aria-label={languageNavigationLabel[locale]}>{LOCALES.map(target=>{
    const syncCurrentLocation = (anchor: HTMLAnchorElement) => {
      anchor.setAttribute('href', localeRedirectHref(pathname, target, `${window.location.search}${window.location.hash}`));
    };
    return <a
      key={target}
      className={target===locale?'active':''}
      aria-current={target===locale?'page':undefined}
      href={localeRedirectHref(pathname, target, locationSuffix)}
      hrefLang={target}
      lang={target}
      onPointerDown={event => syncCurrentLocation(event.currentTarget)}
      onFocus={event => syncCurrentLocation(event.currentTarget)}
      onClick={event => {
        if (staticHosting) window.localStorage.setItem('aidog_locale', target);
        syncCurrentLocation(event.currentTarget);
      }}
    >{expanded?ui[target].name as string:ui[target].shortName as string}</a>;
  })}</nav>;
}
