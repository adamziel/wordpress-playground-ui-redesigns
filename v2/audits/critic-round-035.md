# Critic Audit - V2 Round 035

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `audits/critic-round-100.md`
- legacy family references: `designs/design-001`, `designs/design-003`, and `designs/design-007`
- `v2/data/designs.json`
- completed V2 folders under `v2/designs/`: `v2-design-001` through `030`, plus `032` through `036`
- existing V2 audits: `v2/audits/critic-round-010.md` and `v2/audits/critic-round-022.md`

No design files were edited. This is a source audit of manifests, HTML, CSS, and JavaScript. I did not run rendered desktop/mobile screenshots, so mobile findings are based on source and layout risk rather than fresh visual captures.

## Overall Verdict

The completed V2 designs do go deeper than the original Playground Console, Playground Command Deck, and Playground Operations Console family. The original family preserved the current Playground controls, but largely as a static command surface. The better V2 work now treats a Playground as a mutable object whose storage identity, launch route, URL/path, saved row, reset/reload mode, transfer state, file/editor state, database state, logs, and live preview can change together.

The set also preserves the captured current feature surface well. Across the completed designs, the core capabilities are represented: Save in browser, save to local directory, saved Playground management, destructive delete/reset/reload, Blueprint gallery and URL run, file editor, database/logs, GitHub import/export, ZIP import/download, database download, settings, WP Admin/Homepage/path/refresh, and launch routes for Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub, Blueprint URL, and ZIP.

The quality problem is no longer missing checkboxes. It is repetition and incomplete consequences. Many V2 designs now share the same recipe: protected browser, right deck, tabs, command search, event ledger, saved object rows, and transfer cards. That is a strong base, but it is not progress unless the design finishes a flow end to end. Future work should retire broad clones and deepen specific current Playground workflows.

Registry hygiene is clean this round. `v2/data/designs.json` and the on-disk completed folders both contain 35 entries and match exactly. `v2-design-031` is absent from both, so there is no current registry mismatch.

## Feature Preservation

Strong preservation:
- The live shell is usually first-class: path, refresh, Save, WP Admin, Homepage, storage badge, and active identity remain visible in most designs.
- Save flows now often mutate dependent surfaces: shell title, storage badge, slug/path, saved row, reset/reload copy, and history.
- Local-directory save is much stronger than V1. `v2-design-002`, `026`, `028`, `030`, `033`, `035`, and `036` model folder permission, selected folder identity, reconnect consequences, and local-specific storage state.
- Saved management is no longer just a list. The best entries support rename, cancelable delete, row removal, and fallback to an unsaved Playground.
- Site Manager breadth is preserved: Settings, Files, Blueprint, Database, Logs, GitHub export, and ZIP download appear consistently.
- Database fidelity remains good: MySQL emulation backed by SQLite, `/wordpress/wp-content/database/.ht.sqlite`, size, `database.sqlite`, Adminer, and phpMyAdmin are carried forward.
- Blueprint coverage is generally honest. Most designs label representative subsets instead of pretending to render all 43 Blueprint cards.

Weak preservation by consequence:
- GitHub import/export still lags. Designs mention connection and token caveats, but fewer model account state, repository choice, progress, failure, and the final imported/exported active identity. `v2-design-030` is the current best reference.
- ZIP import is improved but uneven. The high bar is chooser/source, validation failure, replacement warning, cancel, progress, preview/path/database mutation, and final temporary-or-saved identity. `v2-design-026`, `030`, and `036` are strongest.
- File editor flows are better, but many designs still stop at dirty/save text. A credible file flow must show selected file metadata, dirty marker, save/apply, result, log/event, and upload/browse/new-file/new-folder outcomes.
- Logs are still too often passive. Diagnostics concepts need realistic warning/error states and recovery/result paths, not only "no problems so far."
- Settings reset/reload is present almost everywhere, but weaker designs show both reset and Save & Reload buttons without making storage state determine which action is primary.
- PR/Gutenberg/GitHub/Blueprint launch routes often have correct forms but shallow completion. The route should produce a new active identity, path, save/export availability, and saved-object or temporary-state consequence.

## Family Assessment

### Preview-Protecting Console / Command Deck

Use `v2-design-001` as the clean preview-protecting baseline. It is still the clearest direct successor to the legacy console: the live WordPress shell stays large, while save, launch, saved management, Site Manager, Blueprint, and transfer work happens beside it.

Use `v2-design-020` and `v2-design-030` for command search. They are stronger than command search as decoration because search opens executable forms and records real outcomes. `v2-design-030` is especially useful for ZIP import/download and GitHub export completion.

Retire command grids that only restate the same inventory. `v2-design-021`, `022`, `024`, `027`, and `032` contain useful details, but they mostly repeat stronger prior concepts unless a future worker deepens one flow.

### Operations Console / Object Model

`v2-design-002` remains the operations-rail benchmark. It has the best combination of labeled modes, preview protection, local-folder lifecycle, saved list mutation, database actions, logs, and transfer history.

`v2-design-003`, `011`, `023`, and `033` are the best saved-object references. They correctly treat temporary, browser-saved, local-directory, preview, imported, and Blueprint-result Playgrounds as different states with different consequences. `v2-design-033` is the best newer saved-object entry because it models stored Save & Reload, unsaved reset, destructive delete, row removal, and fallback together.

Use object ledgers only when they mutate objects. Event streams that record intent without changing the shell, saved row, preview, file, database, or settings mode should be retired.

### Blueprint / Replacement Workflows

