# Critic Audit - Round 032

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed designs `designs/design-001` through `designs/design-037`
- existing audit `audits/critic-round-020.md`

Method:
- Reviewed manifests, HTML, CSS, JS, and available README files for all completed designs.
- Used `critic-round-020` as the baseline for `design-001` through `design-020`.
- Performed a focused source and interaction review of `design-021` through `design-037`.
- Ran `node scripts/validate-design.mjs` across every completed design; all validated.
- Loaded `design-021` through `design-037` in Chromium at desktop and mobile viewport sizes using the system Chromium binary. No console/page errors were found. `design-033` showed mobile horizontal overflow (`scrollWidth` 862 at a 390px viewport).
- No design files were edited.

## Overall Verdict

The swarm continues to preserve the current Playground feature surface at the label and control level. Across the full set, the required starts, save destinations, saved-site management, URL navigation, settings, Site Manager tabs, file and Blueprint tools, database tools, logs, GitHub export, ZIP import/export, and Blueprint gallery are represented.

The quality bar has improved since round 020 because newer designs are less dominated by generic three-pane workbenches. The strongest newer work explores more specific organizing models:
- `design-022` treats saved Playgrounds as the primary object.
- `design-023` and `design-034` make Blueprint discovery first-class.
- `design-024` and `design-031` make Site Manager the main workspace.
- `design-026` and `design-033` refine command/search routing.
- `design-027` uses a task-board model for PR review.
- `design-028` is the clearest mobile-first attempt.
- `design-029` foregrounds destructive runtime configuration.
- `design-030` foregrounds portability.
- `design-035` foregrounds run health, logs, and database state.
- `design-036` uses progressive disclosure for beginners.
- `design-037` revisits the project-document model with a clearer review workflow.

The main issue is still depth. Many designs now choose a better IA, but they often stop once every capability is visibly represented. The next quality jump is to prove stateful flows: source-specific launch forms, save progress completing into a saved identity, local-directory selection, rename/delete confirmation, reset versus saved reload branching, ZIP file selection, GitHub reconnection, Blueprint selection and run results, editor dirty state, and logs with both empty and problem states. These are not new product requirements; they are the current Playground behavior made explicit enough to judge usability.

## Feature Preservation

Strong preservation:
- All completed designs keep the six start routes: vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- Save coverage is broadly present: browser storage, local directory, unsaved warnings, and progress indicators.
- Saved and unsaved Playgrounds are consistently shown, usually with rename/delete affordances.
- Site Manager tabs remain recognizable: Settings, Files, Blueprint, Database, Logs.
- Database coverage is unusually consistent: driver/path/size, `database.sqlite`, Adminer, and phpMyAdmin appear in almost every design.
- Portability is retained through Export to GitHub, Download `.zip`, Import `.zip`, Blueprint bundle download/copy, and database download.

Weak preservation by depth:
- "All 43 blueprints" is frequently claimed while only six cards are modeled. That is acceptable as representative density only when filters/search/selection feel real; many variants still use it as a label.
- Save to local directory is usually a radio option, but rarely includes directory selection or a distinct post-save state.
- Import `.zip` is usually a button; only some newer designs explicitly say it opens the native file chooser.
- Saved rename/delete rarely shows confirmation, cancellation, or result state.
- GitHub import is better in newer designs, but several still omit the captured nuance that the token is not stored and re-authentication is required after refresh.
- File and Blueprint editors remain mostly static code blocks. They preserve the surface, but do not show edit/save/dirty state.
- Logs remain dominated by empty states. Diagnostics-first designs need real warning/error examples to justify their layout.

## Cross-Swarm Findings

1. The swarm has enough feature inventories.
   The repeated success is breadth. The repeated weakness is that breadth is often indistinguishable from a checklist. Designs should now be judged by whether a user can understand and complete a flow, not whether a button exists.

