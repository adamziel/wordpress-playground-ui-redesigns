# Critic Audit - Round 100

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed design folders under `designs/`: 100 folders, `design-001` through `design-100`
- existing audits: `audits/critic-round-020.md`, `audits/critic-round-032.md`, `audits/critic-round-042.md`, `audits/critic-round-052.md`, `audits/critic-round-063.md`, `audits/critic-round-074.md`, `audits/critic-round-084.md`, and `audits/critic-round-094.md`

Method:
- Used prior audits as the continuity baseline for `design-001` through `design-098`, with special attention to the benchmark and risk patterns already identified in rounds 084 and 094.
- Performed focused source review of the newly added `design-099` and `design-100`, including `manifest.json`, `index.html`, `styles.css`, and `app.js`.
- Checked registry hygiene between `data/designs.json` and the `designs/` directory. The registry and folder set now match exactly.
- Ran the full validator loop across `design-001` through `design-100`. No failing design IDs were reported.
- Attempted a Playwright render check, but Chromium still cannot launch because `libglib-2.0.so.0` is missing. Visual and mobile findings below are therefore based on source/CSS inspection and prior audit continuity, not fresh screenshots.
- No design files were edited.

## Overall Verdict

The swarm has preserved the current WordPress Playground feature surface at the visible-control and copy level. Across the completed set, the current shell, path navigation, refresh, Save, Saved Playgrounds, Site Manager, settings, six start-new routes, Blueprint gallery, browser/local save destinations, saved-site rename/delete, file browser, Blueprint editor, database tools, logs, GitHub export, ZIP import, and ZIP download are all represented.

Round 100 improves process hygiene. The earlier registry mismatch around `design-091` is resolved, and all 100 design folders validate. That matters: the audit problem is no longer incomplete integration, but whether the designs are deep enough to be trusted as product directions.

The quality bar remains only partly met. The swarm is strongest when it models current-product consequences as state changes: save progress, saved identity, selected route, renamed rows, storage mode, reset versus reload behavior, and visible import/export outcomes. It is weakest when it treats the Playground feature checklist as inventory. A redesign does not become high fidelity by placing every current action in a card, table, command drawer, or tab. High fidelity requires the flows to finish: picker, validation, progress, cancel, confirmation, completion, mutation of the active shell, and mutation of dependent lists or tabs.

`design-099` and `design-100` are competent late-round entries, but neither displaces the strongest earlier patterns. `design-099` is a useful expert inline-toolbar direction with warmer visual styling and better live-preview protection than many console-like entries. `design-100` is a clear agency/client workbench with beginner-readable launch cards and table-led saved-site management. Both preserve breadth, but both still leave major actions as result copy or static drawer content.

## Feature Preservation

Strong preservation:
- Start routes remain complete: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- GitHub import generally preserves the important current-product caveat: account connection is required and the token is not stored across refresh.
- Save coverage is broad: browser storage, local directory, temporary-loss warnings, and `Saving 3028 / 3751 files`-style progress are common.
- Saved and unsaved Playgrounds are represented together in libraries, tables, ledgers, tabs, or document sections.
- The live shell usually keeps path input, refresh, save status, Homepage, WP Admin, and current site identity visible.
- Site Manager breadth is consistently preserved: Settings, File browser, Blueprint, Database, and Logs.
- Database fidelity is one of the best-preserved areas: MySQL emulation backed by SQLite, `/wordpress/wp-content/database/.ht.sqlite`, database size, `database.sqlite`, Adminer, and phpMyAdmin are widely present.
- Reset/reload distinctions are now broadly understood: unsaved Playgrounds reset destructively; stored Playgrounds use limited settings and Save & Reload.

Weak preservation by flow depth:
- Browser save rarely updates every dependent object: shell title, URL/slug, saved row, selected site, current storage identity, and reset/reload action.
- Local-directory save is still mostly superficial. Designs mention a folder picker and local folder backing, but rarely model denied permission, cancel, reconnect, folder identity, or reload behavior after the first grant.
- Delete is still not complete enough. Many designs show warning copy; few model confirm, cancel, final row removal, and the resulting active-site fallback.
- ZIP import remains under-modeled. The current product opens the native file chooser; a high-fidelity redesign should show no-file, selected file, validation, replacement warning, import progress, cancel, and final imported-site state.
- GitHub import/export rarely reaches repository selection, authentication state, progress, error handling, or final pushed/imported result.
- File and Blueprint editors are still often decorative. They need selected file metadata, dirty state, save/apply, upload result, browse result, validation, failed run, and successful run/download feedback.
- Logs are too healthy. Designs that claim diagnostics, support, or debugging value need at least one realistic warning/error with source and recovery path.
- Blueprint gallery fidelity remains uneven. Representative subsets are acceptable when labeled honestly. Full 43-entry claims should use captured names or a data-backed list, not invented catalog rows.

