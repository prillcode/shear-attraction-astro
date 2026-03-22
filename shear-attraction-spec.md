# Shear Attraction Salon — Website Implementation Spec

**Framework:** AstroJS (static output) · **Styling:** Tailwind CSS v4 · **Forms:** Formspree · **Deploy:** Cloudflare Pages

---

## 1. Project Overview

Build a dark-themed, modern static website for Shear Attraction Salon. The site must be simple enough for non-technical staff to edit content (text, pricing, stylist info) without touching any component or layout code.

### Goals

- Dark base with earthy/plant complementary colors (beige + green)
- Each stylist independently manages services, pricing, and their own booking link
- Bridal inquiry form routes to Cristy via Formspree (email → optional SMS forwarding)
- Content editable via plain YAML files — no code knowledge required
- Deploy to Cloudflare Pages as a fully static site

### Tech Stack

| Concern | Choice |
|---|---|
| Framework | AstroJS (latest stable), `output: 'static'` |
| Styling | Tailwind CSS v4 via `@astrojs/tailwind` |
| Content | Astro Content Collections (YAML files in `src/content/`) |
| Forms | Formspree free tier (50 submissions/month) |
| Images | Astro `<Image />` component for optimized static images |
| Fonts | Google Fonts — Cormorant Garamond (display) + DM Sans (body) |
| Package mgr | pnpm |
| Deployment | Cloudflare Pages — static build, no adapter needed |

---

## 2. Design System

### 2.1 Color Palette

Define all colors as CSS custom properties in `src/styles/global.css` and extend Tailwind's theme in `tailwind.config.mjs` to expose them as utility classes (e.g. `bg-surface`, `text-beige`).

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0F0F0F` | Page background (near black) |
| `--color-surface` | `#1A1A1A` | Cards, nav background |
| `--color-surface-alt` | `#222222` | Hover states, input fields |
| `--color-border` | `#2E2E2E` | Subtle dividers |
| `--color-text` | `#E8E0D5` | Primary text (warm off-white) |
| `--color-text-muted` | `#A09080` | Secondary text, captions |
| `--color-green` | `#4A7C59` | CTA buttons, accents (plant green) |
| `--color-green-light` | `#6AAF7E` | Hover state for green elements |
| `--color-beige` | `#C8B89A` | Section headings, price tags, highlights |
| `--color-beige-dim` | `#9E8E78` | Muted beige for borders and tags |

### 2.2 Typography

| Role | Font | Usage |
|---|---|---|
| Display | Cormorant Garamond | Hero headings, stylist names, section titles |
| Body | DM Sans | Body copy, nav, buttons, form labels |

Load both via Google Fonts `@import` in `global.css`. Expose as `font-display` and `font-body` Tailwind utilities in `tailwind.config.mjs`.

```css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --color-bg:          #0F0F0F;
  --color-surface:     #1A1A1A;
  --color-surface-alt: #222222;
  --color-border:      #2E2E2E;
  --color-text:        #E8E0D5;
  --color-text-muted:  #A09080;
  --color-green:       #4A7C59;
  --color-green-light: #6AAF7E;
  --color-beige:       #C8B89A;
  --color-beige-dim:   #9E8E78;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}
```

### 2.3 Spacing & Layout

- Max content width: `1200px`, centered, with `px-6` gutters on mobile
- Section vertical padding: `py-24` desktop / `py-16` mobile
- Stylist card grid: 1 col mobile → 2 col tablet → `auto-fill minmax(340px, 1fr)` desktop
- Gallery grid: CSS `columns` masonry — 3 col desktop, 2 tablet, 1 mobile

### 2.4 Component Patterns

- **Buttons:** `rounded-full bg-green text-bg font-medium px-6 py-3 hover:bg-green-light transition-colors`
- **Cards:** `bg-surface rounded-2xl border border-border hover:shadow-lg transition-shadow`
- **Section headings:** Cormorant Garamond, `text-beige`, `text-4xl md:text-5xl`
- **Nav:** sticky top-0, `bg-surface/90 backdrop-blur-md border-b border-border`

---

## 3. Site Structure

### 3.1 Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `src/pages/index.astro` | Single-page home: hero, stylists, gallery, contact |
| `/weddings` | `src/pages/weddings.astro` | Bridal packages + Formspree inquiry form |

### 3.2 File Tree