`v2-design-014` remains the best Blueprint mechanics benchmark. `v2-design-034` is the useful responsive Blueprint continuation, especially for bottom-nav/mobile-tab thinking, but it should not replace `014` unless the run lifecycle is fully retained.

The right Blueprint bar is: gallery or URL selection, honest 43-entry/subset labeling, JSON inspection, validation failure, replace-current warning, cancel, run progress, preview/path/database/file consequence, and save/export implication. Static Blueprint cards with "Run" copy are below the V2 bar.

### File, Data, and Diagnostics

`v2-design-026` is the strongest late file/data workbench. It models command search into file save, ZIP import validation, browser/local save, delete fallback, Blueprint run, database download, Adminer/phpMyAdmin, logs, and transfer history while preserving the shell.

`v2-design-036` is the best responsive data-workbench continuation: local save, dirty file save, database download/Adminer/phpMyAdmin, Blueprint run, ZIP replacement, delete fallback, and bottom mobile navigation are all represented. It still needs rendered mobile proof before promotion.

`v2-design-029` is the best diagnostics/delete reference. It models typed/cancelable destructive delete, fallback to an unsaved Playground, realistic PHP notice state, and PR/branch preview completion. Keep it as a diagnostics mode, not the universal default shell.

### Runtime and Transfer

`v2-design-028` is the strongest runtime/local-directory benchmark. It makes settings reset versus Save & Reload, local folder grant/denial, selected folder identity, reconnect consequence, database download, file save, and runtime mutations visible.

`v2-design-035` is the strongest transfer-tabs benchmark. It keeps browser save, local save, GitHub import/export, ZIP import/download, database download, and Blueprint bundle actions together without losing the active shell.

Transfer concepts should not invent new product obligations. "Transfer history", "event ledger", "support bundle", "command cockpit", and "object ownership" are acceptable prototype scaffolding, not requirements future workers must preserve.

## Mobile Risk

The newer responsive designs are better than earlier dense consoles because `v2-design-032` through `036` add tabbed layouts and bottom navigation. Still, the risk remains high. These designs depend on sticky topbars, dense command tabs, code panes, saved rows, confirmation panels, Blueprint grids, and live preview panes. Source CSS shows breakpoints, but no dense V2 design should be promoted without rendered checks at phone widths.

Mobile proof must verify:
- current path, Save state, WP Admin/Homepage, and storage identity are visible without horizontal overflow
- destructive confirmations fit and keep Cancel/Confirm reachable
- the live WordPress preview is not reduced to an unusable thumbnail
- file editors and Blueprint JSON panes scroll safely
- bottom navigation does not cover action buttons or status text

## Benchmarks To Carry Forward

- `v2-design-001`: preview-protecting command deck baseline.
- `v2-design-002`: operations rail depth, local-directory lifecycle, saved list, database/logs, and transfer history.
- `v2-design-003` and `v2-design-023`: first-class Playground object model.
- `v2-design-014`: Blueprint inspect/validate/replace/progress/result mechanics.
- `v2-design-020`: command search that opens executable forms.
- `v2-design-026`: strongest late file/data operations workbench.
- `v2-design-028`: best runtime settings and local-directory save lifecycle.
- `v2-design-029`: diagnostics, realistic logs, and destructive delete fallback.
- `v2-design-030`: best ZIP/GitHub command-search transfer completion.
- `v2-design-033`: responsive saved-object control and settings reset/reload consequences.
- `v2-design-035`: transfer-centered tabs.
- `v2-design-036`: responsive data workbench, pending mobile screenshot proof.

Use selectively:
- `v2-design-007` and `017` for PR/Gutenberg route contracts.
- `v2-design-016` for Site Manager-led file/data work from the earlier set.
- `v2-design-034` for responsive Blueprint tab/bottom-nav direction.

## Patterns To Retire

- More generic browser-plus-right-deck clones without a newly completed lifecycle.
- Command/search grids that list every feature but only change status copy.
- Event ledgers that do not correspond to visible object, shell, file, database, or preview mutations.
- Destructive warnings without cancel, confirm, progress where relevant, final state, and active fallback.
- Local-directory badges without folder picker, permission outcome, folder identity, and reconnect behavior.
- ZIP import flows that stop at "native file chooser opened."
- GitHub import/export flows without authentication state, repository/source choice, progress, error, and result.
- Blueprint catalogs that imply full 43-entry coverage without a data-backed list or honest subset label.
- File/database/log panes that are decorative rather than operational.
- Diagnostics modes with only healthy logs.
- Mobile claims based only on CSS breakpoints.

## Next Worker Bar

Do not add new product requirements. Pick one current Playground capability and finish it deeply while keeping the live WordPress shell visible and protected:

1. Browser/local save that transforms the exact active temporary object and updates shell identity, slug/folder, saved row, reset/reload mode, and history.
2. ZIP import/download with chooser, validation, replacement warning, cancel, progress, result, database/file consequence, and final active identity.
3. GitHub import/export with account connection, token caveat, repository/source choice, progress, failure/success, and active-object result.
4. Blueprint gallery or URL run with JSON validation, replacement warning, run progress, preview/database/file consequence, and save/export implications.
5. File editor lifecycle with selected file, dirty marker, save/apply, upload/browse/new item outcomes, log mutation, and error handling.

The best V2 direction is clear: the WordPress site stays large and protected, and operations complete around it. Designs that hide the live shell behind catalogs, ledgers, or static panels are moving away from the strongest family insight.
