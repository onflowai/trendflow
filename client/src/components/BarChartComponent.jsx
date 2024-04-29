import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
} from 'recharts';
import Container from '../assets/wrappers/BarChartContainer';
/**
 * Bar Chart takes on values from multiple pages: Admin, TrendPage, and Trends to display a rechart
 * forecastData = [] (this returns empty array if there is no value) is passed from TrendPage
 * @param {*} props
 * @returns
 */
function CustomizedAxisTick(props) {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <Text
        x={0}
        y={10}
        dy={16}
        textAnchor="middle"
        fill="#b3b3b3"
        transform="rotate(0)"
        tick={{ fill: '#b3b3b3' }}
        fontSize={13}
      >
        {payload.value}
      </Text>
    </g>
  );
}

function BarChartComponent({ data, forecastData = [] }) {
  // const chartData = forecastData.length ? [...data, ...forecastData] : data;
  const allData = [...data, ...forecastData];
  return (
    <Container>
      {console.log('FORECAST IN CHART: ', forecastData)}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 2"
            strokeWidth={0.4}
            vertical={false}
          />
          <XAxis
            axisLine={{ stroke: '#b3b3b3' }}
            dataKey="date"
            height={60}
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            axisLine={{ stroke: '#b3b3b3' }}
            tick={{ fill: '#b3b3b3', fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: '#ededed' }}
            contentStyle={{
              backgroundColor: '#f6f6f6',
              border: 'none',
              radius: '8px',
              outline: 'none',
            }}
          />
          <defs>
            <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4541de" stopOpacity={1} />
              <stop offset="95%" stopColor="#e976c7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {/* <Bar dataKey="count" fill="url(#barColor)" radius={[8, 8, 0, 0]} /> */}
          {allData.length > 0 && (
            <Bar
              dataKey="count"
              fill="url(#barColor)"
              radius={[8, 8, 0, 0]}
              type="monotone"
              // dataKey="count"
              data={allData}
              // radius={[8, 8, 0, 0]}
              // stroke="#82ca9d"
              // fill="url(#colorForecast)"
              animationDuration={400}
              animationEasing="ease-out"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default BarChartComponent;
