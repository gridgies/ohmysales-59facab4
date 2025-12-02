# SEO Verification Checklist

## 🔍 Quick Verification Steps

### 1. Test Homepage SEO (https://ohmysales.app)

**View Page Source (Ctrl+U or Cmd+Option+U):**

✅ Check for these tags:
```html
<title>Black Friday Fashion Sales 2025 | Spare bis zu 70% | ohmysales</title>
<meta name="description" content="Die besten Black Friday Fashion Sales 2025!...">
<meta property="og:title" content="Black Friday Fashion Sales 2025 | ohmysales">
<meta property="og:image" content="...">
<link rel="canonical" href="https://ohmysales.app/">
```

✅ Check for Structured Data (JSON-LD):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ohmysales",
  ...
}
</script>
```

### 2. Test Individual Sale Pages

Pick any sale and check: `https://ohmysales.app/sale/[sale-id]`

**View Page Source:**

✅ Dynamic title includes sale details:
```html
<title>30% H&M Sale | ohmysales</title>
```

✅ Dynamic meta description:
```html
<meta name="description" content="30% bei H&M! Singles Day Sale. Jetzt sparen...">
```

✅ Open Graph tags with sale image:
```html
<meta property="og:image" content="[sale-image-url]">
```

✅ Canonical URL with sale ID:
```html
<link rel="canonical" href="https://ohmysales.app/sale/[sale-id]">
```

### 3. Use Google's Rich Results Test

**Test your pages:**
1. Go to: https://search.google.com/test/rich-results
2. Enter: `https://ohmysales.app`
3. Click "Test URL"
4. Check that structured data is detected

**Expected Results:**
- ✅ WebSite schema detected
- ✅ Organization schema detected
- ✅ Event schema detected (Black Friday)
- ✅ FAQPage schema detected
- ✅ No errors or warnings

### 4. Test Open Graph Tags

**Facebook Sharing Debugger:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://ohmysales.app`
3. Click "Debug"

**Expected:**
- ✅ Image preview shows
- ✅ Title and description correct
- ✅ No warnings

### 5. Verify Sitemap

**Check sitemap.xml:**
1. Visit: https://ohmysales.app/sitemap.xml
2. Should show XML with:
   - Homepage URL
   - Auth page URL
   - Individual sale pages (if env vars set during build)

### 6. Mobile-Friendly Test

**Google Mobile-Friendly Test:**
1. Go to: https://search.google.com/test/mobile-friendly
2. Enter: `https://ohmysales.app`
3. Should pass with no issues

### 7. PageSpeed Insights

**Check performance:**
1. Go to: https://pagespeed.web.dev/
2. Enter: `https://ohmysales.app`
3. Run test for both Mobile and Desktop

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: 100

## 🚨 Common Issues to Watch For

### Issue: Sale pages show default metadata
**Cause:** Environment variables not set during build
**Fix:** Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in Vercel

### Issue: Images not showing in social previews
**Cause:** Image URLs might be broken or not accessible
**Fix:** Check that all sale images are valid public URLs

### Issue: Duplicate content warnings
**Cause:** Same content on multiple URLs
**Fix:** Ensure canonical tags are correct (already implemented)

## ✅ Next Steps After Verification

1. **Submit to Google Search Console**
   - Add property: https://ohmysales.app
   - Submit sitemap: https://ohmysales.app/sitemap.xml

2. **Request Indexing**
   - Use URL Inspection tool
   - Request indexing for main pages

3. **Monitor Performance**
   - Check Search Console weekly
   - Watch for crawl errors
   - Monitor impressions and clicks

4. **Keep Sitemap Updated**
   - Sitemap regenerates on each build
   - New sales automatically included
   - Old/expired sales should be removed from database
