import styled from 'styled-components';

const Container = styled.main`
 background-color:  var(--white);
 

  .carousel-section {
    background-color: var(--grey-50); /* Gray underlay color */
    height: 50vh; /* Fill the top half of the screen */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 3rem;
  }

  .carousel-container {
    width: 100%;
    max-width: 1200px; /* Limit the width of the carousel */
    overflow: hidden; /* Ensure the carousel doesn't expand outside the container */
  }

  .blog-container {
    background-color: var(--white);
    padding: 20px;
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .blog-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }

  /* BLOG ITEM STYLING */
  .blog-item {
    border-bottom: 1.5px solid var(--grey-70); /* line between posts */
    margin-bottom: 3rem; /* margin under each post (same in BlogPost)*/
  }
  .blog-container {
    background-color:  var(--white);
    padding: 20px;
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .blog-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
`;
export default Container;
