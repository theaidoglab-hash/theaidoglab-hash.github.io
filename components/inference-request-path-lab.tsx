'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

type Traffic = 'single' | 'burst';
type ContextLength = 'short' | 'long';
type OutputLength = 'short' | 'long';
type CacheCondition = 'warm' | 'cold';

type Scenario = {
  traffic: Traffic;
  context: ContextLength;
  output: OutputLength;
  cache: CacheCondition;
};

type Pressure = 'low' | 'medium' | 'high';
type Status = 'ready' | 'review' | 'stopped';

type ChoiceCopy<T extends string> = Record<T, { label: string; detail: string }>;

type LabCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  quickStart: {
    title: string;
    intro: string;
    steps: readonly string[];
    boundary: string;
  };
  presetLabel: string;
  presets: {
    shortWarm: string;
    longBurst: string;
  };
  controlsTitle: string;
  traffic: { legend: string; options: ChoiceCopy<Traffic> };
  context: { legend: string; options: ChoiceCopy<ContextLength> };
  output: { legend: string; options: ChoiceCopy<OutputLength> };
  cache: { legend: string; options: ChoiceCopy<CacheCondition> };
  pathTitle: string;
  pathIntro: string;
  stages: {
    queue: string;
    prefill: string;
    firstOutput: string;
    kvCache: string;
    decode: string;
    validation: string;
  };
  stageText: {
    queue: Record<Traffic, string>;
    prefill: Record<'short' | 'longWarm' | 'longCold', string>;
    firstOutput: string;
    kvCache: Record<'low' | 'medium' | 'high', string>;
    decode: Record<OutputLength, string>;
    validation: string;
  };
  status: Record<Status, { label: string; text: string }>;
  resultTitle: string;
  pressure: Record<Pressure, string>;
  nextMeasurement: string;
  nextMeasurementText: Record<Status, string>;
  completionTitle: string;
  completionText: string;
  boundary: string;
};