2. Role-specific IAs are more promising than generic workbenches.
   Newer designs are strongest when the role changes the screen: educators get a teaching browser or run monitor, Blueprint authors get an authoring workspace, core contributors get a review board/document, power users get configuration or command surfaces.

3. The current Playground shell must remain legible.
   Designs that minimize the active WordPress browser too aggressively risk losing a core product truth: Playground is a live WordPress site inside a shell. Manager-first and library-first IAs need persistent URL/path, refresh, Homepage, WP Admin, and save state to stay visible.

4. Mobile is still unresolved.
   `design-028` makes the best mobile-first move with a persistent bottom dock. Many others become very long vertical documents. `design-033` has measurable horizontal overflow on mobile. Long mobile stacks may be acceptable for document-style concepts, but operational controls need sticky task switching and compact summaries.

5. Visual fidelity is generally high enough, but visual differentiation is sometimes cosmetic.
   WordPress-admin-inspired designs (`design-024`, `design-029`, `design-033`, `design-034`) feel credible. Dark diagnostics and command surfaces can work when they support logs, command search, or monitoring. Designs become shallow when a bold palette sits on the same all-features-at-once inventory.

## Newer Pattern Notes

### Guided Launch And Checklist: `design-021`, `design-032`, `design-036`

Strengths:
- `design-021` makes the launch sequence explicit: source, runtime, Blueprint, persistence, review. This directly addresses the current product's scattered start and settings flows.
- `design-032` is useful for Blueprint authors because the checklist points into starts, saving, files, Blueprint, database, and shipping without losing the active site.
- `design-036` is the cleanest beginner/progressive-disclosure version. The modal content differentiates PR, GitHub, Blueprint URL, ZIP, save, and gallery better than many earlier card grids.

Usability risks:
- Wizard/checklist framing can imply a fixed path even when Playground users often jump directly to a PR, a file, a database export, or WP Admin.
- `design-032` combines checklist, dark diagnostics styling, Blueprint authoring, and general Site Manager flows; the first viewport risks feeling like a training product rather than the Playground shell.
- `design-036` has very long desktop and mobile scroll. Progressive disclosure helps, but the page still accumulates many full-width sections.

Missing flow coverage:
- The review step in `design-021` changes headings but not enough underlying controls; runtime, Blueprint, persistence, and destructive review need full states.
- Checklist completion does not show what happens after saving, running a Blueprint, or exporting.
- Local-directory save remains under-modeled in all three.

Future direction:
- Keep guided flows as an onboarding mode or first-run layer, then collapse them into direct task shortcuts after use.
- Turn each step into a complete current-product flow: input, validation, primary action, cancel, progress, resulting state.
- Keep the URL/path, refresh, WP Admin, Homepage, and unsaved/saved status fixed while users move through the guide.

### Saved-Sites First: `design-022`

Strengths:
- The library-first model is one of the best conceptual shifts. It matches the captured distinction between temporary and browser-backed Playgrounds.
- Tables make saved status, source, runtime, creation date, rename, delete, save, and manage actions easier to compare than card piles.
- Creation, save, preview, gallery, Site Manager, and portability remain reachable without forcing the live iframe to dominate the first screen.

Usability risks:
- Users arriving just to start a fresh Playground may feel delayed if the library is the default.
- The selected-site preview is small; the active embedded WordPress context can feel secondary.
- Row actions are visually dense, and delete/rename are not modeled as guarded flows.

Missing flow coverage:
- Opening a saved Playground, switching selected rows, saving an unsaved item, and seeing the URL/slug change are only lightly represented.
- Import/export and local-directory save need clearer consequences in the library model.

Future direction:
- Preserve this as a strong candidate for Saved Playgrounds, but connect row selection to active browser state, manager tabs, and saved URL identity.
- Add inline or drawer-based rename/delete confirmations.
- Make "New Playground" prominent enough that first-time users are not trapped in library management.

