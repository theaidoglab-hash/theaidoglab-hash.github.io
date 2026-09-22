declare module 'cloudflare:workers' {
  export const env: {
    WAITLIST_DB?: D1Database;
    TURNSTILE_SECRET_KEY?: string;
    TURNSTILE_SITE_KEY?: string;
    SITE_ORIGIN?: string;
  };
}
