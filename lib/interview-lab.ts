import { getInterviewQuestionMetadata, type InterviewQuestionMetadata } from './interview-question-metadata';
import type { Locale } from './types';
import { canonicalLocaleRecord, normalizeLocaleContent } from './types';

type InterviewTopicDefinition = {
  number: string;
  anchor: string;
  slug: string;
  contentFile: string;
  title: Record<Locale, string>;
};

export type InterviewTopic = InterviewTopicDefinition & Omit<InterviewQuestionMetadata, 'slug'>;

export type InterviewCapabilityGroup = {
  id: string;
  topicNumbers: string[];
  copy: Record<Locale, {
    title: string;
    tests: string;
    description: string;
    action: string;
  }>;
};

const interviewTopicDefinitions: InterviewTopicDefinition[] = normalizeLocaleContent([
  {
    number: '01', anchor: 'topic-01', slug: 'long-context-is-not-a-free-upgrade', contentFile: 'long-context-is-not-a-free-upgrade',
    title: {
      'zh-HK': 'LLM 基礎與長篇上下文',
      'zh-TW': 'LLM 基礎與長篇上下文',
      'zh-Hans': 'LLM 基础与长上下文',
      en: 'LLM foundations and long context'
    }
  },
  {
    number: '02', anchor: 'topic-02', slug: 'trace-p99-latency-before-adding-gpus', contentFile: 'trace-p99-latency-before-adding-gpus',
    title: {
      'zh-HK': '推論服務、延遲與成本',
      'zh-TW': '推論服務、延遲與成本',
      'zh-Hans': '推理服务、延迟与成本',
      en: 'Inference, serving and cost'
    }
  },
  {
    number: '03', anchor: 'topic-03', slug: 'rag-retrieval-generation-or-permission', contentFile: 'rag-retrieval-generation-or-permission',
    title: {
      'zh-HK': 'RAG、檢索與資料權限',
      'zh-TW': 'RAG、檢索與資料權限',
      'zh-Hans': 'RAG、检索与数据权限',
      en: 'RAG, search and data boundaries'
    }
  },
  {
    number: '04', anchor: 'topic-04', slug: 'agent-draft-without-consequential-actions', contentFile: 'agent-draft-without-consequential-actions',
    title: {
      'zh-HK': 'Agent、工具與工作流程',
      'zh-TW': 'Agent、工具與工作流程',
      'zh-Hans': 'Agent、工具与工作流程',
      en: 'Agents, tools and workflows'
    }
  },
  {
    number: '05', anchor: 'topic-05', slug: 'fine-tune-or-fix-the-system', contentFile: 'fine-tune-or-fix-the-system',
    title: {
      'zh-HK': '模型選擇、微調與後訓練',
      'zh-TW': '模型選擇、微調與後訓練',
      'zh-Hans': '模型选择、微调与后训练',
      en: 'Model choice, fine-tuning and post-training'
    }
  },
  {
    number: '06', anchor: 'topic-06', slug: 'release-or-rollback-with-evidence', contentFile: 'release-or-rollback-with-evidence',
    title: {
      'zh-HK': '評估與可觀測性',
      'zh-TW': '評估與可觀測性',
      'zh-Hans': '评估与可观测性',
      en: 'Evaluation and observability'
    }
  },
  {
    number: '07', anchor: 'topic-07', slug: 'treat-untrusted-documents-as-data', contentFile: 'treat-untrusted-documents-as-data',
    title: {
      'zh-HK': '安全、私隱與負責任 AI',
      'zh-TW': '安全、隱私與負責任 AI',
      'zh-Hans': '安全、隐私与负责任 AI',
      en: 'Security, privacy and responsible AI'
    }
  },
  {
    number: '08', anchor: 'topic-08', slug: 'voice-latency-is-a-system-budget', contentFile: 'voice-latency-is-a-system-budget',
    title: {
      'zh-HK': '多模態、語音與聲音互動',
      'zh-TW': '多模態、語音與聲音互動',
      'zh-Hans': '多模态、语音与声音交互',
      en: 'Multimodal, speech and voice'
    }
  },
  {
    number: '09', anchor: 'topic-09', slug: 'design-an-internal-policy-assistant', contentFile: 'design-an-internal-policy-assistant',
    title: {
      'zh-HK': 'AI 系統設計',
      'zh-TW': 'AI 系統設計',
      'zh-Hans': 'AI 系统设计',
      en: 'AI system design'
    }
  },
  {
    number: '10', anchor: 'topic-10', slug: 'coding-and-data-structures', contentFile: 'coding-and-data-structures',
    title: {
      'zh-HK': '程式能力與資料結構',
      'zh-TW': '程式能力與資料結構',
      'zh-Hans': '编程能力与数据结构',
      en: 'Coding and data structures'
    }
  },
  {
    number: '11', anchor: 'topic-11', slug: 'applied-ai-delivery', contentFile: 'applied-ai-delivery',
    title: {
      'zh-HK': '應用落地與 FDE 情境',
      'zh-TW': '應用落地與 FDE 情境',
      'zh-Hans': '应用落地与 FDE 场景',
      en: 'Applied / FDE scenarios'
    }
  },
  {
    number: '12', anchor: 'topic-12', slug: 'project-deep-dive-and-role-fit', contentFile: 'project-deep-dive-and-role-fit',
    title: {
      'zh-HK': '行為題、專案深談與職位契合度',
      'zh-TW': '行為題、專案深談與職位契合度',
      'zh-Hans': '行为题、项目深谈与职位匹配度',
      en: 'Behavioural, project deep-dive and role fit'
    }
  },
  {
    number: '13', anchor: 'topic-13', slug: 'offline-score-and-human-workflow', contentFile: 'offline-score-and-human-workflow',
    title: {
      'zh-HK': '離線分數升咗，點解真人流程冇改善？',
      'zh-TW': '離線分數升了，真人流程為什麼沒改善？',
      'zh-Hans': '离线分数提高了，人工流程为什么没改善？',
      en: 'The offline score improved. Why did the human workflow not?'
    }
  },
  {
    number: '14', anchor: 'topic-14', slug: 'prompt-contracts-need-an-acceptance-test', contentFile: 'prompt-contracts-need-an-acceptance-test',
    title: {
      'zh-HK': 'Prompt 本來穩定，換咗上下文點解失準？',
      'zh-TW': 'Prompt 原本穩定，換了上下文為什麼失準？',
      'zh-Hans': 'Prompt 原本稳定，换了上下文为什么失准？',
      en: 'Why did a stable prompt fail when the context changed?'
    }
  },
  {
    number: '15', anchor: 'topic-15', slug: 'high-similarity-is-not-relevance', contentFile: 'high-similarity-is-not-relevance',
    title: {
      'zh-HK': 'Similarity 高，點解仲會搵錯文件？',
      'zh-TW': 'Similarity 高，為什麼還會找錯文件？',
      'zh-Hans': 'Similarity 高，为什么还会找错文档？',
      en: 'The similarity is high. Why is the document still wrong?'
    }
  },
  {
    number: '16', anchor: 'topic-16', slug: 'a-retry-is-not-a-recovery-plan', contentFile: 'a-retry-is-not-a-recovery-plan',
    title: {
      'zh-HK': 'Retry 成功，流程點解仲會出事？',
      'zh-TW': 'Retry 成功，流程為什麼仍可能出事？',
      'zh-Hans': 'Retry 成功，流程为什么仍可能出事？',
      en: 'A retry succeeded. Why can the workflow still fail?'
    }
  },
  {
    number: '17', anchor: 'topic-17', slug: 'token-budget-is-not-a-language-test', contentFile: 'token-budget-is-not-a-language-test',
    title: {
      'zh-HK': 'Token budget 唔等於多語能力',
      'zh-TW': 'Token budget 不等於多語能力',
      'zh-Hans': 'Token budget 不等于多语能力',
      en: 'A token budget is not a language test'
    }
  },
  {
    number: '18', anchor: 'topic-18', slug: 'masking-prevents-a-leak-not-a-bad-decision', contentFile: 'masking-prevents-a-leak-not-a-bad-decision',
    title: {
      'zh-HK': 'Masking 防到洩漏，未必防到錯誤決定',
      'zh-TW': 'Masking 能防洩漏，未必防得了錯誤決策',
      'zh-Hans': 'Masking 能防泄漏，未必防得了错误决策',
      en: 'Masking prevents a leak, not a bad decision'
    }
  },
  {
    number: '19', anchor: 'topic-19', slug: 'structured-output-is-not-a-grounding-check', contentFile: 'structured-output-is-not-a-grounding-check',
    title: {
      'zh-HK': 'Structured output 有格式，未必有根據',
      'zh-TW': 'Structured output 有格式，未必有根據',
      'zh-Hans': 'Structured output 有格式，未必有根据',
      en: 'Structured output is not a grounding check'
    }
  },
  {
    number: '20', anchor: 'topic-20', slug: 'a-reranker-cannot-restore-a-missing-permission', contentFile: 'a-reranker-cannot-restore-a-missing-permission',
    title: {
      'zh-HK': 'Reranker 補唔返遺失咗嘅權限',
      'zh-TW': 'Reranker 補不回遺失的權限',
      'zh-Hans': 'Reranker 补不回遗失的权限',
      en: 'A reranker cannot restore a missing permission'
    }
  },
  {
    number: '21', anchor: 'topic-21', slug: 'conflicting-sources-need-an-owner', contentFile: 'conflicting-sources-need-an-owner',
    title: {
      'zh-HK': '來源互相矛盾，邊個拍板？',
      'zh-TW': '來源互相矛盾時，誰來拍板？',
      'zh-Hans': '来源互相矛盾时，谁来拍板？',
      en: 'Conflicting sources need an owner'
    }
  },
  {
    number: '22', anchor: 'topic-22', slug: 'an-agent-loop-needs-terminal-states', contentFile: 'an-agent-loop-needs-terminal-states',
    title: {
      'zh-HK': 'Agent loop 點樣先可以安全停低？',
      'zh-TW': 'Agent loop 怎樣才能安全停止？',
      'zh-Hans': 'Agent loop 怎样才能安全停止？',
      en: 'An agent loop needs terminal states'
    }
  },
  {
    number: '23', anchor: 'topic-23', slug: 'tool-schema-is-not-least-privilege', contentFile: 'tool-schema-is-not-least-privilege',
    title: {
      'zh-HK': 'Tool schema 有格式，唔等於最小權限',
      'zh-TW': 'Tool schema 有格式，不等於最小權限',
      'zh-Hans': 'Tool schema 有格式，不等于最小权限',
      en: 'A tool schema is not least privilege'
    }
  },
  {
    number: '24', anchor: 'topic-24', slug: 'memory-must-expire-before-it-becomes-policy', contentFile: 'memory-must-expire-before-it-becomes-policy',
    title: {
      'zh-HK': 'Memory 要有到期規則，唔可以直接當政策',
      'zh-TW': 'Memory 要有到期規則，不能直接當政策',
      'zh-Hans': 'Memory 要有到期规则，不能直接当政策',
      en: 'Memory must expire before it becomes policy'
    }
  },
  {
    number: '25', anchor: 'topic-25', slug: 'a-queue-needs-a-dead-letter-path', contentFile: 'a-queue-needs-a-dead-letter-path',
    title: {
      'zh-HK': 'Queue 出錯後，要有死信處理路徑',
      'zh-TW': 'Queue 出錯後，要有死信處理路徑',
      'zh-Hans': 'Queue 出错后，要有死信处理路径',
      en: 'A queue needs a dead-letter path'
    }
  },
  {
    number: '26', anchor: 'topic-26', slug: 'a-faster-average-can-hide-a-worse-p99', contentFile: 'a-faster-average-can-hide-a-worse-p99',
    title: {
      'zh-HK': '平均值快咗，P99 反而可以更差',
      'zh-TW': '平均值變快，P99 反而可能更差',
      'zh-Hans': '平均值变快，P99 反而可能更差',
      en: 'A faster average can hide a worse P99'
    }
  },
  {
    number: '27', anchor: 'topic-27', slug: 'an-eval-score-needs-human-calibration', contentFile: 'an-eval-score-needs-human-calibration',
    title: {
      'zh-HK': 'Eval 分數要同真人判斷校準',
      'zh-TW': 'Eval 分數要和人工判斷校準',
      'zh-Hans': 'Eval 分数要和人工判断校准',
      en: 'An evaluation score needs human calibration'
    }
  },
  {
    number: '28', anchor: 'topic-28', slug: 'a-model-metric-is-not-a-business-metric', contentFile: 'a-model-metric-is-not-a-business-metric',
    title: {
      'zh-HK': '模型指標唔等於業務指標',
      'zh-TW': '模型指標不等於業務指標',
      'zh-Hans': '模型指标不等于业务指标',
      en: 'A model metric is not a business metric'
    }
  },
  {
    number: '29', anchor: 'topic-29', slug: 'data-drift-is-not-just-a-retraining-trigger', contentFile: 'data-drift-is-not-just-a-retraining-trigger',
    title: {
      'zh-HK': 'Data drift 唔只係重訓嘅訊號',
      'zh-TW': 'Data drift 不只是重新訓練的訊號',
      'zh-Hans': 'Data drift 不只是重新训练的信号',
      en: 'Data drift is not just a retraining trigger'
    }
  },
  {
    number: '30', anchor: 'topic-30', slug: 'a-rollout-needs-a-safe-baseline', contentFile: 'a-rollout-needs-a-safe-baseline',
    title: {
      'zh-HK': 'Rollout 要留返一條安全基線',
      'zh-TW': 'Rollout 要保留一條安全基線',
      'zh-Hans': 'Rollout 要保留一条安全基线',
      en: 'A rollout needs a safe baseline'
    }
  },
  {
    number: '31', anchor: 'topic-31', slug: 'ocr-text-is-still-untrusted-input', contentFile: 'ocr-text-is-still-untrusted-input',
    title: {
      'zh-HK': 'OCR 抽出嚟嘅文字，仍然係不可信輸入',
      'zh-TW': 'OCR 抽出的文字，仍然是不可信輸入',
      'zh-Hans': 'OCR 提取出的文字，仍然是不可信输入',
      en: 'OCR text is still untrusted input'
    }
  },
  {
    number: '32', anchor: 'topic-32', slug: 'a-project-story-needs-a-counterexample', contentFile: 'a-project-story-needs-a-counterexample',
    title: {
      'zh-HK': '講 project 時，要有一個反例',
      'zh-TW': '講專案時，要有一個反例',
      'zh-Hans': '讲项目时，要有一个反例',
      en: 'A project story needs a counterexample'
    }
  },
  {
    number: '33', anchor: 'topic-33', slug: 'a-baseline-is-not-a-benchmark-winner', contentFile: 'a-baseline-is-not-a-benchmark-winner',
    title: {
      'zh-HK': 'Baseline 唔係為咗贏 benchmark',
      'zh-TW': 'Baseline 不是為了贏 benchmark',
      'zh-Hans': 'Baseline 不是为了赢 benchmark',
      en: 'A baseline is not a benchmark winner'
    }
  },
  {
    number: '34', anchor: 'topic-34', slug: 'a-label-definition-can-change-the-model', contentFile: 'a-label-definition-can-change-the-model',
    title: {
      'zh-HK': 'Label 定義一變，解緊嘅問題都會變',
      'zh-TW': 'Label 定義一變，正在解的問題也會變',
      'zh-Hans': 'Label 定义一变，正在解决的问题也会变',
      en: 'A label definition can change the model'
    }
  },
  {
    number: '35', anchor: 'topic-35', slug: 'a-random-split-can-know-the-future', contentFile: 'a-random-split-can-know-the-future',
    title: {
      'zh-HK': 'Random split 會偷睇未來',
      'zh-TW': 'Random split 會偷看未來',
      'zh-Hans': 'Random split 会偷看未来',
      en: 'A random split can know the future'
    }
  },
  {
    number: '36', anchor: 'topic-36', slug: 'regularisation-is-not-a-fairness-control', contentFile: 'regularisation-is-not-a-fairness-control',
    title: {
      'zh-HK': 'Regularisation 唔係公平性控制',
      'zh-TW': 'Regularisation 不是公平性控制',
      'zh-Hans': 'Regularisation 不是公平性控制',
      en: 'Regularisation is not a fairness control'
    }
  },
  {
    number: '37', anchor: 'topic-37', slug: 'a-gradient-check-precedes-a-bigger-model', contentFile: 'a-gradient-check-precedes-a-bigger-model',
    title: {
      'zh-HK': '加大模型前，先做 gradient check',
      'zh-TW': '加大模型前，先做 gradient check',
      'zh-Hans': '加大模型前，先做 gradient check',
      en: 'A gradient check precedes a bigger model'
    }
  },
  {
    number: '38', anchor: 'topic-38', slug: 'model-routing-needs-a-fallback', contentFile: 'model-routing-needs-a-fallback',
    title: {
      'zh-HK': '模型路由要有備援方案',
      'zh-TW': '模型路由要有備援方案',
      'zh-Hans': '模型路由要有备用方案',
      en: 'Model routing needs a fallback'
    }
  },
  {
    number: '39', anchor: 'topic-39', slug: 'prompt-versioning-is-not-an-audit-trail', contentFile: 'prompt-versioning-is-not-an-audit-trail',
    title: {
      'zh-HK': 'Prompt 版本管理唔等於審計紀錄',
      'zh-TW': 'Prompt 版本管理不等於稽核紀錄',
      'zh-Hans': 'Prompt 版本管理不等于审计记录',
      en: 'Prompt versioning is not an audit trail'
    }
  },
  {
    number: '40', anchor: 'topic-40', slug: 'a-public-dataset-needs-a-source-receipt', contentFile: 'a-public-dataset-needs-a-source-receipt',
    title: {
      'zh-HK': '公開資料集都要有來源紀錄',
      'zh-TW': '公開資料集也要有來源紀錄',
      'zh-Hans': '公开数据集也要有来源记录',
      en: 'A public dataset needs a source receipt'
    }
  },
  {
    number: '41', anchor: 'topic-41', slug: 'mixed-prefill-decode-needs-a-shared-budget', contentFile: 'mixed-prefill-decode-needs-a-shared-budget',
    title: {
      'zh-HK': '混合流量下，prefill 同 decode 要共用一份 budget',
      'zh-TW': '混合流量下，prefill 與 decode 要共用一份 budget',
      'zh-Hans': '混合流量下，prefill 与 decode 要共用一份 budget',
      en: 'Mixed prefill and decode traffic needs one budget'
    }
  },
  {
    number: '42', anchor: 'topic-42', slug: 'kv-cache-needs-a-capacity-contract', contentFile: 'kv-cache-needs-a-capacity-contract',
    title: {
      'zh-HK': 'KV cache 要有容量約束',
      'zh-TW': 'KV cache 要有容量約束',
      'zh-Hans': 'KV cache 要有容量约束',
      en: 'A KV cache needs a capacity contract'
    }
  },
  {
    number: '43', anchor: 'topic-43', slug: 'batching-quantisation-and-fallback-need-one-policy', contentFile: 'batching-quantisation-and-fallback-need-one-policy',
    title: {
      'zh-HK': 'Batching、quantisation 同 fallback 要放入同一套策略',
      'zh-TW': 'Batching、quantisation 與 fallback 要放進同一套策略',
      'zh-Hans': 'Batching、quantisation 与 fallback 要放进同一套策略',
      en: 'Batching, quantisation and fallback need one policy'
    }
  },
  {
    number: '44', anchor: 'topic-44', slug: 'adaptation-method-needs-a-memory-and-eval-budget', contentFile: 'adaptation-method-needs-a-memory-and-eval-budget',
    title: {
      'zh-HK': '揀 adaptation 方法前，先定好記憶體同評估預算',
      'zh-TW': '選 adaptation 方法前，先定好記憶體與評估預算',
      'zh-Hans': '选 adaptation 方法前，先定好内存与评估预算',
      en: 'An adaptation method needs a memory and evaluation budget'
    }
  },
  {
    number: '45', anchor: 'topic-45', slug: 'a-fine-tune-win-can-still-fail-a-critical-slice', contentFile: 'a-fine-tune-win-can-still-fail-a-critical-slice',
    title: {
      'zh-HK': 'Fine-tune 總分贏咗，關鍵切片仍然可以輸',
      'zh-TW': 'Fine-tune 總分贏了，關鍵切片仍可能輸',
      'zh-Hans': 'Fine-tune 总分赢了，关键切片仍可能输',
      en: 'A fine-tune win can still fail a critical slice'
    }
  },
  {
    number: '46', anchor: 'topic-46', slug: 'an-embedding-change-needs-an-index-migration', contentFile: 'an-embedding-change-needs-an-index-migration',
    title: {
      'zh-HK': '換 embedding model，要連 index 一齊遷移',
      'zh-TW': '換 embedding model，要連 index 一起遷移',
      'zh-Hans': '换 embedding model，要连 index 一起迁移',
      en: 'An embedding change needs an index migration'
    }
  },
  {
    number: '47', anchor: 'topic-47', slug: 'ann-recall-needs-a-latency-budget', contentFile: 'ann-recall-needs-a-latency-budget',
    title: {
      'zh-HK': 'ANN recall 要放進延遲預算',
      'zh-TW': 'ANN recall 要放進延遲預算',
      'zh-Hans': 'ANN recall 要放进延迟预算',
      en: 'ANN recall needs a latency budget'
    }
  },
  {
    number: '48', anchor: 'topic-48', slug: 'metadata-needs-a-backfill-contract', contentFile: 'metadata-needs-a-backfill-contract',
    title: {
      'zh-HK': 'Metadata 要有回填約束',
      'zh-TW': 'Metadata 要有回填約束',
      'zh-Hans': 'Metadata 要有回填约束',
      en: 'Metadata needs a backfill contract'
    }
  },
  {
    number: '49', anchor: 'topic-49', slug: 'a-document-deletion-needs-a-retrieval-receipt', contentFile: 'a-document-deletion-needs-a-retrieval-receipt',
    title: {
      'zh-HK': '刪除文件要留檢索紀錄',
      'zh-TW': '刪除文件要留檢索紀錄',
      'zh-Hans': '删除文档要留检索记录',
      en: 'A document deletion needs a retrieval receipt'
    }
  },
  {
    number: '50', anchor: 'topic-50', slug: 'a-visual-claim-needs-a-region-and-an-abstention', contentFile: 'a-visual-claim-needs-a-region-and-an-abstention',
    title: {
      'zh-HK': '視覺判斷要指出證據區域，亦要識得拒答',
      'zh-TW': '視覺判斷要指出證據區域，也要懂得拒答',
      'zh-Hans': '视觉判断要指出证据区域，也要懂得拒答',
      en: 'A visual claim needs a region and an abstention'
    }
  },
  {
    number: '51', anchor: 'topic-51', slug: 'image-preprocessing-needs-a-task-contract', contentFile: 'image-preprocessing-needs-a-task-contract',
    title: {
      'zh-HK': '圖片預處理要跟任務約束',
      'zh-TW': '圖片預處理要跟任務約束',
      'zh-Hans': '图像预处理要遵循任务约束',
      en: 'Image preprocessing needs a task contract'
    }
  },
  {
    number: '52', anchor: 'topic-52', slug: 'multimodal-evals-need-a-modality-slice', contentFile: 'multimodal-evals-need-a-modality-slice',
    title: {
      'zh-HK': '多模態評估要按模態拆開睇',
      'zh-TW': '多模態評估要按模態拆開看',
      'zh-Hans': '多模态评估要按模态拆开看',
      en: 'Multimodal evaluations need modality slices'
    }
  },
  {
    number: '53', anchor: 'topic-53', slug: 'a-priority-queue-needs-a-staleness-rule', contentFile: 'a-priority-queue-needs-a-staleness-rule',
    title: {
      'zh-HK': 'Priority queue 點樣避開過期 case？',
      'zh-TW': 'Priority queue 怎麼避開過期 case？',
      'zh-Hans': 'Priority queue 怎样避开过期 case？',
      en: 'How does a priority queue avoid processing a stale case?'
    }
  },
  {
    number: '54', anchor: 'topic-54', slug: 'a-cursor-is-not-a-stable-order', contentFile: 'a-cursor-is-not-a-stable-order',
    title: {
      'zh-HK': 'Cursor 點樣避免漏咗或重複處理更新？',
      'zh-TW': 'Cursor 怎麼避免漏掉或重複處理更新？',
      'zh-Hans': 'Cursor 怎样避免漏掉或重复处理更新？',
      en: 'Why is a cursor not enough to keep changing feeds in order?'
    }
  },
  {
    number: '55', anchor: 'topic-55', slug: 'softmax-is-not-a-stability-plan', contentFile: 'softmax-is-not-a-stability-plan',
    title: {
      'zh-HK': 'Softmax 本身唔係數值穩定方案',
      'zh-TW': 'Softmax 本身不是數值穩定方案',
      'zh-Hans': 'Softmax 本身不是数值稳定方案',
      en: 'Softmax is not a numerical-stability plan'
    }
  },
  {
    number: '56', anchor: 'topic-56', slug: 'temperature-is-not-a-reproducibility-contract', contentFile: 'temperature-is-not-a-reproducibility-contract',
    title: {
      'zh-HK': 'Temperature 0 唔係可重播嘅保證',
      'zh-TW': 'Temperature 0 不是可重播的保證',
      'zh-Hans': 'Temperature 0 不是可重播的保证',
      en: 'Temperature 0 is not a reproducibility contract'
    }
  },
  {
    number: '57', anchor: 'topic-57', slug: 'mcp-discovery-is-not-an-approval-gate', contentFile: 'mcp-discovery-is-not-an-approval-gate',
    title: {
      'zh-HK': 'MCP 搵到工具，唔等於獲准行動',
      'zh-TW': 'MCP 找到工具，不等於獲准行動',
      'zh-Hans': 'MCP 找到工具，不等于获准行动',
      en: 'Discovering an MCP tool is not approval to act'
    }
  },
  {
    number: '58', anchor: 'topic-58', slug: 'an-adversarial-matrix-needs-a-regression-contract', contentFile: 'an-adversarial-matrix-needs-a-regression-contract',
    title: {
      'zh-HK': 'Adversarial test matrix 點樣先有邊界？',
      'zh-TW': 'Adversarial test matrix 怎麼才有邊界？',
      'zh-Hans': 'Adversarial test matrix 怎样才有边界？',
      en: 'How does an adversarial test matrix stay bounded?'
    }
  },
  {
    number: '59', anchor: 'topic-59', slug: 'an-agent-eval-needs-a-route-verdict', contentFile: 'an-agent-eval-needs-a-route-verdict',
    title: {
      'zh-HK': 'Agent 草稿合格，點解條 run 仍然要 fail？',
      'zh-TW': 'Agent 草稿合格，為什麼整條 run 仍要 fail？',
      'zh-Hans': 'Agent 草稿合格，为什么整条 run 仍要 fail？',
      en: 'Why can an agent run fail when its final draft passes?'
    }
  }
]) as unknown as InterviewTopicDefinition[];

