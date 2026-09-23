import type { Metadata } from 'next';
import './globals.css';

export const metadata:Metadata={
  metadataBase:new URL(process.env.SITE_ORIGIN||'https://preview.invalid'),
  title:{default:'AI.DOG Career Library',template:'%s · AI.DOG'},
  description:'Localized, evidence-led guides for Australian AI careers, portfolio building and professional workflows.',
  robots:{index:false,follow:false},
  openGraph:{title:'AI.DOG Career Library',description:'From AI demos to evidence of delivery.',type:'website'}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
