import React from 'react';
import { useState } from 'react';
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';
/**
 * Conditionally displays charts components and passes the data accordingly
 * @param {*} param0
 * @returns
 */
function ChartsComponent({ data }) {
  const [barChart, setBarChart] = useState(true); //value used to toggle between char and graph charts

  return (
    <Container>
      <h5>Stats:</h5>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? 'more stats' : 'more stats'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Container>
  );
}

export default ChartsComponent;
