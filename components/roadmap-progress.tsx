'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { canonicalLocaleRecord, type Locale } from '@/lib/types';

export type RoadmapProgressState = 'not-started' | 'in-progress' | 'completed';

type RoadmapProgressMap = Record<string, RoadmapProgressState>;

type RoadmapProgressStage = Readonly<{
  id: string;
  number: string;
  title: string;
  href?: string;
}>;

type StoredRoadmapProgress = Readonly<{
  version: 1;
  updatedAt: string;
  stages: RoadmapProgressMap;
}>;

const STORAGE_KEY = 'ai-dog:ai-engineer-roadmap-progress:v1';
const PROGRESS_EVENT = 'ai-dog:roadmap-progress-change';
const validStates = new Set<RoadmapProgressState>(['not-started', 'in-progress', 'completed']);
const emptyProgress: RoadmapProgressMap = {};
let currentProgress: RoadmapProgressMap = emptyProgress;
let progressLoaded = false;

const copy = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '只儲存在呢個瀏覽器',
    title: '繼續你上次嘅進度',
    privacy: '只會在這個瀏覽器記住每站狀態；不會上載姓名、筆記或作品內容。清除瀏覽器資料會刪除這份紀錄。',
    selfReported: '進度由你自行標記，未經導師或獨立 reviewer 核對。',
    summary: (completed: number, total: number, active: number) => `已自行完成 ${completed}/${total} 站；進行中 ${active} 站。`,
    resume: '繼續下一站',
    complete: '所有顯示站點都已自行標記完成。你仍可回看 artefact 同核對限制。',
    export: '匯出進度 JSON',
    reset: '重設本機進度',
    resetQuestion: '只會刪除這條 roadmap 在這個瀏覽器的進度。確定重設？',
    confirmReset: '確定重設',
    cancelReset: '取消',
    resetDone: '本機 roadmap 進度已重設。',
    exportDone: '已產生只含站點狀態的本機 JSON 檔案。',
    storageError: '瀏覽器未能儲存這次變更；今次分頁仍會顯示，但重新整理後可能消失。',
    stageLabel: (number: string) => `第 ${number} 站進度`,
    update: '更新進度',
    states: { 'not-started': '未開始', 'in-progress': '進行中', completed: '自行核對完成' },
  },
  'zh-TW': {
    eyebrow: '只儲存在這個瀏覽器',
    title: '從上次進度繼續',
    privacy: '只會在這個瀏覽器記住每站狀態；不會上傳姓名、筆記或作品內容。清除瀏覽器資料會刪除這份紀錄。',
    selfReported: '進度由你自行標記，尚未經導師或獨立 reviewer 核對。',
    summary: (completed: number, total: number, active: number) => `已自行完成 ${completed}/${total} 站；進行中 ${active} 站。`,
    resume: '繼續下一站',
    complete: '所有顯示站點都已自行標記完成。你仍可回看 artefact 與核對限制。',
    export: '匯出進度 JSON',
    reset: '重設本機進度',
    resetQuestion: '只會刪除這條 roadmap 在這個瀏覽器的進度。確定重設？',
    confirmReset: '確定重設',
    cancelReset: '取消',
    resetDone: '本機 roadmap 進度已重設。',
    exportDone: '已產生只含站點狀態的本機 JSON 檔案。',
    storageError: '瀏覽器無法儲存這次變更；目前分頁仍會顯示，但重新整理後可能消失。',
    stageLabel: (number: string) => `第 ${number} 站進度`,
    update: '更新進度',
    states: { 'not-started': '未開始', 'in-progress': '進行中', completed: '自行核對完成' },
  },
  'zh-Hans': {
    eyebrow: '只存储在这个浏览器',
    title: '从上次进度继续',
    privacy: '只会在这个浏览器记住每站状态；不会上传姓名、笔记或作品内容。清除浏览器数据会删除这份记录。',
    selfReported: '进度由你自行标记，尚未经过导师或独立 reviewer 核对。',
    summary: (completed: number, total: number, active: number) => `已自行完成 ${completed}/${total} 站；进行中 ${active} 站。`,
    resume: '继续下一站',
    complete: '所有显示站点都已自行标记完成。你仍可回看 artefact 并核对限制。',
    export: '导出进度 JSON',
    reset: '重置本地进度',
    resetQuestion: '只会删除这条 roadmap 在这个浏览器的进度。确定重置？',
    confirmReset: '确定重置',
    cancelReset: '取消',
    resetDone: '本地 roadmap 进度已重置。',
    exportDone: '已生成只包含站点状态的本地 JSON 文件。',
    storageError: '浏览器无法保存这次更改；当前标签页仍会显示，但刷新后可能消失。',
    stageLabel: (number: string) => `第 ${number} 站进度`,
    update: '更新进度',
    states: { 'not-started': '未开始', 'in-progress': '进行中', completed: '自行核对完成' },
  },
  en: {
    eyebrow: 'STORED IN THIS BROWSER ONLY',
    title: 'Continue from your last checkpoint',
    privacy: 'Only the status of each stage is kept in this browser. No name, notes, or project content is uploaded. Clearing browser data removes this record.',
    selfReported: 'Progress is self-reported. It has not been checked by a teacher or independent reviewer.',
    summary: (completed: number, total: number, active: number) => `${completed}/${total} stages self-marked complete; ${active} in progress.`,
    resume: 'Continue with the next stage',
    complete: 'Every displayed stage is self-marked complete. You can still revisit the artefacts and check their limits.',
    export: 'Export progress JSON',
    reset: 'Reset local progress',
    resetQuestion: 'This only removes progress for this roadmap in this browser. Reset it?',
    confirmReset: 'Confirm reset',
    cancelReset: 'Cancel',
    resetDone: 'Local roadmap progress was reset.',
    exportDone: 'Created a local JSON file containing stage status only.',
    storageError: 'This browser could not persist the change. It remains visible in this tab, but may disappear after a refresh.',
    stageLabel: (number: string) => `Stage ${number} progress`,
    update: 'Update progress',
    states: { 'not-started': 'Not started', 'in-progress': 'In progress', completed: 'Self-check complete' },
  },
});