## Newly Visible Pattern Notes

### Expert Inline Command Bars: `design-079`, `design-086`, `design-099`

Strengths:
- `design-099` keeps the live WordPress preview as the dominant surface while exposing launch, save, saved-site management, Site Manager tools, Blueprint catalog, and transfer actions in an adjacent inline ledger. This is stronger than command concepts that turn the preview into a secondary thumbnail.
- `design-099` has meaningful state updates for route selection, path navigation, save destination, save progress, saved identity, rename, settings reset/reload copy, Blueprint filtering, selected Blueprint detail, and transfer result text.
- The warmer editorial palette in `design-099` is a useful break from the swarm's repeated black/white/cyan console look, while still feeling operational rather than decorative.
- `design-086` remains the stronger search/command taxonomy reference, because its grouped commands expose nearly the full captured product surface through route-specific inspector content.
- `design-079` and `design-099` are good reminders that expert accelerators can coexist with a persistent browser-like shell.

Usability risks:
- Letter-key command labels remain a recurring discoverability and accessibility weakness. `N`, `S`, `M`, `T`, `B`, and `X` in `design-099` are more readable than icon-only controls, but still ask users to learn a private command system.
- `design-099` packs many primary actions into a sticky topbar and right ledger. It is efficient for experts, but dense enough that first-time users may not see the simplest path: start fresh, open WP Admin, save.
- Command and toolbar patterns depend on vocabulary. Users may search for "archive", "folder", "restore", "snapshot", "package", "branch", or "plugin" rather than the product's exact labels.
- The inline ledger can become a static description panel if actions only change text instead of mutating the active Playground state.

Missing flow coverage:
- `design-099` save progress finishes and updates several labels, but it does not insert a new saved row from an initially unsaved row or fully change the active URL/slug model.
- `design-099` delete changes row status text to deleted, but does not remove the row, offer undo/cancel, or clarify which Playground remains active.
- GitHub export, ZIP import, and Blueprint run in `design-099` stop at prepared/queued messages.
- File and Blueprint editing in these command-bar designs remains static; there is no credible dirty/save/validation lifecycle.

Future direction:
- Keep `design-099`'s preview-protecting inline layout and warmer visual direction, but replace letter-first navigation with labeled controls plus secondary keyboard hints.
- Make command execution mutate the same objects users rely on: active title, path, storage badge, saved rows, manager tabs, transfer history, and preview state.
- Add a command-history or result strip that records completed actions, not just selected commands.

### Table-Led Client and Admin Workbenches: `design-090`, `design-093`, `design-100`

Strengths:
- `design-100` is one of the clearest beginner-readable table-led entries. It separates start/import routes into concrete cards, then gives saved, local-directory, and temporary sites a table with source, storage, runtime, last action, and row actions.
- `design-100` preserves consequence copy well: unsaved sites are temporary, ZIP import replaces files and database, Blueprint runs alter current content, settings reset is destructive for unsaved sites, and saved sites use Save & Reload.
- The save drawer in `design-100` has an actual progress sequence and highlights a saved row after completion.
- `design-090` remains the better reference for portability taxonomy: browser save, local-directory save, GitHub export, ZIP import, ZIP download, Blueprint bundle, and database download are treated as related transfer actions.
- `design-093` remains useful for dense saved-site ledger management and WordPress-admin-like familiarity.

Usability risks:
- Table-first surfaces can make Playground feel like a site inventory tool before it feels like a live browser-hosted WordPress site.
- `design-100` starts with a table and action cards, but the embedded WordPress preview is lower on the page inside Site Manager. That weakens the core "running site in browser" mental model.
- Dense tables and drawers are plausible on desktop, but mobile safety is unproven without screenshots. `design-100` has responsive CSS, but table cards, sticky topbar, detail drawer, catalog, and Site Manager split still need visual proof.
- Table row state can create contradictions: `design-100` shows an unsaved selected row and a saved result row at the same time, while the save simulation only selects the saved row rather than clearly transforming the temporary row into a saved identity.

