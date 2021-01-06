import React from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from './rechart';
import jsonData from '../../data.json';
interface Props {
  isShow?: boolean;
}
interface chartData {
  [index: number]: {
    data: string;
    name: string;
  }
}

const Chart = (props: Props) => {
  const {AAPL}: {AAPL: number[]} = jsonData;
  const data: chartData[] = AAPL.slice(0,10).reverse().map((currentData: number, index: number) => ({
    name: index.toString(),
    data: currentData,
  }));
  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      >
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="data" stroke="#8884d8" activeDot={{r: 8}}/>
    </LineChart>
  )
}

export default Chart
