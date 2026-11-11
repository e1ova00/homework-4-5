# QA report — Student Edition

Date: 2026-11-11. Upstream commit: `70764a94756cc4de564e493c8ba46c4b5fe03ed1`.
Environment: Linux, Node 24.22.1, npm 11.9.0, Chromium with software WebGL2 (no WebGPU adapter). No physical mobile device or gamepad attached.

## Commands and actual results

| Command / check | Result |
| --- | --- |
| `node --version`, `npm --version` | 24.22.1 / 11.9.0 |
| `npm install --force` | PASS, 404 packages installed; deprecated node-domexception warning. No dependency upgrade. npm 11 removed optional libc metadata; official lockfile restored afterward. |
| Original `npm run dev -- --host 0.0.0.0 --port 5173` | PASS after running outside the port-restricted sandbox. Initial sandbox attempt: EPERM opening port. |
| Original `npm run build` | PASS, 1.79 seconds reported by Vite. |
| Modified `npm run build` | PASS, 2.26 seconds reported by Vite. An intermediate Stylus `min()` coercion error was fixed using width/max-width. |
| `npm run preview -- --host 0.0.0.0 --port 4173` | PASS, production HTTP server running. |
| `node tests/student-achievement.test.js` | PASS, 3 tests, 0 failures. |
| `git diff --check` | PASS. |
| Upstream lint/test scripts | None configured; not invented. `compress` generates assets and was not run. |

## Automated sequence and event tests

The Node tests execute the real module. They check exact/repeated activation; incorrect/partial/WASD/Q input; overlapping prefixes; repeated keydown; editable input/textarea/select/contenteditable targets; composing input; menu/modal/intro guards; partial sequence reset on blur; propagation/default handling; event listener cleanup. Three tests passed.

## Browser integration test

Executed `/tmp/folio-integration.cjs` with Playwright and system Chromium. A small browser harness loads the actual original `Modals` and `KonamiCode` classes and the new `StudentAchievement`; it supplies a minimal game context without a renderer or physics. This is an integration test of the addition, not proof of full game behavior.

Passed: hidden initially; wrong code does not open; exact code opens the real shared modal; text and student identity are present; both close buttons; original transition classes; repeated activation; real focused input suppresses activation. Native Konami activation count remains **0**, so the student code does not invoke the vehicle replacement. The modal input filter is set to `modal` while open.

A second browser integration run added the real original `Keyboard` and `ClosingManager` classes. Escape successfully closed the modal through the original close action; repeated activation and both buttons still passed. The harness supplies the input-event bridge and a minimal game context, so complete driving restoration still needs gameplay verification.

## Responsive layout

Executed `/tmp/folio-layout.cjs` against production HTML/CSS with app JavaScript deliberately blocked. Measured the modal bounds, horizontal overflow and close-button position at all required sizes:

1920×1080, 1440×900, 1366×768, 1024×768, 820×1180, 430×932, 390×844, 375×812.

All eight passed: modal fits, no horizontal overflow, close button stays in the viewport. A mobile screenshot was visually inspected. This verifies the modal layout, not touch control behavior or complete 3D responsiveness.

## Original baseline and full-game browser attempts

The unmodified project was opened at 1440×900 using Chromium + SwiftShader. A screenshot shows the original 3D loading grid and animated ring. One canvas exists, original title is retained, and no page errors or failed requests were recorded during that baseline observation. This does not prove completion of loading or vehicle behavior.

The original renderer selected its own WebGL2 fallback. Warnings included: no WebGPU adapter, GPU stalls / ReadPixels under software rendering, unused original compressed preloads, and the existing development node-polyfills Stylus parsing warning. Baseline and modified builds report original large chunks and direct eval in vm-browserify. These were not hidden by removing features or reducing production graphics.

Full dev and production browser scripts were attempted. The desktop production run did not reach the wandering input filter within its 180-second wait after repeated Enter input during startup. Consequently full gameplay and production achievement activation were not verified. The dev run did initialize StudentAchievement (after the original resource and physics setup) but did not establish completed intro/gameplay during the observed run. A mobile-emulation production attempt at 390×844 (iPhone 13 user agent, original automatic mobile quality) reached the original wandering mode; final achievement result is recorded below. Real-device performance, shader correctness on real GPUs, sound quality and all gameplay acceptance cases must not be inferred from build success.

## Source and license preservation

`license.md`, package.json, package-lock.json and all original static/ and resources/ files match upstream. No renderer, physics, controller, input mapping, camera, world, models, textures, audio, quality setting or original credits were replaced. Focused native Konami guarding prevents conflict with the student exact code, while original alternative sequences remain implemented.

