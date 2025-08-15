// src/shared/utils/stripUndefined.ts
const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  if (Object.prototype.toString.call(val) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(val);
  return proto === Object.prototype || proto === null;
};

export function stripUndefinedDeep<T>(
  input: T,
  seen = new WeakSet<object>(),
): T {
  if (input === null || typeof input !== 'object') return input as T;

  // arrays: clean elements, drop undefineds
  if (Array.isArray(input)) {
    const arr = (input as unknown as unknown[])
      .map((v) => stripUndefinedDeep(v as any, seen))
      .filter((v) => v !== undefined);
    return arr as unknown as T;
  }

  const obj = input as unknown as object;

  // cycle guard
  if (seen.has(obj)) return input;
  seen.add(obj);

  // only descend into POJOs; leave Dates, Maps, Sets, Buffers, class instances, FieldValue, etc. untouched
  if (!isPlainObject(input)) return input;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (v === undefined) continue;
    const cleaned = stripUndefinedDeep(v as any, seen);
    if (cleaned !== undefined) out[k] = cleaned;
  }
  return out as unknown as T;
}
