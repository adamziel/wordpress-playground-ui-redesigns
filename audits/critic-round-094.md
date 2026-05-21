# Critic Audit - Round 094

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed design folders under `designs/`: 96 folders, `design-001` through `design-098` with numbering gaps
- existing audits `audits/critic-round-020.md`, `audits/critic-round-032.md`, `audits/critic-round-042.md`, `audits/critic-round-052.md`, `audits/critic-round-063.md`, `audits/critic-round-074.md`, and `audits/critic-round-084.md`

Method:
- Used prior audits as the continuity baseline for earlier designs, especially `design-001` through `design-082`, `design-085`, `design-086`, and `design-089`.
- Performed focused manifest, HTML, CSS, and JavaScript review for newly visible or newly integrated designs: `design-083`, `design-084`, `design-087`, `design-088`, `design-090`, `design-091`, `design-092`, `design-093`, `design-094`, `design-095`, `design-096`, `design-097`, and `design-098`.
- Checked registry hygiene between `data/designs.json` and `designs/`; the registry and folders now match.
- Ran `node scripts/validate-design.mjs` across every completed design folder. All 96 completed designs validated.
- Attempted a Playwright render pass, but Chromium still cannot launch because `libglib-2.0.so.0` is missing. Mobile and visual-risk notes are therefore based on source/CSS inspection rather than screenshots.
- No design files were edited.

## Overall Verdict

The swarm now has strong checklist-level preservation of the current WordPress Playground feature surface. Across the completed set, the captured shell controls, six start routes, save destinations, saved Playground management, Site Manager tabs, file and Blueprint tools, database tools, logs, GitHub export, ZIP import/export, and Blueprint gallery are nearly always present.

The newest work also improves process hygiene. The prior `design-091` integration gap has been resolved: `design-091` is now registered and validates. Newer designs through `design-098` validate as completed entries, so the main issue is no longer broken integration.

The quality problem remains flow depth. Many entries are now highly competent inventories of Playground behavior, but still stop before the point where usability can be trusted. A high-fidelity redesign cannot merely show "Save", "Delete", "Import .zip", "Run Blueprint", and "Edit file" labels. It needs to make current Playground consequences visible: destination selection, picker state, progress, completion, saved identity, changed reset/reload behavior, destructive confirmation, row removal, selected file state, editor dirty state, Blueprint validation, and log/error outcomes.

The strongest newer work is where designers connect feature breadth to a coherent operating model:
- `design-084` turns Site Manager plus command search into a credible workshop IDE.
- `design-094` gives Blueprint discovery a polished market surface while still preserving adjacent launch, save, and manager flows.
- `design-097` is one of the better document-style support workflows because route selection, save state, rename, reset, Blueprint run, and ZIP import all update visible text.
- `design-098` is the clearest newest multi-Playground tab model.

The weakest direction is still shallow convergence: dense ledgers, cards, or tabs that rename the same current-product checklist without resolving hard states.

## Feature Preservation

Strong preservation:
- Start routes remain visible: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- GitHub import copy is generally better than earlier rounds. Most newer designs preserve the account-connection requirement, public plugin/theme/wp-content import scope, and token-not-stored caveat.
- Save coverage is broad: browser storage, local directory, temporary loss warnings, and progress copy such as `Saving 3028 / 3751 files`.
- Saved and unsaved Playgrounds are represented together, usually with rename/delete actions and created/storage metadata.
- Shell controls remain visible in most designs: path input, refresh, Save, Saved Playgrounds, settings, Homepage, and WP Admin.
- Site Manager breadth is consistently preserved: Settings, File browser, Blueprint, Database, and Logs.
- Database fidelity remains high: MySQL emulation backed by SQLite, `.ht.sqlite` path, size, `database.sqlite`, Adminer, and phpMyAdmin are consistently represented.

Weak preservation by depth:
- Local-directory save is still mostly a promise. Newer designs say "choose directory" or show a selected folder, but rarely model denied permission, cancelled picker, reconnect, mounted folder identity, or how local directory persistence changes future reloads.
- Save completion often updates one or two labels, but not every dependent object: shell title, current URL slug, selected saved row, reset/reload action, saved list, and active status.
- Delete still usually warns without completing. `design-097` changes row styling and `design-094` reveals a warning, but most designs do not show confirm/cancel/final removal and the resulting active-site state.
- ZIP import is still under-modeled. The current Playground opens a native chooser; high-fidelity redesigns should show no file, selected file, validation/replacement warning, cancel, import progress, and resulting imported site state.
- File and Blueprint editors remain mostly static `pre` blocks. They preserve the existence of editing but not selected-file metadata, dirty state, save/apply, upload result, validation, or run result.
- Logs are still too clean. Even diagnostics-first designs mostly say "No problems so far"; only a few include realistic notices, warnings, or recovery context.
- Blueprint gallery fidelity is uneven. Several designs honestly say they show representative cards from the 43-entry catalog. Others show "All 43" while rendering a small or partly invented subset.

