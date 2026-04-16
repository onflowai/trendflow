import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import FallbackChart from './FallbackChart';
import Container from '../assets/wrappers/ChartsContainer';
import { TiMediaRewind, TiMediaFastForward } from 'react-icons/ti';
import { TbTimeline } from 'react-icons/tb';
import trendFallbackLocal from '../assets/images/fallback-tech.svg';

/**
 * 
 */
const TREND_FALLBACK_CDN = 'https://cdn.trendflowai.com/content/fallback-tech.svg';

function ChartTrendComponent({ data, forecast, trend, trendLogo }) {

  const hasData =
    Array.isArray(data?.previousYear) &&
    Array.isArray(data?.currentYear) &&
    (data.previousYear.length || data.currentYear.length);

  if (!hasData) {
    return (
      <Container>
        <div className="chart-header">
          <div className="logo-trend">
            <img
              src={trendLogo || TREND_FALLBACK_CDN}
              onError={(e) => {
                e.currentTarget.src = trendFallbackLocal;
              }}
              style={{ width: '20px' }}
              className="trend-logo"
              alt=""
              draggable={false}
            />
            <div className="trend-title">{trend || 'Trend'}</div>
          </div>
        </div>
        <FallbackChart /> {/*HERE*/}
      </Container>
    );
  }

  const { previousYear, currentYear } = data;

  const combinedData = useMemo(
    () => [...previousYear, ...currentYear],
    [previousYear, currentYear]
  );

  const combinedForecast = useMemo(
    () => [
      ...(forecast?.previousYear || []),
      ...(forecast?.currentYear || []),
    ],
    [forecast]
  );

  const [chartData, setChartData] = useState(combinedData);
  const [dataView, setDataView] = useState('combined');
  const [forecastData, setForecastData] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [chartOption, setChartOption] = useState({ value: 'bar', label: 'Bar Chart' });

  const chartOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
  ];

  const handleChartTypeChange = (selectedOption) => setChartOption(selectedOption);

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
      setChartData(combinedData);
      setDataView('combined');
      return;
    }
    if (type === 'previous') setChartData(previousYear);
    if (type === 'current') setChartData(currentYear);
    setDataView(type);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: '1.5px solid var(--grey-70)',
      borderRadius: 'var(--input-radius-rounded)',
      boxShadow: state.isFocused ? 'var(--grey-50)' : 'none',
      '&:hover': { border: '1.5px solid var(--grey-100)' },
      backgroundColor: 'var(--selector-main-color)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--primary-100)'
        : state.isFocused
        ? 'var(--primary-300)'
        : 'transparent',
      color: 'var(--text-color)',
      '&:hover': { backgroundColor: 'var(--primary-200)' },
    }),
    menu: (provided) => ({
      ...provided,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // custom menu shadow
      borderRadius: 'var(--border-radius-inner)', // rounded corners
      backgroundColor: 'var(--select-small-dropdown-color)',
    }),
    singleValue: (provided) => ({ ...provided, color: 'var(--text-color)' }),
  };

  return (
    <Container>
      <div className="chart-header">
        <div className="logo-trend">
          <img
            src={trendLogo || TREND_FALLBACK_CDN}
            onError={(e) => {
              e.currentTarget.src = trendFallbackLocal;
            }}
            style={{ width: '20px' }}
            className="trend-logo"
            alt=""
            draggable={false}
          />
          <div className="trend-title">{trend}</div>
        </div>

        <div className="chart-controls-container">
          <div className="chart-controls">
            <button
              type="button"
              className={`text-button ${dataView === 'previous' ? 'active' : ''}`}
              onClick={() => handleArrowClick('previous')}
            >
              <div className={`circle ${dataView === 'previous' ? 'active' : ''}`} />
              {new Date().getFullYear() - 1}
            </button>

            <button
              type="button"
              className={`text-button ${dataView === 'current' ? 'active' : ''}`}
              onClick={() => handleArrowClick('current')}
            >
              <div className={`circle ${dataView === 'current' ? 'active' : ''}`} />
              {new Date().getFullYear()}
            </button>

            {combinedForecast.length > 0 && (
              <button
                type="button" //HERE
                className={`text-button ${showForecast ? 'active' : ''}`}
                onClick={toggleForecast}
              >
                <div className={`circle ${showForecast ? 'active' : ''}`} />
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
            type="button" //HERE
            className={`icon-button ${dataView === 'previous' ? 'active' : ''}`}
            onClick={() => handleArrowClick('previous')}
          >
            <TiMediaRewind className={`icon ${dataView === 'previous' ? 'active' : ''}`} />
          </button>

          <button
            type="button" //HERE
            className={`icon-button ${dataView === 'current' ? 'active' : ''}`}
            onClick={() => handleArrowClick('current')}
          >
            <TiMediaFastForward className={`icon ${dataView === 'current' ? 'active' : ''}`} />
          </button>

          {combinedForecast.length > 0 && (
            <button
              type="button" //HERE
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