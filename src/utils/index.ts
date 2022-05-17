export async function sleep(timeout = 500): Promise<void> {
  await new Promise((r) => setTimeout(r, timeout));
}

export function many<T = any>(item: T): T extends any[] ? T : T[] {
  if (!Array.isArray(item)) return [item] as any;
  return item as any;
}
