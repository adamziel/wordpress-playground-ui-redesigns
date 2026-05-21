const number = Number(process.argv[2] || 0);
if (!Number.isInteger(number) || number < 1) {
  console.error('Usage: node scripts/design-brief.mjs <number>');
  process.exit(2);
}

const archetypes = [
  {
    name: 'Guided launch wizard',
    instruction: 'Use a step-by-step creation flow as the primary model, with saved Playgrounds and Site Manager available as side tasks. Avoid a generic three-pane operations console.',
  },
  {
    name: 'Saved-sites library',
    instruction: 'Start from a library/dashboard of saved and unsaved Playgrounds, then expose creation and management as actions on the library. The active site is secondary until a Playground is selected.',
  },
  {
    name: 'Blueprint-first gallery',
    instruction: 'Make Blueprints the organizing center: category filters, featured cards, Blueprint URL, current blueprint editing, and run/download/copy actions should dominate the experience.',
  },
  {
    name: 'Developer file-and-data IDE',
    instruction: 'Organize around a developer IDE metaphor with file tree, blueprint JSON, database tools, logs, and live preview. Creation and saving should be discoverable but not the visual center.',
  },
  {
    name: 'Browser chrome redesign',
    instruction: 'Reimagine Playground as a browser with tabs, address bar, save state, and side drawers. Keep Site Manager and saved Playgrounds reachable through browser-like controls.',
  },
  {
    name: 'Command palette and inspector',
    instruction: 'Make a command palette/search launcher the core discovery mechanism. Every current action should be findable and grouped without adding new capabilities.',
  },
  {
    name: 'Task board workflow',
    instruction: 'Use a kanban/task-board model for Create, Save, Manage, Inspect, Export, and Debug lanes. The live site can be a preview panel within the board.',
  },
  {
    name: 'Mobile-first compact shell',
    instruction: 'Prioritize a mobile/touch layout with bottom navigation, stacked panels, and compact controls, then scale up to desktop. Do not start from a desktop three-column console.',
  },
  {
    name: 'Settings-first configuration studio',
    instruction: 'Lead with WordPress/PHP/language/network configuration and destructive reset/reload clarity, then route into launch, saved sites, and manager tools.',
  },
  {
    name: 'Import/export hub',
    instruction: 'Center the design on portability: GitHub import/export, ZIP import/download, local directory save, browser save, and Blueprint bundle download/copy/run.',
  },
  {
    name: 'Split Site Manager takeover',
    instruction: 'Treat Site Manager as the main product surface with tabs for Settings, Files, Blueprint, Database, Logs, and only a narrow embedded site preview.',
  },
  {
    name: 'Onboarding checklist workspace',
    instruction: 'Use a progress/checklist model that helps a new user discover current capabilities in sequence without adding features beyond the captured UI.',
  },
  {
    name: 'Professional admin dashboard',
    instruction: 'Design a dense WordPress-admin-like dashboard for repeated use, with tables, filters, compact actions, and restrained visual style.',
  },
  {
    name: 'Visual blueprint marketplace',
    instruction: 'Use image-rich blueprint cards and category navigation as the first screen, while preserving PR, GitHub, ZIP, save, and manager flows as adjacent actions.',
  },
  {
    name: 'Diagnostics and logs console',
    instruction: 'Lead with status, logs, database details, and environment health. Creation and save flows should be available but the model is operational diagnostics.',
  },
  {
    name: 'Local development launcher',
    instruction: 'Frame the UI around developer workflows: testing PRs, importing GitHub projects, editing files, running blueprints, and exporting results.',
  },
  {
    name: 'Document-style workspace',
    instruction: 'Present the Playground as a document/project with a header, sections, inline settings, and contextual actions instead of app rails or modal stacks.',
  },
  {
    name: 'Tabbed project workspace',
    instruction: 'Use project tabs for multiple Playgrounds and within-project tabs for site, files, blueprints, database, logs, and settings.',
  },
  {
    name: 'Minimal expert toolbar',
    instruction: 'Use a minimalist expert UI with a powerful toolbar, compact menus, and keyboard-like affordances. Make discoverability come from structured menus, not explanatory text.',
  },
  {
    name: 'Beginner cards and actions',
    instruction: 'Use clear grouped action cards for non-expert users, emphasizing feature discovery and safe destructive-action messaging without marketing-page layout.',
  },
];

const layouts = [
  'left navigation plus full-height content',
  'top navigation with contextual drawer',
  'single-column progressive disclosure',
  'split preview and editor',
  'modal-free inline panels',
  'table-led management screen',
  'card grid with detail drawer',
  'bottom navigation for small screens',
  'tabbed workspace',
  'command/search overlay plus results pane',
];

const visual = [
  'neutral WordPress admin-inspired palette with one blue accent',
  'high-contrast black, white, and cyan technical palette',
  'light gray workspace with green status accents',
  'warm editorial accents kept secondary to dense controls',
  'monochrome interface with colored status chips',
  'clean product UI with blue, green, and amber operational states',
  'dark diagnostics surface with light content cards',
  'compact enterprise SaaS styling with thin borders',
  'friendly beginner UI with restrained color blocks',
  'IDE-like styling with code and file affordances',
];

const audience = [
  'first-time WordPress learner',
  'plugin developer',
  'theme author',
  'core contributor reviewing PRs',
  'documentation writer preparing demos',
  'agency developer testing client sites',
  'support engineer reproducing bugs',
  'educator running workshops',
  'Blueprint author',
  'power user managing many saved Playgrounds',
];

const index = (number - 1) % archetypes.length;
const round = Math.floor((number - 1) / archetypes.length) + 1;
const archetype = archetypes[index];

const brief = {
  number,
  archetype: archetype.name,
  direction: archetype.instruction,
  layout: layouts[(number + round * 3) % layouts.length],
  visualLanguage: visual[(number * 2 + round) % visual.length],
  primaryAudience: audience[(number * 3 + round) % audience.length],
  variation: `Round ${round}: make this version materially different from earlier uses of the same archetype by changing density, navigation labels, component hierarchy, and what appears in the first viewport.`,
};

console.log(JSON.stringify(brief, null, 2));

