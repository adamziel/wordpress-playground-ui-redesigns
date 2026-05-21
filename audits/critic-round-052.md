# Critic Audit - Round 052

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed design folders under `designs/` present during this pass: `design-001` through `design-059`
- existing audits `audits/critic-round-020.md`, `audits/critic-round-032.md`, and `audits/critic-round-042.md`

Method:
- Used `critic-round-020`, `critic-round-032`, and `critic-round-042` as continuity for `design-001` through `design-047`.
- Performed focused manifest, HTML, CSS, and JavaScript review for newly completed designs `design-048` through `design-059`.
- Ran `node scripts/validate-design.mjs` for each newly reviewed design; all validated.
- Attempted a fresh Playwright render/overflow check, but Chromium could not launch in this environment because `libglib-2.0.so.0` is missing. Mobile notes below therefore combine source review with prior measured findings rather than new screenshots.
- No design files were edited.

## Overall Verdict

The swarm still preserves the current WordPress Playground feature surface at the control-label level. Across the completed set, the required creation routes, save destinations, save progress, saved and unsaved Playground management, URL/path navigation, refresh, Homepage and WP Admin shortcuts, quick settings, Site Manager tabs, file and Blueprint tools, database tools, logs, GitHub export, ZIP import/export, and Blueprint gallery are present.

The stronger news in this round is that the newer work mostly stops producing generic three-pane clones. It tests sharper wrappers:
- `design-048` and `design-058` advance mobile/workshop and project-tab shells.
- `design-049` makes runtime configuration and reset/reload behavior the primary object.
- `design-050` makes import, storage, and export routes searchable and comparable.
- `design-051` pushes the Site Manager takeover pattern toward a support-engineer workspace.
- `design-052` and `design-057` revisit checklist/document structures with better contextual drawers.
- `design-053` and `design-059` refine compact admin/expert workspaces.
- `design-054` is a more complete Blueprint marketplace/studio.
- `design-055` is the best diagnostics-first entry since `design-035`.
- `design-056` turns saved sites, temporary runs, PR previews, GitHub imports, Blueprint runs, and ZIP transfers into a single development ledger.

The recurring weakness remains flow completion. Most designs can name the current product's capabilities, but many still do not prove that users can complete the flows safely: save progress rarely lands in a saved slug and updated saved list, local-directory save rarely has a chosen-directory state, rename/delete rarely has confirmation and result state, ZIP import rarely shows selected-file and replacement consequences, Blueprint run rarely distinguishes gallery item versus URL versus current `blueprint.json`, and file editors rarely show dirty/save states.

## Feature Preservation

Strong preservation:
- All completed designs visibly cover the six start routes: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- Save coverage remains broad: browser storage, local directory, temporary-work warning, and `Saving 3028 / 3751 files` progress appear throughout.
- Saved and unsaved Playgrounds are consistently represented with open/save/rename/delete affordances.
- The live shell is usually retained: path input, refresh, Homepage, WP Admin, saved/unsaved state, and an embedded WordPress preview.
- Site Manager coverage is stable: Settings, File browser, Blueprint, Database, and Logs are present in almost every design.
- Database details continue to be unusually well preserved: SQLite-backed driver, path, size, `database.sqlite`, Adminer, and phpMyAdmin.
- GitHub import frequently preserves the captured token nuance: public plugin/theme/wp-content imports, token not stored, re-authentication after refresh.

Weak preservation by flow depth:
- "All 43 blueprints" remains more often a label than a credible catalog. `design-054` gets closest by wiring search/filter/selection and selected JSON, but most designs still render five or six representative cards.
- Source-specific launch flows are improving, but several newer designs still collapse PR, branch, GitHub repository, and Blueprint URL into one multipurpose field.
- Local-directory save is still under-modeled. A segmented option is not enough; the current flow needs a directory picker/selected destination state and a different post-save identity than browser storage.
- Save progress still functions as a static sample in most designs. Future work must show before, progress, completion, saved state, slug/addressability, and saved-list insertion.
- Destructive actions are too often adjacent to benign actions. Reset, delete, import-over-current, and run-Blueprint-again need confirmation and outcome states.
- File and Blueprint editing remain mostly static `pre` blocks. High-fidelity editor areas need selected-file metadata, dirty markers, save/apply actions, upload/browse result state, and validation/run feedback.
- Logs still skew healthy. Diagnostics concepts need at least one warning/error state to justify their information architecture.

