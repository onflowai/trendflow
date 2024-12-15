import styled from 'styled-components';
const Container = styled.div`
  flex: 0 0 auto;
  width: 210px;
  height: 280px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, filter 0.3s ease;

  .delete-button {
    position: absolute;
    top: 10px;
    left: 10px; // Move to the top-left corner
    background: transparent;
    border: none;
    color: var(--red);
    cursor: pointer;
    font-size: 1.5rem;
    z-index: 4; // Ensure it sits above all overlays
  }
  .delete-button:hover {
    color: var(--red-light);
  }
 
  .card {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    text-decoration: none;
    color: inherit;
  }

  .card-background {
    width: 140%;
    height: 140%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    transition: filter 0.3s ease;
    z-index: 1; // Behind overlay and text
  }

  .card-underlay {
    background: linear-gradient(135deg, #ffffff, #ffade7, #acaafe);
    opacity: 0.7;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .card-overlay {
    background: linear-gradient(60deg, #66688a, #fffcfe, #606082);
    opacity: 0.2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .card-text {
    position: absolute;
    bottom: 40px; 
    left: 10px;
    z-index: 3;
    background: var(--white);
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.3s ease;
    max-width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .card-title {
      font-weight: bold;
      color: var(--text-color);
    }

    .card-description {
      display: none;
      color: var(--text-color);
    }
  }

  .card-info {
  position: absolute;
  bottom: 10px;
  left: 5px;
  display: flex;
  gap: 10px;
  z-index: 3;
  color: white;
  font-size: 0.8rem;

  .card-date,
  .card-verified {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 2px;
  }
}

  .external-link-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 1.5rem;
    z-index: 3;
  }

  &:hover {
    .card-background {
      filter: blur(5px); // Apply blur on hover
    }

    .card-text {
      white-space: normal;
      padding: 10px;
      .card-description {
        display: block;
      }
    }
  }
`;

export default Container;
