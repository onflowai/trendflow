import styled from 'styled-components';

const Container = styled.div`
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  background: var(--white);

  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;

  .submit-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .filter-app {
  display: grid;
  gap: 20px;
  width: 100%;
  position: relative;
  grid-template-columns: 1fr;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 40px;
  }

  @media (min-width: 812px) and (max-width: 1023px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (max-width: 811px) {
    grid-template-columns: 1fr;
  }
}

.action-buttons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  background: var(--grey-50);
  width: 100%;
  justify-content: flex-end;
}

.buttons {
  display: flex;
  gap: 10px;
}

.checkbox-group {
  padding: 4rem 1rem 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 811px) {
    grid-template-columns: 1fr;
  }
}

.select-group {
  padding-top: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
}

.select-group-one {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.select-group-two {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  grid-column: span 6;
  margin-top: 20px;
  align-self: center;

  @media (max-width: 1023px) {
    grid-column: span 4;
  }

  @media (max-width: 811px) {
    grid-column: span 1;
  }
}

`;

export default Container;
