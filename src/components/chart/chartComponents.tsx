import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { printNumber } from '../../utils/calculations';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
      marginBottom: theme.spacing(3),
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
  }),
);

interface TooltipProps {
  active: boolean;
  payload: {
    value: string | number | number[] | any,
    color: string,
    dataKey: string,
  }[];
  label: string;
  zeros: number
}



const DataToolTip = ({active, payload, label, zeros}: TooltipProps) => {
  const classes = useStyles();
  const renderPayloads = payload.map((value) => {
    if (value.dataKey === 'Margin of Error') {
      const minValue: string = printNumber(Math.min(...value.value), zeros);
      const maxValue: string = printNumber(Math.max(...value.value), zeros);
      return (
        <p key={value.dataKey} style={{color: value.color}}>{`${value.dataKey}: ${minValue} ~ ${maxValue}`}</p>
      )
    }
    return (<p key={value.dataKey} style={{color: value.color}}>{`${value.dataKey}: ${printNumber(value.value, zeros)}`}</p>)
  })

  if (active) {
    return (
      <Paper className={classes.paper}>
        <h4>{`Pembayaran ke-${label}`}</h4>
        {renderPayloads}
      </Paper>
    );
  } else {
    return null;
  }
};

export {DataToolTip};