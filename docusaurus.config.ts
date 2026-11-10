
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {prismLightTheme, prismDarkTheme} from './src/prismLightTheme';

/**
 * DEPLOYMENT SETTINGS — update in Phase 7 once the GitHub repository exists.
 * For a project site the URL is https://<user>.github.io/<repo>/
 */
const GITHUB_USER = 'emansalahmof-lang';
const REPO_NAME = 'iam-grc-ai-security-labs';

const config: Config = {
  title: 'EMAN EWAIS Labs',
  tagline:
    'Bridging Cybersecurity Governance, Identity Security, and AI Risk Through Practical Engineering.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: `https://${GITHUB_USER}.github.io`,
  baseUrl: `/${REPO_NAME}/`,
  organizationName: GITHUB_USER,
  projectName: REPO_NAME,
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: ['./src/clientModules/a11yScrollRegions.ts'],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Offline search: the index is generated at build time and served with the
      // site. No queries leave the visitor's browser and no third-party service is used.
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],

  headTags: [
    {tagName: 'meta', attributes: {name: 'referrer', content: 'strict-origin-when-cross-origin'}},
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Eman Ewais',
        jobTitle: 'Cybersecurity and GRC Consultant',
        sameAs: ['https://www.linkedin.com/in/eman-ewais-b1049b6/', 'https://github.com/emansalahmof-lang'],
      }),
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {
        name: 'keywords',
        content:
          'IAM, Microsoft Entra ID, PAM, GRC, ISO 27001, NIST CSF, ISO 42001, AI governance, Qatar NIA, cybersecurity labs',
      },
    ],
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'EMAN EWAIS',
      logo: {
        alt: 'EMAN EWAIS Labs logo',
        src: 'img/logo.svg',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: 'Knowledge Base'},
        {to: '/docs/labs', label: 'Labs', position: 'left'},
        {to: '/docs/tools', label: 'Tools', position: 'left'},
        {to: '/portfolio', label: 'Portfolio', position: 'left'},
        {
          href: 'https://www.linkedin.com/in/eman-ewais-b1049b6/',
          label: 'LinkedIn',
          position: 'right',
        },
        {
          href: `https://github.com/${GITHUB_USER}/${REPO_NAME}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Knowledge Base', to: '/docs/intro'},
            {label: 'Hands-On Labs', to: '/docs/labs'},
            {label: 'Interactive Tools', to: '/docs/tools'},
          ],
        },
        {
          title: 'Profile',
          items: [
            {label: 'Portfolio', to: '/portfolio'},
            {label: 'LinkedIn', href: 'https://www.linkedin.com/in/eman-ewais-b1049b6/'},
            {label: 'GitHub', href: 'https://github.com/emansalahmof-lang'},
          ],
        },
        {
          title: 'Notice',
          items: [
            {label: 'Content status & disclaimer', to: '/docs/intro#content-status'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Eman Ewais. Educational content. All lab exercises must be performed only in isolated environments you are authorised to use.`,
    },
    prism: {
      theme: prismLightTheme,
      darkTheme: prismDarkTheme,
      additionalLanguages: ['powershell', 'bash', 'json', 'yaml'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
