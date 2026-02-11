# Devil's Valentine Website - Conversation Log

## Project Overview
- **Repo:** https://github.com/Prot0type/devil-website
- **Local Path:** `c:\Users\Owner\sources\devil-website`
- **Concept:** A "Terms of Endearment" agreement website with a runaway "Decline" button, made by Devil for his girlfriend "Piggies."
- **Domain (planned):** piggiespages.com

---

## Prompt 1 - Project Setup
**User:** Asked to initialize the folder as a git repo linked to `https://github.com/Prot0type/devil-website`.
**Action:** Ran `git init`, added remote origin. Remote repo is empty, local folder is empty.
**Result:** Repo initialized and linked successfully.

---

## Prompt 2 - Concept Discussion
**User:** Asked if I know the "runaway No button" website.
**Response:** Confirmed understanding — a Valentine's site with "Yes" and "No" buttons where the "No" button dodges the cursor.

---

## Prompt 3 - Documentation Setup
**User:** Requested a `docs/` folder with an MD file to log all prompts, responses, and decisions. This file should be kept updated after every prompt so it can be handed to a new chat if context is lost.
**Action:** Created `docs/` folder and this file (`docs/conversation-log.md`).
**Decision:** This log will be maintained continuously throughout the project.

---

## Prompt 4 - Full Project Brief & Implementation
**User:** Provided the full project brief with clarifications through Q&A.

