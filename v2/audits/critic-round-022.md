# Critic Audit - V2 Round 022

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `audits/critic-round-100.md`
- legacy family references: `designs/design-001`, `designs/design-003`, and `designs/design-007`
- `v2/data/designs.json`
- completed V2 folders under `v2/designs/`: `v2-design-001` through `009`, `011` through `023`, and the on-disk `v2-design-025`
- existing V2 audit: `v2/audits/critic-round-010.md`

No design files were edited. This is a source audit of manifests, HTML, CSS, and JavaScript. I did not run a fresh screenshot pass, so mobile findings are source/CSS risk calls rather than rendered-device findings.

## Overall Verdict

The best V2 work is meaningfully deeper than the original Playground Console, Playground Command Deck, and Playground Operations Console family. The legacy family preserved the current Playground surface, but mostly as visible controls, modal copies, tabs, and cards. The stronger V2 designs model the active Playground as a mutable object with storage identity, route identity, reset/reload consequence, transfer history, editor state, and destructive outcomes.

The set is now good enough to establish a sharper bar: breadth is no longer the hard part. Most completed V2 designs include Save, local directory, Saved management, Blueprint gallery/run, files, database/logs, GitHub import/export, ZIP import/download, settings reset/reload, and PR/GitHub/Blueprint launch routes. The remaining quality difference is whether those routes finish end to end while keeping the live WordPress shell visible and protected.

The strongest benchmark cluster is `v2-design-001`, `002`, `003`, `011`, `016`, `020`, `023`, and `025`. Use `014` selectively for Blueprint replacement mechanics and `017` for PR/Gutenberg route contracts. The weakest direction is another generic browser-plus-ledger console that lists every current product affordance but only changes status text.

## Registry Hygiene

`v2/data/designs.json` matches most completed folders, but `v2/designs/v2-design-025/` exists on disk and is not registered. Include it or mark it intentionally out of scope. It is not a throwaway: it has one of the better transfer/settings/delete models in the current V2 set.

There is no `v2-design-010` or `v2-design-024` folder in the completed set I inspected.

## Feature Surface Preservation

The completed V2 designs broadly preserve the captured current Playground surface:
- launch routes: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and ZIP import
- save routes: browser storage, local directory, file-copy progress, saved identity, and local permission/reconnect consequence
- saved management: saved and unsaved rows, open/manage, rename, delete warning, confirmation, row removal, and fallback in the stronger entries
- shell controls: active path input, refresh, Homepage, WP Admin, Save, saved/local/temporary badges, and current runtime identity
- settings: WordPress/PHP/language, older versions, network access, multisite, destructive reset for temporary sites, and Save & Reload for stored sites
- Site Manager: Settings, Files, Blueprint, Database, Logs, Export to GitHub, and Download as ZIP
- data/transfer tools: SQLite driver/path/size, `database.sqlite`, Adminer, phpMyAdmin, Blueprint copy/download/run, GitHub import/export, ZIP import/download

The preservation is strongest when a design mutates the same active object after an action. `v2-design-002`, `003`, `011`, `016`, `020`, `023`, and `025` are closest to that bar. They update shell title, storage badge, path, saved row, preview state, transfer/event history, and reset/reload language after at least some flows.

The preservation is weakest where "current capability" is represented as a button plus consequence copy. That is still too common for GitHub export, repository/source selection, ZIP import validation, file upload/browse results, Adminer/phpMyAdmin launch, and Blueprint run confirmation.

## Family Assessment

### Playground Console and Command Deck

`v2-design-001` remains the cleanest direct successor to the original console. It protects the live browser, keeps path/refresh/WP Admin/Homepage visible, and places save, launch, Blueprint, Site Manager, database, logs, and transfer tools in a right deck without burying the site.

`v2-design-020` is the best command-search variant. Its command results lead to route-specific forms, local save permission states, browser save progress, ZIP replacement, file dirty/save, database download, Blueprint tools, and transfer history. This is a useful benchmark because search is not just decoration; it drives executable forms.

`v2-design-021` is a competent dense command grid, but it does not create a new benchmark. It should be mined for readable power-user command tiles only if future workers deepen one specific lifecycle.

### Playground Operations Console

`v2-design-002` is still the operations-rail depth benchmark. It gives Create, Save, Library, Manage, Blueprints, Data, Logs, and Transfer modes enough state to feel like a product rather than a checklist. Its local folder denial/cancel/grant model and database operation lifecycle are especially valuable.

`v2-design-022` revisits the operations rail with a high-contrast dense layout. It is useful for command-search plus database/file actions, but it is largely a clone of the stronger `002`/`020` direction. Keep the labeled rail; retire the idea that a denser rail is itself progress.

`v2-design-025` should be added to the benchmark set for transfer-centered operations. It handles browser/local save, settings Save & Reload, unsaved reset, saved delete with fallback, ZIP import, Blueprint run, file dirty/save, database download, GitHub export, and history as related operations while keeping the preview protected.

### Saved Object and Ledger Concepts

`v2-design-003` and `023` are the strongest saved-object directions. They correctly treat temporary, browser-saved, local-directory, preview, imported, and Blueprint-result Playgrounds as different object states with different allowed actions and consequences.

`v2-design-011` remains the best ledger pattern from the early V2 group because save, PR preview, ZIP import, Blueprint run, rename, delete, and reset/reload visibly affect the same selected object. `v2-design-012` is a solid operations-rail ledger, but it mostly reinforces `011` and `002`.

