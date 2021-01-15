import React, {useState, useEffect} from 'react';
import { MuiThemeProvider, createMuiTheme, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import './App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Answers from './containers/Answers';
import {InvestasiModal, KreditModal , SocialMediaButtons} from './containers/Answers/modals';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import HttpIcon from '@material-ui/icons/Http';
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
  investDataType,
  tickerDataProps
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    socialMediaIcon: {
      marginRight: '0.5vw',
      marginLeft: '0.5vw',
      '&:hover': {
        cursor: 'pointer',
        color: '#FF5E7A'
      }
    },
  }),
);

const App = () => {
  const initData: dataProps = {
    kredit: '0',
    dp: '0',
    bunga: '0',
    bulan: '0',
    tahun: '1',
    frekuensi: '1',
    saham: '',
    syariah: false
  };
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(initData);
  const [isShow, setIsShow] = useState(true);
  const [isShowSocial, setIsShowSocial] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const classes = useStyles();
  const {analytics} = window as any
  useEffect(() => {
    try {
      const search = window.location.search.substring(1);
      if (!search) {
        return;
      }
      const newData = JSON.parse('{"' + decodeURIComponent(decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"')) + '"}');
      const {
        kredit,
        dp,
        bunga,
        bulan,
        tahun,
        saham,
        frekuensi,
      }:dataProps = newData;
      const syariah = newData['syariah'] === 'true'
      newData['syariah'] = syariah
      const lama:number = (filterNotNumber(tahun as string) + (filterNotNumber(bulan as string) / 12));
      const cashOutInterval:number = filterNotNumber(frekuensi as string);
      const input:anuitasParams = {
        kredit: filterNotNumber(kredit as string) * (1 - (filterNotNumber(dp as string) / 100)),
        bungaPerBulan: filterNotNumber(bunga as string) / 100 / 12,
        tenor: lama * 12,
        isSyariah: syariah
      };
      const rawTickerData: tickerDataProps = loadData(saham as string);
      const bulanan:number = anuitas(input);   
      const {investData, marginOfError}: investDataType = generateInvestData({
        ...input,
        bulanan,
        tickerData: rawTickerData,
        cashOutInterval
      });
      const kreditData: number[] = generateCreditData({
        ...input,
        bulanan
      });
      newData['investData'] = investData;
      newData['kreditData'] = kreditData;
      newData['marginOfError'] = marginOfError;
      newData['bulanan'] = bulanan;
      newData['lama'] = lama;
      newData['cashOutInterval'] = cashOutInterval;
      newData['data'] = rawTickerData
      analytics('event', 'purchase', {
        items: [{
          item_id: newData.saham,
          discount: newData.bungaPerBulan * 12,
          item_category: newData.syariah ? 'syariah' : 'conventional',
          price: filterNotNumber(kredit as string),
          quantity: cashOutInterval
        }],
        transaction_id: `${Date.now()} ${window.location.search.substring(1)}`,
        shipping: (newData.investData[newData.investData.length - 1] / (bulanan * lama * 12)) * 100,
        value: bulanan * lama * 12,
        tax: dp
      })
      setData(newData);
      if (index !== 3) {
        setIsShow(true);
        setIndex(2);
        setTimeout(() => {
          setIndex(3)
          setIsShow(true);
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [window.location.href])
  try {
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
            frekuensi,
            syariah
          }:dataProps = newDataBuffer;
          const rawUrlData = {
            kredit,
            dp,
            bunga,
            bulan,
            tahun,
            saham,
            frekuensi,
            syariah
          };
          const url = new URL(window.location.href);
          const urlData = Object.entries(rawUrlData).map(([key, value]) => {
            url.searchParams.set(key, value);
            return `${encodeURI(key)}=${encodeURI(value)}`;
          }).join('&');
          window.history.pushState({before: urlData}, '', url.href);
          setIsShowSocial(true);
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
            <h1>{"💵🗽 Sempoa 🤑 Investasi 🏦🏠"}</h1>
            {index === 0 ? <KreditModal initDisable={false} isShown={isShow} handleSubmit={handleNext} initData={data} /> : null}
            {index === 1 ? <InvestasiModal initDisable={false} isShown={isShow} handleSubmit={handleNext} initData={data} /> : null}
            {index === 2 ? <CircularProgress /> : null}
            {data.saham && index === 3 ? (<Answers data={data} handleSubmit={handleNext}  />) : null}
            {index === 3 && data.saham && !isShare 
            ? (<SocialMediaButtons
                handleClose={() => {
                  setIsShowSocial(false);
                  setIsShare(true);
                }}
                initData={data}
                isShown={isShowSocial} />)
            : null}
          </header>
          <footer>
            <LinkedInIcon
              fontSize="small"
              className={classes.socialMediaIcon}
              onClick={() => {
                analytics('event', 'join_group', {
                  group_id: 'LinkedIn'
                });
                window.location.href = 'https://www.linkedin.com/in/faza-jimmy-hikmatullah-48bb54152/'
              }}/>
            <GitHubIcon
              fontSize="small"
              className={classes.socialMediaIcon}
              onClick={() => {
                analytics('event', 'join_group', {
                  group_id: 'Github'
                });
                window.location.href = 'https://github.com/Fazatholomew'
              }}/>
            <div>
              <p>Copyright © 2021 Jimmy 'Bang Koboi'</p>
              <p>Buatan Bandung.</p>
            </div>
            <AlternateEmailIcon
              fontSize="small"
              className={classes.socialMediaIcon}
              onClick={() => {
                analytics('event', 'join_group', {
                  group_id: 'Email'
                });
                window.location.href = 'mailto:TheManHimself@jimmyganteng.com'
              }}/>
            <HttpIcon
              fontSize="small"
              className={classes.socialMediaIcon}
              onClick={() => {
                analytics('event', 'join_group', {
                  group_id: 'Website'
                });
                window.location.href = 'https://jimmyganteng.com'
              }} />
          </footer>
        </MuiThemeProvider>
      </div>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default App;
