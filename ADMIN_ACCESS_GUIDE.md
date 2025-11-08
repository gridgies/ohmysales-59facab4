# Admin Dashboard Access Guide

## Step 1: Create Your Account

1. Go to your website: `https://yourdomain.com/auth`
2. Click "Sign Up" (or create an account)
3. Enter your email and password
4. Submit the form

## Step 2: Make Yourself an Admin

You need to manually add yourself as an admin in the Supabase database. Here's how:

### Option A: Via Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on your project
3. Go to **Table Editor** in the left sidebar
4. Select the **user_roles** table
5. Click **"Insert"** → **"Insert row"**
6. Fill in:
   - `user_id`: Copy your user ID from the **profiles** table (it's the same as your auth.users id)
   - `role`: Select **"admin"**
7. Click **"Save"**

### Option B: Via SQL Editor

1. Go to your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Run this SQL (replace YOUR_EMAIL with your actual email):

```sql
-- First, find your user_id
SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL';

-- Then insert the admin role (use the id from above)
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin');
```

## Step 3: Access the Admin Dashboard

1. Refresh your website
2. Log in if you're not already logged in
3. You should now see an **"Admin"** button in the header
4. Click it to go to `/admin`
5. You can now add, edit, and delete sales!

## Adding Your First Sales

Once in the admin dashboard:

1. Fill out the form on the left:
   - **Händler**: Retailer name (e.g., "Zalando")
   - **Logo URL**: Direct link to retailer's logo
   - **Bild URL**: Optional sale image
   - **Titel**: Sale title (e.g., "Singles Day Sale")
   - **Rabatt**: Discount amount (e.g., "30%")
   - **Promo Code**: Optional promo code
   - **Enddatum**: When the sale ends
   - **Sale URL**: Link to the sale page
   - **Kategorie**: Women/Men/Accessories/Unisex
   - **Featured**: Check to highlight this sale

2. Click **"Erstellen"** to create the sale
3. The sale will appear on your homepage immediately!

## Tips for Logo & Image URLs

- Use direct image URLs (ending in .jpg, .png, .svg)
- For logos, try: `https://logo.clearbit.com/DOMAIN.COM` (replace DOMAIN.COM with the retailer's website)
- For images, you can upload to Imgur or use Cloudinary
- Or use Supabase Storage to host your images

## Need Help?

If you can't see the Admin button after adding the role:
- Log out and log back in
- Clear your browser cache
- Check that the user_id in user_roles matches your auth.users id
