import React, {useRef, useLayoutEffect, useState} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import './App.css';
import Chart from './components/chart';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.text.secondary,
      height: '100%'
    },
    paperChart: {
      padding: theme.spacing(5),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.text.secondary,
      height: '60vh'
    },
    chart: {
      height: '100%',
      width: '100%'
    }
  }),
);


function App() {
  const targetRef = useRef();
  const initDimension: {width: number | undefined, height: number | undefined} = { width:1, height: 1 };
  const [dimensions, setDimensions]: [any | undefined, any] = useState(initDimension);
  const classes = useStyles();

  useLayoutEffect(() => {
    if (undefined !== targetRef.current) {
      const current = targetRef.current as any;
      setDimensions({
        width: current.offsetWidth,
        height: current.offsetHeight
      });
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header" >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paperChart}>
              <div className={classes.chart} ref={targetRef}>
                <Chart dimensions={dimensions}/>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}><h1>Kredit</h1></Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}><h1>Investasi</h1></Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}><h1>Keuntungan</h1></Paper>
          </Grid>
        </Grid>
        
      </header>
    </div>
  );
}

export default App;
