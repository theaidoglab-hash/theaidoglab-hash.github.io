import { toLiveInterviewPracticeTopics } from '@/lib/interview-live-practice-topics';
import { isLocale } from '@/lib/i18n';
import { getReleaseScopedInterviewTopics } from '@/lib/release-learning-content';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';

/**
 * This endpoint is an on-demand projection for the optional client-only
 * rehearsal panel. It never exposes the full topic object or a release
 * manifest, and it applies the same scoped selection as the question pages.
 */
export function GET(request: Request) {
  if (!isRouteSurfaceEnabledInCurrentBuild('interview-lab')) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const locale = new URL(request.url).searchParams.get('locale');
  if (!locale || !isLocale(locale)) {
    return Response.json({ error: 'Invalid locale' }, { status: 400 });
  }

  return Response.json(
    { topics: toLiveInterviewPracticeTopics(locale, getReleaseScopedInterviewTopics()) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
