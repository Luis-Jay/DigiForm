export function truncateString(str: string, maxLength: number): string {
  return str.length <= maxLength ? str : str.slice(0, maxLength - 3) + '...'
}

export function preventSpace(value: string): string {
  return value.replace(/\s+/g, '')
}