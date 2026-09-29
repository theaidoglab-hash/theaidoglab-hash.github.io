import type { InterviewCapabilityGroup, InterviewTopic } from './interview-lab';
import type {
  AiEngineerInterviewPrep,
  AiEngineerRoadmap,
  InterviewPrepTrack,
  RoadmapResource,
  RoadmapStage,
} from './roadmaps';
import type { RuntimeReleaseScope } from './release-runtime-scope';

export type InterviewLabPublicationState = Readonly<{
  status: 'review' | 'approved';
  visibility: 'public' | 'internal';
}>;

function selectedIds(
  values: readonly string[],
): ReadonlySet<string> {
  return new Set(values);
}

function isResourceAvailableInScope(
  resource: RoadmapResource,
  scope: RuntimeReleaseScope,
): boolean {
  if (resource.kind === 'article') return scope.selection.articles.includes(resource.target);
  if (resource.kind === 'interview-question') return scope.selection.interviewTopics.includes(resource.target);
  if (resource.kind === 'interview-prep') {
    return scope.selection.interviewPrepTracks.length > 0
      && scope.selection.routeSurfaces.includes('interview-lab');
  }
  if (resource.target === 'build-lab') return scope.selection.labs.includes(resource.target);
  if (resource.target === 'coding-starter-lab') return scope.selection.routeSurfaces.includes('coding-starter-lab');
  return false;
}

function selectedResources(
  resources: readonly RoadmapResource[],
  scope: RuntimeReleaseScope | null,
): RoadmapResource[] {
  if (scope === null) return [...resources];
  return resources.filter(resource => isResourceAvailableInScope(resource, scope));
}

function selectedRoadmapStages(
  stages: readonly RoadmapStage[],
  scope: RuntimeReleaseScope,
): RoadmapStage[] {
  const ids = selectedIds(scope.selection.roadmapStages);
  return stages
    .filter(stage => ids.has(stage.id))
    .map(stage => ({ ...stage, resources: selectedResources(stage.resources, scope) }));
}

function selectedInterviewPrepTracks(
  tracks: readonly InterviewPrepTrack[],
  scope: RuntimeReleaseScope,
): InterviewPrepTrack[] {
  const ids = selectedIds(scope.selection.interviewPrepTracks);
  return tracks
    .filter(track => ids.has(track.id))
    .map(track => ({ ...track, resources: selectedResources(track.resources, scope) }));
}

/**
 * Local review receives the complete roadmap. An active scoped release gets
 * only explicit approved stages, the phases containing those stages, and the
 * links whose own target has also been selected. This is defence in depth for
 * the catalog preflight: an invalid manifest produces fewer links, never a
 * broad learning map.
 */
export function selectRoadmapForReleaseScope(
  roadmap: AiEngineerRoadmap,
  scope: RuntimeReleaseScope | null,
): AiEngineerRoadmap | null {
  if (scope === null) return roadmap;
  if (roadmap.status !== 'approved' || roadmap.visibility !== 'public') return null;

  const stages = selectedRoadmapStages(roadmap.stages, scope);
  if (!stages.length) return null;
  const phaseIds = new Set(stages.map(stage => stage.phase));
  const selectedStageIds = new Set(stages.map(stage => stage.id));
  const phases = roadmap.phases.filter(phase => phaseIds.has(phase.id));
  const routes = roadmap.selfLearning.routes.filter(route => selectedStageIds.has(route.startStage));

  return {
    ...roadmap,
    phases,
    stages,
    selfLearning: { ...roadmap.selfLearning, routes },
  };
}

/**
 * Prep-track publication follows the owning Interview Prep map, not the
 * learner-facing `available` flag on an individual track.
 */
export function selectInterviewPrepForReleaseScope(
  prep: AiEngineerInterviewPrep,
  scope: RuntimeReleaseScope | null,
): AiEngineerInterviewPrep | null {
  if (scope === null) return prep;
  if (prep.status !== 'approved' || prep.visibility !== 'public') return null;

  const tracks = selectedInterviewPrepTracks(prep.tracks, scope);
  if (!tracks.length) return null;
  return { ...prep, tracks };
}

/**
 * Question pages have a separate publication owner from their teaching
 * metadata. A public scope must satisfy both that owner state and the exact
 * topic list; a selection never promotes a review-stage question by itself.
 */
export function selectInterviewTopicsForReleaseScope(
  topics: readonly InterviewTopic[],
  publication: InterviewLabPublicationState,
  scope: RuntimeReleaseScope | null,
): InterviewTopic[] {
  if (scope === null) return [...topics];
  if (publication.status !== 'approved' || publication.visibility !== 'public') return [];
  const slugs = selectedIds(scope.selection.interviewTopics);
  return topics.filter(topic => slugs.has(topic.slug));
}

export function selectInterviewCapabilityGroups(
  groups: readonly InterviewCapabilityGroup[],
  topics: readonly InterviewTopic[],
): InterviewCapabilityGroup[] {
  const numbers = new Set(topics.map(topic => topic.number));
  return groups.flatMap(group => {
    const topicNumbers = group.topicNumbers.filter(number => numbers.has(number));
    return topicNumbers.length ? [{ ...group, topicNumbers }] : [];
  });
}
