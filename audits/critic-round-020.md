# Critic Audit - Round 020

Date: May 21, 2026

Scope read:
- `research/PLAYGROUND_UI_MAP.md`
- `data/designs.json`
- completed designs `designs/design-001` through `designs/design-020`
- existing audits under `audits/` - none present beyond `.gitkeep`

Method:
- Reviewed manifests, HTML, CSS, JS, and README files for all completed designs.
- Rendered each design at desktop and mobile viewport sizes.
- Checked for basic runtime console errors and interaction wiring patterns.
- Evaluated against the current Playground feature surface captured in `PLAYGROUND_UI_MAP.md`.

## Overall Verdict

The swarm has strong feature preservation on paper and generally avoids losing major Playground capabilities. Most prototypes expose the required creation sources, save destinations, saved-site management, Site Manager tabs, database/log tools, blueprint actions, and export/import paths somewhere in the UI.

The main weakness is not missing labels. It is that many designs preserve the feature surface by compressing every capability into dense static panels, then stop short of proving the flow. Several prototypes are closer to annotated inventories than high-fidelity product surfaces: they include buttons for every capability, but do not consistently show the modal states, native-file-picker implications, saved versus unsaved branching, error/empty states, or action consequences that make Playground understandable.

The best work happens when a design chooses a real organizing model and lets it change the user experience:
- `design-006` and `design-016` explore command/search discovery.
- `design-014` explores a Blueprint-first marketplace.
- `design-015` explores diagnostics-first operation.
- `design-017` explores a project-document model.
- `design-018` explores project tabs.
- `design-019` explores an expert command-file interface.
- `design-020` explores beginner-safe action cards.

The weakest repeated pattern is the generic three-pane workbench. It often improves discoverability compared with the current modal-heavy Playground, but across many entries it becomes shallow restyling: left launcher, center faux WordPress preview, right Site Manager, with similar controls and limited flow behavior.

## Feature Surface Preservation

Strongly preserved across most designs:
- Start sources: vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import, Blueprint URL, and `.zip` import.
- Save surface: browser storage, local directory, unsaved messaging, and some form of progress indicator.
- Saved Playgrounds: unsaved and saved examples, rename/delete affordances.
- Site Manager: Settings, Files, Blueprint, Database, Logs.
- Runtime settings: WordPress/PHP/language, older versions, network access, multisite, reset/reload messaging.
- Portability: Export to GitHub, download `.zip`, download Blueprint bundle, download database.

Commonly under-modeled or only superficially covered:
- Blueprint gallery claims "all 43" but most screens only render 5 or 6 cards. This is acceptable for a static representative prototype only if the UI makes filtering, search, and result density credible. Several designs do not.
- Import `.zip` is usually a button, rarely modeled as a native file chooser trigger with selected file, validation, or restore consequences.
- Save to local directory is usually a radio choice, but few designs show directory-selection state or how it differs from browser-backed saved sites.
- Save progress appears as decorative progress in many designs and rarely connects to completion, slug creation, or saved-state transition.
- GitHub import often says "connect account" but does not always preserve the captured nuance: imports public plugin/theme/wp-content directories, access token is not stored, and re-authentication is required after refresh.
- Rename/delete flows are often text buttons without confirmation, menu placement, or post-action state.
- Logs are mostly "no problems so far"; error states are underrepresented.
- Settings reset versus saved reload behavior is mentioned in many places, but the designs rarely show how the primary action changes when the current Playground is saved versus temporary.
- File and Blueprint editors often use static `pre` blocks rather than credible editing surfaces with selected file state, dirty state, save action, or upload/browse consequences.

## Cross-Swarm IA Findings

1. Persistent context is a real improvement, but it is overused.
   The current Playground loses context through separate overlays. Most designs fix that by keeping the live WordPress preview visible. That is directionally right. However, many entries then keep too much visible all the time, making start flows, saved management, Site Manager, gallery, and export actions compete at equal weight.

