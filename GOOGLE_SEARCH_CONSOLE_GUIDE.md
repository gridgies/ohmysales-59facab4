# Google Search Console Setup & Sharing Guide

## 🎯 Overview

Google Search Console (GSC) is essential for monitoring your site's SEO performance. This guide covers:
1. How to verify ownership (if not done yet)
2. How to share access with others
3. What to monitor
4. How to request reindexing

---

## 📋 Part 1: Verify Ownership (If Not Already Done)

### Step 1: Go to Google Search Console
👉 https://search.google.com/search-console

### Step 2: Add Your Property

1. Click **"Add property"** (or select if already added)
2. Choose **"URL prefix"**: `https://ohmysales.app`
3. Click **Continue**

### Step 3: Verify Ownership

Google offers several verification methods. **Easiest for Vercel:**

#### Option A: HTML Tag (Recommended for Vercel)

1. GSC shows you a meta tag like:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```

2. Add it to your `index.html` in the `<head>` section (after line 36):
   ```html
   <!-- Google Search Console Verification -->
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```

3. Commit and push:
   ```bash
   git add index.html
   git commit -m "Add Google Search Console verification"
   git push
   ```

4. Wait 2-3 minutes for Vercel to deploy

5. Click **"Verify"** in GSC

#### Option B: DNS Verification (Alternative)

1. GSC gives you a TXT record
2. Add it to your domain DNS settings (where you bought ohmysales.app)
3. Wait 24-48 hours for DNS propagation
4. Click **"Verify"** in GSC

#### Option C: Google Analytics (If you already have it)

1. Make sure your Google Analytics tag is in `index.html` (it is! Line 4-12)
2. Use the same Google account for GSC
3. GSC will auto-verify via Analytics

---

## 🤝 Part 2: How to Share Access

### To Share Google Search Console Access:

1. **Go to Google Search Console:**
   👉 https://search.google.com/search-console

2. **Select your property:**
   Click on `https://ohmysales.app` in the dropdown

3. **Click Settings (⚙️) in the left sidebar**

4. **Click "Users and permissions"**

5. **Click "Add user"**

6. **Enter the email address** of who you want to share with
   - For me or support: Enter their Google/Gmail address

7. **Choose permission level:**
   - **Full:** Can do everything (recommended for developers)
   - **Restricted:** Can view most data but can't manage users
   - **Associate:** Limited access (just viewing)

   👉 **Recommended:** Select **"Full"** for developers helping with SEO

8. **Click "Add"**

9. **They'll receive an email** with access link

### To Remove Access:

1. Go to Settings → Users and permissions
2. Click the **X** next to the user's email
3. Confirm removal

---

## 📊 Part 3: What to Monitor in GSC

### 1. Coverage Report (Most Important!)

**Where:** Index → Pages (or Coverage in old interface)

**What to look for:**
- ✅ **Valid pages:** Should increase over time
- ⚠️ **Excluded pages:** Why are they excluded?
- ❌ **Error pages:** Fix these immediately

**Target for ohmysales:**
- Homepage: ✅ Indexed
- Auth page: ✅ Indexed
- Sale pages: ✅ Should have 10-20+ indexed within 2 weeks

---

### 2. Sitemaps

**Where:** Sitemaps (in left sidebar)

**Action needed:**

1. Click **"Add a new sitemap"**
2. Enter: `sitemap.xml`
3. Click **Submit**

**What to monitor:**
- Status: Should say "Success"
- URLs discovered: Should show all your pages
- Last read: Should update regularly

**If sitemap fails:**
- Check: https://ohmysales.app/sitemap.xml
- Should load as XML, not 404
- Check vercel.json headers are correct (they are!)

---

### 3. Performance Report

**Where:** Performance (in left sidebar)

**Metrics:**
- **Total clicks:** How many people clicked your site in Google
- **Total impressions:** How many times your site showed in results
- **Average CTR:** Click-through rate (good: >3%)
- **Average position:** Where you rank (goal: <10)

**Queries to monitor:**
- "black friday mode deals"
- "fashion sales deutschland"
- "h&m sale" (if you have H&M deals)
- Brand names of retailers you feature

---

### 4. URL Inspection Tool

**Where:** Top search bar in GSC

**Use it to:**

1. **Check if specific pages are indexed:**
   - Enter: `https://ohmysales.app/sale/[any-id]`
   - See if Google has it indexed