## Newer Pattern Notes

### Mobile and Workshop Shells: `design-048`, `design-058`

Strengths:
- `design-048` is a serious mobile-first attempt rather than a desktop layout stacked into cards. The bottom navigation gives clear entry points for Run, Sites, Files, Data, and Gallery.
- `design-048` preserves the active path, refresh, save state, quick start actions, saved management, Site Manager tools, database/logs, and gallery in a thumb-reachable structure.
- `design-058` connects project tabs with within-project tabs. This is one of the more coherent ways to model multiple saved/temporary Playgrounds without making Saved Playgrounds a separate world.
- `design-058` gives the file and Blueprint areas better affordance density than many workshop concepts, including editor bars and "Save file" / run bundle controls.

Usability risks:
- Workshop framing may overfit educators. A general Playground user should not have to parse class/session language before starting a PR, importing GitHub, or opening Site Manager.
- Project tabs imply lifecycle rules: create, close, duplicate, restore, save, unsaved warning, path per tab, and mapping to Saved Playgrounds. `design-058` changes tab metadata but not enough underlying state.
- `design-058` has four project tabs with a horizontally scrollable fallback in CSS. This may work, but it should be verified because previous tab/browser concepts had mobile overflow.
- Both designs keep many features visible at once. The mobile shell is clearer than most, but still risks becoming a long operational inventory after the first viewport.

Missing flow coverage:
- No complete tab-to-saved-library transition: temporary tab saved into browser storage, slug changes, saved list updates, and reset/reload behavior changes.
- ZIP import, local directory, and GitHub connection are represented but do not complete into selected-file/account/directory states.
- Rename/delete are visible but not guarded.

Future direction:
- Carry forward the bottom-nav and project-tab ideas, but make lifecycle the core prototype: per-project source, storage, path, dirty/save state, close warning, and saved-library row.
- Keep workshop copy as a mode or persona variant, not as the universal shell.
- Verify narrow layouts with real rendering before advancing dense tab chrome.

### Runtime-First Configuration: `design-049`

Strengths:
- This is the clearest attempt to make settings understandable before they become destructive. Temporary reset and saved reload are separated in the first viewport.
- Runtime controls are complete: WordPress version, include older versions, PHP, language, network access, multisite, reset, and Save & Reload.
- Source-specific dialogs are stronger than generic launch cards. WordPress PR, Gutenberg PR/branch, GitHub import, and Blueprint URL each get their own modal content.
- Saved management distinguishes browser storage and local directory entries better than many earlier designs.

Usability risks:
- Settings-first is a strong explanation surface but a risky default. Many users arrive to start WordPress, preview a PR, or open a saved site, not to configure runtime first.
- The high-contrast black/cyan treatment supports technical clarity, but it is visually further from WordPress admin than the best admin/table concepts.
- Several actions show toast samples such as "Delete confirmation opened" rather than the confirmation itself. That is not yet high-fidelity enough for destructive flows.

Missing flow coverage:
- Save still does not transition to a saved slug or insert/update a row.
- Local-directory save explains the browser directory picker but does not show the selected directory state.
- File/Blueprint editors remain inspection panes, not editable surfaces with dirty/apply outcomes.

Future direction:
- Use this as the best source for reset/reload copy and settings hierarchy.
- Make runtime-first a contextual mode for users changing versions, not necessarily the default landing state.
- Replace toast-only confirmations with actual inline or modal confirmation/result states.

### Transfer and Command Routing: `design-050`, `design-059`

