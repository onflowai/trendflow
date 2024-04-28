import React, { useState } from 'react';
import Select from 'react-select'; // Import Select from react-select
import BarChart from './BarChartComponent';
import AreaChart from './AreaChartComponent';
import Container from '../assets/wrappers/ChartsContainer';

function ChartTrendComponent({ data }) {
  const { previousYear, currentYear } = data;
  const combinedData = [...previousYear, ...currentYear];
  const forecast = [
    { date: 'Apr 2024', count: 84 },
    { date: 'May 2024', count: 84 },
    { date: 'Jun 2024', count: 86 },
    { date: 'Jul 2024', count: 88 },
  ];
  console.log('CHART DATA', combinedData);
  console.log('FORECAST IN COMPONENT ', forecast);
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
    setForecastData(forecastData.length ? [] : forecast);
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
        <div>
          <button onClick={toggleForecast}>Forecast</button>
        </div>
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
        <AreaChart data={chartData} forecastData={forecastData} />
      ) : (
        <BarChart data={chartData} forecastData={forecastData} />
      )}
    </Container>
  );
}

export default ChartTrendComponent;
