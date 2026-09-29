import type { Metadata } from 'next';
import { LOCALES, type Locale } from './types';

const defaultLocale: Locale = 'zh-Hant';

export const socialImage = {
  url: '/ai-dog.png',
  width: 1254,
  height: 1254,
  alt: 'AI.DOG mascot'
} as const;

type PageSocialMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: 'article' | 'website';
};

export function localizedAlternates(path: string): NonNullable<Metadata['alternates']> {
  const suffix = path.replace(/^\/(?:zh-Hant|zh-Hans|en)(?=\/|$)/, '');
  const localizedPath = (locale: Locale) => `/${locale}${suffix}`;

  return {
    canonical: path,
    languages: {
      ...Object.fromEntries(LOCALES.map(locale => [locale, localizedPath(locale)])),
      'x-default': localizedPath(defaultLocale)
    }
  };
}

export function pageSocialMetadata({ title, description, path, type = 'website' }: PageSocialMetadataInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: 'AI.DOG Learning & Portfolio Library',
      images: [socialImage]
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [socialImage.url]
    }
  };
}
