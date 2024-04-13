import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';

function ChartTrendComponent({ data }) {
  const [chartOption, setChartOption] = useState({
    value: 'bar',
    label: 'Bar Chart',
  }); // Use object for react-select

  const chartOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
  ];

  // Handles changing the chart type from the dropdown
  const handleChartTypeChange = (selectedOption) => {
    setChartOption(selectedOption);
  };

  return (
    <Container>
      <div>
        <Select
          value={chartOption}
          onChange={handleChartTypeChange}
          options={chartOptions}
        />
      </div>
      {chartOption.value === 'bar' ? (
        <AreaChart data={data} />
      ) : (
        <BarChart data={data} />
      )}
    </Container>
  );
}

export default ChartTrendComponent;
