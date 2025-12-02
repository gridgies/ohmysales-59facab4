import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anmelden | ohmysales',
  description: 'Melden Sie sich bei Ihrem ohmysales Konto an',
  robots: 'noindex, nofollow', // Don't index auth pages to prevent redirect errors in Google Search Console
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
