# Working rules for this repository

## Hard rule: push early, push often

This project is developed in ephemeral cloud containers. **Anything not pushed to GitHub is lost when the container is reset** — this has already cost one full rebuild.

- Commit **and push** after every meaningful milestone (a working, tested unit of change), not just at the end of a task.
- Verify a push actually landed (`git status -sb` shows no `ahead`, or `git log origin/<branch> -1`) — don't assume.
- **If a push fails (403, auth, network), stop building and tell the user immediately** that the work is not saved and why. Never keep stacking unpushed work on top of a failed push.
- Before ending any turn: nothing uncommitted, nothing unpushed — or say explicitly what isn't saved.

This is enforced by a Stop hook (`.claude/hooks/require-pushed.sh`, configured in `.claude/settings.json`) that blocks ending a turn while there are uncommitted files or unpushed commits.
