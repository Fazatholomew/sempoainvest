import React, {useRef, useLayoutEffect, useState} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Chart from '../../components/chart';
import {printNumber} from '../../utils/calculations';

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
      backgroundColor: theme.palette.text.secondary,
    },
    paperChart: {
      padding: theme.spacing(3),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.text.secondary,
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
      marginBottom: '1.68vw'
    },
    value: {
      fontSize: `${1.3 * 1.68}vw`,
      color: 'white',
      fontWeight: 'bold',
      marginBottom: '1.6vw'
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

const Answers: React.FC = () => {
  const targetRef = useRef();
  const paperRef = useRef();
  const [open, setOpen] = useState(false);
  const initDimension: {width: number | undefined, height: number | undefined} = { width:1, height: 1 };
  const [dimensions, setDimensions]: [any | undefined, any] = useState(initDimension);
  const [paperDimensions, setPaperDimensions]: [any | undefined, any] = useState(initDimension);
  const classes = useStyles();

  const handeOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      value: 'Rp. 500.23 Juta'
    },
    {
      title: 'Instrumen Saham',
      value: 'ANTM'
    },
    {
      title: 'Keuntungan',
      value: 'Rp. 2.23 Juta'
    },
  ].map((val) => (
    <Grid item xs={4}>
      <Paper 
        className={classes.paper}
        ref={paperRef}
        style={{height: paperDimensions.widht * 0.618}}
        onClick={handeOpen}>
        <div className={classes.title}>{val.title}</div>
        <div className={classes.value}>{val.value}</div>
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.backgroundModal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableAutoFocus={true}
      >
        <Fade in={open}>
          <div className={classes.modal}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">react-transition-group animates me.</p>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default Answers;