import React, { useState } from 'react';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';

/**
 * Component used for passing data needed for charts from Edit Trend page
 * @param {*} param0
 * @returns
 */
function ChartEdiTrendComponent({ data, forecast, trend, trendLogo }) {
  const { previousYear, currentYear } = data; // destructure the provided data
  const chartData = [...previousYear, ...currentYear]; //combining the trend data from previous and current years

  const forecastData = [
    ...(forecast.previousYear || []),
    ...(forecast.currentYear || []),
  ]; // combining the forecast data (if provided), with a fallback to an empty array

  return (
    <Container>
      <AreaChart data={chartData} forecastData={forecastData} />
    </Container>
  );
}

export default ChartEdiTrendComponent;
