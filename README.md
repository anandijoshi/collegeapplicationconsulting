# Anandi Joshi — College Admission Consultant (website)

A static site: no build step, no backend.

```
index.html          home (hero, school carousel, services, testimonials preview, how it works, FAQ)
about.html          About me (bio, education, professional background)
testimonials.html   full testimonials page
book.html           booking page for the $50 / 30-minute consulting call
admin.html          visual editor for services & pricing (see below)
fonts.html          side-by-side font pairing options (preview only; safe to delete)
data/services.js    consulting call, packages, essay review, and prices   ← edited via admin.html
data/testimonials.js  testimonial text
js/config.js        name, email, LinkedIn, Google Calendar + Stripe links for the consulting call
images/anandi.jpg   hero portrait (from your Canva design)
images/harvard.jpg  About-page photo (from your Canva design)
images/logos/       Berkeley Haas, Harvard Business School, Spotify, McKinsey logos
media/school-carousel.mp4  the school-logo carousel video (from your Canva design)
css/styles.css      design (colors are the variables at the top)
```

Preview locally: `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

## How the sales flow works

Nobody buys a package or essay review directly. Every "Book a call to get started" button goes to
`book.html`, where visitors book (and pay for) a **$50, 30-minute consulting call**. After the call, if it's a
good fit, **you** send them a payment link (see "After the call" below) and you get started.

## Editing services and prices

1. Open `admin.html` in your browser (locally, or at `yoursite.com/admin.html`).
2. Change the consulting call, package names, prices, descriptions, and what's included; add, remove, or reorder packages; choose which package is highlighted as "Most Common". The preview updates live.
3. Click **Download services.js**, put the file in the site's `data/` folder (replace the old one), and re-upload/redeploy.

The editor can't publish by itself (the site has no server), so step 3 is what makes it live. Your in-progress
draft is remembered in that browser. `admin.html` only edits a downloaded copy, so it's harmless if someone finds it,
but you can also just not upload it to your host and use it locally.

## Setting up the $50 consulting call

You need a Google Calendar **appointment schedule** (the 30-minute slots) and a way to collect $50. Two options:

**Your calendar is already connected** (`calendar.bookingUrl` in `js/config.js`). Google's short links (`calendar.app.google/...`) can't be embedded, so the site uses the schedule's embeddable form, which ends in `?gv=true`; the short link is kept as `calendar.shareUrl` for the "open in a new tab" fallback. Don't post the short link publicly: anyone who has it can book a slot without paying.

### Option A — Google Calendar collects the payment (simplest for visitors; enforces payment)

1. Google Calendar → **Create → Appointment schedule**. Set 30-minute slots, your availability, buffer time, and add a Google Meet link.
2. In the schedule's booking-page settings, look for **Payments** and connect your Stripe account, then set the price to $50.
   This is only offered on some paid Google Workspace plans, not on free personal Gmail accounts, and school or work accounts
   may have it turned off by an admin. If you don't see the Payments option, use Option B.
3. Copy the schedule's link (**Share → Website embed** or the booking-page link) into `calendar.bookingUrl` in `js/config.js`.
4. In `js/config.js`, set `consult.paymentInCalendar: true`.

Visitors click "Book a call", see your calendar, pick a slot, and pay inside Google's flow. No one can book without paying.

### Option B — Stripe first, then the calendar (works with any Google account)

1. Create the appointment schedule as in step 1 above (no payments needed) and paste its link into `calendar.bookingUrl`.
2. In Stripe → **Payment Links → New**, create a $50 one-time link. Under **After payment → Redirect customers to your website**, use
   `https://YOURSITE.com/book.html?paid=call`. Paste the `https://buy.stripe.com/...` link into `consult.paymentLink` in `js/config.js`.
3. Keep `consult.paymentInCalendar: false`.

Visitors pay on Stripe, land back on `book.html?paid=call`, and pick a slot. Test with a Stripe **test mode** link first, then swap in the live one.

Heads-up: in Option B the redirect is what reveals the calendar. It isn't a hard lock, since someone who knows the URL could
open the calendar without paying. Checking Stripe before each call covers this for most solo practices.

## After the call

Packages and essay reviews aren't sold on the site. When someone is ready to move forward, send them a payment link:
Stripe Dashboard → **Payment Links** (reusable, one per package) or **Invoices** for a custom amount. Nothing needs to be set up on the website for this.

## Make it yours

- Email and LinkedIn link: `js/config.js`.
- Prices, package contents, and the consulting-call description: `admin.html`.
- FAQ answers (24-hour reschedule note, 48-hour essay turnaround) and the consulting-call description are starting points; make them match your real policies.
- Testimonials: edit `data/testimonials.js` (wrap text in `**double asterisks**` to highlight it). Each entry's `logo`/`logoH` is the school logo shown at the top of its card.
- "Why parents choose us" (the 3-column band above the testimonials): this copy is written directly into `index.html` and `testimonials.html` (search for `diff-grid` in each) rather than pulled from a data file, so edit it in both places to keep them in sync.
- Photos and carousel: replace `images/anandi.jpg`, `images/harvard.jpg` or `media/school-carousel.mp4` with your own files of the same name.
- Fonts: DM Serif Display (headings) + DM Sans (body). Change `--display` / `--body` in `css/styles.css` and the Google Fonts `<link>` in every HTML file to switch.

## Deploy

Any static host works: Netlify, Vercel, Cloudflare Pages, GitHub Pages. Drag the folder in, add your domain,
and (for Option B) update the Stripe redirect URL to your real domain.
