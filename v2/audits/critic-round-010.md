# Critic Audit - V2 Round 010

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `audits/critic-round-100.md`
- legacy family references: `designs/design-001`, `designs/design-003`, `designs/design-007`
- `v2/data/designs.json`
- completed V2 folders under `v2/designs/`: `v2-design-001` through `009`, plus `011`, `013`, and `016`
- existing `v2/audits/`: no prior audit files were present before this round

No design files were edited. This is a source audit of manifests, HTML, CSS, and JavaScript. I did not run a rendered screenshot pass, so mobile comments below are based on layout/CSS risk rather than fresh device captures.

## Overall Verdict

The completed V2 set is a real step deeper than the original Playground Console, Playground Command Deck, and Playground Operations Console family. The best V2 entries stop treating the feature list as static inventory and instead model Playground as a mutable object: temporary, browser-saved, local-directory-backed, PR preview, ZIP import, GitHub import/export target, or Blueprint result. That is the right direction.

The strongest designs preserve the current Playground feature surface while keeping the live WordPress shell visible and protected. `v2-design-001`, `002`, `003`, `011`, `013`, and `016` are the useful benchmark cluster. They make the path input, refresh, WP Admin/Homepage, save identity, reset/reload consequence, selected object, and transfer history remain visible while work happens around the site.

The remaining problem is convergence. Most V2 designs are now variations of the same two-column console: large browser, right inspector, event ledger, status chips, and the same lists of actions. That pattern is productive, but future workers should deepen one workflow rather than produce another near-clone with slightly different tabs.

## Registry Hygiene

`v2/data/designs.json` lists `v2-design-001` through `009`, `013`, and `016`, but `v2/designs/v2-design-011/` exists and appears complete. Add it to the registry or explicitly mark it out of scope. This matters because `v2-design-011` is one of the stronger object-ledger designs and should not be invisible to downstream review.

## Feature Surface Preservation

The V2 set broadly preserves the captured Playground surface:
- start routes: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, From GitHub, Blueprint URL, and ZIP import
- save routes: browser storage, local directory, progress, saved identity, local permission/reconnect copy
- saved management: temporary and saved rows, open/manage, rename, delete confirmation, row removal or fallback in the stronger entries
- shell controls: path input, refresh, Homepage, WP Admin, save state, active identity
- settings: WordPress/PHP/language, older versions, network, multisite, destructive reset for temporary sites, Save & Reload for saved/local sites
- Site Manager: files, Blueprint, database, logs, GitHub export, ZIP download
- data/transfer tools: database path/size, `database.sqlite`, Adminer, phpMyAdmin, Blueprint copy/download/run, GitHub import/export, ZIP import/download

The best V2 designs also preserve consequences, not just controls. `v2-design-001` inserts saved rows and changes shell identity after save. `v2-design-002` models folder denial/cancel/grant and database-download progress. `v2-design-003` treats delete, save, route preview, and object selection as state changes. `v2-design-011` transforms rows and active identities across save, PR preview, ZIP import, Blueprint run, rename, delete, and reset/reload. `v2-design-013` is strong on object-ledger and Blueprint replacement consequences. `v2-design-016` is strong on local-directory save, ZIP/GitHub completion, and event ledger discipline.

## Family Assessment

### Playground Console / Command Deck

`v2-design-001` is the cleanest direct successor to the original console/deck references. It keeps a large browser first, puts the command deck beside it, and has meaningful mutations for browser/local save, Blueprint validation/run, delete, rename, files, database, and transfers. It should be a benchmark for preview-protecting IA.

`v2-design-002` is the deepest operational rail version. It has the most complete interaction model: saved list rendering, local folder denial/cancel/grant, active fallback after delete, Blueprint filtering/detail, database download progress, logs, and generic transfers. Use it as the implementation-depth benchmark, even if its density needs mobile proof.

`v2-design-007` is valuable but narrower: it goes deeper on WordPress PR and Gutenberg PR/branch contracts than the others. Its route validation, preview identity, and save/export availability are the right direction. It is not the broadest console benchmark.

### Operations Console / Object Ledger

`v2-design-003`, `011`, `013`, and `016` best answer the round brief. They model Playgrounds as persistent operational objects rather than panels of buttons. `v2-design-011` is especially strong because it mutates the same row through save, PR preview, ZIP import, Blueprint run, rename, delete, and reset/reload while keeping the preview shell intact. `v2-design-013` gives the Blueprint workflow the clearest inspect-confirm-progress-result chain. `v2-design-016` is the best later ledger/workbench reference for GitHub export, ZIP generation, local save lifecycle, and Site Manager data operations.

