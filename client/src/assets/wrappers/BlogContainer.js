import styled from 'styled-components';

const Container = styled.main`
 background-color:  var(--white);

  .carousel-section {
    background-color: var(--white); /* gray underlay color */
    height: 40vh; /* fill the top half of the screen */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0rem;
  }

  /* CAROUSEL SECTION */
  .carousel-container {
    width: 100%;
    max-width: 1200px; /* Limit the width of the carousel */
    overflow: hidden; /* Ensure the carousel doesn't expand outside the container */
  }

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



  .plus-icon {
    font-size: 2rem;
    color: var(--primary);
  }

  @media (max-width: 1200px) {
    max-width: 1100px;
    .cards {
      gap: 15px;
    }
    
  }

  @media (max-width: 800px) {
    .cards {
      gap: 10px;
    }
    
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
  /* ADMIN + CONTRIBUTORS SECTION */
  .admin-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    width: 100%; /* Take full width */
    max-width: 1200px; /* Match the width of the carousel */
    margin: 0 auto; /* Center the section */
    box-sizing: border-box;
  }

  .add-blog {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--primary);
  }

  .add-icon {
    font-size: 44px;
    margin-right: 10px;
    color: var(--grey-100);
  }
  
  .add-icon:hover {
    color: var(--grey-600);
  }

  .admin-img, .author-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .line {
    flex: 1;
    height: 1px;
    background-color: var(--grey-50);
    margin: 0 10px;
  }

  .current-date {
    color: var(--grey-100);
  }

  .contributors {
    font-weight: bold;
    margin-right: 10px;
  }

  .author-list {
    display: flex;
    align-items: center;
  }

  /* BLOG ITEM STYLING */
  .blog-item {
    border-bottom: 1.5px solid var(--grey-50); /* line between posts */
    margin-bottom: 3rem; /* margin under each post (same in BlogPost) */
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
`;

export default Container;