2. **Request indexing for important pages:**
   - After inspection, click **"Request indexing"**
   - Google will crawl it within 24-48 hours

3. **See how Google sees your page:**
   - Click "View crawled page"
   - Check if it sees your content or just empty HTML

---

## 🚀 Part 4: Request Reindexing (Do This Now!)

Since you just made SEO improvements, request reindexing:

### Step 1: Request Indexing for Key Pages

Use the URL Inspection tool for:

1. **Homepage:**
   ```
   https://ohmysales.app/
   ```

2. **Your top 5-10 sale pages** (check your database for IDs):
   ```
   https://ohmysales.app/sale/[id-1]
   https://ohmysales.app/sale/[id-2]
   ...
   ```

For each:
1. Enter URL in inspection tool
2. Wait for results
3. Click **"Request indexing"**
4. Wait for confirmation (can take 1-2 minutes)

### Step 2: Submit/Resubmit Sitemap

1. Go to **Sitemaps** in GSC
2. If sitemap already exists:
   - Click on it
   - Note the URLs count
3. Click **"Add a new sitemap"** (or resubmit existing)
4. Enter: `sitemap.xml`
5. Click **Submit**

---

## ⏱️ Timeline Expectations

### Immediate (Today):
- ✅ Sitemap submitted
- ✅ Key pages requested for indexing

### 24-48 Hours:
- 🔍 Google crawls requested pages
- 📊 Coverage report shows new pages discovered

### 1 Week:
- ✅ 30-50% of pages indexed (without Prerender)
- 📈 First impressions in Performance report
- ⚠️ May see "Crawled - currently not indexed" status (normal for SPA)

### 2-4 Weeks:
- ✅ 60-80% of pages indexed (with Prerender.io)
- 📈 Clicks starting to come in
- 🎯 Rankings improving for brand-specific queries

### With Next.js Migration:
- ✅ 80-100% of pages indexed within 4 weeks
- 📈 Better rankings for competitive keywords

---

## ⚠️ Common Issues & Fixes

### Issue 1: "Discovered - currently not indexed"

**Cause:** Google found your page but hasn't indexed it yet.

**Fix:**
- ✅ Implement Prerender.io (makes pages crawlable)
- ✅ Add more internal links to the page
- ✅ Request indexing via URL Inspection tool
- ⏱️ Wait 1-2 weeks

---

### Issue 2: "Crawled - currently not indexed"

**Cause:** Google crawled it but found low-quality or duplicate content.

**Fix:**
- ✅ Ensure each sale page has unique content
- ✅ Add more descriptive text (not just product title)
- ✅ Implement Prerender.io (helps Google see full content)
- ✅ Check if meta descriptions are unique per page

---

### Issue 3: "Excluded by 'noindex' tag"

**Cause:** Page has `<meta name="robots" content="noindex">`

**Fix:**
- ❌ Remove noindex tag
- ✅ Check your code for any dynamic noindex tags
- ✅ Your site doesn't have this issue currently

---

### Issue 4: Sitemap shows fewer URLs than expected

**Cause:** Sitemap generator didn't have database access.

**Fix:**
- ✅ Check Vercel environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ Redeploy site (sitemap generates during build)
- ✅ Check: https://ohmysales.app/sitemap.xml

---

## 🎯 Quick Checklist

**Do these NOW for best results:**

- [ ] Verify ownership in GSC (if not done)
- [ ] Submit sitemap.xml
- [ ] Request indexing for homepage
- [ ] Request indexing for top 5-10 sale pages
- [ ] Share GSC access with developer/SEO help
- [ ] Set up Prerender.io (see PRERENDER_SETUP_GUIDE.md)
- [ ] Check Coverage report weekly
- [ ] Monitor Performance report after 2 weeks

---

## 📞 Support Resources

- **Google Search Console Help:**
  https://support.google.com/webmasters

- **GSC Community Forum:**
  https://support.google.com/webmasters/community

- **Google Search Central:**
  https://developers.google.com/search

---

## 📧 Sharing Access Summary

**Quick answer to your question:**

To share Google Search Console access:
1. Go to https://search.google.com/search-console
2. Select your site (ohmysales.app)
3. Click ⚙️ Settings → Users and permissions
4. Click "Add user"
5. Enter email address + select "Full" permission
6. Click "Add"

**That's it!** They'll get an email and can access all your SEO data.

---

Need help with any of these steps? Just ask! 🚀
