import styled from 'styled-components';

const Container = styled.main`
background-color: white;
  padding: 20px;

  .carousel-section {
    background-color: var(--grey-50); /* Gray underlay color */
    padding: 0px;
    margin-bottom: 0px;
  }

  .carousel-container {
    width: 100%;
  }

  .blog-container {
    background-color: white;
    padding: 20px;
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .carousel {
    display: flex;
    overflow-x: scroll;
    width: 100%;
    padding: 20px 0;
    margin-bottom: 20px;
  }

  .carousel-card {
    min-width: 300px;
    margin-right: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    position: relative;
  }

  .add-card-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  .remove-card-button {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  .blog-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

  .blog-item {
    width: 80%;
    margin: 10px 0;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
  }
`;
export default Container;
