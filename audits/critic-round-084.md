# Critic Audit - Round 084

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed design folders under `designs/`: 88 folders, `design-001` through `design-091` with numbering gaps
- existing audits `audits/critic-round-020.md`, `audits/critic-round-032.md`, `audits/critic-round-042.md`, `audits/critic-round-052.md`, `audits/critic-round-063.md`, and `audits/critic-round-074.md`

Method:
- Used prior audits as the continuity baseline for `design-001` through `design-078`.
- Performed focused manifest, HTML, CSS, and JavaScript review for newly present or previously under-discussed designs: `design-074`, `design-077`, `design-079`, `design-080`, `design-081`, `design-082`, `design-085`, `design-086`, `design-089`, and `design-091`.
- Ran `node scripts/validate-design.mjs` for those ten designs. `design-074`, `design-077`, `design-079`, `design-080`, `design-081`, `design-082`, `design-085`, `design-086`, and `design-089` validated. `design-091` failed validation because `index.html` is missing the required `/php/i` signal, although PHP-related UI is injected from `app.js`.
- Attempted a Playwright desktop/mobile render and overflow pass for the same ten designs. Chromium still cannot launch because `libglib-2.0.so.0` is missing, so mobile and visual-risk notes below are based on source/CSS review rather than screenshots.
- No design files were edited.

## Overall Verdict

The completed set still preserves the current WordPress Playground feature surface at the visible-control level. The required launch routes, save destinations, saved Playground management, active URL/path navigation, refresh, Homepage, WP Admin, settings, Site Manager tabs, file tools, Blueprint bundle tools, database tools, logs, GitHub export, ZIP import/export, and Blueprint gallery all remain represented across the swarm.

Round 084 adds useful depth in four areas. `design-074` and `design-077` give the most credible newer Blueprint catalog implementations, with real filtering/search and state changes after save, route selection, Blueprint selection, and rename/delete requests. `design-082` is the strongest saved-library variant in this pass because it uses native dialogs for rename/delete and gives the library a coherent selected-site model. `design-086` is a good command-inspector surface for discovery, with searchable grouped commands and route-specific drawer content. `design-089` gives runtime settings, destructive reset, save/reload, launch, save, manager, and catalog work a coherent ledger structure.

The main weakness is unchanged: many designs now describe existing Playground consequences correctly, but still stop short of operational truth. Save progress often does not mutate the saved list. Delete is frequently warning copy rather than a confirmed removal state. ZIP import rarely shows no-file, selected-file, validation, import progress, and resulting site state. GitHub import/export rarely reaches authenticated account and repository states. File and Blueprint editors remain mostly static code panes without dirty, validation, save/apply, upload result, or run result behavior.

There is also one process issue: `design-091` exists under `designs/` but is absent from `data/designs.json`. It should not be treated as fully integrated until the registry mismatch and validator failure are resolved.

## Feature Preservation

Strong preservation:
- The six start routes are still visible and mostly route-specific: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- Browser save and local-directory save are now more consistently separated, with distinct copy and result language in newer designs.
- Save progress keeps using the captured `3028 / 3751 files` pattern.
- Saved and unsaved Playgrounds remain visible together in tables, libraries, document sections, or manager rails.
- Persistent shell controls are usually present: path input, refresh, Save, Saved Playgrounds or library, Site Manager, Homepage, and WP Admin.
- Site Manager breadth remains strong: Settings, Files, Blueprint, Database, and Logs are nearly always present.
- Database fidelity remains high: SQLite-backed MySQL emulation, `.ht.sqlite` path, size, `database.sqlite`, Adminer, and phpMyAdmin are preserved.
- GitHub import copy usually preserves the important caveat that account connection is required and the access token is not stored.

Weak preservation by flow depth:
- Local-directory save is still shallow. Newer designs mention directory permission and folder selection, but rarely show cancel, denied permission, reconnect, mounted-directory identity, or how it differs from browser-backed saved-site slugs.
- Save completion rarely changes all dependent UI objects: shell title, saved row, slug, selected site, reset/reload behavior, and current status.
- Delete remains inconsistent. `design-080`, `design-082`, `design-089`, and `design-091` improve warning/confirmation visibility, but several still do not remove the row or restore the current site to a clear unsaved state.
- ZIP import remains under-modeled. Current Playground opens the native file chooser; high-fidelity redesigns should show file chooser trigger, selected archive, validation, replace-current consequence, progress, cancel, and imported result.
- File and Blueprint editors remain mostly static. High-fidelity coverage requires selected file metadata, editable content, dirty state, save/apply, upload/browse result, Blueprint validation, and run/copy/download feedback.
- Logs are still too healthy. Designs that emphasize diagnostics need at least one realistic warning or error state with source and recovery path.
- Blueprint gallery fidelity is uneven. `design-077` renders a full 43-entry data set; `design-080` renders a full 43-entry list but several entries are invented; `design-074`, `design-081`, `design-085`, and `design-086` are honest subset/catalog hybrids; `design-091` renders 43 items but many are invented and the design is not registered.

