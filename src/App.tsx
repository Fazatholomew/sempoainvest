import React, {useRef, useLayoutEffect, useState} from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Answers from './containers/Answers';
import {InvestasiModal, KreditModal} from './containers/Answers/modals';

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
  const [index, setIndex] = useState(0);
  const handleNext = () => {
    setIndex((index + 1) % 4);
  };
  const modals = [
    (<KreditModal initDisable={false} isShown={true} handleSubmit={handleNext} />),
    (<InvestasiModal initDisable={false} isShown={true} handleSubmit={handleNext} />),
    (<Answers />)
  ];
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <header className="App-header">
          <h1>Sempoa Investasi</h1>
          {modals[index]}
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
