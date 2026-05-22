export function buildBusinessPublicUrl(
  publicBaseUrl: string,
  slug: string,
): string {
  return `${publicBaseUrl.replace(/\/$/, '')}/businesses/${slug}`;
}
