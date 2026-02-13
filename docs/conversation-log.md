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

## Prompt 17 - Content Updates from Sarthak's Feedback
**User:** Sarthak (Devil) reviewed the site and sent corrections. Also clarified that "Devil" is his Steam ID — his girlfriend calls him Sarthak.

**Changes made to `terms-content.ts`:**
- **All "Piggies" → "Piggie"** (singular) throughout
- **All "Devil" → "Sarthak"** throughout (including headings)
- **BETWEEN:** Devil → Sarthak, removed "The One Who Steals the Blanket", "That Guy" → "ME"
- **AND:** "Professional Snack Stealer" → "Professional Yapper"
- **Article 2:** Replaced "Five More Minutes" definition with "Travel Time" (travel to epic destinations, good food, cringe couple reels)
- **Article 3:** Removed lines 2 (compliments), 3 (spider remover), 4 (last snack). Line 6 updated: "And remember that Piggie is the funnier of the two. (Ye jhoot hai)"
- **Article 4:** Removed line 6 (funniest person). Line 8: removed TikTok, now "random memes and reels"
- **Article 5:** Removed line 3 (shared show queue)
- **Removed:** Article 6 (Dispute Resolution) and Article 8 (Miscellaneous Provisions)
- **Renumbered:** Term & Termination → Article VI, Valentine's Addendum → Article VII

**Other files updated:** `layout.tsx` (metadata description), `page.tsx` ("Dear Piggie")

---

## Prompt 18 - No Hardcoded URLs
**User:** Asked if any URLs are hardcoded.
**Response:** No — only relative path `/video/DevilKaRR.mp4` used. Works on any domain.

---

## Prompt 19 - Production Deployment Plan
**User:** Wants to deploy to prod, buy `piggiespages.com`, add ACM cert.

**Steps outlined:**
1. Buy domain (Route 53 recommended for easy DNS)
2. Request ACM cert in **us-east-1** (CloudFront requirement) with `piggiespages.com` + `*.piggiespages.com`
3. Validate cert via DNS CNAME records, wait for `ISSUED`
4. Update CDK prod stack to add domain name + cert ARN
5. `cdk deploy PiggiesPagesProd`
6. Add Route 53 A/CNAME record pointing domain → CloudFront
7. Set GitHub secrets for `production` environment
8. Merge `develop` → `main` to trigger prod deploy

**Waiting on:** User to buy domain and share ACM cert ARN for CDK update.

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

---

## Prompt 20 - Claude Handoff + Logging Instruction
**User:** Shared Claude's production deployment plan and noted Claude hit its limit mid-change. Asked Codex to read `docs/conversation-log.md` and keep it updated after every prompt.

**Codex actions:**
1. Read `docs/conversation-log.md` and confirmed full project history/context.
2. Checked working tree and verified current uncommitted files:
   - `cdk/bin/app.ts`
   - `cdk/lib/static-site-stack.ts`
   - `docs/conversation-log.md`
3. Confirmed prod domain/certificate changes are currently hardcoded in `cdk/bin/app.ts`.
4. Agreed to maintain this conversation log on each prompt going forward.

**Current handoff status:**
- Production deploy plan exists and is ready to execute.
- Likely next code task from Claude handoff: externalize prod certificate/account settings via environment variables (instead of hardcoding in source).

---

## Prompt 21 - Remove Hardcoded Cert ARN
**User:** Confirmed domain + cert are ready and asked to remove hardcoded cert ARN from source code.

**Codex actions:**
1. Updated `cdk/bin/app.ts` to read production domain/certificate from environment variables:
   - `PROD_DOMAIN_NAME`
   - `PROD_CERTIFICATE_ARN`
2. Removed hardcoded values from the `PiggiesPagesProd` stack props.
3. Added validation to fail fast if only one of the two env vars is set (both must be set together, or both unset).
4. Ran synth validation:
   - Command: `npm run synth -- PiggiesPagesDev` (inside `cdk/`)
   - Result: success

**Result:** Yes, it is possible, and the hardcoded cert ARN has been removed from code.