`v2-design-006` is a good file/data workbench but should be used selectively. It is credible on dirty file state, database, command search, logs, and transfer history, but the live WordPress site can feel secondary to the tools.

### Specialized Directions

`v2-design-004` is the best Blueprint-first console, with ZIP validation/import and ZIP download modeled more concretely than most. It should be mined for Blueprint and archive flows, not used as the default product shell.

`v2-design-005` and `008` are useful transfer/runtime variants. They preserve the surface and consequences, but they mostly reinforce patterns already covered better by `002`, `004`, `011`, and `016`.

`v2-design-009` is the diagnostics/support variant. It is helpful for Save & Reload, delete fallback, warnings, logs, and runtime health, but it should remain a mode, not the main IA benchmark.

## Remaining Gaps

Local directory is improved but still not fully trustworthy everywhere. The best entries model permission denial, cancellation, grant, selected folder, and reconnect consequences. Future work should not regress to "local directory" as just a save destination label.

GitHub import/export still needs more completed flows. Many designs mention session-only tokens and repository selection; fewer show authentication, repo choice, progress, success/failure, and the effect on active object identity. `v2-design-016` is the best current reference here.

ZIP import/download is uneven. `v2-design-004`, `011`, `013`, and `016` are stronger because they show validation, replacement warning, progress/result, or generated archive feedback. Designs that only say "native file chooser opened" are not deep enough.

File editor fidelity is better than V1 but still fragile. Dirty state and save result appear often; upload/new file/new folder/browse usually remain single-line results. Use `v2-design-002`, `003`, `006`, and `016` as the minimum bar.

Blueprint gallery honesty improved. Most V2 entries label representative subsets instead of pretending to render all 43 entries. Keep that. Do not invent full-gallery completeness without a data-backed list.

Database/logs are preserved, but logs need real problem states. Designs with only "no problems so far" do not support the diagnostics or operations-console claims. `v2-design-009` and `016` handle warnings better.

Mobile remains unproven. The common layout relies on dense sticky topbars, right inspectors, tab strips, ledgers, grids, and mini browsers. CSS breakpoints exist, but no dense V2 entry should be promoted without screenshot and overflow checks at phone widths.

## Benchmarks To Carry Forward

- `v2-design-001`: preview-protecting command deck and broad feature preservation with visible state mutation.
- `v2-design-002`: deepest executable operations model, especially local directory, saved list, database, logs, and transfer history.
- `v2-design-003`: first-class Playground object model and saved/local/preview identity handling.
- `v2-design-011`: strongest object ledger; excellent row mutation, PR preview, save, delete, ZIP import, Blueprint run, and reset/reload consequences.
- `v2-design-013`: best Blueprint inspect-confirm-progress-result pattern tied to the selected object.
- `v2-design-016`: best operations ledger for Site Manager files/data, local save lifecycle, GitHub export, ZIP generation, and transfer completion.

Use selectively:
- `v2-design-004` for Blueprint/ZIP mechanics.
- `v2-design-006` for file/data workbench depth.
- `v2-design-007` for PR/Gutenberg launch contracts.
- `v2-design-009` for diagnostics and saved-site Save & Reload behavior.

## Patterns To Retire

- Another generic browser-plus-right-inspector clone without a newly finished workflow.
- Static action cards that list Save, GitHub, ZIP, Blueprint, database, and logs without mutating the active Playground object.
- Destructive warnings without cancel, confirm, progress where appropriate, and final UI state.
- "Local directory" as a badge only; it must include folder permission and reconnect behavior.
- Full "43 Blueprints" claims without real data or an honest representative-subset label.
- Logs that are always empty in diagnostics or operations concepts.
- Mobile layouts that depend on dense tables, horizontal chips, sticky inspectors, or nested tabs without rendered proof.

## Next Worker Bar

The next round should not add a new product requirement or another broad console inventory. Pick one current Playground flow and finish it end to end against the existing surface:

1. Browser/local save that transforms the exact temporary object, updates slug or folder identity, saved list, shell title, reset/reload action, and history.
2. GitHub import/export with account connection, repository/source choice, token caveat, progress, failure/success, and active-object result.
3. ZIP import/download with chooser, validation, replacement warning, progress, generated/imported result, and fallback/cancel states.
4. Blueprint run from gallery or URL with validation, replacement warning, run progress, preview update, database/file consequence, and save/export consequence.
5. File editor lifecycle with selected file, dirty marker, save/apply, upload/browse/new file/new folder outcomes, and a realistic error path.

The live WordPress shell must stay visible and protected while these flows run. That is the core advantage of the V2 direction.
