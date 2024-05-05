import React from 'react';
import Container from '../assets/wrappers/StatObjectContainer';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
/**
 * 4 values stats used in Admin and Profile
 * @param {*} param0
 * @returns
 */
function StatComponent({ user, stats }) {
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
              <div className="icon-box">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default StatComponent;
