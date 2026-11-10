---
sidebar_position: 0.5
sidebar_label: How to use the labs
title: How to Use the Labs
description: Step-by-step guide to running the hands-on labs safely in a free Microsoft Entra test tenant, tracking progress, collecting redacted evidence and moving a lab from Lab guide to Validated.
---

# How to Use the Labs

## 1. What the status badges mean

| Badge | Meaning |
|---|---|
| **Lab guide** | Complete step-by-step instructions, checked against official documentation. Not yet executed end-to-end in a tenant. |
| **Simulated** | Uses a fictional organisation and data — no tenant needed (e.g. LAB-007). |
| **Validated** | Executed end-to-end in an isolated test tenant, with redacted evidence published on the lab page. |

## 2. Get a safe test tenant (never use a work tenant)

:::danger
Run Entra ID labs **only** in a tenant you created for testing. Never in an employer's or client's tenant — even "just to look".
:::

| Option | Licence you get | Who can use it |
|---|---|---|
| **Azure free account** with a new personal Microsoft account | Microsoft Entra ID **Free** — enough for LAB-001 Path A | Anyone (identity verification required at sign-up) |
| **Microsoft 365 Developer Program** sandbox | E5 licences including Entra ID **P2** | Only eligible members (e.g. Visual Studio Professional/Enterprise subscribers, certain partner programmes) |
| **Entra ID P1/P2 trial** activated inside your test tenant | **P1/P2** for a limited trial period — needed for LAB-002 and LAB-003 | Test tenant administrators |

**Tip:** create a new personal Microsoft account just for the lab (for example an Outlook.com address), so the lab tenant is completely separate from anything else you use. The tenant's admin account will end in `.onmicrosoft.com`.

## 3. Run a lab, step by step

1. **Open the lab page** and read sections 1–6 first (objectives, licences, architecture, safety).
2. **Check prerequisites** — especially the licence column. If a step needs P1 and you only have Free, follow the Free path where one exists.
3. **Use a private browser window** for test users so their sessions don't mix with your admin session.
4. **Follow section 7 in order** and tick each step in the **Your progress** box. Progress is saved only in your browser.
5. **Compare with section 8 (Expected results)** after each major step.
6. **Collect evidence** as you go (see below).
7. **Run the validation checks** in section 9 (portal + read-only PowerShell).
8. **Use section 11 (Troubleshooting)** if a result differs.
9. **Clean up** (section 12) — or keep objects if the next lab builds on them.
10. **Take the knowledge check** at the end.

## 4. Collect evidence correctly

For each lab keep a folder such as `Evidence\LAB-001\` on your computer:

| Evidence | How to capture it |
|---|---|
| Configuration | Screenshot of the setting (e.g. Security defaults = Enabled, or the Conditional Access policy) |
| Behaviour | Screenshot of the MFA prompt / blocked sign-in for a test user |
| Logs | Sign-in log entry (Authentication Details and Conditional Access tabs), or **Download** the sign-in log as CSV/JSON |
| Script output | Output of the read-only PowerShell in section 9, saved with `Out-File` |

### Redact before publishing

Remove or blur: **tenant ID, object IDs, IP addresses, real email addresses, device IDs, correlation/request IDs, QR codes, recovery codes**. Keep: timestamps, policy names, results, test user display names.

## 5. From "Lab guide" to "Validated"

1. Lab executed end-to-end in a test tenant.
2. Evidence collected and redacted.
3. A **Validation record** is added to the lab page: date, tenant type and licence, path followed, deviations from the guide, evidence screenshots.
4. The lab's status changes to **Validated**.
