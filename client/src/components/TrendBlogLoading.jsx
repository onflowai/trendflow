import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { transform: translateX(-90%); }
  100% { transform: translateX(170%); }
`;

const TrendBlogLoading = () => {
  return (
    <Wrap>
      <div className="block">
        <div className="line w60" />
        <div className="line w85" />
        <div className="line w75" />
      </div>

      <div className="block">
        <div className="line w40" />
        <div className="line w90" />
        <div className="line w95" />
        <div className="line w80" />
        <div className="line w70" />
      </div>

      <div className="block">
        <div className="line w55" />
        <div className="line w88" />
        <div className="line w92" />
        <div className="line w78" />
        <div className="line w66" />
        <div className="line w84" />
      </div>
    </Wrap>
  );
};

export default TrendBlogLoading;

const Wrap = styled.div`
  border: 1.5px solid var(--grey-50);
  border-radius: var(--border-radius);
  background: var(--white);
  padding: 16px;
  margin-top: 16px;

  .block {
    margin-bottom: 0px;
  }

  .line {
    height: 18px;
    border-radius: 999px;
    position: relative;
    overflow: hidden;
    margin-bottom: 12px;
    background: rgba(120, 128, 160, 0.22);
    border: 1px solid rgba(60, 70, 95, 0.10);
  }
  .w84{
    margin-bottom: 0px;
  }

  .line::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 55%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.00) 0%,
      rgba(90, 47, 199, 0.34) 40%,
      rgba(112, 150, 255, 0.28) 55%,
      rgba(255,255,255,0.00) 100%
    );
    filter: blur(3px);
    transform: translateX(-40%);
    animation: ${shimmer} 1.25s ease-in-out infinite;
    mix-blend-mode: screen;
  }

  .w40 { width: 40%; }
  .w55 { width: 55%; }
  .w60 { width: 60%; }
  .w66 { width: 66%; }
  .w70 { width: 70%; }
  .w75 { width: 75%; }
  .w78 { width: 78%; }
  .w80 { width: 80%; }
  .w84 { width: 84%; }
  .w85 { width: 85%; }
  .w88 { width: 88%; }
  .w90 { width: 90%; }
  .w92 { width: 92%; }
  .w95 { width: 95%; }
`;