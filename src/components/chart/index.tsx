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
import {DataToolTip} from './chartComponents';
import {
  dataPoint,
  anuitasParams,
  bigNumber,
  investDataType
} from '../../utils/@types.calculations';

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


const gradientOffset = (data:number[]) => {
  const dataMax = Math.max(...data);
  const dataMin = Math.min(...data);

  if (dataMax <= 0){
  	return 0
  }
  else if (dataMin >= 0){
  	return 1
  }
  else{
  	return dataMax / (dataMax - dataMin);
  }
}

/**
 * Render Data into line chart.
 * @param {number}  inputNumber - Big Number.
 * @return {object} Converted number and How many zero's.
 */

const Chart = ({dimensions}: Props) => {
  const lama:number = 10;
  const cashOutInterval:number = 12;
  const input:anuitasParams = {
    kredit: 500000000,
    bungaPerBulan: 7 / 100 / 12,
    tenor: lama * 12,
  };
  const rawTickerData: dataPoint[] = loadData('ANTM');
  const tickerData: number[] = rawTickerData.slice(0, input.tenor).reverse().map((currentData: dataPoint) => currentData.changes / 100);
  const bulanan:number = anuitas(input);
  const {investData, marginOfError}: investDataType = generateInvestData({
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
  const maxX: number = Math.max(Math.max(...kreditData));
  const {zeros}: {zeros:number} = bigNumberConverter(maxInvest);
  for (let i:number = 0; i < input.tenor + 1; i += 1) {
    const investasi:number = bigNumberConverter(investData[i], zeros).smallNumber
    const kredit:number = bigNumberConverter(kreditData[i], zeros).smallNumber
    data.push({
      name: i.toString(),
      kredit,
      investasi,
      "Margin of Error": [
        bigNumberConverter(marginOfError[i][0], zeros).smallNumber,
        bigNumberConverter(marginOfError[i][1], zeros).smallNumber,
      ],
    });
  }
  const renderReferenceAreas: any[] = [];
  for (let i:number = 1; i < (lama * 12); i += 1) {
    const color: string = i % 2 === 0 ? 'white' : '#9AAEBB';
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
  const off = gradientOffset(investData);
  return (<ComposedChart 
      width={dimensions.width * 0.97}
      height={dimensions.height > dimensions.width ? dimensions.width * 0.75 : dimensions.height  * 0.95}
      data={data}
      margin={{bottom: 20}}>
        <XAxis dataKey="name">
          <Label 
            value="Pembayaran" 
            fill="white"
            offset={0}
            position="bottom"
          />
        </XAxis>
        <YAxis
          label={{ value: `Rp (${satuan[zeros]})`, angle: -90, position: 'left', offset: -13, fill: 'white' }}
        />
        <Tooltip content={(props: any) => (<DataToolTip {...props} zeros={zeros} />)} />
        <Legend verticalAlign= "top" height={50}/>
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="#82ca9d" stopOpacity={1}/>
            <stop offset={off} stopColor="#E27161" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="Margin of Error" strokeDasharray="3 3" stroke="grey" fill="transparent" legendType='plainline'/>
        <Line type="linear" dataKey="kredit" stroke="#E27161" dot={false} />
        <Area type="monotone" dataKey="investasi" fill="url(#splitColor)" stroke="#82ca9d" activeDot={{r: 8}}/>
        {renderReferenceAreas}
    </ComposedChart>)
}

export default Chart
