import styled from 'styled-components';
const Container = styled.div`
  flex: 0 0 auto;
  width: 160px;
  height: 220px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, filter 0.3s ease;

  .delete-button {
    position: absolute;
    top: 8px;
    left: 8px; 
    background: transparent;
    border: none;
    color: var(--red);
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 4;
  }
  .delete-button:hover {
    color: var(--red-light);
  }

  .card {
    width: 100%;
    height: 100%;
    position: relative;
    text-decoration: none;
    color: inherit;
  }

  .card-background {
    width: 130%;
    height: 130%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    transition: filter 0.3s ease;
    z-index: 1;
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
    bottom: 35px;
    left: 6px;
    z-index: 3;
    background: var(--white);
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.3s ease;
    max-width: 88%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .card-title {
      font-weight: bold;
      color: var(--text-color);
      font-size: 0.9rem;
      margin-bottom: 3px;
    }

    .card-description {
      display: none;
      color: var(--text-color);
      font-size: 0.7rem;
    }
  }

  .card-info {
    position: absolute;
    bottom: 6px;
    left: 4px;
    display: flex;
    gap: 8px;
    z-index: 3;
    color: white;
    font-size: 0.7rem;

    .card-date,
    .card-verified {
      display: flex;
      align-items: center;
    }

    .icon {
      margin-right: 2px;
      font-size: 0.8rem;
    }
  }

  .external-link-icon {
    position: absolute;
    top: 6px;
    right: 6px;
    color: white;
    font-size: 1.2rem;
    z-index: 3;
  }

  &:hover {
    .card-background {
      filter: blur(5px);
    }

    .card-text {
      white-space: normal;
      padding: 6px;
      .card-description {
        display: block;
      }
    }
  }
`;

export default Container;
