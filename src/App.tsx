import React, {useState} from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Answers from './containers/Answers';
import {InvestasiModal, KreditModal} from './containers/Answers/modals';
import {
  anuitas,
  generateCreditData,
  generateInvestData,
  loadData,
  filterNotNumber
} from './utils/calculations';
import {
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
  const initData: dataProps = {
    kredit: '0',
    dp: '0',
    bunga: '0',
    bulan: '0',
    tahun: '1',
    frekuensi: '1',
    saham: ''
  };
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(initData);
  const [isShow, setIsShow] = useState(true);
  const handleNext = (inputData?: dataProps) => {
    if (inputData) {
      const newDataBuffer: dataProps = { ...data, ...inputData};
      if (newDataBuffer.saham) {
        const {
          kredit,
          dp,
          bunga,
          bulan,
          tahun,
          saham,
          frekuensi
        }:dataProps = newDataBuffer;
        const rawUrlData = {
          kredit,
          dp,
          bunga,
          bulan,
          tahun,
          saham,
          frekuensi
        };
        const url = new URL(window.location.href);
        const urlData = Object.entries(rawUrlData).map(([key, value]) => {
          url.searchParams.set(key, value);
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }).join('&');
        window.history.pushState({before: urlData}, '', url.href);
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
        newDataBuffer['lama'] = lama;
        newDataBuffer['cashOutInterval'] = cashOutInterval;
      }
      setData(newDataBuffer);
    }
    if (index === 3) {
      return;
    }
    setIsShow(false);
    setIndex((index + 1) % 3);
    setTimeout(() => {
      setIsShow(true);
    }, 50);
    if (index + 1 === 2) {
      if (!inputData.saham) {
        setIndex(0);
      }else{
        setTimeout(() => {
          setIndex(3)
          setIsShow(true);
        }, 3000);
      }
    }
  };
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <header className="App-header">
          <h1>Sempoa Investasi</h1>
          {index === 0 ? <KreditModal initDisable={false} isShown={isShow} handleSubmit={handleNext} initData={data} /> : null}
          {index === 1 ? <InvestasiModal initDisable={false} isShown={isShow} handleSubmit={handleNext} initData={data} /> : null}
          {index === 2 ? <CircularProgress /> : null}
          {data.saham && index === 3 ? (<Answers data={data} handleSubmit={handleNext}  />) : null}
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
