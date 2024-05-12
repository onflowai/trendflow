import styled from 'styled-components';

const Container = styled.div`
.carousel-container {
  position: relative;
  height: 17px;  /* Height of the carousel */
  overflow: hidden;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-item.active {
  opacity: 1;
}
`;

export default Container;
