import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
  Label
} from './rechart';
import {
  anuitas,
  generateCreditData,
  generateInvestData,
  loadData,
  bigNumberConverter,
} from '../../utils/calculations';
import AxisLabel from './chartComponents';
import {dataPoint, anuitasParams, bigNumber} from '../../utils/@types.calculations';

interface Props {
  dimensions: {
    width: number,
    height: number,
  };
}

interface chartData {
  kredit: number;
  investasi: number;
  name: string;
  "Margin of Error": number[],
}

const satuan: string[] = ['', 'Ribu', 'Juta', 'Milyar', 'Triliun', 'Kuadriliun', 'Kuantiliun', 'Sekstiliun']

/**
 * Render Data into line chart.
 * @param {number}  inputNumber - Big Number.
 * @return {object} Converted number and How many zero's.
 */

const Chart = ({dimensions}: Props) => {
  const lama:number = 7;
  const cashOutInterval:number = 12;
  const input:anuitasParams = {
    kredit: 10000000000,
    bungaPerBulan: 4.8 / 100 / 12,
    tenor: lama * 12,
  };
  const rawTickerData: dataPoint[] = loadData('BBCA');
  const tickerData: number[] = rawTickerData.slice(0, input.tenor).reverse().map((currentData: dataPoint) => currentData.changes / 100);
  const bulanan:number = anuitas(input);
  const investData: number[] = generateInvestData({
    ...input,
    bulanan,
    tickerData,
    cashOutInterval
  });
  const kreditData: number[] = generateCreditData({
    ...input,
    bulanan
  });
  const data: chartData[] = [];
  const maxInvest: number = Math.max(...investData);
  const maxY: number = Math.max(maxInvest, Math.max(...kreditData));
  const {zeros}: {zeros:number} = bigNumberConverter(maxInvest);
  for (let i:number = 0; i < input.tenor + 1; i += 1) {
    const investasi:number = bigNumberConverter(investData[i], zeros).smallNumber
    const kredit:number = bigNumberConverter(kreditData[i], zeros).smallNumber
    data.push({
      name: i.toString(),
      kredit,
      investasi,
      "Margin of Error": [bigNumberConverter(investData[i] * 0.975, zeros).smallNumber, bigNumberConverter(investData[i] * 1.025, zeros).smallNumber],
    });
  }
  const renderReferenceAreas: any[] = [];
  for (let i:number = 1; i < lama; i += 1) {
    const color: string = i % 2 === 0 ? 'white' : 'grey';
    renderReferenceAreas.push(
      <ReferenceLine
        x={((i * cashOutInterval)).toString()}
        stroke={color}
        label={{ value: `Penarikan Investasi Ke-${i + 1}`, angle: -90, position: 'left', offset: 20, fill: color }} 
        key={i}
        strokeDasharray="3 3"
      />
    )
  }
  return (
    <ComposedChart width={dimensions.width * 0.95} height={dimensions.height * 0.95}
      data={data}
      >
        <XAxis dataKey="name">
          <Label 
            value="Pembayaran" 
            fill="white"
            position="bottom"
          />
        </XAxis>
        <YAxis
          label={{ value: `RP (${satuan[zeros]})`, angle: -90, position: 'left', offset: -6, fill: 'white' }}
        />
        <Tooltip />
        <Legend verticalAlign= "top" height={50}/>
        {renderReferenceAreas}
        <Area type="monotone" dataKey="Margin of Error" stroke="#8884d8" fill="#8884d8" legendType='square'/>
        <Line type="monotone" dataKey="kredit" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="investasi" stroke="#82ca9d" activeDot={{r: 8}}/>
    </ComposedChart>
  )
}

export default Chart
