# Critic Audit - V2 Round 050

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `audits/critic-round-100.md`
- legacy family references: `designs/design-001`, `designs/design-003`, and `designs/design-007`
- `v2/data/designs.json`
- completed V2 folders under `v2/designs/`: 50 folders, `v2-design-001` through `v2-design-050`
- existing V2 audits: `v2/audits/critic-round-010.md`, `critic-round-022.md`, `critic-round-035.md`, and `critic-round-046.md`

No design files were edited. This is a source audit of manifests, HTML, CSS, and JavaScript. I did not run rendered desktop/mobile screenshots, so mobile findings are layout-risk calls, not visual proof.

## Overall Verdict

The V2 set goes meaningfully deeper than the original Playground Console, Playground Command Deck, and Playground Operations Console family. The legacy designs established the right product posture: keep the live WordPress shell visible while exposing launch, save, saved management, Site Manager, Blueprint, GitHub, ZIP, database, and log actions. V2 improves that by treating the active Playground as a mutable object whose storage identity, launch route, path, saved row, transfer state, reset/reload mode, file state, database state, logs, and preview can change together.

The current Playground feature surface is broadly preserved. Across the 50 completed V2 designs, the required capabilities appear: Save in browser, save to local directory, saved management, destructive delete/reset/reload, Blueprint gallery and URL run, file editor, database/logs, GitHub import/export, ZIP import/download, settings, WP Admin/Homepage/path/refresh, and launch routes for Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub, Blueprint URL, and ZIP.

The quality issue is now repetition and proof of consequence. Many V2 entries can name every current action, but the best entries show what happens after the action: the exact temporary row becomes saved, local permission changes available behavior, ZIP import replaces files and database, Blueprint run mutates preview/content, delete produces a fallback, and settings switch between destructive reset and Save & Reload based on storage state. Future work should stop producing another broad console clone unless it completes a current Playground flow more rigorously than the benchmarks below.

Registry hygiene is clean. `v2/data/designs.json` matches the 50 completed folders on disk.

## Feature Preservation

Strong preservation:
- The live shell is usually protected: path input, refresh, Save, WP Admin, Homepage, storage badge, and active identity remain visible in most V2 designs.
- Save and local-directory flows are substantially better than V1. The strongest entries model browser slugs, file-copy progress, folder permission, selected folder identity, reconnect after refresh, and stored Save & Reload behavior.
- Saved management generally includes saved and unsaved rows, open/manage, rename, delete confirmation, cancel, final deleted state, and active fallback.
- Site Manager coverage is consistent: Settings, Files, Blueprint, Database, Logs, Export to GitHub, and Download as ZIP are retained.
- Database fidelity remains high: MySQL emulation backed by SQLite, `/wordpress/wp-content/database/.ht.sqlite`, size, `database.sqlite`, Adminer, and phpMyAdmin appear throughout.
- Blueprint gallery coverage is mostly honest. The stronger entries label representative subsets such as "6 shown of 43" or "9 shown of 43" instead of pretending to render the full gallery.

Weak preservation by consequence:
- GitHub import/export remains uneven. `v2-design-030`, `038`, `042`, `046`, and `050` show stronger connection, repository/target, progress, token caveat, and result states. Weaker designs still stop at "Connect GitHub" copy.
- ZIP import/download is better but still a frequent shallow spot. The bar is chooser/source, validation, replacement warning, cancel, progress, files/database consequence, result, and active identity. `v2-design-038`, `042`, `046`, `048`, and `050` are current references.
- File editor flows still regress in generic clones. A credible file flow needs selected file metadata, dirty marker, save/apply result, log/history update, and visible outcomes for New File, New Folder, Upload, and Browse files.
- Logs remain too passive outside diagnostics concepts. Operations and support designs need realistic warning/error states plus a recovery or investigation path.
- PR/GitHub/Blueprint launch routes often validate inputs but do not always update active title, path, storage state, saved-object row, and save/export availability.
- Adminer/phpMyAdmin and database download are often represented as result text. At this fidelity level, launch/download feedback is required; blocked-popup or unavailable states would make the flow more credible.

