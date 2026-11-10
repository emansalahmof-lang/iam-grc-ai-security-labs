# EMAN EWAIS — Cybersecurity, IAM & AI Governance Labs

> Bridging Cybersecurity Governance, Identity Security, and AI Risk Through Practical Engineering.

A static, documentation-first learning portal built with **Docusaurus 3.10 (TypeScript, React 19, MDX)**. It hosts modules, hands-on labs, simulated case studies and browser-based GRC tools covering IAM, Microsoft Entra ID, PAM, cybersecurity GRC, IT governance and AI governance.

## Content honesty rules

- Every lab, project and case study carries a status: **Planned · Draft · Simulated · Validated**.
- *Validated* is used only when execution evidence from an isolated lab tenant is retained.
- All public professional claims live in **`src/data/profile.ts`** and are published only after owner approval.
- No credentials, secrets, employer data or personal data are ever committed.

## Requirements (Windows 11)

| Tool | Version | Check |
|---|---|---|
| Node.js LTS | 22.x (minimum 20) | `node -v` |
| npm | ships with Node | `npm -v` |
| Git | any recent | `git --version` |
| VS Code | any recent | `code --version` |

## Run locally (PowerShell)

```powershell
cd $HOME\Projects\eman-ewais-labs
npm ci            # installs exact versions from package-lock.json
npm start         # dev server with hot reload → http://localhost:3000/iam-grc-ai-security-labs/
```

## Build and test the production site

```powershell
npm test          # unit tests for all tool scoring logic
npm run typecheck # TypeScript check, no output = pass
npm run build     # fails on any broken link or anchor, then adds CSP to every page
npm run serve     # serves ./build → http://localhost:3000/iam-grc-ai-security-labs/
```

Search results and the Content Security Policy only exist in the production build (`build` + `serve`), not in `npm start`.

## Quality gates (Phase 6, 2026-11-07)

| Check | Result |
|---|---|
| Unit tests | 11 / 11 pass |
| TypeScript | 0 errors |
| Build | 0 broken links or anchors |
| Accessibility (axe-core, WCAG 2 A/AA) | 0 violations on 32 pages × light/dark |
| Responsive (360 / 768 / 1280 px) | 0 horizontal-overflow issues on 32 pages |
| CSP | 0 violations on 32 pages × light/dark; search, theme toggle and tools work |
| Diagrams | 22 / 22 render in light and dark |
| `npm audit --omit=dev` | 0 critical / high / moderate; 5 low (no fix available) |
| External links | All checked; fixes listed in `OWNER_REVIEW.md` |

See `SECURITY.md` for the security design and `OWNER_REVIEW.md` for items awaiting owner approval.

## Project structure

```
eman-ewais-labs/
├─ docs/                     Knowledge base (Markdown/MDX)
│  ├─ intro.md               Welcome + content-status definitions
│  ├─ labs.md                Lab catalogue
│  └─ modules/               One landing page per module (1–12)
├─ src/
│  ├─ data/
│  │  ├─ profile.ts          ★ Single source of truth for professional claims
│  │  └─ catalog.ts          Expertise, featured labs/projects, status types
│  ├─ components/home/       Homepage components and styles
│  ├─ css/custom.css         Theme tokens (light/dark, status colours)
│  └─ pages/                 index.tsx (homepage), portfolio.mdx
├─ static/img/               Logo, favicon, social card
├─ docusaurus.config.ts      Site, navbar, footer, SEO, Mermaid
├─ scripts/add-csp.mjs       Post-build Content-Security-Policy
├─ tests/                    Unit tests (node:test)
├─ .github/                  CI, Pages deploy, Dependabot
├─ CHANGELOG.md · TASKS.md · SECURITY.md · OWNER_REVIEW.md
```

## Security notes

- `package.json` `overrides` pin patched versions of `tinypool` and `serialize-javascript` (build-time dependencies) to close critical/high advisories. Re-check with `npm audit --omit=dev` after every Docusaurus upgrade and remove overrides once upstream ships the fixes.
- `mermaid` is pinned to 11.17.2 (npm `overrides`) together with the `src/theme/Mermaid.tsx` wrapper; test all diagrams in light and dark mode before changing either.
- No analytics or third-party tracking is enabled.
- External links open with `rel="noopener noreferrer"`.

## Licence

Content © Eman Ewais. Licence to be decided before public release.