export const interviewTopics: InterviewTopic[] = interviewTopicDefinitions.map(topic => {
  const metadata = getInterviewQuestionMetadata(topic.slug);
  if (!metadata) throw new Error(`Interview Lab is missing route metadata for ${topic.slug}`);
  return { ...topic, ...metadata };
});

export const interviewCapabilityGroups: InterviewCapabilityGroup[] = normalizeLocaleContent([
  {
    id: 'foundations-serving',
    topicNumbers: ['01', '02', '05', '08', '14', '55', '56'],
    copy: {
      'zh-HK': {
        title: '模型輸出、推論服務與互動品質',
        tests: '功能做得到，仲要講成本、延遲、重播條件同使用體驗。',
        description: '唔好只講模型做到乜。要交代上下文放幾多、回應點解會慢或貴、同一個案例點樣重播，仲有呢個取捨值唔值得。',
        action: '由模型與推論問題開始'
      },
      'zh-TW': {
        title: '模型輸出、推論服務與互動品質',
        tests: '功能做得到後，還要回答成本、延遲、重播條件與使用體驗。',
        description: '除了模型能力，還要交代上下文配置、回應為何變慢或變貴、同一個案例如何重播，以及這個取捨是否值得。',
        action: '從模型與推論問題開始'
      },
      'zh-Hans': {
        title: '模型输出、推理服务与交互质量',
        tests: '功能做得到后，还要回答成本、延迟、重播条件与使用体验。',
        description: '除了模型能力，还要交代上下文配置、响应为什么变慢或变贵、同一个案例如何重播，以及这个取舍是否值得。',
        action: '从模型与推理问题开始'
      },
      en: {
        title: 'Model output, serving and interaction',
        tests: 'Move from capability to cost, latency, replaying the same case, and experience measures.',
        description: 'Practise the difference between “the model can do this” and “this is worth doing”: context, prompt contracts, inference, model choice, and voice/multimodal work need measurable trade-offs and a clear account of what was fixed for replay.',
        action: 'Start with the first foundations question'
      }
    }
  },
  {
    id: 'retrieval-agents-safety',
    topicNumbers: ['03', '04', '57', '07'],
    copy: {
      'zh-HK': {
        title: '檢索、Agent 與安全邊界',
        tests: '分辨問題出喺檢索、生成定權限，並講清最小權限同人手批准。',
        description: '搵唔到答案、答案錯，或者冇權做，係三種唔同問題。講清工具讀到邊、草擬到邊；會帶來後果嘅行動由邊個批准。',
        action: '由檢索問題開始'
      },
      'zh-TW': {
        title: '檢索、Agent 與安全邊界',
        tests: '分辨檢索、生成或權限出了問題，並說清最小權限與人工核准。',
        description: '找不到答案、答案錯，或根本沒有權限，是三種不同問題。說清工具能讀到哪裡、草擬到哪裡；會帶來後果的行動由誰核准。',
        action: '從檢索問題開始'
      },
      'zh-Hans': {
        title: '检索、Agent 与安全边界',
        tests: '分辨检索、生成或权限出了问题，并说清最小权限与人工批准。',
        description: '找不到答案、答案错，或根本没有权限，是三种不同问题。说清工具能读到哪里、起草到哪里；会带来后果的行动由谁批准。',
        action: '从检索问题开始'
      },
      en: {
        title: 'Retrieval, agents and safety boundaries',
        tests: 'Diagnose failure paths, least privilege and human approval rather than adding a prompt alone.',
        description: 'Practise separating search, generation and permission failures; state which tool can read, draft or propose, and who may approve a consequential action.',
        action: 'Start with the retrieval question'
      }
    }
  },
  {
    id: 'evaluation-data-ml',
    topicNumbers: ['06', '10', '13', '16'],
    copy: {
      'zh-HK': {
        title: '評估、資料與可靠流程',
        tests: '用固定情境同處理紀錄，講清一個分數點樣影響真人工作。',
        description: '交代結果幾時可以交出、重試會唔會重做工作、部分失敗點處理，以及分數變好後工作隊列有冇真係改善。',
        action: '由評估與流程問題開始'
      },
      'zh-TW': {
        title: '評估、資料與可靠流程',
        tests: '用固定情境和處理紀錄，說清一個分數如何影響真人工作。',
        description: '交代結果何時可以交出、重試會不會重做工作、部分失敗怎麼處理，以及分數變好後工作佇列有沒有真的改善。',
        action: '從評估與流程問題開始'
      },
      'zh-Hans': {
        title: '评估、数据与可靠流程',
        tests: '用固定情境和处理记录，说清一个分数如何影响人工工作。',
        description: '交代结果何时可以交出、重试会不会重做工作、部分失败怎样处理，以及分数变好后工作队列有没有真的改善。',
        action: '从评估与流程问题开始'
      },
      en: {
        title: 'Testing, data, and work that holds up',
        tests: 'Use fixed cases and processing records to explain how a score changes a person’s work.',
        description: 'Decide when it may be released, whether a retry repeats work, how to handle a partial failure, and whether a higher score actually improves the review queue.',
        action: 'Start with the evaluation question'
      }
    }
  },
  {
    id: 'system-design-communication',
    topicNumbers: ['09', '11', '12'],
    copy: {
      'zh-HK': {
        title: '系統設計與工程溝通',
        tests: '將含糊問題收窄成可回退嘅試行，並講清咩證據會令方案改變。',
        description: '交代使用者要作乜決定、現時人手點做、今次唔做乜，同埋誰負責拍板。將模型幻覺寫成睇得見嘅錯誤，再用專案深談講清取捨。',
        action: '由系統設計問題開始'
      },
      'zh-TW': {
        title: '系統設計與工程溝通',
        tests: '把模糊問題收窄成可回退的試行，並說清哪些證據會令方案改變。',
        description: '交代使用者要做什麼決策、目前人工怎麼做、這次不做什麼，以及誰拍板。把模型幻覺變成可觀察的錯誤，再用專案深談說明取捨。',
        action: '從系統設計問題開始'
      },
      'zh-Hans': {
        title: '系统设计与工程沟通',
        tests: '把模糊问题收窄成可回退的试行，并说清哪些证据会让方案改变。',
        description: '交代用户要做什么决策、目前人工怎么做、这次不做什么，以及谁拍板。把模型幻觉变成可观察的错误，再用项目深谈说明取舍。',
        action: '从系统设计问题开始'
      },
      en: {
        title: 'System design and engineering communication',
        tests: 'Move from an ambiguous problem to a reversible pilot, then explain how evidence changed your decision.',
        description: 'Practise naming the user decision, baseline and non-goal; turn “hallucination” into an observable failure; and use an honest project deep-dive to explain a trade-off.',
        action: 'Start with the system-design question'
      }
    }
  },
  {
    id: 'input-and-model-contracts',
    topicNumbers: ['17', '18', '19', '33', '38', '39', '40'],
    copy: {
      'zh-HK': {
        title: '輸入、契約與模型邊界',
        tests: '將格式、token、基線同路由變成可驗證嘅系統約束。',
        description: '有 schema 未必代表資料有根據；有版本亦未必查到誰改過乜。講清來源紀錄、後備做法同人手對照，模型決定先經得起追問。',
        action: '由輸入契約問題開始'
      },
      'zh-TW': {
        title: '輸入、契約與模型邊界',
        tests: '把格式、token、基線與路由變成可驗證的系統約束。',
        description: '有 schema 不代表資料有根據；有版本也不代表查得到誰改過什麼。說清來源紀錄、後備做法與人工對照，模型決策才經得起追問。',
        action: '從輸入契約問題開始'
      },
      'zh-Hans': {
        title: '输入、契约与模型边界',
        tests: '把格式、token、基线与路由变成可验证的系统约束。',
        description: '有 schema 不代表数据有根据；有版本也不代表查得到谁改过什么。说清来源记录、后备做法与人工对照，模型决策才经得起追问。',
        action: '从输入契约问题开始'
      },
      en: {
        title: 'Inputs, contracts and model boundaries',
        tests: 'Turn format, tokens, baselines and routing into testable system constraints.',
        description: 'Practise the difference between having a schema and having support, versioning and auditability; then explain how a source receipt, fallback and baseline make a model decision inspectable.',
        action: 'Start with the input-contract question'
      }
    }
  },
  {
    id: 'training-and-model-boundaries',
    topicNumbers: ['34', '35', '36', '37', '44', '45'],
    copy: {
      'zh-HK': {
        title: '訓練、標籤與模型失敗邊界',
        tests: '用 label、split、regularisation 同 gradient，講清正在解乜問題。',
        description: '檢查問題定義、時間邊界同 implementation 後，再決定要唔要加大模型。避免分數變好，卻把問題問錯。',
        action: '由訓練問題開始'
      },
      'zh-TW': {
        title: '訓練、標籤與模型失敗邊界',
        tests: '用 label、split、regularisation 與 gradient，說清正在解什麼問題。',
        description: '檢查問題定義、時間邊界與 implementation 後，再決定是否加大模型。避免分數變好，卻把問題問錯。',
        action: '從訓練問題開始'
      },
      'zh-Hans': {
        title: '训练、标签与模型失败边界',
        tests: '用 label、split、regularisation 与 gradient，说清正在解决什么问题。',
        description: '检查问题定义、时间边界与 implementation 后，再决定是否加大模型。避免分数变好，却把问题问错。',
        action: '从训练问题开始'
      },
      en: {
        title: 'Training, labels and model failure boundaries',
        tests: 'Use labels, splits, regularisation and gradients to state the problem you are actually solving.',
        description: 'Check the problem definition, time boundary and implementation before reaching for a larger model. The point is not to recite terms; it is to avoid a better score on the wrong question.',
        action: 'Start with the training question'
      }
    }
  },
  {
    id: 'retrieval-and-agent-controls',
    topicNumbers: ['20', '21', '22', '23', '24', '59'],
    copy: {
      'zh-HK': {
        title: '檢索與 Agent 控制',
        tests: '用負責人、權限、終止狀態同到期規則，控制有狀態嘅流程。',
        description: '文件衝突、權限遺失或 Agent 卡住時，先睇控制面。講清 rerank 解到乜、工具可做乜、記憶幾時失效。',
        action: '由控制問題開始'
      },
      'zh-TW': {
        title: '檢索與 Agent 控制',
        tests: '用負責人、權限、終止狀態與到期規則，控制有狀態的流程。',
        description: '文件衝突、權限遺失或 Agent 卡住時，先看控制面。說清 rerank 解決什麼、工具能做什麼、記憶何時失效。',
        action: '從控制問題開始'
      },
      'zh-Hans': {
        title: '检索与 Agent 控制',
        tests: '用负责人、权限、终止状态与到期规则，控制有状态的流程。',
        description: '文件冲突、权限遗失或 Agent 卡住时，先看控制面。说清 rerank 解决什么、工具能做什么、记忆何时失效。',
        action: '从控制问题开始'
      },
      en: {
        title: 'Retrieval and agent controls',
        tests: 'Use ownership, permission, terminal states and expiry to control a stateful workflow.',
        description: 'When documents conflict, a permission is missing, or an agent stalls, diagnose the control plane before tuning a prompt. State what reranking solves, what a tool may do, and when memory expires.',
        action: 'Start with the control question'
      }
    }
  },
  {
    id: 'embedding-index-lifecycle',
    topicNumbers: ['15', '46', '47', '48', '49'],
    copy: {
      'zh-HK': {
        title: 'Embedding、ANN 與索引生命週期',
        tests: '由向量空間、近似搜尋、中繼資料到撤回，講清搜尋結果點樣仍然可追蹤。',
        description: '相似度高唔夠。要講清模型同索引點解要一齊換、ANN 可能漏咗乜、中繼資料點樣回填，以及來源被撤回後查詢點樣停低或改走另一條路。',
        action: '由 embedding 問題開始'
      },
      'zh-TW': {
        title: 'Embedding、ANN 與索引生命週期',
        tests: '從向量空間、近似搜尋、中繼資料到撤回，說清搜尋結果如何仍可追蹤。',
        description: '相似度高還不夠。要說清模型與索引為何一起更換、ANN 可能漏掉什麼、中繼資料如何回填，以及來源被撤回後查詢如何停止或改走另一條路。',
        action: '從 embedding 問題開始'
      },
      'zh-Hans': {
        title: 'Embedding、ANN 与索引生命周期',
        tests: '从向量空间、近似搜索、元数据到撤回，说清搜索结果如何仍可追踪。',
        description: '相似度高还不够。要说清模型与索引为什么一起更换、ANN 可能漏掉什么、元数据如何回填，以及来源被撤回后查询如何停止或改走另一条路。',
        action: '从 embedding 问题开始'
      },
      en: {
        title: 'Embeddings, ANN, and index lifecycle',
        tests: 'Follow a search result from vector space and approximation through metadata and withdrawal, while keeping its provenance inspectable.',
        description: 'Go beyond similarity: explain why a model and index change together, what ANN can miss, how metadata is backfilled, and how a query stops or reroutes after a source is withdrawn.',
        action: 'Start with the embedding question'
      }
    }
  },
  {
    id: 'serving-eval-and-release',
    topicNumbers: ['25', '26', '27', '28', '29', '30', '41', '42', '43', '53', '54', '58'],
    copy: {
      'zh-HK': {
        title: '推論服務、評估與發布決策',
        tests: '用隊列、P99、真人校準同業務指標，判斷可唔可以安全推出。',
        description: '將模型分數接返真人隊列、操作成本同回退做法。要講清死信處理路徑、資料漂移會發出咩訊號，以及安全基線點樣保護使用者。',
        action: '由發布問題開始'
      },
      'zh-TW': {
        title: '推論服務、評估與發布決策',
        tests: '用佇列、P99、人工校準與業務指標，判斷能否安全推出。',
        description: '把模型分數接回人工佇列、操作成本與回退做法。要說清死信處理路徑、資料漂移會發出什麼訊號，以及安全基線如何保護使用者。',
        action: '從發布問題開始'
      },
      'zh-Hans': {
        title: '推理服务、评估与发布决策',
        tests: '用队列、P99、人工校准与业务指标，判断能否安全推出。',
        description: '把模型分数接回人工队列、操作成本与回退做法。要说清死信处理路径、数据漂移会发出什么信号，以及安全基线如何保护使用者。',
        action: '从发布问题开始'
      },
      en: {
        title: 'Serving, evaluation and release decisions',
        tests: 'Use queues, P99, human calibration and business measures to judge whether a release is safe.',
        description: 'Connect the model score to a human queue, operating cost and rollback. This route asks for a dead-letter path, which data changes should trigger investigation, and how a safe baseline protects people using the system.',
        action: 'Start with the release question'
      }
    }
  },
  {
    id: 'multimodal-and-portfolio-evidence',
    topicNumbers: ['31', '32', '50', '51', '52'],
    copy: {
      'zh-HK': {
        title: '多模態輸入與作品集證據',
        tests: '面對語音、OCR 或視覺欄位時，保留證據區域、轉換紀錄、模態切片同可檢查嘅失敗反例。',
        description: '將文字抽取、視覺判斷、圖片轉換、不確定性、人工交接同作品集主張分開。審閱者應該睇得到幾時要停、點樣重播，出錯後由邊度修正。',
        action: '由證據問題開始'
      },
      'zh-TW': {
        title: '多模態輸入與作品集證據',
        tests: '面對語音、OCR 或視覺欄位時，保留證據區域、轉換紀錄、模態切片與可檢查的失敗反例。',
        description: '把文字抽取、視覺判斷、圖片轉換、不確定性、人工交接與作品集主張分開。審閱者應該看得到何時要停止、如何重播，以及出錯後從哪裡修正。',
        action: '從證據問題開始'
      },
      'zh-Hans': {
        title: '多模态输入与作品集证据',
        tests: '面对语音、OCR 或视觉字段时，保留证据区域、转换记录、模态切片与可检查的失败反例。',
        description: '把文字提取、视觉判断、图片转换、不确定性、人工交接与作品集主张分开。审阅者应该看得到何时要停止、如何重播，以及出错后从哪里修正。',
        action: '从证据问题开始'
      },
      en: {
        title: 'Multimodal inputs and portfolio evidence',
        tests: 'Keep evidence regions, transform receipts, modality slices, and inspectable failure counterexamples for voice, OCR, and visual fields.',
        description: 'Separate text extraction, visual claims, image transforms, uncertainty, human handoff, and a portfolio claim. When you finish, a reviewer should be able to see where to stop, how to replay the work, and where to correct an error.',
        action: 'Start with the evidence question'
      }
    }
  }
]) as unknown as InterviewCapabilityGroup[];

