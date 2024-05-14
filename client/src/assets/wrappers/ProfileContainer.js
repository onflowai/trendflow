import styled from 'styled-components';

const Container = styled.main`
/* USER IMAGE STYLING */
  position: relative;
.form-and-trends-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px; 
}
  /* USER IMAGE STYLING */
  .user{
    width: 29px;
    height: 29px;
  }// fallback icon size
  .user-image {
    position: relative; // To position the EditButton
    display: flex;
    gap: 0 0.5rem;
    background: transparent;
    border: none;
  }
  /* USER IMG BUTTON */
  .edit-button-wrapper {
    position: absolute;
    bottom: 0; // Align to bottom of the image
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
    background: white;
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;

    .dropdown-option {
      display: block;
      width: 100%;
      padding: 0.25rem 0.75rem; // Padding for highlight effect
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      text-align: left;
      border-radius: var(--border-radius);
      &:hover {
        background: var(--grey-50); // Highlight on hover
      }
      &:active {
        background: var(--primary2-400); // Highlight on click
      }
    }

    input {
      display: none; // Hidden file input
    }

    button {
      color: var(--red-dark);
      &:hover {
        background: var(--primary2-400); // Highlight on hover for Remove button
      }
      &:active {
        background: var(--grey-200); // Highlight on click for Remove button
      }
    }
  }
  /* FROM STYLING */
  .user-form-container {
  flex: 1; /* Take up 1/4 of the space */
  background: var(--white);
  border-radius: var(--border-radius);
  border-top-left-radius: calc(var(--border-radius) * 8);
  border: 1.5px solid var(--grey-50);
  padding: 1rem 1rem;
  margin: 1rem auto;
}
.form-user{
  flex: 2; /* Take up 1/4 of the space */
  /* width: 100%; */
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  padding: 1rem 1rem;
  margin: 1rem;
  height: 350px;
}
.form-user-settings {
  flex: 2; /* Takes up remaining space under form-user */
  /* max-width: 100%; */
  background: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  padding: 1rem;
  margin-top: 1rem;
}
.form-label-user {
  display: block;
  font-size: var(--small-text);
  margin-bottom: 0.75rem;
  text-transform: capitalize;
  letter-spacing: var(--letter-spacing);
  line-height: 1.5;
}
.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border-radius: var(--input-radius);
  background: var(--background-color);
  border: 1px solid var(--grey-50);
  color: var(--text-color);
}
.form-input,
.form-select,
.form-btn {
  height: 35px;
}
.form-row {
  margin-bottom: 1rem;
}

.form-textarea {
  height: 7rem;
}
::placeholder {
  font-family: inherit;
  color: var(--grey-400);
}
.form-alert {
  color: var(--red-dark);
  letter-spacing: var(--letter-spacing);
  text-transform: capitalize;
}
/* BOOKMARK TRENDS */
.trends-container {
  flex: 5; /* Takes up 3/4 of the space */
  max-width: 75%; /* Ensures it doesn't exceed 75% width */
  background: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  padding: 1rem;
  /* overflow: auto; allows scrolling if content overflows */
}

/* Media query for smaller screens */
@media (max-width: 868px) {
  .form-and-trends-container {
    flex-direction: column; /* Stack vertically */
  }
  .form-user,
  .trends-container {
    flex: 1 1 100%; /* Each takes up the full width */
    max-width: 100%; /* Ensures full width usage */
    /* overflow: auto; allows scrolling if content overflows */
  }
}
`;
export default Container;
