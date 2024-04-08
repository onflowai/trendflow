import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';

function TrendChart({ data }) {
  // Destructuring the passed charts data
  const { previousYear, currentYear } = data;
  const combinedData = [...previousYear, ...currentYear];
  return (
    <Container>
      <AreaChart data={combinedData} />
    </Container>
  );
}

export default TrendChart;
