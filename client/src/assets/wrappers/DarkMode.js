import styled from 'styled-components';

const Container = styled.button`
background: var(--grey-50);
  border-radius: 25px;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 40px;
  height: 25px;
  transition: background-color 0.3s;

  .icon {
    width: 22px;
    height: 22px;
    z-index: 2;
  }

  .sun-icon {
    position: relative; // Ensures that the pseudo-element is positioned relative to the icon
    transform: ${(props) =>
      props.className === 'dark' ? 'translateX(16px)' : 'none'};
    transition: transform 0.3s;

    &::before {
      content: '';
      background: red; // Color of the circle
      border-radius: 50%;
      width: 12px; // Size of the circle
      height: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); // Center the circle behind the sun icon
      z-index: -1; // Ensure the circle is behind the icon
    }
  }

  &.dark {
    background: var(--grey-100);
  }
`;
export default Container;
