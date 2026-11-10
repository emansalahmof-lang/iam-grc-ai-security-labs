---
sidebar_position: 0
sidebar_label: Tool catalogue
title: Interactive Security Tools
slug: /tools
description: Free browser-based GRC and IAM tools — risk matrix, IAM maturity assessment, access review checklist, SoD matrix, ISO 27001 checklist, third-party risk questionnaire, AI risk worksheet, KPI/KRI explorer and incident severity classifier.
---

# Interactive Security Tools

Every tool runs **entirely in your browser** and shows its **calculation method** on the page, so results can be reproduced by hand and challenged. Tools that remember your answers keep them only in this browser's local storage — nothing is sent to a server.

| Tool | Use it to | Saves locally | Export |
|---|---|---|---|
| [Risk matrix & scoring calculator](./risk-matrix.md) | Score likelihood × impact against example criteria | — | — |
| [IAM maturity assessment](./iam-maturity.md) | Rate 15 identity practices across 5 domains | ✓ | CSV |
| [Access review checklist](./access-review-checklist.md) | Run a certification campaign step by step | ✓ | — |
| [Segregation of duties matrix](./sod-matrix.md) | Detect toxic access combinations | — | Template |
| [ISO/IEC 27001 implementation checklist](./iso27001-checklist.md) | Track clauses 4–10 readiness | ✓ | CSV |
| [Third-party risk questionnaire](./third-party-risk.md) | Tier a supplier and score its controls | — | CSV |
| [AI risk assessment worksheet](./ai-risk-worksheet.md) | Triage an AI use case and list minimum controls | — | CSV |
| [KPI / KRI explorer](./kpi-kri-explorer.md) | Browse indicators and check RAG status | — | — |
| [Incident severity classifier](./incident-severity.md) | Classify an incident consistently | — | — |

:::caution[Educational tools]
Thresholds, weights and tiers are **illustrative**. Replace them with your organisation's approved criteria before using results for decisions. Do not enter confidential information on shared or public computers.
:::

**Quality:** the scoring logic lives in one tested module (`src/lib/scoring.ts`) with unit tests in `tests/scoring.test.ts` (`npm test`).
