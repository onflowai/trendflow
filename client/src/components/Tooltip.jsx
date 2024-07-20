import React from 'react';
import styled from 'styled-components';

const Tooltip = ({ children, description, xOffset = 0, yOffset = 0 }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Container
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <TooltipText visible={visible} xOffset={xOffset} yOffset={yOffset}>
        {description}
      </TooltipText>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  background-color: var(--white);
  color: var(--grey-800);
  text-align: center;
  border-radius: var(--border-radius);
  padding: 0.5rem;
  position: absolute;
  z-index: 9999; /* ensures it is on top */
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s, transform 0.3s;
  white-space: nowrap;
  width: auto;
  min-width: 120px;

  transform: translate(${({ xOffset }) => xOffset}px, ${({ yOffset }) =>
  yOffset}px);
`;

export default Tooltip;
