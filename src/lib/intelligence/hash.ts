import { createHash } from 'node:crypto'

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stable(item)])
    )
  }
  return value
}

export function hashPayload(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(stable(payload))).digest('hex')
}
