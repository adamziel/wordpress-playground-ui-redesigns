#!/usr/bin/env bash
set -u -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKER_ID="${1:?worker id required}"
TOTAL_DESIGNS="${TOTAL_DESIGNS:-100}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-3}"
MODEL="${MODEL:-gpt-5.5}"
EFFORT="${EFFORT:-high}"
STATE_DIR="$ROOT/.orchestrator"
TMP_DIR="$STATE_DIR/tmp"
LOG_DIR="$STATE_DIR/logs"
LOCK_DIR="$STATE_DIR/locks"
WORKTREES_DIR="$ROOT/.worktrees"
MAIN_BRANCH="${MAIN_BRANCH:-master}"

mkdir -p "$TMP_DIR" "$LOG_DIR" "$LOCK_DIR" "$WORKTREES_DIR"

allocate_design() {
  flock "$LOCK_DIR/queue.lock" bash -c '
    set -euo pipefail
    next_file="$1"
    total="$2"
    root="$3"
    if [[ ! -f "$next_file" ]]; then
      printf "1" > "$next_file"
    fi
    next="$(cat "$next_file")"
    while (( next <= total )); do
      design_id="design-$(printf "%03d" "$next")"
      if [[ ! -f "$root/designs/$design_id/manifest.json" ]]; then
        printf "%s" "$((next + 1))" > "$next_file"
        printf "%s\n" "$next"
        exit 0
      fi
      next=$((next + 1))
    done
    printf "%s" "$next" > "$next_file"
    exit 10
  ' _ "$STATE_DIR/next_design.txt" "$TOTAL_DESIGNS" "$ROOT"
}

write_prompt() {
  local design_num="$1"
  local design_id="$2"
  local prompt_file="$3"
  local brief
  brief="$(node "$ROOT/scripts/design-brief.mjs" "$design_num")"
  cat > "$prompt_file" <<PROMPT
You are worker ${WORKER_ID} producing ${design_id}, one of 100 independent WordPress Playground UI redesign explorations.

Read these first:
- research/PLAYGROUND_UI_MAP.md
- README.md
- the screenshots in research/screenshots/ when you need visual grounding

Hard constraints:
- Write only inside designs/${design_id}/.
- Do not edit package files, research files, gallery files, scripts, audits, or other design folders.
- Do not commit, branch, push, or use network tunnels.
- Build a static high-fidelity wireframe with plain HTML/CSS/JS that works on GitHub Pages by opening designs/${design_id}/index.html.
- Preserve current Playground capabilities. You may reorganize, merge, rename, or reframe screens, but do not add product features that do not exist in the captured UI.
- The UI must cover creation, saving, saved management, Site Manager, settings, file browser, blueprint, database, logs, export/import, PR starts, GitHub import, and Blueprint gallery flows.
- Make the first viewport an actual usable app screen, not a marketing page.
- Keep it responsive for desktop and mobile. Avoid overlapping text, one-note palettes, and decorative filler.

Required output:
- designs/${design_id}/index.html
- designs/${design_id}/manifest.json
- optional designs/${design_id}/README.md, styles.css, app.js, or assets if useful

manifest.json must include:
{
  "id": "${design_id}",
  "title": "...",
  "concept": "...",
  "focus": ["..."],
  "flows": ["..."],
  "featureCoverage": ["..."]
}

Make ${design_id} meaningfully different from the other designs by choosing a distinct information architecture, navigation model, density, terminology strategy, or workflow emphasis. Do not produce a shallow restyle.

Assigned redesign direction for this session:
${brief}

Treat the assigned direction as mandatory. If it conflicts with your first instinct, follow the assigned direction. Preserve all current Playground capabilities, but force the information architecture, visual model, and first viewport to match the assigned direction. Avoid defaulting to a generic three-pane operations console unless the assigned direction explicitly asks for that.
PROMPT
}

run_codex() {
  local worktree="$1"
  local prompt_file="$2"
  local log_file="$3"
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
    set -euo pipefail
    root="$1"
    design_id="$2"
    worktree="$3"
    log_file="$4"
    main_branch="$5"

    cd "$root"
    git checkout "$main_branch" >/dev/null 2>&1 || true
    if [[ -d "designs/$design_id" ]]; then
      rm -rf "designs/$design_id"
    fi
    mkdir -p designs
    rsync -a --delete "$worktree/designs/$design_id/" "designs/$design_id/"
    node scripts/validate-design.mjs "$design_id"
    node scripts/build-gallery.mjs
    git add "designs/$design_id" data/designs.json index.html
    if git diff --cached --quiet; then
      echo "No staged changes for $design_id; pushing current branch state" >> "$log_file"
      git push origin "$main_branch" >> "$log_file" 2>&1
      return 0
    fi
    git commit -m "Add $design_id" >> "$log_file" 2>&1
    git push origin "$main_branch" >> "$log_file" 2>&1
  ' _ "$ROOT" "$design_id" "$worktree" "$log_file" "$MAIN_BRANCH"
}

cleanup_worktree() {
  local design_id="$1"
  local worktree="$2"
  flock "$LOCK_DIR/worktree.lock" bash -c '
    set +e
    root="$1"
    design_id="$2"
    worktree="$3"
    cd "$root"
    git worktree remove --force "$worktree" >/dev/null 2>&1
    git branch -D "worker/$design_id" >/dev/null 2>&1
  ' _ "$ROOT" "$design_id" "$worktree"
}

echo "worker $WORKER_ID online"
while true; do
  if ! design_num="$(allocate_design)"; then
    echo "worker $WORKER_ID: no more designs to allocate"
    exit 0
  fi

  design_id="design-$(printf "%03d" "$design_num")"
  attempt=1

  while true; do
    worktree="$WORKTREES_DIR/${design_id}-${WORKER_ID}-attempt-${attempt}"
    prompt_file="$TMP_DIR/${design_id}-${WORKER_ID}-attempt-${attempt}.md"
    log_file="$LOG_DIR/${design_id}-${WORKER_ID}-attempt-${attempt}.log"
    echo "worker $WORKER_ID: starting $design_id attempt $attempt"
    write_prompt "$design_num" "$design_id" "$prompt_file"

    flock "$LOCK_DIR/worktree.lock" git -C "$ROOT" worktree add -B "worker/$design_id" "$worktree" "$MAIN_BRANCH" >"$log_file" 2>&1

    if run_codex "$worktree" "$prompt_file" "$log_file"; then
      if integrate_design "$design_id" "$worktree" "$log_file"; then
        echo "$design_id completed by worker $WORKER_ID" | tee -a "$LOG_DIR/completed.log"
        cleanup_worktree "$design_id" "$worktree"
        break
      fi
      echo "worker $WORKER_ID: integration failed for $design_id attempt $attempt, see $log_file"
    else
      echo "worker $WORKER_ID: agent failed for $design_id attempt $attempt, see $log_file"
    fi

    cleanup_worktree "$design_id" "$worktree"
    attempt=$((attempt + 1))
    if (( attempt > MAX_ATTEMPTS )); then
      echo "$design_id failed after $MAX_ATTEMPTS attempts by worker $WORKER_ID; pausing before retrying same design" | tee -a "$LOG_DIR/failed.log"
      sleep 120
      attempt=1
    fi
  done
done
