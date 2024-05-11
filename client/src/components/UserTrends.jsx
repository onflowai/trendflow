import React from 'react';
import Trend from './Trend';
import Container from '../assets/wrappers/UserTrendsContainer';

/**
 * Trends Component displays all of the Trends in the AllTrends page. Here styling is created for the layout of the trend cards
 * and it is where values from AllTrends and Admin is passed then used in child component trend which displays very single trend
 * @returns
 */

function UserTrends({ trends, savedTrends, onRemove }) {
  console.log('savedTrends:', savedTrends);
  const isAdminPage = false; // hardcoding value to prevent tampering
  console.log('TRENDS:', trends);
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
            ></Trend>
          );
        })}
      </div>
    </Container>
  );
}

export default UserTrends;
