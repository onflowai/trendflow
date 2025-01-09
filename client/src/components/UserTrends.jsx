import React from 'react';
import Trend from './Trend';
import Container from '../assets/wrappers/UserTrendsContainer';

/**
 * Trends Component displays all of the Trends in the AllTrends page. Here styling is created for the layout of the trend cards
 * and it is where values from AllTrends and Admin is passed then used in child component trend which displays very single trend
 * @returns
 */

function UserTrends({ trends, savedTrends, onRemove }) {
  //Values used to style recharts in Profile page
  const chartHeight = 210;
  const chartMarginTop = 5;
  const chartMarginBottom = -40;

  const isAdminPage = false; // hardcoding value to prevent tampering
  if (trends.length === 0) {
    return (
      <Container>
        <h2>NO SAVED TRENDS YET</h2>
      </Container>
    );
  }
  return (
    <Container>
      <div className="trends">
        {trends.map((trend) => {
          return (
            <Trend
              key={trend._id}
              {...trend}
              isAdminPage={isAdminPage}
              savedTrends={savedTrends}
              onRemove={onRemove}
              chartHeight={chartHeight}
              chartMarginTop={chartMarginTop}
              chartMarginBottom={chartMarginBottom}
            ></Trend>
          );
        })}
      </div>
    </Container>
  );
}

export default UserTrends;
