import { LOCALES, type CategoryId, type Locale } from './types';

export const ui = {
  'zh-HK': { name:'香港繁體', shortName:'香港', brand:'AI.DOG 職涯資源庫', nav:['開始這裡','文章','資源','關於'], hero:'由「識用 AI」走到「證明你能交付」', intro:'為準備進入澳洲 AI／Data 職場的技術人才，拆解職位、作品證據與專業工作流程。', browse:'選一條路開始', latest:'深度指南', read:'閱讀指南', search:'搜尋文章、技術或職位', noResults:'找不到相符內容。', waitlist:'收到新指南通知', email:'電郵地址', join:'加入 waitlist', consent:'我同意 AI.DOG 使用此電郵通知我新資源；不會要求 CV 或僱主資料。', success:'已收到。正式通知功能會在私隱設定獲批准後啟用。', source:'來源與版本', download:'下載資源', updated:'更新', privacy:'私隱', about:'關於 AI.DOG' },
  'zh-TW': { name:'台灣繁體', shortName:'台灣', brand:'AI.DOG 職涯資源庫', nav:['從這裡開始','文章','資源','關於'], hero:'從「會使用 AI」走到「證明你能交付」', intro:'為準備進入澳洲 AI／Data 職場的技術人才，拆解職務、作品集證據與專業工作流程。', browse:'選一條路開始', latest:'深度指南', read:'閱讀指南', search:'搜尋文章、技術或職務', noResults:'找不到符合的內容。', waitlist:'接收新指南通知', email:'電子郵件地址', join:'加入候補名單', consent:'我同意 AI.DOG 使用此電子郵件通知我新資源；不會要求履歷或雇主資料。', success:'已收到。正式通知功能會在隱私設定核准後啟用。', source:'來源與版本', download:'下載資源', updated:'更新', privacy:'隱私', about:'關於 AI.DOG' },
  'zh-Hans': { name:'简体中文', shortName:'简体', brand:'AI.DOG 职业资源库', nav:['从这里开始','文章','资源','关于'], hero:'从“会用 AI”走到“证明你能交付”', intro:'面向准备进入澳洲 AI／Data 职场的技术人才，拆解职位、作品证据与专业工作流程。', browse:'选择一条路线', latest:'深度指南', read:'阅读指南', search:'搜索文章、技术或职位', noResults:'没有找到匹配内容。', waitlist:'接收新指南通知', email:'电子邮箱', join:'加入 waitlist', consent:'我同意 AI.DOG 使用此邮箱通知我新资源；不会要求 CV 或雇主资料。', success:'已收到。正式通知功能会在隐私设置获批准后启用。', source:'来源与版本', download:'下载资源', updated:'更新', privacy:'隐私', about:'关于 AI.DOG' },
  en: { name:'English', shortName:'EN', brand:'AI.DOG Career Library', nav:['Start here','Articles','Resources','About'], hero:'Move from “I can use AI” to “I can prove I deliver”', intro:'Detailed role analysis, portfolio evidence and professional workflows for technical people entering Australia’s AI and data market.', browse:'Choose your path', latest:'Deep guides', read:'Read guide', search:'Search articles, skills or roles', noResults:'No matching content found.', waitlist:'Get new guide updates', email:'Email address', join:'Join waitlist', consent:'I agree that AI.DOG may use this email to notify me about new resources. No CV or employer details will be requested.', success:'Received. Notifications will only activate after the privacy setup is approved.', source:'Sources and version', download:'Download resources', updated:'Updated', privacy:'Privacy', about:'About AI.DOG' }
} satisfies Record<Locale, Record<string, string | string[]>>;

export const categories: Record<CategoryId, Record<Locale, {name:string; description:string}>> = {
  'australia-ai-career': {'zh-HK':{name:'澳洲 AI 職涯',description:'理解市場限制、入行次序與求職現實。'},'zh-TW':{name:'澳洲 AI 職涯',description:'理解市場限制、入行順序與求職現況。'},'zh-Hans':{name:'澳洲 AI 职业',description:'理解市场限制、入行顺序与求职现实。'},en:{name:'Australian AI Careers',description:'Understand market constraints, entry routes and the reality of the work.'}},
  'roles-pathways': {'zh-HK':{name:'職位與入行路線',description:'按工作輸出分辨 Data、ML、AI Application、Platform 與 FDE。'},'zh-TW':{name:'職務與入行路線',description:'依工作產出分辨 Data、ML、AI Application、Platform 與 FDE。'},'zh-Hans':{name:'职位与入行路线',description:'按工作产出区分 Data、ML、AI Application、Platform 与 FDE。'},en:{name:'Roles & Pathways',description:'Choose a route by the work you will deliver, not the job title alone.'}},
  'portfolio-evidence': {'zh-HK':{name:'作品集證據',description:'把能運行的 demo 變成可檢查、可追問的能力證據。'},'zh-TW':{name:'作品集證據',description:'把能執行的 demo 變成可檢查、可追問的能力證據。'},'zh-Hans':{name:'作品集证据',description:'把能运行的 demo 变成可检查、可追问的能力证据。'},en:{name:'Portfolio Evidence',description:'Turn a functioning demo into evidence that can survive follow-up questions.'}},
  'professional-workflows': {'zh-HK':{name:'專業 AI 工作流程',description:'由需求、評估到部署，展示實際交付方法。'},'zh-TW':{name:'專業 AI 工作流程',description:'從需求、評估到部署，呈現實際交付方法。'},'zh-Hans':{name:'专业 AI 工作流程',description:'从需求、评估到部署，展示实际交付方法。'},en:{name:'Professional AI Workflows',description:'Show how requirements, evaluation, deployment and review fit together.'}},
  'resources-opportunities': {'zh-HK':{name:'資源與機會',description:'判斷課程、活動與實戰機會是否值得投入。'},'zh-TW':{name:'資源與機會',description:'判斷課程、活動與實作機會是否值得投入。'},'zh-Hans':{name:'资源与机会',description:'判断课程、活动与实践机会是否值得投入。'},en:{name:'Resources & Opportunities',description:'Assess courses, events and practical opportunities before investing time.'}}
};

export function isLocale(value:string): value is Locale { return (LOCALES as readonly string[]).includes(value); }

export function detectLocale(acceptLanguage:string|null, savedLocale?:string):Locale{
  if(savedLocale&&isLocale(savedLocale))return savedLocale;
  const languages=(acceptLanguage??'').toLowerCase().split(',').map(item=>item.trim().split(';')[0]);
  for(const language of languages){
    if(language==='zh-tw'||language.startsWith('zh-hant-tw'))return 'zh-TW';
    if(language==='zh-hk'||language==='zh-mo'||language.startsWith('zh-hant-hk')||language.startsWith('zh-hant-mo'))return 'zh-HK';
    if(language==='zh-hant'||language.startsWith('zh-hant-'))return 'zh-HK';
    if(language==='zh-cn'||language==='zh-sg'||language==='zh-hans'||language.startsWith('zh-hans-'))return 'zh-Hans';
    if(language==='en'||language.startsWith('en-'))return 'en';
  }
  return 'en';
}
