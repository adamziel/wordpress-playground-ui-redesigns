# Critic Audit - Round 042

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed designs `designs/design-001` through `designs/design-047`
- existing audits `audits/critic-round-020.md` and `audits/critic-round-032.md`

Method:
- Used `critic-round-020` and `critic-round-032` as baseline critiques for `design-001` through `design-037`.
- Performed focused source, manifest, HTML, CSS, and interaction review for newer completed designs `design-038` through `design-047`.
- Ran `node scripts/validate-design.mjs` for `design-038`, `design-039`, `design-040`, `design-041`, `design-042`, `design-043`, `design-044`, `design-045`, `design-046`, and `design-047`; all validated.
- Loaded those newer designs in Chromium at `1440x1000` and `390x844`. No console or page errors were found. Mobile horizontal overflow was found in `design-039` (`scrollWidth` 932 at 390px) and `design-045` (`scrollWidth` 589 at 390px).
- No design files were edited.

## Overall Verdict

The completed set continues to preserve the current WordPress Playground surface at the label/control level. Across the swarm, the required start sources, save destinations, saved-site management, URL/path navigation, quick settings, Site Manager tabs, file and Blueprint tools, database tools, logs, GitHub export, ZIP import/export, and Blueprint gallery are present.

Round 042 adds several stronger organizing models, especially:
- `design-039` and `design-046` for command/table-led action routing.
- `design-041` and `design-047` for runbook/task-board workflows.
- `design-042` for a saved-sites-first library.
- `design-043` for Blueprint-first authoring.
- `design-044` for a developer IDE surface.
- `design-038` and `design-045` for tabbed/browser-shell continuity.

The quality problem remains depth, not coverage. The newer designs are more specific than the early generic three-pane workbenches, but many still represent current Playground behavior as static affordances: buttons, progress meters, table rows, and code blocks. The next bar is not adding requirements; it is showing the existing flows with enough state to evaluate usability: source-specific launch, GitHub connection, native ZIP selection, save progress completion, saved URL identity, local-directory choice, rename/delete confirmation, destructive reset versus saved reload, Blueprint run consequences, editor dirty state, and log problem states.

## Feature Preservation

Strong preservation:
- All 47 completed designs claim and visibly cover the six start routes: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- Browser save, local-directory save, unsaved warnings, and save progress appear consistently.
- Saved and unsaved Playgrounds are represented, usually with open, rename, delete, and save affordances.
- Site Manager remains recognizable: Settings, File browser, Blueprint, Database, Logs, plus additional export/download actions.
- Database details are unusually well preserved: SQLite-backed driver, path, size, `database.sqlite`, Adminer, and phpMyAdmin.
- The live shell usually retains path input, refresh, Homepage, WP Admin, and save state.

Weak preservation by flow depth:
- Blueprint gallery still often says "43" while rendering five or six cards. This is acceptable only when filtering/search/selection/result density feels credible; many screens still use "43" as a badge rather than a browsable catalog.
- Local-directory save is still under-modeled. Some newer designs add "Choose directory", but few show selected directory state or how it differs from browser-backed saved Playgrounds after completion.
- Save progress rarely resolves into a saved slug/state change. Progress meters are often decorative samples.
- Rename and delete are exposed more often than they are guarded. Confirmation, cancellation, and result state remain weak.
- File and Blueprint editors are mostly static code display. They preserve the feature surface, but do not prove editing, dirty state, upload selection, save/apply behavior, or run results.
- Logs remain dominated by "No problems so far." Diagnostics and monitor concepts need warning/error examples to justify their IA.

## Newer Pattern Notes

### Repro Tabs and Browser Shells: `design-038`, `design-045`

Strengths:
- Both designs correctly treat the active WordPress site as browser-like: tabs, path input, refresh, Homepage, WP Admin, and save state remain central.
- `design-038` adds useful top-level repro tabs and within-project tabs for Site, Files, Blueprint, Database, Logs, and Runtime. This is a better conceptual contract than another left-launcher/right-manager workbench.
- `design-045` is effective for Blueprint authors: the shelf keeps Start, Saved, Gallery, and Transfer close while the Site Manager drawer opens directly to Blueprint work.

