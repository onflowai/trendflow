import styled from 'styled-components';

const Container = styled.div`
.cards {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 20px;
    padding: 20px 0;
    height: 100%; /* Maintain consistent height */
  }

  .cards::-webkit-scrollbar {
    display: none;
  }

  .cards {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
   .card {
    cursor: pointer;
    flex: 0 0 auto;
    width: 210px;
    background-color: var(--white);
    border-radius: var(--border-radius);
    border: 1.5px solid var(--grey-50);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }
  .card:hover {
  background-color: var(--grey-50);
}

  .add-card {
    justify-content: center;
    align-items: center;
  }
  .plus-icon {
    font-size: 2rem;
    color: var(--primary);
  }
`;
export default Container;