Missing flow coverage:
- `design-100` rename and delete panels are static. They do not mutate row name, slug, selected row, or active state.
- `design-100` save result reveals a notice and selected row, but does not update the topbar status, route, current active row, or reset/reload behavior.
- Local-directory save in `design-100` changes progress copy only; it does not model picker cancellation, permission grant/denial, or folder reconnection.
- Import/export panels in `design-100` are consequence-aware but not executable: GitHub export does not authenticate or choose a repository, download does not generate feedback, and ZIP import appears as a preselected success state.

Future direction:
- Use tables for saved-site management, not as the entire default product shell. Keep the active WordPress site and path identity visible in the first viewport.
- Make table rows stateful: pending, saving, saved, local permission needed, delete pending, deleted, failed import, exported.
- When a temporary Playground is saved, transform that exact temporary row into the saved row and update every dependent shell object.

### Blueprint Catalogs and Markets: `design-074`, `design-077`, `design-083`, `design-094`, `design-099`, `design-100`

Strengths:
- `design-094` remains the most polished Blueprint-market direction. It gives the catalog a product-quality surface while preserving adjacent PR, GitHub, ZIP, save, saved management, and Site Manager flows.
- `design-077` remains the best reference for full-catalog mechanics because it renders a real 43-entry array with search, category filters, selected detail, empty state, and run-result messaging.
- `design-099` renders a 43-item JavaScript array and wires filtering/search and selected detail. That is stronger than static "All 43" claims with only a few visible cards.
- `design-100` is honest that it shows "43 available, 12 shown in this static slice", which is preferable to overstating fidelity.
- The newer Blueprint surfaces increasingly preserve current categories: All, Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, and News.

Usability risks:
- Blueprint-first screens still risk demoting the active WordPress site. Users who came to preview a PR, open `/wp-admin/`, inspect the database, or save a temporary site should not have to parse a marketplace first.
- Catalog imagery must identify actual Blueprint output. Decorative screenshots or generic preview tiles can make the market look richer while making selection less trustworthy.
- Invented Blueprint names remain a fidelity problem. It is acceptable to prototype representative entries, but not to imply they are the captured current catalog.

Missing flow coverage:
- Selecting a Blueprint and pressing Run usually changes copy, not the current Playground state.
- Blueprint URL and catalog runs rarely model inspect JSON, validation error, replace-current confirmation, progress, and final active-site result.
- Blueprint editors rarely have dirty markers, validation, save/apply, copy-link result, download result, or failed-run output.

Future direction:
- Treat `design-094`'s visual polish and `design-077`'s catalog mechanics as the combined benchmark.
- Make every 43-entry claim data-backed, or label it as a representative subset.
- Finish one Blueprint run end to end: inspect, validate, warn, run, progress, replace/create result, preview update, and saved identity effect.

### Site Manager, IDE, and Tab Matrix Concepts: `design-078`, `design-084`, `design-091`, `design-098`, `design-099`, `design-100`

Strengths:
- `design-084` remains one of the strongest Site Manager-first concepts because the first viewport gives real weight to files, Blueprint JSON, database, logs, settings, preview, and command search.
- `design-098` remains the clearest multi-Playground tab model: unsaved, browser-saved, local-directory, and Blueprint-backed Playgrounds are represented as open project tabs.
- `design-099` integrates Site Manager tools without fully taking over the product shell, which is a better default posture than many manager-first entries.
- `design-100` preserves all Site Manager tabs and includes a realistic split with tools beside an embedded WordPress preview.

Usability risks:
- Manager-first and IDE-first designs can invert Playground's value. The product is a running WordPress site with powerful management tools, not primarily a file IDE with a small preview.
- Nested tabs and tab matrices can become cognitively expensive: project tabs, within-project tabs, drawers, topbar buttons, and preview controls all compete.
- Narrow previews are acceptable for debugging and file editing, but weak for theme review, front-end verification, admin workflows, and workshop demos.