---

## Prompt 22 - Which GitHub Secrets Are Used
**User:** Asked whether GitHub Secrets need updates and which secrets the deployment currently references.

**Codex actions:**
1. Reviewed workflow files:
   - `.github/workflows/deploy-dev.yml`
   - `.github/workflows/deploy-prod.yml`
2. Confirmed both workflows reference the same 4 secrets:
   - `AWS_ROLE_ARN`
   - `S3_BUCKET_NAME`
   - `VIDEO_BUCKET_NAME`
   - `CLOUDFRONT_DISTRIBUTION_ID`
3. Confirmed there is no workflow currently running `cdk deploy`.
4. Confirmed new env vars in `cdk/bin/app.ts` are:
   - `PROD_DOMAIN_NAME`
   - `PROD_CERTIFICATE_ARN`
   These are used for manual CDK deployment (e.g., CloudShell), not by current GitHub Actions workflows.

**Answer summary:** No new GitHub secret is required for the cert/domain unless CDK deployment is moved into GitHub Actions.

---

## Prompt 23 - Source of PROD_* Variables
**User:** Asked where `PROD_DOMAIN_NAME` and `PROD_CERTIFICATE_ARN` come from.

**Codex clarification:**
1. They come from runtime environment variables read by Node.js in `cdk/bin/app.ts`:
   - `process.env.PROD_DOMAIN_NAME` (`cdk/bin/app.ts:6`)
   - `process.env.PROD_CERTIFICATE_ARN` (`cdk/bin/app.ts:7`)
2. They are not stored in code and are not currently populated by existing GitHub deploy workflows.
3. Typical source is the shell session where `cdk deploy` runs (e.g., CloudShell via `export ...` before deploy).

---

## Prompt 24 - Domain/Cert via GitHub Secrets
**User:** Wants prod on `piggiespages.com`, dev on `dev-piggiespages.com`, and asked if these can come from GitHub secrets since Actions handles deploy.

**Codex clarification:**
1. Current workflows (`deploy-dev.yml`, `deploy-prod.yml`) do app deployment only:
   - build static files
   - sync to S3
   - CloudFront invalidation
2. Domain + certificate are infrastructure-level settings used by CDK (`cdk/bin/app.ts`), not by current app deploy workflows.
3. Yes, these values can be stored in GitHub (environment secrets/variables), but they only take effect if a GitHub workflow runs `cdk deploy` and passes them into the CDK process.
4. For desired domains, CDK config should support both dev and prod domain/cert inputs:
   - dev: `dev-piggiespages.com`
   - prod: `piggiespages.com`

---

## Prompt 25 - Dev Subdomain Correction
**User:** Corrected the dev hostname to `dev.piggiespages.com` (not `dev-piggiespages.com`).

**Codex update:**
1. Recorded the corrected dev domain for all upcoming CDK/GitHub config guidance.
2. Future env config should use:
   - dev: `dev.piggiespages.com`
   - prod: `piggiespages.com`

---

## Prompt 26 - Manual Cert + CloudFront Setup (No CDK CI/CD)
**User:** Said CDK deploy via CI/CD is overkill and asked how to configure certificate and CloudFront after registering the domain.

**Codex guidance summary:**
1. Keep CDK infra deployment manual (CloudShell) and continue using existing app CI/CD for static file sync + invalidation.
2. Use an ACM certificate in `us-east-1` (required by CloudFront), validated via Route 53 DNS.
3. Certificate SANs should cover:
   - `piggiespages.com`
   - `www.piggiespages.com`
   - `dev.piggiespages.com`
4. Run manual `cdk deploy` from CloudShell with environment variables for domain/cert values.
5. Create Route 53 alias A records pointing hostnames to the corresponding CloudFront distributions.

---

## Prompt 27 - Cert Already Created
**User:** Confirmed the ACM certificate has already been created.

