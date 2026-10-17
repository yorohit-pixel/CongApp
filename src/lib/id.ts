/** Small client-side id helper for mock data. The backend will issue real ids. */
export function makeId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}${random}`;
}
