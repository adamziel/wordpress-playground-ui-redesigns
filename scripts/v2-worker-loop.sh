#!/usr/bin/env bash
set -u -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKER_ID="${1:?worker id required}"
TOTAL_DESIGNS="${TOTAL_DESIGNS:-50}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-3}"
MODEL="${MODEL:-gpt-5.5}"
EFFORT="${EFFORT:-high}"
AGENT_TIMEOUT_SECONDS="${AGENT_TIMEOUT_SECONDS:-7200}"
STATE_DIR="$ROOT/.orchestrator-v2"
TMP_DIR="$STATE_DIR/tmp"
LOG_DIR="$STATE_DIR/logs"
LOCK_DIR="$STATE_DIR/locks"
CLAIM_DIR="$STATE_DIR/claims"
WORKTREES_DIR="$ROOT/.worktrees-v2"
MAIN_BRANCH="${MAIN_BRANCH:-master}"
LEASE_SECONDS="${LEASE_SECONDS:-21600}"
CURRENT_DESIGN_ID=""

mkdir -p "$TMP_DIR" "$LOG_DIR" "$LOCK_DIR" "$CLAIM_DIR" "$WORKTREES_DIR" "$ROOT/v2/designs"

release_current_claim() {
  if [[ -n "$CURRENT_DESIGN_ID" ]]; then
    rm -f "$CLAIM_DIR/$CURRENT_DESIGN_ID.claim"
  fi
}

trap release_current_claim EXIT INT TERM

allocate_design() {
  flock "$LOCK_DIR/queue.lock" bash -c '
    set -u -o pipefail
    total="$1"
    root="$2"
    claim_dir="$3"
    worker_id="$4"
    lease_seconds="$5"
    now="$(date +%s)"
    completed="$(find "$root/v2/designs" -maxdepth 2 -name manifest.json 2>/dev/null | wc -l | tr -d " ")"

    if (( completed >= total )); then
      exit 10
    fi

    for num in $(seq 1 "$total"); do
      design_id="v2-design-$(printf "%03d" "$num")"
      if [[ -f "$root/v2/designs/$design_id/manifest.json" ]]; then
        continue
      fi

      claim="$claim_dir/$design_id.claim"
      if [[ -f "$claim" ]]; then
        claimed_at="$(awk "NR==2 {print}" "$claim" 2>/dev/null || true)"
        if [[ "$claimed_at" =~ ^[0-9]+$ ]] && (( now - claimed_at < lease_seconds )); then
          continue
        fi
        rm -f "$claim"
      fi

      {
        printf "%s\n" "$worker_id"
        printf "%s\n" "$now"
      } > "$claim"
      printf "%s\n" "$num"
      exit 0
    done

    exit 11
  ' _ "$TOTAL_DESIGNS" "$ROOT" "$CLAIM_DIR" "$WORKER_ID" "$LEASE_SECONDS"
}