function sanitizeProgress(value: unknown): RoadmapProgressMap {
  if (!value || typeof value !== 'object') return {};
  const entries = Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, RoadmapProgressState] => typeof entry[0] === 'string' && validStates.has(entry[1] as RoadmapProgressState));
  return Object.fromEntries(entries);
}

function readProgress(): RoadmapProgressMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<StoredRoadmapProgress>;
    return parsed.version === 1 ? sanitizeProgress(parsed.stages) : {};
  } catch {
    return {};
  }
}

function progressSnapshot(): RoadmapProgressMap {
  if (!progressLoaded) {
    currentProgress = readProgress();
    progressLoaded = true;
  }
  return currentProgress;
}

function serverProgressSnapshot(): RoadmapProgressMap {
  return emptyProgress;
}

function subscribeToProgress(onStoreChange: () => void) {
  const handleProgress = (event: Event) => {
    const detail = event instanceof CustomEvent ? event.detail : undefined;
    currentProgress = detail === undefined ? readProgress() : sanitizeProgress(detail);
    progressLoaded = true;
    onStoreChange();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    currentProgress = readProgress();
    progressLoaded = true;
    onStoreChange();
  };
  window.addEventListener(PROGRESS_EVENT, handleProgress);
  window.addEventListener('storage', handleStorage);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, handleProgress);
    window.removeEventListener('storage', handleStorage);
  };
}

function broadcastProgress(stages: RoadmapProgressMap) {
  window.dispatchEvent(new CustomEvent<RoadmapProgressMap>(PROGRESS_EVENT, { detail: stages }));
}