2. The faux WordPress preview dominates some screens without adding much.
   Nearly every design repeats the same "Hello from WordPress Playground!" preview. It helps confirm the live-site frame, but when it occupies half the viewport while operational controls are squeezed, it stops helping. Future work should vary preview prominence by task: large for navigation/site QA, smaller for file/database/log workflows, and absent or minimized when the task is purely launcher/gallery management.

3. Discoverability improved, prioritization did not always improve.
   Many prototypes make every feature visible, but do not clarify what a first-time user should do first, what is dangerous, what is optional, and what belongs to the active site versus global Playground management.

4. High fidelity is uneven.
   Dense prototypes like `design-002`, `design-008`, `design-013`, `design-016`, and `design-018` feel product-like because they define real panes, tabs, drawers, data tables, and states. Others use enough labels to satisfy coverage but rely on placeholder buttons and static text. A high-fidelity Playground redesign needs modeled states: modal open/close, selected source, filter result, saved transition, destructive confirmation, file selection, editor dirty state, log warning, and database download affordance.

5. Mobile is a persistent risk.
   The mobile screenshots show that many designs become long stacked inventories. They do not always offer a task switcher that preserves position or collapses secondary controls. `design-009`, `design-014`, `design-018`, and `design-020` make more serious attempts at mobile navigation. `design-017` becomes especially long on mobile and needs stronger section compression.

## Pattern and Design Notes

### Persistent Three-Pane Workbenches: `design-001`, `design-002`, `design-003`, `design-004`, `design-007`, `design-008`, `design-009`, `design-010`

Strengths:
- These designs best preserve the current feature surface without hiding critical tools.
- They make the relationship between start sources, saved sites, active preview, and Site Manager more visible than the current modal-first UI.
- The Site Manager tabs are usually complete: settings, files, blueprint, database, logs, and export/portability are discoverable.
- `design-002`, `design-008`, and `design-009` are among the clearer executions of this pattern because the launcher, preview, and manager each have a stable location.

Risks:
- The pattern is now saturated. Many variants differ mainly in color, spacing, and panel names.
- Equal-weight panes create scanning fatigue. A new user sees launch cards, saved sites, blueprints, preview, settings, file controls, and export actions at once.
- Several controls are too small or encoded as initials (`S`, `M`, `G`, `SET`, etc.), reducing learnability and accessibility.
- Some mobile versions convert the whole product into a very long sequence of cards rather than a compact mobile IA.

Missing flow coverage:
- Start-source detail forms are inconsistent. PR, Gutenberg branch, GitHub, Blueprint URL, and `.zip` should not all feel like identical cards.
- Local-directory save and browser-storage save often share one static save modal without showing different outcomes.
- Saved-site action menus often expose Rename/Delete but not confirmation, cancel, or active-site switching.

Future improvement directions:
- Pick one primary user mode per screen: launching, managing saved sites, inspecting a site, or editing files. Keep the other modes reachable but visually subordinate.
- Replace letter-coded icon buttons with recognizable icons or explicit labels.
- Model the save transition from temporary to saved, including progress, resulting slug, and changed primary action.
- For mobile, use a small number of task tabs or drawers instead of stacking the full desktop feature inventory.

### `design-005` - Browser-Chrome Debug Browser

Strengths:
- The browser-tab metaphor fits support and reproduction work.
- The omnibar and active tab treatment make URL/path navigation feel central, which maps well to Playground's embedded-site shell.
- Drawers are a plausible way to keep creation, saved sites, manager tools, gallery, and export available without replacing the active site.

Risks:
- The high-contrast black/cyan style is distinctive but can overwhelm WordPress-admin expectations.
- Many drawer actions remain static labels. The tab metaphor promises multi-Playground behavior but does not fully model switching, closing, or saved/unsaved tab state.
- Debug-browser vocabulary may be less approachable for beginners who just want to launch WordPress or run a Blueprint.

Missing flow coverage:
- Tab lifecycle and saved Playground lifecycle are not connected enough.
- `.zip` import, GitHub import, and Blueprint URL are present but not differentiated beyond launch cards/dialogs.

Future improvement directions:
- Lean harder into reproduction workflows: active tab metadata, environment diff, shareable reproduction summary, and saved/unsaved tab persistence.
- Make drawer state more task-specific and reduce always-visible chrome density.