```
shear-attraction/
├── public/
│   ├── images/
│   │   ├── gallery/          ← gallery photos (wife edits here)
│   │   └── stylists/         ← stylist headshots
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── config.ts         ← Content Collection schemas (zod)
│   │   ├── stylists/         ← one .yaml per stylist
│   │   │   ├── cristy.yaml
│   │   │   ├── stylist2.yaml
│   │   │   └── ...
│   │   └── site/
│   │       ├── salon.yaml    ← salon info, hero text, hours
│   │       └── weddings.yaml ← bridal packages + page content
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── StylistCard.astro
│   │   ├── Gallery.astro
│   │   ├── ContactBar.astro
│   │   └── BridalForm.astro
│   ├── layouts/
│   │   └── Base.astro
│   └── pages/
│       ├── index.astro
│       └── weddings.astro
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── CONTENT-EDITING.md        ← plain-language guide for the owner
```

---

## 4. Content Collections

Content Collections are the key mechanism for non-technical editing. All site content lives in YAML files under `src/content/`. The owner can edit these directly in GitHub's web UI without touching any component code.

### 4.1 Collection Schema — `src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';

const stylists = defineCollection({
  type: 'data',
  schema: z.object({
    name:         z.string(),
    title:        z.string(),
    photo:        z.string(),           // path relative to public/
    bio:          z.string(),
    bookingUrl:   z.string().url().optional(),
    bookingLabel: z.string().default('Book an Appointment'),
    order:        z.number().default(99),
    active:       z.boolean().default(true),
    services: z.array(z.object({
      category: z.string(),
      items: z.array(z.object({
        name:  z.string(),
        price: z.string(),
      }))
    }))
  })
});

const site = defineCollection({
  type: 'data',
  schema: z.object({}).passthrough(), // flexible — one schema handles both site YAMLs
});

export const collections = { stylists, site };
```

### 4.2 Stylist YAML — `src/content/stylists/cristy.yaml`

```yaml
name: Cristy
title: Master Stylist & Co-Owner
photo: /images/stylists/cristy.jpg
bio: >
  Cristy has been transforming hair and building confidence for over 15 years.
  With a passion for color and an eye for what suits each individual, she creates
  looks that feel as good as they look.
bookingUrl: https://book.square.site/merchant/YOUR_ID/appointments
bookingLabel: Book with Cristy
order: 1
active: true
services:
  - category: Color
    items:
      - name: Full Highlight
        price: "$120+"
      - name: Balayage / Ombre
        price: "$150+"
      - name: Root Touch-Up
        price: "$75+"
      - name: Gloss / Toner
        price: "$45+"
  - category: Cut & Style
    items:
      - name: Women's Haircut
        price: "$55"
      - name: Men's Haircut
        price: "$35"
      - name: Blowout
        price: "$45+"
  - category: Treatments
    items:
      - name: Keratin Treatment
        price: "$200+"
      - name: Deep Conditioning
        price: "$30"
```

> **Note:** To add a new stylist, duplicate any `.yaml` file, rename it, and fill in the fields. The site automatically picks it up. To temporarily hide a stylist, set `active: false`.

### 4.3 Salon Info — `src/content/site/salon.yaml`

```yaml
name: Shear Attraction Salon
tagline: Where beauty meets belonging.
heroHeading: Welcome to Shear Attraction
heroBody: >
  Nestled in the heart of Bangor, Shear Attraction is more than a salon —
  it's a space where you can relax, be yourself, and leave feeling radiant.
  Our talented stylists bring creativity and care to every appointment.
heroImage: /images/salon-hero.jpg   # a warm interior or atmospheric shot
address: 123 Main Street, Bangor, ME 04401
phone: "(207) 555-0100"
email: hello@shearattractionsalon.com
instagram: https://instagram.com/shearattractionsalon
facebook: https://facebook.com/shearattractionsalon
hours:
  - day: Tuesday – Friday
    time: 9am – 6pm
  - day: Saturday
    time: 9am – 4pm
  - day: Sunday – Monday
    time: Closed
```

### 4.4 Weddings Content — `src/content/site/weddings.yaml`

```yaml
heading: Bridal & Wedding Services
intro: >
  Your wedding day deserves to be perfect. Our bridal specialists bring expertise,
  calm, and creativity to every celebration — from intimate elopements to full
  wedding parties.