Usability risks:
- Browser tabs imply real lifecycle behavior: creating, closing, switching, saved/unsaved warnings per tab, and mapping tabs to Saved Playgrounds. The prototypes mostly show tab labels, not lifecycle.
- `design-038` uses a single generic start input for PR, branch, GitHub repository, Blueprint URL, and ZIP selection. That weakens the current product's source-specific flows.
- `design-045` has mobile horizontal overflow (`scrollWidth` 589 at 390px), likely from fixed browser/table/chrome structures.
- `design-045`'s Blueprint-author bias can demote non-Blueprint starts and saved-site management.

Missing flow coverage:
- Tab state does not complete into saved identity, slugged URL, or saved-library entry.
- Native `.zip` import, GitHub connection, and local-directory selection are named but not deeply modeled.
- Blueprint run does not show whether it runs the selected gallery item, the URL, or the current `blueprint.json`.

Future direction:
- Make tab state the core contract: per-tab path, save badge, source, storage, close warning, and saved-library mapping.
- Keep source-specific forms rather than one universal source input.
- Fix mobile overflow before carrying the browser-chrome pattern forward.

### Table-Led Command and Library Surfaces: `design-039`, `design-042`, `design-046`

Strengths:
- These are among the strongest discoverability proposals. Tables and command rows make Playground's broad action surface scannable without dumping every control into equal-weight cards.
- `design-039` has the best compact modal command library in this round. It differentiates WordPress PR, Gutenberg branch, GitHub import, Blueprint URL, ZIP import, settings, database, Blueprint bundle, and export actions with specific bodies.
- `design-042` extends the strong saved-library direction from `design-022`: temporary versus browser-backed sites, source, runtime, activity, row actions, and contextual drawers are all coherent.
- `design-046` is a credible command inspector. Selecting a command updates an inspector and the related Site Manager tab, which is closer to a working router than most command concepts.

Usability risks:
- `design-039` has severe mobile overflow (`scrollWidth` 932 at 390px). A table-led power-user surface cannot be considered viable until it has a real mobile or narrow layout.
- Library-first (`design-042`) can delay users who only want to start WordPress or preview a PR.
- Command-first (`design-046`) depends on synonyms and scoped grouping. Users may search for "folder", "download", "branch", "database", "snapshot", "template", "plugin", or "reset"; the current prototype demonstrates filtering but not synonym quality.
- Row actions such as "Open Manage Rename Delete" in `design-042` are visually dense and not separated by risk.

Missing flow coverage:
- Tables do not yet show post-action state: saved row changes, renamed row, deleted row, selected directory, selected ZIP, or completed export.
- Delete confirmation is weak or absent in table rows.
- Command execution often opens a representative inspector rather than completing a concrete current-product flow.

Future direction:
- Keep table/command routing, but make each selected command resolve to the exact current flow and resulting state.
- For library-first work, connect selected row to active browser path, Site Manager tabs, save state, and storage identity.
- Replace dense inline row-action strings with grouped menus or explicit guarded actions.

### Beginner Action and Safety Cards: `design-040`

Strengths:
- `design-040` is a better version of the beginner action-card pattern because the detail drawer explains required input, consequences, and destructive behavior at the point of action.
- It preserves the current product surface while making reset, replacement, save, GitHub token behavior, native ZIP picker, and saved versus temporary state more understandable.
- The source-specific drawer bodies are stronger than generic launch cards.

Usability risks:
- The page is long on both desktop and mobile. It avoids horizontal overflow, but mobile `scrollHeight` is very high, so task switching may become tedious.
- Plain-language card grids can become a checklist wall if the selected detail drawer is not sticky and clearly dominant.
- Some advanced Site Manager tools are summarized in drawer copy rather than given full operational space.

Missing flow coverage:
- Save progress remains a sample state, not a completed save transition.
- Delete has warning copy but does not show confirmation/result.
- File and Blueprint editing are represented as tool summaries more than active editors.

