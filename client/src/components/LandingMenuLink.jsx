import React from 'react';
import styled from 'styled-components';

const LandingMenuLink = ({ link, onClick, showDivider }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <LinkContainer>
      <LinkItem href={link.href} onClick={handleClick}>
        {link.text}
      </LinkItem>
      {showDivider && <Divider />}
    </LinkContainer>
  );
};

const LinkContainer = styled.div`
  width: 100%;
`;

const LinkItem = styled.a`
  display: block;
  width: 100%;
  padding: 1rem 0;
  text-decoration: none;
  color: var(--grey-700);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: var(--primary-500);
    transform: scale(1.05);
  }
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid var(--grey-300);
  margin: 0.5rem 0;
`;

export default LandingMenuLink;
