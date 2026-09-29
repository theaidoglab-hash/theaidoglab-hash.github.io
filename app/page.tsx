import RootLocaleRedirect from '@/components/root-locale-redirect';

/**
 * Keep a server-rendered document at / for static hosting, while the client
 * child chooses a remembered or browser-preferred locale after hydration.
 */
export default function Root() {
  return <RootLocaleRedirect />;
}