### Blueprint-First Discovery: `design-023`, `design-034`

Strengths:
- Both designs correctly identify Blueprint discovery as underexposed in the current UI.
- `design-023` has a strong search/filter/selected Blueprint model and keeps current `blueprint.json` actions near the gallery.
- `design-034` uses image-backed cards and a selected Blueprint rail, which is closer to a real gallery experience than six plain cards.
- Adjacent PR, GitHub, ZIP, save, saved-site, and manager actions keep the broader Playground surface from disappearing.

Usability risks:
- Blueprint-first defaults can demote vanilla WordPress and PR preview workflows.
- `design-034` uses screenshots from research captures as card imagery; this improves visual fidelity but may mislead if the image does not represent the actual Blueprint.
- Several gallery filters are labels without modeled result counts or empty states.

Missing flow coverage:
- Neither design truly models all 43 entries; they model representative subsets.
- Selection, Blueprint JSON inspection, URL-run, current-bundle run, and gallery-card run can blur together.
- Running a selected Blueprint does not show destructive/current-site implications.

Future direction:
- Keep the selected Blueprint detail rail, but distinguish "run gallery item", "run URL", and "run current blueprint.json".
- Add result-count and empty-search states using the existing categories.
- Make non-Blueprint starts persistently visible, not merely adjacent.

### Manager-First IDEs: `design-024`, `design-031`

Strengths:
- These are credible advanced-user designs. Files, Blueprint, database, logs, settings, exports, and preview are arranged like tools rather than modal afterthoughts.
- `design-024` has strong WordPress-admin visual grounding and one of the best file/data/editor surfaces.
- `design-031` improves on earlier manager-first work by pairing a client/site queue with a narrow verification preview and flow drawer.

Usability risks:
- Manager-first defaults can be hostile to users who have not yet created or selected a Playground.
- The live WordPress site can become a thumbnail instead of the core object being managed.
- Dense rails and icon buttons need accessible names, visible labels, and clearer grouping on mobile.

Missing flow coverage:
- Start flows are available but compressed into drawers/flow details.
- Export "More" and saved management need stronger confirmation/result states.
- File editing still looks like static code inspection more than an editable filesystem.

Future direction:
- Treat manager-first as an advanced mode or a selected-site state, not necessarily the first page for a new session.
- Keep start/save/saved flows in a left queue, but model one complete path from start to saved manager state.
- Add editor dirty state, selected file metadata, and a visible save/apply outcome.

### Browser-Chrome And Mobile Shells: `design-025`, `design-028`

Strengths:
- `design-025` maps well to workshops: tabs, address bar, visible save state, and side drawers are familiar to educators managing multiple exercises.
- `design-028` is the best mobile-first proposal so far. The bottom dock gives direct access to Start, Sites, Inspect, and Gallery without relying on desktop panels.
- Both preserve URL/path navigation, refresh, Homepage, WP Admin, save, saved sites, Site Manager, gallery, import, and export.

Usability risks:
- Browser tabs imply real multi-Playground lifecycle management: tab creation, closing, unsaved tab state, saved identity, and switching behavior.
- `design-028` compresses many high-stakes actions into mobile panels. Reset, delete, export, and import need stronger separation from benign navigation.
- The teaching framing in `design-025` may be too specific for general Playground.

Missing flow coverage:
- Tab lifecycle is not connected deeply enough to saved Playground lifecycle.
- Mobile save/local-directory, ZIP selection, and delete confirmation remain surface-level.

Future direction:
- For browser-chrome concepts, make tab state the central contract: saved badge, unsaved warning, active path per tab, and saved-library mapping.
- For mobile, keep the bottom dock but add action sheets for destructive or external-file flows.

### Command/Search Tables: `design-026`, `design-033`

Strengths:
- Both designs improve discoverability by making the whole Playground action surface searchable.
- `design-026` is approachable for first-time learners because each result expands into an inline inspector.
- `design-033` is a strong admin-table evolution: command results, saved-site tables, starts, manager tools, gallery, transfer, and runtime all sit in a WordPress-like frame.