## Newly Visible Pattern Notes

### Blueprint-First Catalogs: `design-083`, `design-094`

Strengths:
- `design-083` keeps Blueprint search, category filters, URL running, selected Blueprint detail, current `blueprint.json`, save destinations, and Site Manager tools in a coherent tabbed workspace.
- `design-094` is the most polished newer Blueprint market. The image-rich catalog, group chips, selected Blueprint summary, command/search overlay, run result, save progress, saved identity, rename toggle, delete warning, and transfer area feel more product-like than most gallery-first entries.
- Both preserve adjacent non-Blueprint routes, so Blueprint focus does not completely erase PR, GitHub, ZIP, vanilla, saved-site, and Site Manager flows.

Usability risks:
- Blueprint-first screens can still demote the live WordPress site. A user arriving to open `/wp-admin/`, preview a PR, or download a database may have to parse a catalog before recognizing the active site.
- `design-083` uses letter-style shell buttons such as `R` and `S`, which weakens discoverability and accessibility compared with labeled or recognizable icon controls.
- `design-094` improves visual polish, but its market imagery is representational. If a future candidate uses real image cards, those images must help identify actual Blueprint output rather than decorate the catalog.

Missing flow coverage:
- Neither design completes the full "select Blueprint, run it, replace or create site, then show resulting active site" sequence.
- ZIP import and GitHub import remain shallow after the initial controls.
- Blueprint editors do not show JSON validation, dirty state, save/apply, or failed run output.
- `design-083` claims dense 43-entry coverage but mostly renders a representative visible set plus index text.

Future direction:
- Carry forward `design-094`'s catalog polish and state feedback, but connect run/save/import actions to final visible mutations.
- Be explicit when a catalog is representative versus truly all 43 current entries.
- Keep path, refresh, save state, Homepage, WP Admin, and current site identity prominent on Blueprint-first screens.

### IDE and Site Manager Takeovers: `design-084`, `design-091`

Strengths:
- `design-084` is one of the better Site Manager-first concepts because the first viewport gives real weight to files, Blueprint JSON, database, logs, settings, preview, and command search.
- `design-084` has meaningful state changes: save progress advances, the status button changes from unsaved to saved, storage copy changes for local versus browser, rename updates the visible saved name, and catalog search/filtering is wired.
- `design-091` is now registered and validates. Its manager-first drawer model remains broad: launch, save, local directory, rename/delete, settings, files, Blueprint, database, logs, gallery, and transfers are all covered.

Usability risks:
- Manager-first designs are strong specialized modes, but risky defaults. Playground's central value is still a running WordPress site, not a file manager with a small preview attached.
- The command/search overlay in `design-084` helps discovery, but can also become a dumping ground if every command opens a static description.
- Narrow previews work for file/database work but are weak for users verifying front-end output, admin flows, or theme demos.

Missing flow coverage:
- File editing remains static. There is no credible dirty state, save action, upload result, or conflict/error surface.
- `design-084` delete copy says the delete is confirmed, but the row is not removed from the saved list.
- GitHub export/import never reaches connected account, repository selection, push/import progress, or failure states.

Future direction:
- Treat Site Manager-first as an advanced mode or task-specific layout, not the universal shell.
- Keep `design-084`'s command taxonomy, but make command execution mutate the current project, not just the inspector copy.
- Add one real editor lifecycle: select file, edit, dirty marker, save, result or validation error.

### Support Reproduction Boards and Dossiers: `design-087`, `design-097`

Strengths:
- Both designs choose a real user model: support engineers building a reproducible case.
- `design-087` gives a clear single-column task board with route selection, save destination selection, timeline events, Blueprint filtering, export actions, and visible consequence copy.
- `design-097` is stronger and more stateful. Route selection updates the input and result; saving updates header status, progress, saved row name/storage, and save result; rename updates document and saved-row labels; Blueprint run and ZIP import write visible outcomes.
- The document/dossier framing is a useful alternative to generic workbenches for support workflows.

Usability risks:
- Long single-column documents can become slow for repeat users. Important actions may be far apart even when the sticky shell remains visible.
- `design-097` uses compact letter buttons for Saved and Manager in the top shell, which is a step backward for clarity.
- Both risk becoming explanatory documents instead of fast operational tools if every section is treated as a clause or ticket.