Missing flow coverage:
- File editing is the largest fidelity gap. New File, New Folder, Upload, Browse files, selected `wp-config.php`, and code panes appear frequently, but editing rarely produces dirty state, save, validation, upload result, or error handling.
- Database tools show driver/path/size well, but download/Adminer/phpMyAdmin actions rarely produce outcome, loading, blocked-popup, or error states.
- Logs mostly show empty success states. `design-100` improves slightly with a PHP notice, but there is still no investigation path or recovery action.
- Tab lifecycle is incomplete. `design-098` claims multi-project tabs, but launch/save/rename/delete/import actions do not create, rename, close, or remove tabs.

Future direction:
- Keep Site Manager as a powerful adjacent or task-specific mode, not always the default first screen.
- Model one real editor lifecycle before adding more panes: select file, edit, dirty marker, save, success/error.
- If project tabs continue, implement tab lifecycle and let storage type affect available actions and warnings.

### Saved Libraries, Browser Shells, and Mobile Fleet Patterns: `design-005`, `design-073`, `design-082`, `design-085`, `design-088`, `design-098`, `design-100`

Strengths:
- `design-082` remains the strongest saved-site library pattern: saved, local, and temporary Playgrounds are first-class objects, and rename/delete are treated with modal seriousness.
- Browser-shell designs such as `design-005` and `design-085` protect the path input, refresh, Homepage, WP Admin, save state, and tab metaphor, which aligns with the actual Playground shell.
- `design-088` is still the best mobile-first reference because it uses bottom navigation, stacked touch panels, saved fleet management, launch cards, Site Manager tabs, Blueprint cards, save destinations, and transfer warnings.
- `design-100` adds a useful agency/client variant of the saved-site library pattern, especially around storage/runtime/last-action metadata.

Usability risks:
- Library-first can make users administer saved objects before they understand the current active site.
- Browser metaphors can become shallow if tabs do not have lifecycle, close, unsaved warning, save identity, and restore behavior.
- Mobile remains unproven. Dense chip rows, tables, sticky rails, bottom navs, and split panels need rendered screenshot and overflow checks.

Missing flow coverage:
- Saved row insertion, transformation from unsaved to saved, delete removal, and active-site fallback remain inconsistent.
- Local directory identity is still weak: chosen folder, permission state, sync/reload behavior, and reconnect are rarely shown.
- Browser tab or project tab lifecycles are mostly representational.

Future direction:
- Carry forward `design-082`'s object model and modal treatment for saved-data actions.
- On mobile, prove the first viewport contains current path, save state, WP Admin/Homepage, and an obvious "start fresh" action.
- Make saved/local/temporary differences change available actions, not just badges.

### Guided, Runbook, Diagnostics, and Support Dossier Patterns: `design-077`, `design-080`, `design-081`, `design-087`, `design-092`, `design-095`, `design-097`

Strengths:
- `design-097` remains one of the best document/support workflows because route selection, save state, rename, Blueprint run, and ZIP import update visible text and status.
- `design-092` is a solid onboarding/runbook mode for plugin developers because it sequences Playground capabilities while preserving route contracts and save consequences.
- `design-095` usefully elevates runtime health, logs, database state, save progress, and risk notices for learners.
- `design-080` and `design-081` remain useful for first-run progressive disclosure and focused launch-packet assembly.

Usability risks:
- Guided and document-style designs can become documentation instead of an app. Repeat users should not have to walk through a lesson to preview a PR, open WP Admin, download a database, or export a ZIP.
- Diagnostics-first designs can create false confidence if the logs are static and healthy.
- Long single-column layouts risk hiding common actions far below the first viewport.

Missing flow coverage:
- Checklist progress often reflects visited sections rather than completed product mutations.
- Support flows still lack final destructive outcomes: confirmed deletion, imported ZIP result, reset result, failed Blueprint run, or log-driven recovery.
- Diagnostics panels rarely include realistic warnings or errors with next steps.

Future direction:
- Treat runbooks and diagnostics as modes or first-run overlays, not universal default shells.
- Tie progress to actual state changes: route started, save completed, row created, export generated, warning resolved.
- Include at least one realistic problem state for support/diagnostics concepts.

## Visual and Information Architecture Findings