Strengths:
- `design-050` is one of the strongest command/router concepts because it treats portability as a real taxonomy: Bring in, Store, Send out, Review, and Site tools.
- Its selected-route pane is concrete: GitHub import, ZIP import/export, browser save, local directory, PR previews, Blueprint URL, Blueprint bundle, database artifacts, gallery, settings, and saved sites each have tailored copy and form fields.
- `design-059` brings expert keybar affordances to a browser-first shell. The command menus make New, Import, Save, Export, Runtime, Saved, and Manage globally reachable without replacing the live site.
- Keyboard shortcuts in `design-059` are a useful affordance for repeat users, and the live browser remains the first viewport.

Usability risks:
- Command-first UI only improves discoverability if default grouping and synonyms are excellent. The prototypes show some filtering/search, but not enough query quality for terms like "folder", "snapshot", "template", "branch", "plugin", "database", "download", or "reset".
- `design-050` centers portability so strongly that live WordPress navigation and Site Manager can feel secondary.
- `design-059` is compact and fast, but it risks looking like a generic developer keyboard UI rather than WordPress Playground. It also assumes comfort with key labels and command menus.
- In `design-059`, some menu actions are dense and close together; Save, Reset, ZIP import, and Delete need stronger separation from harmless navigation.

Missing flow coverage:
- Selected command execution does not complete. It changes the inspector or menu, but does not show post-action states.
- GitHub export/import have fields but no connection/authenticated/reauth states.
- Import `.zip` still lacks selected file, validation, and "replace current versus start new" outcome in `design-059`; `design-050` models this better but still does not complete it.
- Saved rename/delete remain exposed without confirmation/result.

Future direction:
- Carry forward `design-050`'s route taxonomy and `design-059`'s compact keybar as complementary patterns.
- Make command results scoped: current site, saved library, start new, Site Manager, transfer.
- For each command, show exact current-product flow: required input, cancel, submit, progress, completion, and state change.

### Checklist and Document Workspaces: `design-052`, `design-057`

Strengths:
- `design-052` improves the runbook pattern with a persistent active WordPress navigation row, saved inventory, preview, and contextual drawer.
- The checklist sequence maps cleanly to current product capabilities: start, save, saved management, Site Manager, and import/export.
- `design-057` is a credible documentation-writer "project dossier" that keeps setup source, runtime, saved state, library, Site Manager, and artifacts in one document.
- `design-057`'s drawer is specific: PR forms, GitHub import explanation, Blueprint URL, ZIP import, save, saved actions, settings, files, Blueprint, database, logs, preview, and exports all have tailored detail panels.

Usability risks:
- Checklist/document IA can make executable UI feel like documentation. That may suit demo preparation, but it is not obviously the default Playground experience.
- Both designs risk long-page fatigue on mobile. They have responsive CSS, but the core interaction is still lots of content plus a drawer.
- `design-052` uses a generic source form for PR number, branch, repository URL, or Blueprint URL, which weakens the current product's distinct source flows.
- `design-057` models "Rename or Delete" in one panel; delete needs a more explicit confirmation path than sitting beside rename.

Missing flow coverage:
- Checklist completion does not update global state: a saved step does not produce a saved slug and row insertion.
- Blueprint gallery is representative, not a real 43-item browsing density.
- File and Blueprint panels remain static and lack dirty/save/validation states.

Future direction:
- Keep document/checklist framing for onboarding, support handoff, and documentation workflows.
- Collapse completed steps into state summaries and keep only the active step high-density.
- Show one full end-to-end path inside the document: choose source, save, update saved library, adjust settings, export artifact.

### Admin and Register Workbenches: `design-053`

Strengths:
- `design-053` is a polished WordPress-admin-like dashboard. The saved/active table is efficient for repeat users and includes state, source, versions, storage, and actions.
- The single-column progressive panels reduce the earlier three-pane overload while still exposing creation, save, Site Manager, Blueprint gallery, and dialogs.
- It preserves many exact current-product details: temporary save warning, local-directory option, progress count, slug/addressability copy, PR/GitHub/Blueprint/ZIP starts, database driver/path/size, Adminer, phpMyAdmin, logs, and artifacts.
- The table and panel patterns are believable for theme authors who repeatedly create, inspect, and export Playgrounds.

