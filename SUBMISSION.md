# S01E03 · what it shows

Support ticket #4471 merged 412 reports about dates as one issue. It holds three problems:

| Problem | Reports | Ticket |
|:--|--:|:--|
| `parser`: the shared parser reads day-first dates month first | 374 | #1 |
| `hint`: booking-v3 prints MM/DD/YYYY under its date field | 33 | #2 |
| `shift`: dates move by one day (time zones) | 5 | #3 |

- The page: `src/routes/kb/incidents/4471-split/+page.svx`, signed `poponuts`.
- Its logic: `src/lib/kb/problems.ts`, `src/lib/kb/ProblemTable.svelte`.
- The page as the desk sees it: `rendered/kb/incidents/4471-split.html` (desk ref DR-FW5Y-YYCN).
