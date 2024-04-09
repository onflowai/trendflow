import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import TrendChart from './TrendChart';
import Container from '../assets/wrappers/ChartsContainer';
/**
 * TrendChartComponent is used by Trend.jsx to manage the chart state for each trend card
 * @param {*} param0
 * @returns
 */
function TrendChartComponent({ data }) {
  // Destructuring the passed charts data
  const { previousYear, currentYear } = data;
  const combinedData = [...previousYear, ...currentYear];
  return (
    <Container>
      <TrendChart data={combinedData} />
    </Container>
  );
}

export default TrendChartComponent;
