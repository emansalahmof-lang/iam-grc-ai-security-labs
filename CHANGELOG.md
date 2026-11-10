# Changelog

All notable changes are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [0.7.1] — 2026-11-10

### Changed
- CRISC shown as certified (confirmed by the owner).

## [0.7.0] — 2026-11-08 — Phase 7: GitHub deployment preparation

### Added
- Site configured for `https://emansalahmof-lang.github.io/iam-grc-ai-security-labs/` (repository `iam-grc-ai-security-labs`) (owner-supplied GitHub account).
- GitHub links in navbar, footer, homepage and structured data.
- `publish-to-github.cmd`: one-click first publish (git init, owner identity prompt, private-file guard, push via Git Credential Manager sign-in).

### Security
- `.gitignore` excludes local logs, `OWNER_REVIEW.md`, `.env`, key and certificate files.

## [0.6.0] — 2026-11-07 — Phase 6: testing and security

### Security
- Content Security Policy added to every page at build time (`scripts/add-csp.mjs`) with per-page SHA-256 hashes for inline scripts; verified 0 CSP violations across 32 pages in light and dark mode.
- Dependency review: overrides for `katex` (^0.18.2) and `uuid` via `sockjs` (^11.1.1); `npm audit --omit=dev` now 0 critical/high/moderate, 5 low (`deepmerge`, no fix published).
- GitHub Actions CI (`ci.yml`) and GitHub Pages deployment (`deploy.yml`) with least-privilege permissions and actions pinned to commit SHAs; Dependabot for npm and Actions. Workflows pass actionlint; CI steps verified in a clean checkout.
- `SECURITY.md` documenting the design and GitHub Pages header limitations.

### Content
- OWASP Top 10 for LLM Applications updated to the 2026 edition (Module 8).
- External link check of all references; corrected ISO/IEC 42001, SAML, privileged-access and news links; removed an unverifiable link.

### Quality
- Responsive check of 32 pages at 360/768/1280 px: fixed risk-matrix and download-button overflow (0 issues remaining).
- `OWNER_REVIEW.md` checklist of claims and regulatory wording awaiting owner approval.

## [0.5.0] — 2026-11-07

### Added
- Interactive Tools section (`/docs/tools`) with nine browser-only tools: risk matrix, IAM maturity assessment, access review checklist, SoD matrix, ISO/IEC 27001 clause 4–10 checklist, third-party risk questionnaire, AI risk worksheet, KPI/KRI explorer, incident severity classifier.
- `src/lib/scoring.ts` — single, documented scoring module; `tests/scoring.test.ts` with 11 unit tests (`npm test`).
- Client-side CSV export with formula-injection neutralisation; local-storage persistence with validation and a visible privacy notice.
- "Tools" link in navbar and footer.

### Accessibility
- Automated axe-core WCAG 2 A/AA scan of all 32 pages in light and dark mode: 0 violations (was 43 page/scheme combinations).
- Fixed: inline link underlines, code-token contrast (custom Prism themes), search-hint contrast, dark-mode diagram labels, keyboard access to scrollable tables and code blocks.

## [0.4.0] — 2026-11-07

### Added
- Module 6 Cybersecurity GRC — mandatory vs recommended classification, ISO/IEC 27001/27002:2022, SoA, NIST CSF 2.0, Qatar NIA and PDPPL (with 2024–2026 enforcement context), GDPR comparison, TPRM, policy hierarchy, internal audit and CAPA.
- Module 7 IT Governance — governance vs management, committee model and charter, COBIT 2019 (40 objectives), KPIs vs KRIs, executive report template.
- Module 8 AI Governance & Security — ISO/IEC 42001, ISO/IEC 42005, NIST AI RMF and AI 600-1, AI operating model, inventory, risk vs impact assessment, lifecycle controls, OWASP Top 10 for LLM 2025, RAG security architecture, AI incident response, audit evidence.
- Templates: Statement of Applicability, CAPA register, AI system inventory (all with simulated rows).

### Fixed
- Some Mermaid diagrams did not render for visitors using a light OS colour scheme (render race during hydration). Added `src/theme/Mermaid.tsx` wrapper and pinned `mermaid` to 11.17.2 via npm overrides; all 22 diagrams verified in light and dark schemes.

## [0.3.0] — 2026-11-07

### Added
- Module 1 IAM Fundamentals — factors, phishing resistance (NIST SP 800-63-4), RBAC/ABAC/PBAC, SAML 2.0, OAuth 2.0 (RFC 9700), OIDC, JWT.
- Module 2 Microsoft Entra ID — licensing matrix, Entra vs Azure RBAC, Conditional Access, ID Protection, app objects vs service principals, Graph PowerShell, hybrid identity.
- Module 3 Identity Governance & Administration — JML, SCIM, role engineering, certification, SoD, orphaned/dormant accounts, platform concept mapping, IGA metrics.
- Module 4 Privileged Access Management — architecture, discovery, JIT/JEA, PIM lifecycle, vaulting, service accounts, risk scoring.
- LAB-002 Create and validate Conditional Access policies (Draft), including a coverage-gap exercise for AU-scoped admins.
- Interactive components: `<JwtDecoder>`, `<SodChecker>`, `<DecisionScenario>`.
- Templates: access review CSV and SoD matrix CSV.

## [0.2.0] — 2026-11-07

### Added
- Offline full-text search (`@easyops-cn/docusaurus-search-local`) — index built at build time, no external service.
- Reusable MDX lab components, available in every page without imports: `<LabMeta>`, `<LabProgress>`, `<KnowledgeCheck>`, `<RiskScorer>`.
- LAB-001 Configure MFA in Microsoft Entra ID (Draft).
- LAB-003 Implement RBAC with administrative units (Draft).
- LAB-007 Build an ISO/IEC 27001 risk register (Simulated) with downloadable CSV template.
- `setup-and-run.cmd` one-click Windows launcher; reinstalls dependencies automatically when `package-lock.json` changes.

### Changed
- Labs moved to `docs/labs/`; homepage featured labs now link to the three published labs.

### Privacy
- Lab progress is stored only in the visitor's browser (`localStorage`); quiz answers are not stored.

## [0.1.0] — 2026-11-07

### Added
- Docusaurus 3.10.2 project (TypeScript, React 19, MDX) scaffolded with the official generator.
- Custom homepage: hero, expertise cards, featured labs, featured projects, portfolio call-to-action.
- Dark (default) and light themes with navy / electric-blue / cyan palette; reduced-motion support.
- Content status model (Planned · Draft · Simulated · Validated) with on-page badges.
- `src/data/profile.ts` as the single reviewed source for professional claims.
- Knowledge base skeleton: welcome page, lab catalogue, 12 module landing pages (status: Planned).
- Portfolio page.
- Mermaid diagrams, sitemap, Open Graph social card, Person structured data.
- Strict build: broken links and broken anchors fail the build.

### Security
- Pinned `tinypool` ^2.2.0 and `serialize-javascript` ^7.1.4 via npm `overrides` (removes all critical/high `npm audit` findings).
- Blog plugin disabled; no analytics or tracking.
