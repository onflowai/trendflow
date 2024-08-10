import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';
import { TbTimeline } from 'react-icons/tb';

/**
 * This Component displays chart settings and a chart based on the given monthTrends data.
 * @param {*} param0
 * @returns
 */
function ChartSettingsComponent({ data, title }) {
  const [chartOption, setChartOption] = useState({
    value: 'bar',
    label: 'Bar Chart',
  }); // Use object for react-select

  // Destructuring the passed data to get monthTrends
  const { monthTrends } = data;

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
      <div className="chart-header">
        <div className="trend-title">{title}</div>
        <div className="chart-controls-container">
          <button className="text-button active">
            <div className="circle active"></div>
            Trends
          </button>
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
          <button className="icon-button active">
            <TbTimeline className="icon active" />
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
        <BarChart data={monthTrends} />
      ) : (
        <AreaChart data={monthTrends} />
      )}
    </Container>
  );
}

export default ChartSettingsComponent;
