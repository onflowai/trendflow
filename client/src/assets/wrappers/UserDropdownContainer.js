import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  .user{
    width: 29px;
    height: 29px;
  }
  .user-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    background: transparent;
    border: none;
  }
  .img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .dropdown {
    position: absolute;
    top: 45px;
    right: 1px;
    /* width: 100%; */
    box-shadow: var(--shadow-2);
    text-align: center;
    visibility: hidden;
    border-radius: 1rem;
    background: var(--primary-500);
  }
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    border-radius: var(--border-radius);
    padding: 0.5rem;
    background: transparent;
    border-color: transparent;
    color: var(--white);
    letter-spacing: var(--letter-spacing);
    text-transform: capitalize;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
`;

export default Container;
