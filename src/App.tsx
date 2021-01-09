import React, {useRef, useLayoutEffect, useState} from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Answers from './containers/Answers';
import {InvestasiModal, KreditModal} from './containers/Answers/modals';
import {
  anuitas,
  generateCreditData,
  generateInvestData,
  loadData,
  bigNumberConverter,
} from './utils/calculations';
import {
  bigNumber,
  dataProps,
  dataPoint,
  anuitasParams,
  investDataType
} from './utils/@types.calculations';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#FF5E7A'
    },
    primary: {
      main: '#8CD881'
    },
    text: {
      primary: '#002',
      secondary: '#90caf9',
    }
  }
});

function App() {
  const initData: dataProps = {};
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(initData);
  
  const handleNext = (inputData?: dataProps) => {
    if (inputData) {
      const newDataBuffer: dataProps = { ...data, ...inputData};
      if (newDataBuffer.saham) {
        const filterNotNumber = (str: string): number => {
          const matches = str.match(/(\d+)/);
          return parseFloat(matches.join(''));
        }
        const {
          kredit,
          dp,
          bunga,
          bulan,
          tahun,
          saham,
          frekuensi
        }:dataProps = newDataBuffer;
        const lama:number = (filterNotNumber(tahun as string) + (filterNotNumber(bulan as string) / 12));
        const cashOutInterval:number = filterNotNumber(frekuensi as string);
        const input:anuitasParams = {
          kredit: filterNotNumber(kredit as string) * (1 - (filterNotNumber(dp as string) / 100)),
          bungaPerBulan: filterNotNumber(bunga as string) / 100 / 12,
          tenor: lama * 12,
        };
        const rawTickerData: dataPoint[] = loadData(saham as string);
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
        newDataBuffer['investData'] = investData;
        newDataBuffer['kreditData'] = kreditData;
        newDataBuffer['marginOfError'] = marginOfError;
        newDataBuffer['bulanan'] = bulanan;
      }
      setData(newDataBuffer);
    }
    setIndex((index + 1) % 2);
  };
  const modals = [
    (<KreditModal initDisable={false} isShown={true} handleSubmit={handleNext} initData={data} />),
    (<InvestasiModal initDisable={false} isShown={true} handleSubmit={handleNext} initData={data} />),
    
  ];
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <header className="App-header">
          <h1>Sempoa Investasi</h1>
          {data.saham ? (<Answers data={data} handleSubmit={handleNext}  />) : modals[index]}
        </header>
      </MuiThemeProvider>
      <footer>
        <p>Copyright © 2021 Jimmy 'Bang Koboi'</p>
        <p>Buatan Bandung.</p>
      </footer>
    </div>
  );
}

export default App;
