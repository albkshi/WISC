import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css'; // Global styles

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'World Islamic Call Society - Sarajevo | جمعية الدعوة الإسلامية العالمية',
  description: 'The official representation of the World Islamic Call Society in Bosnia and Herzegovina (Sarajevo): Islamic heritage, historic mosques of Bosnia, regional news, cultural dialogue, and official contacts.',
  openGraph: {
    title: 'World Islamic Call Society - Sarajevo | جمعية الدعوة الإسلامية العالمية',
    description: 'The official representation of the World Islamic Call Society in Bosnia and Herzegovina (Sarajevo): Islamic heritage, historic mosques of Bosnia, regional news, cultural dialogue, and official contacts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Islamic Call Society - Sarajevo | جمعية الدعوة الإسلامية العالمية',
    description: 'The official representation of the World Islamic Call Society in Bosnia and Herzegovina (Sarajevo): Islamic heritage, historic mosques of Bosnia, regional news, cultural dialogue, and official contacts.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body suppressHydrationWarning className={`${cairo.className} font-cairo`}>
        {children}
      </body>
    </html>
  );
}