`v2-design-015`, `018`, and `019` are competent but increasingly repetitive. They preserve breadth and show event streams, but too often the event stream is carrying the experience. A ledger is valuable only when it records real object mutations users can verify in the shell, saved list, files, database, or preview.

### Blueprint and PR Specialization

`v2-design-014` is the best newer Blueprint-ledger reference. It models search, representative subset labeling, selected detail, JSON validation, replacement warning, progress, preview update, database/content consequence, and transfer record. It should be used for Blueprint mechanics, not as the universal default shell.

`v2-design-017` is the best later PR/branch route reference. It treats WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, ZIP import, and Vanilla WordPress as launch contracts with typed inputs, progress, and resulting active identity. Keep this contract model for PR/GitHub/Blueprint launch routes.

Blueprint gallery honesty is improved across V2. Most entries say "representative subset" or "6 shown of 43" instead of pretending to render the full catalog. Keep that discipline. Full 43-entry claims must be data-backed.

## Remaining Gaps

Save is better, but not uniformly complete. The bar is: unsaved object, choose browser or local directory, permission/cancel/denial for local, progress, final saved/local identity, saved row mutation, shell badge/title/path change, settings action change, and history. `002`, `020`, `023`, and `025` are closest.

Local directory is still fragile in weaker entries. A label is not enough. Designs must show folder selection, grant/deny/cancel, selected folder identity, reload/reconnect behavior, and how local storage changes available actions.

Delete is improved but should not regress. Warning copy alone is insufficient. Require cancel, confirm, progress where appropriate, row removal, active fallback, and updated shell identity.

ZIP import/download remains uneven. Stronger entries show chooser, selected archive, validation, replacement warning, import progress, database/file replacement, and final imported state. Retire any ZIP flow that stops at "native file chooser opened."

GitHub import/export still needs the most rigor. Session-only token caveats are usually present, but repository/source selection, authentication state, progress, failure, and final imported/exported result are inconsistent. `016`, `020`, and `025` are the current references.

File editor fidelity is better than V1 but still shallow in many clones. The minimum credible lifecycle is selected file, dirty marker, save/apply, success/error result, and event tied to the active object. Upload, browse, new file, and new folder need visible results, not just buttons.

Database/logs are preserved well at the inventory level. Logs need realistic warning/error states when a design claims diagnostics or support value. Database download should produce a result; Adminer/phpMyAdmin should at least acknowledge launch or blocked-launch state.

Mobile remains unproven. The dominant V2 layout uses sticky topbars, dense rails, right inspectors, event ledgers, code panes, gallery grids, and miniature previews. CSS breakpoints exist, but no dense design should be promoted without rendered phone-width proof that path input, Save state, WP Admin/Homepage, destructive confirmations, and the live shell remain usable.

## Benchmarks To Carry Forward

- `v2-design-001`: best preview-protecting command deck baseline.
- `v2-design-002`: deepest operations rail; strongest local directory, saved list, database, logs, and transfer lifecycle.
- `v2-design-003`: strong first-class Playground object model and storage-specific consequences.
- `v2-design-011`: strongest early object ledger and row mutation pattern.
- `v2-design-014`: best Blueprint inspect/validate/replace/progress/result mechanics.
- `v2-design-016`: best Site Manager-led file/data workbench and GitHub/ZIP completion reference from the early audit set.
- `v2-design-017`: best PR/Gutenberg/launch contract model.
- `v2-design-020`: best command search that drives executable forms instead of passive discovery.
- `v2-design-023`: strongest saved-object command deck with temporary/saved/local/preview/imported identities.
- `v2-design-025`: best transfer/settings/delete consolidation; add it to the registry or explicitly exclude it.

## Patterns To Retire

- Generic two-column light-ledger clones that only reshuffle the same action inventory.
- Event streams that record intent without mutating shell identity, preview state, saved rows, files, database, or settings mode.
- Static drawers and cards for GitHub, ZIP, database, files, and Blueprint actions.
- Destructive warnings without cancel, confirm, final state, and fallback.
- Badge-only local-directory treatment without folder permission and reconnect modeling.
- Full "43 Blueprints" claims without real data or honest subset labeling.
- Diagnostics consoles with only healthy logs.
- Letter/icon-only primary navigation for Save, Saved Playgrounds, Site Manager, settings, transfer, or destructive actions.
- Mobile claims based only on stacked CSS, without rendered overflow checks.

## Next Worker Bar

Do not add new product requirements. Pick one current Playground flow and finish it against the existing feature surface while preserving the live WordPress shell:

1. Browser/local save that transforms the exact active object and updates every dependent UI surface.
2. ZIP import/download with chooser, validation, replacement warning, progress, result, and fallback/cancel states.
3. GitHub import/export with account connection, repo/source selection, token caveat, progress, failure/success, and active-object result.
4. Blueprint URL or gallery run with validation, replacement warning, progress, preview/database/file consequences, and save/export implications.
5. File editor lifecycle with dirty state, save result, upload/browse/new file/new folder outcomes, and at least one realistic error.

The V2 direction succeeds when the WordPress site stays large, live, and protected while operations complete around it. Anything that hides the preview behind ledgers, catalogs, or static operations panels is moving away from the strongest family insight.