Usability risks:
- Command-first interfaces depend on excellent default grouping and synonyms. Otherwise users must already know what to search for.
- `design-033` has measurable mobile overflow, so the dense table layout needs responsive work.
- "Run selected" can be ambiguous when the selected item is a destructive reset, a save, a launch route, or a navigation action.

Missing flow coverage:
- Search filtering is implemented, but result execution usually opens generic modals or panels rather than completing flows.
- Rename/delete and local-directory save still lack confirmation and destination state.
- The command index does not clearly scope commands to current site versus global Playground/library actions.

Future direction:
- Keep command search as a cross-cutting router, but make selected-result panels action-specific and stateful.
- Add scoped group labels: current site, saved library, start new, Site Manager, transfer.
- Fix mobile table overflow before carrying `design-033` forward.

### Task Board And Review Documents: `design-027`, `design-037`

Strengths:
- `design-027` is a meaningful core-contributor IA: Create, Save, Manage, Inspect, Export, and Debug lanes make Playground capabilities scannable by task.
- The selected-card editor in `design-027` provides better flow detail than many static workbenches.
- `design-037` improves the document pattern by connecting PR review context, live preview, start sources, save state, settings, files, Blueprint, database/logs, and handoff in one review artifact.

Usability risks:
- Boards can become a wall of equal-weight actions. Important current state can get lost among lanes.
- Document-style pages are long on mobile and may make controls feel like documentation instead of executable UI.
- `design-037` adds note-taking context that may distract from the existing Playground surface if it becomes primary.

Missing flow coverage:
- Board cards switch panels but do not show full post-action state.
- Document sections do not model enough interaction for gallery filtering, save completion, or file edits.
- Delete/reset remain available but not sufficiently guarded.

Future direction:
- Carry forward the task grouping, but make one lane the active workflow at a time.
- Keep document context only where it explains existing Playground operations: PR source, runtime, files, Blueprint, database/logs, export.
- Add sticky navigation and compact section summaries for mobile.

### Configuration-First: `design-029`

Strengths:
- This design takes destructive reset behavior seriously. Runtime settings, reset, Save & Reload, and unsaved preservation are prominent.
- WordPress-admin styling is appropriate and high-fidelity.
- Launch routes are clearly downstream of configuration, which helps users understand the cost of changing WP/PHP/language/network/multisite.

Usability risks:
- Settings-first is not the default mental model for many users. A new user may want "Start WordPress" before "review runtime configuration".
- The page is very long, especially on mobile, and can feel like a settings report.
- Configuration may appear global when some settings are current-site specific.

Missing flow coverage:
- Applying settings does not show destructive confirmation or resulting reset/reload state.
- Saved Playground selection and runtime editing are not fully connected.

Future direction:
- Use this as the strongest settings/reset pattern. It should inform settings panels in other designs even if not chosen as the default shell.
- Make temporary versus saved branching explicit at the action button itself.

### Portability-First: `design-030`

Strengths:
- This is the clearest design for import/save/export mental models. Bring In, Keep, and Send Out are easy to scan.
- GitHub import, ZIP import, Blueprint URL, PR starts, browser save, local-directory save, GitHub export, and ZIP download are differentiated more than in most card grids.
- The drawer copy includes important GitHub token and ZIP behavior.

Usability risks:
- Portability-first can overemphasize transfer tasks for users who just want a live WordPress site or a PR preview.
- Site Manager tools are present but reduced to supporting cards.
- The long page suggests a hub more than a continuous Playground shell.

Missing flow coverage:
- Transfer flows show forms but not completion, errors, selected files/directories, or saved-library updates.
- Blueprint gallery is tucked into a drawer rather than a rich browsing surface.