Usability risks:
- The first table is strong for repeat management but may delay first-time users who need a clear "start WordPress now" path.
- Dense row actions put Delete near Save/Manage/Open/Rename; high-risk actions need menus or confirmations.
- Some Blueprint gallery card images reuse the same research screenshot, which raises fidelity questions if the image does not represent each Blueprint.
- The table has a CSS `min-width: 880px` inside horizontal overflow. That is acceptable for desktop but needs a true mobile row layout to avoid table-scrolling as the primary experience.

Missing flow coverage:
- Save dialog and progress do not complete into the table state.
- Import ZIP dialog mentions native chooser but does not show selected archive or replacement consequences.
- Editor panes still do not show dirty state or save/apply behavior.

Future direction:
- Carry forward the admin table as a strong Saved Playgrounds management pattern.
- Make destructive row actions guarded and visually separated.
- Add complete save/import/export state transitions in the table itself.

### Site Manager Takeover and Development Ledgers: `design-051`, `design-056`

Strengths:
- `design-051` is a credible support-engineer version of Site Manager takeover. It puts Settings, Files, Blueprint, Database, and Logs first while keeping a narrow embedded WordPress preview visible for verification.
- `design-051` improves on several earlier manager-first concepts by including real modals for Save, WordPress PR, Gutenberg PR/branch, GitHub, and Blueprint URL, plus a save progress transition that updates some visible saved-state pills.
- `design-051` includes a non-empty WordPress log warning, which is valuable because most log panels only show healthy states.
- `design-056` is a strong table-led "run ledger." It models saved sites, temporary sites, PR starts, Gutenberg branches, GitHub imports, Blueprint URL runs, ZIP imports, and gallery starts as comparable rows.
- `design-056` has one of the better selected-row inspectors. Details, preview screenshot, state chip, and contextual actions change by selected run, so the table is more than static inventory.
- `design-056` has actual dialogs for save, save-local, PR preview, GitHub import, Blueprint URL, ZIP import, rename, and delete. The delete dialog is a better guard than the toast-only delete patterns elsewhere.

Usability risks:
- `design-051` can feel like Playground has become Site Manager first and live WordPress second. That is useful for support work, but risky for a general landing surface.
- `design-051` uses a fixed three-column desktop grid and a narrow verification preview. It needs rendered mobile checks because support users may still need full route/navigation context on small screens.
- `design-056` has a table `min-width: 850px` and table-toolbar actions. The CSS adds mobile adaptations, but the core ledger likely still needs a card/list alternative rather than horizontal table work as the main narrow-screen experience.
- `design-056` is plugin-developer specific. The ledger abstraction is strong, but copy should not make PR/GitHub/plugin work feel mandatory for vanilla or Blueprint-first users.

Missing flow coverage:
- `design-051` updates state labels after save, but it still does not show a saved slug, saved-list insertion, or local-directory destination.
- `design-051` ZIP import is a toast only; there is no selected file, import validation, or replacement/start-new consequence.
- `design-056`'s inspector changes state well, but action execution usually opens/closes dialogs rather than updating the ledger row after save, import, rename, delete, or export.
- Both designs still use static file and Blueprint editors without dirty/save/validation states.

Future direction:
- Carry forward `design-051` as the support Site Manager mode, especially the narrow verification preview and non-empty log example.
- Carry forward `design-056`'s run ledger and selected inspector for power users managing many Playground runs.
- Deepen the ledger by making actions mutate the row: save temporary run, rename saved run, delete row, attach selected ZIP, connect GitHub, and mark export complete.

### Blueprint Marketplace and Studio: `design-054`

