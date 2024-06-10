import React from 'react';
import styled from 'styled-components';

const Tooltip = ({ children, description }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Container
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <TooltipText visible={visible}>{description}</TooltipText>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  width: 120px;
  background-color: rgba(97, 97, 97, 0.85);
  color: #fff;
  text-align: center;
  border-radius: var(--button-square-radius);
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 130%; /* Position above the icon */
  left: 50%;
  margin-left: -110px; /* Center the tooltip */
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s;
  white-space: nowrap;
`;

export default Tooltip;
