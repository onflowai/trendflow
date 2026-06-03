import styled, { css } from 'styled-components';

const getOverlayColor = (color = '--card-highlight') => {
  if (!color) return 'var(--card-highlight)';

  return String(color).startsWith('--') ? `var(${color})` : color;
};

const Container = styled.article`
  ${({ $overlayColor, $overlayGrain, $overlayGrainSize }) => css`
    --trend-card-overlay-color: ${getOverlayColor($overlayColor)};
    --trend-card-overlay-grain-opacity: ${Math.min(
      1,
      Math.max(0, Number($overlayGrain || 0) / 100)
    )};
    --trend-card-overlay-grain-size: ${Number($overlayGrainSize || 120)}px;
  `}

  position: relative; //needed for grain overlay
  isolation: isolate; //keeps grain inside this card
  cursor: pointer; //making the entire container behave like a clickable element
  transition: background-color 0.2s ease; // smooth transition for background color

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;

    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23noise)' opacity='0.8'/%3E%3C/svg%3E"),
      linear-gradient(
        var(--trend-card-overlay-color),
        var(--trend-card-overlay-color)
      );

    background-repeat: repeat, no-repeat;
    background-size:
      var(--trend-card-overlay-grain-size)
      var(--trend-card-overlay-grain-size),
      100% 100%;

    background-blend-mode: soft-light, normal; // lets color seep into grain
  }

  > * {
    position: relative;
    z-index: 1; // keeps content above grain overlay
  }

  &:hover {
    background-color: var(--trend-card-overlay-color);
  }

  &:hover::before {
    opacity: var(--trend-card-overlay-grain-opacity);
  }

  .inference-color-mode &:hover {
    background-color: var(--trend-card-overlay-color);
  }

  .inference-color-mode &:hover::before {
    opacity: var(--trend-card-overlay-grain-opacity);
  }

  .loading-overlay {
    position: absolute;
    background-color: var(--white);
  }

.deleted-user {
    opacity: 0.6; 
    filter: grayscale(80%);
  }

.trend-large-link {
  display: block;
  color: inherit; /* ensures text color is not affected by the link */
  text-decoration: none; /* removes underline from links */
}

.trend-large-link:hover {
  cursor: pointer;
}
  
header {
  padding: 0rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}
.info {
  h3 {
    font-size: 1.2rem;
  }
  h5 {
    font-size: 0.8rem;
  }
  p {
    margin: 0;
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    color: var(--text-secondary-color);
  }
}
.trend-title-container {
  padding-left: 1rem;
  padding-right: 1rem;
}
.trend-title-wrapper {
  position: relative;
  width: 100%;
  display: block;
}
.trend-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  word-break: break-word;
}
.open-source-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  z-index: 1;
}
.trend-large-card:hover .open-source-icon {
  //background: var(--card-highlight);
}
.description-container{
  height: 30px;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
.content {
  flex: 1; // making the content section fill the available space
  display: flex; // making it a flex container
  flex-direction: column; // stacks child elements vertically
  justify-content: space-between; // distributes space around items
  padding: 1rem 1rem;
  border: 1px red;
}
.content-center {
display: grid;
grid-template-columns: repeat(2, 1fr); // creates two columns
grid-gap: 0.2rem; // space between the grid items
margin-top: 0.1rem;
margin-bottom: 1rem;
}
.info-section {
color: var(--grey-400);
display: flex;
padding: 0.5rem;
align-items: center;
padding: 0.1rem; //padding inside each info section
margin: 0.1rem; //margin for spacing between sections
border-radius: 0.25rem;
  .icon {
    font-size: 1rem;
    margin-right: 0.4rem;
    display: flex;
    align-items: center;
  }
  .trend-item {
    font-size: 0.9rem;
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
  }
}
.actions {
  display: grid; /* use grid layout for precise placement */
  grid-template-columns: auto 1fr; /* two columns: auto for user section, remaining space for buttons */
  align-items: center; /* center items vertically within the grid */
  padding: 0.5rem 1rem; /* add some padding for spacing */
  
}
.user-section {
  display: flex; /* flex layout to align image and username horizontally */
  align-items: center; /* center items vertically */
}
.user-section .username {
   margin-left: 0.5rem; /* space between the image and username */
}
.admin-buttons {
  display: flex; /* flex layout to align buttons horizontally */
  justify-content: flex-end; /* align buttons to the right */
  gap: 1.4rem; /* small space between buttons */
}
.edit-btn svg {
  width: 1.5em;  // icon width scales with text size
  height: 1.5em; // icon height scales with text size
}
/* BUTTON STYLING */
.edit-btn,
.action-btn,
.delete-btn {
  height: 30px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}
.action-btn {
}
/* OVERRIDING GLOBAL BUTTON */
.btn,
.btn-color {
color: var(--grey-600);
cursor: pointer;
border: none;
border-radius: var(--button-square-radius);
background: var(--primary-50);
padding: 0.8rem 0.75rem;
box-shadow: none;
transition: var(--transition);
text-transform: capitalize;
display: inline-block;
}
.btn:hover {
  background: var(--grey-100);
}
.btn-color:hover {
  background: var(--primary-200);
}
.btn-hipster {
  color: var(--primary-500);
}
.btn-hipster:hover {
  color: var(--primary-200);
}
.btn-block {
  width: 100%;
}
.bookmark-btn {
  position: static;
  color: var(--black);
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
`;

export default Container;
