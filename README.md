# Beam's Millwork website

Next.js site for beamsmillwork.com. Hosted on Vercel, form email through Resend.

## Pages
- `/` Home
- `/work` Gallery with Residential / Commercial / Institutional filters and a full-screen viewer
- `/capabilities` Services, markets, process, the shop
- `/careers` Open positions + application form with resume upload
- `/contact` Bid request form with drawing/photo uploads
- `/privacy`
Old GoDaddy URLs (/portfolio, /join-our-team, etc.) redirect to the new pages.

## Editing content (no code knowledge needed)
- Phone, address, hours, services, open positions: `lib/site.js`
- Gallery photos: drop JPG/PNG/WEBP files into `public/gallery/residential`, `public/gallery/commercial` or `public/gallery/institutional`. File name becomes the caption: `01-walnut-library.jpg` shows as "Walnut library" (leading numbers set order and are hidden). Keep photos around 2000px wide.
- Home page photo: add `public/hero.jpg`.
Commit and push; Vercel redeploys automatically.

## Run locally
    npm install && npm run dev

## Go live
1. Push this folder to a new GitHub repo, import it in Vercel.
2. Resend (resend.com): add domain `beamsmillwork.com`, add the DNS records it gives you in GoDaddy DNS, wait for "Verified". Create an API key.
3. Vercel > Settings > Environment Variables: copy everything from `.env.example` and fill it in. Redeploy.
4. Test both forms on the `.vercel.app` URL.
5. Vercel > Settings > Domains: add `beamsmillwork.com` and `www.beamsmillwork.com`. In GoDaddy DNS set the records Vercel shows (A record `@` and CNAME `www`).
   Do NOT touch MX records. Those run your company email.
6. In GoDaddy, cancel the Website Builder plan only. Keep the domain registration.

## Limits
Attachments are capped at 4 MB per submission (Vercel's request size limit). The bid form has a link field for larger drawing sets.
