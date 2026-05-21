#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOCKET="${TMUX_SOCKET:-playground-redesign}"
SESSION="${TMUX_SESSION:-wp-playground-redesign}"

tmux -L "$SOCKET" has-session -t "$SESSION" 2>/dev/null && {
  echo "tmux swarm already running."
  echo "Attach with: tmux -L $SOCKET attach -t $SESSION"
  exit 0
}

tmux -L "$SOCKET" new-session -d -s "$SESSION" -n supervisor -c "$ROOT" "watch -n 5 'printf \"WordPress Playground redesign swarm\\n\\n\"; git status --short --branch; printf \"\\nCompleted designs: \"; find designs -maxdepth 2 -name manifest.json | wc -l; printf \"\\nLast completions:\\n\"; tail -n 20 .orchestrator/logs/completed.log 2>/dev/null || true; printf \"\\nFailures:\\n\"; tail -n 20 .orchestrator/logs/failed.log 2>/dev/null || true'"

for i in $(seq 1 10); do
  worker_id="worker-$(printf "%02d" "$i")"
  tmux -L "$SOCKET" new-window -t "$SESSION" -n "$worker_id" -c "$ROOT" "bash scripts/worker-loop.sh $worker_id"
done

tmux -L "$SOCKET" new-window -t "$SESSION" -n critic -c "$ROOT" "bash scripts/critic-loop.sh"
tmux -L "$SOCKET" select-window -t "$SESSION:supervisor"

echo "Started tmux swarm."
echo "Attach with: tmux -L $SOCKET attach -t $SESSION"

