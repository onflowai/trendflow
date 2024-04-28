import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Text,
} from 'recharts';
import Container from '../assets/wrappers/AreaChartContainer';
/**
 *
 * @param {*} props
 * @returns
 */
function CustomizedAxisTick(props) {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <Text
        x={0}
        y={10}
        dy={16}
        textAnchor="middle"
        fill="#b3b3b3"
        transform="rotate(0)"
        fontSize={13}
      >
        {payload.value}
      </Text>
    </g>
  );
}
function AreaChartComponent({ data, forecastData }) {
  // const chartData = forecastData.length ? [...data, ...forecastData] : data;
  const allData = [...data, ...forecastData];
  return (
    <Container>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4541de" stopOpacity={1} />
              <stop offset="95%" stopColor="#e976c7" stopOpacity={0} />
            </linearGradient>
            {/* <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={1} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.5} />
            </linearGradient> */}
          </defs>
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
            allowDecimals={false}
            tick={{ fill: '#b3b3b3', fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: '#ededed' }}
            contentStyle={{
              backgroundColor: '#f6f6f6',
              border: 'none',
              radius: '8px',
              outline: 'none',
              borderRadius: '10px',
              padding: '10px',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#4541de"
            fill="url(#colorCount)"
            animationDuration={400}
            animationEasing="ease-out"
          />
          {allData.length > 0 && (
            <Area
              type="monotone"
              dataKey="count"
              data={allData}
              stroke="#4541de"
              fill="url(#colorForecast)"
              animationDuration={400}
              animationEasing="ease-out"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default AreaChartComponent;
