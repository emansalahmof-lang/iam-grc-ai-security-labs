/**
 * Wrapper around the Docusaurus Mermaid component.
 *
 * Why: when a visitor's OS colour scheme differs from the default (dark), the
 * colour mode changes during hydration. The original component then starts a
 * second render with the SAME element id while the first is still running, and
 * some diagrams never appear (observed with mermaid 11/12 + Docusaurus 3.10).
 * Keying on the colour mode remounts the component, giving each render its own id.
 */
import React from 'react';
import Mermaid from '@theme-original/Mermaid';
import type MermaidType from '@theme/Mermaid';
import type {WrapperProps} from '@docusaurus/types';
import {useColorMode} from '@docusaurus/theme-common';

type Props = WrapperProps<typeof MermaidType>;

export default function MermaidWrapper(props: Props): React.JSX.Element {
  const {colorMode} = useColorMode();
  return <Mermaid key={colorMode} {...props} />;
}
