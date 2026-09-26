#!/usr/bin/env bash
# Stop hook: don't let a turn end while work exists only in this container.
# Cloud sessions run in ephemeral containers — anything not pushed to GitHub
# is lost when the container is reclaimed.

input=$(cat)

# Loop guard: if we already blocked this stop once, let it through so a
# genuinely unpushable state (e.g. a 403 on push) can still be reported.
if [ "$(printf '%s' "$input" | jq -r '.stop_hook_active // false')" = "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

problems=()

dirty=$(git status --porcelain)
if [ -n "$dirty" ]; then
  problems+=("$(printf '%s\n' "$dirty" | wc -l | tr -d ' ') uncommitted/untracked file(s)")
fi

branch=$(git rev-parse --abbrev-ref HEAD)
if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null); then
  ahead=$(git rev-list --count "$upstream"..HEAD)
  [ "$ahead" -gt 0 ] && problems+=("$ahead commit(s) on $branch not pushed to $upstream")
else
  problems+=("branch $branch has no upstream (never pushed)")
fi

if [ ${#problems[@]} -gt 0 ]; then
  summary=$(printf '%s; ' "${problems[@]}")
  summary=${summary%; }
  reason="Unsaved work: $summary. This container is ephemeral — commit and push (git push -u origin $branch) before ending the turn. If the push fails, tell the user plainly that the work is NOT saved and why."
  jq -n --arg r "$reason" '{decision: "block", reason: $r}'
fi
exit 0
