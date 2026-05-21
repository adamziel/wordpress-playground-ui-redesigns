#!/usr/bin/env bash
set -u -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT/.orchestrator-v2"
LOG_DIR="$STATE_DIR/logs"
LOCK_DIR="$STATE_DIR/locks"
MODEL="${MODEL:-gpt-5.5}"
EFFORT="${EFFORT:-high}"
TOTAL_DESIGNS="${TOTAL_DESIGNS:-50}"

mkdir -p "$LOG_DIR" "$LOCK_DIR" "$ROOT/v2/audits"

completed_count() {
  find "$ROOT/v2/designs" -maxdepth 2 -name manifest.json 2>/dev/null | wc -l | tr -d ' '
}

run_critic() {
  local count="$1"
  local audit_file="$ROOT/v2/audits/critic-round-$(printf "%03d" "$count").md"
  local log_file="$LOG_DIR/critic-round-$(printf "%03d" "$count").log"
  local prompt
  prompt="$(cat <<PROMPT
You are the critic for the WordPress Playground V2 redesign swarm.

Read:
- research/PLAYGROUND_UI_MAP.md
- audits/critic-round-100.md
- designs/design-001/manifest.json and designs/design-001/index.html
- designs/design-003/manifest.json and designs/design-003/index.html
- designs/design-007/manifest.json and designs/design-007/index.html
- v2/data/designs.json
- all completed V2 designs under v2/designs/
- existing V2 audits under v2/audits/

Write a rigorous audit to ${audit_file}. Do not edit designs. Do not add new product requirements. Evaluate whether completed V2 designs go deeper on the Playground Console, Playground Command Deck, and Playground Operations Console family while preserving the current Playground feature surface.

Quality bar:
- Prefer designs that keep the live WordPress shell visible and protected.
- Require complete end-to-end flow modeling, not static feature inventory.
- Check whether save, local directory, saved management, destructive actions, Blueprint gallery/run, file editor, database/logs, GitHub import/export, ZIP import/download, settings reset/reload, and PR/GitHub/Blueprint launch routes preserve current capabilities.
- Identify shallow clones, missing consequences, poor mobile behavior risk, and invented features.
- Name specific V2 designs that should be used as benchmarks, and specific patterns future workers should retire.

Keep the audit concise enough to guide the next workers, but hold a high bar.
PROMPT
)"

  codex exec \
    -m "$MODEL" \
    -c "model_reasoning_effort=\"$EFFORT\"" \
    -s danger-full-access \
    -C "$ROOT" \
    -- \
    "$prompt" \
    >"$log_file" 2>&1 &&
    [[ -f "$audit_file" ]]
}

last_count_file="$STATE_DIR/critic_last_count.txt"
[[ -f "$last_count_file" ]] || printf "0" > "$last_count_file"

echo "v2 critic loop online"
while true; do
  count="$(completed_count)"
  last="$(cat "$last_count_file")"

  if (( count >= TOTAL_DESIGNS && count == last )); then
    echo "v2 critic loop complete"
    exit 0
  fi

  if (( count > last && ( count - last >= 10 || count == TOTAL_DESIGNS ) )); then
    echo "v2 critic: reviewing $count completed designs"
    if run_critic "$count"; then
      flock "$LOCK_DIR/integrate.lock" bash -c '
        set -euo pipefail
        root="$1"
        count="$2"
        cd "$root"
        git checkout master >/dev/null 2>&1 || true
        git pull --ff-only origin master
        printf "%s" "$count" > .orchestrator-v2/critic_last_count.txt
        git add v2/audits
        if ! git diff --cached --quiet; then
          git commit -m "Add V2 critic audit for ${count} designs"
          git push origin master
        fi
      ' _ "$ROOT" "$count"
    else
      echo "v2 critic: session failed; it will retry"
    fi
  fi

  sleep 45
done
