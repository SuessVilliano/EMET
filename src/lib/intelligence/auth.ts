import { timingSafeEqual } from 'node:crypto'

export function isBearerAuthorized(request: Request, secret: string | undefined): boolean {
  if (!secret) return false

  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return false

  const provided = authorization.slice(7)
  const expectedBuffer = Buffer.from(secret)
  const providedBuffer = Buffer.from(provided)

  if (expectedBuffer.length !== providedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, providedBuffer)
}