### Requirements gathered:
- **Who:** Devil (the user's friend) is making this for his girlfriend, "Piggies"
- **Greeting on site:** "Dear Piggies"
- **Concept:** A "Terms of Endearment" popup (styled like a legal T&C agreement). Long, cute, verbose legalese content. "Agree" button works, "Decline" button runs away from cursor. After clicking "Agree", a looped video plays.
- **Theme:** Mix of legal/formal layout + Valentine's pink/red accents
- **Responsive:** Must work on PC and phone
- **Domain:** piggiespages.com (to buy later, test on CloudFront URL first)
- **Deployment:** S3 + CloudFront via CDK
- **Environments:** Dev + Prod
- **CI/CD:** GitHub Actions (dev deploys from `develop` branch, prod from `main`)
- **AWS Region:** us-west-2
- **Video:** `DevilKaRR.mp4` (user provided, found in `temporary_folder/`)

### What was built:

#### Tech Stack
- **Framework:** Next.js (static export via `output: "export"`)
- **Styling:** Tailwind CSS v4 + custom CSS
- **Infrastructure:** AWS CDK (TypeScript)
- **CI/CD:** GitHub Actions

#### Files Created

**Next.js App:**
- `package.json` — project config, scripts: `dev`, `build`, `start`, `lint`
- `tsconfig.json` — TypeScript config
- `next.config.ts` — static export enabled, unoptimized images
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin
- `.gitignore` — standard ignores + CDK + video folder
- `src/app/layout.tsx` — root layout, metadata "Piggie's Pages"
- `src/app/globals.css` — Tailwind import + custom CSS vars + scrollbar styles
- `src/app/page.tsx` — main page component:
  - Full-screen overlay with T&C modal
  - Scrollable terms content
  - "I Agree ♥" button → transitions to video player
  - "Decline" button → runs away on hover/touch/click
  - After agree: full-screen looped video (`/video/DevilKaRR.mp4`)
- `src/app/terms-content.ts` — long Terms of Endearment in legalese with 9 articles:
  - Preamble, Definitions, Devil's Obligations, Piggies' Obligations, Mutual Covenants, Dispute Resolution, Term & Termination, Miscellaneous, Valentine's Day Addendum

**Video:**
- `public/video/DevilKaRR.mp4` — copied from `temporary_folder/`

**CDK Infrastructure (`cdk/` directory):**
- `cdk/package.json` — CDK dependencies
- `cdk/tsconfig.json` — CDK TypeScript config
- `cdk/cdk.json` — CDK app config
- `cdk/bin/app.ts` — CDK app entry, defines `PiggiesPagesDev` and `PiggiesPagesProd` stacks
- `cdk/lib/static-site-stack.ts` — Stack creates:
  - S3 bucket for site files (private, OAC access)
  - S3 bucket for video assets (separate)
  - CloudFront distribution with OAC, HTTPS redirect
  - `/video/*` behavior routes to video bucket
  - 403/404 → index.html (SPA fallback)
  - Dev bucket: DESTROY on delete. Prod bucket: RETAIN.

**GitHub Actions:**
- `.github/workflows/deploy-dev.yml` — triggers on push to `develop`
- `.github/workflows/deploy-prod.yml` — triggers on push to `main`
- Both: checkout → setup node → npm ci → build → configure AWS creds (OIDC) → sync to S3 → upload video → invalidate CloudFront

### GitHub Secrets Needed (per environment):
| Secret | Description |
|--------|-------------|
| `AWS_ROLE_ARN` | IAM role ARN for GitHub OIDC |
| `S3_BUCKET_NAME` | Site S3 bucket name (from CDK output) |
| `VIDEO_BUCKET_NAME` | Video S3 bucket name (from CDK output) |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID (from CDK output) |

### Build Verification:
- `npm run build` — passes, static export generates `out/` directory with `index.html`, JS/CSS chunks, and `video/DevilKaRR.mp4`
- `cdk synth` — passes, generates both `PiggiesPagesDev` and `PiggiesPagesProd` CloudFormation templates
- Dev server (`npm run dev`) — starts on `localhost:3456`, returns HTTP 200, HTML output contains full T&C modal with all content rendering correctly

---

## Prompt 5 - Testing Validation
**User:** Asked if the code was tested/validated.
**Action:** Ran `npm run build` (clean compile), started dev server, fetched page via curl — HTTP 200, verified HTML contains all expected content (modal, terms, buttons).
**Result:** All tests pass — build, synth, and dev server all working.

---

## Prompt 6 - Local Testing Steps
**User:** Asked for steps to launch and test locally.
**Response:** Provided steps: `npm install` → `npm run dev` → open localhost:3000. Also `npm run build && npx serve out` for production build test.

---

## Prompt 7 - Bug Fixes
**User:** Reported two issues after testing:
1. Decline button jumps out of the viewport
2. Video starts muted

**Fixes applied to `src/app/page.tsx`:**
1. Changed `runAway` to use `window.innerWidth`/`window.innerHeight` instead of the modal container bounds. Changed button position from `absolute` to `fixed` with `zIndex: 100` so it positions relative to the viewport.
2. Removed `muted` attribute from the `<video>` element.

**Note:** Browsers may block unmuted autoplay — user can tap play/unmute if needed.

---

## Prompt 8 - Deployment Plan & GitHub Secrets
**User:** Asked what GitHub variables/secrets are needed. Wants to deploy to CloudFront (free URL) first, then buy domain + cert later.

**Response:** Listed the required secrets per environment:
- `AWS_ROLE_ARN` — IAM role with OIDC trust for GitHub Actions (user creates)
- `S3_BUCKET_NAME` — from CDK output
- `VIDEO_BUCKET_NAME` — from CDK output
- `CLOUDFRONT_DISTRIBUTION_ID` — from CDK output

**Deployment order:**
1. Set up OIDC identity provider + IAM role in AWS
2. `cdk bootstrap` + `cdk deploy PiggiesPagesDev`
3. Use CDK output values to populate GitHub secrets
4. Test on CloudFront URL (`d1234abcdef.cloudfront.net`)
5. Later: buy domain, ACM cert in us-east-1, add to prod stack

**Open question:** Offered to add OIDC IAM role to CDK stack as IaC.

---

## Prompt 9 - AWS Credentials Error
**User:** Got `AuthenticationError` when running `cdk bootstrap`.
**Response:** Provided 3 options to configure AWS creds: `aws configure`, env vars, or AWS SSO.
**Result:** User configured credentials successfully.

---

## Prompt 10 - First Commit & Deploy
**User:** Confirmed all setup steps done (GitHub environments, OIDC, CDK deploy, secrets). Asked "what's next?"
**Actions:**
1. Checked git status — all untracked files
2. Video file is 94MB — added `public/video/*.mp4` and `.claude/` to `.gitignore`
3. User chose to commit to `develop` first (not `main`) to trigger dev deploy only
4. Created `develop` branch, staged all files (no video, no .claude, no node_modules)
5. Committed: `bcd66c2` — "Initial commit: Piggie's Pages Valentine's website"
6. Pushed to `origin/develop` — triggers GitHub Actions dev deploy

**Pending manual step:** User needs to upload video directly to S3 video bucket:
```
aws s3 cp public/video/DevilKaRR.mp4 s3://VIDEO-BUCKET-NAME/video/DevilKaRR.mp4
```

---

## Prompt 11 - CloudFront Invalidation Failure
**User:** GitHub Actions failed at "Invalidate CloudFront cache" — `NoSuchDistribution`.
**Response:** Advised to verify the `CLOUDFRONT_DISTRIBUTION_ID` secret matches the CDK output (should be format `E1ABC2DEF3GHIJ`, not a URL).
**Result:** User fixed the secret and deployment succeeded.

---

## Prompt 12 - Video Broken on CloudFront
**User:** Site is live at `https://d1215edq0mqyst.cloudfront.net/` but video shows broken link.
**Cause:** Video file (`DevilKaRR.mp4`, 94MB) is gitignored, so GitHub Actions can't upload it. User must upload manually to the S3 video bucket.
**Fix:** Run `aws s3 cp public/video/DevilKaRR.mp4 s3://VIDEO-BUCKET-NAME/video/DevilKaRR.mp4 --region us-west-2`
**Note:** File must be at path `video/DevilKaRR.mp4` in the video bucket since CloudFront routes `/video/*` to that bucket.

---

## Prompt 13 - Mobile Layout Shift Fix
**User:** On mobile, when the Decline button runs away, the Agree button snaps to Decline's old position (layout reflow). This ruins the runaway button game.
**Cause:** When Decline gets `position: fixed`, it leaves the document flow, so the flex container reflows and Agree moves.
**Fix (v1):** Added invisible placeholder span — but it was slightly bigger than the button, still caused a minor shift.

---

## Prompt 14 - Refined Layout Shift Fix (no fixed heights)
**User:** Didn't like the fixed `min-height` approach (v2) — brittle and not clean.
**Fix (v3):** Two-button approach with `visibility: hidden` on the in-flow button. But this left a visible empty gap.

---

## Prompt 15 - Remove Visible Gap
**User:** Shared screenshots showing the ugly empty gap where the invisible Decline placeholder sits.
**Fix (v4):** Just unmount the in-flow Decline button entirely — user asked to revert this.

---

## Prompt 16 - Flying Button Size Mismatch
**User:** On mobile the flying Decline button is much smaller than the original (which is `w-full`), making it look like the desktop button.
**Fix (v5 — final):** Capture the original button's exact `width` and `height` via `getBoundingClientRect()` in `runAway`, store in `declinePos` state, and apply as inline styles on the flying copy. Now the flying button is always the same size as the original regardless of viewport.

---

## Key Decisions
| # | Decision | Reason |
|---|----------|--------|
| 1 | Git repo linked to GitHub | User's existing repo |
| 2 | "Devil" = friend making site for girlfriend "Piggies" | Not a dark theme |
| 3 | Maintain conversation log | Context preservation across sessions |
| 4 | Next.js with static export | Simple static site, no server needed, S3+CF compatible |
| 5 | Tailwind CSS v4 | Lightweight styling, responsive utilities |
| 6 | Separate S3 buckets for site + video | Video managed independently, large files |
| 7 | CloudFront OAC (not OAI) | Modern best practice for S3 origins |
| 8 | Dev deploys from `develop`, Prod from `main` | Standard branching strategy |
| 9 | GitHub OIDC for AWS auth | No long-lived keys, secure |
| 10 | us-west-2 region | User preference |

## TODO
- [x] Initialize git repo
- [x] Scaffold Next.js + Tailwind
- [x] Build T&C page with runaway button
- [x] Write Terms of Endearment content
- [x] Video playback after agree
- [x] CDK stack (S3 + CloudFront, Dev + Prod)
- [x] GitHub Actions CI/CD
- [ ] User review & feedback on site design
- [ ] Test on dev environment
- [ ] Buy domain (piggiespages.com) and add to prod stack
- [ ] First commit & push
