interface Entry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 5000;
const MAX_KEY_LENGTH = 160;

function normalizeRateLimitKey(key: string) {
  return key.replace(/[\u0000-\u001f\u007f\s]/g, "_").slice(0, MAX_KEY_LENGTH);
}

function pruneExpiredBuckets(now: number) {
  if (buckets.size < MAX_BUCKETS) return;

  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }

  if (buckets.size < MAX_BUCKETS) return;

  const overflow = buckets.size - MAX_BUCKETS + 1;
  let removed = 0;
  for (const key of buckets.keys()) {
    buckets.delete(key);
    removed += 1;
    if (removed >= overflow) break;
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const safeKey = normalizeRateLimitKey(key);
  pruneExpiredBuckets(now);

  if (limit <= 0 || windowMs <= 0) {
    return { ok: false, remaining: 0 };
  }

  const existing = buckets.get(safeKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(safeKey, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count };
}