Missing flow coverage:
- Delete is staged or described, but not completed with confirmation/cancel/removal.
- Save-to-local still jumps from selection to completed copy without picker denial or reconnect state.
- ZIP import says the native chooser opens, but does not model selected archive validation or final imported site state.
- Logs are still mostly healthy; support reproduction work needs at least one realistic problem state.

Future direction:
- Use `design-097`'s stateful document updates as a benchmark for future document-style designs.
- Add a compact "case status" summary that reflects completed actions: route, storage, active path, last destructive action, export artifact.
- Finish one destructive support flow end to end.

### Mobile-First Fleet Shell: `design-088`

Strengths:
- `design-088` is a serious mobile-first attempt. It uses bottom navigation, stacked touch panels, saved fleet management, launch cards, Site Manager tabs, Blueprint cards, save destinations, and transfer warnings.
- It preserves the core feature surface without relying on a desktop-only three-pane grid.
- The CSS includes mobile-first constraints, fixed bottom navigation, and larger touch regions.

Usability risks:
- A five-item bottom nav plus dense content can still bury secondary actions such as database download, Blueprint bundle download, and GitHub export.
- Saved-fleet-first is efficient for power users, but beginners may not immediately understand how to simply start a fresh WordPress site.
- The black/white/cyan technical palette is legible but increasingly repetitive across the swarm and can feel more like a debug console than WordPress Playground.

Missing flow coverage:
- Most actions change selected states or copy only; save does not fully update every saved/current-site object.
- Blueprint filters and launch cards are present but not deep enough to prove mobile task switching after a long scroll.
- No screenshot evidence exists because Chromium cannot launch in this environment.

Future direction:
- Keep the bottom navigation model as the mobile reference pattern, but prove it with screenshots and overflow checks.
- Ensure the first mobile viewport has a clear "start fresh", current path, save state, and WP Admin/Homepage route.
- Add final-state mutations for save, delete, and import on mobile, not just desktop.

### Portability and Transfer Ledgers: `design-090`

Strengths:
- `design-090` gives import/export work the focus it usually lacks. Browser save, local directory save, GitHub export, ZIP import, ZIP download, Blueprint bundle, and database download are treated as related transfer actions.
- The table-led saved Playground model is appropriate for users managing many portable artifacts.
- Route-specific launch forms and Site Manager breadth are preserved.

Usability risks:
- Transfer-first can make Playground feel like an artifact manager before it feels like a live site.
- Tables with horizontal scrolling are practical on desktop but remain risky on mobile without rendered evidence.
- Portability actions are high consequence; if the UI looks like a ledger of rows and buttons, users may underread destructive import/reset outcomes.

Missing flow coverage:
- Transfer actions are mostly static. Export to GitHub does not reach repository/authenticated states; ZIP import does not reach selected file/progress/result; download does not show generated artifact feedback beyond labels.
- Browser versus local-directory save is represented but not operationally distinct enough after completion.
- Delete and overwrite flows do not have enough confirmation depth.

Future direction:
- Keep the transfer taxonomy, but add status columns for source, destination, permission/authentication, progress, and last result.
- Make import-over-current visually different from safe export/download actions.
- Tie transfer results back to the active shell identity and saved list.

### Guided Runbooks: `design-092`

Strengths:
- `design-092` is a solid onboarding/runbook surface. It walks through current capabilities in sequence without dropping the live site and includes route-specific inputs, save consequences, manager tabs, Blueprint catalog, transfer actions, and mobile bottom navigation.
- It preserves destructive reset versus saved reload copy better than many generic workbenches.
- The progress/checklist pattern is helpful for first-time plugin developers.

Usability risks:
- The checklist can over-linearize Playground. Repeat users should not have to step through a runbook to preview a PR, open files, download the database, or export a ZIP.
- A runbook tends to add explanatory text where stronger hierarchy and direct controls would be faster.
- Mobile bottom navigation helps, but the full workflow is still dense and long.

Missing flow coverage:
- Route changes swap fields and copy, but do not start and complete a current-site transition.
- Save progress and saved identity are described more than fully propagated through all dependent UI.
- File/Blueprint editing and log/error states remain static.

Future direction:
- Treat the runbook as an onboarding mode or first-run layer that can collapse into a faster operational shell.
- Make checklist progress reflect completed UI mutations, not section visits.
- Finish the browser-save path end to end, including saved row insertion/update and reset action change.