write_prompt() {
  local design_num="$1"
  local design_id="$2"
  local prompt_file="$3"
  local brief
  brief="$(node "$ROOT/scripts/v2-design-brief.mjs" "$design_num")"
  cat > "$prompt_file" <<PROMPT
You are worker ${WORKER_ID} producing ${design_id}, one of 50 additional WordPress Playground UI redesign explorations for the V2 gallery.

Read these first:
- README.md
- research/PLAYGROUND_UI_MAP.md
- designs/design-001/manifest.json
- designs/design-003/manifest.json
- designs/design-007/manifest.json
- audits/critic-round-100.md
- the screenshots in research/screenshots/ when you need visual grounding

Hard constraints:
- Write only inside v2/designs/${design_id}/.
- Do not edit root designs, v2/index.html, v2/data, package files, research files, gallery files, scripts, audits, or other design folders.
- Do not commit, branch, push, start servers, or use network tunnels.
- Build a static high-fidelity wireframe with plain HTML/CSS/JS that works on GitHub Pages by opening v2/designs/${design_id}/index.html.
- Preserve current Playground capabilities. You may reorganize, merge, rename, or reframe screens, but do not add product features that do not exist in the captured UI.
- Stay in the same design family as Playground Console, Playground Command Deck, and Playground Operations Console. V2 is about going deeper on that family, not restarting the broad exploration.
- Make the first viewport an actual usable app screen, not a marketing page.
- Keep it responsive for desktop and mobile. Avoid overlapping text, cramped buttons, horizontal scrolling, one-note palettes, and decorative filler.

Current Playground capabilities that must remain visible somewhere:
- Create routes: Vanilla WordPress, WordPress PR, Gutenberg PR or branch, GitHub import with account connection, Blueprint URL, and .zip import.
- Current shell: path input, refresh, Homepage, WP Admin, temporary/saved state, Save, and reset/reload consequences.
- Save flows: Save in this browser, Save to a local directory, progress, resulting saved identity, and saved/local/temporary differences.
- Saved management: saved and unsaved list, open/manage, rename, delete with confirmation and final state.
- Site Manager: Settings, Files, Blueprint, Database, Logs, Export to GitHub, and Download as zip.
- Files: create file, create folder, upload, browse files, selected file/editor, dirty/save or result state.
- Blueprint tools: gallery categories/search, selected Blueprint detail, Blueprint URL, editor, copy, download, run, validation or result state.
- Database/logs: SQLite-backed database path and size, database download, Adminer, phpMyAdmin, Playground/WordPress/PHP logs.
- Portability: GitHub import/export, ZIP import/download, database download, Blueprint bundle actions.

Quality bar from the critic:
- Finish at least one complete save flow and one destructive or replacement flow end to end.
- Actions must visibly mutate the same active Playground objects users rely on: shell title, path, storage badge, saved rows, manager tabs, transfer history, and preview state.
- Do not present a static checklist. Use controls, statuses, progress, confirmations, and result states.
- Treat Save in this browser and Save to a local directory as distinct destinations with different consequences.
- Distinguish the launch/import routes with their real inputs and constraints.
- Make the Blueprint gallery credible. If you do not show all 43 items, label the subset honestly.
- Keep the live WordPress shell protected in the layout. It should not disappear behind management inventory.

Required output:
- v2/designs/${design_id}/index.html
- v2/designs/${design_id}/manifest.json
- optional v2/designs/${design_id}/README.md, styles.css, app.js, or assets if useful

manifest.json must include:
{
  "id": "${design_id}",
  "title": "...",
  "concept": "...",
  "focus": ["..."],
  "flows": ["..."],
  "featureCoverage": ["..."]
}

Assigned V2 redesign direction:
${brief}

Treat the assigned direction as mandatory. Make ${design_id} meaningfully different from earlier V2 entries by changing the object model, navigation structure, command grouping, density, terminology, visual rhythm, or first-viewport workflow. Do not copy a previous design and do not drift into a generic admin dashboard.
PROMPT
}

run_codex() {
  local worktree="$1"
  local prompt_file="$2"
  local log_file="$3"
  timeout "$AGENT_TIMEOUT_SECONDS" \
    codex exec \
      -m "$MODEL" \
      -c "model_reasoning_effort=\"$EFFORT\"" \
      -s danger-full-access \
      -C "$worktree" \
      -i "$worktree/research/screenshots/12-home-with-frame-text.png" \
      -i "$worktree/research/screenshots/17-saved-playgrounds-list.png" \
      -i "$worktree/research/screenshots/18-site-manager.png" \
      -i "$worktree/research/screenshots/22-site-manager-file-browser.png" \
      -i "$worktree/research/screenshots/23-site-manager-blueprint.png" \
      -i "$worktree/research/screenshots/24-site-manager-database.png" \
      -i "$worktree/research/screenshots/34-blueprints-gallery.png" \
      -- \
      "$(cat "$prompt_file")" \
      >"$log_file" 2>&1
}