## Family Assessment

### Preview-Protecting Console / Command Deck

`v2-design-001` remains the clean baseline. It is the clearest direct successor to the original Playground Console and Command Deck because the WordPress preview stays large while Save, launch routes, saved objects, Site Manager, Blueprint, and transfers run beside it.

`v2-design-020`, `040`, and `050` are the best command-search continuations. They make search open executable command forms with validation, confirmation, progress, and results. `v2-design-050` is the strongest late command-table cockpit because ZIP download, GitHub export, local save, ZIP import, Blueprint run, settings reset/reload, database download, file save, and row mutation all feed visible state.

Retire command grids that only restate the inventory. Search is useful only when it drives a route, mutation, confirmation, or result.

### Playground Operations Console

`v2-design-002` remains the operations-rail benchmark. It has the best early combination of labeled modes, preview protection, local-folder lifecycle, saved list mutation, database actions, logs, and transfer history.

`v2-design-042`, `046`, `048`, and `050` are the strongest late operations/table variants. They make temporary, saving, saved, local, imported, exported, deleted, and reset states visible in rows and selected detail. `v2-design-048` is useful for runtime settings plus file/database operations; `v2-design-046` remains the strongest file/data/GitHub/ZIP workbench; `v2-design-050` is the best command execution cockpit.

The table direction is powerful but risky. Tables clarify object state, but they can make Playground feel like a site inventory manager before it feels like a live browser-hosted WordPress site. Use tables for saved objects, transfer history, and selected detail; do not let them demote the running WordPress shell.

### Blueprint, ZIP, and Transfer

`v2-design-014` remains the Blueprint mechanics benchmark: inspect, validate, warn, run, progress, result. `v2-design-044` is the best late Blueprint registry continuation because it ties search, selected detail, URL, JSON editor, validation, copy/download/run, local save, database/file outcomes, and replacement warnings to the active object.

`v2-design-038` remains the runtime plus ZIP import/download reference. `v2-design-050` now joins the benchmark set for ZIP download and GitHub export because it records generated archive, repository, branch, commit/result, and transfer row while keeping the preview active.

Blueprint-first or transfer-first designs should remain task modes. They should not become the default shell if the catalog or transfer ledger pushes the live site below the first-priority surface.

### Route Contracts and Diagnostics

`v2-design-037` and `047` are the best PR/Gutenberg/GitHub/Blueprint launch-contract references. They treat Vanilla, WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, and ZIP import as distinct routes with inputs, constraints, progress, and resulting active identity.

`v2-design-039` is still the strongest diagnostics mode because it starts from realistic warnings instead of all-green logs. `v2-design-049` is a solid support-console continuation: it models Gutenberg/WordPress/GitHub/Blueprint/ZIP launch, browser/local save, delete fallback, file dirty/save, database tools, logs, ZIP replacement, and GitHub export. Its weakness is that diagnostics/table structure can overpower the browser shell on smaller screens.

Diagnostics should stay a mode, not the universal product IA.

## Late Round Notes

`v2-design-048` is a strong runtime table control room. It preserves the live shell, command search, settings reset/reload, browser save, local save, file dirty/save, database download, Blueprint run, ZIP import, GitHub export, and delete fallback. Its desktop IA is dense: table, rail, detail, manager, gallery, and preview all compete. Use it for runtime consequence modeling, not as a default layout without simplification.

`v2-design-049` is useful for support diagnostics and PR/branch lifecycle. It has realistic PHP notice language, route validation, save row insertion, local permission copy, delete confirmation/fallback, database tool results, and ZIP replacement. It is weaker than `039` as a diagnostics benchmark and weaker than `050` as a command cockpit, but it is a good support-mode reference.

