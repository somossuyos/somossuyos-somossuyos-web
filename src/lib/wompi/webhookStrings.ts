export function str(v: unknown): string {
  return v === null || v === undefined ? '' : String(v);
}