const copy = canonicalLocaleRecord<LabCopy>({
  'zh-Hant': {
    eyebrow: '逐步練習 · request path',
    title: '同樣一句「很慢」，可能卡在四個不同環節',
    intro: '選擇一個完全合成的 workload。這個實驗台不會計算毫秒、GPU 型號或實際吞吐量；它只協助你判斷下一步應先查看 queue（排隊）、prefill（預先處理輸入）、decode（逐段產生輸出）或記憶體壓力。',
    quickStart: {
      title: '15 分鐘起步：只判斷一條短 request',
      intro: '保持預設「短 request · warm cache」。本輪只需辨認最先應檢查的路徑環節，以及需要保留的欄位。',
      steps: ['不要切換其他條件；本輪只查看預設情境。', '從 request path 指出 queue（等待）、prefill（預先處理輸入）、decode（逐段產生輸出）或 validation（檢查）中最先應查看的位置。', '記錄到達時間、第一段輸出、完成時間、檢查結果及最終去向。'],
      boundary: '完成本輪不代表已讀完整份指南、量度 latency，或作出部署選擇。'
    },
    presetLabel: '先嘗試一個對比情境',
    presets: {
      shortWarm: '短 request · warm cache',
      longBurst: '長 request · burst · cold cache',
    },
    controlsTitle: '選擇 workload 條件',
    traffic: {
      legend: '同時到達的 request',
      options: {
        single: { label: '單一短 request', detail: '幾乎沒有 queue 壓力。' },
        burst: { label: '一組 burst', detail: '多個 request 同時等待 admission。' },
      },
    },
    context: {
      legend: '輸入 context',
      options: {
        short: { label: '短而精簡', detail: '只包含任務所需材料。' },
        long: { label: '長 evidence packet', detail: '有較多 token 需要先處理。' },
      },
    },
    output: {
      legend: '要求輸出',
      options: {
        short: { label: '短 structured draft', detail: '先交付一個有明確上限的結果。' },
        long: { label: '較長回應', detail: '逐 token 生成時間會延長。' },
      },
    },
    cache: {
      legend: 'stable prefix cache',
      options: {
        warm: { label: 'Warm', detail: '版本相同的固定前綴可以重用。' },
        cold: { label: 'Cold', detail: '須從頭處理可用 input。' },
      },
    },
    pathTitle: '這個 request 會依次經過哪些環節？',
    pathIntro: '色帶只表示相對值得留意的壓力，不代表 latency benchmark。',
    stages: {
      queue: 'Queue',
      prefill: 'Prefill',
      firstOutput: '首個輸出',
      kvCache: 'KV cache',
      decode: 'Decode',
      validation: 'Validation',
    },
    stageText: {
      queue: {
        single: '先量度 admission 至開始處理之間的等待時間。',
        burst: '先量度 queue wait，並檢查短 request 是否因背景工作而延後。',
      },
      prefill: {
        short: '短 context：先確認 context assembly 是否包含任務不需要的材料。',
        longWarm: '長 context，但 stable prefix 為 warm：仍須記錄 cache key 和版本。',
        longCold: '長 context 加上 cold cache：應先將首個輸出前的工作分開量度。',
      },
      firstOutput: '首個輸出／TTFT 只是其中一段結果；不代表完整 response 已可交付。',
      kvCache: {
        low: '短 context、單一 request：仍可記錄 context band，但 KV cache 不一定是首要壓力。',
        medium: '記錄 context 與 active request 數；KV cache 是已處理 token 的 state，而非抽象的「memory」分類。',
        high: '長 context 加上 burst：先分別量度 active request 數、context band 與可用 memory，再比較 batch 或 engine。',
      },
      decode: {
        short: '短輸出：decode 不一定是主要疑點。',
        long: '較長輸出：分別記錄 output length，以及逐 token 生成所佔比例。',
      },
      validation: '將 schema、source check 與 terminal route 分開記錄；不要將它們歸入「model 很慢」。',
    },
    status: {
      ready: { label: '可先執行固定 case', text: '壓力較集中；先保留一條完整 trace，再決定是否需要優化。' },
      review: { label: '先拆分 trace，再選擇 engine', text: '此 workload shape 已有多個合理瓶頸，不應由 model catalogue 直接跳至結論。' },
      stopped: { label: '先停止並收窄 workload', text: '長 context、較長輸出、burst 與 cold cache 同時出現。先設定 cap、traffic policy 或 handoff，不應假設更大型硬件會自然解決問題。' },
    },
    resultTitle: '本次優先判斷',
    pressure: { low: '壓力較低', medium: '值得分別量度', high: '優先檢查' },
    nextMeasurement: '下一項需要保留的 measurement',
    nextMeasurementText: {
      ready: 'arrival、first output、completion、validation result 及 terminal route。',
      review: 'queue delay、context token band、TTFT、output length、cache condition 及 P95／P99 terminal route。',
      stopped: '先記錄使 request 停止的 cap 或 route rule；不要以單一平均 latency 掩蓋 deadline miss。',
    },
    completionTitle: '完成本節，不等於已選定一張卡',
    completionText: '你應能指出一段緩慢的 time slice，說明下一個需要量度的欄位，並知道何時需要 handoff 或 budget stop。',
    boundary: '所有狀態、workload 與結論均為教學用 synthetic scenario；本頁不會傳送資料、選擇供應商，或產生任何實際 serving benchmark。',
  },
  'zh-Hans': {
    eyebrow: '步进练习 · request path',
    title: '同一句“很慢”，可能卡在四个不同位置',
    intro: '选择一个完全合成的 workload。这个实验台不会计算毫秒、GPU 型号或真实吞吐；它只帮助你区分下一步应先看 queue（排队）、prefill（先处理输入）、decode（逐段产生输出）还是内存压力。',
    quickStart: {
      title: '15 分钟起步：只判断一条短请求（request）',
      intro: '保持默认“短请求（request）· 已预热缓存（warm cache）”。这次只要辨认一段应先检查的路径，以及要留下的字段。',
      steps: ['不要切换其他条件；这一轮只看默认情境。', '从请求路径指出 queue（等待）、prefill（先处理输入）、decode（逐段产生输出）或 validation（检查）中最先要看的位置。', '记下到达时间、第一段输出、完成、检查结果和最终去向。'],
      boundary: '完成这一轮不代表已读完整篇指南、量到延迟，或作出部署选择。'
    },
    presetLabel: '先试一个对比场景',
    presets: {
      shortWarm: '短 request · warm cache',
      longBurst: '长 request · burst · cold cache',
    },
    controlsTitle: '选择 workload 条件',
    traffic: {
      legend: '同时到达的 request',
      options: {
        single: { label: '单一短 request', detail: '几乎没有 queue 压力。' },
        burst: { label: '一阵 burst', detail: '多个 request 同时等待 admission。' },
      },
    },
    context: {
      legend: '输入 context',
      options: {
        short: { label: '短而干净', detail: '只放需要的材料。' },
        long: { label: '长 evidence packet', detail: '有较多 token 要先读。' },
      },
    },
    output: {
      legend: '要求输出',
      options: {
        short: { label: '短 structured draft', detail: '先交一个有上限的结果。' },
        long: { label: '长篇回应', detail: '逐 token 生成时间会拉长。' },
      },
    },
    cache: {
      legend: 'stable prefix cache',
      options: {
        warm: { label: 'Warm', detail: '版本相同的固定前缀可以复用。' },
        cold: { label: 'Cold', detail: '需要从头处理可用 input。' },
      },
    },
    pathTitle: '这个 request 会先经过哪里？',
    pathIntro: '色条只表示相对值得留意的压力，不代表 latency benchmark。',
    stages: {
      queue: 'Queue',
      prefill: 'Prefill',
      firstOutput: '首个输出',
      kvCache: 'KV cache',
      decode: 'Decode',
      validation: 'Validation',
    },
    stageText: {
      queue: {
        single: '先量 admission 到开始处理之间的等待。',
        burst: '先量 queue wait，并检查短 request 有没有被后台工作挤走。',
      },
      prefill: {
        short: '短 context：先确认 context assembly 有没有夹杂不需要的材料。',
        longWarm: '长 context，但 stable prefix warm：仍要记录 cache key 和版本。',
        longCold: '长 context 加 cold cache：首个输出前的工作值得先拆开量。',
      },
      firstOutput: '首个输出／TTFT 只是一段结果；它不代表完整 response 已可交付。',
      kvCache: {
        low: '短 context、单一 request：仍可记录 context band，但 KV cache 未必是优先追的压力。',
        medium: '记录 context 和活跃 request 数；KV cache 是每段已见 token state，不是一个抽象“memory”桶。',
        high: '长 context 加 burst：先分开量 active request 数、context band 和可用 memory，再比较 batch 或 engine。',
      },
      decode: {
        short: '短输出：decode 未必是主要疑点。',
        long: '长输出：分开记录 output length，以及逐 token 生成占了多少。',
      },
      validation: '将 schema、source check 和 terminal route 分开记录；不要把它们藏在“model 慢”。',
    },
    status: {
      ready: { label: '可以先跑固定 case', text: '压力较集中；先留下一个完整 trace，再决定是否优化。' },
      review: { label: '先拆 trace，再选 engine', text: '这个 shape 已经有多个合理瓶颈，不应从 model catalogue 直接跳到结论。' },
      stopped: { label: '先停下，缩小 workload', text: '长 context、长输出、burst 和 cold cache 同时出现。先设定 cap、traffic policy 或 handoff，而不是假设更大硬件会自然解决。' },
    },
    resultTitle: '这次优先判断',
    pressure: { low: '压力较低', medium: '值得分开量', high: '优先检查' },
    nextMeasurement: '下一个要留下的 measurement',
    nextMeasurementText: {
      ready: 'arrival、first output、completion、validation result 和 terminal route。',
      review: 'queue delay、context token band、TTFT、output length、cache condition 和 P95／P99 terminal route。',
      stopped: '先记录哪个 cap 或 route rule 让 request 停下；不要用单一平均 latency 掩盖 deadline miss。',
    },
    completionTitle: '完成这一节，不是选到一张卡',
    completionText: '你应该能指出一个慢的 time slice，说出下一个要量的字段，并知道什么情况要 handoff 或 budget stop。',
    boundary: '所有状态、workload 和结论都是教学用 synthetic scenario；此页不会传送资料、选择供应商，或生成任何实际 serving benchmark。',
  },
  en: {
    eyebrow: 'STEP-THROUGH PRACTICE · REQUEST PATH',
    title: '“It is slow” can mean four different places',
    intro: 'Choose a fully synthetic workload. This lab does not estimate milliseconds, GPU models, or real throughput; it helps you decide whether to inspect queueing, input prefill, output decoding, or memory pressure first.',
    quickStart: {
      title: '15-minute start: inspect one short request only',
      intro: 'Keep the default “Short request · warm cache” scenario, where a reusable cache is already available. This visit only identifies one path slice to inspect first and the fields it needs.',
      steps: ['Do not change the conditions; use only the default scenario this round.', 'Use the request path to name whether queueing, input prefill, output decoding, or validation needs attention first.', 'Record arrival, first output, completion, validation result, and terminal route.'],
      boundary: 'Finishing this round does not mean finishing the guide, measuring latency, or making a deployment choice.'
    },
    presetLabel: 'Try a contrast first',
    presets: {
      shortWarm: 'Short request · warm cache',
      longBurst: 'Long request · burst · cold cache',
    },
    controlsTitle: 'Choose workload conditions',
    traffic: {
      legend: 'Requests arriving together',
      options: {
        single: { label: 'One short request', detail: 'Almost no queue pressure.' },
        burst: { label: 'A burst', detail: 'Several requests wait for admission together.' },
      },
    },
    context: {
      legend: 'Input context',
      options: {
        short: { label: 'Short and clean', detail: 'Only material the task needs.' },
        long: { label: 'Long evidence packet', detail: 'More tokens to read before output.' },
      },
    },
    output: {
      legend: 'Requested output',
      options: {
        short: { label: 'Short structured draft', detail: 'Return a bounded result first.' },
        long: { label: 'Long response', detail: 'Token-by-token generation lasts longer.' },
      },
    },
    cache: {
      legend: 'Stable prefix cache',
      options: {
        warm: { label: 'Warm', detail: 'A version-matched fixed prefix can be reused.' },
        cold: { label: 'Cold', detail: 'The allowed input must be processed from the start.' },
      },
    },
    pathTitle: 'What does this request pass through?',
    pathIntro: 'The colour only marks relative pressure worth inspecting. It is not a latency benchmark.',
    stages: {
      queue: 'Queue',
      prefill: 'Prefill',
      firstOutput: 'First output',
      kvCache: 'KV cache',
      decode: 'Decode',
      validation: 'Validation',
    },
    stageText: {
      queue: {
        single: 'Measure the wait between admission and processing first.',
        burst: 'Measure queue wait and whether short work is displaced by background work.',
      },
      prefill: {
        short: 'Short context: first check whether context assembly contains material the task does not need.',
        longWarm: 'Long context with a warm stable prefix: still record the cache key and version.',
        longCold: 'Long context plus a cold cache: split out the work before first output first.',
      },
      firstOutput: 'First output / TTFT is only one slice; it does not prove the full response is ready to hand over.',
      kvCache: {
        low: 'Short context and one request: retain the context band, but KV cache may not be the first pressure to investigate.',
        medium: 'Record context and active-request count. KV cache is state for tokens already seen, not an abstract “memory” bucket.',
        high: 'Long context plus a burst: separately measure active-request count, context band, and available memory before comparing a batch or engine.',
      },
      decode: {
        short: 'Short output: decode may not be the main question.',
        long: 'Long output: record output length separately and how much is token-by-token generation.',
      },
      validation: 'Record schema checks, source checks, and the terminal route separately. Do not hide them inside “the model is slow”.',
    },
    status: {
      ready: { label: 'Run a fixed case first', text: 'The pressure is more concentrated. Keep one complete trace before deciding whether to optimise.' },
      review: { label: 'Split the trace before choosing an engine', text: 'This shape has several plausible bottlenecks; do not jump straight from a model catalogue to a conclusion.' },
      stopped: { label: 'Stop and narrow the workload first', text: 'Long context, long output, a burst, and a cold cache appear together. Set a cap, traffic policy, or handoff before assuming larger hardware fixes it.' },
    },
    resultTitle: 'Priority for this scenario',
    pressure: { low: 'Lower pressure', medium: 'Measure separately', high: 'Inspect first' },
    nextMeasurement: 'The next measurement to retain',
    nextMeasurementText: {
      ready: 'arrival, first output, completion, validation result, and terminal route.',
      review: 'queue delay, context-token band, TTFT, output length, cache condition, and P95/P99 terminal route.',
      stopped: 'First retain which cap or route rule stopped the request; do not use one average latency to hide deadline misses.',
    },
    completionTitle: 'Finishing this section does not mean choosing a card',
    completionText: 'You should be able to name one slow time slice, state the next field to measure, and know when to hand off or stop on budget.',
    boundary: 'Every state, workload, and conclusion here is a synthetic teaching scenario. This page sends no data, selects no provider, and produces no serving benchmark.',
  },
});