**Codex next-step guidance:**
1. Reuse the existing certificate ARN (no need to create a new cert).
2. Set `PROD_DOMAIN_NAME` and `PROD_CERTIFICATE_ARN` in CloudShell before running `cdk deploy PiggiesPagesProd`.
3. After deploy, point Route 53 alias records to the CloudFront distribution.
4. Keep in mind current CDK code still needs a small update if dev also needs custom domain `dev.piggiespages.com`.

---

## Prompt 28 - Make app.ts Ready for Dev Deploy Too
**User:** Asked to make `cdk/bin/app.ts` work cleanly for dev deploys as well.

**Codex changes:**
1. Updated `cdk/bin/app.ts` to support env-driven domain/cert config for both stacks:
   - `DEV_DOMAIN_NAME` + `DEV_CERTIFICATE_ARN`
   - `PROD_DOMAIN_NAME` + `PROD_CERTIFICATE_ARN`
2. Added shared validation per environment prefix so each pair must be set together (or both omitted).
3. Wired dev stack to use `DEV_*` values and prod stack to use `PROD_*` values.
4. To support `dev.piggiespages.com` correctly, updated `cdk/lib/static-site-stack.ts`:
   - added `includeWwwAlias?: boolean`
   - dev now does not auto-add `www.dev...`
   - prod still auto-adds `www.piggiespages.com`

**Validation:**
1. `npm run synth -- PiggiesPagesDev` -> success
2. `npm run synth -- PiggiesPagesProd` -> success
3. Synth with temporary env vars confirmed aliases:
   - dev aliases include only `dev.piggiespages.com`
   - prod aliases include `piggiespages.com` and `www.piggiespages.com`

---

## Prompt 29 - Post-CDK Deploy Next Steps
**User:** Asked what to do after running CDK deploy.

**Codex next-step checklist:**
1. Save CDK outputs for each stack:
   - `SiteBucketName`
   - `VideoBucketName`
   - `DistributionId`
   - `DistributionURL`
2. Route 53 DNS:
   - `dev.piggiespages.com` -> dev CloudFront distribution (A Alias)
   - `piggiespages.com` -> prod CloudFront distribution (A Alias)
   - `www.piggiespages.com` -> prod CloudFront distribution (A Alias)
3. Update GitHub environment secrets from outputs:
   - `dev` env -> dev bucket/video/distribution values
   - `production` env -> prod bucket/video/distribution values
   - keep `AWS_ROLE_ARN` as-is if role already has access
4. Upload video to both video buckets (or rely on workflow if file is present in repo path used by workflow).
5. Trigger deployments:
   - push to `develop` for dev deploy
   - merge/push to `main` for prod deploy
6. Verify domains and behavior:
   - T&C modal renders
   - video plays
   - runaway Decline button works on mobile

---

## Prompt 30 - How To Create Route 53 Alias Records
**User:** Asked how to configure Route 53 alias records for:
- `dev.piggiespages.com` -> dev CloudFront
- `piggiespages.com` -> prod CloudFront
- `www.piggiespages.com` -> prod CloudFront

**Codex guidance provided:**
1. Use Route 53 hosted zone `piggiespages.com`.
2. Create `A` (Alias) records pointing to the respective CloudFront distributions.
3. Optionally create matching `AAAA` (Alias) records for IPv6.
4. If CloudFront target doesn’t appear in dropdown, choose "Alias to CloudFront distribution", paste distribution domain, and use hosted zone ID `Z2FDTNDATAQYW2`.
5. Verify with DNS lookup and browser checks after propagation.

---

## Prompt 31 - Route 53 Region Message / CloudFront Not Listed
**User:** Saw Route 53 message that CloudFront alias records are global and available only in US East (N. Virginia), and said they cannot find the CloudFront distribution in target selection.

**Codex clarification:**
1. This is expected: CloudFront is global and managed from the `us-east-1` console context.
2. Ensure record type is `A` (or `AAAA`) with `Alias = ON` in a **public** hosted zone.
3. In Route 53 target, choose "Alias to CloudFront distribution" and select/paste the CloudFront domain (`dxxxx.cloudfront.net`).
4. If dropdown listing fails, manual target entry still works (CloudFront hosted zone ID `Z2FDTNDATAQYW2`).
