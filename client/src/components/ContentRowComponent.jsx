import React, { useState } from 'react';
import styled from 'styled-components';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function ContentRowComponent({ items, handleBookmarkClick, isSaved }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  return (
    <Container>
      <div className="row">
        <div
          className="bookmark-btn"
          onClick={handleBookmarkClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Filled icon for background */}
          <BsFillBookmarkFill
            size="20px"
            style={{
              color: isSaved || isHovered ? 'var(--grey-900)' : 'var(--white)',
              position: 'absolute',
            }}
          />
          {/* Outline icon on top */}
          <BsBookmark
            size="21px"
            style={{
              color: isSaved ? 'var(--grey-900)' : 'var(--grey-900)',
              position: 'absolute',
            }}
          />
        </div>
        <div className="content">
          {items
            .filter((item) => item.label) // Filter out items with undefined, null, or empty labels
            .map((item, index) => (
              <div
                key={index}
                className={`item-container ${
                  item.styled ? 'styled' : 'unstyled'
                }`}
              >
                {item.link ? (
                  <Link
                    to={item.link}
                    className={`item link ${
                      item.styled ? 'styled' : 'unstyled'
                    }`}
                  >
                    {item.icon && <span className="icon">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <div
                    className={`item ${item.styled ? 'styled' : 'unstyled'}`}
                  >
                    {item.icon && <span className="icon">{item.icon}</span>}
                    {item.label}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="gradient-overlay"></div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;

  .row {
    display: flex;
    align-items: center;
    gap: 1rem; // space between bookmark and content items
  }

  .bookmark-btn {
    align-self: flex-start;
    background-color: var(--primary-100);
    border-radius: 40%;
    padding: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .content {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-grow: 1; // Take up remaining space in the row
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .item-container {
    flex-grow: 0;
    display: flex;
    justify-content: center;
    min-width: max-content;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 1rem;
    border-radius: var(--round-radius);
    background: var(--primary-50);
    color: var(--grey-900);
    text-align: center;

    &.unstyled {
      border: none;
      background: none;
      padding: 0;
    }
  }

  .icon {
    color: var(--grey-600);
    display: flex;
    align-items: center;
  }

  .link {
    cursor: pointer;
    text-decoration: none;
    color: var(--grey-900);

    &.styled {
      background: var(--primary-100);
    }

    &.unstyled:hover {
      text-decoration: underline;
    }

    &.styled:hover {
      background: var(--primary-5);
    }

    &.unstyled:active,
    &.unstyled:focus {
      color: var(--primary3-100);
    }

    &.styled:active,
    &.styled:focus {
      background: var(--primary3-100);
    }
  }

  @media (max-width: 991px) {
    .gradient-overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 50px;
      background: linear-gradient(to left, var(--white), rgba(255, 255, 255, 0));
      pointer-events: none;
    }

    .content {
      padding-right: 50px;
    }
  }
`;

export default ContentRowComponent;
