import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function ContentRowComponent({ items }) {
  return (
    <Container>
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
                  className={`item link ${item.styled ? 'styled' : 'unstyled'}`}
                >
                  {item.icon && <span className="icon">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <div className={`item ${item.styled ? 'styled' : 'unstyled'}`}>
                  {item.icon && <span className="icon">{item.icon}</span>}
                  {item.label}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="gradient-overlay"></div>
    </Container>
  );
}

const Container = styled.div`
  position: relative; // for gradient overlay positioning
  overflow: hidden; // prevent overflow

  .content {
    display: flex;
    justify-content: space-between; // space items equally
    gap: 1rem; // space between items
    overflow-x: auto; // allow horizontal scrolling
    padding-bottom: 1rem; // space for scrollbar
  }

  .item-container {
    flex-grow: 0; // ensure items take equal space
    display: flex;
    justify-content: center; // center content
    min-width: max-content; // ensure items don't shrink too small
  }

  .item {
    display: flex;
    align-items: center;
    gap: 0.6rem; // space between icon and text
    padding: 0.6rem 1rem; // internal padding
    border-radius: var(--round-radius); // rounded corners
    /* border: 1px solid var(--primary-200); // border of 1px */
    background: var(--primary-50); // gray box background
    color: var(--grey-900); // text color
    text-align: center;

    &.unstyled {
      border: none;
      background: none;
      padding: 0;
    }
  }

  .icon {
    color: var(--grey-600); // icon color
    display: flex;
    align-items: center;
  }

  .link {
    cursor: pointer; // pointer cursor for links
    text-decoration: none; // remove underline from links
    color: var(--grey-900); // ensure link text color matches

    &.styled {
      background: var(--primary-100); // slightly different shade for links
    }

    &.unstyled:hover {
      text-decoration: underline; // underline text on hover
    }

    &.styled:hover {
      background: var(--primary-5); // highlight on hover
    }

    &.unstyled:active,
    &.unstyled:focus {
      color: var(--primary3-100); // change text color on click
    }

    &.styled:active,
    &.styled:focus {
      background: var(--primary3-100); // change color on click
    }
  }

  @media (max-width: 991px) {
    .gradient-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50px;
    background: linear-gradient(to left, var(--white), rgba(255, 255, 255, 0)); // white gradient overlay
    pointer-events: none; // allow clicks to pass through
  }
    .content {
      padding-right: 50px; // space for the gradient overlay
    }
    
  }
`;

export default ContentRowComponent;
