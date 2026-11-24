/**
 * The page buttons to show, 1-based, with 0 for a gap ("…"). Always the first and
 * last page and one on each side of the current page; a gap of one page shows that
 * page instead, since a "…" would take the same room.
 *
 * pageSlots(5, 10) -> [1, 0, 4, 5, 6, 0, 10]
 */
export function pageSlots(page: number, count: number): number[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const shown = new Set([1, count, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => shown.add(p));
  if (page >= count - 2)
    [count - 3, count - 2, count - 1].forEach((p) => shown.add(p));
  const pages = [...shown]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);

  const slots: number[] = [];
  for (const p of pages) {
    const previous = slots[slots.length - 1];
    if (previous !== undefined && p - previous === 2) slots.push(p - 1);
    else if (previous !== undefined && p - previous > 2) slots.push(0);
    slots.push(p);
  }
  return slots;
}