### Admin Ledgers: `design-093`

Strengths:
- `design-093` is a competent WordPress-admin-like dashboard. Dense tables, tabbed workspace, compact source forms, saved-site rows, and a detail panel fit repeat documentation-demo preparation.
- It preserves route distinctions, browser/local save destinations, reset/reload consequences, database tools, logs, Blueprint catalog, and transfer actions.
- The selected detail panel is a good place to show constraints without forcing modals.

Usability risks:
- The high-contrast black/white/cyan styling is now a common swarm default and can read as debug-tool branding rather than Playground product direction.
- Table density helps power users but may be intimidating for first-time or workshop users.
- Source forms and saved rows risk feeling like admin data entry rather than an embedded browser-hosted WordPress workflow.

Missing flow coverage:
- Detail panel actions are mostly static HTML. Applying rename, delete, save, ZIP import, or PR preview does not mutate the ledger.
- Catalog says it is a dense 43-entry frame, but visible interaction is limited.
- Logs include empty/error wording but not a realistic problem investigation path.

Future direction:
- Use ledger rows for saved-site management, not as the entire product shell.
- Make row actions produce visible row state changes: pending, complete, failed, removed, active.
- Preserve the detail panel, but wire it to selected rows and current-site state.

### Diagnostics Run Monitor: `design-095`

Strengths:
- `design-095` makes runtime health, logs, database state, save progress, and risk notices visible before users change the site. That is a useful lens for learners and workshop support.
- It preserves start routes, save destinations, saved management, manager tabs, Blueprint gallery, exports, ZIP import, database tools, and shell navigation.
- It is honest about showing 12 representative Blueprint cards from the 43-entry catalog.

Usability risks:
- Diagnostics-first can create false confidence if the logs are clean and health panels look authoritative while no real diagnostics are connected.
- The first viewport explains the run more than it enables common direct actions.
- The rail plus long document sections may become navigation-heavy on small screens.

Missing flow coverage:
- The JavaScript only switches manager tabs and active rail links. Most visible "results" are static.
- Save, rename, delete, export, import, and Blueprint run are not stateful.
- Logs show almost entirely healthy empty states despite the diagnostics premise.

Future direction:
- If diagnostics are primary, include one realistic warning/error and a recovery path.
- Make "Save now", "Import zip", and "Run Blueprint" update the monitor timeline and active site state.
- Keep diagnostics as a mode for support/learning, not the default for all users.

### Review Launcher: `design-096`

Strengths:
- `design-096` is a focused core-contributor launcher. It separates WordPress PR, Gutenberg PR/branch, GitHub, Blueprint URL, ZIP, and vanilla starts into distinct route cards and drawer templates.
- It preserves the GitHub token caveat, ZIP replacement warning, browser/local save distinction, saved-site rows, Site Manager, database, logs, Blueprint catalog, and transfer actions.
- The "proof sequence" is a useful compact summary of route, save, saved identity, reload, and export.

Usability risks:
- The route cards and contextual drawer are clear, but most drawer actions remain static. The design looks more executable than it is.
- The right preview column is helpful, but the layout has multiple dense columns with potential narrow-width pressure.
- The current-site status starts from a saved review identity, which can blur the before/after temporary-save transition.

Missing flow coverage:
- Save progress is shown as a static 81% bar in several places rather than a transition that completes and updates rows.
- Rename/delete, settings reset/reload, Blueprint run, GitHub import/export, and ZIP import do not complete.
- Blueprint catalog shows 10 of 43 entries and no real filtering script.

Future direction:
- Keep the separated route model; it is one of the better patterns for PR review.
- Make the proof sequence executable: each step should update when the user runs the corresponding action.
- Add current-site state before and after a Gutenberg branch launch so the review flow is not just a static success story.

### Tab Matrix: `design-098`

Strengths:
- `design-098` is the clearest newest multi-Playground tab model. It represents unsaved, browser-saved, local-directory, and Blueprint-backed Playgrounds as open project tabs.
- The within-project tabs map well to Site Manager: Site, Files, Blueprints, Database, Logs, and Settings.
- It keeps launch, save, management, preview, editor, catalog, database, and transfer surfaces visible without becoming another simple left/center/right workbench.

Usability risks:
- Multiple tab layers can become cognitively expensive: project tabs, mode tabs, dock panels, right dock, and preview controls all compete.
- It risks turning Playground into a project IDE where the live WordPress browser is only one pane among many.
- The design claims multi-project state but only project-tab selection is wired; lifecycle actions do not create/close/remove tabs.

