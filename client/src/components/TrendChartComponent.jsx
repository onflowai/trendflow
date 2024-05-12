import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import FallbackChart from './FallbackChart';
import TrendChart from './TrendChart';
import Container from '../assets/wrappers/ChartsContainer';
/**
 * TrendChartComponent is used by Trend.jsx to manage the chart state for each trend card
 * @param {*} param0
 * @returns
 */
function TrendChartComponent({ data, isApproved }) {
  const { previousYear, currentYear } = data; // destructuring the passed charts data
  const combinedData = [...previousYear, ...currentYear];
  const latestData = combinedData.slice(-12); // getting only the latest 12 data points
  return (
    <Container>
      {isApproved ? <TrendChart data={latestData} /> : <FallbackChart />}
    </Container>
  );
}

export default TrendChartComponent;
