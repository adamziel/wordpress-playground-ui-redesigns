# Critic Audit - V2 Round 046

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `audits/critic-round-100.md`
- legacy family references: `designs/design-001`, `designs/design-003`, and `designs/design-007`
- `v2/data/designs.json`
- completed V2 folders under `v2/designs/`: 46 folders, `v2-design-001` through `044`, plus `046` and `047`
- existing V2 audits: `v2/audits/critic-round-010.md`, `critic-round-022.md`, and `critic-round-035.md`

No design files were edited. This is a source audit of manifests, HTML, CSS, and JavaScript. I did not run rendered desktop/mobile screenshots, so mobile findings are source and layout-risk calls only.

## Overall Verdict

The completed V2 designs are deeper than the original Playground Console, Playground Command Deck, and Playground Operations Console family. The legacy family established the right shell direction: keep the WordPress preview visible while exposing launch, save, Site Manager, Blueprint, and export controls. V2 improves that by treating the Playground as a mutable object with storage identity, route identity, path, saved row, transfer state, reset/reload mode, file state, database state, logs, and preview state.

The current feature surface is broadly preserved. Across the V2 set, the required capabilities appear: browser save, local-directory save, saved management, destructive delete/reset/reload, Blueprint gallery and URL run, file editor, database/logs, GitHub import/export, ZIP import/download, settings, WP Admin/Homepage/path/refresh, and launch routes for Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub, Blueprint URL, and ZIP.

The bar now has to move from coverage to consequence. Most designs can name every current Playground action. The better designs show what happens after the action: save transforms the temporary object, local save records folder permission and reconnect risk, ZIP import replaces files/database and changes the active identity, Blueprint run mutates preview/path/database, delete removes or finalizes a row and falls back, settings switch between destructive reset and Save & Reload based on storage state.

Registry hygiene is clean for this round. `v2/data/designs.json` matches the 46 completed folders on disk. There is no `v2-design-045` in either place.

## Feature Preservation

Strong preservation:
- The live shell is usually protected: path input, refresh, Save, WP Admin, Homepage, storage badge, and active identity remain visible in most V2 designs.
- Save/local-directory modeling is much stronger than V1. `v2-design-002`, `028`, `038`, `041`, `042`, `044`, `046`, and `047` explicitly cover browser slug, local folder permission, progress, and reconnect consequences.
- Saved management now usually includes rename, delete confirmation, cancel, row mutation/removal, and active fallback.
- Site Manager coverage is consistent: Settings, Files, Blueprint, Database, Logs, Export to GitHub, and Download as ZIP are retained.
- Database fidelity remains good: MySQL emulation backed by SQLite, `/wordpress/wp-content/database/.ht.sqlite`, size, `database.sqlite`, Adminer, and phpMyAdmin are carried forward.
- Blueprint gallery claims are mostly honest: representative subsets are labeled rather than pretending to render all 43 cards.

Weak preservation by consequence:
- GitHub import/export still varies. `v2-design-030`, `038`, `042`, and `046` are stronger because they show connection, repository/target, progress, and result. Weaker entries still stop at token caveat copy.
- ZIP import is improved but uneven. The minimum bar is chooser/source, validation, replacement warning, cancel, progress, files/database consequence, and final active identity. `v2-design-038`, `042`, and `046` are current references.
- File editor flows still regress in some clones. A credible file flow needs selected file metadata, dirty marker, save/apply result, log/history update, and visible outcomes for new file, new folder, upload, and browse.
- Logs remain too passive outside diagnostics concepts. Designs that claim operations or support value need realistic notice/warning/error states and a recovery path.
- Adminer/phpMyAdmin and database download are often represented as buttons plus status text. At this fidelity level, at least launch/download result or blocked-launch handling should be shown.
- PR/GitHub/Blueprint launch routes sometimes complete only as preview copy. They should update active title, path, storage state, saved-object row, and save/export availability.

## Family Assessment

### Preview-Protecting Command Deck

`v2-design-001` remains the clean baseline. It is still the clearest successor to the original Playground Console/Command Deck: the live WordPress shell stays large, while Save, launch routes, saved objects, Site Manager, Blueprint, and transfer actions run beside it.

`v2-design-020` and `040` are the best command-search continuation because search opens executable forms instead of acting as passive discovery. Carry forward that behavior; retire command search that only filters a feature inventory.

`v2-design-037` and `047` are the best route-contract direction. They make Vanilla, WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, and ZIP import feel like distinct launch contracts with inputs, constraints, progress, and active identity consequences. Use them for PR/GitHub/Blueprint launch route modeling.

### Operations Console and Object Model

