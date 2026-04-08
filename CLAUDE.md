# Pricing Indicator Prototype (PiP) — Session Context

## Deployment

| | |
|---|---|
| **Local repo** | `/Users/jfranklin/pip-prototype/` |
| **GitHub** | `https://github.com/jfranklin-web/pip-prototype` |
| **Live URL** | `https://pip-prototype.vercel.app` |
| **Deploy** | `git add -A && git commit -m "..." && git push` → Vercel auto-builds in ~30s |
| **SSH key** | `~/.ssh/id_ed25519_github` (configured in `~/.ssh/config`) |

No local build needed — Vercel builds on their servers. Never use `npm run build` locally.

---

## Current state (v0.1, Apr 8 2026)

**Two experiences:**

| Experience | Audience | Steps | Status |
|---|---|---|---|
| Pricing advisor | PMs | Goal → Corridors → Results | Built |
| Deal composer | AEs | Customer → Corridors + pricing → Summary | Built |

**Five corridors (5 × 3 products = 15 data entries):**

| Corridor | Fiat GP | USDC GP | Offramp |
|---|---|---|---|
| Philippines (PHP) | Live | Live | Live (dLocal) |
| Mexico (MXN) | Live | Live | Live (Bridge) |
| Argentina (ARS) | Live | Live | Live (dLocal) |
| Nigeria (NGN) | Live | Live | Q2 2026 (Paystack) |
| India (INR) | Live | Live | Q3 2026 |

**Anonymization applied (security — site is on open internet):**
- All pricing is from published sticker rates (stripe.com/global-payouts/pricing) — safe to show
- Bridge infrastructure costs shown only as aggregate "infra cost" per $100 — no Bridge attribution
- Sold deal names (Iron, Dub, Booking, Scale AI) replaced with fictional companies in any commentary
- No internal URLs, Hubble links, or employee LDAPs anywhere
- Discount guidance tables are illustrative ranges, not actual guidance tables

**What's built and working:**

**Launcher:**
- Two experience cards (For PMs / For AEs) with product pills at bottom
- ProtoHeader, Footer, AboutModal, ChangelogModal — all adapted from SOKR prototype

**Pricing advisor (3-step wizard):**
- Step 1 (UseCaseStep): 5 use-case cards + 3 business-type options; eligibility note for Connect platforms
- Step 2 (CorridorStep): 5 corridor cards, multi-select with checkmarks
- Step 3 (ResultsStep): per-corridor product grid (3 columns), FitBadge per product, ProductCard with fee breakdown, expandable tradeoffs + recipient requirements, volatility note for ARS/NGN
- `computeFit()` in `src/utils/pricing.ts` — derives fit level from use case + business type + product characteristics
- "Recommended" banner on best-fit product per corridor

**Deal composer (3-step wizard):**
- Step 1 (CustomerStep): name + business type + volume/payout sliders with live preview
- Step 2 (CorridorProductStep): add corridors from dropdown, product selector per corridor, price input with list/floor/infra cost shown, MarginMeter live visual, discount note field (required when below floor)
- Step 3 (DealSummary): deal health banner (green/amber/red), per-corridor table (price, margin, revenue), blended margin totals, discount log, "Copy summary" button

**Components:**
- `ProductCard`: fee breakdown, FitBadge, volatility note, expandable tradeoffs
- `MarginMeter`: horizontal bar with floor + list markers, zone coloring (green/amber/red)
- `FitBadge`: best_fit / partial / not_recommended / not_eligible pills
- `ProtoHeader` / `Footer` / `AboutModal` / `ChangelogModal` — adapted from SOKR

---

## What to do next

