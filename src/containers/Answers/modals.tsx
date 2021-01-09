import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {dataProps} from '../../utils/@types.calculations';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    modal: {
      backgroundColor: '#34425A',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: '0 !important',
      color: 'white',
      width: '17rem',
      height: `${17 * 1.8}rem`,
    },
    backgroundModal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '0 !important',
    },
    textField: {
      color: 'white',
    }
  }),
);

interface modalProps {
  isShown: boolean;
  handleClose?: () => void;
  initDisable?: boolean;
  handleSubmit?: (data: dataProps) => void;
  initData?: dataProps;
};

const KreditModal = ({isShown, handleClose=() => (null), handleSubmit, initDisable=true, initData}: modalProps) => {
  const [disable, setDisable] = useState(initDisable);
  const [data, setData] = useState(initData);
  const handleDisable = () => {
    setDisable(!disable);
  };
  const submit = (submitData: dataProps) => {
    handleSubmit(submitData);
      if (handleClose) {
        handleClose();
      }
  };
  const handleChange = (newData: any, dataKey: string) => {
    const newDataBuffer: dataProps = {...data};
    newDataBuffer[dataKey] = newData;
    setData(newDataBuffer);
  };
  const classes = useStyles();
  const renderTextField = [
    {
      label: 'Harga Barang',
      startAdornment: 'Rp',
      dataKey: 'kredit'
    },
    {
      label: 'DP',
      endAdornment: '%',
      dataKey: 'dp'
    },
    {
      label: 'Bunga',
      endAdornment: '%',
      dataKey: 'bunga'
    },
    {
      label: 'Waktu Cicilan',
      endAdornment: 'Tahun',
      dataKey: 'tahun'
    },
    {
      label: 'Waktu Cicilan',
      endAdornment: 'Bulan',
      dataKey: 'bulan'
    },
  ].map((textData) => (
    <Grid item xs={12}>
      <TextField
        label={textData.label}
        id="filled-start-adornment"
        value={data[textData.dataKey] || ''}
        fullWidth
        disabled={disable}
        InputProps={{
          startAdornment: textData.startAdornment ? <InputAdornment className={classes.textField} position="start">{textData.startAdornment}</InputAdornment> : null,
          endAdornment: textData.endAdornment ? <InputAdornment className={classes.textField} position="end">{textData.endAdornment}</InputAdornment> : null,
          className: classes.textField
        }}
        className={classes.textField}
        variant="outlined"
        type="numeric"
        color="secondary"
        key={textData.label}
        onChange={(event) => handleChange(event.target.value, textData.dataKey)}
      />
    </Grid>
  ));
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.backgroundModal}
      open={isShown}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableAutoFocus={true}>
        <Fade in={isShown}>
          <div className={classes.modal}>
            <h2>Kredit</h2>
            <Grid  container spacing={3}>
              {renderTextField}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(data.syariah)}
                      disabled={disable}
                      color="secondary"
                      name="syariah"
                      onChange={(event) => handleChange(event.target.checked, 'syariah')}
                    />}
                  label="Syariah?"
                />
              </Grid>
              <Grid item xs={12}>
                <Button color="secondary" onClick={disable ? handleDisable : () => submit(data)}>{disable ? 'Edit' : 'Enter'}</Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
    </Modal>
  );
};

const InvestasiModal = ({isShown, handleClose, handleSubmit, initDisable=true, initData}: modalProps) => {
  const classes = useStyles();
  const [disable, setDisable] = useState(initDisable);
  const [data, setData] = useState(initData);
  const handleDisable = () => {
    setDisable(!disable);
  };
  const submit = (submitData: dataProps) => {
    handleSubmit(submitData);
      if (handleClose) {
        handleClose();
      }
  };
  const handleChange = (newData: any, dataKey: string) => {
    const newDataBuffer: dataProps = {...data};
    newDataBuffer[dataKey] = newData;
    setData(newDataBuffer);
  };
  const renderMenuitem = ['AATM', 'AAPL', 'TSLA'].map((saham) => <MenuItem key={saham} value={saham}>{saham}</MenuItem>);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.backgroundModal}
      open={isShown}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableAutoFocus={true}>
        <Fade in={isShown}>
          <div className={classes.modal}>
            <h2>Investasi</h2>
            <Grid  container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="saham">Saham</InputLabel>
                  <Select
                    labelId="saham"
                    value={data.saham || ''}
                    id="saham-select"
                    label="Saham"
                    disabled={disable}
                    className={classes.textField}
                    onChange={(event) => handleChange(event.target.value, 'saham')}>
                      {renderMenuitem}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Frekuensi Penarikan'
                  id="filled-start-adornment"
                  fullWidth
                  disabled={disable}
                  onChange={(event) => handleChange(event.target.value, 'frekuensi')}
                  InputProps={{
                    endAdornment: (<InputAdornment className={classes.textField} position="end">Bulan</InputAdornment>),
                    className: classes.textField
                  }}
                  className={classes.textField}
                  variant="outlined"
                  type="numeric"
                  color="primary"
                  value={data.frekuensi || 1}
                />
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" onClick={disable ? handleDisable : () => submit(data)}>{disable ? 'Edit' : 'Enter'}</Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
    </Modal>
  );
};

export {
  KreditModal,
  InvestasiModal
};