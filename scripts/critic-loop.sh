#!/usr/bin/env bash
set -u -o pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT/.orchestrator"
LOG_DIR="$STATE_DIR/logs"
LOCK_DIR="$STATE_DIR/locks"
MODEL="${MODEL:-gpt-5.5}"
EFFORT="${EFFORT:-high}"
TOTAL_DESIGNS="${TOTAL_DESIGNS:-100}"

mkdir -p "$LOG_DIR" "$LOCK_DIR" "$ROOT/audits"

next_round() {
  local count
  count="$(find "$ROOT/designs" -maxdepth 2 -name manifest.json | wc -l | tr -d ' ')"
  printf "%s" "$count"
}

run_critic() {
  local count="$1"
  local audit_file="$ROOT/audits/critic-round-$(printf "%03d" "$count").md"
  local log_file="$LOG_DIR/critic-round-$(printf "%03d" "$count").log"
  local prompt
  prompt="$(cat <<PROMPT
You are the critic for the WordPress Playground redesign swarm.

Read:
- research/PLAYGROUND_UI_MAP.md
- data/designs.json
- all completed designs under designs/
- existing audits under audits/

Write a rigorous audit to ${audit_file}. Do not edit designs. Do not add new product requirements. Evaluate whether completed designs preserve the current Playground feature surface, improve discoverability/usability, remain high fidelity, and avoid shallow restyles.

For each newly visible pattern or notable design, identify concrete strengths, concrete usability risks, missing flow coverage, visual/information architecture problems, and specific improvement directions for future workers. Keep a high quality bar.
PROMPT
)"

  codex exec \
    -m "$MODEL" \
    -c "model_reasoning_effort=\"$EFFORT\"" \
    -s danger-full-access \
    -C "$ROOT" \
    "$prompt" \
    >"$log_file" 2>&1
}

last_count_file="$STATE_DIR/critic_last_count.txt"
[[ -f "$last_count_file" ]] || printf "0" > "$last_count_file"

echo "critic loop online"
while true; do
  count="$(next_round)"
  last="$(cat "$last_count_file")"

  if (( count >= TOTAL_DESIGNS && count == last )); then
    echo "critic loop complete"
    exit 0
  fi

  if (( count > last && ( count - last >= 10 || count == TOTAL_DESIGNS ) )); then
    echo "critic: reviewing $count completed designs"
    if run_critic "$count"; then
      flock "$LOCK_DIR/integrate.lock" bash -c '
        set -euo pipefail
        root="$1"
        count="$2"
        cd "$root"
        printf "%s" "$count" > .orchestrator/critic_last_count.txt
        git add audits
        if ! git diff --cached --quiet; then
          git commit -m "Add critic audit for ${count} designs"
          git push origin master
        fi
      ' _ "$ROOT" "$count"
    else
      echo "critic: session failed; it will retry"
    fi
  fi

  sleep 45
done
