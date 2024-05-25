import styled from 'styled-components';

const Container = styled.button`
background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 25px;
  transition: background-color 0.5s;

  .icon {
    color: var(--grey-600);
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }

  &.dark {
    color: var(--grey-100);
  }
`;
export default Container;
