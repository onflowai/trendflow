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
  padding-top: 3rem;
  display: grid;
  gap: 20px;
  width: 100%;
  position: relative;/* relative positioning for containing absolutely positioned children */
  grid-template-columns: 1fr;
  
  @media (min-width: 1470px) {
    grid-template-columns: minmax(35rem, 1fr) 2fr;
    gap: 20px;
     grid-template-rows: auto auto; /* two rows: one for checkboxes, one for selectors */ //HERE
  }

  @media (min-width: 812px) and (max-width: 1469px) {
    grid-template-columns: repeat(1, 2fr);
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
  justify-content: flex-start;
}

.buttons {
  display: flex;
  gap: 10px;
}
.checkbox-label{
  margin-bottom: 0.6rem;
}

.checkbox-group {
  padding-left: 3rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 1470px) { /* two columns for checkboxes at 1470px and wider screens */
      grid-column: 1 / -1; /* span all columns in the parent grid */
      grid-template-columns: repeat(2, 1fr); /* two columns for checkboxes */
    }

    @media (min-width: 1469px) {
      grid-template-columns: repeat(2, 1fr);
    }

  @media (max-width: 711px) {
    grid-template-columns: 1fr;
  }
}
.checkbox-description {
    font-size: 0.875rem;
    color: var(--grey-400);
    margin-top: 0.2rem;
    margin-left: 1.5rem; /* Adjust as necessary to align with checkbox label */
  }

.select-group {
  padding-right: 3rem;
  padding-left: 3rem;
  display: grid;
  min-width: 20rem;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  grid-template-columns: min(800px);

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;

  }

  @media (max-width: 1023px) {
    /* grid-template-columns: 1fr; */
     grid-template-columns: 1fr;
  }
}

.select-group-one {
  display: flex;
  flex-direction: column;
  gap: 2px;
  grid-template-columns: minmax(400px, 1fr);
}

.select-group-two {
  display: flex;
  flex-direction: column;
  gap: 2px;
  grid-template-columns: minmax(200px, 1fr);
}
.indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: var(--grey-400);
  }

  .indicator.active {
    background-color: var(--green);
  }

  .indicator-container {
    display: grid; /* use grid layout */
    grid-template-columns: auto 1fr; /* indicator and selector */
    align-items: center; /* align items vertically */
  }

.button-row {
  margin-top: 0.5rem;
  display: flex; /* use flex-box for layout */
  justify-content: flex-end; /* align items to the right within the row */
  align-items: center; /* center items vertically */
  @media (max-width: 1470px) {
    margin-bottom: 1rem;
  }
}

/* .button-row {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 10px;
    margin-bottom: 1rem; 
    justify-items: end; 
    align-items: right; 

    @media (max-width: 1023px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 811px) {
      grid-template-columns: 1fr;
    }
  } */
  .reset-button .btn {
  border-top-left-radius: 0; 
  border-bottom-left-radius: 0;
  }

  .save-button .btn {
  border-top-right-radius: 0; 
  border-bottom-right-radius: 0;
  }
  /* COLLAPSED GROUP */
  .collapsed-group {
    display: flex; /* Use flexbox for layout */
    flex-wrap: wrap; /* Prevent wrapping initially */
    justify-content: space-between;
    align-items: center;
    .select {
    padding-right: 3rem;
    padding-left: 3rem;
    display: grid;
    min-width: 30rem;
    }

    @media (min-width: 1470px) { /* Ensure it overrides the .filter-app styles */
      grid-column: 1 / -1; /* span all columns in the parent grid */
      .select {
        min-width: 40rem;
      }
    }

    @media (max-width: 1469px) {
      flex-wrap: wrap; /* Allow wrapping on smaller screens */
      .select {
        min-width: 30rem;
      }
    }

    @media (max-width: 811px) {
      /* flex-direction: column; Stack items vertically on small screens */
      grid-template-columns: 1fr;
    }
  }

`;

export default Container;