## Newly Visible Pattern Notes

### Blueprint Market and Document Workspaces: `design-074`, `design-077`

Strengths:
- `design-074` is one of the stronger Blueprint-first prototypes. Search, category filtering, selected Blueprint detail, run, inspect, save destination, progress, saved identity, rename, delete request, reset/reload, export, and Site Manager tabs are connected in one visible sequence.
- `design-074` actually changes state after Blueprint run and save: progress advances, shell status becomes saved, manager saved text changes, and rename updates visible labels.
- `design-077` renders a real 43-entry Blueprint array with search, category filters, selected detail, empty search state, and run-result messaging.
- `design-077` has one of the better document-style flows: route selection, save destination, complete save, project status, saved row, manager panels, and result summary all update in place.

Usability risks:
- Blueprint-first and document-first both risk demoting the core live-site experience. Users arriving to preview a PR, open WP Admin, or inspect a file should not have to parse a catalog-first surface first.
- `design-074` claims "Showing N of 43" while rendering a 12-item data set. That is honest as a filtered count only if the missing 31 are understood as not rendered; otherwise it overstates fidelity.
- `design-077` includes all 43 rows, but several names are not captured gallery names. That weakens product fidelity even though the interaction model is strong.
- Both designs rely on dense grids and long stacked sections. Without screenshot verification, they should not be advanced as mobile-safe.

Missing flow coverage:
- Delete in `design-074` queues a confirmation state but does not complete removal.
- `design-077` marks a row pending delete, but does not model confirm/cancel/removal.
- ZIP import and GitHub export/import still do not reach selected source, authenticated repository, validation, and completed result states.
- File and Blueprint editors do not show dirty/save/validation behavior.

Future direction:
- Carry forward `design-077`'s full catalog mechanics and `design-074`'s flow-state mutation.
- Replace invented Blueprint rows with captured gallery names wherever the design claims 43-entry fidelity.
- Add one complete destructive sequence: run Blueprint over current, ZIP import over current, or delete saved Playground with cancel and final row mutation.

### Minimal Command and Command Inspector: `design-079`, `design-086`

Strengths:
- `design-079` keeps the live site visible and uses compact command buttons plus keyboard shortcuts to reach launch, save, management, Site Manager, files, Blueprints, database, and logs.
- `design-079` makes save destination switching tangible and changes shell state from unsaved to saved.
- `design-086` is the stronger command implementation. Search, group filters, command rows, top nav buttons, and a contextual drawer expose nearly the entire captured feature surface.
- `design-086` has route-specific drawer content for WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, ZIP import, save, library, settings, files, Blueprint, database, logs, gallery, export, Homepage, and WP Admin.

Usability risks:
- `design-079` is very expert-oriented. Single-letter labels and keyboard affordances are efficient but weak for first-time discoverability.
- `design-079` uses a fixed command bar and drawer model with multiple horizontal overflow areas. Its CSS needs real viewport proof.
- `design-086` improves discoverability through search, but commands depend on known vocabulary. Terms like archive, folder, restore, snapshot, package, branch, and plugin should be searchable.
- In both designs, the drawer can become a content dumping ground. The active WordPress frame risks becoming secondary to command descriptions.

Missing flow coverage:
- `design-079` save changes shell labels but does not insert or update a saved-list row.
- `design-086` drawer actions mostly present forms and result copy; they do not mutate the shell, saved library, selected command history, or preview state.
- Delete in `design-086` is a warning inside the library drawer, not a confirm/cancel/result sequence.
- `design-086` gallery shows 1-12 of 43 and is not wired inside the drawer after injection.

Future direction:
- Keep `design-086`'s command taxonomy as a discovery layer, but make execution update real UI objects.
- Expand command synonyms before treating command search as a primary navigation model.
- Keep expert keyboard affordances in `design-079` as secondary accelerators, not the sole way the IA communicates.

### Guided Stack and Launch Packet Wizard: `design-080`, `design-081`

Strengths:
- `design-080` is a clear beginner progressive-disclosure design. It keeps launch, save, saved management, settings, Site Manager, Blueprint gallery, and portability as visible sections rather than disconnected modals.
- `design-080` has stronger than average delete presentation: a hidden warning panel appears before the final delete action.
- `design-080` renders 43 catalog items and wires category/search filtering.
- `design-081` gives launch route selection a disciplined packet model: source, runtime, storage destination, selected Blueprint, side-task manager tools, and handoff actions.

