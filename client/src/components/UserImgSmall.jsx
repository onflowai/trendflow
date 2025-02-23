import React from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa6';

const UserImgSmall = ({ user_img, githubUrl, isDeleted = false }) => {
  const handleClick = (e) => {
    if (githubUrl) {
      e.stopPropagation(); // prevent the card click event from being triggered
    }
  };
  return (
    <>
      {githubUrl ? (
        <LinkContainer
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          isDeleted={isDeleted}
        >
          {user_img ? (
            <img src={user_img} alt="user image" className="img" />
          ) : (
            <FaUser size={16} className="icon" />
          )}
        </LinkContainer>
      ) : (
        <ImageContainer isDeleted={isDeleted}>
          {user_img ? (
            <img src={user_img} alt="user image" className="img" />
          ) : (
            <FaUser size={16} className="icon" />
          )}
        </ImageContainer>
      )}
    </>
  );
};
const ImageContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.children.type === 'img' ? 'transparent' : 'var(--grey-50)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.isDeleted &&
    `
      opacity: 0.6;
      filter: grayscale(80%);
    `}

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .icon {
    transform: translateY(2px);
    color: var(--grey-70);
  }
`;

const LinkContainer = styled.a`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.children.type === 'img' ? 'transparent' : 'var(--grey-50)'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  ${(props) =>
    props.isDeleted &&
    `
      opacity: 0.6;
      filter: grayscale(80%);
    `}

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  svg {
    color: white;
  }

  .icon {
    transform: translateY(2px);
    color: var(--grey-70);
  }

  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    cursor: pointer;
  }
`;
export default UserImgSmall;
