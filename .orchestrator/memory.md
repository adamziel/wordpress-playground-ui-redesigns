# Memory

- Only port `8080` is externally exposed in this sandbox. Do not use ngrok, cloudflared tunnels, localtunnel, serveo, localhost.run, Tailscale Funnel, or similar tools.
- Public PR/branch/comment text must not mention Codex or generated-by attribution.
- Design workers write only to their assigned `designs/design-###/` folder inside an isolated worktree. Integration into `master` is serialized by `scripts/worker-loop.sh`.
- Gallery generation is handled by `scripts/build-gallery.mjs`.
- The live Playground feature map is in `research/PLAYGROUND_UI_MAP.md`; workers must preserve those capabilities without adding new product features.

