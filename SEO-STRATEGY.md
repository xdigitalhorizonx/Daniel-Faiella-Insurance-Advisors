# Local SEO Strategy — Daniel J. Faiella Insurance Advisors

**Goal:** Rank Daniel as an insurance/Medicare broker in **Carson City, Reno, Lake Tahoe,
Minden/Gardnerville, and Dayton, Nevada.**

**Prepared:** July 2026. This document explains the research behind the changes in this
repository, exactly what was implemented on the site, and the off-site work required to
convert those changes into rankings and calls.

---

## 1. The core problem we found (and fixed)

The original site was a single `index.html` that rendered **100% of its content with
client-side JavaScript**. To a search engine or AI crawler, the raw page looked like this:

- `<title>Bundled Page</title>` — no keyword, no brand
- **No meta description, no canonical, no structured data**
- **No crawlable body text** — every headline, service, and city name was injected by JS
- Even *after* JavaScript ran, the rendered page still had **no `<title>`, no meta
  description, and no schema**

Why this is fatal for local SEO:

- **Google's first crawl reads raw HTML before running JS** and uses whatever title/meta
  exist at that moment — here, effectively nothing.
- **AI answer engines (ChatGPT/GPTBot, Perplexity, Claude) do not run JavaScript at all.**
  A JS-only site is close to invisible to them, and AI answers are a fast-growing slice of
  local discovery.