`v2-design-002` remains the operations-rail benchmark. It has the best early combination of labeled modes, preview protection, local-folder lifecycle, saved list mutation, database actions, logs, and transfer history.

`v2-design-003`, `011`, `023`, `033`, `041`, `042`, and `043` are the saved-object family. The strongest of these treat temporary, browser-saved, local-directory, imported, exported, saving, and deleted states as different objects with different allowed actions. `v2-design-042` is the strongest late table version because it combines row transformations, command search, ZIP validation failure/success, local permission grant/denial, GitHub export completion, and log/error states.

The table direction is useful but risky. Tables clarify object state, but they can make Playground feel like an inventory manager before it feels like a live browser-hosted WordPress site. Use tables for saved objects and transfer history; do not let tables demote the preview.

### Blueprint, ZIP, and Transfer Workflows

`v2-design-014` remains the Blueprint mechanics benchmark. `v2-design-044` is the strongest late Blueprint/table continuation: gallery search, selected detail, URL, JSON editor, validation, copy/download/run, replace-current confirmation, local save lifecycle, and database/file outcomes all stay tied to the active object.

`v2-design-038` is the best runtime/ZIP control room. It handles settings reset versus Save & Reload, ZIP source/warning/progress/result, ZIP download, save destinations, and imported identity without hiding the shell.

`v2-design-046` is the strongest late file/data/transfer workbench. It is especially useful for ZIP import, GitHub export, ZIP/database download, dirty file save, logs, and transfer rows. Its weakness is IA risk: the Site Manager and table apparatus can overpower the preview if carried forward too literally.

### Diagnostics and Data

`v2-design-026`, `036`, `039`, and `046` are the file/data references. `039` is the best diagnostics mode because it starts with realistic support signals instead of all-green logs. Keep diagnostics as a mode, not the default product shell.

The right data bar is: files can become dirty and save, database downloads produce results, Adminer/phpMyAdmin acknowledge launch, logs show at least one realistic warning or notice, and all of those outcomes write back to the active object or history.

## Mobile Risk

Responsive CSS exists across the late V2 set, and `037` through `040` include bottom/mobile navigation ideas. Still, no dense V2 design should be promoted without rendered phone-width proof.

Highest-risk layouts:
- `v2-design-041`, `042`, `043`, `044`, `046`, and `047`: admin tables, sticky panes, selected-detail panels, and live previews compete for width.
- `v2-design-046`: three dense workbench columns plus sticky preview/detail are high risk on mobile.
- `v2-design-047`: launch/object/transfer tables need proof that rows, actions, confirmations, and preview remain usable after stacking.

Mobile proof must verify that path input, Save state, storage identity, WP Admin/Homepage, destructive confirmations, file editors, Blueprint JSON, and the live preview fit without horizontal overflow or hidden action buttons.

## Invented or Over-Weighted Patterns

Acceptable as prototype scaffolding, not product requirements:
- transfer history
- event ledger
- command cockpit
- object registry table
- support snapshot
- deleted-row final-state history
- run-state ribbons and operational receipts

These can help a prototype explain state, but future workers must not treat them as new Playground requirements. The current product requirements are the captured Playground capabilities in `PLAYGROUND_UI_MAP.md`.

## Benchmarks To Carry Forward

- `v2-design-001`: preview-protecting command deck baseline.
- `v2-design-002`: deepest operations rail and local-directory lifecycle.
- `v2-design-014`: Blueprint inspect/validate/replace/progress/result mechanics.
- `v2-design-028`: runtime settings and local-directory save consequences.
- `v2-design-030`: ZIP/GitHub command-search transfer completion.
- `v2-design-037`: PR/Gutenberg/GitHub/Blueprint launch contract modeling.
- `v2-design-038`: runtime plus ZIP import/download and settings reset/reload.
- `v2-design-039`: diagnostics mode with realistic warnings.
- `v2-design-042`: strongest late admin-table object and transfer mutation model.
- `v2-design-044`: strongest late Blueprint registry and local save lifecycle.
- `v2-design-046`: strongest late file/data/GitHub/ZIP operations workbench.
- `v2-design-047`: review-contract ledger, useful for launch-route structure.

## Patterns To Retire

- More generic browser-plus-right-deck clones with no newly completed workflow.
- Tables or ledgers that record intent without mutating shell identity, saved rows, preview, files, database, logs, or settings mode.
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

The strongest V2 insight is still simple: WordPress stays large, live, and protected while Playground operations complete around it. Designs that hide the shell behind catalogs, ledgers, tables, or static control panels are below the benchmark even when they preserve every checkbox.
