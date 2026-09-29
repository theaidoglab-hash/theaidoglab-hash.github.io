import './globals.css';

/**
 * App Router requires one document root. Locale-specific layout stays inside
 * this shell so the static export does not produce nested html/body elements.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