const shortWarmScenario: Scenario = {
  traffic: 'single',
  context: 'short',
  output: 'short',
  cache: 'warm',
};

const longBurstScenario: Scenario = {
  traffic: 'burst',
  context: 'long',
  output: 'long',
  cache: 'cold',
};

function prefillPressure(scenario: Scenario): Pressure {
  if (scenario.context === 'short') return 'low';
  return scenario.cache === 'warm' ? 'medium' : 'high';
}

function statusFor(scenario: Scenario): Status {
  if (scenario.traffic === 'burst' && scenario.context === 'long' && scenario.output === 'long' && scenario.cache === 'cold') return 'stopped';
  if (scenario.traffic === 'burst' || scenario.context === 'long' || scenario.output === 'long') return 'review';
  return 'ready';
}

function kvCachePressure(scenario: Scenario): Pressure {
  if (scenario.traffic === 'burst' && scenario.context === 'long') return 'high';
  if (scenario.traffic === 'burst' || scenario.context === 'long' || scenario.output === 'long') return 'medium';
  return 'low';
}

function scenariosMatch(left: Scenario, right: Scenario) {
  return left.traffic === right.traffic
    && left.context === right.context
    && left.output === right.output
    && left.cache === right.cache;
}

export function InferenceRequestPathLab({ locale }: Readonly<{ locale: Locale }>) {
  const labels = copy[locale];
  const [scenario, setScenario] = useState<Scenario>(shortWarmScenario);
  const status = statusFor(scenario);
  const prefill = prefillPressure(scenario);
  const kvCache = kvCachePressure(scenario);
  const prefillText = scenario.context === 'short'
    ? labels.stageText.prefill.short
    : scenario.cache === 'warm'
      ? labels.stageText.prefill.longWarm
      : labels.stageText.prefill.longCold;

  const stages: ReadonlyArray<{ id: string; label: string; text: string; pressure: Pressure }> = [
    { id: 'queue', label: labels.stages.queue, text: labels.stageText.queue[scenario.traffic], pressure: scenario.traffic === 'burst' ? 'high' : 'low' },
    { id: 'prefill', label: labels.stages.prefill, text: prefillText, pressure: prefill },
    { id: 'first-output', label: labels.stages.firstOutput, text: labels.stageText.firstOutput, pressure: prefill === 'high' ? 'high' : 'medium' },
    { id: 'kv-cache', label: labels.stages.kvCache, text: labels.stageText.kvCache[kvCache], pressure: kvCache },
    { id: 'decode', label: labels.stages.decode, text: labels.stageText.decode[scenario.output], pressure: scenario.output === 'long' ? 'high' : 'low' },
    { id: 'validation', label: labels.stages.validation, text: labels.stageText.validation, pressure: 'medium' },
  ];

  return <section className="article-outline" aria-labelledby="inference-request-path-lab-title">
    <header className="learner-start__header">
      <p className="eyebrow">{labels.eyebrow}</p>
      <h2 id="inference-request-path-lab-title">{labels.title}</h2>
      <p>{labels.intro}</p>
    </header>

    <aside className="learner-start__boundary" role="note">
      <strong>{labels.quickStart.title}</strong>
      <p>{labels.quickStart.intro}</p>
      <ol>{labels.quickStart.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <p>{labels.quickStart.boundary}</p>
    </aside>

    <div className="hero-actions" aria-label={labels.presetLabel}>
      <button type="button" className={`button ${scenariosMatch(scenario, shortWarmScenario) ? 'primary' : 'secondary'}`} aria-pressed={scenariosMatch(scenario, shortWarmScenario)} onClick={() => setScenario(shortWarmScenario)}>{labels.presets.shortWarm}</button>
      <button type="button" className={`button ${scenariosMatch(scenario, longBurstScenario) ? 'primary' : 'secondary'}`} aria-pressed={scenariosMatch(scenario, longBurstScenario)} onClick={() => setScenario(longBurstScenario)}>{labels.presets.longBurst}</button>
    </div>

    <div className="learner-start__layout">
      <div className="learner-start__questions">
        <h3>{labels.controlsTitle}</h3>
        <ScenarioField<Traffic>
          id="traffic"
          legend={labels.traffic.legend}
          options={labels.traffic.options}
          value={scenario.traffic}
          onChange={traffic => setScenario(current => ({ ...current, traffic }))}
        />
        <ScenarioField<ContextLength>
          id="context"
          legend={labels.context.legend}
          options={labels.context.options}
          value={scenario.context}
          onChange={context => setScenario(current => ({ ...current, context }))}
        />
        <ScenarioField<OutputLength>
          id="output"
          legend={labels.output.legend}
          options={labels.output.options}
          value={scenario.output}
          onChange={output => setScenario(current => ({ ...current, output }))}
        />
        <ScenarioField<CacheCondition>
          id="cache"
          legend={labels.cache.legend}
          options={labels.cache.options}
          value={scenario.cache}
          onChange={cache => setScenario(current => ({ ...current, cache }))}
        />
      </div>

      <div className="learner-start__result" aria-live="polite">
        <header>
          <h3>{labels.pathTitle}</h3>
          <p>{labels.pathIntro}</p>
        </header>
        <dl>
          {stages.map(stage => <div key={stage.id}>
            <dt>{stage.label} · {labels.pressure[stage.pressure]}</dt>
            <dd>{stage.text}</dd>
          </div>)}
        </dl>
        <div>
          <p className="eyebrow">{labels.resultTitle}</p>
          <h3>{labels.status[status].label}</h3>
          <p>{labels.status[status].text}</p>
          <p><strong>{labels.nextMeasurement}</strong></p>
          <p>{labels.nextMeasurementText[status]}</p>
        </div>
      </div>
    </div>

    <aside className="learner-start__boundary">
      <strong>{labels.completionTitle}</strong>
      <p>{labels.completionText}</p>
    </aside>
    <aside className="learner-start__boundary"><p>{labels.boundary}</p></aside>
  </section>;
}

function ScenarioField<T extends string>({
  id,
  legend,
  options,
  value,
  onChange,
}: Readonly<{
  id: string;
  legend: string;
  options: ChoiceCopy<T>;
  value: T;
  onChange: (value: T) => void;
}>) {
  return <fieldset>
    <legend>{legend}</legend>
    <div className="learner-start__options">
      {(Object.entries(options) as Array<[T, { label: string; detail: string }]>).map(([option, labels]) => {
        const selected = value === option;
        return <label key={option}>
          <input
            type="radio"
            name={id}
            value={option}
            checked={selected}
            onChange={() => onChange(option)}
          />
          <span>{labels.label} — {labels.detail}</span>
        </label>;
      })}
    </div>
  </fieldset>;
}
