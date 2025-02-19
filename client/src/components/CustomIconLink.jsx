import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import OnFlowAiIcon from '../assets/images/onflowai-link.svg?react';
const customLink = import.meta.env.VITE_DEV_PARENT_URL;

/**
 * Renders a custom SVG icon that links to an external URL (or anywhere you like).
 * @param {string} href   - The URL to link to.
 * @param {number} size   - Width/height of the SVG (in px).
 * @param {string} alt    - Accessibility label for screen readers.
 */
const CustomIconLink = ({ size = 17 }) => {
  const { isDarkTheme } = useTheme();

  return (
    <Container
      className="custom-link"
      href={customLink}
      target="_blank"
      rel="noopener noreferrer"
      alt="onflow"
    >
      <OnFlowAiIcon
        width={size}
        height={size}
        // adjusting fill based on dark mode, e.g.:
        //fill={isDarkTheme ? '#fff' : '#000'}
      />
    </Container>
  );
};

const Container = styled.a`
    opacity: 0.8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
  &:focus {
    
  }
`;

export default CustomIconLink;
