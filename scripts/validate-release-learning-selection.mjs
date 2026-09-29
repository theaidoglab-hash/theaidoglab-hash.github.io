import assert from 'node:assert/strict';
import {
  selectInterviewCapabilityGroups,
  selectInterviewPrepForReleaseScope,
  selectInterviewTopicsForReleaseScope,
  selectRoadmapForReleaseScope,
} from '../lib/release-learning-selection.ts';

const scopedRelease = {
  mode: 'PUBLIC_RELEASE',
  selection: {
    articles: ['selected-article'],
    labs: ['build-lab'],
    readerPaths: [],
    roadmapStages: ['stage-one'],
    interviewPrepTracks: ['track-one'],
    interviewTopics: ['selected-topic'],
    routeSurfaces: ['coding-starter-lab', 'interview-lab'],
  },
};

const roadmap = {
  id: 'ai-engineer-roadmap',
  status: 'approved',
  visibility: 'public',
  phases: [
    { id: 'first', range: '01', title: {}, description: {}, checkpoint: {} },
    { id: 'second', range: '02', title: {}, description: {}, checkpoint: {} },
  ],
  stages: [
    {
      id: 'stage-one', number: '01', phase: 'first', status: 'available', title: {}, summary: {}, focus: [], evidence: {},
      resources: [
        { kind: 'article', target: 'selected-article' },
        { kind: 'article', target: 'unselected-article' },
        { kind: 'interview-question', target: 'selected-topic' },
        { kind: 'interview-question', target: 'unselected-topic' },
        { kind: 'interview-prep', target: 'ai-engineer-interview-prep' },
        { kind: 'lab', target: 'build-lab' },
        { kind: 'lab', target: 'coding-starter-lab' },
        { kind: 'lab', target: 'unknown-lab' },
      ],
    },
    { id: 'stage-two', number: '02', phase: 'second', status: 'available', title: {}, summary: {}, focus: [], evidence: {}, resources: [] },
  ],
  selfLearning: { routes: [{ id: 'route-one', startStage: 'stage-one' }, { id: 'route-two', startStage: 'stage-two' }] },
  sourceNote: {},
};

assert.equal(selectRoadmapForReleaseScope(roadmap, null), roadmap, 'local review keeps the full roadmap object');
const scopedRoadmap = selectRoadmapForReleaseScope(roadmap, scopedRelease);
assert.ok(scopedRoadmap);
assert.deepEqual(scopedRoadmap.stages.map(stage => stage.id), ['stage-one']);
assert.deepEqual(scopedRoadmap.phases.map(phase => phase.id), ['first']);
assert.deepEqual(scopedRoadmap.selfLearning.routes.map(route => route.id), ['route-one']);
assert.deepEqual(
  scopedRoadmap.stages[0].resources.map(resource => `${resource.kind}:${resource.target}`),
  ['article:selected-article', 'interview-question:selected-topic', 'interview-prep:ai-engineer-interview-prep', 'lab:build-lab', 'lab:coding-starter-lab'],
  'unselected and unsupported roadmap targets must be removed from a scoped renderer',
);
const releaseWithoutPrepMap = {
  ...scopedRelease,
  selection: { ...scopedRelease.selection, interviewPrepTracks: [] },
};
const roadmapWithoutPrepMap = selectRoadmapForReleaseScope(roadmap, releaseWithoutPrepMap);
assert.ok(roadmapWithoutPrepMap);
assert.equal(
  roadmapWithoutPrepMap.stages[0].resources.some(resource => resource.kind === 'interview-prep'),
  false,
  'a scoped roadmap must hide its preparation-map handoff when no preparation track is released',
);
const releaseWithoutInterviewLab = {
  ...scopedRelease,
  selection: { ...scopedRelease.selection, routeSurfaces: ['coding-starter-lab'] },
};
const roadmapWithoutInterviewLab = selectRoadmapForReleaseScope(roadmap, releaseWithoutInterviewLab);
assert.ok(roadmapWithoutInterviewLab);
assert.equal(
  roadmapWithoutInterviewLab.stages[0].resources.some(resource => resource.kind === 'interview-prep'),
  false,
  'a scoped roadmap must hide its preparation-map handoff when the Interview Lab surface is not released',
);
assert.equal(selectRoadmapForReleaseScope({ ...roadmap, status: 'review' }, scopedRelease), null);

const prep = {
  id: 'ai-engineer-interview-prep', status: 'approved', visibility: 'public', tracks: [
    { id: 'track-one', number: '01', status: 'available', title: {}, summary: {}, evidence: {}, resources: roadmap.stages[0].resources },
    { id: 'track-two', number: '02', status: 'available', title: {}, summary: {}, evidence: {}, resources: [] },
  ], sourceNote: {},
};
const scopedPrep = selectInterviewPrepForReleaseScope(prep, scopedRelease);
assert.ok(scopedPrep);
assert.deepEqual(scopedPrep.tracks.map(track => track.id), ['track-one']);
assert.deepEqual(scopedPrep.tracks[0].resources.map(resource => `${resource.kind}:${resource.target}`), ['article:selected-article', 'interview-question:selected-topic', 'interview-prep:ai-engineer-interview-prep', 'lab:build-lab', 'lab:coding-starter-lab']);
assert.equal(selectInterviewPrepForReleaseScope({ ...prep, status: 'review' }, scopedRelease), null);

const topics = [
  { number: '01', slug: 'selected-topic', title: {} },
  { number: '02', slug: 'unselected-topic', title: {} },
];
const selectedTopics = selectInterviewTopicsForReleaseScope(topics, { status: 'approved', visibility: 'public' }, scopedRelease);
assert.deepEqual(selectedTopics.map(topic => topic.slug), ['selected-topic']);
assert.deepEqual(selectInterviewTopicsForReleaseScope(topics, { status: 'review', visibility: 'public' }, scopedRelease), []);
assert.deepEqual(selectInterviewTopicsForReleaseScope(topics, { status: 'approved', visibility: 'public' }, null), topics);
const groups = selectInterviewCapabilityGroups([
  { id: 'one', topicNumbers: ['01', '02'], copy: {} },
  { id: 'two', topicNumbers: ['02'], copy: {} },
], selectedTopics);
assert.deepEqual(groups.map(group => [group.id, group.topicNumbers]), [['one', ['01']]]);

console.log('Validated fail-closed release selection for roadmap stages, prep tracks, topic pages, and their visible learning links.');
