export function hasMiddleInitial(mi: string | null | undefined): boolean {
  return !!(mi && mi.trim() !== '');
}
