import React from 'react';
import Trend from './Trend';
import { useAllTrendsContext } from '../pages/AllTrends';
import Container from '../assets/wrappers/TrendsContainer';

/**
 * Trends Component displays all of the Trends in the AllTrends page
 * @returns
 */

function Trends() {
  const { data } = useAllTrendsContext();
  const { trends } = data; //destructuring trends in the data
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
          return <Trend key={trend._id} {...trend}></Trend>;
        })}
      </div>
    </Container>
  );
}

export default Trends;