High-fidelity improvements:
- The swarm has moved beyond pure hero-page or shallow marketing restyles. Most designs now look like real tools with dense controls, current-product language, and meaningful technical details.
- Later designs preserve destructive consequence copy better than early rounds.
- Several designs have stronger IA than the current product for discovering hidden flows: command search, grouped launch cards, saved-site ledgers, Blueprint markets, transfer ledgers, and Site Manager-first workbenches.

Persistent IA problems:
- Breadth is often achieved by placing everything on screen at once. That improves audit checklist coverage but can weaken task clarity.
- The live WordPress iframe is too often demoted below catalogs, tables, diagnostics, ledgers, or file panes.
- Dense three-pane layouts are now overused. Many are competent but not meaningfully different from one another.
- Several concepts use paragraphs to explain behavior that should be communicated by controls, statuses, confirmations, and results.
- Console-like black/white/cyan styling has become repetitive. `design-099` usefully explores a warmer operational direction, while `design-100` uses a more conventional SaaS/admin palette.
- Icon or letter-only controls continue to weaken discoverability, especially for Save, Saved Playgrounds, Site Manager, settings, refresh, and transfer actions.

Mobile risks:
- Responsive CSS exists across many designs, but visual proof is still missing because Chromium cannot launch in this environment.
- The highest-risk mobile structures are dense tables, horizontal chip rows, fixed bottom navs, sticky topbars with many actions, nested tab sets, and side-by-side preview/editor splits.
- No dense concept should be promoted without desktop and mobile screenshots plus overflow checks after the Chromium dependency is fixed.

## Carry Forward

Carry forward strongly:
- `design-084` for command-assisted Site Manager work and better save-state mutation.
- `design-094` for polished Blueprint market discovery and consequence-aware adjacent flows.
- `design-097` for stateful document/support workflow updates.
- `design-098` for multi-Playground project tabs, only if future work implements tab lifecycle.
- `design-099` for a preview-protecting expert inline toolbar and warmer operational visual direction.
- Earlier benchmark patterns from prior audits: `design-074`, `design-077`, `design-082`, `design-086`, and `design-089`.

Use selectively:
- `design-100` for agency/client saved-site tables, beginner-readable route cards, and consequence-aware drawer copy.
- `design-088` as the mobile shell reference, pending visual proof.
- `design-090` for import/export transfer taxonomy.
- `design-092` for onboarding/runbook mode.
- `design-093` for WordPress-admin-like saved-site ledger management.
- `design-095` for diagnostics mode.
- `design-096` for distinct PR/branch review route modeling.

Retire or consolidate:
- Generic three-pane workbenches that only rearrange the checklist.
- Catalogs that imply all 43 Blueprints without current data or honest subset labeling.
- Static drawers that present correct copy but do not change the active Playground state.
- Destructive-action warnings without cancel/confirm/final state.
- File, Blueprint, database, and log panes that are purely decorative.
- Letter-only primary navigation as the main discoverability mechanism.

## Highest-Priority Guidance

1. Finish one save flow end to end.
   Start unsaved, choose browser or local directory, model picker/permission where relevant, show progress, complete, update shell identity, slug or folder, saved row, selected site, and reset/reload behavior.

2. Finish one destructive flow end to end.
   Delete, reset, ZIP import over current, Blueprint run over current, or start-new-over-unsaved should include consequence, cancel, confirm, progress where relevant, and final UI mutation.

3. Make one editor credible.
   File or Blueprint editing should show selected file, dirty marker, save/apply, validation, upload/browse result, and success/error state.

4. Make transfer workflows operational.
   GitHub import/export should reach authentication, repository/source selection, progress, and failure/success states. ZIP import/download and database download should produce real result feedback.

5. Protect the live WordPress shell.
   Every direction should keep current path, refresh, save state, Homepage, WP Admin, current storage identity, and a usable preview obvious in the first viewport unless the user has explicitly entered an advanced manager mode.

6. Prove responsive layouts visually.
   Once Chromium dependencies are fixed, run desktop/mobile screenshots and overflow checks for `design-084`, `design-088`, `design-094`, `design-097`, `design-098`, `design-099`, and `design-100`, plus earlier candidates `design-074`, `design-077`, `design-082`, `design-086`, and `design-089`.

Round 100 closes the swarm with broad feature preservation and clean integration. The next design pass should stop adding new shells until the strongest existing shells prove current Playground workflows through complete, stateful, consequence-aware interactions.