integrate_design() {
  local design_id="$1"
  local worktree="$2"
  local log_file="$3"
  flock "$LOCK_DIR/integrate.lock" bash -c '
    set -u -o pipefail
    root="$1"
    design_id="$2"
    worktree="$3"
    log_file="$4"
    main_branch="$5"
    target="v2/designs/$design_id"

    cd "$root" || exit 1
    git checkout "$main_branch" >> "$log_file" 2>&1 || true
    git pull --ff-only origin "$main_branch" >> "$log_file" 2>&1 || exit 1

    if [[ ! -d "$worktree/$target" ]]; then
      echo "Missing $target in worktree" >> "$log_file"
      exit 1
    fi

    rm -rf "$target"
    mkdir -p v2/designs
    if ! rsync -a --delete "$worktree/$target/" "$target/" >> "$log_file" 2>&1; then
      rm -rf "$target"
      node scripts/build-v2-gallery.mjs >> "$log_file" 2>&1 || true
      exit 1
    fi

    if ! node scripts/validate-v2-design.mjs "$design_id" >> "$log_file" 2>&1; then
      rm -rf "$target"
      node scripts/build-v2-gallery.mjs >> "$log_file" 2>&1 || true
      exit 1
    fi

    if ! node scripts/build-v2-gallery.mjs >> "$log_file" 2>&1; then
      rm -rf "$target"
      node scripts/build-v2-gallery.mjs >> "$log_file" 2>&1 || true
      exit 1
    fi

    git add "$target" v2/data/designs.json v2/index.html
    if git diff --cached --quiet; then
      echo "No staged changes for $design_id; pushing current branch state" >> "$log_file"
      git push origin "$main_branch" >> "$log_file" 2>&1
      exit 0
    fi

    git commit -m "Add $design_id" >> "$log_file" 2>&1 || exit 1
    git push origin "$main_branch" >> "$log_file" 2>&1 || exit 1
  ' _ "$ROOT" "$design_id" "$worktree" "$log_file" "$MAIN_BRANCH"
}

cleanup_worktree() {
  local branch="$1"
  local worktree="$2"
  flock "$LOCK_DIR/worktree.lock" bash -c '
    set +e
    root="$1"
    branch="$2"
    worktree="$3"
    cd "$root" || exit 0
    git worktree remove --force "$worktree" >/dev/null 2>&1
    git branch -D "$branch" >/dev/null 2>&1
    git worktree prune >/dev/null 2>&1
  ' _ "$ROOT" "$branch" "$worktree"
}

echo "v2 worker $WORKER_ID online"
while true; do
  design_num=""
  design_num="$(allocate_design)"
  status=$?
  if (( status != 0 )); then
    if (( status == 10 )); then
      echo "v2 worker $WORKER_ID: all V2 designs are complete"
      exit 0
    fi
    echo "v2 worker $WORKER_ID: all unfinished designs are currently claimed; waiting"
    sleep 60
    continue
  fi

  design_id="v2-design-$(printf "%03d" "$design_num")"
  CURRENT_DESIGN_ID="$design_id"
  attempt=1

  while true; do
    stamp="$(date +%s)"
    branch="worker/${design_id}-${WORKER_ID}-attempt-${attempt}-${stamp}"
    worktree="$WORKTREES_DIR/${design_id}-${WORKER_ID}-attempt-${attempt}-${stamp}"
    prompt_file="$TMP_DIR/${design_id}-${WORKER_ID}-attempt-${attempt}.md"
    log_file="$LOG_DIR/${design_id}-${WORKER_ID}-attempt-${attempt}.log"
    echo "v2 worker $WORKER_ID: starting $design_id attempt $attempt"
    write_prompt "$design_num" "$design_id" "$prompt_file"

    flock "$LOCK_DIR/worktree.lock" bash -c '
      set -euo pipefail
      root="$1"
      branch="$2"
      worktree="$3"
      main_branch="$4"
      cd "$root"
      rm -rf "$worktree"
      git worktree prune >/dev/null 2>&1 || true
      git worktree add -B "$branch" "$worktree" "$main_branch"
    ' _ "$ROOT" "$branch" "$worktree" "$MAIN_BRANCH" >"$log_file" 2>&1

    if run_codex "$worktree" "$prompt_file" "$log_file"; then
      if integrate_design "$design_id" "$worktree" "$log_file"; then
        echo "$design_id completed by v2 worker $WORKER_ID" | tee -a "$LOG_DIR/completed.log"
        cleanup_worktree "$branch" "$worktree"
        rm -f "$CLAIM_DIR/$design_id.claim"
        CURRENT_DESIGN_ID=""
        break
      fi
      echo "v2 worker $WORKER_ID: integration failed for $design_id attempt $attempt, see $log_file"
    else
      echo "v2 worker $WORKER_ID: agent failed or timed out for $design_id attempt $attempt, see $log_file"
    fi

    cleanup_worktree "$branch" "$worktree"
    attempt=$((attempt + 1))
    if (( attempt > MAX_ATTEMPTS )); then
      echo "$design_id failed after $MAX_ATTEMPTS attempts by v2 worker $WORKER_ID; releasing claim for reassignment" | tee -a "$LOG_DIR/failed.log"
      rm -f "$CLAIM_DIR/$design_id.claim"
      CURRENT_DESIGN_ID=""
      sleep 60
      break
    fi
  done
done