MIT root license and Bruno Simon copyright retained unchanged. Upstream package metadata says ISC; preserved and documented. Original CC0 music notice retained. No separate Pally font license found in upstream; no universal claim about third-party asset licensing is made.

## Remaining manual checklist

- [ ] Full loading completion, original world/vehicle visibility, textures and shaders on a hardware GPU.
- [ ] Drive forward/reverse, steer, accelerate, boost, brake, jump, honk, collisions, respawn.
- [ ] Mouse camera drag, tracking and zoom; interactive zones and environmental effects.
- [ ] Intro, Options, mute, music, quality settings, map, notifications, Behind the Scene, reset.
- [ ] Exact code in full gameplay; Escape close; restored driving after closing.
- [ ] Original touch controls, two-finger camera/zoom and mobile browser behavior on real hardware.
- [ ] Physical gamepad buttons, sticks, pause and reset.
- [ ] Online whispers and score saving with a compatible separately hosted backend.

## Hosting and packaging

Pages workflow is prepared. The user explicitly approved public publication of the student name and group. After that consent, repository creation was attempted through both GitHub GraphQL and REST APIs. GitHub rejected GraphQL CreateRepository for insufficient permissions and REST POST /user/repos with HTTP 403 Resource not accessible by integration. The earlier fork attempt also returned 403. Publication is blocked by GitHub integration permissions, not by missing user consent. No repository or working GitHub Pages URL is claimed. Manual next step: create an empty public e1ova00/bruno-simon-student-edition repository in GitHub and grant the connected GitHub application access to it; then upload and Pages setup can be retried.

The ZIP excludes node_modules, .git, local .env, caches, browser profiles and debug logs. It includes source, all original static/resources assets, notices, README, tests, workflow, original lockfile, .env.example and successful dist output. Archive integrity / extraction results are recorded below.

## Archive validation

`/workspace/bruno-simon-student-edition.zip` was opened using Python zipfile. `testzip()` returned None; required files and the single root folder were asserted, with no node_modules/.git/private .env entries. The initial archive contained 2,203 files before adding reproducible browser scripts.

Extracted into `/tmp/folio-extraction/bruno-simon-student-edition`, then ran:

```bash
npm install --force
npm run build
```

Both succeeded; the extracted production build completed in 4.54 seconds with the same upstream warnings. This verifies the archive carries the required source/runtime assets and configuration independently of the original node_modules.

Browser harnesses are included as `tests/browser-integration.cjs` (dev server) and `tests/browser-layout.cjs` (production preview). They require Playwright and `/usr/bin/chromium` in the test environment; these are optional QA tools, not application dependencies. Original execution used the environment's installed Playwright at `/opt/codex/cua_node/lib/node_modules/playwright`. Set `FOLIO_TEST_URL` to test a different local URL. Do not treat the isolated harnesses as full-game tests.

## Final dev observation

With the original diagnostic `VITE_GAME_PUBLIC=1` explicitly set only for the local dev process, initialization reached `StudentAchievement` creation. The full intro completion wait timed out after 180 seconds. An earlier local `.env` reload interrupted that dev run; it is not a clean full-game pass. The distributed `.env.example` remains unchanged, and private/debug local `.env` is excluded from the ZIP.

## Final production mobile-emulation result

Executed `node /tmp/folio-production-mobile.cjs` with Playwright, Chromium + SwiftShader, iPhone 13 emulation, viewport 390×844, against `http://localhost:4173/`. The original automatic mobile quality selection was used; renderer selection and production quality code were unchanged.

**PASS:** page loads; student modal is hidden initially; repeated Enter during the original intro reaches `input-filter-wandering`; the exact arrow-key/B/A sequence opens the student achievement in the full production application; its close button dismisses it. **Zero pageerror events and zero HTTP responses with status >=400 were recorded.** This run did not visually certify every world object, test driving/physics, audible output or real touch/gamepad hardware. No desktop gameplay pass is claimed.

The manual checklist item for exact-code activation in full gameplay is therefore covered in mobile emulation; driving restoration and full in-game Escape remain manual. Escape was separately verified with the real ClosingManager in the isolated integration test.

## Publication continuation

The user created and supplied `https://github.com/e1ova00/homework-4-5.git`. GitHub reports admin and push permissions for the current connection; the remote is empty. Upload and Pages deployment are now being attempted against this explicitly supplied repository. The earlier repository-creation permission errors remain historical diagnostics, not missing publication consent.

### Access check for homework-4-5

