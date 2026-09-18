export const PRICING = {
  landing: 100, // confirmed by the owner
  lowCode: 800, // TODO(owner): confirm. Taken from the current Why Choose Us copy
  custom: 1600, // TODO(owner): confirm. Taken from the current Why Choose Us copy
  apiIntegrations: 1600, // TODO(owner): confirm
  uiUxDesign: 800, // TODO(owner): confirm
  branding: 800, // TODO(owner): confirm
} as const;

export const formatUsd = (usd: number) => `$${usd.toLocaleString('en-US')}`;

export const formatPrice = (usd: number) => `From ${formatUsd(usd)}`;
