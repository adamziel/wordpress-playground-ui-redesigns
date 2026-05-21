# Critic Audit - Round 074

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed design folders under `designs/`: 76 folders, `design-001` through `design-078` with numbering gaps
- existing audits `audits/critic-round-020.md`, `audits/critic-round-032.md`, `audits/critic-round-042.md`, `audits/critic-round-052.md`, and `audits/critic-round-063.md`

Method:
- Used prior audits as the continuity baseline for `design-001` through `design-070`.
- Performed focused manifest, HTML, CSS, and JavaScript review for newly completed or newly present designs: `design-065`, `design-067`, `design-069`, `design-071`, `design-072`, `design-073`, `design-075`, `design-076`, and `design-078`.
- Ran `node scripts/validate-design.mjs` for those nine designs; all validated.
- Attempted a Playwright render/overflow pass, but Chromium still cannot launch because `libglib-2.0.so.0` is missing. Mobile and visual-risk notes below are therefore based on source/CSS review plus prior measured swarm risks, not fresh screenshots.
- No design files were edited.

## Overall Verdict

The completed set continues to preserve the current Playground feature surface at the visible-control level. Across the swarm, the existing routes and tools are represented: Vanilla WordPress, WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, ZIP import, Blueprint gallery, save to browser, save to local directory, save progress, saved-site management, URL/path navigation, refresh, Homepage, WP Admin, settings, Site Manager tabs, files, Blueprint bundle, database tools, logs, GitHub export, and ZIP download.

Round 074 raises the floor in two useful ways. First, `design-073` is the strongest new stateful admin-register prototype: action selection changes a workflow inspector, save paths have result states, delete has a confirmation state, Blueprint run has a result state, and transfer outputs have concrete result panels. Second, `design-069` and `design-072` finally render real 43-entry Blueprint catalogs from data arrays rather than relying on a badge. `design-071` renders 43 rows too, though several are invented placeholder entries rather than captured gallery names.

The swarm still has not solved the hardest part: high-fidelity completion of current flows. The best designs now describe the right consequences, but most still stop at result copy instead of mutating the actual register, tab, saved identity, editor, or preview. Local-directory save, ZIP import, GitHub export/import authentication, delete confirmation, Blueprint validation, file dirty/save state, and non-empty logs remain thin.

## Feature Preservation

Strong preservation:
- The six start routes remain visible and are increasingly route-specific rather than collapsed into one generic input.
- Save copy now more consistently distinguishes browser storage from local directory storage.
- Save progress appears frequently in the captured `3028 / 3751 files` pattern, and several designs show saved slugs or saved identity after the copy.
- Saved and unsaved Playgrounds are visible together in browser tabs, tables, ledgers, or lesson lists.
- The live Playground shell is usually protected with path input, refresh, Homepage, WP Admin, Save, Saved/Library, and Site Manager controls.
- Site Manager coverage remains broad: Settings, Files, Blueprint, Database, and Logs are present across the new work.
- Database details remain accurately preserved: SQLite-backed MySQL emulation, `.ht.sqlite` path, size, `database.sqlite`, Adminer, and phpMyAdmin.
- GitHub import copy often preserves the important token caveat: account connection is required and the access token is not stored.

Weak preservation by flow depth:
- Local-directory save still rarely behaves like a distinct flow. Most designs show "choose folder" or "folder selected" copy, but not permission denied/cancelled, selected-directory persistence, or reconnect/reload behavior as a working state.
- Save progress often coexists with completed-state copy instead of transitioning from unsaved to copying to saved list insertion.
- Delete is improved in `design-073`, but many designs still place Delete next to benign row actions or show only warning copy without a confirm/cancel/result state.
- ZIP import remains under-modeled. The current product opens a native file chooser; high-fidelity redesigns should show no file selected, selected archive, validation, replace-current consequence, cancel, and imported result.
- File and Blueprint editors still look like static code viewers. Existing Playground capabilities imply selected file metadata, editable content, dirty marker, save/apply, upload/browse result, Blueprint validation, and run/download feedback.
- Logs still skew healthy. Diagnostics-led designs need at least one realistic warning/error example to justify a diagnostics-first IA.
- Blueprint gallery fidelity is split: `design-069` and `design-072` render real dense catalogs, `design-073` and `design-078` are honest about showing 12 of 43, while `design-075` still uses a small card subset with a "43 total" label.

## Newly Visible Pattern Notes

### Browser and Project-Tab Shells: `design-065`, `design-078`

