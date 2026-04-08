import type { Corridor, ProductData, UseCase, DiscountGuidance } from './types';

// ----------------------------------------------------------------
// Corridors
// ----------------------------------------------------------------
export const CORRIDORS: Corridor[] = [
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', region: 'APAC' },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', region: 'LATAM' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', region: 'LATAM' },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', region: 'Africa' },
  { id: 'india', name: 'India', flag: '🇮🇳', currency: 'INR', region: 'APAC' },
];

// ----------------------------------------------------------------
// Use cases
// ----------------------------------------------------------------
export const USE_CASES: UseCase[] = [
  {
    id: 'lowest_cost',
    label: 'Lowest cost per payout',
    description: 'Minimize fees for high-volume or margin-sensitive payouts',
    icon: '💰',
  },
  {
    id: 'fastest_settlement',
    label: 'Fastest or 24/7 settlement',
    description: 'Time-critical payouts: gig economy, contractor pay, urgent transfers',
    icon: '⚡',
  },
  {
    id: 'high_volatility',
    label: 'Protect from currency volatility',
    description: 'Corridors with unstable local currencies where USD-pegged delivery adds value',
    icon: '🛡️',
  },
  {
    id: 'marketplace_gig',
    label: 'Pay gig workers or contractors',
    description: 'Flexible, variable payouts to a distributed global workforce',
    icon: '👷',
  },
  {
    id: 'marketplace_sellers',
    label: 'Pay marketplace sellers',
    description: 'Regular scheduled payouts to third-party sellers on a platform',
    icon: '🏪',
  },
];