contactName: Cristy
contactNote: >
  For bridal inquiries, reach out directly to Cristy.
  She'll get back to you within 24 hours to discuss your vision and availability.
packages:
  - name: Bride Package
    description: Your complete wedding day hair experience.
    price: Starting at $200
    includes:
      - Consultation & full hair trial
      - Wedding day styling
      - Touch-up kit to go
  - name: Bridal Party
    description: Coordinated styling for the whole party.
    price: Starting at $75 per person
    includes:
      - Updo or blowout per person
      - Coordinated booking & timeline
      - Complimentary consultation
  - name: Mother of the Bride / Groom
    description: Elegant styling for the important women in your life.
    price: Starting at $65
    includes:
      - Blowout or updo
      - Style consultation
```

---

## 5. Home Page Sections — `index.astro`

Compose the home page by importing and rendering each section component in order. Pass data loaded via `getCollection('stylists')` and `getEntry('site', 'salon')` as props.

### 5.1 Nav — `Nav.astro`

- Sticky top-0, `bg-surface/90 backdrop-blur-md border-b border-border`
- **Left:** Salon name in Cormorant Garamond, `text-beige`, links to `/`
- **Right (desktop):** Anchor links → `#stylists`, `#gallery`, `#contact` + `Weddings` → `/weddings` (styled as ghost button)
- **Mobile:** Hamburger toggle with vanilla JS, slides down a full-width drawer with the same links
- Active section highlight: use `IntersectionObserver` to add an active class to the matching nav link as sections scroll into view

### 5.2 Hero — `Hero.astro`

- `min-h-screen` full-viewport, dark overlay (`bg-black/50`) over the `heroImage` background
- Add a subtle CSS noise/grain texture overlay for depth (`opacity-[0.03]` SVG filter or CSS `filter: url(#noise)`)
- **Large heading:** `heroHeading` from salon.yaml — Cormorant Garamond, `text-6xl md:text-8xl`, `text-beige`
- **Body copy:** `heroBody` — DM Sans, `text-text-muted`, `max-w-xl`
- **Two CTAs:**
  - `Meet Our Stylists` → smooth scroll to `#stylists` (primary green button)
  - `Weddings & Bridal` → `/weddings` (ghost/outline button)
- Subtle fade-up entrance animation on heading + body + buttons (CSS `@keyframes`, `animation-delay` stagger)

### 5.3 Stylists Section

- Section `id="stylists"`, heading "Our Stylists" (`text-beige`, Cormorant Garamond)
- Load: `const stylists = await getCollection('stylists', s => s.data.active)` sorted by `data.order`
- Render `<StylistCard>` for each stylist in a responsive CSS grid

**`StylistCard.astro` contents:**

1. **Headshot** — `<Image>` component, square crop with `rounded-xl`, thin `border border-beige-dim`
2. **Name** — Cormorant Garamond, `text-2xl text-beige`
3. **Title** — DM Sans, `text-sm text-text-muted uppercase tracking-widest`
4. **Bio** — clamped to 3 lines with `line-clamp-3`; a "Read more" toggle (vanilla JS) expands inline
5. **Services accordion** — each `category` is a clickable header that reveals its `items` list with name + price on the same row; chevron rotates on open (CSS transition); only one category open at a time
6. **Booking button** — `Book with {name}` → `bookingUrl` (`target="_blank" rel="noopener"`); if `bookingUrl` is absent or empty, hide the button entirely

### 5.4 Gallery

- Section `id="gallery"`, heading "Our Work"
- Use `import.meta.glob('/public/images/gallery/*', { eager: true })` to load all images at build time
- CSS `columns` masonry layout:
  ```css
  .gallery-grid {
    columns: 1;
    column-gap: 1rem;
  }
  @media (min-width: 640px)  { .gallery-grid { columns: 2; } }
  @media (min-width: 1024px) { .gallery-grid { columns: 3; } }
  .gallery-grid img {
    break-inside: avoid;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
    width: 100%;
  }
  ```
