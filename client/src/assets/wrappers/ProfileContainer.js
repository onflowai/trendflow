import styled from 'styled-components';

const Container = styled.main`
/* USER IMAGE STYLING */
.user{
    width: 29px;
    height: 29px;
  }
  .user-image {
    display: flex;
    gap: 0 0.5rem;
    background: transparent;
    border: none;
  }
  .img {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
  }
  /* FROM STYLING */
  .user-form {
  width: 100%;
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 1rem 1rem;
  margin: 1rem auto;
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
`;
export default Container;
