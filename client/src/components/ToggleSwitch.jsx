import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleSwitch = ({ onToggle, privacy }) => {
  const [isOn, setIsOn] = useState(privacy); // initializing with the privacy prop

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onToggle) {
      onToggle(newValue); // Pass the new value to the parent component
    }
  };

  return (
    <Container onClick={toggle} isOn={isOn}>
      <div className={`circle ${isOn ? 'on' : ''}`}></div>
    </Container>
  );
};

const Container = styled.div`
   cursor: pointer;
  width: 40px;
  height: 20px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.isOn ? 'var(--primary-300)' : 'var(--grey-70)'};
  display: flex;
  align-items: center;
  padding: 2px;
  transition: background-color 0.3s;
  position: relative;

  .circle {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
    transition: transform 0.3s;

    &.on {
      transform: translateX(19px);
    }
  }
`;

export default ToggleSwitch;