- **Lightbox:** Load [GLightbox](https://github.com/biati-digital/glightbox) from CDN (`<script src="https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js">`), initialize with `GLightbox({ selector: '.gallery-item' })` in a `<script>` tag; wrap each image in `<a class="gallery-item" href="{full-src}">`.

### 5.5 Contact Bar — `ContactBar.astro`

- Section `id="contact"`, `bg-surface`
- **Two-column layout** (stacks on mobile):
  - **Left:** Address, hours table (day + time rows from salon.yaml), phone, email
  - **Right:** Google Maps iframe embed (standard embed URL, no API key needed)
    ```html
    <iframe
      src="https://www.google.com/maps?q=ENCODED_ADDRESS&output=embed"
      width="100%" height="350" loading="lazy"
      class="rounded-xl border border-border"
    ></iframe>
    ```
- **Below columns:** Social media icon links (Instagram, Facebook) using inline SVG icons
- Small teaser: `"Planning a wedding? →"` text link to `/weddings`

---

## 6. Weddings Page — `weddings.astro`

Uses `Base.astro` layout. Load content: `const weddings = await getEntry('site', 'weddings')`.

### 6.1 Page Structure

1. **Hero banner** — narrower than home hero (`min-h-[40vh]`), same dark overlay pattern, heading + intro text from `weddings.yaml`
2. **Packages grid** — 1–3 column responsive card grid; each card shows name, description, price (in `text-beige`), and includes list with checkmark bullets
3. **Inquiry form section** — heading `"Get in Touch with Cristy"` + `<BridalForm />` component

### 6.2 Bridal Inquiry Form — `BridalForm.astro`

**Form fields** (all required unless noted):

| Field | Type | Required |
|---|---|---|
| Full Name | text | ✓ |
| Email Address | email | ✓ |
| Phone Number | tel | ✓ |
| Wedding Date | date | ✓ |
| Wedding Location / Venue | text | ✓ |
| Party Size (# needing hair) | number (min 1) | ✓ |
| Services needed | checkboxes | ✓ (at least 1) |
| Message / Additional Details | textarea | optional |
| How did you hear about us? | select dropdown | optional |

Services checkboxes: `Bride`, `Bridesmaids`, `Mother of Bride`, `Mother of Groom`, `Flower Girls / Children`

How did you hear: `Google`, `Instagram`, `Facebook`, `Word of mouth`, `Returning client`, `Other`

**Formspree wiring:**

```html
<form id="bridal-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <!-- Honeypot spam trap -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
  <!-- Friendly email subject -->
  <input type="hidden" name="_subject" value="New Bridal Inquiry — Shear Attraction Salon" />

  <!-- ...all visible fields... -->
</form>
```

**AJAX submission** (no page redirect):

```js
const form = document.getElementById('bridal-form');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.style.display = 'none';
      successMsg.style.display = 'block';
    } else {
      errorMsg.style.display = 'block';
    }
  } catch {
    errorMsg.style.display = 'block';
  }
});
```

**Success message:** "Thank you! Cristy will be in touch within 24 hours to discuss your wedding vision."

**Error message:** "Something went wrong. Please try again or call us directly at [phone]."

---

## 7. Cloudflare Pages Deployment

Since this is `output: 'static'`, **no Astro adapter is needed** — Cloudflare Pages serves the built `dist/` folder directly.

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

### Cloudflare Pages Settings

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Node.js version | `18` (set in env vars: `NODE_VERSION = 18`) |
| Root directory | `/` (repo root) |

### Deploy Steps

1. Push repo to GitHub
2. In Cloudflare dashboard → Pages → Create a project → Connect to Git
3. Select the repo, configure build settings above
4. Add custom domain in Pages settings once DNS is ready
5. Every push to `main` auto-deploys

> The `_redirects` file is not needed for a fully static site, but if you add one later for any redirect rules, place it in `public/_redirects` and Cloudflare Pages will pick it up automatically.

---

## 8. Formspree Setup (for Cristy)

> This section should also be included in `CONTENT-EDITING.md` for the owner.

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Click **New Form** → give it a name (e.g. "Shear Attraction Bridal Inquiries")
3. Set the notification email to Cristy's email address
4. Copy the form endpoint URL — it looks like `https://formspree.io/f/abc12345`
5. Open `src/components/BridalForm.astro` and replace `YOUR_FORM_ID` in the form `action`
6. **Optional SMS forwarding:** In Cristy's email app, create a filter rule that forwards emails from `no-reply@formspree.io` to her carrier's email-to-text gateway:
   - Verizon: `10digitnumber@vtext.com`
   - AT&T: `10digitnumber@txt.att.net`
   - T-Mobile: `10digitnumber@tmomail.net`

---

## 9. Implementation Checklist

Work through these phases in order.

### Phase 1 — Scaffold

- [ ] `pnpm create astro@latest shear-attraction -- --template minimal --typescript strict --no-git`
- [ ] `pnpm add @astrojs/tailwind tailwindcss`
- [ ] `pnpm add -D @types/node`
- [ ] Configure `astro.config.mjs` — `output: 'static'`, `integrations: [tailwind()]`
- [ ] Configure `tailwind.config.mjs` — extend theme with custom colors and font families
- [ ] Create `src/styles/global.css` — CSS custom properties, Google Fonts import, base body styles

### Phase 2 — Content Collections

- [ ] Define schemas in `src/content/config.ts` (zod, as specified in Section 4.1)
- [ ] Create 4–5 sample stylist YAML files using the Section 4.2 schema (use placeholder names/data)
- [ ] Create `salon.yaml` and `weddings.yaml` with placeholder content

### Phase 3 — Components

- [ ] `Base.astro` — layout shell: `<head>`, Google Fonts `<link>`, `global.css`, `<slot />`
- [ ] `Nav.astro` — sticky nav, mobile hamburger toggle (vanilla JS)
- [ ] `Hero.astro` — full-viewport hero, overlay, heading, body, dual CTAs, fade-up animation
- [ ] `StylistCard.astro` — headshot, bio with expand, services accordion, conditional booking button
- [ ] `Gallery.astro` — CSS columns masonry, GLightbox from CDN
- [ ] `ContactBar.astro` — address, hours, Google Maps iframe, social links
- [ ] `BridalForm.astro` — all fields, honeypot, AJAX submit, success/error states

### Phase 4 — Pages

- [ ] `index.astro` — load collections, compose Hero + Stylists + Gallery + ContactBar
- [ ] `weddings.astro` — load weddings.yaml, compose hero banner + packages grid + BridalForm

### Phase 5 — Polish & QA

- [ ] `pnpm build` — clean output, zero TypeScript errors
- [ ] Test at 375px, 768px, 1200px+ breakpoints
- [ ] Verify all anchor nav links scroll correctly
- [ ] Verify IntersectionObserver active nav state works
- [ ] Test services accordion (one open at a time)
- [ ] Test gallery lightbox
- [ ] Test Formspree form submit (use a real endpoint)
- [ ] Verify booking button is hidden when `bookingUrl` is absent
- [ ] Write `CONTENT-EDITING.md` (see Section 10)

---

## 10. `CONTENT-EDITING.md` — Outline

Claude Code should generate this file as a standalone, plain-language guide for the salon owner. Write it warmly and simply — assume no coding knowledge.

### Sections to include

1. **How to edit a YAML file on GitHub** — step-by-step with screenshots or clear instructions; explain what YAML is in one sentence
2. **How to update your salon info** — edit `src/content/site/salon.yaml` (hours, address, phone, hero text)
3. **How to update a stylist's services or pricing** — find the stylist's `.yaml` file, find the service item, change the `price:` value
4. **How to update a stylist's bio or photo** — replace the text in `bio:`, or drop a new image in `public/images/stylists/` and update the `photo:` path
5. **How to add a new stylist** — duplicate any `.yaml` file in `src/content/stylists/`, rename it, fill in the fields
6. **How to temporarily hide a stylist** — set `active: false` in their `.yaml` file
7. **How to add a gallery photo** — drag a new image into `public/images/gallery/` via GitHub; no other changes needed
8. **How to update bridal packages** — edit `src/content/site/weddings.yaml`
9. **What NOT to touch** — anything in `src/components/`, `src/layouts/`, `src/pages/`, and any `.astro`, `.ts`, or `.mjs` files

---

## 11. Open Items

Resolve these before or at the start of the Claude Code session:

- [ ] **Salon address** — fill into `salon.yaml` (needed for Google Maps embed)
- [ ] **Stylist names, bios, and booking URLs** — at least 1 complete entry to build from
- [ ] **Hero background image** — a warm salon interior or atmospheric photo for the home hero
- [ ] **Gallery photos** — at least 6–8 images for a populated gallery at launch
- [ ] **Cristy's email address** — goes into Formspree notification settings
- [ ] **Domain name** — configure in Cloudflare Pages → Custom Domains
- [ ] **Cloudflare Pages project** — create and link to the GitHub repo before first deploy
