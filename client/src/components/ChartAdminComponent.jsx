import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';
/**
 * Component used for passing data needed for charts from Admin page
 * @param {*} param0
 * @returns
 */
function ChartAdminComponent({ data }) {
  const [chartType, setChartType] = useState('trends');
  const [chartOption, setChartOption] = useState({
    value: 'bar',
    label: 'Bar Chart',
  }); // Use object for react-select

  // Destructuring the passed data
  const { monthUsers, monthTrends, guestUserVisit } = data;

  const chartOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
  ];

  const getCurrentData = () => {
    switch (chartType) {
      case 'users':
        return monthUsers;
      case 'guest users':
        return guestUserVisit;
      case 'trends':
      default:
        return monthTrends;
    }
  };

  // Handles changing the chart type from the dropdown
  const handleChartTypeChange = (selectedOption) => {
    setChartOption(selectedOption);
  };

  return (
    <Container>
      <h5>Stats:</h5>
      <div>
        <button onClick={() => setChartType('users')}>Users</button>
        <button onClick={() => setChartType('guest users')}>Guest Users</button>
        <button onClick={() => setChartType('trends')}>Trends</button>
      </div>
      <div>
        <Select
          value={chartOption}
          onChange={handleChartTypeChange}
          options={chartOptions}
        />
      </div>
      {chartOption.value === 'bar' ? (
        <BarChart data={getCurrentData()} />
      ) : (
        <AreaChart data={getCurrentData()} />
      )}
    </Container>
  );
}

export default ChartAdminComponent;