Usability risks:
- Both designs over-linearize Playground. Many current users need a quick PR preview, saved site, WP Admin, file browser, database download, or ZIP export without walking through a launch packet.
- `design-080` risks becoming documentation rather than an app. The single-column stack is helpful for learning but slow for repeat operation.
- `design-081` is polished but less stateful than it looks. Route selection changes drawer text, storage selection changes copy, and tabs switch panels, but few actions complete.
- Both designs use many explanatory panels. The UI should not need to teach every capability through paragraphs once labels and hierarchy are strong.

Missing flow coverage:
- `design-080` save destination changes result copy but does not mutate global saved state.
- `design-080` confirm delete button does not remove the selected saved row.
- `design-081` local-directory save result is copy-only and does not show picker/cancel/permission/reconnect.
- `design-081` only models five featured Blueprint shortcuts in detail and uses a compact catalog table rather than a robust all-entry flow.

Future direction:
- Treat `design-080` as an onboarding mode, not the default shell for repeat users.
- Use `design-081`'s launch packet as a focused start-new flow entered from the current shell.
- Add one full stateful path before adding more instructional sections.

### Saved Library and Browser Desk: `design-082`, `design-085`

Strengths:
- `design-082` is the strongest saved-site library in this pass. It makes saved, local, and temporary Playgrounds first-class objects and frames launch, save, settings, export, and Site Manager tools as actions on the selected site.
- `design-082` uses real modal dialogs for rename and delete, which is closer to the risk level of saved browser-backed data than inline row buttons.
- `design-082` has route-specific launch forms and a responsive mobile bottom-nav model in CSS.
- `design-085` is a good browser-chrome continuation: tabs, address bar, reload, Homepage, WP Admin, save state, left navigation, route drawers, manager tabs, catalog, transfers, and delete warning are all visible.

Usability risks:
- Library-first can make Playground feel like a manager of saved objects before it feels like a live WordPress site.
- `design-082` starts from selected-site administration; quick-start users may have to infer where the live preview is.
- `design-085` repeats a familiar browser-shell pattern without adding enough new state. It is competent, but not as strong as `design-073`, `design-074`, or `design-077`.
- `design-085` uses tab and chip rows that rely on horizontal scrolling at narrow widths.

Missing flow coverage:
- `design-082` save completion changes status text but does not clearly add a saved row or transition temporary to saved across every dependent panel.
- `design-082` delete dialog exists, but final deletion does not remove the row in the reviewed script.
- `design-085` route drawers are route-specific but mostly static. Starting, saving, deleting, importing, and exporting do not complete as stateful flows.
- Both retain static Site Manager file/Blueprint/code/log surfaces.

Future direction:
- Carry forward `design-082`'s library object model and dialog treatment for rename/delete.
- Combine library-first management with a stronger persistent live preview and current path identity.
- Make saved/local/temporary differences affect allowed actions and reset/reload behavior, not only labels.

### Configuration and Manager Takeovers: `design-089`, `design-091`

Strengths:
- `design-089` is a coherent settings-first ledger. Runtime settings, destructive reset, stored Save & Reload, launch routes, save destinations, saved rows, Site Manager, database, logs, transfers, and catalog are grouped by consequence.
- `design-089` preserves the key reset distinction better than most: unsaved Playgrounds use destructive reset, stored Playgrounds use Save & Reload with limited options.
- `design-091` is an ambitious Site Manager takeover with a card grid plus detail drawer, narrow live preview, saved rail, start routes, save destinations, manager tabs, database, logs, and export/import actions.
- `design-091` has unusually broad drawer templates and some real state changes: save updates site state and saved name, rename changes labels, delete changes the state to deleted/unsaved, and Blueprint URL run appends a result message.

Usability risks:
- Settings-first and Site Manager-first both demote the product's central truth: a running WordPress site in an iframe. They are strong specialized modes, but risky default entry points.
- `design-089` has dense ledger rows, sticky navigation, and multi-column tables. Source CSS includes responsive fallbacks, but screenshot verification is still needed.
- `design-091` is not registered in `data/designs.json` and fails validation. That process gap matters because the gallery and audit metadata will not fully reflect the design.
- `design-091` starts from a saved browser state while also emphasizing save progress in the flow proof. The state model needs clearer before/after separation.

