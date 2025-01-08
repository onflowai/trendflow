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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--tool-tip-background)', // Tooltip background
          padding: '10px', // Padding inside the box
          borderRadius: '10px', // Rounded corners
          boxShadow: '0 2px 2px rgba(0,0,0,0.2)', // Subtle shadow
          fontSize: '10px', // Small font size
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        <p>
          <b> Δ :</b> {`${payload[0].value}%`}
        </p>
      </div>
    );
  }

  return null;
};

function BarChartComponent({ data, forecastData = [] }) {
  // const chartData = forecastData.length ? [...data, ...forecastData] : data;
  const allData = [...data, ...forecastData];
  return (
    <Container>
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
            axisLine={false}
            // axisLine={{ stroke: '#b3b3b3' }}
            tickLine={{ stroke: '#b3b3b3' }}
            dataKey="date"
            height={60}
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            axisLine={{ stroke: '#b3b3b3' }}
            tickLine={{ stroke: '#b3b3b3' }}
            tick={{ fill: '#b3b3b3', fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: 'var(--bar-chart-highlight)' }}
            contentStyle={{
              backgroundColor: 'var(--bar-chart-highlight)',
              border: 'none',
              radius: '8px',
              outline: 'none',
            }}
            content={<CustomTooltip />}
          />
          <defs>
            <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--bar-chart-color1)"
                stopOpacity={1}
              />
              <stop
                offset="95%"
                stopColor="var(--bar-chart-color2)"
                stopOpacity={0.05}
              />
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
