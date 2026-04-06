import type { HireboundCareerOpening } from '@/lib/hirebound-careers'

const KV_KEY = 'careers:delta'

export type CareersDelta = {
  /** Hide these opening ids from the Hirebound/JSON feed */
  hiddenIds: string[]
  /** Extra roles shown on /careers (manual entries) */
  manualRoles: HireboundCareerOpening[]
}

const empty = (): CareersDelta => ({ hiddenIds: [], manualRoles: [] })

export async function loadCareersDelta(): Promise<CareersDelta> {
  try {
    const { kv } = await import('@vercel/kv')
    const raw = await kv.get<string>(KV_KEY)
    if (!raw || typeof raw !== 'string') return empty()
    const parsed = JSON.parse(raw) as Partial<CareersDelta>
    return {
      hiddenIds: Array.isArray(parsed.hiddenIds) ? parsed.hiddenIds : [],
      manualRoles: Array.isArray(parsed.manualRoles) ? parsed.manualRoles : [],
    }
  } catch {
    return empty()
  }
}

export async function saveCareersDelta(delta: CareersDelta): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(KV_KEY, JSON.stringify(delta))
}

export function mergeCareerOpenings(
  base: HireboundCareerOpening[],
  delta: CareersDelta,
): HireboundCareerOpening[] {
  const hidden = new Set(delta.hiddenIds)
  const byId = new Map<string, HireboundCareerOpening>()
  for (const o of base) {
    if (!hidden.has(o.id)) byId.set(o.id, o)
  }
  for (const m of delta.manualRoles) {
    byId.set(m.id, m)
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
  )
}

export async function hideCareerOpeningId(id: string): Promise<void> {
  if (!id.trim()) throw new Error('Missing id')
  const delta = await loadCareersDelta()
  if (!delta.hiddenIds.includes(id)) delta.hiddenIds.push(id)
  await saveCareersDelta(delta)
}

export async function unhideCareerOpeningId(id: string): Promise<void> {
  const delta = await loadCareersDelta()
  delta.hiddenIds = delta.hiddenIds.filter((x) => x !== id)
  await saveCareersDelta(delta)
}

export async function upsertManualCareerRole(role: HireboundCareerOpening): Promise<void> {
  if (!role.id.trim()) throw new Error('Role id required')
  const delta = await loadCareersDelta()
  delta.manualRoles = delta.manualRoles.filter((r) => r.id !== role.id)
  delta.manualRoles.push(role)
  await saveCareersDelta(delta)
}

export async function removeManualCareerRole(id: string): Promise<void> {
  const delta = await loadCareersDelta()
  delta.manualRoles = delta.manualRoles.filter((r) => r.id !== id)
  await saveCareersDelta(delta)
}
