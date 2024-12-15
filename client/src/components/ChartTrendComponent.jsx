import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';
import { TiMediaRewind, TiMediaFastForward } from 'react-icons/ti';
import { TbTimeline } from 'react-icons/tb';
/**
 * Component used for passing data needed for charts from Trend page
 * @param {*} param0
 * @returns
 */
function ChartTrendComponent({ data, forecast, trend, trendLogo }) {
  console.log('TRENDS IN PAGE', trend);
  const { previousYear, currentYear } = data;
  const combinedData = [...previousYear, ...currentYear]; //combining trend data
  const combinedForecast = [
    ...(forecast.previousYear || []),
    ...(forecast.currentYear || []),
  ]; //combining forecast data
  console.log('CHART DATA', combinedData);
  console.log('FORECAST IN COMPONENT ', combinedForecast);
  const [chartData, setChartData] = useState(combinedData);
  const [dataView, setDataView] = useState('combined'); //keeping track of current data displayed
  const [forecastData, setForecastData] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
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
  const toggleForecast = () => {
    if (forecastData.length) {
      setForecastData([]);
      setShowForecast(false);
    } else {
      setForecastData(combinedForecast);
      setShowForecast(true);
    }
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
        <div className="logo-trend">
          {trendLogo ? (
            <img
              src={trendLogo}
              style={{ width: '20px' }}
              className="trend-logo"
            />
          ) : null}
          <div className="trend-title">{trend}</div>
        </div>
        <div className="chart-controls-container">
          <div className="chart-controls">
            <button
              className={`text-button ${
                dataView === 'previous' ? 'active' : ''
              }`}
              onClick={() => handleArrowClick('previous')}
            >
              <div
                className={`circle ${dataView === 'previous' ? 'active' : ''}`}
              ></div>
              {new Date().getFullYear() - 1}
            </button>
            <button
              className={`text-button ${
                dataView === 'current' ? 'active' : ''
              }`}
              onClick={() => handleArrowClick('current')}
            >
              <div
                className={`circle ${dataView === 'current' ? 'active' : ''}`}
              ></div>
              {new Date().getFullYear()}
            </button>
            {combinedForecast.length > 0 && (
              <button
                className={`text-button ${showForecast ? 'active' : ''}`}
                onClick={toggleForecast}
              >
                <div className={`circle ${showForecast ? 'active' : ''}`}></div>
                Forecast
              </button>
            )}
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
            className={`icon-button ${dataView === 'previous' ? 'active' : ''}`}
            onClick={() => handleArrowClick('previous')}
          >
            <TiMediaRewind
              className={`icon ${dataView === 'previous' ? 'active' : ''}`}
            />
          </button>
          <button
            className={`icon-button ${dataView === 'current' ? 'active' : ''}`}
            onClick={() => handleArrowClick('current')}
          >
            <TiMediaFastForward
              className={`icon ${dataView === 'current' ? 'active' : ''}`}
            />
          </button>
          {combinedForecast.length > 0 && (
            <button
              className={`icon-button ${showForecast ? 'active' : ''}`}
              onClick={toggleForecast}
            >
              <TbTimeline className={`icon ${showForecast ? 'active' : ''}`} />
            </button>
          )}
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
        <AreaChart data={chartData} forecastData={forecastData} />
      ) : (
        <BarChart data={chartData} forecastData={forecastData} />
      )}
    </Container>
  );
}

export default ChartTrendComponent;
