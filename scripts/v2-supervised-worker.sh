#!/usr/bin/env bash
set -u -o pipefail

WORKER_ID="${1:?worker id required}"

while true; do
  bash scripts/v2-worker-loop.sh "$WORKER_ID"
  status=$?
  if (( status == 0 )); then
    echo "$WORKER_ID complete"
    exit 0
  fi
  echo "$WORKER_ID exited with status $status; restarting in 20 seconds"
  sleep 20
done