Strengths:
- `design-065` keeps the active WordPress site central with tabs, address bar, refresh, save state, Library, Site Manager, Settings, and bottom navigation.
- `design-065` has strong route-specific launch drawers and a well-preserved Site Manager drawer, including file, Blueprint, database, logs, reset/reload, export, and ZIP actions.
- `design-078` is a better project-tab variant than many earlier browser shells because it maps tabs to meaningful project states: unsaved, saved, and PR-backed.
- `design-078` centers Blueprint authoring while still preserving launch routes, saved management, Site, Files, Database, Logs, Settings, transfers, path navigation, WP Admin, and Homepage.

Usability risks:
- Tabs imply lifecycle behavior that is still not fully modeled: close warnings, per-tab path/history, save state per tab, unsaved replacement, and mapping a tab to Saved Playgrounds.
- `design-065` puts destructive Library row actions in dense inline clusters: Open/Rename/Delete, Save/Discard, Reconnect/Rename/Delete. Risk separation is not strong enough.
- `design-078` uses compact icon-like global buttons (`S`, `M`, `Set`) and a dense left rail; discoverability may suffer for users who are not already fluent in the prototype.
- Both designs have CSS with horizontal overflow zones, fixed sidebars, and table/list structures. Without screenshots, they should not be advanced as mobile-safe.

Missing flow coverage:
- Neither prototype completes tab save into an actual tab label change, saved-list mutation, slugged URL, and changed reset/reload behavior.
- ZIP and GitHub flows are route-specific but do not reach selected-file, authenticated account, repository, validation, or completed import/export states.
- Blueprint and file editors remain static code blocks without dirty/save/validation states.

Future direction:
- Carry forward the browser/project-tab metaphor only if tab lifecycle becomes the prototype's core contract.
- Guard Delete, Discard, Reset, ZIP import, and Blueprint run with explicit confirm/cancel/result states.
- Keep full Site Manager access, but make per-tab saved identity and current path more concrete than decorative tab labels.

### Task Board and Lesson Path: `design-067`, `design-072`

Strengths:
- `design-067` is one of the clearer task-board attempts. Create, Save, Manage, Inspect, Export, and Debug lanes map cleanly to the captured Playground surface without inventing new capabilities.
- `design-067` preserves route-specific start panels, save/local-directory panels, saved list, rename/delete, settings/reset, files, Blueprint, database, import/export, logs, and path controls in a selected-result pane.
- `design-072` is the strongest beginner checklist since the earlier onboarding concepts. It keeps the live preview visible and turns launch, save, library, manager, Blueprint gallery, export, and result into inline panels instead of modal fragments.
- `design-072` renders a real 43-entry Blueprint data set with category filters, search, result count, selected detail, tags, and run/inspect actions.

Usability risks:
- Boards and lesson paths can over-linearize Playground. Many users arrive to preview a PR, open WP Admin, inspect files, download the database, or export a ZIP directly.
- `design-067` has a six-lane board and sticky result rail; source CSS suggests horizontal scrolling and dense grid behavior that needs real viewport proof.
- `design-072` may become a long training document. It helps first-time learners, but it risks making the product feel like a course before it feels like a live WordPress shell.
- Both designs still present high-risk operations near routine actions unless the user enters the right selected panel.

Missing flow coverage:
- Step or card completion rarely changes the global state. Save result copy does not insert an actual saved row or alter the shell identity.
- Delete in `design-072` is a warning panel, not a complete confirmation and removal sequence.
- File and Blueprint editors are still static; no upload result, dirty marker, validation, or run result is shown.

Future direction:
- Use the lesson path as onboarding mode, not the default shell for repeat users.
- Keep `design-067`'s action/result routing, but reduce equal-weight lane noise and make one end-to-end flow mutate visible state.
- `design-072`'s real catalog implementation should be reused by future Blueprint surfaces.

### Runtime-First Studios: `design-069`

Strengths:
- `design-069` is the best new settings-first design. It clearly separates unsaved `Apply Settings & Reset Playground` from stored `Save & Reload`.
- It keeps WordPress version, PHP version, language, older versions, network access, and multisite in a single first decision surface.
- The contextual drawer preserves launch routes, save/library, Site Manager, gallery, and portability without losing the browser path bar and live preview.
- Its Blueprint catalog is credible: all 43 entries are rendered from a data array rather than represented as a small card sample.

Usability risks:
- Settings-first is still a specialized default. Plugin compatibility users benefit, but quick-start, PR-preview, saved-site, and WP Admin users may experience it as a gate before the product.
- The top navigation plus context drawer makes the live WordPress site secondary to configuration. That is acceptable for runtime work but risky as a general landing surface.
- Delete appears as text/actions in a table with consequence copy, not a modeled confirmation flow.

