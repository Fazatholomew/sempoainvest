import React, {useRef, useLayoutEffect, useState} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Chart from '../../components/chart';
import {InvestasiModal, KreditModal} from './modals';
import {printNumber} from '../../utils/calculations';
import {dataProps} from '../../utils/@types.calculations';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'space-between',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      marginBottom: theme.spacing(3),
      color: theme.palette.text.primary,
      backgroundColor: 'transparent',
      alignItems: 'center'
    },
    paperChart: {
      padding: theme.spacing(3),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
      height: window.innerHeight > window.innerWidth ? '30vh' : '60vh',
      marginBottom: theme.spacing(2),
      justifyContent: 'center',
      alignItems: 'center',
    },
    chart: {
      height: '100%',
      width: '100%'
    },
    title: {
      fontSize: '1.3vw',
      color: 'white',
      marginBottom: '0.7vw'
    },
    value: {
      fontSize: `${1.3 * 1.68}vw`,
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '0.5vw'
    },
    modal: {
      backgroundColor: '#34425A',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: '0 !important',
      color: 'white'
    },
    backgroundModal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '0 !important',
    }
  }),
);

interface Props {
  data: dataProps,
  handleSubmit: () => void
};

const Answers = ({data, handleSubmit}:Props): JSX.Element => {
  const targetRef = useRef();
  const paperRef = useRef();
  const [open, setOpen] = useState(null);
  const initDimension: {width: number | undefined, height: number | undefined} = { width:1, height: 1 };
  const [dimensions, setDimensions]: [any | undefined, any] = useState(initDimension);
  const [paperDimensions, setPaperDimensions]: [any | undefined, any] = useState(initDimension);
  const classes = useStyles();

  const handeOpen = (modal: any) => {
    setOpen(modal);
  };

  const handleClose = () => {
    setOpen(null);
  };

  useLayoutEffect(() => {
    if (undefined !== targetRef.current) {
      const current = targetRef.current as any;
      setDimensions({
        width: current.offsetWidth,
        height: current.offsetHeight
      });
    }
    if (undefined !== paperRef.current) {
      const current = paperRef.current as any;
      setPaperDimensions({
        width: current.offsetWidth,
        height: current.offsetHeight
      });
    }
  }, []);
  const renderbigInfos = [
    {
      title: 'Cicilan Per Bulan',
      value: 'Rp. 500.23 Juta',
      button: (<Button color="secondary" onClick={() => handeOpen(<KreditModal initData={data} isShown={true} handleClose={handleClose} handleSubmit={handleSubmit} />)}>Edit</Button>)
    },
    {
      title: 'Instrumen Saham',
      value: 'ANTM',
      button: (<Button color="primary" onClick={() => handeOpen(<InvestasiModal initData={data} isShown={true} handleClose={handleClose} handleSubmit={handleSubmit} />)}>Edit</Button>)
    },
    {
      title: 'Keuntungan',
      value: 'Rp. 2.23 Juta'
    },
  ].map((val) => (
    <Grid item xs={4} key={val.title}>
      <Paper 
        className={classes.paper}
        ref={paperRef}
        style={{height: paperDimensions.widht * 0.618}}>
          <div className={classes.title}>{val.title}</div>
          <div className={classes.value}>{val.value}</div>
          {val.button}
      </Paper>
    </Grid>
  ))
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paperChart}>
            <div className={classes.chart} ref={targetRef}>
              <Chart dimensions={dimensions}/>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Grid className={classes.root} container spacing={3}>
        {renderbigInfos}
      </Grid>
      {open}
    </>
  );
}

export default Answers;