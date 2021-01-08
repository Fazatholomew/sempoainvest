import React, {useRef, useLayoutEffect, useState} from 'react';
import './App.css';
import Answers from './containers/Answers';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sempoa Investasi</h1>
        <Answers/>
      </header>
      <footer>
        <p>Copyright © 2020 Jimmy 'Bang Koboi'</p>
        <p>Buatan Bandung.</p>
      </footer>
    </div>
  );
}

export default App;
