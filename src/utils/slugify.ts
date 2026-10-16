/**
 * Turns heading text into a URL-safe anchor id.
 *
 * "How we protect your data" -> "how-we-protect-your-data"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
