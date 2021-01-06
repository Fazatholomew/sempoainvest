import React from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from './rechart';
import {
  anuitas,
  generateCreditData,
  generateInvestData,
  loadData,
} from '../../utils/calculations';

import {dataPoint, anuitasParams} from '../../utils/@types.calculations';

interface Props {
  isShow?: boolean;
}

interface chartData {
  kredit: number;
  investasi: number;
  name: string;
  AAPL: number;
}

const Chart = (props: Props) => {
  const lama:number = 15;
  const input:anuitasParams = {
    kredit: 1600000000,
    bungaPerBulan: 7.7 / 100 / 12,
    tenor: lama * 12,
  };
  const rawTickerData: dataPoint[] = loadData('ANTM');
  const tickerData: number[] = rawTickerData.slice(0, input.tenor).reverse().map((currentData: dataPoint) => currentData.changes / 100);
  const bulanan:number = anuitas(input);
  const investData: number[] = generateInvestData({
    ...input,
    bulanan,
    tickerData,
    cashOutInterval: 12
  });
  const kreditData: number[] = generateCreditData({
    ...input,
    bulanan
  });
  const data: chartData[] = [];
  for (let i:number = 0; i < input.tenor + 1; i += 1) {
    data.push({
      name: i.toString(),
      kredit: kreditData[i] / 1000,
      investasi: investData[i] / 1000,
      AAPL: tickerData[i]
    });
  }
  return (
    <LineChart
      width={700}
      height={300}
      data={data}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="kredit" stroke="#8884d8" activeDot={{r: 8}}/>
        <Line type="monotone" dataKey="investasi" stroke="#82ca9d" activeDot={{r: 8}}/>
    </LineChart>
  )
}

export default Chart
