# Prerender.io Setup Guide for ohmysales.app

**Current Setup:** Vite + React on Vercel
**Goal:** Pre-render pages for search engine crawlers
**Time:** 15-30 minutes
**Cost:** Free (up to 250 pages/month)

---

## 🚀 Quick Setup (Recommended)

### Option A: Use Prerender.io's Vercel Integration (EASIEST)

1. **Go to Vercel Integrations:**
   https://vercel.com/integrations/prerender

2. **Click "Add Integration"**
   - Select your ohmysales project
   - Authorize the integration

3. **Sign up at Prerender.io:**
   - Go to https://prerender.io
   - Create a free account
   - Get your Prerender token from the dashboard

4. **Configure in Vercel:**
   - The integration automatically adds the middleware
   - Add your `PRERENDER_TOKEN` as an environment variable
   - Redeploy your site

5. **Test it works:**
   ```bash
   curl -A "Googlebot" https://ohmysales.app/
   ```
   You should see fully rendered HTML with your sales data.

---

## 📝 Option B: Manual Setup (if integration unavailable)

### Step 1: Sign up for Prerender.io

1. Go to https://prerender.io
2. Sign up for free account
3. Copy your Prerender token from the dashboard

### Step 2: Add Environment Variable to Vercel

1. Go to: https://vercel.com/[your-team]/ohmysales-59facab4/settings/environment-variables
2. Add new variable:
   - **Name:** `PRERENDER_TOKEN`
   - **Value:** Your token from Prerender.io
   - **Environment:** Production, Preview, Development

### Step 3: Update vercel.json

Add this to your `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "framework": null,
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/:path((?!api).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/xml"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "index, follow"
        }
      ]
    }
  ]
}
```

### Step 4: Deploy

```bash
git add .
git commit -m "Add Prerender.io configuration"
git push
```

### Step 5: Recache Pages on Prerender.io

After deployment:
1. Go to Prerender.io dashboard
2. Go to "Recache" section
3. Add these URLs to recache:
   - `https://ohmysales.app/`
   - `https://ohmysales.app/sale/*` (wildcard for all sales)

---

## 🧪 Testing

### Test 1: Check if crawlers get pre-rendered content

```bash
# Test with Googlebot user agent
curl -A "Googlebot" https://ohmysales.app/ | grep -o "<title>[^<]*</title>"

# Should show: <title>Black Friday Fashion Sales 2025 | Spare bis zu 70% | ohmysales</title>
```

### Test 2: Check a sale page

```bash
# Replace [sale-id] with an actual sale ID
curl -A "Googlebot" https://ohmysales.app/sale/[sale-id] | head -50

# Should show full HTML with sale data, not empty div
```

### Test 3: Check with Facebook debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://ohmysales.app/sale/[any-sale-id]`
3. Should show correct title, description, and image (not default)

---

## 📊 Expected Results

### Before Prerender.io:
- Google sees: `<div id="root"></div>` (empty)
- Social media sees: Default meta tags only
- Indexing: ~10-20% of pages

### After Prerender.io:
- Google sees: Full HTML with all content
- Social media sees: Dynamic meta tags with sale info
- Indexing: ~60-80% of pages within 2 weeks

---

## 🔍 Monitoring

### Check Prerender.io Dashboard:

1. **Usage Stats:**
   - How many pages cached
   - How many requests from crawlers
   - Cache hit rate

2. **Recent Renders:**
   - See which pages are being rendered
   - Check for any errors

### Check Google Search Console:

1. **Coverage Report:**
   - Monitor "Valid" pages count
   - Should increase over 1-2 weeks

2. **URL Inspection:**
   - Test individual URLs
   - See if Google can render them

---

## 💰 Pricing

### Free Tier (Perfect for ohmysales):
- ✅ 250 pages cached
- ✅ Unlimited recaching
- ✅ All features included

You have ~15 sales pages + homepage + auth = ~20 pages total
**Free tier is MORE than enough!**

### If you grow:
- Hobby: $20/month (1,000 pages)
- Professional: $60/month (10,000 pages)

---

## ⚡ Alternative: Quick Wins Without Prerender.io

If you want results TODAY without signing up:

### 1. Pre-generate static HTML for top pages

Create `public/sale/[id].html` files for your top 10 sales manually:
- Better than nothing
- Google can index these immediately
- Only works for specific pages

### 2. Improve noscript content

Your `index.html` already has good noscript content. Could add:
- List of top 5 current sales
- Links to sale pages
- More keywords

### 3. Add more structured data

Add `ItemList` schema to homepage with all active sales:
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://ohmysales.app/sale/123",
      "name": "H&M 50% Off Sale"
    }
  ]
}
```

---

## 🎯 My Recommendation

1. **Today:** Set up Prerender.io (30 minutes)
2. **Tomorrow:** Request reindexing in Google Search Console
3. **This week:** Monitor coverage reports
4. **Next month:** Consider Next.js migration if you want 100% indexing

---

## 📞 Need Help?

- **Prerender.io Support:** support@prerender.io
- **Prerender.io Docs:** https://docs.prerender.io
- **Vercel Integration Docs:** https://vercel.com/docs/integrations

---

## 🎉 Success Checklist

- [ ] Signed up for Prerender.io account
- [ ] Got Prerender token
- [ ] Added `PRERENDER_TOKEN` to Vercel env vars
- [ ] Deployed changes
- [ ] Tested with `curl -A "Googlebot"`
- [ ] Verified in Prerender.io dashboard
- [ ] Submitted sitemap to Google Search Console
- [ ] Requested reindexing for key pages

Once all checked, you should see improvement within 1-2 weeks! 🚀
