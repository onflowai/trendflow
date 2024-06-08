import styled from 'styled-components';

const Container = styled.article`
  position: relative;
  cursor: pointer;
  
  transition: background-color 0.3s ease; // Smooth transition for background color

  &:hover {
    background-color: var(--grey-50); // Change background on hover
  }

  .trend-small-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .overlay {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; // Align children to the bottom
    height: 100%; // Ensure it takes full height
  }

  .info {
    position: relative;
    text-align: left;
    width: 100%;
    
    h4, h6, p {
      position: absolute;
      width: 100%;
      margin: 0;
      color: var(--text-color);
      padding: 2rem;
      border-radius: 0.25rem;
    }
    
    h4 {
      top: 130px;
      /* font-size: 1.2rem; */
      z-index: 2;
    }

    h6 {
      top: 150px;
      /* font-size: 1.2rem; */
      z-index: 2;
    }
    
    p {
      top: 165px;
      /* font-size: 1rem; */
      z-index: 1;
    }
  }

  .bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--white);
    border-top: 1px solid var(--grey-200);
  }

  .user-icon {
    display: flex;
    align-items: center;
  }

  .bottom-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: var(--grey-400);
    font-size: 0.9rem;
  }

  .bookmark-btn {
    display: flex;
    align-items: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    outline: none;
  }
  
  @media (max-width: 500px) {
    .info {
      h3 {
        font-size: 1rem;
      }
      p {
        font-size: 0.8rem;
      }
    }
    .bottom-info {
      flex-direction: column;
      gap: 0.2rem;
    }
  }
`;

export default Container;
