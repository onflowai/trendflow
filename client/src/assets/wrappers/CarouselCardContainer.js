import styled from 'styled-components';

const Container = styled.div`
.cards {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 20px;
    padding: 20px 0;
  }

  .cards::-webkit-scrollbar {
    display: none;
  }

  .cards {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
export default Container;