Missing flow coverage:
- `design-089` uses notices for many actions. Save, route selection, filter selection, and destructive actions do not consistently mutate the ledger or saved rows.
- `design-091` has many drawer templates, but several injected actions are still static buttons with result copy rather than completed flows.
- Both designs keep logs mostly empty and editors mostly static.
- `design-091` uses many invented Blueprint catalog names while claiming a 43-item catalog.

Future direction:
- Keep `design-089`'s reset/reload hierarchy as a pattern for all settings surfaces.
- Treat `design-091` as a prototype candidate only after registry and validation are fixed.
- If manager-first continues, use the narrow preview only for specialized authoring/debugging modes and keep a clearer path back to the full live site.

## Cross-Swarm Findings

1. Feature naming is no longer the hard problem.
   The swarm can name the current Playground surface. Future work should spend less effort adding every label and more effort making fewer existing flows complete.

2. The best designs now mutate state.
   `design-074`, `design-077`, `design-082`, and parts of `design-091` are stronger because actions change status, labels, selected rows, progress, or result panels. That is the right direction.

3. Real catalog fidelity still matters.
   A 43-entry claim should mean either a real all-entry catalog or an explicit representative subset. Invented names weaken fidelity, even if the interaction is polished.

4. The live shell must stay protected.
   Blueprint-first, command-first, library-first, settings-first, and manager-first modes can all become dashboards about Playground. Persistent path, refresh, save state, Homepage, WP Admin, current site identity, and visible preview need to remain obvious.

5. Destructive operations are still the highest-risk gap.
   Reset, delete, ZIP import, Blueprint run over current, and start-new-over-unsaved need consistent confirm, cancel, progress where applicable, and visible outcome states.

6. Static editors and healthy logs are holding back high fidelity.
   File browser, Blueprint editor, and Logs should stop being decorative panels. Add dirty markers, save/apply, validation, upload result, run result, and realistic warning/error examples.

7. Mobile remains unresolved by evidence.
   Many designs include responsive CSS, but dense grids, sticky rails, table rows, chip bars, and horizontal scrolling remain common. No dense concept should advance without screenshot and overflow verification after the Chromium dependency is fixed.

8. Integration hygiene matters.
   `design-091` being present in `designs/` but absent from `data/designs.json` creates an audit/gallery mismatch. Future worker integration should validate, update the registry, and rebuild the gallery before a design counts as completed.

## Carry Forward

Carry forward strongly:
- `design-077` for full Blueprint catalog mechanics, document-style state summaries, and save/project-status mutation.
- `design-074` for Blueprint market flow-state mutation, especially run, save, rename, and selected-result feedback.
- `design-082` for saved/local/temporary library modeling and modal rename/delete treatment.
- `design-086` for searchable command taxonomy and route-specific inspector content.
- `design-089` for settings reset versus stored Save & Reload clarity.

Use selectively:
- `design-080` for beginner onboarding and destructive-action explanation.
- `design-081` for a focused start-new launch packet.
- `design-079` for expert accelerators and compact command bar patterns.
- `design-085` for browser chrome continuity.
- `design-091` for Site Manager drawer breadth only after registry and validation issues are fixed.

Retire or consolidate:
- New generic workbenches that only rearrange the same checklist.
- Gallery surfaces that claim 43 entries with a tiny or invented catalog.
- Static code/log/database panels without real state.
- Destructive actions that warn but do not offer cancel/confirm/result.
- Dense table, grid, or sticky-rail concepts that cannot prove mobile behavior.

## Highest-Priority Guidance

1. Finish one save flow end to end.
   Start unsaved, choose browser or local directory, show picker/permission where relevant, show progress, finish, update shell identity, insert or update saved row, show slug or mounted directory, and switch reset behavior to Save & Reload where applicable.

2. Finish one destructive flow end to end.
   Delete, reset, ZIP import over current, or Blueprint run over current should include consequence, cancel, confirm, progress where relevant, and final mutation.

3. Make editors credible.
   File and Blueprint areas need selected metadata, dirty markers, save/apply, upload/browse result, validation, and run/download feedback.

4. Use real Blueprint data.
   If a design claims the current 43-entry gallery, use captured names or clearly label the list as representative.

5. Keep launch routes distinct.
   WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, ZIP import, and Vanilla WordPress should not collapse into a generic "source" form.

6. Fix validation and mobile evidence before convergence.
   Resolve `design-091` integration issues, then run real desktop/mobile screenshots and overflow checks for the strongest candidates: `design-073`, `design-074`, `design-077`, `design-082`, `design-086`, and `design-089`.

Round 084 shows the swarm is moving beyond shallow restyles. The next useful work is convergence around stateful current-product behavior: saved identity, destructive consequences, real catalog data, editor credibility, and responsive proof.