Missing flow coverage:
- New project, save completion, rename, delete, reload, export, and ZIP import do not mutate the tab strip.
- Blueprint filters and catalog chips are static.
- File editing, logs, and destructive reset remain representational.

Future direction:
- Carry forward the project-tab concept only if tab lifecycle is modeled: create, save, rename, close, delete, restore active unsaved tab.
- Make saved/local/temporary tab differences affect actions, warnings, and reset/reload behavior.
- Keep the live preview larger or more task-dependent when the selected mode is Site or WP Admin verification.

## Cross-Swarm Findings

1. Feature coverage is no longer the differentiator.
   Nearly every completed design can name the current Playground capabilities. Future work should be judged on whether actions produce correct current-product consequences.

2. State mutation is the quality bar.
   `design-084`, `design-094`, and `design-097` are stronger because they update visible status, storage copy, selected routes, progress, saved names, or result text. The next step is completing those mutations across dependent UI objects.

3. "All 43 Blueprints" must be treated carefully.
   It is acceptable to show representative cards, but the UI must say so. A true 43-entry claim should use current captured names or a data-backed list, not invented catalog rows.

4. The live WordPress shell must stay legible.
   Blueprint-first, diagnostics-first, manager-first, transfer-first, document-first, and tab-matrix concepts can all become dashboards about Playground. The path input, refresh, save state, Homepage, WP Admin, current site identity, and preview need to remain obvious.

5. Destructive flows remain the highest-risk usability gap.
   Reset, delete, ZIP import, run Blueprint over current, and start-new-over-unsaved need consequence, cancel, confirm, progress where relevant, and final state.

6. Editors are still not credible enough.
   File browser and Blueprint editor panes need selected file metadata, dirty state, save/apply, validation, upload/browse result, and run/download feedback before any IDE concept can be considered high fidelity.

7. Mobile remains unproven.
   `design-088` and `design-092` make serious mobile attempts, but Chromium cannot run in this environment. Dense tables, sticky rails, horizontal chip rows, and fixed bottom navs still need screenshot and overflow verification.

8. Visual convergence is becoming repetitive.
   Many strong designs use black/white/cyan technical styling, dense tables, and sticky rails. This is coherent for support/debugging, but the swarm should avoid mistaking a console aesthetic for a product improvement.

## Carry Forward

Carry forward strongly:
- `design-084` for command-assisted Site Manager work and better save-state mutation.
- `design-094` for polished Blueprint market discovery and visible save/result feedback.
- `design-097` for document-style support flow with route, save, rename, Blueprint, and ZIP result updates.
- `design-098` for multi-Playground project tabs, provided future work models tab lifecycle.
- Earlier benchmark patterns from prior audits: `design-074`, `design-077`, `design-082`, `design-086`, and `design-089`.

Use selectively:
- `design-088` as the mobile shell reference, pending visual proof.
- `design-090` for transfer taxonomy.
- `design-092` for onboarding/runbook mode.
- `design-093` for saved-site ledger management.
- `design-095` for diagnostics mode.
- `design-096` for distinct PR/branch review route modeling.

Retire or consolidate:
- New generic three-pane workbenches that only rearrange the checklist.
- Static dashboards that label every Playground feature but do not execute any flow.
- Catalogs that imply full 43-entry fidelity without data-backed entries.
- Destructive-action warnings without confirm/cancel/final state.
- File, Blueprint, and log panes that remain decorative.

## Highest-Priority Guidance

1. Finish one save flow end to end.
   Start unsaved, choose browser or local directory, show picker/permission where relevant, show progress, finish, update shell identity, slug or folder, saved row, selected site, and reset/reload behavior.

2. Finish one destructive flow end to end.
   Delete, reset, ZIP import over current, or Blueprint run over current should include consequence, cancel, confirm, progress where applicable, and final UI mutation.

3. Make one editor real.
   File or Blueprint editing should show selected file, dirty marker, save/apply, validation, upload/browse result, and success/error state.

4. Prove the strongest layouts visually.
   Once Chromium dependencies are fixed, run desktop/mobile screenshots and overflow checks for `design-084`, `design-088`, `design-094`, `design-097`, and `design-098`, plus earlier candidates `design-074`, `design-077`, `design-082`, `design-086`, and `design-089`.

5. Reduce explanatory copy by improving hierarchy.
   Many newer designs still explain consequences in paragraphs. Keep the consequences, but move toward forms, statuses, confirmations, and results that users can act on quickly.

Round 094 shows the swarm has solved breadth and improved integration. The remaining bar is sharper: preserve the current product surface by proving real Playground workflows, not just by naming them.
