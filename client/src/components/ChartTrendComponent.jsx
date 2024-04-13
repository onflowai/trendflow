import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';

function ChartTrendComponent({ data }) {
  const { previousYear, currentYear } = data;
  const combinedData = [...previousYear, ...currentYear];
  console.log('CHART DATA', combinedData);
  const [chartData, setChartData] = useState(combinedData);
  const [dataView, setDataView] = useState('combined'); //keeping track of current data displayed
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
  const handleArrowClick = (type) => {
    if (dataView === type) {
      // If already showing this year, switch to combined
      setChartData(combinedData);
      setDataView('combined');
    } else {
      // Otherwise, show the selected year
      if (type === 'previous') {
        setChartData(previousYear);
      } else if (type === 'current') {
        setChartData(currentYear);
      }
      setDataView(type);
    }
  };

  return (
    <Container>
      <div>
        <button onClick={() => handleArrowClick('previous')}>
          ← Previous Year
        </button>
        <button onClick={() => handleArrowClick('current')}>
          Current Year →
        </button>
        <Select
          value={chartOption}
          onChange={handleChartTypeChange}
          options={chartOptions}
        />
      </div>
      {chartOption.value === 'bar' ? (
        <AreaChart data={chartData} />
      ) : (
        <BarChart data={chartData} />
      )}
    </Container>
  );
}

export default ChartTrendComponent;
