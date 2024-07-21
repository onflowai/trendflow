import styled from 'styled-components';

const Container = styled.div`
  flex: 0 0 auto;
  width: 210px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: 0;
  }

  .card-content {
    position: relative;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,1) 100%);
    padding: 10px;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .card-description {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .card-date {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: white;
    padding: 5px 10px;
    border-radius: var(--border-radius);
    font-size: 0.875rem;
    font-weight: bold;
  }

  &:hover .card-background {
    opacity: 0.3;
  }
`;
export default Container;
