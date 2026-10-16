export const PRICING = {
  landing: 100, // confirmed by the owner
  lowCode: 800, // TODO(owner): confirm. Taken from the current Why Choose Us copy
  custom: 1600, // TODO(owner): confirm. Taken from the current Why Choose Us copy
} as const;

export const formatUsd = (usd: number) => `$${usd.toLocaleString('en-US')}`;

/* Text-only tiers shared by the page copy and the chat prompt. */
export const PRICING_TIERS = [
  { key: 'landing', label: 'Landing Page', usd: PRICING.landing },
  { key: 'lowCode', label: 'Low Code', usd: PRICING.lowCode },
  { key: 'custom', label: 'Custom', usd: PRICING.custom },
] as const satisfies readonly { key: keyof typeof PRICING; label: string; usd: number }[];
