/**
 * Content catalog. `status` is mandatory and drives the badge shown to
 * visitors, so the site never implies a lab was executed when it was not.
 *  - planned:   outline only, not yet written
 *  - draft:     written, not yet executed/validated
 *  - simulated: runs on fictional data / no real tenant
 *  - validated: executed in an isolated lab tenant with retained evidence
 */
export type ContentStatus = 'planned' | 'draft' | 'simulated' | 'validated';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Expertise {
  title: string;
  icon: string; // short monogram, keeps the bundle free of icon libraries
  description: string;
  to: string;
}

export interface LabSummary {
  id: string;
  title: string;
  difficulty: Difficulty;
  duration: string;
  prerequisites: string;
  status: ContentStatus;
  to: string;
}

export interface ProjectSummary {
  title: string;
  description: string;
  tags: string[];
  status: ContentStatus;
}

export const expertise: Expertise[] = [
  {
    title: 'Identity & Access Management',
    icon: 'IA',
    description: 'Authentication, authorization models, federation and the identity lifecycle.',
    to: '/docs/modules/iam-fundamentals',
  },
  {
    title: 'Microsoft Entra ID',
    icon: 'EN',
    description: 'Conditional Access, PIM, access reviews and tenant governance, with licensing called out.',
    to: '/docs/modules/entra-id',
  },
  {
    title: 'Privileged Access Management',
    icon: 'PA',
    description: 'Just-in-time access, break-glass accounts and service account governance.',
    to: '/docs/modules/pam',
  },
  {
    title: 'Cybersecurity GRC',
    icon: 'GR',
    description: 'ISO/IEC 27001:2022, NIST CSF 2.0, Qatar NIA and PDPPL in practice.',
    to: '/docs/modules/cyber-grc',
  },
  {
    title: 'IT Governance & Risk',
    icon: 'IT',
    description: 'COBIT 2019 operating models, committees, KPIs and KRIs.',
    to: '/docs/modules/it-governance',
  },
  {
    title: 'AI Governance & Security',
    icon: 'AI',
    description: 'ISO/IEC 42001, NIST AI RMF, LLM and RAG security controls.',
    to: '/docs/modules/ai-governance',
  },
];

export const featuredLabs: LabSummary[] = [
  {
    id: 'LAB-001',
    title: 'Configure MFA in Microsoft Entra ID',
    difficulty: 'Beginner',
    duration: '45–60 min',
    prerequisites: 'Test tenant; Free (security defaults) or P1 (Conditional Access)',
    status: 'draft',
    to: '/docs/labs/lab-001-entra-mfa',
  },
  {
    id: 'LAB-003',
    title: 'Implement RBAC with administrative units',
    difficulty: 'Intermediate',
    duration: '60–75 min',
    prerequisites: 'Test tenant; Entra ID P1 for AU-scoped roles',
    status: 'draft',
    to: '/docs/labs/lab-003-entra-rbac',
  },
  {
    id: 'LAB-007',
    title: 'Build an ISO/IEC 27001 risk register',
    difficulty: 'Intermediate',
    duration: '90 min',
    prerequisites: 'Spreadsheet tool; no licence required',
    status: 'simulated',
    to: '/docs/labs/lab-007-iso27001-risk-register',
  },
];

export const featuredProjects: ProjectSummary[] = [
  {
    title: 'Identity Governance Reference Workflow',
    description: 'Joiner-Mover-Leaver process design with access certification checkpoints.',
    tags: ['IGA', 'JML', 'Access Reviews'],
    status: 'planned',
  },
  {
    title: 'Integrated Risk Scoring Toolkit',
    description: 'Transparent, documented likelihood × impact calculator running fully in the browser.',
    tags: ['Risk', 'ISO 31000', 'Tooling'],
    status: 'planned',
  },
  {
    title: 'AI System Risk Assessment Template',
    description: 'Assessment worksheet mapped to the NIST AI RMF functions and ISO/IEC 42001.',
    tags: ['AI Governance', 'NIST AI RMF', 'ISO 42001'],
    status: 'planned',
  },
];

export const statusLabel: Record<ContentStatus, string> = {
  planned: 'Planned',
  draft: 'Lab guide',
  simulated: 'Simulated',
  validated: 'Validated',
};