Future direction:
- Keep the action-specific detail drawer as a teaching layer, but make one full flow stateful: start, save, saved-list update, manager action, and export.
- Make the drawer sticky and action-specific enough that the card grid does not require repeated scrolling.

### Repro Runbook and Demo Board: `design-041`, `design-047`

Strengths:
- Both designs create a meaningful task sequence without inventing new Playground capabilities. Source, runtime, persistence, handoff, saved sites, manager tools, gallery, transfer, and debug map cleanly to existing product flows.
- `design-041` is strong for support: it makes the current source/runtime/save/handoff sequence explicit and keeps side tasks available.
- `design-047` is one of the clearest all-surface maps in the swarm. Create, Save, Manage, Inspect, Export, and Debug lanes align with how documentation writers prepare a reproducible demo.
- Both designs improve destructive-action visibility compared with many earlier workbenches.

Usability risks:
- Runbooks can over-linearize Playground. Advanced users often jump directly to a PR, a saved site, a file, a database export, or WP Admin.
- `design-047` avoids overflow but becomes a very long mobile board (`scrollHeight` 4616 at 390px). `design-041` is more compact, but the wizard still hides later steps until selected.
- Board lanes can create equal-weight noise. In `design-047`, every lane looks important even though the active state should drive priority.

Missing flow coverage:
- Step completion does not update global state. Saving does not visibly create a new saved URL identity; starting does not replace the preview; export does not complete.
- Rename/delete and reset are visible, but the confirmation and result states are thin.
- Blueprint gallery cards and current `blueprint.json` actions remain adjacent but not fully distinct.

Future direction:
- Use runbook/board framing for guided modes, workshop preparation, or documentation workflows, not necessarily as the default shell.
- Collapse completed steps into compact state summaries and make the active step the only high-density area.
- Model one complete end-to-end runbook path instead of showing all tasks as representative panels.

### Blueprint-First Authoring: `design-043`

Strengths:
- `design-043` is the strongest new Blueprint-first design. It connects gallery filtering, Blueprint URL execution, current `blueprint.json`, file assets, live preview, save state, and Site Manager tools in one authoring workspace.
- Search and filter logic are actually wired, which makes the gallery feel more credible than a static "43 blueprints" claim.
- The design preserves non-Blueprint starts through command buttons and dialogs, so the broader Playground surface is not lost.

Usability risks:
- Blueprint-first is useful for theme authors, but it can demote vanilla WordPress, PR previews, saved management, and database/log work for general users.
- The page is extremely long on mobile (`scrollHeight` 7081 at 390px). It avoids horizontal overflow, but the single-column progressive-disclosure model still needs stronger section compression.
- Some icon/text choices use symbolic controls (`↻`, `▦`, `◫`, `＋`) that may be unfamiliar without visible labels.

Missing flow coverage:
- The gallery models five cards, not the true 43-card density.
- Running a gallery card, running a URL, and running the current edited `blueprint.json` need clearer separation and consequences.
- Current Blueprint editing is a static code block; no dirty state, validation, save, or run feedback is shown.

Future direction:
- Keep the gallery-to-Blueprint-to-preview continuity, but add selected Blueprint detail, JSON validation state, and run-result state.
- Make Blueprint-first a mode with persistent escape routes to New, Saved, Site Manager, and active WordPress navigation.

### Developer IDE Workbench: `design-044`

Strengths:
- `design-044` is a credible advanced-user IDE. Files, Blueprint bundle, database, logs, runtime settings, editor tabs, and preview are all close together.
- It preserves creation, saved management, save modal, gallery modal, exports, and Site Manager tools through drawers and modals.
- Desktop rendering is compact and high-density without losing the live WordPress preview.

Usability risks:
- The high-contrast black/cyan palette and symbolic rail labels (`F`, `{ }`, `DB`, `!`) may feel more like a generic developer IDE than WordPress Playground.
- Launcher, save, gallery, and saved management are secondary to the IDE. That is acceptable for agency developers, but not a general landing pattern.
- Some tool buttons use terse labels like `file+`, `dir+`, `up`, and `↓`, which reduces discoverability and accessibility.

