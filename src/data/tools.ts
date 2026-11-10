import type {MaturitySection} from '@site/src/lib/scoring';
import type {ChecklistGroup} from '@site/src/components/tools/StatusChecklist';

export const IAM_MATURITY: MaturitySection[] = [
  {
    id: 'auth',
    title: 'Authentication',
    questions: [
      {id: 'auth1', text: 'MFA is enforced for all workforce users, with documented exclusions'},
      {id: 'auth2', text: 'Privileged users use phishing-resistant authentication (passkeys / FIDO2 / CBA)'},
      {id: 'auth3', text: 'Legacy authentication protocols are blocked'},
    ],
  },
  {
    id: 'lifecycle',
    title: 'Identity lifecycle',
    questions: [
      {id: 'lc1', text: 'HR is the authoritative source for joiner, mover and leaver events'},
      {id: 'lc2', text: 'Leavers are disabled within an agreed SLA and this is measured'},
      {id: 'lc3', text: 'Movers have old access removed, not just new access added'},
    ],
  },
  {
    id: 'authz',
    title: 'Authorisation & roles',
    questions: [
      {id: 'az1', text: 'Roles are defined with business owners and least privilege'},
      {id: 'az2', text: 'Segregation of duties rules exist and are enforced or monitored'},
      {id: 'az3', text: 'Administrative roles are scoped (e.g. administrative units, resource scopes)'},
    ],
  },
  {
    id: 'pam',
    title: 'Privileged access',
    questions: [
      {id: 'pa1', text: 'Privileged access is just-in-time with approval or justification'},
      {id: 'pa2', text: 'Break-glass accounts exist, are monitored and are tested regularly'},
      {id: 'pa3', text: 'Service accounts and app credentials have owners and rotation or managed identities'},
    ],
  },
  {
    id: 'gov',
    title: 'Governance & assurance',
    questions: [
      {id: 'gv1', text: 'Access reviews run on a risk-based schedule and revocations are verified'},
      {id: 'gv2', text: 'Identity KPIs/KRIs are reported to management'},
      {id: 'gv3', text: 'Identity configuration changes follow change management with evidence'},
    ],
  },
];

export const ISO27001_CHECKLIST: ChecklistGroup[] = [
  {
    id: 'c4',
    title: 'Clause 4 — Context',
    items: [
      {id: 'c4-1', text: 'External and internal issues identified', evidence: 'Context analysis document'},
      {id: 'c4-2', text: 'Interested parties and their requirements identified (incl. legal, regulatory, contractual)', evidence: 'Interested parties register'},
      {id: 'c4-3', text: 'ISMS scope defined, with interfaces and dependencies', evidence: 'Scope statement'},
    ],
  },
  {
    id: 'c5',
    title: 'Clause 5 — Leadership',
    items: [
      {id: 'c5-1', text: 'Information security policy approved by top management and communicated', evidence: 'Signed policy, communication record'},
      {id: 'c5-2', text: 'ISMS roles, responsibilities and authorities assigned', evidence: 'RACI / job descriptions'},
    ],
  },
  {
    id: 'c6',
    title: 'Clause 6 — Planning',
    items: [
      {id: 'c6-1', text: 'Risk assessment process and criteria defined (incl. acceptance criteria)', evidence: 'Risk methodology'},
      {id: 'c6-2', text: 'Risk assessment performed with risk owners', evidence: 'Risk register'},
      {id: 'c6-3', text: 'Risk treatment plan approved by risk owners; residual risk accepted', evidence: 'Treatment plan with approvals'},
      {id: 'c6-4', text: 'Statement of Applicability with justified inclusions/exclusions', evidence: 'SoA'},
      {id: 'c6-5', text: 'Information security objectives set with measures and owners', evidence: 'Objectives plan'},
    ],
  },
  {
    id: 'c7',
    title: 'Clause 7 — Support',
    items: [
      {id: 'c7-1', text: 'Competence requirements defined and evidenced', evidence: 'Training / certification records'},
      {id: 'c7-2', text: 'Awareness programme delivered', evidence: 'Completion reports'},
      {id: 'c7-3', text: 'Documented information controlled (versioning, approval, access)', evidence: 'Document control procedure'},
    ],
  },
  {
    id: 'c8',
    title: 'Clause 8 — Operation',
    items: [
      {id: 'c8-1', text: 'Risk assessments repeated at planned intervals and on significant change', evidence: 'Dated assessments'},
      {id: 'c8-2', text: 'Risk treatment plan implemented', evidence: 'Implementation records'},
      {id: 'c8-3', text: 'Externally provided processes and services controlled', evidence: 'Supplier assessments, contracts'},
    ],
  },
  {
    id: 'c9',
    title: 'Clause 9 — Performance evaluation',
    items: [
      {id: 'c9-1', text: 'Monitoring and measurement defined and performed', evidence: 'KPI/KRI reports'},
      {id: 'c9-2', text: 'Internal audit programme executed by objective auditors', evidence: 'Audit plan, reports'},
      {id: 'c9-3', text: 'Management review held with required inputs and outputs', evidence: 'Minutes, actions'},
    ],
  },
  {
    id: 'c10',
    title: 'Clause 10 — Improvement',
    items: [
      {id: 'c10-1', text: 'Nonconformities corrected, root causes analysed, corrective actions taken', evidence: 'CAPA register'},
      {id: 'c10-2', text: 'Effectiveness of corrective actions reviewed', evidence: 'Effectiveness checks'},
    ],
  },
];