### Command/Search Patterns: `design-006` and `design-016`

Strengths:
- These are among the strongest discoverability improvements. They make Playground's large action surface searchable rather than forcing users to know whether a feature lives under Saved Playgrounds, Site Manager, Settings, or a gallery.
- Grouped results help preserve the whole feature set without requiring every feature to be visible at once.
- `design-016` has a strong developer-launcher feel and better result-group structure than most workbench designs.

Risks:
- Command-first UI can hide available actions from beginners unless default groups are excellent.
- Search results must be backed by strong synonyms. For example, users may search "branch", "plugin", "folder", "database", "download", "snapshot", "template", or "blueprint".
- Some inspector/detail panes still feel like static summaries rather than executable forms.

Missing flow coverage:
- Search filtering is only lightly modeled.
- Result selection does not consistently open the exact current Playground flow: PR form, GitHub connect explanation, Blueprint URL input, native `.zip` picker, save modal, file browser, etc.

Future improvement directions:
- Treat search as a real command router: every result should reveal the next required control and preserve cancel/submit behavior.
- Add recent commands and current-site scoped commands, not just global action lists.
- Keep a visible non-search fallback for first-time users.

### `design-011` - Site Manager Takeover

Strengths:
- Correctly recognizes that many advanced Playground users arrive for Site Manager tasks, not just creation.
- Files, Blueprint, Database, Logs, runtime settings, and portability become primary rather than buried.
- The narrow preview reduces distraction for file and runtime work.

Risks:
- Creation and saved-site management become supporting panels, which may hurt users arriving at Playground without an active project.
- The design can feel like a settings dashboard more than a live Playground shell.
- It risks demoting the current top-bar browser controls too far.

Missing flow coverage:
- Start flows are present but compressed.
- Save progress and saved transition are less prominent than in current Playground.
- Blueprint gallery is represented but not deeply browsable.

Future improvement directions:
- Use this model for an "advanced manager" mode, not necessarily the default first screen.
- Keep the URL/path field, refresh, Homepage, and WP Admin controls visually persistent.

### `design-012` - Guided Workshop Checklist

Strengths:
- Strongest onboarding concept. The checklist gives beginners a sequence: choose start, save, manage, set runtime, inspect files, browse blueprints, export.
- The saved Playground table is concrete and understandable.
- Good fit for educators or workshop facilitators who need to prevent accidental data loss.

Risks:
- The checklist can over-prescribe a linear path for users who already know what they need.
- It may add a layer between the user and direct actions if every task is framed as a lesson.
- Dense mobile stacking makes the guide long.

Missing flow coverage:
- The design explains steps more than it models completed/in-progress/error states for each step.
- Advanced Site Manager flows are summarized rather than fully given room.

Future improvement directions:
- Make the checklist collapsible after first use.
- Let each checklist item expose the real underlying flow inline, including progress and destructive reset warnings.

### `design-013` - Admin Ledger

Strengths:
- The WordPress-admin-like dashboard is credible and efficient for repeat users.
- Tables and drawer details fit saved Playground management better than repeated cards.
- It provides one of the clearer information architectures for operational triage.

Risks:
- It can feel too much like a generic admin dashboard, reducing the sense that Playground contains a live browser-hosted WordPress site.
- Dashboard cards compress many actions and may hide exact flow differences.
- Some table-row action text is cramped and vulnerable to clipping.

Missing flow coverage:
- Start flow detail is consolidated into a generic modal, which risks blurring PR, GitHub, Blueprint URL, and `.zip` differences.
- Gallery is present but not as rich as a true 43-item catalog.

Future improvement directions:
- Preserve the ledger/table strengths for saved-site management, but give creation and Blueprint selection more specialized surfaces.
- Use the drawer to show concrete state changes, not just summaries.

### `design-014` - Blueprint Marketplace IDE

Strengths:
- Strongest Blueprint-first exploration. It gives the gallery visual prominence and makes Blueprint discovery feel like a first-class Playground use case.
- Category filters and selected Blueprint summary improve the current "View all blueprints" discoverability problem.
- Adjacent PR review, GitHub import, `.zip`, saved-site, and manager tools keep feature coverage broad.

