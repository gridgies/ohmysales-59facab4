/**
 * Dynamic Sitemap Generator for ohmysales.app
 *
 * Generates a sitemap.xml with:
 * - Homepage
 * - Individual sale pages
 * - Auth page
 *
 * Run with: node scripts/generate-sitemap.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available and valid
const hasValidCredentials = supabaseUrl && supabaseKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl !== 'YOUR_SUPABASE_URL';

const supabase = hasValidCredentials ? createClient(supabaseUrl, supabaseKey) : null;

const BASE_URL = 'https://ohmysales.app';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function createSlug(title, retailer) {
  const text = `${retailer} ${title}`.toLowerCase();
  return text
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateSitemap() {
  let sales = [];

  if (!hasValidCredentials) {
    console.log('⚠️  Supabase credentials not available - generating minimal sitemap');
    console.log('   (This is normal during Vercel builds without environment variables)');
  } else {
    console.log('Fetching sales from Supabase...');

    // Fetch all active sales
    const { data, error } = await supabase
      .from('sales')
      .select('id, title, retailer, updated_at')
      .is('is_manually_expired', false)
      .gte('end_date', new Date().toISOString().split('T')[0])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error);
      console.log('⚠️  Generating minimal sitemap without sale pages');
    } else {
      sales = data || [];
      console.log(`Found ${sales.length} active sales`);
    }
  }

  const now = formatDate(new Date());

  // Build sitemap XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/"/>
  </url>

  <!-- Auth Page -->
  <url>
    <loc>${BASE_URL}/auth</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/auth"/>
  </url>

  <!-- Individual Sale Pages -->
`;

  // Add each sale page
  if (sales && sales.length > 0) {
    for (const sale of sales) {
      const slug = createSlug(sale.title, sale.retailer);
      const lastmod = sale.updated_at ? formatDate(new Date(sale.updated_at)) : now;

      xml += `  <url>
    <loc>${BASE_URL}/sale/${sale.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/sale/${sale.id}"/>
  </url>
`;
    }
  }

  xml += `</urlset>
`;

  // Write to public/sitemap.xml
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${(sales?.length || 0) + 2}`);
  console.log(`\nSubmit to Google Search Console:`);
  console.log(`${BASE_URL}/sitemap.xml`);
}

generateSitemap().catch(console.error);
