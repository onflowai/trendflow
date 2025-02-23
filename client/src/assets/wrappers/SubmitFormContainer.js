import styled from 'styled-components';

const Container = styled.section`
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  width: 100%;
  background: var(--white);
  padding: 2rem 2rem 4rem;

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
.user-container {
  float:left;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* align user-info to the left */
  width: auto; /* auto width to fit content */
  margin-bottom: 1rem; /* adds space below user-info */
}

.user-profile {
  display: flex; /* add flex display to center content inside */
  justify-content: center; /* center content horizontally */
  width: 100%; /* full width within its block */
}

.username {
  text-align: center; /* ensure the text is centered */
  align-self: center; /* center the username within its parent */
  width: 100%; /* full width to help center the text */
  margin-top: 1rem; /* optional: adds some space between the profile and username */
}

.user-image {
  position: relative;
  display: flex;
  gap: 0 0.5rem;
  background: transparent;
  border: none;
}

.edit-button-wrapper {
  position: absolute;
  bottom: 0;
  margin-left: 4rem;
}

.edit-button {
  background: var(--grey-400);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.75rem;
  z-index: 10;

  &:hover {
    background: var(--grey-50);
  }
}

  .dropdown {
    position: absolute;
    top: 0px;
    right: -40px;
    background: var(--dropdown-background);
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .dropdown-option {
      display: block;
      width: 100%;
      padding: 0.25rem 0.75rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      text-align: left;
      border-radius: var(--border-radius);

      &:hover {
        background: var(--dropdown-background-hover);
      }

      &:active {
        background: var(--primary2-400);
      }
    }

    input {
      display: none;
    }

    button {
      color: var(--red-dark);

      &:hover {
        background: var(--primary2-400);
      }

      &:active {
        background: var(--grey-200);
      }
    }
  }

.submit-container {
  clear: both;
  display: grid; // use grid to manage layout
  grid-template-columns: 1fr; // default to single column layout
  gap: 2rem; // gap between rows or columns
  
  @media (min-width: 1120px) { // adjust this breakpoint as needed
    grid-template-columns: 2fr 1fr; // creates a two-column layout on larger screens
  }
}
.form-title {
  margin-bottom: 2rem;
}
  
.form {
  background: var(--white);
  border: 1.5px solid var(--grey-50);
  margin: 0;
  max-width: 100%;
  width: 100%;
}

.form-btn {
  height: 50px;
}

.form-input,
.form-textarea,
.form-select {
  font-size: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
   border: 1.5px solid var(--grey-70);
}

.form-center {
  display: grid;
  row-gap: 1rem;
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr; // two columns on wider screens
    align-items: center;
    column-gap: 1rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr; // three columns on the widest screens
  }
}
  
.form-btn {
  margin-top: 0rem;
  display: grid;
  align-items: center;
  place-items: center;
}
  
.delete-btn {
  height: 30px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.info-btn {
  margin-right: 0.5rem;
}

.chart-container {
  border: 1.5px solid var(--grey-50);
  background: var(--white);
  border-radius: var(--border-radius);
}

  @media (max-width: 768px) {
    padding: 1rem 1rem 2rem;

    .form {
      padding: 1rem
    }
    .submit-container {
      gap: 1rem; // Gap between rows or columns
    }
  }

  @media (max-width: 768px) {
    /* width: 4rem;
    height: 4rem; */
  }
  svg {
    width: 2rem;
    height: 2rem;
  }

`;

export default Container;