Missing flow coverage:
- Save destination switching updates copy and progress, but does not update the library rows or shell identity.
- Local-directory save jumps to "folder selected" without showing picker, permission, cancel, or reconnect states.
- GitHub export/import and ZIP import remain informational cards.
- Logs remain empty/healthy.

Future direction:
- Carry forward reset/reload hierarchy and the rendered 43-entry catalog.
- Make runtime-first a contextual mode entered from Settings, not necessarily the default first viewport.
- Add a full local-directory branch and an actual saved-library mutation after saving.

### Site Manager Takeover and Diagnostics Ledgers: `design-071`, `design-075`

Strengths:
- `design-071` is a coherent Site Manager-first workshop surface. It keeps the active preview visible while making Settings, Files, Blueprint, Database, Logs, gallery, save, saved identity, and transfer consequences accessible.
- `design-071` has a useful flow strip: launch source, save destination, saved identity, reset/export/import.
- `design-075` is the strongest new diagnostics-led ledger. It makes environment facts, database facts, logs, saved identity, current path, and preview visible before moving into start/save/manager/catalog sections.
- `design-075` does better than most at representing a completed browser save in the event ledger: copied files, slug, and saved identity are visible.

Usability risks:
- Site Manager-first and diagnostics-first both demote the simplest current use: a live WordPress site with direct WP Admin/Homepage navigation.
- `design-071` uses a narrow preview pane; for non-workshop users, the product may feel like a manager about WordPress rather than WordPress in Playground.
- `design-075` starts from a saved/healthy state even while carrying unsaved-change warnings. The state model is legible but slightly contradictory unless the design clarifies saved site versus unsaved changes.
- `design-075` still uses a small Blueprint card subset while claiming a 43-item catalog.

Missing flow coverage:
- `design-071` renders 43 catalog rows, but many names appear to be invented placeholders rather than the captured gallery entries; this weakens fidelity.
- `design-075` shows warnings and events, but not actionable recovery from a real log error.
- Neither design gives file/Blueprint editing dirty states or validation.
- ZIP import, GitHub export, and database download do not complete into visible result states.

Future direction:
- Keep `design-071` as a workshop or support mode, not a universal default.
- Carry forward `design-075`'s ledger event model, but include at least one realistic warning/error with severity, source, and recovery action.
- Use real captured Blueprint names when claiming all 43 entries.

### Admin Register and Command Inspector: `design-073`

Strengths:
- `design-073` is the strongest new design in this pass. The admin register is a credible WordPress-adjacent IA for repeat core contributors.
- The first viewport makes temporary, browser-saved, local-directory, and PR-backed Playgrounds comparable without hiding the active WordPress path controls.
- Its workflow inspector is materially deeper than most prototypes: save browser, save local, save result, rename, delete, reset, save/reload, launch routes, import warning, Blueprint detail, Blueprint run result, file tools, database, logs, export, ZIP download, copy Blueprint, and bundle download are all separate states.
- Delete has a real confirmation state with cancel. Save paths have result states. Blueprint run has a completion state. These are concrete improvements over static labels.

Usability risks:
- Dense tables are efficient for repeat users but weak for first-time discovery. Horizontal table scrolling remains a likely mobile compromise because the CSS relies on `.table-wrap { overflow-x: auto; }`.
- Row action density is high. Save browser, Save local, Reset, Rename, Delete, Export, Files, Logs, Database, and branch changes compete inside table rows.
- The inspector changes state, but the underlying table does not actually mutate after save, rename, delete, Blueprint run, or export. The flow is stateful in the inspector only.

Missing flow coverage:
- Local-directory result is a confirmation copy state, not a real selected-directory/reconnect branch.
- ZIP import has a native-picker step and confirmation copy, but no selected-file validation or imported row/result mutation.
- Editor dirty/save behavior is still absent.
- Logs remain empty/healthy.

Future direction:
- Carry forward the register plus workflow inspector as a high-priority convergence candidate.
- Make the table mutate from inspector actions: saved row inserted, renamed row updated, deleted row removed, ZIP-import row created, exported state marked complete.
- Convert mobile from horizontally scrolled tables to row cards with grouped safe/destructive actions.

### Developer Run Bench: `design-076`

Strengths:
- `design-076` gives launch routes strong first-class treatment, especially WordPress PR, Gutenberg branch, GitHub, Blueprint URL, ZIP, and Vanilla WordPress.
- The tabbed workspace keeps Run Target, Site Manager, Blueprint Catalog, Saved Sites, and Import/Export easy to scan.
- Save, manager, catalog, and transfer outputs are all present with consequences and current-site warnings.

