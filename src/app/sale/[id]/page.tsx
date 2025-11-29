import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import SaleDetailClient from './SaleDetailClient';

// Initialize Supabase client for server-side data fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Sale {
  id: string;
  retailer: string;
  logo: string;
  image: string | null;
  title: string;
  discount: string;
  code: string | null;
  start_date: string;
  end_date: string;
  url: string;
  featured: boolean;
  category: string;
  created_at: string;
}

// Generate dynamic metadata for SEO (This is the magic!)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data: sale } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .single();

  if (!sale) {
    return {
      title: 'Sale nicht gefunden | ohmysales',
      description: 'Dieser Sale wurde nicht gefunden.',
    };
  }

  const description = `${sale.discount} bei ${sale.retailer}! ${sale.title}. Jetzt sparen auf ohmysales.app`;

  return {
    title: `${sale.discount} ${sale.retailer} Sale | ohmysales`,
    description,
    openGraph: {
      title: `${sale.discount} ${sale.retailer} | ohmysales`,
      description: `${sale.title} - Spare jetzt ${sale.discount} bei ${sale.retailer}!`,
      images: sale.image ? [{ url: sale.image }] : [],
      url: `https://ohmysales.app/sale/${sale.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sale.discount} ${sale.retailer} Sale`,
      description: `${sale.title} - Spare jetzt ${sale.discount}!`,
      images: sale.image ? [sale.image] : [],
    },
    alternates: {
      canonical: `https://ohmysales.app/sale/${sale.id}`,
    },
  };
}

// Server-side data fetching
async function getSale(id: string): Promise<Sale | null> {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data as Sale;
}

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = await getSale(id);

  if (!sale) {
    notFound();
  }

  // Pass the server-fetched sale data to the client component
  return <SaleDetailClient initialSale={sale} />;
}

// Optional: Generate static params for better performance
// This tells Next.js which sale pages to pre-render at build time
export async function generateStaticParams() {
  const { data: sales } = await supabase
    .from('sales')
    .select('id')
    .limit(100); // Limit to top 100 sales for build time

  if (!sales) return [];

  return sales.map((sale) => ({
    id: sale.id,
  }));
}
