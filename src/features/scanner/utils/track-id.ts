export function trackId(pathSegments: string[], fileName: string): string {
  return [...pathSegments, fileName].join('/')
}