GitHub metadata reports the account's admin/push permission, but the connected integration cannot exercise repository writes: HTTPS git push returned 403 Permission denied, the connector Contents API returned 403 Resource not accessible by integration, and POST /repos/e1ova00/homework-4-5/pages also returned 403. The accessible installation list is empty. No remote files or Pages site were created. Next step: configure the GitHub connection in ChatGPT and grant its app access to homework-4-5, then retry upload and deployment. User publication consent remains valid; no new consent is needed.

## Repository upload succeeded

After the user updated the GitHub connection, the installation appeared with access to all repositories. `git push student main` succeeded to `https://github.com/e1ova00/homework-4-5`, preserving the original history. Earlier 403 errors above are historical. GitHub warned about several historical Blender backup blobs slightly larger than its recommended 50 MB threshold; upload succeeded and no original objects were removed.

The app now has contents/actions/workflows write permissions, but no Pages or administration permission. Pages source configuration therefore requires the owner to choose GitHub Actions once at https://github.com/e1ova00/homework-4-5/settings/pages. A manual Pages workflow run was started after upload. Its final deployment status will be recorded after verification.

The complete ZIP was also uploaded to Filebin with the user's separate, explicit consent. The server-reported SHA256 matched the local ZIP, and a ranged HTTPS GET returned the ZIP signature PK\x03\x04. That initial temporary download expires on 2026-11-18. A GitHub release asset is being prepared for a persistent download.

## GitHub Actions deployment blocker

The owner selected GitHub Actions as the Pages source (confirmed by the provided settings screenshot). Workflow run https://github.com/e1ova00/homework-4-5/actions/runs/43001188737 failed before any build steps started. GitHub's annotation states: **The job was not started because your account is locked due to a billing issue.** This is an account-level Actions restriction, not an npm/build failure. Local builds and the clean ZIP-extraction build remain successful. The owner must resolve the billing lock with GitHub before this workflow can deploy Pages; no live Pages site is claimed.

The repository is public and source upload is complete. A release named Student Edition 2026 is being created with the verified ZIP for a persistent GitHub download, in addition to the already verified temporary Filebin link.

## Download delivery result

The full verified 459 MiB archive is downloadable at https://filebin.net/folio-1c3ab4a3510649a68da138394dec8907/bruno-simon-student-edition.zip until 2026-11-18. Filebin upload and byte-range download were verified. This archived snapshot predates the final repository publication notes; application source/assets are the same.

GitHub release attachment upload was attempted but uploads.github.com returned HTTP 401 Bad credentials even though repository API writes work. The newly created empty draft release was removed; no downloadable release attachment is claimed. A persistent source-only archive is generated by GitHub at https://github.com/e1ova00/homework-4-5/archive/refs/heads/main.zip (contains sources/assets/docs, excludes ignored dist; the full Filebin ZIP includes dist).

Repository upload is complete. Pages is still blocked by the account-level billing restriction reported in workflow run 43001188737. The owner must resolve that restriction before the existing workflow can deploy.

## Prebuilt Pages branch

Following the owner's switch to Deploy from a branch, the already validated production dist was published to a new `gh-pages` branch, with index.html at root, .nojekyll, original license and student notice. No rendering or asset substitutions were made. The `main` branch remains the source repository. The current Pages source was verified as main /; switching it via the API returned 403 because the app lacks Pages write permission. The owner must select gh-pages / (root) and Save in Pages settings. This does not establish that the account billing lock has been resolved; the latest custom workflow still reports that lock.

## Successful independent public deployment

The user authorized an alternative hosting service to obtain a working public URL immediately. Vercel returned no available teams, so the existing production build was published through Sites. Native deployment status returned **succeeded** on 2026-11-11, with public access confirmed.

Live URL: https://nadya-folio-student-2026.considerateant2.chatgpt.site
Site project: appgprj_6af4415cedc08191abc0fb2116fcc3a5
Deployment: appgdep_6af4427c645c819197a5f774175f44ad
Deployment source commit: 2e62d626e653d47fc593b81da2e121752be7734b

Hosted runtime files are byte-for-byte copies of the previously tested production output. Three unused music WAV masters (over 25 MiB each) were omitted only from this hosting copy; source code uses the original MP3s, which are included. All original models, textures, physics WASM, sounds used at runtime, UI, license and student notice are preserved. Full original masters remain in GitHub and the complete ZIP.

Native publication success verifies hosting; no new browser test was performed on Sites because managed browser-control tools were unavailable. Earlier actual production/mobile integration checks apply to the same app build. GitHub Pages is still separate and subject to its account restriction; the live URL above does not depend on GitHub Actions.