function persistProgress(stages: RoadmapProgressMap): boolean {
  const payload: StoredRoadmapProgress = {
    version: 1,
    updatedAt: new Date().toISOString(),
    stages,
  };
  currentProgress = stages;
  progressLoaded = true;
  try {
    if (Object.keys(stages).length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    broadcastProgress(stages);
    return true;
  } catch {
    broadcastProgress(stages);
    return false;
  }
}

function useRoadmapProgress() {
  return useSyncExternalStore(subscribeToProgress, progressSnapshot, serverProgressSnapshot);
}

export function RoadmapStageProgressControl({ stageId, number, locale }: { stageId: string; number: string; locale: Locale }) {
  const progress = useRoadmapProgress();
  const labels = copy[locale];
  const [message, setMessage] = useState('');
  const value = progress[stageId] ?? 'not-started';
  const selectId = `roadmap-stage-progress-${stageId}`;
  const descriptionId = `${selectId}-description`;

  const update = (next: RoadmapProgressState) => {
    const current = readProgress();
    const nextProgress = { ...current, [stageId]: next };
    if (next === 'not-started') delete nextProgress[stageId];
    const saved = persistProgress(nextProgress);
    setMessage(saved ? '' : labels.storageError);
  };

  return <fieldset className="roadmap-stage-progress">
    <legend>{labels.stageLabel(number)}</legend>
    <label htmlFor={selectId}>
      <span className="sr-only">{labels.update}</span>
      <select id={selectId} aria-describedby={descriptionId} value={value} onChange={event => update(event.target.value as RoadmapProgressState)}>
        {(Object.keys(labels.states) as RoadmapProgressState[]).map(state => <option key={state} value={state}>{labels.states[state]}</option>)}
      </select>
    </label>
    <small id={descriptionId}>{labels.selfReported}</small>
    {message ? <p role="status" aria-live="polite">{message}</p> : null}
  </fieldset>;
}

export function RoadmapProgressTracker({ locale, stages }: { locale: Locale; stages: readonly RoadmapProgressStage[] }) {
  const labels = copy[locale];
  const progress = useRoadmapProgress();
  const [message, setMessage] = useState('');
  const resetTriggerRef = useRef<HTMLButtonElement>(null);
  const resetDialogRef = useRef<HTMLDialogElement>(null);
  const visibleProgress = useMemo(() => stages.map(stage => progress[stage.id] ?? 'not-started'), [progress, stages]);
  const completed = visibleProgress.filter(state => state === 'completed').length;
  const active = visibleProgress.filter(state => state === 'in-progress').length;
  const resumeStage = stages.find(stage => progress[stage.id] === 'in-progress')
    ?? stages.find(stage => progress[stage.id] !== 'completed');

  const exportProgress = useCallback(() => {
    const visibleIds = new Set(stages.map(stage => stage.id));
    const visibleStages = Object.fromEntries(Object.entries(progress).filter(([id]) => visibleIds.has(id)));
    const payload: StoredRoadmapProgress = { version: 1, updatedAt: new Date().toISOString(), stages: visibleStages };
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ai-dog-roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(labels.exportDone);
  }, [labels.exportDone, progress, stages]);

  const resetProgress = () => {
    const saved = persistProgress({});
    setMessage(saved ? labels.resetDone : labels.storageError);
    resetDialogRef.current?.close();
  };

  const cancelReset = () => {
    setMessage('');
    resetDialogRef.current?.close();
  };

  return <section className="roadmap-learning-guide roadmap-progress-tracker" aria-labelledby="roadmap-progress-title">
    <header>
      <p className="eyebrow">{labels.eyebrow}</p>
      <h2 id="roadmap-progress-title">{labels.title}</h2>
      <p>{labels.privacy}</p>
    </header>
    <p>{labels.summary(completed, stages.length, active)}</p>
    <progress max={stages.length} value={completed} aria-label={labels.summary(completed, stages.length, active)}>{completed}/{stages.length}</progress>
    {resumeStage
      ? <p><Link className="button primary" href={resumeStage.href ?? `#roadmap-stage-${resumeStage.number}`}>{labels.resume}: {resumeStage.number} · {resumeStage.title} <span aria-hidden>→</span></Link></p>
      : <p>{labels.complete}</p>}
    <p>{labels.selfReported}</p>
    <div className="hero-actions">
      <button className="button secondary" type="button" onClick={exportProgress}>{labels.export}</button>
      <button ref={resetTriggerRef} className="button secondary" type="button" onClick={() => {
        setMessage('');
        if (resetDialogRef.current && !resetDialogRef.current.open) resetDialogRef.current.showModal();
      }}>{labels.reset}</button>
    </div>
    <dialog
      ref={resetDialogRef}
      className="roadmap-reset-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="roadmap-reset-dialog-title"
      aria-describedby="roadmap-reset-dialog-description"
      onCancel={() => setMessage('')}
      onClose={() => resetTriggerRef.current?.focus()}
    >
      <div className="roadmap-reset-dialog__content">
        <h3 id="roadmap-reset-dialog-title">{labels.reset}</h3>
        <p id="roadmap-reset-dialog-description">{labels.resetQuestion}</p>
        <div className="hero-actions">
          <button className="button secondary" type="button" onClick={cancelReset}>{labels.cancelReset}</button>
          <button className="button primary" type="button" onClick={resetProgress}>{labels.confirmReset}</button>
        </div>
      </div>
    </dialog>
    {message ? <p role="status" aria-live="polite">{message}</p> : null}
  </section>;
}