**What we did:** injected a real `<title>`, meta description, canonical, Open Graph/Twitter
tags, geo tags, and a full JSON-LD schema graph into **both** the static shell **and** the
rendered template (so the tags survive the page's JavaScript hand-off), added a crawlable
HTML fallback, and — most importantly — built **standalone, fully static (non-JS) landing
pages** for each target city. The homepage's visual design is unchanged.

---

## 2. What was implemented in this repository

### New crawlable, brand-matched pages (static HTML — readable by Google *and* AI crawlers)

| URL | Purpose | Primary keywords |
|---|---|---|
| `/service-areas` | Service-area hub, linked from the homepage nav (avoids "doorway page" risk) | insurance broker northern nevada |
| `/service-areas/carson-city-nv` | Carson City city page | medicare / insurance broker carson city nv |
| `/service-areas/reno-nv` | Reno–Sparks city page | medicare agent reno nv, health insurance broker reno |
| `/service-areas/lake-tahoe-nv` | Nevada-side Tahoe (Incline→Stateline) | medicare agent lake tahoe / incline village nv |
| `/service-areas/minden-gardnerville-nv` | Carson Valley / Douglas County | medicare broker minden / gardnerville nv |
| `/service-areas/dayton-nv` | Dayton / Lyon County | medicare / insurance broker dayton nv |
| `/about` | E-E-A-T author/advisor page | daniel faiella insurance advisor carson city |
| `/guides/medicare-advantage-vs-supplement-nevada` | Cornerstone educational content that internally links to the city pages | medicare advantage vs supplement nevada |

Each city page has **40–60%+ unique local content** (county, hospital networks — Carson
Tahoe, Renown, Carson Valley Health, Barton — local towns, "how we meet here," and
city-specific FAQs), so they are genuinely useful pages, not thin templated clones.

### Homepage (`index.html`)

- Real title, meta description, canonical, OG/Twitter, geo tags, and JSON-LD in **both** the
  static shell and the JS template — **visual design left intact.**
- The "Service Areas" cards now link to the new city pages; the nav "Service Areas" link now
  points to the `/service-areas` hub.
- A crawlable HTML fallback (NAP, services, city links) for non-JS/AI crawlers.

### Structured data (JSON-LD) on every page

- `InsuranceAgency` (the specific schema type, stronger than generic `LocalBusiness`) with a
  consistent `@id`, verified NAP, and `areaServed` covering all target cities/counties —
  **this is the property that legitimizes serving cities where there's no office.**
- `Person` (Daniel) with `knowsAbout` and a credential placeholder, `WebSite`, `WebPage`,
  `BreadcrumbList`, `Service`/`Offer` catalog, and `FAQPage` on pages with real Q&A.
- **No self-serving `AggregateRating`/`Review` stars** — Google prohibits a business marking
  up its own star rating (it risks a manual action). Star ratings should come from your
  Google Business Profile instead.

### Technical SEO

- `robots.txt` — allows all crawlers, **explicitly welcomes AI crawlers** (GPTBot, ClaudeBot,
  PerplexityBot, Applebot, Bingbot), references the sitemap.
- `sitemap.xml` — all 9 pages.
- `favicon.svg`, `apple-touch-icon.png`, and a branded `og-image.png` (1200×630) for search
  and social previews.

### Compliance (Medicare / CMS)

Because Daniel markets Medicare Advantage/Part D, he is a **Third-Party Marketing
Organization (TPMO)** under CMS rules. Every Medicare-marketing page carries the standard
TPMO disclaimer ("We do not offer every plan available in your area…contact Medicare.gov or
1-800-MEDICARE…") and a "not affiliated with any government agency" statement. **Confirm the
current-year TPMO wording with your FMO/upline before launch** — CMS updates it periodically.

---

## 3. ⚠️ Launch blockers — the site can't rank until these are done

1. **Point the real domain.** `faiellaadvisors.com` is not yet connected to the Vercel
   project (it doesn't resolve). All canonical URLs, the sitemap, and schema are built for
   `https://faiellaadvisors.com`. **Attach the domain to the `daniel-faiella-insurance-advisors`
   Vercel project.** (Internal links are root-relative, so the site also works fine on the
   `.vercel.app` URL in the meantime.) If you decide to stay on a different final domain,
   do a find-and-replace of `https://faiellaadvisors.com` across the repo.
2. **Turn OFF Vercel Deployment Protection.** The deployment currently returns **HTTP 403 to
   the public**, including Googlebot — meaning *nothing here can be indexed*. In Vercel →
   Project → Settings → Deployment Protection, disable protection for production.
3. **After #1 and #2:** verify `faiellaadvisors.com` and submit `sitemap.xml` in **Google
   Search Console**, and set up **Bing Webmaster Tools**.

---

## 4. Off-site playbook (the biggest wins are here)

On-site work makes you *eligible* to rank. These off-site actions are what actually move you
into the map pack and the top of organic results.

### A. Google Business Profile (GBP) — highest single lever

- Create/claim **one** profile as a **Service-Area Business** (hide the street address; add
  service areas: Carson City, Reno, Sparks, Minden, Gardnerville, Dayton, Incline Village,
  Stateline).
- **Primary category:** *Insurance agency*. Add: *Insurance broker, Life insurance agency,
  Health insurance agency*.
- Fill the **Services** section granularly (Medicare Advantage, Medigap, Part D, term life,
  final expense, long-term care, annuities…).
- **Reviews are decisive and beatable here** — the strongest local competitors have only
  ~2–12 Google reviews. Ask happy clients for a steady stream (a few a week, not one big
  burst) and **respond to every one**. Encourage reviewers to mention their city and
  service ("helped my mom with Medicare in Gardnerville"). *Medicare note: don't tie review
  requests to plan enrollment or offer incentives.*
- Post weekly (e.g., "Medicare Annual Enrollment runs Oct 15–Dec 7 — book a Carson City
  review") and seed/answer your own Q&A.

### B. E-E-A-T — add Daniel's verified credentials

Insurance is a "Your Money or Your Life" topic; Google weights author trust heavily. We
intentionally **did not fabricate** any credentials. Add these (they're marked with a `TO
DANIEL` comment in `about.html`, and belong in the `Person` schema too):

- Nevada insurance producer **license number** and **NPN** (National Producer Number)
- **Years licensed / years of experience**
- Professional **designations**, if any
- **Carrier appointments** you can name
- A professional **headshot** (also usable as the Person/OG image)

A publicly displayed, verifiable license number is one of the highest-value trust signals
you can add for a Medicare/financial site.

### C. Local citations (consistent NAP everywhere)

You currently have essentially **no citation footprint** — a clean slate. Use one identical
Name/Phone/City everywhere. Priority order (from competitor research):

1. **medicareagentshub.com** — dominates every NV city SERP; claim an agent profile first.
2. **Trusted Choice** (independent-agent directory), **Expertise.com** (apply for their
   "Best Reno…" lists — they rank page one).
3. Google Business Profile, **Bing Places, Apple Business Connect**, Yelp, **BBB** (get
   accredited), Facebook, LinkedIn, Nextdoor, Alignable.
4. **Chambers of Commerce:** Carson City, **Carson Valley (Minden/Gardnerville)**,
   Reno+Sparks, Incline/Tahoe, **Dayton Area** — real local backlinks + citations.

### D. Local relevance & links

- **Free "Medicare 101" seminars** in Carson City, Minden, and (nobody does this) **Dayton**.
  Competitors use this heavily; it creates events content and local buzz.
- **Local-news PR** (Nevada Appeal, RGJ/This Is Reno, Record-Courier in Minden/Gardnerville,
  Tahoe Daily Tribune) around enrollment season → local editorial backlinks.
- Sponsor a local senior center / community event for a sponsor-page link.

---

## 5. Where to win first

Competitor research shows three **under-defended** markets — target these before the
contested Reno/Carson City race:

- **Dayton** — *no* dedicated Medicare/senior specialist exists. Biggest quick win.
- **Lake Tahoe (NV side)** — only one competitor has a real Tahoe page.
- **Life / annuities / long-term care / retirement income** — almost no local competitor
  covers this vertical well. Daniel already offers all of it.

## 6. Priority keyword targets

**Transactional (city pages):** medicare broker/agent + {carson city, reno, minden,
gardnerville, dayton, incline village} nv · health insurance broker reno nv · independent
insurance agent {city} · medicare supplement/advantage {city} nv · annuities / retirement
income planning {city} nv · long term care insurance {city}.

**Informational (guide + future blog posts):** medicare advantage vs supplement nevada ·
how much does medicare cost in nevada 2026 · medicare eligibility / enrollment periods nevada
· turning 65 checklist nevada · does medicare cover long-term care · is an annuity a good idea.

## 7. Suggested next content (to extend the cluster)

Service pillar pages (`/medicare`, `/life-insurance`, `/long-term-care`, `/annuities`) and a
short blog cluster (Medicare costs 2026, enrollment periods, turning-65 checklist, LTC costs
in Nevada) — each internally linking to the city pages. Refresh year-stamped content annually;
competitors visibly lose rankings on stale ("…2018") pages.

## 8. Measuring results

- **Google Search Console:** impressions/clicks/position per city query; index coverage.
- **Google Business Profile insights:** calls, direction requests, searches by city.
- **Call/text volume** to 775-315-5572 (ask new clients how they found you).
- Track map-pack + organic position for the transactional keywords above, per city.

---

*Research basis: analysis of the live site, current local-SEO best practices (Google Search
Central, Whitespark, BrightLocal, Search Engine Land), CMS TPMO marketing rules, and a
competitor teardown of the ranking Northern Nevada insurance/Medicare agencies (Nevada
Medicare, Senior Insurance Agency, The Medicare Store, A&H Insurance, Health Benefits
Associates, The Big 65). This is a marketing strategy, not legal advice; have your FMO's
compliance team review final Medicare copy.*
