import { redirect } from 'next/navigation';

export default async function LegacyTraditionalRedirect({params}:{params:Promise<{path?:string[]}>}){
  const {path=[]}=await params;
  redirect(`/zh-HK${path.length?`/${path.join('/')}`:''}`);
}