export function getInterviewTopics(numbers: string[]) {
  return numbers.map(number => {
    const topic = interviewTopics.find(candidate => candidate.number === number);
    if (!topic) throw new Error(`Interview Lab references an unknown topic: ${number}`);
    return topic;
  });
}

export function getInterviewTopic(slug: string) {
  return interviewTopics.find(topic => topic.slug === slug);
}

export function interviewPracticePath(locale: Locale, topic: InterviewTopic) {
  return `/${locale}/interview-lab/${topic.slug}`;
}

export function extractInterviewTopicMarkdown(body: string, topic: InterviewTopic) {
  const heading = new RegExp(`^## .+\\{#${topic.anchor}\\}\\s*$`, 'm');
  const match = heading.exec(body);
  if (!match || match.index === undefined) {
    throw new Error(`Could not find Interview Lab topic ${topic.anchor}`);
  }

  const afterHeading = body.slice(match.index + match[0].length);
  const nextTopic = afterHeading.search(/\n## /);
  return (nextTopic === -1 ? afterHeading : afterHeading.slice(0, nextTopic)).trim();
}

export const interviewLabCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  intro: string;
  count: string;
  groupLabel: string;
  testsLabel: string;
  practiceLabel: string;
  useTitle: string;
  useSteps: string[];
  boundaryTitle: string;
  boundary: string;
  navigatorAction: string;
  mapAction: string;
  deckAction: string;
}> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '面試練習',
    title: 'AI Engineer 面試練習：一次一題，講清你點樣判斷',
    intro: '59 條練習題分成十組能力。每次只練一條：答一次，再搵返漏咗嘅原理、取捨或失敗情況，最後攞出一份 README、測試或決策紀錄支持你講嘅嘢。',
    count: '條問題',
    groupLabel: '按能力揀題',
    testsLabel: '呢組會追問乜嘢',
    practiceLabel: '打開呢條題',
    useTitle: '一條題，點樣練得落手',
    useSteps: ['揀同目標角色最接近嘅一組能力，開一題。', '用 90 秒按自己嘅做法答一次。重聽或重讀時，搵返漏咗嘅原理、取捨或停下條件。', '攞出一份 README、測試案例或決策紀錄，講清人哋可以點樣追問。'],
    boundaryTitle: '範圍說明',
    boundary: '呢個係 AI.DOG 的練習，圍繞公開可見嘅常見主題安排。每條題目只用嚟練習機制、取捨、失敗邊界同可展示證據；唔代表任何公司嘅真題、逐間公司嘅題庫，亦唔會預測現時面試流程。',
    navigatorAction: '按能力揀問題',
    mapAction: '閱讀能力地圖',
    deckAction: '由第一條問題開始'
  },
  'zh-TW': {
    eyebrow: '面試練習',
    title: 'AI Engineer 面試練習：一次一題，講清你怎麼想',
    intro: '59 條練習問題分成十組能力。每一題都從一個只答對一半的回答開始，再帶你補回原理、取捨、可能失手的情況，以及你做過什麼可以支持說法。',
    count: '條問題',
    groupLabel: '能力路線',
    testsLabel: '這組會追問什麼',
    practiceLabel: '打開這條問題',
    useTitle: '一條題，怎麼練得下去',
    useSteps: ['選和目標職務最接近的一組能力，開一題。', '用 90 秒按自己的做法回答一次。重聽或重讀時，找出漏掉的原理、取捨或停止條件。', '拿出 README、測試案例或決策紀錄，指出一樣別人可以追問的東西。'],
    boundaryTitle: '範圍說明',
    boundary: '這是 AI.DOG 的練習，圍繞公開可見的常見主題安排。每題只用來練習機制、取捨、失敗邊界與可展示證據；不代表任何公司的真題、逐間公司的題庫，也不預測現行面試流程。',
    navigatorAction: '依能力選問題',
    mapAction: '閱讀能力地圖',
    deckAction: '從第一條問題開始'
  },
  'zh-Hans': {
    eyebrow: '面试练习',
    title: 'AI Engineer 面试练习：一次一题，讲清你怎么想',
    intro: '59 条练习问题分成十组能力。每一题都从一个只答对一半的回答开始，再带你补回原理、取舍、可能失手的情况，以及你做过什么可以支持说法。',
    count: '条问题',
    groupLabel: '按能力选题',
    testsLabel: '这组会追问什么',
    practiceLabel: '打开这条问题',
    useTitle: '一条题，怎么练得下去',
    useSteps: ['选和目标职位最接近的一组能力，开一题。', '用 90 秒按自己的做法回答一次。重听或重读时，找出漏掉的原理、取舍或停止条件。', '拿出 README、测试案例或决策记录，指出一样别人可以追问的东西。'],
    boundaryTitle: '范围说明',
    boundary: '这是 AI.DOG 的练习，围绕公开可见的常见主题安排。每道题只用来练习机制、取舍、失败边界与可展示证据；不代表任何公司的真题、逐间公司的题库，也不预测当前面试流程。',
    navigatorAction: '按能力选问题',
    mapAction: '阅读能力地图',
    deckAction: '从第一条问题开始'
  },
  en: {
    eyebrow: 'INTERVIEW LAB',
    title: 'AI Engineer Interview Practice: one question at a time',
    intro: 'Fifty-nine practice questions sit in ten capability groups. Each starts with an answer that is only partly right, then helps you fill in the principle, trade-off, failure case, and work that supports what you say.',
    count: 'questions',
    groupLabel: 'Capability route',
    testsLabel: 'What this tests',
    practiceLabel: 'Read this question',
    useTitle: 'How to make one question useful',
    useSteps: ['Choose the capability group closest to your target role and open one question.', 'Answer for 90 seconds in your own words. On a second pass, find the principle, trade-off, or stop condition you missed.', 'Open a README, test case, or decision record and point to one thing an interviewer could ask about.'],
    boundaryTitle: 'Scope note',
    boundary: 'These AI.DOG exercises are organised around publicly visible recurring topics. Each is for practising mechanism, trade-offs, failure boundaries, and inspectable evidence; none is presented as a company question, company-by-company bank, or current interview process.',
    navigatorAction: 'Choose a question by capability',
    mapAction: 'Read the capability map',
    deckAction: 'Start with the first question'
  }
});
