// The problems inside a merged ticket. causes.ts says which code path a report went through; the
// desk's own reading (desk-notes.json) says when a report describes a different symptom.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift';

// What each problem is, in one line. Counts are never typed here.
export const PROBLEMS: Record<Problem, string> = {
  parser: 'The shared parser reads day-first dates month first: day and month swap.',
  hint: 'booking-v3 prints MM/DD/YYYY under its date field, so people type month first and the form reads it day first.',
  shift: 'The date moves by one day, not a swap. It looks like a time-zone conversion, not the parser.',
};

// The desk counts a report under its cause, even one it read as a one-day move (desk-notes.json):
// those stay in their cause's count and are footnoted as `shift`.
export function problemOf(r: Report, t: Tenant | undefined): Problem | 'unplaced' {
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemRow = { problem: Problem | 'unplaced'; reports: number; shifted: number; tenants: number; firstSeen: string; lastSeen: string };

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: number; rows: ProblemRow[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const by = new Map<ProblemRow['problem'], Report[]>();
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r));
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const rows = [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return { problem, reports: rs.length, shifted: rs.filter((r) => oneDayMove.includes(r.id)).length, tenants: new Set(rs.map((r) => r.tenant)).size, firstSeen: days[0], lastSeen: days[days.length - 1] };
    })
    .sort((a, b) => b.reports - a.reports);
  return { merged: merged.length, rows };
}
