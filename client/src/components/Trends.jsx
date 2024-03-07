import React from 'react';
import Trend from './Trend';
import Container from '../assets/wrappers/TrendsContainer';

/**
 * Trends Component displays all of the Trends in the AllTrends page
 * @returns
 */

function Trends({ trends, onApprove }) {
  console.log(trends);
  if (trends.length === 0) {
    return (
      <Container>
        <h2>NO TRENDS</h2>
      </Container>
    );
  }
  return (
    <Container>
      <div className="trends">
        {trends.map((trend) => {
          return (
            <Trend key={trend._id} {...trend} onApprove={onApprove}></Trend>
          );
        })}
      </div>
    </Container>
  );
}

export default Trends;