Risks:
- The headline "Blueprints for PR review" mixes two mental models: marketplace browsing and PR review. Blueprints are not only for PR review.
- Starting from vanilla WordPress risks becoming secondary to the marketplace.
- Image-rich cards improve appeal, but if real Blueprint screenshots are unavailable, abstract thumbnails may become decorative.

Missing flow coverage:
- The "all 43" gallery is represented by a small subset.
- Selecting a Blueprint, inspecting its JSON, running from URL, and running a local edited bundle need clearer separation.

Future improvement directions:
- Keep Blueprint marketplace as a strong alternate landing mode, but make vanilla/PR/GitHub starts easier to find for non-gallery users.
- Use real or representative Blueprint previews and show selected Blueprint details, tags, requirements, and run action in one consistent place.

### `design-015` - Diagnostics Console

Strengths:
- Excellent differentiated concept. It makes logs, database, environment, network, and storage prominent for support engineers.
- It preserves creation, save, manager, file, Blueprint, gallery, and portability flows while giving diagnostics a reason to be first.
- The high-contrast console style supports monitoring and incident triage.

Risks:
- Too specialized for the default Playground home. Beginners may not know why diagnostics are first.
- The dark technical palette is effective for support work but can distance the UI from WordPress norms.
- It needs stronger actual warning/error examples to justify a diagnostics-first layout.

Missing flow coverage:
- Logs mostly show empty or healthy states.
- Database actions are present, but database inspection flow is not deep.

Future improvement directions:
- Use this as a role-specific mode or Site Manager diagnostics tab.
- Add explicit healthy, warning, and error examples for Playground, WordPress, PHP, network, and database.

### `design-017` - Project Document

Strengths:
- Distinct and thoughtful. It treats a Playground as a project document with a durable outline, which fits theme authors and longer-running work.
- It reduces the "control panel" feel and gives save state, project status, files, Blueprint, database, logs, and gallery more narrative context.
- The document outline is a meaningful alternative to three-pane console repetition.

Risks:
- The page becomes very long, especially on mobile. Important actions may be far apart.
- Document-style presentation risks making operational actions feel like documentation rather than controls.
- The active WordPress preview can become too low-priority for users actively navigating or testing.

Missing flow coverage:
- No modal or drawer depth for start/save/manage flows.
- Save progress, native `.zip` import, and destructive confirmations are not sufficiently modeled.

Future improvement directions:
- Add sticky section actions and compact state summaries in the outline.
- Convert long document sections into expandable task blocks with preserved scroll position.

### `design-018` - Tabbed Project Workspace

Strengths:
- Strong multi-Playground concept. Top-level project tabs map well to saved and temporary Playgrounds.
- Second-level Site/Files/Blueprint/Database/Logs/Settings tabs are efficient and familiar.
- Contextual drawer for start/save/library/export/gallery is a good compromise between persistence and focus.
- Desktop and mobile screenshots show a clearer responsive strategy than many earlier workbenches.

Risks:
- Top project tabs imply real multi-instance state. The prototype needs stronger modeling of switching, unsaved changes, close behavior, and saved identity.
- Agency/client QA framing is useful but may not fit all Playground users.
- Some drawer content is still inventory-like.

Missing flow coverage:
- Project tab creation and saved-library selection are not fully connected.
- Save/local-directory differences and GitHub connection consequences need more depth.

Future improvement directions:
- Make tab state the core of the design: saved badge, unsaved dirty state, close/duplicate, restore from browser storage, and active URL per tab.
- Let drawers perform complete flows rather than only list entry points.

### `design-019` - Command File

Strengths:
- Best expert-oriented Blueprint authoring concept. The first viewport gives Blueprint JSON, bundle actions, files, runtime preview, manager tabs, and gallery in a compact stack.
- The command-bar vocabulary is efficient for repeat users.
- It is materially different from the three-pane pattern and avoids bloated side panels.

Risks:
- Too expert for general Playground use. The UI assumes users understand Blueprint files, commands, and compact menus.
- Several long URL/input values clip in responsive checks.
- Some key flows are hidden behind command menus and may be undiscoverable without keyboard literacy.