`v2-design-050` is the strongest new addition. It combines command search, saved/transfer tables, selected execution detail, Site Manager tabs, Blueprint gallery, and a protected preview while making actions complete: ZIP download generates a transfer row, GitHub export records repo/branch/commit, local save grants folder permission and changes storage identity, ZIP import confirms replacement and changes preview/state, delete confirms and finalizes a row, settings reset/reload branches on storage, and path/WP Admin/Homepage remain live.

## Mobile Risk

Responsive CSS exists across all completed designs, but no dense V2 concept should be promoted without rendered phone-width proof.

Highest-risk layouts:
- `v2-design-041` through `050`: admin tables, selected detail panels, sticky panes, manager docks, command lists, and preview frames compete for narrow width.
- `v2-design-048` and `050`: multi-column table/preview/detail structures stack, but the resulting page may become long enough that the active shell and confirmation controls are far apart.
- `v2-design-049`: diagnostics tables plus preview plus manager tabs risk making the live shell feel secondary on mobile.

Mobile proof must verify that path input, Save state, storage identity, WP Admin/Homepage, destructive confirmations, file editors, Blueprint JSON, and the live preview fit without horizontal overflow or hidden action buttons.

## Benchmarks To Carry Forward

- `v2-design-001`: preview-protecting command deck baseline.
- `v2-design-002`: operations rail depth and local-directory lifecycle.
- `v2-design-014`: Blueprint inspect/validate/replace/progress/result mechanics.
- `v2-design-028`: runtime settings and local-directory save consequences.
- `v2-design-030`: ZIP/GitHub command-search transfer completion.
- `v2-design-037`: PR/Gutenberg/GitHub/Blueprint launch contracts.
- `v2-design-038`: runtime settings plus ZIP import/download.
- `v2-design-039`: diagnostics mode with realistic warnings.
- `v2-design-042`: late admin-table object and transfer mutation model.
- `v2-design-044`: Blueprint registry plus local save lifecycle.
- `v2-design-046`: file/data/GitHub/ZIP operations workbench.
- `v2-design-048`: runtime table consequences and file/database completion.
- `v2-design-050`: best late command-table cockpit and transfer execution model.

Use selectively:
- `v2-design-049` for support diagnostics and PR/branch support flow.
- `v2-design-047` for review-contract ledger structure.
- `v2-design-033` and `043` for saved-object row mutation patterns.

## Patterns To Retire

- More generic browser-plus-right-deck clones with no newly completed lifecycle.
- Tables or ledgers that record intent without mutating shell identity, saved rows, preview, files, database, logs, or settings mode.
- Command/search grids that only filter feature inventory.
- Static GitHub, ZIP, database, file, and Blueprint panels.
- Destructive warnings without cancel, confirm, progress where relevant, final state, and active fallback.
- Local-directory badges without folder picker, permission outcome, folder identity, and reconnect behavior.
- ZIP import flows that stop at native chooser copy.
- Full `43 Blueprints` claims without real data or honest subset labeling.
- Diagnostics modes with only healthy logs.
- Mobile claims based only on breakpoints and overflow rules.

## Next Worker Bar

Do not add product requirements. Pick one current Playground capability and finish it deeply while keeping the live WordPress shell visible and protected:

1. Browser/local save that transforms the exact active object and updates shell title, slug/folder, saved row, reset/reload mode, and history.
2. ZIP import/download with chooser, validation, replacement warning, cancel, progress, database/file consequence, result, and active identity.
3. GitHub import/export with account connection, token caveat, repository/source choice, progress, failure/success, and active-object result.
4. Blueprint gallery or URL run with JSON validation, replacement warning, progress, preview/database/file consequence, and save/export implications.
5. File editor lifecycle with selected file, dirty marker, save/apply, upload/browse/new item outcomes, log mutation, and error handling.

The strongest V2 insight remains simple: WordPress stays large, live, and protected while Playground operations complete around it. Designs that hide the shell behind catalogs, ledgers, tables, or static control panels are below the benchmark even when they preserve every checkbox.
