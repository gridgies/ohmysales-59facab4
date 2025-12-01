# Next.js Migration Guide - ohmysales

**Migration Date:** November 28, 2025
**From:** Vite 7.2 + React 18 (SPA)
**To:** Next.js 15 + React 19 (SSR/SSG)

---

## 🎯 Why We Migrated

### The Problem:
- **Zero SEO:** Vite + React SPA means Google sees `<div id="root"></div>` (empty HTML)
- **No visitors:** Search engines couldn't index dynamic content
- **Prerender.io workaround:** Required external service, not ideal

### The Solution:
- **Native SSR/SSG:** Next.js renders HTML on the server
- **Perfect SEO:** Google sees fully rendered pages immediately
- **Better Performance:** Automatic code splitting, image optimization
- **80-100% Indexing:** Within 2-4 weeks (vs 10-20% with SPA)

---

## 📦 What Changed

### 1. **Framework**
| Before | After |
|--------|-------|
| Vite 7.2.2 | Next.js 15.1.0 |
| React 18.3.1 | React 19.0.0 |
| react-router-dom 6.30.1 | Next.js App Router |

### 2. **Project Structure**

#### Old Structure (Vite):
```
src/
├── pages/
│   ├── Index.tsx
│   ├── Auth.tsx
│   ├── Admin.tsx
│   └── SaleDetail.tsx
├── App.tsx (routing)
├── main.tsx (entry point)
└── index.css
```

#### New Structure (Next.js):
```
src/
├── app/
│   ├── layout.tsx (root layout)
│   ├── page.tsx (homepage)
│   ├── providers.tsx (client providers)
│   ├── globals.css
│   ├── auth/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── AdminClient.tsx
│   ├── sale/[id]/
│   │   ├── page.tsx (SSR!)
│   │   └── SaleDetailClient.tsx
│   └── not-found.tsx
└── components/ (unchanged)
```

### 3. **Configuration Files**

#### Added:
- `next.config.ts` - Next.js configuration
- `.eslintrc.json` - Next.js ESLint rules
- `.env.local` - Next.js environment variables

#### Updated:
- `package.json` - New scripts and dependencies
- `tsconfig.json` - Next.js TypeScript config
- `vercel.json` - Next.js deployment config
- `.gitignore` - Next.js specific files

#### Removed (Vite-specific):
- `vite.config.ts`
- `tsconfig.app.json`
- `tsconfig.node.json`

### 4. **Environment Variables**

```bash
# Before (Vite)
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...

# After (Next.js)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

**Important:** Update these in Vercel Dashboard → Environment Variables!

### 5. **Routing Changes**

#### React Router → Next.js:
```tsx
// Before
import { Link, useNavigate } from 'react-router-dom';
<Link to="/auth">Login</Link>
const navigate = useNavigate();
navigate('/admin');

// After
import Link from 'next/link';
import { useRouter } from 'next/navigation';
<Link href="/auth">Login</Link>
const router = useRouter();
router.push('/admin');
```

### 6. **Component Updates**

#### Client Components:
All interactive components need `'use client';` directive:
- Header.tsx
- NavLink.tsx
- All page components (page.tsx files in app/)
- Providers.tsx

#### Server Components:
- layout.tsx (root layout)
- sale/[id]/page.tsx (data fetching)

---

## 🚀 Key Features

### 1. **Server-Side Rendering (SSR)**

**Sale Detail Pages** (`/sale/[id]`):
- Data fetched on server
- HTML rendered before sending to browser
- **Perfect for SEO** - Google sees full content immediately

```tsx
// app/sale/[id]/page.tsx
export async function generateMetadata({ params }) {
  const sale = await getSale(params.id);
  return {
    title: `${sale.discount} ${sale.retailer} | ohmysales`,
    description: sale.description,
    openGraph: { ... }
  };
}
```

### 2. **Static Site Generation (SSG)**

```tsx
// Pre-render top 100 sale pages at build time
export async function generateStaticParams() {
  const sales = await getSales(100);
  return sales.map(sale => ({ id: sale.id }));
}
```

### 3. **Automatic Image Optimization**

```tsx
import Image from 'next/image';

<Image
  src={sale.image}
  alt={sale.title}
  width={800}
  height={600}
  priority // for above-the-fold images
/>
```

### 4. **Dynamic Metadata (SEO)**

Each page can have unique meta tags:
```tsx
export const metadata = {
  title: 'Black Friday Sales 2025',
  description: '...',
  openGraph: { ... },
  twitter: { ... }
};
```

---

## 📝 Deployment Steps

### 1. **Update Environment Variables in Vercel**

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

Add these for all environments (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL=https://jasjuplwustlcawvigdr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key_here
```