Usability risks:
- It is visually and structurally close to several previous dark diagnostics/light-card workbenches. It is competent, but less differentiated than `design-073` or `design-072`.
- The catalog says 43 indexed starts but shows 12 rows with some non-captured names. That is acceptable if honest, but weaker than rendering the real data.
- Saved-site Delete is still adjacent to Rename/Open, and the confirmation is copy-only.

Missing flow coverage:
- Save progress is static and does not update the saved-sites tab.
- File and Blueprint editors lack dirty/save/validation states.
- Search/filter behavior in the catalog is not wired.
- Import/export actions do not produce completion states.

Future direction:
- Fold the stronger parts of `design-076` into the admin-register or project-tab direction rather than continuing it as a separate wrapper.
- Replace representative catalog rows with the `design-072`/`design-069` rendered catalog data.
- Add action result mutation before adding any more workbench structure.

## Cross-Swarm Findings

1. Breadth is no longer the issue.
   The completed swarm can name almost every current Playground capability. Future work should stop optimizing for checklist length and optimize for end-to-end flow truth.

2. The strongest convergence candidate is now register plus inspector.
   `design-073` combines the saved-library strength of earlier designs with command-inspector depth. It is the best current path for repeat users if mobile and row-action risk are addressed.

3. Real Blueprint catalogs are finally available.
   `design-069` and `design-072` prove the 43-entry gallery can be represented credibly. Future workers should reuse this approach instead of "View all 43" badges or invented placeholder lists.

4. The live WordPress shell still needs protection.
   Runtime-first, Site Manager-first, diagnostics-first, Blueprint-first, and lesson-first designs can all drift into dashboards about Playground. Persistent path, refresh, save state, Homepage, WP Admin, active preview, and current site identity must remain obvious.

5. Destructive operations are the highest-risk gap.
   Reset, delete, ZIP import, Blueprint run over current, and starting a new route over an unsaved site need consistent confirm/cancel/progress/result handling.

6. Visual fidelity is high, but operational fidelity is uneven.
   Polished cards, dark shells, tables, and ledgers do not compensate for static editors, static logs, fake progress, unmutated saved rows, or copy-only results.

7. Mobile evidence is still missing.
   Many new designs have responsive CSS, but dense tables, sticky sidebars, horizontal chip rows, tab bars, and overflow containers remain common. Chromium could not run, so no dense concept should advance without screenshot and overflow verification.

## Carry Forward

Carry forward strongly:
- `design-073` for the admin register plus workflow inspector, after adding actual table mutation and mobile row-card behavior.
- `design-072` for beginner lesson sequencing and its real 43-entry Blueprint catalog.
- `design-069` for reset/reload clarity and rendered Blueprint catalog data.
- `design-075` for diagnostics ledger/event modeling, after adding real error states.
- `design-078` for project-tab plus Blueprint-author workspace, if tab lifecycle is made concrete.

Use selectively:
- `design-065` for browser chrome and side-drawer continuity.
- `design-067` for task-board action/result routing.
- `design-071` for workshop Site Manager takeover.
- `design-076` for route-specific launch bench details.

Retire or consolidate:
- New generic all-feature workbenches that do not add state transitions.
- "43 catalog" claims backed only by a handful of cards.
- Static file/Blueprint editor panels without dirty/save/validation states.
- Diagnostics-first screens that show only healthy logs.
- Dense table or tab designs that rely on horizontal scrolling as the main mobile answer.

## Highest-Priority Guidance

1. Make one saved flow truly complete.
   Start unsaved, choose browser or local directory, show picker/permission where relevant, show progress, finish, update shell identity, insert/update saved row, show slug, and switch reset behavior to Save & Reload.

2. Finish destructive flows.
   Reset, delete, ZIP import over current, Blueprint run over current, and start-new-over-unsaved need confirmation, cancel, progress where applicable, and visible result.

3. Make editors credible.
   File and Blueprint tools need selected file metadata, editable content, dirty markers, save/apply actions, upload/browse results, Blueprint validation, and run/download feedback.

4. Reuse real catalog data.
   Future Blueprint work should render real captured entries or clearly label a representative subset with result count, selected detail, empty search, and category behavior.

5. Prove mobile before convergence.
   The next critic pass should run desktop and mobile screenshots once Chromium dependencies are available, with special attention to `design-073`, `design-078`, `design-065`, `design-067`, and `design-075`.

Round 074 shows better product understanding than early rounds. The strongest work is no longer shallow restyling; it is beginning to model Playground as a stateful tool. The remaining bar is to make those states affect the actual UI objects users depend on: the active shell, saved list, tabs, editor, catalog, logs, and exported artifacts.
