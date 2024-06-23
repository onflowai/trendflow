import styled from 'styled-components';

const Container = styled.div`
border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  width: 100%;
  background: var(--white);
  padding: 2rem 2rem 4rem;


.submit-container {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px;
    max-width: 600px;
    width: 100%;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .form-title {
    margin-bottom: 10px;
    font-size: 1.2em;
    font-weight: bold;
  }

  .form-center {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .checkbox-group {
    margin-bottom: 15px;
  }

  .checkbox-group h5 {
    margin-bottom: 10px;
    font-size: 1em;
  }

  .btn-block {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }

`;

export default Container;
