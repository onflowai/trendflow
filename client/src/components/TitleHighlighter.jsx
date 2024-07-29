import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
/**
 * Component used to split the tittle and wrap it for highlighted look
 */
const Header = styled.div`
  width: 100%;
  line-height: 1.5;
`;

const HighlightWrapper = styled.div`
  display: inline-block;
  position: relative;
  background: none;
`;

const HighlightText = styled.div`
  position: relative;
  z-index: 1;
  padding: 0.5em;
  background: var(--white);
  color: var(--grey-700);
  margin-left: -10px;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: -12px;
  white-space: pre-wrap;
  font-size: 0.8em;

  @media (max-width: 1200px) {
    font-size: 0.7em;
  }

  @media (max-width: 992px) {
    font-size: 0.7em;
  }

  @media (max-width: 768px) {
    font-size: 0.6em;
  }

  @media (max-width: 576px) {
    font-size: 0.5em;
  }
`;

const TitleHighlighter = ({ title }) => {
  const [chunks, setChunks] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    const words = title.split(' ');
    const approximateCharWidth = 19; // approximate character width in px
    const maxCharsPerLine = Math.floor(containerWidth / approximateCharWidth);

    let currentChunk = '';
    const newChunks = [];

    words.forEach((word) => {
      if ((currentChunk + word).length <= maxCharsPerLine) {
        currentChunk += word + ' ';
      } else {
        newChunks.push(currentChunk.trim());
        currentChunk = word + ' ';
      }
    });

    if (currentChunk) {
      newChunks.push(currentChunk.trim());
    }

    setChunks(newChunks);
  }, [title, containerRef.current?.offsetWidth]);

  return (
    <Header ref={containerRef}>
      <HighlightWrapper>
        {chunks.map((chunk, index) => (
          <HighlightText key={index}>{chunk}</HighlightText>
        ))}
      </HighlightWrapper>
    </Header>
  );
};

export default TitleHighlighter;