Future direction:
- Keep Bring In / Keep / Send Out as a portability section or drawer in broader concepts.
- Model selected file, selected directory, progress, and resulting saved/exported state for the current flows.

### Diagnostics And Run Monitor: `design-035`

Strengths:
- The first viewport directly exposes environment health, live logs, database state, and preview. This is a strong role-specific model for workshops and support.
- The top navigation maps well to Site Manager tabs while contextual drawers preserve creation, save, library, gallery, and export.
- Database and logs are not hidden behind advanced tabs, which improves troubleshooting discoverability.

Usability risks:
- Diagnostics-first can make a healthy Playground feel like an incident dashboard.
- Green status accents and "ready" states need corresponding warning/error examples, or the monitor becomes decorative.
- Creation and save flows are one drawer away, which may slow first-time starts.

Missing flow coverage:
- Logs show mostly healthy/empty states.
- Drawer launch uses one mixed input for PR, branch, repository, and Blueprint URL, reducing the differentiation captured in the current product.
- Save completion and saved-library update are not modeled.

Future direction:
- Carry this forward as a diagnostics mode or workshop monitor.
- Add current-product log categories with empty, warning, and error examples.
- Keep source-specific launch forms rather than a single all-purpose input.

## Design-Specific Carry Forward

Carry forward strongly:
- `design-022` for saved-library object modeling.
- `design-023` and `design-034` for Blueprint-first discovery.
- `design-024` and `design-031` for advanced Site Manager/workspace mode.
- `design-026` and `design-033` for command/search routing, after mobile table fixes.
- `design-027` for task-based PR review.
- `design-028` for mobile navigation.
- `design-029` for settings/reset consequence handling.
- `design-030` for import/export/save taxonomy.
- `design-035` for diagnostics visibility.
- `design-036` for progressive disclosure and source-specific modal copy.
- `design-037` for review-document context, if kept tied to existing Playground operations.

Use selectively:
- `design-021` and `design-032` as guided/onboarding variants, not necessarily the main shell.
- Earlier strong concepts from round 020 remain valid: `design-014` for Blueprint discovery, `design-015` for diagnostics, `design-016` for command search, `design-018` for project tabs, `design-019` for expert Blueprint authoring, and `design-020` for beginner-safe action cards.

Retire or consolidate:
- Generic three-pane workbenches that only keep every feature visible without proving flow.
- Repeated dark/cyan console treatments that do not materially improve command, diagnostics, or editor tasks.
- Gallery claims that show six cards and no credible 43-entry browsing behavior.

## Highest-Priority Guidance

1. Prove one complete current-product flow per design.
   A strong next prototype should show a full sequence such as start from Gutenberg branch, save to browser, progress completion, saved identity in the library, settings reload branch, and export/download action.

2. Make save/local-directory behavior concrete.
   Browser storage and local directory should not be interchangeable radio labels. Show destination selection, progress, and resulting saved state.

3. Deepen destructive and irreversible actions.
   Reset, delete, import over current site, and run Blueprint against current state need confirmation and consequence copy at the action point.

4. Differentiate launch routes.
   WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, and ZIP import have different inputs and constraints. The best newer designs start to model this; future work should make it standard.

5. Treat Blueprint gallery as a real catalog.
   Show credible density, search/filter result states, selected detail, and a run action that is clearly separate from editing/running current `blueprint.json`.

6. Preserve the live WordPress shell.
   Even in library, manager, diagnostics, and document modes, keep path navigation, refresh, Homepage, WP Admin, and save state visible enough that users know they are operating a live Playground.

7. Fix mobile intentionally.
   Long stacks are not enough. Use bottom navigation, drawers, sticky summaries, or tabs, and verify no horizontal overflow. `design-033` is the immediate example to fix.

The swarm has moved from surface coverage toward stronger IA concepts. The next round should be narrower and deeper: fewer new wrappers, more complete current Playground flows inside the best wrappers already discovered.
