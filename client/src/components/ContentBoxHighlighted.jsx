import React from 'react';
import DangerousMarkdownSmall from './DangerousMarkdownSmall';
import styled from 'styled-components';
/**
 * This component is for HTML highlighted box
 * @param {*} param0 
 * @returns 
 */
function ContentBoxHighlighted({ trendUse, isDarkTheme }) {
  return (
    <DangerousMarkdownSmall content={trendUse} isDarkTheme={isDarkTheme} />
  );
}

const Container = styled.div`
 border: 1.5px solid var(--primary-400); 
  background-color: var(--content-box-highlighted);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin: 1rem;
  @media (max-width: 991px) {
    /* padding: 0rem;
    margin: 0.5rem; */
    width: calc(100% - 0rem); // fill the width of the screen with padding
    margin: 0; 
    padding: 1rem; // maintain internal padding
    box-sizing: border-box; // include padding and border in the element's total width
  }

`;

export default ContentBoxHighlighted;
