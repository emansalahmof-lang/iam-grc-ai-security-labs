# Security

## Reporting a vulnerability

Please report security issues privately through the repository's **Security → Report a vulnerability** (GitHub private vulnerability reporting) once the repository is public. Do not open public issues for vulnerabilities.

## Security design of this site

| Area | Control |
|---|---|
| Architecture | Static site — no server-side code, database, accounts or forms |
| Secrets | None in the repository; CI uses only the default read-only `GITHUB_TOKEN` |
| Content Security Policy | Added to every page at build time (`scripts/add-csp.mjs`): `default-src 'self'`; scripts limited to same-origin files plus SHA-256 hashes of Docusaurus inline scripts (no `'unsafe-inline'` for scripts); `object-src 'none'`; `base-uri 'self'`; `form-action 'self'` |
| CSP limitation | GitHub Pages cannot send HTTP headers, so CSP is delivered by `<meta>`. Directives ignored in meta — `frame-ancestors` (clickjacking), `report-uri`, `sandbox` — and headers such as HSTS and `X-Content-Type-Options` are not configurable on GitHub Pages. Move to a host with header control (e.g. Azure Static Web Apps, Cloudflare Pages) if these become requirements |
| Third-party code at runtime | None — search runs on a locally generated index; no analytics, fonts or CDNs |
| Interactive tools | Run entirely in the browser; inputs validated; optional `localStorage` persistence with a visible privacy notice and reset; CSV export neutralises spreadsheet formula injection |
| Supply chain | `package-lock.json` + `npm ci`; GitHub Actions pinned to full commit SHAs; Dependabot for npm and Actions; CI fails on high/critical `npm audit` findings |
| Least privilege CI/CD | CI: `contents: read`. Deploy: `contents: read`, `pages: write`, `id-token: write` only |

## Dependency status (2026-11-07)

`npm audit --omit=dev`: **0 critical, 0 high, 0 moderate, 5 low**. The remaining low findings are in `deepmerge` (build-time, no fixed version published). Overrides in `package.json` pin patched versions of `tinypool`, `serialize-javascript`, `katex` and `uuid` (via `sockjs`), and pin `mermaid` to 11.17.2 for diagram stability. Review overrides after each Docusaurus upgrade.
