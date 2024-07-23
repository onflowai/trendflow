import styled from 'styled-components';

const Container = styled.div`
  flex: 0 0 auto;
  width: 210px;
  height: 280px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1.5px solid var(--grey-50);
  display: flex;
   flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  position: relative;

  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    z-index: 1; 
    //background: linear-gradient(135deg, #9592e8, #f5b285, #fdf0bb);
  }

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2; 
    background: linear-gradient(135deg, #9592e8, #f5b285, #fdf0bb);
    opacity: 0.6; // lighter effect
    transition: opacity 0.3s; // transition effect
  }

  .card-content {
    position: relative;
    z-index: 3;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; 
    height: 100%;
  }

  .card-text {
    background: white; 
    padding: 5px; 
    border-radius: 4px;
    position: relative;
    z-index: 4; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center; // Center align text
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .card-description {
    font-size: 1rem;
    display: none; // initially hidden
  }

  &:hover .card-background {
    filter: blur(4px); 
  }

  &:hover .card-overlay {
    opacity: 0.6; // slightly darker on hover
  }

  &:hover .card-description {
    display: block; // show description on hover
  }

  &:hover .card-title {
    margin-bottom: 0.25rem; // adjust margin for description
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1); // slightly darker background on hover
  }
`;
export default Container;
