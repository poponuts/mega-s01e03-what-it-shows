<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, splitTicket } from '#lib/kb/problems';

  // issues: problem → link to its own ticket.
  let { ticket, issues = {} }: { ticket: number; issues?: Record<string, string> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
</script>

<p class="sum">
  <strong>{split.merged}</strong> reports merged into #{ticket} ·
  <strong>{split.rows.length}</strong>
  {split.rows.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.rows as row (row.problem)}
      <tr>
        <td><code>{row.problem}</code><br /><span class="what">{row.problem === 'unplaced' ? 'No tenant on file.' : PROBLEMS[row.problem]}</span></td>
        <td>{row.reports}</td>
        <td>{row.tenants}</td>
        <td>{row.firstSeen} → {row.lastSeen}</td>
        <td>{#if issues[row.problem]}<a href={issues[row.problem]}>own ticket</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.rows as row (row.problem)}
  {#if row.shifted}
    <p class="note">{row.shifted} of the <code>{row.problem}</code> reports read as a one-day move (<code>shift</code>): {PROBLEMS.shift}{#if issues.shift} <a href={issues.shift}>Their ticket</a> is closed as a duplicate of the <code>{row.problem}</code> ticket.{/if}</p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .what, .note { color: var(--muted); font-size: 0.85em; }
</style>
