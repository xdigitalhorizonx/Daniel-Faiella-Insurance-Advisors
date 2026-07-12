# SEO Health Audit — faiellainsurance.com

**Audit date:** July 12, 2026 · **Audited state:** `main` @ `6fbf3c5` (the commit serving production on Vercel) plus live-server behavior checks.

---

## Bottom line

**Lighthouse SEO score: 100/100** — verified today on all five page types (homepage, city page, service pillar, blog post, About). On-page and technical SEO is effectively complete. The site went live **this morning** (noindex removed 03:15, GSC verification added 03:49), so "zero pages indexed in Google" is expected timing, not a defect.

What actually stands between the site and a 100% *health* score is now: **one real technical conflict (www vs. apex), one E-E-A-T gap (license number), the launch-operations checklist (GSC/Bing), and the off-site program** — which is where local rankings are won from here.

### Scorecard

| Category | Score | The gap |
|---|---|---|
| Crawlability & indexability | 92 | www/apex redirect contradicts every canonical (P0 #1) |
| On-page metadata | 95 | A handful of over-length titles/descriptions |
| Structured data | 97 | Credential has no license number; hours consistency with GBP |
| Content | 90 | Fallon / Fernley / Genoa promised but have no pages |
| Performance (lab, static analysis) | ~95 | Static inline-CSS pages, self-hosted fonts, responsive hero — validate on live URL once public data accrues |
| Measurement | 85 | GTM + GSC tag live today; confirm sitemap submitted; Bing missing |
| Local / off-site | 30 | GBP exists and is linked; citations, reviews, local links not started |

---

## The 9 items between here and 100%

### P0 — This week

**1. Resolve the www ↔ apex conflict (only real technical bug found).**
Verified live: `https://faiellainsurance.com/*` responds **308 → `https://www.faiellainsurance.com/*`** (www is set as the primary domain in Vercel), while **every canonical, sitemap URL, schema `@id`, `og:url`, robots.txt sitemap line, and llms.txt link on the site uses the apex**. Google is told two contradictory things about which host is real: the sitemap says crawl apex, the server redirects to www, and the page served on www declares apex as canonical. On a brand-new domain this wastes crawl budget and can delay/split indexing.
**Fix (pick one):**
- *Recommended:* Vercel → Project → Settings → Domains → make `faiellainsurance.com` the primary domain and set `www` to redirect to it. Zero code changes — the entire site already uses apex URLs.
- Alternative: keep www primary and find-and-replace `https://faiellainsurance.com` → `https://www.faiellainsurance.com` across all 21 HTML files, `sitemap.xml`, `robots.txt`, and `llms.txt`.

**2. Finish the search-engine onboarding.**
- Google Search Console: property was verified today — now **submit `sitemap.xml`** and run URL Inspection → *Request indexing* on the homepage, `/services/medicare`, `/service-areas/carson-city-nv`, `/service-areas/reno-nv`, `/about`, and the Medicare guide.
- **Bing Webmaster Tools** (one-click import from GSC) + submit the sitemap there. Bing powers ChatGPT/Copilot answers — meaningful for a site whose robots.txt and llms.txt already court AI crawlers.
- Expectation-setting: new domain → homepage indexed within days, inner pages over 1–6 weeks. Map-pack position comes from the GBP work (#4), not the website.

**3. Publish Daniel's license credentials (highest-value E-E-A-T lever, needs Daniel).**
The `Person` schema carries `credentialCategory: "Nevada Insurance Producer License"` but **no license number, no NPN** appears anywhere on the site. For a YMYL Medicare/financial site, a publicly verifiable license number is the single strongest trust signal available. Add to `/about` (visible text) and to the `hasCredential` schema: NV producer license #, NPN, years licensed, carrier appointments he can name.

### P1 — This month (off-site: where rankings are actually won)

**4. Google Business Profile build-out + review engine.** The profile exists and is properly linked (`hasMap`, `sameAs`, review link with CID `7820892945307879894` — good). Now: fill the Services section granularly, add photos, post weekly (AEP countdown content), seed Q&A, and start a *steady* review stream (a few per week, respond to every one, encourage city mentions — "helped my mom in Gardnerville"). CMS note: never tie review requests to enrollment or offer incentives.

**5. Citations (NAP identical everywhere).** Priority order from the competitor research: medicareagentshub.com → Trusted Choice → Expertise.com ("Best Reno" lists) → Bing Places → Apple Business Connect → Yelp → BBB (accredited) → Facebook/LinkedIn/Nextdoor/Alignable → Chambers: Carson City, Carson Valley, Reno+Sparks, Incline/Tahoe, Dayton Area. Once profiles exist, add them to the schema `sameAs` array.

**6. Local links & PR.** Free "Medicare 101" seminars (Carson City, Minden, and Dayton — where no competitor does this); enrollment-season pitches to Nevada Appeal, Record-Courier, This Is Reno, Tahoe Daily Tribune; a senior-center or community-event sponsorship link.

### P2 — On-site polish (~one working session)

**7. SERP-display trims and small fixes.**
- Titles over ~60 chars get truncated: worst offenders are `services/long-term-care` (107), `services/life-insurance` (100), the two blog posts (94–95), `services/index` (91), `services/medicare` (87). Keywords are front-loaded so this is cosmetic, but trimming recovers the full display line.
- Meta descriptions 197–236 chars on 9 pages — Google cuts at ~155–160.
- Blog-card image mismatch on the homepage: the *Term vs. Whole vs. IUL* card uses `blog-longterm-care.webp`.
- Add a branded `404.html` (currently Vercel's plain-text "NOT_FOUND"; status code is correctly 404).
- Add a `/favicon.ico` fallback (SVG + apple-touch icon are present).
- Refresh `sitemap.xml` `<lastmod>` for the pages edited July 12 (currently 19 say 07-11).

**8. Real form handling.** Both the contact form and the newsletter form are `mailto:` composers — they silently do nothing for users without a configured mail client, and nothing is trackable in GA4. Wire them to a real endpoint (Formspree, Basin, or a small Vercel function) and fire a GTM conversion event. This is the biggest *conversion* gap, not a crawl issue.

**9. Fallon / Fernley / Genoa.** The homepage area grid shows "Fallon" (links to the hub) and "Fernley" (links to the *Dayton* page), and llms.txt/schema claim all three towns. Either build the city pages (Fernley/Fallon = Lyon/Churchill counties, zero competition, same playbook as Dayton) or soften the promises. Building them is the better call — Dayton-style pages in under-defended markets were the strategy's biggest quick win.

### P3 — Cadence (ongoing)

- One post per month against the informational keyword list (turning-65 checklist Nevada, Medicare costs in Nevada 2026, enrollment periods explained, does Medicare cover long-term care).
- Refresh year-stamped content each January (competitors visibly lose rankings on stale pages); bump `dateModified` + sitemap `lastmod`.
- Watch GSC coverage weekly for the first month; then monthly. Once field data exists, check Core Web Vitals on PageSpeed Insights against the live URL.
- Keep GBP hours and the site's "Open 24 hours · by appointment" statement consistent (schema currently declares 24/7 — matches footer; make sure GBP says the same).

---

## What's already at 100% (verified today)

- **Lighthouse SEO 100/100** on `/`, `/service-areas/carson-city-nv`, `/services/medicare`, `/blog/medicare-glp-1-bridge-program-2026`, `/about`.
- All **21 pages**: unique title, unique meta description, self-referencing canonical, exactly one `<h1>`, `lang="en"`, JSON-LD, viewport; **100% image alt coverage**; **zero broken internal links** (every `href`/`src` on all pages resolves).
- **Structured data graph**: `InsuranceAgency` (+`areaServed` for every target city/county), `Person` with `knowsAbout`, `WebSite`, `WebPage`, `BreadcrumbList` sitewide, `FAQPage` where real Q&A exists, `Service`/`OfferCatalog` on pillars, `BlogPosting` with dates/author on posts, `ContactPage`/`ContactPoint`, GBP linked via `hasMap`/`sameAs`/ReviewAction. No self-serving star ratings (correct — policy-safe).
- **Technical**: clean extensionless URLs (`cleanUrls`), hard 404s (real 404 status), `robots.txt` welcoming Google/Bing + GPTBot/ClaudeBot/PerplexityBot/Applebot, `llms.txt` for AI answer engines, sitemap with all 20 indexable URLs (the noindexed `/danielfaiella` personal page is correctly excluded), HSTS/CSP/security headers, immutable font caching, no `noindex` remnants anywhere.
- **Performance architecture**: fully static single-file pages (19–42 KB HTML), inline CSS, self-hosted subsetted fonts with `preload` + `font-display:swap`, responsive hero with `srcset`/`sizes`/`fetchpriority=high` + explicit dimensions, lazy-loaded below-fold images, GTM as the only third-party script.
- **Compliance**: CMS TPMO disclaimer + government non-affiliation in the sitewide footer.
- **Launch ops**: GTM (`GTM-KQTNQQ3M`) live, GSC verification meta live, pre-launch noindex header removed.

## Notes on evidence

- Public fetches of the site (and of nextjs.org, as a control) return 403 to automated fetchers — that is Vercel's platform-level bot handling, **not** a site misconfiguration; authenticated fetches confirm the site serves 200 with correct headers and no `x-robots-tag`.
- `site:faiellainsurance.com` returns nothing in Google as of this morning — consistent with a launch a few hours old, re-check after P0 #1–2.
- This audit was performed against `main` (the deployed code). The earlier snapshot this branch previously pointed to (JS-rendered homepage, faiellaadvisors.com URLs) has been fully superseded by the July 11–12 rebuild.
