---
sidebar_position: 2
title: IAM Maturity Assessment
description: Self-assessment of identity and access management maturity across authentication, lifecycle, authorisation, privileged access and governance, with CSV export.
---

import {IAM_MATURITY} from '@site/src/data/tools';

# IAM Maturity Assessment

Rate each practice from **0 (non-existent)** to **4 (managed and measured)**. Be honest — score what is evidenced, not what is planned.

| Level | Meaning |
|---|---|
| 0 | Not in place |
| 1 | Ad hoc, depends on individuals |
| 2 | Repeatable, but not documented or consistent |
| 3 | Defined, documented and applied consistently |
| 4 | Measured with metrics, reviewed and improved |

<MaturityAssessment storageKey="iam-maturity-v1" sections={IAM_MATURITY} exportName="iam-maturity-assessment.csv" />

Related: [Module 1](../modules/iam-fundamentals.md) · [Module 3](../modules/identity-governance.md) · [Module 4](../modules/pam.md)
