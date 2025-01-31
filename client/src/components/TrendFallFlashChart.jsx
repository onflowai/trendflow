import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import Container from '../assets/wrappers/FlashChartContainer';

function TrendFallFlashChart({
  chartHeight,
  chartMarginTop,
  chartMarginBottom,
}) {
  const data = Array.from({ length: 4 }, (_, i) => ({
    date: `Month ${i + 1}`,
    count: Math.floor(Math.random() * (80 - 40 + 1)) + 40, // Generates a random count between 0 and 99 (between 40 and 80)
  }));
  return (
    <Container>
      <ResponsiveContainer width="100%" height={chartHeight} debounce={500}>
        <AreaChart
          data={data}
          margin={{
            top: chartMarginTop,
            right: 0,
            left: -60,
            bottom: chartMarginBottom,
          }}
        >
          <defs>
            <linearGradient id="fallback" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4e4e4e" stopOpacity={1} />
              <stop offset="95%" stopColor="#d4d4d4" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis axisLine={false} dataKey="date" height={60} tick={false} />
          <YAxis
            axisLine={false}
            allowDecimals={false}
            tick={false} // Keeps Y-axis ticks hidden
          />
          <Area
            style={{ cursor: 'pointer' }}
            type="monotone"
            dataKey="count"
            stroke="#838383"
            fill="url(#fallback)"
            animationDuration={400}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default TrendFallFlashChart;