// ----------------------------------------------------------------
// Product data: 5 corridors × 3 products = 15 entries
// All pricing per $100 payout, US sender, based on published sticker prices.
// Stripe infra costs shown as illustrative "infrastructure cost" only.
// ----------------------------------------------------------------
export const PRODUCTS: ProductData[] = [

  // ---- Philippines ----
  {
    corridorId: 'philippines',
    productId: 'fiat_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.75,
    stickerPrice: 3.50,
    settlementTime: '2-3 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us', 'direct_uk', 'connect_platform'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$1.50' },
      { label: 'Cross-border fee (0.75%)', amount: '$0.75' },
      { label: 'FX fee (1.25%)', amount: '$1.25' },
    ],
    pros: [
      'Widest eligibility — works for Direct and Connect platforms',
      'No crypto wallet required from recipients',
      'Established local bank rails in Philippines',
    ],
    cons: [
      'Highest cost of the three options',
      'Settlement 2-3 banking days, not 24/7',
      'FX rate locked at time of payout — volatility risk',
    ],
    recipientRequirements: ['Local bank account in PHP'],
  },
  {
    corridorId: 'philippines',
    productId: 'usdc_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.10,
    stickerPrice: 1.00,
    settlementTime: 'Instant',
    available24x7: true,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Flat fee', amount: '$0.50' },
      { label: 'Routing fee (0.50%)', amount: '$0.50' },
    ],
    pros: [
      'Lowest all-in cost at ~$1.00/payout',
      'Instant settlement, 24/7/365',
      'USD-denominated — protects against PHP volatility',
    ],
    cons: [
      'US Direct only — not available for Connect platforms or UK Direct',
      'Recipient must have an external crypto wallet',
      'Private Preview — limited availability',
    ],
    recipientRequirements: ['External crypto wallet (e.g., Coinbase, MetaMask)'],
  },
  {
    corridorId: 'philippines',
    productId: 'offramp',
    available: true,
    availabilityStatus: 'live',
    availabilityNote: 'Live via partner (dLocal)',
    stripeCost: 0.75,
    stickerPrice: 1.75,
    settlementTime: '1-2 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$0.50' },
      { label: 'Routing fee (0.75%)', amount: '$0.75' },
      { label: 'Partner conversion fee', amount: '~$0.50' },
    ],
    pros: [
      'Lower cost than Fiat GP at ~$1.75/payout (illustrative)',
      'USD-pegged delivery — recipient gets local fiat without FX risk at sender',
      'Recipient gets PHP via local rails — no crypto wallet needed',
    ],
    cons: [
      'US Direct only — not available for Connect platforms',
      'Sender must hold USDC (Stablecoin Financial Account or Link)',
      'Pricing illustrative — subject to change as product matures',
    ],
    recipientRequirements: ['Local bank account in PHP'],
  },

  // ---- Mexico ----
  {
    corridorId: 'mexico',
    productId: 'fiat_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.50,
    stickerPrice: 3.00,
    settlementTime: '1-2 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us', 'direct_uk', 'connect_platform'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$1.50' },
      { label: 'Cross-border fee (0.50%)', amount: '$0.50' },
      { label: 'FX fee (1.00%)', amount: '$1.00' },
    ],
    pros: [
      'Works for Direct and Connect platforms',
      'SPEI rails offer relatively fast settlement for LATAM',
      'No crypto requirement for recipients',
    ],
    cons: [
      'Highest cost at ~$3.00/payout',
      'Banking hours only',
      'MXN can depreciate between payout initiation and receipt',
    ],
    recipientRequirements: ['Mexican bank account (CLABE number)'],
  },
  {
    corridorId: 'mexico',
    productId: 'usdc_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.10,
    stickerPrice: 1.00,
    settlementTime: 'Instant',
    available24x7: true,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Flat fee', amount: '$0.50' },
      { label: 'Routing fee (0.50%)', amount: '$0.50' },
    ],
    pros: [
      'Lowest cost at ~$1.00/payout',
      'Instant settlement, 24/7/365',
      'Strong stablecoin adoption in Mexico',
    ],
    cons: [
      'US Direct only',
      'Recipient needs external crypto wallet',
      'Private Preview',
    ],
    recipientRequirements: ['External crypto wallet'],
  },
  {
    corridorId: 'mexico',
    productId: 'offramp',
    available: true,
    availabilityStatus: 'live',
    availabilityNote: 'Live via Bridge',
    stripeCost: 0.65,
    stickerPrice: 1.50,
    settlementTime: '1-2 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$0.50' },
      { label: 'Routing + FX fee (~1.00%)', amount: '$1.00' },
    ],
    pros: [
      'Lower cost than Fiat GP at ~$1.50/payout (illustrative)',
      'Recipient receives MXN via SPEI — no crypto wallet needed',
      'Sender holds USD-pegged USDC — avoids FX risk pre-conversion',
    ],
    cons: [
      'US Direct only',
      'Sender must hold USDC',
      'Pricing illustrative',
    ],
    recipientRequirements: ['Mexican bank account (CLABE number)'],
  },

  // ---- Argentina ----
  {
    corridorId: 'argentina',
    productId: 'fiat_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.75,
    stickerPrice: 3.75,
    settlementTime: '2-3 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us', 'direct_uk', 'connect_platform'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$1.50' },
      { label: 'Cross-border fee (1.25%)', amount: '$1.25' },
      { label: 'FX fee (1.00%)', amount: '$1.00' },
    ],
    pros: [
      'Works for Direct and Connect platforms',
      'No crypto wallet required',
    ],
    cons: [
      'Highest cost at ~$3.75/payout',
      'ARS inflation risk: value may erode significantly between send and receipt',
      'Capital controls in Argentina can delay or block payouts',
    ],
    recipientRequirements: ['Argentine bank account (CBU/CVU)'],
    volatilityNote: 'ARS is subject to high inflation and capital controls. Recipients may receive significantly less purchasing power than the USD equivalent sent.',
  },
  {
    corridorId: 'argentina',
    productId: 'usdc_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.10,
    stickerPrice: 1.00,
    settlementTime: 'Instant',
    available24x7: true,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Flat fee', amount: '$0.50' },
      { label: 'Routing fee (0.50%)', amount: '$0.50' },
    ],
    pros: [
      'Lowest cost at ~$1.00/payout',
      'Instant settlement avoids FX exposure window',
      'USD-denominated delivery — strong stablecoin demand in Argentina',
      'Bypasses ARS volatility and capital controls',
    ],
    cons: [
      'US Direct only',
      'Recipient needs external crypto wallet',
    ],
    recipientRequirements: ['External crypto wallet'],
    volatilityNote: 'USDC delivery bypasses ARS volatility entirely — recipient holds USD-denominated value.',
  },
  {
    corridorId: 'argentina',
    productId: 'offramp',
    available: true,
    availabilityStatus: 'live',
    availabilityNote: 'Live via partner (dLocal)',
    stripeCost: 0.95,
    stickerPrice: 1.75,
    settlementTime: '1-2 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$0.50' },
      { label: 'Routing + FX fee (~1.25%)', amount: '$1.25' },
    ],
    pros: [
      'USD-pegged delivery with local fiat output — best of both worlds for ARS',
      'Recipient gets ARS via local rails without needing crypto wallet',
    ],
    cons: [
      'US Direct only',
      'Higher infra cost vs. other corridors due to ARS FX complexity',
      'Pricing illustrative — subject to change',
    ],
    recipientRequirements: ['Argentine bank account (CBU/CVU)'],
    volatilityNote: 'Offramp converts at time of delivery, limiting the FX exposure window vs. Fiat GP.',
  },

  // ---- Nigeria ----
  {
    corridorId: 'nigeria',
    productId: 'fiat_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.75,
    stickerPrice: 3.25,
    settlementTime: '2-3 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us', 'direct_uk', 'connect_platform'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$1.50' },
      { label: 'Cross-border fee (0.75%)', amount: '$0.75' },
      { label: 'FX fee (1.00%)', amount: '$1.00' },
    ],
    pros: [
      'Works for Direct and Connect platforms',
      'Local bank rails via Paystack partnership',
      'No crypto wallet required',
    ],
    cons: [
      'Highest cost at ~$3.25/payout',
      'NGN is subject to high volatility and devaluation risk',
      '2-3 day settlement window increases FX exposure',
    ],
    recipientRequirements: ['Nigerian bank account'],
    volatilityNote: 'NGN has depreciated significantly vs. USD. Fiat GP exposes the recipient to NGN value at time of receipt.',
  },
  {
    corridorId: 'nigeria',
    productId: 'usdc_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.10,
    stickerPrice: 1.00,
    settlementTime: 'Instant',
    available24x7: true,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Flat fee', amount: '$0.50' },
      { label: 'Routing fee (0.50%)', amount: '$0.50' },
    ],
    pros: [
      'Lowest cost at ~$1.00/payout',
      'Instant settlement — avoids multi-day NGN devaluation window',
      'High stablecoin adoption in Nigeria',
    ],
    cons: [
      'US Direct only',
      'Recipient needs external crypto wallet',
    ],
    recipientRequirements: ['External crypto wallet'],
    volatilityNote: 'USDC delivery provides a stable USD-denominated asset — strong fit for Nigeria given NGN volatility.',
  },
  {
    corridorId: 'nigeria',
    productId: 'offramp',
    available: false,
    availabilityStatus: 'q2_2026',
    availabilityNote: 'Coming Q2 2026 via Paystack',
    stripeCost: 0,
    stickerPrice: 0,
    settlementTime: 'TBD',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [],
    pros: ['USD-pegged delivery with NGN local fiat output will reduce both cost and FX exposure'],
    cons: ['Not yet available'],
    recipientRequirements: ['Nigerian bank account (when live)'],
    volatilityNote: 'When live, Offramp will provide NGN delivery with shorter FX exposure window than Fiat GP.',
  },

  // ---- India ----
  {
    corridorId: 'india',
    productId: 'fiat_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.50,
    stickerPrice: 3.00,
    settlementTime: '1-2 biz days',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us', 'direct_uk', 'connect_platform'],
    feeBreakdown: [
      { label: 'Base fee', amount: '$1.50' },
      { label: 'Cross-border fee (0.50%)', amount: '$0.50' },
      { label: 'FX fee (1.00%)', amount: '$1.00' },
    ],
    pros: [
      'Works for Direct and Connect platforms',
      'IMPS/NEFT rails are fast and reliable',
      'No crypto requirement — huge recipient base',
    ],
    cons: [
      'Highest cost at ~$3.00/payout',
      'Regulatory complexity around inbound cross-border payments to India',
    ],
    recipientRequirements: ['Indian bank account (IFSC + account number)'],
  },
  {
    corridorId: 'india',
    productId: 'usdc_payouts',
    available: true,
    availabilityStatus: 'live',
    stripeCost: 0.10,
    stickerPrice: 1.00,
    settlementTime: 'Instant',
    available24x7: true,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [
      { label: 'Flat fee', amount: '$0.50' },
      { label: 'Routing fee (0.50%)', amount: '$0.50' },
    ],
    pros: [
      'Lowest cost at ~$1.00/payout',
      'Instant settlement',
    ],
    cons: [
      'US Direct only',
      'Crypto wallet adoption in India is lower than other corridors',
      'Regulatory uncertainty around crypto in India',
    ],
    recipientRequirements: ['External crypto wallet'],
  },
  {
    corridorId: 'india',
    productId: 'offramp',
    available: false,
    availabilityStatus: 'q3_2026',
    availabilityNote: 'Coming Q3 2026',
    stripeCost: 0,
    stickerPrice: 0,
    settlementTime: 'TBD',
    available24x7: false,
    eligibleBusinessTypes: ['direct_us'],
    feeBreakdown: [],
    pros: ['Will enable INR delivery via UPI/IMPS from USDC, targeting the largest remittance corridor'],
    cons: ['Not yet available'],
    recipientRequirements: ['Indian bank account (when live)'],
  },
];

// ----------------------------------------------------------------
// Discount guidance (illustrative, for Deal Composer)
// Based on publicly available pricing principles.
// ----------------------------------------------------------------
export const DISCOUNT_GUIDANCE: DiscountGuidance[] = [
  {
    productId: 'fiat_payouts',
    fiatGuidanceTiers: [
      { monthlyVolumeMin: 0,          guidance: 1.50, floor: 1.00 },
      { monthlyVolumeMin: 1_000_000,  guidance: 1.25, floor: 0.83 },
      { monthlyVolumeMin: 10_000_000, guidance: 1.00, floor: 0.67 },
      { monthlyVolumeMin: 50_000_000, guidance: 0.75, floor: 0.50 },
    ],
    note: 'Base payout fee only. Cross-border and FX fees may also be negotiable at high volume.',
  },
  {
    productId: 'usdc_payouts',
    bpsGuidance: 75,
    bpsFloor: 25,
    note: 'Routing fee (bps). Flat fee ($0.50) typically not discounted. Guidance based on market deals (illustrative).',
  },
  {
    productId: 'offramp',
    bpsGuidance: 75,
    bpsFloor: 25,
    note: 'Pricing is early stage. Custom pricing available — contact PM for floor.',
  },
];
