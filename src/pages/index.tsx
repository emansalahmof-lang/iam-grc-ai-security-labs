import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {profile, credentialLabel} from '@site/src/data/profile';
import {expertise, featuredLabs, featuredProjects} from '@site/src/data/catalog';
import StatusBadge from '@site/src/components/home/StatusBadge';
import styles from '@site/src/components/home/home.module.css';

function Hero(): React.JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className="container">
        <p className={styles.eyebrow}>{profile.disciplines.join('  |  ')}</p>
        <Heading as="h1" className={styles.heroTitle}>
          {profile.displayName}
        </Heading>
        <p className={styles.heroTagline}>{profile.tagline}</p>
        <ul className={styles.credentials} aria-label="Professional certifications">
          {profile.credentials.map((c) => (
            <li key={c.code} title={`${c.name} — ${c.issuer}`}>
              {credentialLabel(c)}
            </li>
          ))}
        </ul>
        <p className={styles.heroIntro}>{profile.intro}</p>
        <div className={styles.heroActions}>
          <Link className="button button--primary button--lg" to="/docs/labs">
            Explore Labs
          </Link>
          <Link className="button button--secondary button--outline button--lg" to="#projects">
            View Projects
          </Link>
        </div>
        {profile.links.length > 0 && (
          <ul className={styles.socials}>
            {profile.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

function Section({
  id,
  title,
  lead,
  children,
}: {
  id?: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" id={id} className={styles.sectionTitle}>
          {title}
        </Heading>
        <p className={styles.sectionLead}>{lead}</p>
        {children}
      </div>
    </section>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Cybersecurity, IAM & AI Governance Labs"
      description="Hands-on labs, case studies and tools covering identity security, Microsoft Entra ID, PAM, GRC, IT governance and AI risk.">
      <Hero />
      <main>
        <Section
          title="Areas of Expertise"
          lead="Six connected domains, each built as a module of explanations, labs and knowledge checks.">
          <div className={styles.cardGrid}>
            {expertise.map((e) => (
              <Link key={e.title} to={e.to} className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true">
                  {e.icon}
                </span>
                <Heading as="h3" className={styles.cardTitle}>
                  {e.title}
                </Heading>
                <p className={styles.cardText}>{e.description}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section
          title="Featured Labs"
          lead="Every lab states its difficulty, prerequisites, licensing and status. Nothing is marked validated without retained execution evidence.">
          <div className={styles.labList}>
            {featuredLabs.map((lab) => (
              <Link key={lab.id} to={lab.to} className={styles.labRow}>
                <span className={styles.labId}>{lab.id}</span>
                <span className={styles.labMain}>
                  <strong>{lab.title}</strong>
                  <span className={styles.labMeta}>
                    {lab.difficulty} · {lab.duration} · Prerequisites: {lab.prerequisites}
                  </span>
                </span>
                <StatusBadge status={lab.status} />
              </Link>
            ))}
          </div>
        </Section>

        <Section
          id="projects"
          title="Featured Projects"
          lead="Practical architecture, governance and risk work, published as reusable templates and tools.">
          <div className={styles.cardGrid}>
            {featuredProjects.map((p) => (
              <article key={p.title} className={styles.card}>
                <div className={styles.cardHeaderRow}>
                  <Heading as="h3" className={styles.cardTitle}>
                    {p.title}
                  </Heading>
                  <StatusBadge status={p.status} />
                </div>
                <p className={styles.cardText}>{p.description}</p>
                <ul className={styles.tags}>
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section
          title="Professional Portfolio"
          lead="Background, certifications and the approach behind this lab programme.">
          <div className={styles.portfolioBox}>
            <p>
              Every professional statement on this site is maintained in one reviewed source file and
              published only after approval.
            </p>
            <div className={styles.heroActions}>
              <Link className="button button--primary" to="/portfolio">
                View Profile
              </Link>
              {profile.cvPath && (
                <a className="button button--secondary button--outline" href={profile.cvPath}>
                  Download CV
                </a>
              )}
            </div>
          </div>
        </Section>
      </main>
    </Layout>
  );
}
