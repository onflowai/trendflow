import styled from 'styled-components';

const Container = styled.section`
 .spy-scroll-section {
  position: fixed;
  right: 20px;
  top: 100px;
  width: 200px;
  height: 300px;
  overflow-y: auto; /* Make it independently scrollable */
}

.spy-item {
  margin: 10px 0;
  transition: all 0.3s;
}

.spy-item.active {
  font-weight: bold;
  border-left: 3px solid blue; /* Example highlight */
  padding-left: 5px;
}
 
`;

export default Container;
