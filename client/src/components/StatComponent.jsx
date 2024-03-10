import React from 'react';
import Container from '../assets/wrappers/StatObjectContainer';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function StatComponent({ user, stats }) {
  return (
    <Container>
      <header>
        <h1>Welcome Back, {user} </h1>
        <p>Here is the information about all your trends</p>
      </header>
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
            {stat.change && (
              <div
                className={`change ${
                  stat.change > 0 ? 'positive' : 'negative'
                }`}
              >
                <FaArrowLeft /> {stat.change}% this week
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}

export default StatComponent;
