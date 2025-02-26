import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';
import { FaUserCheck, FaUserClock } from 'react-icons/fa6';
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

  //react-select custom styling
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1.5px solid var(--grey-70)', // custom border
      borderRadius: 'var(--input-radius-rounded)', // rounded corners
      boxShadow: state.isFocused ? 'var(--grey-50)' : 'none', // shadow on focus
      '&:hover': {
        border: '1.5px solid var(--grey-100)', // Custom hover color
      },
      backgroundColor: 'var(--selector-main-color)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--primary-100)' // custom selected background color
        : state.isFocused
          ? 'var(--primary-300)' // custom hover background color
          : 'transparent', // default background
      color: state.isSelected
        ? 'var(--text-color)' // Text color for selected option
        : state.isFocused
          ? 'var(--text-color)' // Text color for focused (hovered) option
          : 'var(--text-color)', // Text color for default options
      '&:hover': {
        backgroundColor: 'var(--primary-200)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // custom menu shadow
      borderRadius: 'var(--border-radius-inner)', // rounded corners
      backgroundColor: 'var(--select-small-dropdown-color)',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
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
              styles={customStyles}
            />
          </div>
        </div>
        <div className="chart-controls-icons">
          <button
            className={`icon-button ${chartType === 'users' ? 'active' : ''}`}
            onClick={() => setChartType('users')}
          >
            <FaUserCheck
              className={`icon ${chartType === 'users' ? 'active' : ''}`}
            />
          </button>
          <button
            className={`icon-button ${
              chartType === 'guest users' ? 'active' : ''
            }`}
            onClick={() => setChartType('guest users')}
          >
            <FaUserClock
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
              styles={customStyles}
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
