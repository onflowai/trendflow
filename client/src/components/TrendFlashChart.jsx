import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import Container from '../assets/wrappers/FlashChartContainer';
/**
 * This chart is used desktop view for related trends in TrendPage & in mobile view for grid-view AllTrends + Admin
 * chartHeight, chartMarginTop, chartMarginBottom passed from parents if undefined set to default values' ='
 * @param {*} param0
 * @returns
 */
function AreaChartComponent({
  data,
  chartHeight,
  chartMarginTop,
  chartMarginBottom,
}) {
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
            <linearGradient id="colorCountTwo" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--flash-chart-color1, #9AD0F5)" // fallback color
                stopOpacity={1}
              />
              <stop
                offset="95%"
                stopColor="var(--flash-chart-color2, #EFEEF0)" // fallback color
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis axisLine={false} dataKey="date" height={60} tick={false} />
          <YAxis axisLine={false} allowDecimals={false} tick={false} />
          <Area
            style={{ cursor: 'pointer' }}
            type="monotone"
            dataKey="count"
            stroke="var(--flash-chart-line-color)"
            fill="url(#colorCountTwo)"
            animationDuration={400}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default AreaChartComponent;