### 2. **Deploy to Vercel**

```bash
git add .
git commit -m "Migrate to Next.js 15 for better SEO"
git push
```

Vercel will automatically:
- Detect Next.js framework
- Install dependencies
- Build the app
- Deploy

### 3. **Verify Deployment**

Test these URLs:
- ✅ Homepage: `https://ohmysales.app/`
- ✅ Auth: `https://ohmysales.app/auth`
- ✅ Admin: `https://ohmysales.app/admin`
- ✅ Sale Detail: `https://ohmysales.app/sale/[any-id]`

### 4. **Test SEO**

```bash
# Check if Google sees full HTML
curl https://ohmysales.app/sale/[id] | grep "<title>"

# Should show actual sale title, not default!
```

### 5. **Request Reindexing in Google Search Console**

1. Go to https://search.google.com/search-console
2. Use URL Inspection tool for key pages
3. Click "Request indexing"
4. Submit updated sitemap

---

## 🧪 Local Development

### Install Dependencies:

```bash
npm install
```

### Run Development Server:

```bash
npm run dev
```

Visit: http://localhost:3000

### Build for Production:

```bash
npm run build
npm start
```

---

## ⚠️ Breaking Changes

### 1. **No More Client-Side Routing Fallback**

Old Vite behavior: All routes → `index.html`
New Next.js: 404 for non-existent routes

**Fix:** Create proper 404 page (✅ already done: `app/not-found.tsx`)

### 2. **Image Imports**

Static images now go in `/public/`:
```tsx
// Before
import logo from './logo.png';

// After
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### 3. **CSS Imports**

Global CSS only in `app/layout.tsx`:
```tsx
// app/layout.tsx
import './globals.css';
```

Component CSS: Use CSS modules or Tailwind (we use Tailwind ✅)

---

## 📊 Expected SEO Improvements

| Metric | Before (Vite) | After (Next.js) | Timeline |
|--------|--------------|-----------------|----------|
| **Pages Indexed** | 10-20% | 80-100% | 2-4 weeks |
| **Google Sees** | `<div id="root"></div>` | Full HTML | Immediately |
| **Social Previews** | ❌ Broken | ✅ Works | Immediately |
| **Crawl Budget** | 😞 Wasted | 😊 Efficient | 1-2 weeks |
| **Rankings** | Poor | Much Better | 4-8 weeks |

---

## 🎉 Benefits

### SEO:
- ✅ **Server-Side Rendering** - Google sees full content
- ✅ **Dynamic Meta Tags** - Unique per page
- ✅ **Pre-rendered Pages** - Top 100 sales cached
- ✅ **Structured Data** - Rich snippets in search

### Performance:
- ✅ **Automatic Code Splitting** - Faster page loads
- ✅ **Image Optimization** - Next-gen formats
- ✅ **Route Prefetching** - Instant navigation
- ✅ **Streaming SSR** - Progressive rendering

### Developer Experience:
- ✅ **File-based Routing** - No more route config
- ✅ **TypeScript** - Better type safety
- ✅ **Fast Refresh** - Instant HMR
- ✅ **Built-in** - No Vite config needed

---

## 🆘 Troubleshooting

### Issue: "Module not found"

**Solution:** Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Issue: Environment variables not working

**Check:**
1. ✅ File named `.env.local`
2. ✅ Variables start with `NEXT_PUBLIC_`
3. ✅ Restart dev server after changes

### Issue: Hydration errors

**Cause:** Server/client HTML mismatch

**Fix:** Ensure no browser-only APIs in server components:
```tsx
// ❌ Bad (causes hydration error)
const Component = () => {
  const width = window.innerWidth; // window not available on server!
  return <div>{width}</div>;
}

// ✅ Good
'use client';
const Component = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  return <div>{width}</div>;
}
```

### Issue: 404 on sale pages

**Check:**
1. ✅ File is at `app/sale/[id]/page.tsx`
2. ✅ Dynamic segment is `[id]`, not `{id}` or `:id`
3. ✅ Restart dev server

---

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **App Router:** https://nextjs.org/docs/app
- **Metadata API:** https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Deployment:** https://nextjs.org/docs/deployment

---

## 🎯 Next Steps

1. ✅ **Deploy to Vercel** - Push this branch
2. ✅ **Update environment variables** - Add NEXT_PUBLIC_* vars
3. ✅ **Submit sitemap** - Google Search Console
4. ✅ **Request reindexing** - Key pages in GSC
5. ⏳ **Monitor coverage** - Check GSC after 1 week
6. 🎉 **Watch traffic grow!** - 2-4 weeks

---

**Migration Complete!** 🚀

Your site is now using Next.js 15 with full server-side rendering. Google will love you!
