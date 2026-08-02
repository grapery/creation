/** Signed share-link grant from URL query (?t=&exp=). */

export type ShareGrant = {
  token: string
  exp: string
}

/** Read share grant from Next.js searchParams / URLSearchParams. */
export function parseShareGrant(
  searchParams: { get: (key: string) => string | null } | null | undefined
): ShareGrant | undefined {
  if (!searchParams) return undefined
  const token = searchParams.get("t")?.trim()
  const exp = searchParams.get("exp")?.trim()
  if (!token || !exp) return undefined
  return { token, exp }
}

/** Append ?t=&exp= (or &…) to an API path when a grant is present. */
export function withShareGrant(path: string, shareGrant?: ShareGrant): string {
  if (!shareGrant?.token || !shareGrant?.exp) return path
  const q = new URLSearchParams({ t: shareGrant.token, exp: shareGrant.exp })
  return `${path}${path.includes("?") ? "&" : "?"}${q.toString()}`
}
