import {themes, type PrismTheme} from 'prism-react-renderer';

/**
 * GitHub-style light theme with token colours darkened to reach WCAG 2.2 AA
 * contrast (≥ 4.5:1) on the #f6f8fa code background.
 */
const darker: Record<string, string> = {
  '#999988': '#5c6370', // comments
  '#e3116c': '#b3094f', // strings
  '#36acaa': '#1a6e6c', // numbers, variables, constants
  '#00a4db': '#0068a8', // keywords, attr-names
  '#d73a49': '#b31d28', // functions, tags
};

export const prismLightTheme: PrismTheme = {
  ...themes.github,
  styles: themes.github.styles.map((s) => ({
    ...s,
    style: {...s.style, ...(s.style.color && darker[s.style.color] ? {color: darker[s.style.color]} : {})},
  })),
};



/** Dracula with comment colour lightened for AA contrast on #282A36. */
export const prismDarkTheme: PrismTheme = {
  ...themes.dracula,
  styles: themes.dracula.styles.map((s) =>
    s.types.includes('comment') ? {...s, style: {...s.style, color: '#9aa5ce'}} : s,
  ),
};
