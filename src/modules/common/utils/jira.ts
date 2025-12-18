export const normalizeDomain = (value: string) =>
  value.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')