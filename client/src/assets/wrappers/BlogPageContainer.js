import styled from 'styled-components';

const Container = styled.div`
  border-radius: var(--border-radius);
  background: var(--background-secondary-color);

  .page-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
  }

  .blog {
    padding: 1rem 4rem 4rem;
    width: 100%;
    max-width: 900px;
    margin: 0 auto 2rem auto;
  }
  
  .author-info {
    display: flex;
    align-items: center;
  }

  .author-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  .blog-author {
    font-size: 1rem;
    color: var(--grey-700);
    margin-bottom: 0.5rem;
  }

  .blog-date {
    font-size: 0.875rem;
    color: var(--grey-500);
    margin-bottom: 1rem;
  }

  .blog-content {
    width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
    overflow: hidden;
    box-sizing: border-box;
  }
  .trend-icons {
    display: flex;
    align-items: center;
  }
  .tech-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--white);
    margin-right: 0.5rem;
  }

  @media (max-width: 991px) {
    .blog {
      padding: 7.5rem 1rem 0rem;
      max-width: 100%;
    }
  }

  .scroll-spy-sidebar {
    background: inherit;
    z-index: 1;
    width: 250px;
    overflow-y: auto;
    transition: transform 0.3s ease;
    right: 0;
    top: var(--nav-height);
    height: 100vh;
    overflow-y: auto;
  }

  .icon-trends {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 992px) {
    .page-layout {
      display: grid;
      grid-template-columns: 4fr 1fr;
    }

    .scroll-spy-sidebar-aside {
      padding-top: 1rem;
      position: -webkit-sticky;
      top: var(--nav-height);
      position: sticky;
      right: 0;
      width: 250px;
      height: calc(100vh - var(--nav-height));
      z-index: 3;
    }

    .scroll-spy-sidebar {
      position: sticky;
      top: var(--nav-height);
      height: calc(100vh - var(--nav-height));
      overflow-y: auto;
    }
  }

  @media (max-width: 991px) {
    .page-layout {
      display: flex;
      flex-direction: column;
    }

    .scroll-spy-sidebar {
      position: fixed;
      width: 100%;
      height: 200px;
      top: 0;
      right: 0;
      transform: translateY(0);
      order: 1;
    }

    .icon-trends {
      order: 3;
      width: 100%;
      position: relative;
    }
  }
`;
export default Container;
