#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOCKET="${TMUX_SOCKET:-playground-v2-redesign}"
SESSION="${TMUX_SESSION:-wp-playground-v2-redesign}"

tmux -L "$SOCKET" has-session -t "$SESSION" 2>/dev/null && {
  echo "V2 tmux swarm already running."
  echo "Attach with: tmux -L $SOCKET attach -t $SESSION"
  exit 0
}

mkdir -p "$ROOT/.orchestrator-v2/logs" "$ROOT/.orchestrator-v2/tmp" "$ROOT/.orchestrator-v2/locks" "$ROOT/.orchestrator-v2/claims"

tmux -L "$SOCKET" new-session -d -s "$SESSION" -n supervisor -c "$ROOT" "watch -n 5 'printf \"WordPress Playground V2 redesign swarm\\n\\n\"; git status --short --branch; printf \"\\nV2 completed designs: \"; find v2/designs -maxdepth 2 -name manifest.json 2>/dev/null | wc -l; printf \"\\nActive claims:\\n\"; ls .orchestrator-v2/claims 2>/dev/null | sort | sed -n \"1,20p\"; printf \"\\nLast completions:\\n\"; tail -n 20 .orchestrator-v2/logs/completed.log 2>/dev/null || true; printf \"\\nFailures:\\n\"; tail -n 20 .orchestrator-v2/logs/failed.log 2>/dev/null || true'"

for i in $(seq 1 10); do
  worker_id="v2-worker-$(printf "%02d" "$i")"
  tmux -L "$SOCKET" new-window -t "$SESSION" -n "$worker_id" -c "$ROOT" "bash scripts/v2-supervised-worker.sh $worker_id; exec bash"
done

tmux -L "$SOCKET" new-window -t "$SESSION" -n critic -c "$ROOT" "bash scripts/v2-critic-loop.sh; exec bash"
tmux -L "$SOCKET" select-window -t "$SESSION:supervisor"

echo "Started V2 tmux swarm."
echo "Attach with: tmux -L $SOCKET attach -t $SESSION"