Strengths:
- `design-054` is the strongest Blueprint marketplace in the newer set. It wires category filters, search, card selection, selected preview copy, and generated `blueprint.json` text.
- The selected Blueprint, live preview, Blueprint bundle actions, manager tabs, save, saved library, and transfer mode are kept close together. This is a meaningful improvement over static "View all 43" labels.
- Adjacent launch chips preserve non-Blueprint starts: Vanilla WordPress, WordPress PR, Gutenberg PR/branch, GitHub, Blueprint URL, and ZIP.
- Dialogs for PR, Gutenberg, GitHub, Blueprint URL, settings, and save are source-specific and preserve important current-product language.

Usability risks:
- Blueprint-first remains a role-specific default. It is strong for theme/agency users, but it can demote vanilla WordPress, PR preview, saved-site management, database, and logs for general users.
- The visual card art is custom/abstract rather than actual Blueprint previews. It improves scanability but may overpromise visual specificity.
- The workbench is dense: marketplace, split preview, code, manager, save, library, transfer, and lower status band compete for attention.
- Some controls in Blueprint manager mode are terse (`New`, `Folder`, `Download`, `Run`) and should be clearer in a production UI.

Missing flow coverage:
- Search/filter works, but the gallery still renders a representative subset plus a "View all 43" card.
- Running selected gallery Blueprint, running a Blueprint URL, and running the current edited `blueprint.json` are close together but not fully separated by consequence.
- There is no Blueprint validation, dirty JSON state, or run-result state.

Future direction:
- Keep the gallery-to-selected-preview-to-Blueprint JSON continuity.
- Add selected Blueprint detail with requirements, category counts, empty search, and a clear "run this gallery item" path.
- Distinguish gallery run, URL run, and current-bundle run with separate labels and result states.

### Diagnostics and Run Ledger: `design-055`

Strengths:
- `design-055` is the clearest diagnostics-first concept in this round. Runtime, logs, database, network, storage, save progress, and embedded site status are visible before creation tools.
- It better justifies logs than most designs by showing timestamped healthy events, not only "No problems so far."
- Database and early-access copy are prominent and accurate.
- Inline panels preserve the broad Playground surface without leaving the diagnostics context.

Usability risks:
- Diagnostics-first is powerful for support and Blueprint authors, but too specialized as a default for first-time Playground users.
- It still shows a healthy run only. A diagnostics-led UI needs warning/error examples to prove prioritization, severity, filtering, and recovery behavior.
- The start panel uses one combined input for PR, branch, GitHub URL, or Blueprint URL, which blurs distinct current flows.
- The design states rename/delete but does not guard them.

Missing flow coverage:
- No modeled failure states for Playground, WordPress, PHP, database, network, or Blueprint run.
- No completed save transition, local directory selection, or post-export result.
- File and Blueprint editors remain static views.

Future direction:
- Carry forward as a Site Manager diagnostics mode or support/repro workspace.
- Add concrete log severity examples, error detail, clear action, and resolved state.
- Keep diagnostics linked to current route, source, storage, and database facts.

### Browser Tabs and Project Tabs Across the Swarm

Strengths:
- The tab metaphor keeps returning because it fits Playground's current distinction between temporary and saved sites, and it keeps active URL/path navigation visible.
- `design-018`, `design-038`, `design-045`, and `design-058` together point toward a viable multi-Playground workspace with top-level projects and inner manager tabs.

Usability risks:
- Most tab designs still treat tabs as labels rather than lifecycle-bearing objects.
- Browser/project tabs can conflict with Saved Playgrounds if the user cannot tell whether a tab is temporary, browser-backed, local-directory-backed, or merely open.

Missing flow coverage:
- Close tab, duplicate, unsaved warning, save tab, restore saved tab, delete saved item, and switch active path are not deeply modeled.

Future direction:
- If tabs move forward, make tab state the contract: source, storage destination, active path, saved slug, dirty state, close warning, and saved-library identity.

## Cross-Swarm Findings

1. Breadth is no longer the differentiator.
   The swarm consistently covers the checklist. Future work should be judged by stateful completeness, not whether another button exists.

2. The best patterns are role-specific but must not trap users.
   Library, command, Blueprint studio, diagnostics, runtime studio, document, and tabbed project modes are all useful. The default shell still needs direct New, Saved, path navigation, save state, Site Manager, and WP Admin/Homepage access.

