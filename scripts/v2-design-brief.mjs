const number = Number(process.argv[2] || 0);
if (!Number.isInteger(number) || number < 1 || number > 50) {
  console.error('Usage: node scripts/v2-design-brief.mjs <1-50>');
  process.exit(2);
}

const models = [
  {
    name: 'Preview-protecting command deck',
    instruction:
      'Keep the live WordPress shell large and persistent while a command deck exposes start routes, save destinations, Site Manager tools, Blueprint gallery, and transfers without modal hopping.',
  },
  {
    name: 'Operations rail console',
    instruction:
      'Use a left operational rail with Create, Save, Library, Manage, Blueprints, Data, Logs, and Transfer modes. The selected mode must mutate visible Playground state instead of only swapping copy.',
  },
  {
    name: 'Saved object control center',
    instruction:
      'Treat temporary, browser-saved, and local-directory Playgrounds as first-class objects with state, ownership, rename/delete, current selection, and action availability.',
  },
  {
    name: 'Blueprint command console',
    instruction:
      'Make Blueprint search, categories, selected detail, URL runner, JSON editor, run/copy/download actions, and replace-current warnings central while still preserving PR, GitHub, ZIP, save, and manager flows.',
  },
  {
    name: 'Transfer and portability deck',
    instruction:
      'Organize around browser save, local directory save, GitHub import/export, ZIP import/download, database download, and Blueprint bundle copy/download/run as related operational transfers.',
  },
  {
    name: 'File and data operations workbench',
    instruction:
      'Lead with Site Manager files, Blueprint JSON, database, and logs beside the live site. Include credible editor dirty states, save/apply, validation, download, Adminer, and phpMyAdmin outcomes.',
  },
  {
    name: 'PR and branch review console',
    instruction:
      'Frame WordPress PR, Gutenberg PR or branch, GitHub import, and vanilla WordPress starts as distinct launch contracts with their inputs, constraints, progress, and resulting active Playground identity.',
  },
  {
    name: 'Runtime settings control room',
    instruction:
      'Make WordPress version, PHP version, language, network, multisite, older versions, reset, and saved-site reload consequences highly discoverable while keeping save and management close at hand.',
  },
  {
    name: 'Support diagnostics console',
    instruction:
      'Prioritize status, logs, database path/size, transfer history, selected site state, and realistic warnings while still letting users create, save, import, export, and manage Playgrounds.',
  },
  {
    name: 'Command search cockpit',
    instruction:
      'Use command search and grouped command results as the discovery layer, backed by persistent panels that show route-specific forms, consequences, progress, and final state mutations.',
  },
];

const variations = [
  {
    name: 'Large browser plus right inspector',
    layout: 'full-width live browser with a right inspector and compact top command bar',
    visual: 'neutral WordPress admin palette with blue, green, amber, and red state accents',
    emphasis: 'first viewport must show active path, save state, WP Admin/Homepage, selected command, and saved identity',
  },
  {
    name: 'Ledger and event stream',
    layout: 'two-column console with an operations ledger, event stream, and visible object mutation',
    visual: 'light technical surface with thin borders, status chips, and restrained dark text',
    emphasis: 'show save, rename, delete, import, and export as events that alter the same selected Playground object',
  },
  {
    name: 'Dense deck for power users',
    layout: 'dense command deck with grouped controls, keyboard-like affordances, and explicit labels',
    visual: 'high-contrast black and white shell balanced by readable white content panels',
    emphasis: 'avoid letter-only navigation; every expert accelerator needs a readable label and visible result state',
  },
  {
    name: 'Responsive tabbed console',
    layout: 'tabbed operations workspace that becomes bottom navigation and stacked drawers on mobile',
    visual: 'clean SaaS/admin styling with compact controls and clear destructive-action treatment',
    emphasis:
      'mobile must expose current path, save state, start action, Site Manager, and saved Playgrounds without horizontal overflow',
  },
  {
    name: 'Admin table plus selected detail',
    layout: 'table-led saved/transfer management with a persistent selected-detail panel and embedded live preview',
    visual: 'professional dashboard palette with neutral grays, blue links, green success, and amber warnings',
    emphasis: 'table rows must transform through temporary, saving, saved, local permission, deleted, imported, and exported states',
  },
];

const flowTargets = [
  'finish browser save end to end: unsaved state, destination choice, file-copy progress, saved row insertion, active title update, and reset/reload change',
  'finish local-directory save end to end: folder picker, permission state, progress, selected folder identity, local badge, and reload consequence',
  'finish destructive delete or reset end to end: warning, cancel, confirm, progress when relevant, final row removal or reset state, and active-site fallback',
  'finish ZIP import or GitHub import end to end: source selection, replacement warning, progress, failure/success state, and active Playground identity update',
  'finish Blueprint run or editor apply end to end: select, inspect JSON, validate, warn about replacing current content, run progress, result, and preview state',
  'finish file or database operation end to end: select file/database, dirty or download state, action progress, success/error, and logs/event record',
  'finish PR/branch preview end to end: route-specific input, validation, loading, resulting preview identity, and save/export availability',
  'finish GitHub export or ZIP download end to end: destination/source status, progress, generated result, and transfer history',
  'finish settings Save & Reload end to end: version/PHP/language/network change, unsaved reset warning, stored reload behavior, and final runtime badge',
  'finish command search discovery end to end: query, grouped result, selected command form, action progress, and visible mutation of shell or selected object',
];

const model = models[(number - 1) % models.length];
const round = Math.floor((number - 1) / models.length);
const variation = variations[round];
const primaryFlow = flowTargets[(number + round * 2 - 1) % flowTargets.length];
const secondaryFlow = flowTargets[(number + round * 2 + 3) % flowTargets.length];

console.log(
  JSON.stringify(
    {
      number,
      model: model.name,
      direction: model.instruction,
      variation: variation.name,
      layout: variation.layout,
      visualLanguage: variation.visual,
      emphasis: variation.emphasis,
      requiredPrimaryFlow: primaryFlow,
      requiredSecondaryFlow: secondaryFlow,
      familyConstraint:
        'Stay close to Playground Console, Playground Command Deck, and Playground Operations Console. Explore a different layout, density, terminology, object model, or interaction pattern, but do not drift into a marketing page or unrelated dashboard.',
    },
    null,
    2
  )
);
