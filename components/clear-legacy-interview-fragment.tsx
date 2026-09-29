'use client';

import { useEffect } from 'react';
import { legacyInterviewPracticePath } from '@/lib/interview-legacy-fragment';
import type { Locale } from '@/lib/types';

export function ClearLegacyInterviewFragment({ locale }: { locale: Locale }) {
  useEffect(() => {
    const match = /^#topic-(\d+)$/.exec(window.location.hash);
    if (!match) return;
    const path = legacyInterviewPracticePath(locale, match[1]);
    if (!path) return;
    window.location.replace(path);
  }, [locale]);

  return null;
}
