# Pinnacle 2027 Project Handoff

Updated: 2026-09-09

## Project identity

- Workspace: `C:\Users\mowls\COWORK\CLIENTS\Imperial Brady - Antigravity`
- GitHub: `https://github.com/greg-hahn/pinnacle-2027.git`
- Vercel project: `gregs-projects-0ad80d66/pinnacle-2027`
- Production: `https://ibcpinnacle.ca`
- French page: `https://ibcpinnacle.ca/fr`
- Vercel production alias: `https://pinnacle-2027.vercel.app`
- Vercel project ID: `prj_po8OPNWjAMqcczPbUnmZwpZkRQYl`
- Vercel organization ID: `team_VXmHhO5GQRGVZC1bu6xrHwgS`

Do not copy tokens or values from `.env.local` into Git, chat, screenshots, or documentation.

## Current repository state

- Production branch: `main`
- Current working branch: `codex/client-preview-client-update`
- Latest committed safeguard: `a645eeb Configure Vercel deployment safeguards`
- Latest content correction: `dff1e4d Fix French president company title`
- The French president line must read `Président, Imperial Brady Canada`.
- `.gitignore` protects `.vercel` and `.env*`.
- `.vercelignore` excludes the unused `images/*.mp4` source video, `node_modules/`, test screenshots, `.git/`, and this handoff document.

The 186 MB source video under `images/` must remain excluded. Including it caused Vercel's 100 MB file-limit failure. The live 32 MB teaser is `assets/video/pinnacle-2027-teaser.mp4` and must not be excluded.

## Deployment behavior

GitHub-to-Vercel automatic deployment is active as of 2026-09-09. A push to `main` triggers a Production deployment. Do not push or merge site changes to `main` before the client approves them.

The safeguards-only push created production deployment `dpl_9j5i8wVSA9xHLTi4VF9arL`. It did not change visible site content. Afterward, `/` and `/fr` returned HTTP 200, the French bundle contained `Président, Imperial Brady Canada`, and the old `Imperial Dade` title was absent.

## Client-review workflow

1. Start from an up-to-date `main` and create or continue `codex/client-preview-<change-name>`.
2. Make only the requested update on that branch.
3. Verify locally before deploying:
   - `node verify_render.js`
   - `node test_responsive.js`
   - Inspect English `/`, French `/fr`, language switching, images, video, links, contact details, console errors, and failed requests.
4. Commit the scoped update on the review branch. Never stage unrelated files.
5. Push the review branch to GitHub. Vercel should create a Preview deployment automatically. Do not push `main`.
6. Confirm the Preview deployment is `READY` with `vercel list --environment preview` and `vercel inspect <preview-url>`.
7. Verify the preview URL at desktop, tablet, and mobile widths. Confirm production still shows the previously approved version.
8. Share the unique preview URL with the client. If Vercel protects it, use the deployment's **Share** menu and select **Anyone with the link**.
9. Record written approval against the exact preview URL or deployment ID.
10. Only after approval, merge the review branch into `main` and push. The push will trigger Production automatically.
11. Verify the resulting production deployment and the live `/` and `/fr` routes. If the release is wrong, inspect the previous deployment before using `vercel rollback`.

If automatic Preview creation does not occur, use `vercel deploy --yes` from the review branch and share the returned non-production URL. A production-equivalent staged build can instead use `vercel deploy --prod --skip-domain --yes`, but do not promote or assign production domains before approval.

## Acceptance checks

- Preview returns HTTP 200 on `/` and `/fr`.
- The requested content is present and superseded content is absent.
- English and French layouts render at approximately 320 px, 768 px, and 1440 px widths.
- Language switching, links, imagery, and video remain functional.
- No new browser-console errors or unexpected network failures appear.
- `https://ibcpinnacle.ca` remains unchanged until written approval.
- After release, production matches the approved preview and all custom-domain aliases resolve correctly.

## Known client VPN caveat

The exact VPN failure was never captured. Public DNS, TLS, Vercel routing, and the project firewall were healthy during the earlier investigation. The site still loads React, ReactDOM, and Babel from `unpkg.com`; a corporate VPN blocking that CDN could produce a blank page.

If the client cannot access a preview, collect:

- The exact browser error or screenshot.
- The failure time and VPN provider.
- Whether `https://ibcpinnacle.ca` works while connected.
- Whether the unique `*.vercel.app` preview works while connected.

Do not change DNS or firewall settings based only on a generic VPN report. If the preview domain is blocked, use screenshots or screen sharing unless the user separately approves a custom review subdomain and its DNS changes.

## New-session starting point

Read this file, run `git status -sb`, inspect the current branch and diff, and verify the live deployment before editing. The next missing input is the client's exact requested site update. Do not create or promote a placeholder deployment.