Missing flow coverage:
- The editor tabs are static views. They do not show editing, dirty files, upload selection, or code-save behavior.
- Saved and start drawers are representative; GitHub, ZIP, PR, Blueprint URL, and local-directory save do not complete.
- Logs still show empty state only.

Future direction:
- Keep this as an advanced Site Manager mode, not a default Playground home.
- Replace symbolic controls with clearer labels or standard icons with accessible names.
- Add real editor states: selected file metadata, dirty marker, save/apply outcome, upload selection, and run result.

## Cross-Swarm Findings

1. Breadth is solved; state is not.
   The swarm no longer needs more designs that prove every feature can be named. It needs fewer, deeper designs that prove existing flows can be completed and understood.

2. Role-specific IA is the best direction.
   Saved-library, command inspector, Blueprint studio, IDE, runbook, and mobile shell concepts are materially better than generic three-pane workbenches because the organizing object changes the UI.

3. The live Playground shell must stay legible.
   Even in library-first, IDE, Blueprint, and runbook modes, users need persistent path navigation, refresh, Homepage, WP Admin, and saved/unsaved state. Designs that demote the active site too far risk becoming dashboards about Playground instead of Playground itself.

4. Mobile remains under-designed.
   `design-039` and `design-045` have measurable overflow. `design-040`, `design-043`, `design-046`, and `design-047` avoid overflow but become very long mobile documents. The best mobile direction is still closer to `design-028`: task navigation designed for narrow screens, not desktop panels stacked vertically.

5. Visual fidelity is high, but some differentiation is cosmetic.
   The newer designs look more polished than early entries, but visual style is not enough. A table, IDE, runbook, or browser shell only becomes a better Playground UI when it changes how users find and complete current flows.

## Carry Forward

Carry forward strongly:
- `design-022` and `design-042` for saved-library object modeling.
- `design-023`, `design-034`, and `design-043` for Blueprint discovery and authoring.
- `design-024`, `design-031`, and `design-044` for advanced Site Manager/IDE work.
- `design-026`, `design-033`, `design-039`, and `design-046` for command/search routing, after fixing mobile/table behavior.
- `design-028` for mobile navigation.
- `design-029` and `design-040` for reset/save safety copy.
- `design-030` for import/save/export taxonomy.
- `design-035` for diagnostics visibility.
- `design-041` and `design-047` for guided runbook/task-board workflows.

Use selectively:
- `design-038` and `design-045` for browser/tab metaphors if tab lifecycle is fully modeled.
- Earlier three-pane workbenches only as reference for persistent context, not as standalone future directions.

Retire or consolidate:
- Any design whose main contribution is another all-features-visible workbench.
- Static gallery claims that show a small subset without credible catalog behavior.
- Static code/log/database panes that do not add edit, dirty, error, or result state.
- Mobile layouts that simply stack desktop panels.

## Highest-Priority Guidance

1. Pick the best wrappers and go deeper.
   Use library, command, Blueprint studio, IDE, runbook, and mobile shell patterns as containers for complete existing flows.

2. Model save completion.
   Show temporary state, name, destination, progress, completion, saved identity, saved-list insertion, and the changed reset/reload behavior.

3. Separate launch routes.
   WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, ZIP import, and Vanilla WordPress need distinct inputs, warnings, and completion states.

4. Make destructive actions guarded.
   Reset, delete, import over current site, and run Blueprint against current state need confirmation and outcome states at the action point.

5. Treat the Blueprint gallery as a real catalog.
   Filters, search, result count, selected detail, empty state, and run action must be credible even if the prototype renders a representative subset.

6. Make editors real enough to judge.
   File and Blueprint areas need selected file state, dirty state, save/apply affordance, upload/browse consequence, and run/download feedback.

7. Fix mobile before advancing dense concepts.
   Tables and browser chrome need responsive alternatives. Long stacks need sticky task navigation, compact summaries, or drawers.

The swarm has enough surface-preserving redesigns. The next round should select the strongest organizing patterns and prove current Playground behavior inside them with stateful, flow-complete prototypes.
