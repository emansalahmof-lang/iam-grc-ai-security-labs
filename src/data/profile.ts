/**
 * SINGLE SOURCE OF TRUTH for every public professional claim on the site.
 *
 * Governance rule: nothing in this file is published until the owner has
 * reviewed and approved it. Edit values here — never hardcode claims in pages.
 */

export type CredentialStatus = 'certified' | 'exam-passed-pending' | 'in-progress';

export interface Credential {
  code: string;
  name: string;
  issuer: string;
  status: CredentialStatus;
  verifyUrl?: string; // public verification link, only once one exists
}

export interface ProfileLink {
  label: string;
  href: string;
}

export const profile = {
  displayName: 'EMAN EWAIS',
  disciplines: ['Cybersecurity', 'IAM', 'IT Governance', 'AI Risk'],
  tagline:
    'Bridging Cybersecurity Governance, Identity Security, and AI Risk Through Practical Engineering.',
  intro:
    'Cybersecurity and GRC consultant based in Qatar. This portal turns governance frameworks and identity security concepts into documented, reproducible lab exercises — each one labelled honestly as planned, simulated, or executed.',

  /** Credential status confirmed by the owner (CRISC and ECIH confirmed by the owner 2026-11-10). */
  credentials: [
    {
      code: 'CISM',
      name: 'Certified Information Security Manager',
      issuer: 'ISACA',
      status: 'certified',
    },
    {
      code: 'CRISC',
      name: 'Certified in Risk and Information Systems Control',
      issuer: 'ISACA',
      status: 'certified',
    },
    {
      code: 'ECIH',
      name: 'EC-Council Certified Incident Handler',
      issuer: 'EC-Council',
      status: 'certified',
    },
  ] as Credential[],

  /** Only links the owner has supplied. */
  links: [
    {label: 'LinkedIn', href: 'https://www.linkedin.com/in/eman-ewais-b1049b6/'},
    {label: 'GitHub', href: 'https://github.com/emansalahmof-lang'},
  ] as ProfileLink[],

  /** Path to CV under /static once an approved, redacted CV is supplied. */
  cvPath: undefined as string | undefined,
};

export function credentialLabel(c: Credential): string {
  switch (c.status) {
    case 'certified':
      return c.code;
    case 'exam-passed-pending':
      return `${c.code} (exam passed)`;
    case 'in-progress':
      return `${c.code} (in progress)`;
  }
}