1. **GitHub repo**: Create `pip-prototype` repo at github.com/jfranklin-web (needs GitHub PAT or manual creation), push, wire to Vercel
2. **Offramp pricing**: Placeholder values in mockData — swap real numbers when pricing doc is available
3. **USDC GP floor**: Using 25bps illustrative; real floor to confirm with PM
4. **Launcher screenshot**: Add a real screenshot or mockup PNG for the hero section (optional polish)
5. **Additional corridors**: Plan mentions 50+ live corridors eventually — mock data has 5 for v1
6. **AE polish**: Consider adding a "minimum commitment" note for high-volume deals (>$25M/mo per plan)

---

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Vite + React + TypeScript | Same as SOKR — reuses all infrastructure |
| Hosting | Vercel (not Stripe Pages) | jfranklin has no eng LDAP; Vercel builds on their servers |
| GitHub | github.com/jfranklin-web (personal) | Vercel can't reach git.corp.stripe.com |
| Navigation | Use case first (not product first) | Solution-oriented per user feedback in planning session |
| Fit logic | Computed dynamically in `computeFit()` | Cleaner than hard-coding 75 entries (5 corridors × 3 products × 5 use cases) |
| Pricing display | Per $100 payout | Normalizes across different avg payout sizes; easy to understand |
| Infra cost | Shown in deal composer only, not advisor | Margin data is AE-only; PMs don't need it |
| No em dashes | Hard rule | Same as SOKR; applies everywhere in user-visible text |

---

## File structure

```
pip-prototype/
├── src/
│   ├── main.tsx
│   ├── App.tsx                           ← router: launcher | advisor | composer
│   ├── launcher/
│   │   ├── Launcher.tsx/.module.css
│   ├── experiences/
│   │   ├── advisor/
│   │   │   ├── AdvisorExperience.tsx/.module.css  ← 3-step orchestrator + progress bar
│   │   │   ├── UseCaseStep.tsx/.module.css         ← Step 1: goal + business type
│   │   │   ├── CorridorStep.tsx/.module.css        ← Step 2: corridor multi-select
│   │   │   └── ResultsStep.tsx/.module.css         ← Step 3: per-corridor product grid
│   │   └── composer/
│   │       ├── ComposerExperience.tsx/.module.css  ← 3-step orchestrator + state
│   │       ├── CustomerStep.tsx/.module.css        ← Step 1: name + type + volume
│   │       ├── CorridorProductStep.tsx/.module.css ← Step 2: corridors + pricing + meter
│   │       └── DealSummary.tsx/.module.css         ← Step 3: totals + health + log
│   ├── components/
│   │   ├── ProtoHeader.tsx/.module.css
│   │   ├── Footer.tsx/.module.css
│   │   ├── AboutModal.tsx/.module.css
│   │   ├── ChangelogModal.tsx/.module.css
│   │   ├── ProductCard.tsx/.module.css   ← fee breakdown + tradeoffs + volatility note
│   │   ├── MarginMeter.tsx/.module.css   ← horizontal bar with floor/list markers
│   │   └── FitBadge.tsx/.module.css      ← best_fit / partial / not_recommended / not_eligible
│   ├── data/
│   │   ├── types.ts                      ← ProductId, BusinessType, UseCaseId, FitLevel, etc.
│   │   └── mockData.ts                   ← CORRIDORS, USE_CASES, PRODUCTS (15 entries), DISCOUNT_GUIDANCE
│   ├── utils/
│   │   └── pricing.ts                    ← computeFit(), formatPrice(), getFiatGuidanceFee()
│   └── styles/
│       ├── tokens.css                    ← Stripe/Compass design tokens (copied from SOKR)
│       └── global.css
├── CLAUDE.md                             ← THIS FILE — read first every session
├── index.html
├── vite.config.ts
└── package.json
```

---

## Session protocol

**Start of session:**
1. Read this file — it has everything needed
2. Check live URL if you want to see current visual state
3. Start working

**End of session:**
1. Update this file (Current state, What to do next)
2. Add entry to `ChangelogModal.tsx` for anything user-visible that shipped
3. Update `~/.claude/projects/-Users-jfranklin/memory/MEMORY.md`
4. `git add -A && git commit -m "..." && git push`
