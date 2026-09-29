import { CATEGORY_IDS, LOCALES } from '@/lib/types';
import { hasConfiguredTurnstile } from '@/lib/turnstile';

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request:Request){
  try{
    // Keep this runtime-only import inside the handler. A static Pages export
    // skips API routes and must not ask Node's build-time renderer to resolve
    // the Cloudflare-only module.
    const workerRuntime = `cloudflare:${'workers'}`;
    const { env } = await import(/* @vite-ignore */ workerRuntime) as typeof import('cloudflare:workers');
    if(env.WAITLIST_COLLECTION_APPROVED!=='true')return Response.json({ok:false},{status:503});
    if(!hasConfiguredTurnstile(env))return Response.json({ok:false},{status:503});
    const body=await request.json() as Record<string,unknown>;
    const email=String(body.email||'').trim().toLowerCase(); const locale=String(body.locale||''); const interest=String(body.interest||'');
    if(!emailPattern.test(email)||email.length>254||body.consent!==true||!LOCALES.includes(locale as never)||!CATEGORY_IDS.includes(interest as never)) return Response.json({ok:false},{status:400});
    const token=String(body.turnstileToken||'');
    if(!token)return Response.json({ok:false},{status:400});
    const form=new FormData();form.set('secret',env.TURNSTILE_SECRET_KEY!);form.set('response',token);const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});const result=await check.json() as {success?:boolean};if(!result.success)return Response.json({ok:false},{status:400});
    if(!env.WAITLIST_DB)return Response.json({ok:false},{status:503});
    // Do not persist a client-controlled pathname or referrer. The current
    // schema requires a non-null source field, so retain the deliberately
    // non-identifying root marker until an owner-approved measurement policy
    // defines a lawful, documented source model.
    const now=new Date().toISOString(); const sourcePath='/';
    await env.WAITLIST_DB.prepare('INSERT OR IGNORE INTO waitlist_entries (id,email,locale,interest,consent_at,source_path,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),email,locale,interest,now,sourcePath,now).run();
    return Response.json({ok:true},{status:200});
  }catch{return Response.json({ok:false},{status:400});}
}
