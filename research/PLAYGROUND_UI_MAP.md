# WordPress Playground UI Map

Research date: May 21, 2026.

Source: live captures of `https://playground.wordpress.net/` with Chromium/Playwright. Screenshots are in `research/screenshots/`; raw frame/control inventories are in `research/raw/`.

## Current Shell

- Top bar: refresh current WordPress page, URL/path input, Save, Saved Playgrounds, Site Manager, and Playground settings.
- Main area: an iframe wrapper containing the active WordPress site. Default boot lands on a Playground welcome page while logged in as `admin`.
- URL/path flow: entering paths such as `/wp-admin/` navigates the embedded WordPress site without leaving the Playground shell.
- The UI distinguishes unsaved temporary Playgrounds from saved browser-backed Playgrounds.

## Save Flow

- `Save` opens a modal titled `Save Playground`.
- The modal explains that a temporary Playground is lost on refresh/close unless saved.
- Required controls: Playground name, storage location, `Save in this browser`, `Save to a local directory`, Cancel, Save.
- While saving to browser storage, the modal shows file-copy progress such as `Saving 3028 / 3751 files`.
- After saving, the shell title changes to `Saved Playground`; the saved item is addressable through a `site-slug` URL.

## Saved Playgrounds

- `Saved Playgrounds` opens a management panel over the active site.
- Start-new cards: Vanilla WordPress, WordPress PR, Gutenberg PR, From GitHub, Blueprint URL, Import .zip.
- Blueprint shortcuts: Art Gallery, Coffee Shop, Feed Reader with the Friends Plugin, Gaming News, Non-profit Organization, and `View all 43 blueprints`.
- Saved list: includes an unsaved Playground entry and saved browser-backed entries with creation dates.
- Per-site action menu: Rename, Delete.
- Import `.zip` triggers the native file chooser rather than an in-page modal.

## Start-New Flows

- Vanilla WordPress immediately starts a fresh Playground.
- WordPress PR opens `Preview a WordPress PR` with `PR NUMBER OR URL`, Cancel, Preview.
- Gutenberg PR opens `Preview a Gutenberg PR or Branch` with `PR NUMBER, URL, OR A BRANCH NAME`, Cancel, Preview.
- From GitHub opens `Import from GitHub`, describes importing plugins, themes, and `wp-content` directories from public GitHub repositories, and asks the user to connect a GitHub account. It says the access token is not stored and re-authentication is required after refresh.
- Blueprint URL opens `Run Blueprint from URL` with `BLUEPRINT URL`, Cancel, Run Blueprint.
- View all blueprints opens the Blueprints gallery with category filters: All, Featured, Website, Personal, Content, Themes, Gutenberg, Experiments, WooCommerce, News. It shows all 43 blueprint cards with descriptions and tags.

## Settings

- Quick settings panel: WordPress version, Include older versions, PHP version, Language, Allow network access, Create a multisite network, and `Apply Settings & Reset Playground`.
- Applying settings is destructive for an unsaved Playground and resets the WordPress site.
- Stored Playgrounds have limited configuration options and use `Save & Reload` instead of the unsaved reset action.

## Site Manager

- Opening Site Manager splits the viewport: controls on the left and the active WordPress iframe on the right.
- Header controls: Playground name/status, Rename Playground for saved sites, WP Admin, Homepage, Additional actions.
- Tabs: Settings, File browser, Blueprint, Database, Logs.
- Site Manager can be opened while the embedded site is on the homepage or inside `/wp-admin/`.

## Site Manager Tabs

- Settings: same version/PHP/language/network/multisite controls, with save/reset behavior depending on saved state.
- File browser: file tree under `/wordpress`, New File, New Folder, Browse files, editable code viewer. The captured default file was `/wordpress/wp-config.php`.
- Blueprint: file tree with `blueprint.json`, Create new file, Create new folder, Upload files, Browse files, Copy link to blueprint, Download bundle, Run Blueprint, and an editable JSON/code view.
- Database: early-access notice, database driver `MySQL emulation backed by SQLite`, SQLite database path `/wordpress/wp-content/database/.ht.sqlite`, database size, Download `database.sqlite`, Open Adminer, Open phpMyAdmin.
- Logs: error logs for Playground, WordPress, and PHP; empty state says no problems so far.
- Additional actions: Export to GitHub, Download as `.zip`.

## Feature Preservation Checklist

Every redesign must account for these capabilities, even if the screens are merged, reorganized, or renamed:

- create a vanilla Playground
- create from WordPress PR
- create from Gutenberg PR or branch
- import from GitHub after account connection
- run a Blueprint URL
- import a `.zip`
- browse and filter Blueprint gallery entries
- select featured blueprint shortcuts
- save temporary Playground in browser storage
- save to a local directory
- see save progress
- browse saved and unsaved Playgrounds
- rename a saved Playground
- delete a saved Playground
- navigate active WordPress paths with URL input
- refresh the active embedded WordPress page
- open Homepage and WP Admin
- edit WordPress/PHP/language settings
- include older WordPress versions
- allow network access
- create a multisite network
- understand destructive reset/reload behavior
- use File browser with create folder/file, upload, browse, and code editing affordances
- view/copy/download/run the current Blueprint bundle
- inspect database driver/path/size
- download database.sqlite
- open Adminer and phpMyAdmin
- inspect logs and empty/error states
- export to GitHub
- download a `.zip`

