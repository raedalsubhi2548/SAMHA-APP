# SAMHA-APP Audit Report

**Repository:** `raedalsubhi2548/SAMHA-APP` · **Domain:** samhaapp.com  
**Branch audited:** `main` (HEAD `6f60529`)  
**Scope:** 18 HTML pages (9 AR + 9 EN), `css/styles.css`, `js/main.js`, `sitemap.xml`, `robots.txt`, `CNAME`, `.github/`  
**Mode:** Read-only audit. No source files modified.

---

## 1. Executive Summary

**Overall health score: 6 / 10**

The site is functional, well-organized, and the analytics pipeline (GTM + TikTok Pixel) is correctly wired across every page. The primary weaknesses are **SEO / international SEO** and **per-page metadata uniqueness**, plus a handful of content bugs and accessibility gaps.

### Top 5 Critical Issues

| # | Issue | Severity | Affected |
|---|---|---|---|
| 1 | **No `hreflang` alternates anywhere** — Google can't pair AR/EN pages, hurting bilingual SEO badly | 🔴 Critical | All 18 pages |
| 2 | **No `<link rel="canonical">` anywhere** — duplicate-content risk; recommended for every page | 🔴 Critical | All 18 pages |
| 3 | **Wrong language switcher target on Policy pages** — `policy/` ↔ `cancellation-policy-en/` (and vice-versa) instead of `policy-en/` | 🔴 Critical | [policy/index.html](policy/index.html#L258), [policy-en/index.html](policy-en/index.html#L245) |
| 4 | **15 / 18 pages missing `<meta name="description">`** — and the 3 that have one are Arabic-only; English siblings have none | 🟡 Warning | 15 pages |
| 5 | **Generic OG/Twitter metadata** — `og:title`, `og:description`, `og:image` are identical on every page; no Twitter Card tags; no JSON-LD; weakens social sharing & rich results | 🟡 Warning | All 18 pages |

---

## 2. HTML Validity & Structure

| Check | Result |
|---|---|
| `<!DOCTYPE html>` present | ✅ All 18 |
| `<html lang="…" dir="…">` correct per language | ✅ AR=`ar/rtl`, EN=`en/ltr` on all |
| `<meta charset="UTF-8">` | ✅ All 18 |
| `<meta name="viewport">` | ✅ All 18 |
| Single `<title>` per page | ✅ All 18 |
| Duplicate IDs | ✅ None found |
| Empty `href=""` | ✅ None |
| `href="#…"` no-handler | 🔵 1 instance — [support/index.html#L121](support/index.html#L121) `<a href="#footer">` (anchor link, valid) |
| Missing `alt` | ✅ None totally missing |
| Empty `alt=""` (decorative) | 🔵 [index.html#L91](index.html#L91), [en/index.html#L97](en/index.html#L97) — language toggle icon. Acceptable as decorative, but should ideally have `aria-hidden="true"` since the surrounding `<a>` already has `aria-label`. |

**🔵 Info — All HTML files start with `<!DOCTYPE html>` and have well-formed head/body, no obvious unclosed tags detected.**

---

## 3. SEO & Meta Tags

### 3.1 Per-page `<meta name="description">`

🔴 **Critical** — only 3 of 18 pages have a description, all Arabic.

| Has description | Missing description |
|---|---|
| [cancellation-policy/index.html](cancellation-policy/index.html), [policy/index.html](policy/index.html), [salons/index.html](salons/index.html) | All other 15 pages |

**Fix:** Add a unique, hand-written `<meta name="description" content="…">` (≤155 chars) to every page in both languages.

### 3.2 Canonical & hreflang

🔴 **Critical** — `<link rel="canonical">` is **absent on all 18 pages**.  
🔴 **Critical** — `<link rel="alternate" hreflang="…">` pairs are **absent on all 18 pages**.

This is the biggest SEO defect for a bilingual site. Google has no signal that `/about/` and `/about-en/` are language variants of the same page.

**Fix:** Add to every page in `<head>`:
```html
<link rel="canonical" href="https://samhaapp.com/<this-page>/">
<link rel="alternate" hreflang="ar-SA" href="https://samhaapp.com/<ar-path>/">
<link rel="alternate" hreflang="en"    href="https://samhaapp.com/<en-path>/">
<link rel="alternate" hreflang="x-default" href="https://samhaapp.com/">
```

### 3.3 Open Graph

🟡 **Warning** — every page carries the **same** generic `og:title` / `og:description` / `og:image` (homepage values), even though `og:url` is correctly per-page. Social shares from `/features/` look like shares of `/`.

**Fix:** Localize and personalize `og:title` and `og:description` per page (mirror the page `<title>` and meta-description).

### 3.4 Twitter Cards

🟡 **Warning** — **No Twitter Card tags on any page.**  
**Fix:** Add `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` per page.

### 3.5 Structured Data (JSON-LD)

🟡 **Warning** — **No JSON-LD anywhere.**  
**Fix:** Add at least an `Organization` schema sitewide and a `MobileApplication` schema on the homepage(s) and `features` pages, plus `FAQPage` on `/faq/` and `/faq-en/`.

### 3.6 sitemap.xml & robots.txt

| File | Status |
|---|---|
| [robots.txt](robots.txt) | ✅ Allows all, references sitemap |
| [sitemap.xml](sitemap.xml) | ✅ Lists all 18 URLs with priorities. 🔵 `<lastmod>` is `2026-03-26` — slightly stale after recent edits; consider bumping. 🔵 No `<xhtml:link rel="alternate" hreflang>` entries inside `<url>` blocks (recommended companion to per-page hreflang). |

### 3.7 Favicon / Touch Icon

🔵 **Info** — Favicon and apple-touch-icon use a 1200×630-class CDN PNG (`p_3737eoioj1.png`) — same image as `og:image`. Browsers will resize it, but a dedicated 32×32 / 180×180 file would be cleaner.

---

## 4. Performance

| Issue | Severity | Files | Description |
|---|---|---|---|
| Images without `width`/`height` attributes | 🟡 Warning | All 18 — 0 of all `<img>` tags carry both attributes | Causes Cumulative Layout Shift (CLS). Especially the hero phone image and 6 banner slides on `index.html` / `en/index.html`. |
| Hero phone uses heavy `.jpeg` from external CDN | 🟡 Warning | [index.html#L138](index.html#L138), [en/index.html#L144](en/index.html#L144) | `p_3775geh6z1.jpeg` is render-critical and on the LCP path. Recommend a self-hosted, optimized `.webp` with explicit `width`/`height` and `fetchpriority="high"`. |
| `loading="lazy"` coverage low | 🟡 Warning | Most pages have only 1 lazy image (the MoC logo); other CDN images are eagerly loaded | Add `loading="lazy"` to non-hero images and `decoding="async"`. |
| No `preconnect` for `top4top.io` image CDN | 🟡 Warning | Every page (only Google fonts are preconnected) | Add `<link rel="preconnect" href="https://i.top4top.io" crossorigin>` (and the other letter subdomains used) or at least `dns-prefetch`. |
| Render-blocking Google Fonts | 🔵 Info | All pages | `display=swap` is set ✅, but consider `<link rel="preload" as="style">` for faster paint. |
| Unminified CSS/JS | 🔵 Info | `css/styles.css` (76.6 KB), `js/main.js` (8.6 KB) | Minification would save ~30–40 % bytes; not critical at this scale but easy win. |
| `!important` overuse | 🔵 Info | `css/styles.css` | 39 occurrences. Suggests cascading conflicts; refactor candidate. |
| Inline `<style>` attributes | 🔵 Info | [index.html](index.html), [en/index.html](en/index.html) (16 each), [cancellation-policy/index.html](cancellation-policy/index.html) (13), [cancellation-policy-en/index.html](cancellation-policy-en/index.html) (12) | Hurts caching/CSP; move to `styles.css`. |

---

## 5. Accessibility (a11y)

| Issue | Severity | File(s) | Description |
|---|---|---|---|
| No skip-to-content link | 🟡 Warning | All 18 pages | Add `<a href="#main" class="skip-link">…</a>` as first focusable element. |
| Buttons without `aria-label` | 🟡 Warning | [faq/index.html](faq/index.html), [faq-en/index.html](faq-en/index.html) — 5 buttons each, 0 labelled (FAQ accordion toggles) | Buttons whose only content is a `+/−` glyph are unreadable to screen readers. Add descriptive `aria-label` and `aria-expanded`. |
| Decorative img not flagged | 🔵 Info | [index.html#L91](index.html#L91), [en/index.html#L97](en/index.html#L97) | `alt=""` is fine, but adding `aria-hidden="true"` is clearer since the parent `<a>` already has `aria-label`. |
| Modal accessibility | 🟢 Pass | [index.html](index.html), [en/index.html](en/index.html) | `#storeModal` has `role="dialog"` + `aria-modal="true"` + `aria-labelledby` ✅. `#appModal`, however, has **no** `role`, `aria-modal`, or focus trap — only inline styles. |
| Color contrast | 🔵 Info | `css/styles.css` | Footer disclaimer `color:#8b6f6f` on light pink approx. ratio ~3.2:1 — borderline for AA on small text. Spot check, not a full a11y scan. |
| Form `<label>` association | 🟢 N/A | — | No `<form>` elements found in the repo. |

---

## 6. Responsive & Mobile

| Issue | Severity | File(s) | Description |
|---|---|---|---|
| Hardcoded pixel widths in inline styles | 🟡 Warning | [index.html](index.html), [en/index.html](en/index.html) (CTA/icons), some store badge inline styles | Mostly small (24px icons) so low impact, but the App Modal block uses inline styles for a 380px max card which works because it's `width:90%` + `max-width:380px`. ✅ |
| Missing image `width`/`height` | 🟡 Warning | All — see §4 | Same finding as performance: causes layout shift on mobile especially. |
| Touch target sizing | 🔵 Info | Banner dot/arrow buttons | Visually < 44 × 44 px depending on CSS — confirm via DevTools; if so, expand the hit area. |
| Text < 12 px | 🔵 Info | Footer disclaimer is `0.85rem` (≈13.6 px) ✅, but inline `font-size: 12.5px` in mobile media query for `.footer-cr` is borderline. |
| Horizontal overflow risk | 🔵 Info | Banner slider on home pages — verify that long Arabic captions don't push the slide outside on narrow widths. |

---

## 7. RTL / LTR Consistency

| Check | Result |
|---|---|
| AR pages: `lang="ar" dir="rtl"` | ✅ All 9 |
| EN pages: `lang="en" dir="ltr"` | ✅ All 9 |
| Language switcher present | ✅ Footer `.footer-lang-switch` on all 18 |
| Hero language toggle | 🔵 Only on home pages (`/`, `/en/`) — not on inner pages. Consider adding for parity. |
| AR/EN content not mixed accidentally | 🟢 Spot-check passed |
| RTL-aware swiper | ✅ `setupBannerSlider()` checks `document.documentElement.dir === 'rtl'` and reverses swipe direction ([js/main.js#L138](js/main.js#L138)). |
| Icons that should mirror in RTL | 🔵 Banner arrow chevrons (`<polyline points="15 18 9 12 15 6">` / `9 18 15 12 9 6`) are pre-set per direction in markup; verify they don't visually "go backward" on AR. |

---

## 8. Analytics & Tracking

| Tag | Status |
|---|---|
| GTM `GTM-N6J24XRC` (script) | ✅ Present once on all 18 pages |
| GTM `<noscript>` iframe | ✅ Present once on all 18 pages |
| TikTok Pixel `D7RO06JC77U4TTGIGDM0` | ✅ Present exactly once on all 18 pages, code is uncorrupted |
| GA4 `G-9945C28B1P` | 🔵 Not embedded directly in HTML on any page. **Assumed to fire via the GTM container** (correct best practice, but cannot verify from the repo alone — verify in GTM console). |
| Duplicate / conflicting scripts | ✅ None |

**🟢 Pass** — analytics layer is clean.

---

## 9. Links & Navigation

### 9.1 Language switcher integrity

🔴 **Critical bug** in Policy pages:

| File | Current `footer-lang-switch` href | Should be |
|---|---|---|
| [policy/index.html#L258](policy/index.html#L258) | `/cancellation-policy-en/` | `/policy-en/` |
| [policy-en/index.html#L245](policy-en/index.html#L245) | `/cancellation-policy/` | `/policy/` |

All other 16 pages pair correctly.

### 9.2 External links

✅ All `target="_blank"` external links carry `rel="noopener"` (some additionally `noreferrer`). No risk of reverse tabnabbing.

### 9.3 Email & WhatsApp consistency

| Channel | Value | Pages |
|---|---|---|
| WhatsApp | `+966 57 545 7450` (`wa.me/966575457450`) | ✅ All 18, identical |
| Email | `info@samhaapp.com` | ✅ All 18 |
| Email (extra) | `privacy@samhaapp.com` | 🔵 Only on cancellation-policy / -en (intentional) |
| Email (extra) | `salons@samhaapp.com` | 🔵 Only on salons-en (🟡 — Arabic [salons/index.html](salons/index.html) does NOT mention this address; inconsistency between AR/EN versions) |

### 9.4 App Store / Google Play

| Channel | URL |
|---|---|
| App Store (customer) | `apps.apple.com/sa/app/samha/id6760321732` |
| Google Play (customer) | `play.google.com/store/apps/details?id=com.samha.customer` |
| App Store (owner) | `apps.apple.com/sa/app/samha-owner/id6760688062?l=ar` |
| Google Play (owner) | `play.google.com/store/apps/details?id=com.samha.owner` |

🔵 Store links **only appear on the home pages** (`/`, `/en/`) plus inside `js/main.js` (`STORE_LINKS` constant). Inner pages have no download CTA at all — by design? Consider adding a small footer "Download" CTA on every page.

### 9.5 Self-link in support page social row

🔵 **Info** — [support/index.html#L196](support/index.html#L196) the "Support" social pill links to `/support/` — i.e. itself. Same on `support-en/`. Likely harmless but worth reviewing.

### 9.6 Internal navigation

🟢 All internal `nav-chip` links use absolute paths (`/about/`, `/features/`, …). No relative-path traps. No 404 candidates detected from static inspection.

---

## 10. Security

| Check | Result |
|---|---|
| Inline `onclick=` handlers | 🟡 [index.html](index.html) and [en/index.html](en/index.html) — 3 each (modal open/close on the App-Download modal). Blocks strict CSP. |
| External scripts without integrity hash | 🔵 GTM and TikTok Pixel use loader patterns that don't accept SRI. Acceptable but means we trust both endpoints fully. |
| Mixed content (`http://`) | ✅ None found |
| Exposed secrets / API keys in client JS | ✅ None — `js/main.js` contains only store links (public) |
| Security headers (`_headers`, CSP) | 🔴 **Missing** — no `_headers`, no `<meta http-equiv="Content-Security-Policy">`. GitHub Pages doesn't let you set headers per-file, so a meta-CSP and `Strict-Transport-Security` enforcement at registrar level would be the available defense in depth. |
| `X-Frame-Options` / clickjacking protection | 🔴 None (same constraint). At minimum add `<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">` (limited support but cheap). |
| `Permissions-Policy` | 🔵 Not set; consider via `<meta>` to deny `geolocation`, `microphone`, `camera`, `payment` (you don't use them). |

---

## 11. Geo-Blocking / International Access

| Check | Result |
|---|---|
| [CNAME](CNAME) | `samhaapp.com` only — fine. |
| `_redirects`, `.cloudflare`, custom edge configs | ✅ **None present** in repo |
| `.github/workflows/*.yml` | ✅ Empty `.github/` directory — site is published via GitHub Pages from `main`, no GitHub Actions deployment, no IP filtering |
| IP / country logic in JS | ✅ None — `js/main.js` has no geolocation, no `navigator.language` redirects, no `fetch('/geoip')` |
| `robots.txt` geo-restriction | ✅ Allows all UAs |
| Sitemap geo-restriction | ✅ None |

**🟢 Conclusion:** the repo itself does **not** geo-block anyone. Any access issues from outside KSA must come from the **DNS provider, registrar, or a Cloudflare layer in front of GitHub Pages** that is NOT versioned in this repo. Verify directly at the DNS/CDN dashboard.

---

## 12. Dead Code & Cleanup

| Check | Result |
|---|---|
| `console.log()` / `debugger` left | ✅ None in `js/main.js`, none in HTML |
| `TODO` / `FIXME` markers | ✅ None |
| Commented-out code blocks | 🔵 `js/main.js` has one informational comment `/* Hero slider removed - now using single static phone image */` ([js/main.js#L48](js/main.js#L48)) — harmless. |
| Orphan files | 🔵 `assets/images/.gitkeep` only — empty assets folder. Not used by any HTML/CSS. Consider removing or actually self-hosting the 6 banner images + hero phone there. |
| Unused CSS classes | 🔵 Not exhaustively checked — `css/styles.css` is 76.6 KB with 19 media queries and 39 `!important` rules; recommend running PurgeCSS as a future maintenance task. |
| Audit script left in repo | 🔵 The earlier `_apply_fixes.ps1` was already removed ✅. |

---

## 13. Broken Functionality

| Component | Status | Notes |
|---|---|---|
| `setupNavScroll` | 🟢 OK | Smooth scroll attached to `.nav-chip[data-target]`. **🔵 Note:** in HTML the `nav-chip` anchors use `href="/about/"` etc. (cross-page nav) and have **no `data-target` attribute**, so `setupNavScroll` does nothing on these — the click falls through to the link's normal navigation. Functional, but the function is effectively dead code unless other pages add `data-target`. |
| `setupSectionReveal` | 🟢 OK | IntersectionObserver-based; safe. |
| `setupParallax` | 🟢 OK | Listens to `scroll`; not throttled (`requestAnimationFrame` would be cheaper). |
| `setupBannerSlider` | 🟢 OK | Autoplay 4 s, swipe-aware, RTL-aware, pause on hover. ✅ |
| `setupFaq` | 🟢 OK | Toggle works; **🟡 a11y:** lacks `aria-expanded` toggling. |
| `setupAutoScrollRow` | 🟢 OK | Just sets `transform: translateZ(0)` — function name suggests auto-scroll but no scroll logic. Possibly stubbed / dead. |
| `setupRoadTimelineAnimation` | 🟢 OK | Pauses CSS animation until in view. |
| `setupStoreModal` | 🟢 OK | Uses centralized `STORE_LINKS`, includes Escape-to-close, click-outside-to-close, double-bind guard. ✅ |
| App Download modal (`#appModal`) | 🟡 | Works only on `/` and `/en/`. Inner pages have no CTA pointing to it (so no broken trigger), but consider adding it everywhere. **A11y:** missing `role="dialog"`, `aria-modal`, focus trap. |

---

## 14. Final Findings Table (sortable)

| # | Sev | Category | File(s) | Issue |
|---|---|---|---|---|
| 1 | 🔴 | SEO | All 18 | No `<link rel="canonical">` |
| 2 | 🔴 | SEO | All 18 | No `<link rel="alternate" hreflang>` AR↔EN |
| 3 | 🔴 | Links | [policy/index.html#L258](policy/index.html#L258) | Lang-switch points to `/cancellation-policy-en/` instead of `/policy-en/` |
| 4 | 🔴 | Links | [policy-en/index.html#L245](policy-en/index.html#L245) | Lang-switch points to `/cancellation-policy/` instead of `/policy/` |
| 5 | 🔴 | Security | repo | No `_headers` / CSP / X-Frame-Options |
| 6 | 🟡 | SEO | 15 of 18 | Missing `<meta name="description">` |
| 7 | 🟡 | SEO | All 18 | Generic OG (same `og:title`/`og:description`/`og:image` everywhere) |
| 8 | 🟡 | SEO | All 18 | No Twitter Card tags |
| 9 | 🟡 | SEO | All 18 | No JSON-LD structured data |
| 10 | 🟡 | SEO | [sitemap.xml](sitemap.xml) | `lastmod` stale (2026-03-26); no `xhtml:link` hreflang |
| 11 | 🟡 | Performance | All `<img>` site-wide | No explicit `width`/`height` (CLS risk) |
| 12 | 🟡 | Performance | All 18 | No `preconnect`/`dns-prefetch` for `top4top.io` |
| 13 | 🟡 | Performance | [index.html#L138](index.html#L138), [en/index.html#L144](en/index.html#L144) | Hero phone JPEG is render-critical, not preloaded, not WebP |
| 14 | 🟡 | Performance | Most pages | `loading="lazy"` only on 1 image per page (MoC logo) |
| 15 | 🟡 | A11y | All 18 | No skip-to-content link |
| 16 | 🟡 | A11y | [faq/index.html](faq/index.html), [faq-en/index.html](faq-en/index.html) | 5 FAQ accordion buttons each lack `aria-label` & `aria-expanded` |
| 17 | 🟡 | A11y | [index.html](index.html), [en/index.html](en/index.html) | `#appModal` missing `role="dialog"`, `aria-modal`, focus trap |
| 18 | 🟡 | Security | [index.html](index.html), [en/index.html](en/index.html) | 3 inline `onclick=` handlers each (CSP-blocking) |
| 19 | 🟡 | Links | [salons-en/index.html](salons-en/index.html) | Has `salons@samhaapp.com` mailto, but [salons/index.html](salons/index.html) doesn't — inconsistency between AR/EN |
| 20 | 🟡 | RTL | banner arrows | Verify chevron direction visually in RTL |
| 21 | 🔵 | A11y | [index.html#L91](index.html#L91), [en/index.html#L97](en/index.html#L97) | Lang-toggle img: add `aria-hidden="true"` to decorative img |
| 22 | 🔵 | Performance | `css/styles.css` | 39 `!important` declarations |
| 23 | 🔵 | Performance | `css/styles.css`, `js/main.js` | Unminified |
| 24 | 🔵 | Cleanup | `assets/images/` | Empty folder; banner/hero images are externally hosted on top4top.io (a free image host — fragility risk) |
| 25 | 🔵 | Cleanup | [js/main.js#L48](js/main.js#L48), [js/main.js](js/main.js) | `setupAutoScrollRow` is a near-no-op; old hero-slider comment leftover |
| 26 | 🔵 | Cleanup | [js/main.js](js/main.js) | `setupNavScroll` looks for `data-target` that no nav-chip provides — effectively dead branch |
| 27 | 🔵 | Cleanup | All 18 | Many inline `style="…"` attributes (esp. home pages, cancellation-policy) — should move to `styles.css` |
| 28 | 🔵 | Functionality | All inner pages | Have no app-download CTA / modal — consider adding |
| 29 | 🔵 | UX | All 18 | Footer disclaimer color contrast `#8b6f6f` on light pink ~3.2:1 — borderline for WCAG AA |
| 30 | 🔵 | Misc | [support/index.html#L196](support/index.html#L196), [support-en/index.html](support-en/index.html) | "Support" social-pill self-links to `/support/` (the page itself) |
| 31 | 🔵 | SEO | favicon | Single 1200×630-class image used as both favicon and `og:image` — provide dedicated 32/180 px assets |
| 32 | 🟢 | Analytics | All 18 | GTM, GTM-noscript, TikTok Pixel — all clean and verified |
| 33 | 🟢 | Geo | repo | No geo-blocking, no IP/country logic anywhere in repo (any global-access issue lives at DNS/CDN level, outside this repo) |

---

## Awaiting instruction

This audit is **read-only**. No source files were modified. Tell me which issue numbers you want fixed and I will execute them in order.
