import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export const metadata: Metadata = {
  title: 'Black Friday Fashion Sales 2025 | Spare bis zu 70% | ohmysales',
  description: 'Die besten Black Friday Fashion Sales 2025! Entdecke exklusive Mode Angebote und Rabattcodes. Spare bis zu 70% bei H&M, Zara, Zalando & mehr. Black Friday Deals täglich aktualisiert.',
  keywords: 'black friday mode deutschland, black friday fashion sales, black friday angebote kleidung, black friday deals mode, black friday rabattcodes, cyber monday mode, fashion black friday, mode schnäppchen black friday, black friday zalando, black friday h&m, black friday zara, designer sale black friday, marken sale black friday, black friday shopping deutschland, mode rabatte black friday, kleidung sale black friday, fashion deals black friday, black friday gutscheine mode, premium fashion black friday, online shopping black friday, fashion rabattcodes, designer schnäppchen, outlet black friday, sale mode, rabatte mode, fashion sale deutschland, mode angebote, kleidung rabatte, sale kleidung, fashion outlet, designer mode sale',
  authors: [{ name: 'ohmysales' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: 'https://ohmysales.app/',
  },
  openGraph: {
    type: 'website',
    url: 'https://ohmysales.app/',
    title: 'Black Friday Fashion Sales 2025 | ohmysales',
    description: 'Die besten Black Friday Mode Deals 2025! Spare bis zu 70% bei Premium Fashion Brands. Täglich aktualisierte Black Friday Sales.',
    images: [
      {
        url: 'https://lovable.dev/opengraph-image-p98pqg.png',
        width: 1200,
        height: 630,
        alt: 'ohmysales - Black Friday Fashion Sales 2025',
      },
    ],
    locale: 'de_DE',
    siteName: 'ohmysales',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Black Friday Fashion Sales 2025 | ohmysales',
    description: 'Die besten Black Friday Mode Deals 2025! Spare bis zu 70% bei Premium Fashion Brands.',
    images: ['https://lovable.dev/opengraph-image-p98pqg.png'],
  },
  other: {
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'geo.region': 'DE',
    'geo.placename': 'Deutschland',
    'language': 'de',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17719922793"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17719922793');
            `,
          }}
        />

        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ohmysales',
              alternateName: 'Oh My Sales',
              url: 'https://ohmysales.app/',
              description: 'Black Friday Fashion Sales und Rabattcodes für Deutschland 2025',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://ohmysales.app/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              inLanguage: 'de-DE',
              audience: {
                '@type': 'Audience',
                geographicArea: {
                  '@type': 'Country',
                  name: 'Deutschland',
                },
              },
            }),
          }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ohmysales',
              url: 'https://ohmysales.app/',
              logo: 'https://ohmysales.app/favicon.ico',
              description: 'Die beste Plattform für Black Friday Fashion Sales und Rabattcodes in Deutschland',
              areaServed: 'DE',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Black Friday Fashion Sales & Rabattcodes',
                itemListElement: [
                  {
                    '@type': 'OfferCatalog',
                    name: 'Black Friday Damen Mode Sales',
                    description: 'Premium Black Friday Sales für Damenmode',
                  },
                  {
                    '@type': 'OfferCatalog',
                    name: 'Black Friday Herren Mode Sales',
                    description: 'Premium Black Friday Sales für Herrenmode',
                  },
                  {
                    '@type': 'OfferCatalog',
                    name: 'Black Friday Accessoires Sales',
                    description: 'Premium Black Friday Sales für Mode-Accessoires',
                  },
                ],
              },
            }),
          }}
        />

        {/* Structured Data - Event */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: 'Black Friday Fashion Sales 2025',
              description: 'Die besten Black Friday Mode Angebote und Rabattcodes bei ohmysales',
              startDate: '2025-11-22',
              endDate: '2025-12-02',
              eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
              eventStatus: 'https://schema.org/EventScheduled',
              location: {
                '@type': 'VirtualLocation',
                url: 'https://ohmysales.app/',
              },
              organizer: {
                '@type': 'Organization',
                name: 'ohmysales',
                url: 'https://ohmysales.app/',
              },
            }),
          }}
        />

        {/* Structured Data - FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Was ist ohmysales?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ohmysales ist die beste Plattform für Fashion Sales und Rabattcodes in Deutschland. Wir sammeln täglich die besten Mode-Angebote von Premium-Marken wie H&M, Zara, Zalando und vielen mehr. Spare bis zu 70% bei Black Friday und das ganze Jahr über.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Wann ist Black Friday 2025?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Black Friday 2025 findet am 28. November statt. Bei ohmysales findest du bereits ab dem 22. November die besten Black Friday Fashion Sales und Cyber Monday Deals bis zum 2. Dezember 2025.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Wie viel kann ich bei Black Friday Fashion Sales sparen?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Bei den besten Black Friday Fashion Sales kannst du bis zu 70% sparen. Die durchschnittlichen Rabatte liegen bei 30-50% auf Mode, Schuhe und Accessoires von Premium-Marken.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Sind die Rabattcodes bei ohmysales aktuell?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ja, alle Sales und Rabattcodes werden täglich aktualisiert und überprüft. Abgelaufene Angebote werden automatisch entfernt, sodass du nur aktuelle Fashion Deals siehst.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Welche Marken bieten Black Friday Sales an?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Fast alle großen Fashion-Marken nehmen an Black Friday teil, darunter H&M, Zara, Zalando, About You, Mango, ASOS, Nike, Adidas und viele Premium-Designer-Marken. Bei ohmysales findest du alle aktuellen Angebote übersichtlich auf einer Plattform.',
                  },
                },
              ],
            }),
          }}
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://jasjuplwustlcawvigdr.supabase.co" />
        <link rel="dns-prefetch" href="https://jasjuplwustlcawvigdr.supabase.co" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
