import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 1.5rem;
  background: var(--white);

  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--red);
  }

  .selected-filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  .filter-pill {
    display: flex;
    align-items: center;
    background-color: var(--filter-btn-highlighted);
    border: 1.5px solid var(--filter-btn-border-highlighted);
    border-radius: 1rem;
    padding: 0.4rem 0.7rem;
    white-space: nowrap;
  }

  .filter-pill img {
    width: 20px;
    height: 20px;
    //border-radius: 50%;
  }

  .filter-pill button {
    display: flex;
    align-items: center;
    justify-content: center; 
    margin-left: 0.3rem;
    border: none;
    background: none;
    cursor: pointer;
  }

  .reset-filter-btn {
    display: flex;
    align-items: center;
    justify-content: center; 
    margin-left: auto;
    padding: 0.1rem 0.1rem;
    background: none; /* Ensure no background */
    border: none; /* Remove border */
    cursor: pointer;
  }
  .reset-filter-btn svg {
    color: var(--black); /* Set icon color */
    display: block; /* Ensure no extra spacing */
}

  .available-filters {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .basic-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .basic-filter-btn {
    flex: 1 1 120px;
    min-width: 100px;
    padding: 0.5rem;
    border: none;
    border-radius: 1rem;
    border: 1.5px solid var(--filter-btn-border-color);
    background-color: var(--filter-btn-color);
    cursor: pointer;
    text-align: center;
    color: var(--text-color);
  }
  .basic-filter-btn:hover {
  background-color: var(--filter-btn-highlighted); /* Highlight color on hover */
  border-color: var(--filter-btn-border-highlighted);
}
  .basic-filter-btn:active {
  background-color: var(--filter-btn-border-highlighted); /* Change color on click */
}

  .tech-carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .fade-overlay {
    position: absolute;
    right: 24px;
    top: 0;
    width: 80px;
    height: 100%;
    background: linear-gradient(to left, var(--white), rgba(255, 255, 255, 0));
    pointer-events: none;
    z-index: 1;
  }

  .tech-carousel {
    flex: 1;
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  .tech-carousel::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
  }
  .tech-carousel::-webkit-scrollbar {
  height: 8px;
}

.tech-carousel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tech-carousel::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.tech-carousel::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.tech-carousel {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
  
.tech-item {
  min-width: 50px;
  min-height: 50px;
  border-radius: 50%;
  background-color: var(--tech-item-background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.tech-item img {
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
}

/* Search button */
.search-button {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
}

  .tech-select,
  .category-select {
    width: 100%;
  }
  

  @media (max-width: 600px) {
    .basic-filter-btn {
      flex: 1 1 calc(50% - 1rem);
    }
  }
`;

export default Container;
