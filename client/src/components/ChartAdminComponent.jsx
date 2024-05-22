import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';
import { TiMediaRewind, TiMediaFastForward } from 'react-icons/ti';
import { TbTimeline } from 'react-icons/tb';
/**
 * Component used for passing data needed for charts from Admin page which uses TrendPage styling
 * @param {*} param0
 * @returns
 */
function ChartAdminComponent({ data, title }) {
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
      <div className="chart-header">
        <div className="trend-title">{title}</div>
        <div className="chart-controls-container">
          <div className="chart-controls">
            <button
              className={`text-button ${chartType === 'users' ? 'active' : ''}`}
              onClick={() => setChartType('users')}
            >
              <div
                className={`circle ${chartType === 'users' ? 'active' : ''}`}
              ></div>
              Users
            </button>
            <button
              className={`text-button ${
                chartType === 'guest users' ? 'active' : ''
              }`}
              onClick={() => setChartType('guest users')}
            >
              <div
                className={`circle ${
                  chartType === 'guest users' ? 'active' : ''
                }`}
              ></div>
              Guest
            </button>
            <button
              className={`text-button ${
                chartType === 'trends' ? 'active' : ''
              }`}
              onClick={() => setChartType('trends')}
            >
              <div
                className={`circle ${chartType === 'trends' ? 'active' : ''}`}
              ></div>
              Trends
            </button>
          </div>
          <div className="chart-selector-container">
            <Select
              className="chart-selector"
              value={chartOption}
              onChange={handleChartTypeChange}
              options={chartOptions}
            />
          </div>
        </div>
        <div className="chart-controls-icons">
          <button
            className={`icon-button ${chartType === 'users' ? 'active' : ''}`}
            onClick={() => setChartType('users')}
          >
            <TiMediaRewind
              className={`icon ${chartType === 'users' ? 'active' : ''}`}
            />
          </button>
          <button
            className={`icon-button ${
              chartType === 'guest users' ? 'active' : ''
            }`}
            onClick={() => setChartType('guest users')}
          >
            <TiMediaFastForward
              className={`icon ${chartType === 'guest users' ? 'active' : ''}`}
            />
          </button>
          <button
            className={`icon-button ${chartType === 'trends' ? 'active' : ''}`}
            onClick={() => setChartType('trends')}
          >
            <TbTimeline
              className={`icon ${chartType === 'trends' ? 'active' : ''}`}
            />
          </button>
          <div className="chart-selector-container-small">
            <Select
              className="chart-selector"
              value={chartOption}
              onChange={handleChartTypeChange}
              options={chartOptions}
            />
          </div>
        </div>
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