Missing flow coverage:
- The command menus expose starts/save/library/settings/export but do not deeply model each flow.
- `.zip` import and GitHub import are compact entries rather than full flows.
- Saved Playgrounds management is present but secondary.

Future improvement directions:
- Treat this as an "author mode" for Blueprint authors, not the default.
- Add stronger command-menu affordances, keyboard hints, and selected-command detail states.
- Show JSON validation, run result, and dirty-file state to make the editor credible.

### `design-020` - Action Cards

Strengths:
- Strong beginner-oriented grouping: Start, Blueprint Catalog, Keep, Site Manager, and Export.
- The split preview/editor gives direct action feedback without overloading the first screen.
- Safety messaging around unsaved state and destructive reset is clearer than many earlier designs.
- The card model helps users discover the breadth of Playground without learning current product menu names.

Risks:
- Cards can become large repeated buttons; some labels and headings already clip at desktop.
- The black/white/cyan palette is bold, but it risks looking less like WordPress tooling.
- The beginner focus may slow expert users unless there is a compact mode or search/command shortcut.

Missing flow coverage:
- The panel model is promising, but several panels still stop at form stubs.
- Blueprint gallery claims are compressed into one card and a limited panel.
- Saved-site delete/rename confirmation is not fully shown.

Future improvement directions:
- Keep the action grouping, but tighten card density and add direct panel state transitions.
- Add a compact expert rail or search affordance so the design scales beyond beginners.

## Highest-Priority Guidance for Future Workers

1. Stop making generic three-pane variants unless the variant proves a new interaction model.
   The swarm already has enough left-launcher/center-preview/right-manager executions. Future work should either refine the best one or explore truly different flow mechanics.

2. Model state transitions, not just feature labels.
   The next round should show at least one complete end-to-end path: start source detail, save destination, progress, saved slug/status, saved list update, rename/delete, settings reset/reload, and export/import result.

3. Make Blueprint gallery fidelity real.
   If a design claims "all 43", show a credible grid/list density, category counts, search results, selected Blueprint detail, and run/inspect behavior. Six cards plus a label is not enough in later rounds.

4. Preserve destructive and temporary-state clarity.
   Playground's biggest user risk is losing temporary work or resetting an unsaved site. Designs should keep unsaved state visible and make reset/reload/save consequences explicit at the moment of action.

5. Differentiate importer flows.
   WordPress PR, Gutenberg PR/branch, GitHub import, Blueprint URL, and `.zip` import are not interchangeable launch cards. Each needs its own input, constraints, and confirmation language.

6. Treat local directory save as a distinct destination.
   It is not just another radio option. Future prototypes should show directory selection, permission/handle state, and how a local-directory Playground differs from browser-backed saved Playgrounds.

7. Improve mobile IA deliberately.
   A long stack of every desktop panel is not enough. Use task tabs, bottom navigation, drawers, sticky action summaries, or project tabs, and verify that primary controls do not disappear below excessive scrolling.

8. Keep visual systems tied to WordPress Playground.
   Bold palettes are acceptable when they serve a role, as in diagnostics or command-file authoring. But repeated black/cyan consoles and abstract thumbnail art can feel detached from WordPress. Use the visual language to clarify state and workflow, not just to restyle.

## Recommended Concepts to Carry Forward

- Carry forward: `design-018` for multi-Playground tab structure, `design-016` for command/search routing, `design-014` for Blueprint discovery, `design-020` for beginner-safe action grouping, `design-015` for diagnostics, and `design-019` as an expert Blueprint author mode.
- Use selectively: `design-013` for saved Playground tables and operational drawers, `design-012` for onboarding/checklist mode, `design-017` for project documentation and long-form project context.
- Consolidate or retire: repeated three-pane variants that do not add a new interaction model, especially those that mainly rearrange the same launcher/preview/manager panels.

The swarm is covering the product surface. The next quality bar is to make fewer, deeper prototypes that prove how users move through the surface without losing work, losing context, or needing to decode every Playground capability at once.
