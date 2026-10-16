import 'server-only';

import { isIP } from 'node:net';

const UNKNOWN = 'unknown';

const toHextets = (ip: string): number[] | null => {
  const [head, tail] = ip.split('::');
  const parse = (part: string | undefined): string[] => (part ? part.split(':') : []);
  const expandV4 = (parts: string[]): string[] => {
    const last = parts[parts.length - 1];
    if (!last || !last.includes('.')) return parts;
    const [a, b, c, d] = last.split('.').map(Number);
    return [...parts.slice(0, -1), ((a << 8) | b).toString(16), ((c << 8) | d).toString(16)];
  };
  const headParts = expandV4(parse(head));
  const tailParts = tail === undefined ? [] : expandV4(parse(tail));
  const fill = tail === undefined ? 0 : 8 - headParts.length - tailParts.length;
  if (fill < 0) return null;
  const all = [...headParts, ...Array<string>(fill).fill('0'), ...tailParts].map((h) =>
    parseInt(h, 16),
  );
  return all.length === 8 && all.every((n) => Number.isFinite(n)) ? all : null;
};

const normalize = (raw: string): string => {
  const candidate = raw
    .trim()
    .replace(/^\[|\]$/g, '')
    .split('%')[0];
  const version = isIP(candidate);
  if (version === 4) return candidate;
  if (version !== 6) return UNKNOWN;

  const hextets = toHextets(candidate);
  if (!hextets) return UNKNOWN;

  // IPv4-mapped (::ffff:a.b.c.d): bucket as the IPv4 address.
  if (hextets.slice(0, 5).every((n) => n === 0) && hextets[5] === 0xffff) {
    return [hextets[6] >> 8, hextets[6] & 255, hextets[7] >> 8, hextets[7] & 255].join('.');
  }

  // IPv6: one bucket per /64 (first four hextets).
  return `${hextets
    .slice(0, 4)
    .map((n) => n.toString(16))
    .join(':')}::/64`;
};

/** Vercel overwrites `x-forwarded-for`, so its first entry is trusted there. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0];
  if (forwarded?.trim()) return normalize(forwarded);
  const real = headers.get('x-real-ip');
  if (real?.trim()) return normalize(real);
  return UNKNOWN;
}