3. The active WordPress site must remain a real object.
   Designs that become dashboards about Playground lose the product truth that Playground is a live WordPress site inside a browser shell. Persistent path, refresh, Homepage, WP Admin, and saved/unsaved identity need to survive every mode.

4. Destructive and temporary states are the main product risk.
   Current Playground users can lose temporary work or reset a site. Designs must make Save, local directory, reset, reload, ZIP import, Blueprint run, delete, and replacement behavior explicit at the moment of action.

5. The Blueprint gallery is improving, but still not proven.
   `design-054` is the closest to a credible gallery interaction. Most others still need result counts, search results, empty state, selected details, and clearer run consequences.

6. Mobile remains a verification gap.
   Earlier rounds found real overflow in `design-033`, `design-039`, and `design-045`. Newer designs include responsive CSS and bottom navigation, but this round could not render-check them because Chromium is missing a required system library. Dense tables, top bars, and tab strips should not advance without mobile screenshots and overflow checks.

7. Visual fidelity is high, but some visual systems are detached from WordPress.
   Admin/table patterns feel most product-native. Black/cyan and keyboard/terminal palettes work for diagnostics or expert modes, but become shallow restyles when they do not change flow behavior.

## Carry Forward

Carry forward strongly:
- `design-022`, `design-042`, and `design-053` for saved-library/register modeling.
- `design-026`, `design-033`, `design-039`, `design-046`, `design-050`, and `design-059` for command/search/keybar routing.
- `design-023`, `design-034`, `design-043`, and `design-054` for Blueprint discovery and authoring.
- `design-024`, `design-031`, `design-044`, `design-051`, `design-053`, and `design-058` for advanced Site Manager and IDE-like workflows.
- `design-056` for table-led run management and selected-run inspection.
- `design-028`, `design-048`, and selected parts of `design-058` for mobile/workshop navigation.
- `design-029` and `design-049` for runtime reset/reload clarity.
- `design-030` and `design-050` for import/export taxonomy.
- `design-035` and `design-055` for diagnostics visibility.
- `design-041`, `design-047`, `design-052`, and `design-057` for runbook/document workflows.

Use selectively:
- Browser/project tab concepts only if lifecycle is modeled, not just tab labels.
- Blueprint-first concepts as an author mode unless the default start routes remain equally discoverable.
- Diagnostics-first concepts as support/advanced modes unless warning/error states are fully designed.

Retire or consolidate:
- Generic all-features-visible workbenches that do not add a new interaction model.
- Static code/log/database panes without edit, dirty, error, or result states.
- Gallery claims that show five cards plus "43" without credible catalog behavior.
- Mobile layouts that rely on horizontal table scrolling or long stacked desktop sections as the primary interaction.

## Highest-Priority Guidance

1. Model one complete save path.
   Temporary state, name, destination, progress, completion, saved slug, saved-list insertion, and changed reset/reload behavior must be visible.

2. Keep launch routes distinct.
   WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, ZIP import, and Vanilla WordPress need their own inputs, constraints, cancel/submit actions, and completion states.

3. Make local directory real.
   Show directory picker/permission state, selected directory, and how a local-directory Playground differs from browser-backed saved Playgrounds.

4. Guard dangerous actions.
   Reset, delete, import-over-current, and run Blueprint against current state need confirmation, cancel, and result states.

5. Make editors credible.
   File and Blueprint panes need selected file metadata, dirty markers, save/apply affordances, validation, upload/browse consequences, and run/download feedback.

6. Treat the Blueprint gallery as a catalog.
   Filters, search, result count, selected detail, empty state, and run action need to be real enough to judge.

7. Verify mobile before carrying dense concepts forward.
   Tables, keybars, tab strips, and browser chrome must be rendered at narrow widths, not just given responsive CSS.

The swarm has a large enough idea pool. The next useful work is convergence: choose the strongest wrappers and deepen them until current Playground flows can be completed without losing work, hiding consequences, or relying on checklist-style coverage.
