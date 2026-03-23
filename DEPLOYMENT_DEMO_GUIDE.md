# RideWeave Demo Deployment Guide

This project is now prepared for static deployment (Vite + React Router SPA).

## 1) Environment Variables

Set these in your hosting provider dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use `.env.example` as the reference.

## 2) Build Settings

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## 3) SPA Route Rewrites (Already Added)

To avoid 404 on refresh for routes like `/login` or `/auth/callback`:

- `vercel.json` is configured for Vercel rewrites.

## 4) Connect Custom Domain

1. Go to your project in Vercel.
2. Open **Settings -> Domains**.
3. Add your domain and required DNS records.
4. Wait for verification and SSL issuance.

## 5) Supabase Auth Domain Setup (Required)

In Supabase Dashboard:

1. Go to **Authentication -> URL Configuration**.
2. Set **Site URL** to your final domain, for example:
   - `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://www.yourdomain.com/auth/callback` (if using www)
4. Keep your local URL during development if needed:
   - `http://localhost:5173/auth/callback`

If you use Google OAuth, also add the same callback URLs in Google Cloud OAuth credentials.

## 6) Database Setup

Run your SQL from `supabase-migrations.sql` in Supabase SQL Editor before demo.
Enable Realtime for `driver_locations` and `rides` in **Database -> Replication**.

## 7) Pre-Demo Validation

- `npm run build` succeeds.
- App loads on your domain.
- Open any deep link directly (for example `/login`) and verify it does not 404.
- Test login and OAuth callback flow.
- Confirm Realtime updates appear on ride map.

## Troubleshooting

- OAuth redirect mismatch: Check Supabase and Google callback URLs exactly match your domain.
- Blank screen after deploy: Verify env vars exist in hosting dashboard and redeploy.
- Route 404 on refresh: Ensure your hosting platform uses the SPA rewrite config.
