declare module 'cloudflare:workers' {
  export const env: {
    WAITLIST_DB?: D1Database;
    TURNSTILE_SECRET_KEY?: string;
    TURNSTILE_SITE_KEY?: string;
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
    WAITLIST_COLLECTION_APPROVED?: string;
    SITE_ORIGIN?: string;
  };
}
