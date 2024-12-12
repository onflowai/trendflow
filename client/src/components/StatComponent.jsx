import React from 'react';
import Container from '../assets/wrappers/StatObjectContainer';
import styled from 'styled-components';

// styled wrapper for icons to customize size and color
const IconWrapper = styled.div`
  font-size: ${({ size }) => size || '20px'};
  color: ${({ color }) => color || 'var(--grey-500)'};
`;

function StatComponent({
  stats,
  iconSize = '20px',
  iconColor = 'var(--grey-500)',
}) {
  return (
    <Container>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat">
            <div className="content-group">
              <div>
                <h3>{stat.value.toLocaleString()}</h3>
                <p>{stat.title}</p>
              </div>
              <div className="icon-box">
                <IconWrapper size={iconSize} color={iconColor}>
                  {stat.icon}
                </IconWrapper>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default StatComponent;
