# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from `src/backend/`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

- `/watch` skill lives in `.claude/skills/watch` (MIT, Bradley Bonanno). Needs `ffmpeg` + `yt-dlp` (`pip install yt-dlp`). Use `--no-whisper` when no Groq/OpenAI key is set.
- Noomo Agency inspo: their showreel is a direct MP4 on the homepage (`grep -oE 'https?://[^"]+\.mp4' ` on the fetched HTML), which `/watch` can frame-split.
