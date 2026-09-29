const LOCAL_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

type TurnstileConfiguration = {
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
};

function isConfiguredValue(value: string | undefined) {
  const normalized = value?.trim() ?? '';
  return Boolean(normalized)
    && normalized !== LOCAL_TURNSTILE_SITE_KEY
    && !/^(replace|placeholder|example)/i.test(normalized);
}

export function hasConfiguredTurnstile(configuration: TurnstileConfiguration) {
  return isConfiguredValue(configuration.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
    && isConfiguredValue(configuration.TURNSTILE_SECRET_KEY);
}

export { LOCAL_TURNSTILE_SITE_KEY };
