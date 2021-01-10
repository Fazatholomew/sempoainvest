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
import {filterNotNumber, loadTickers, printNumber} from '../../utils/calculations';
import {dataProps} from '../../utils/@types.calculations';

import {
  FacebookShareButton,
  LineShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  LinkedinIcon,
  FacebookIcon,
  LineIcon,
  TwitterIcon
} from "react-share";

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
    },
    socials: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70%'
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
  const handleChange = (newData: any, dataKey: string, isFocus=false) => {
    const newDataBuffer: dataProps = {...data};
    let convertedData = newData;
    if (isFocus) {
      const clean = filterNotNumber(newData);
      if (clean !== null) {
        convertedData = printNumber(clean, 0, false);
      }else{
        convertedData = newData
      }
    }
    newDataBuffer[dataKey] = convertedData;
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
    <Grid item xs={12} key={textData.dataKey}>
      <TextField
        label={textData.label}
        id="filled-start-adornment"
        value={data[textData.dataKey]}
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
        onChange={(event) => handleChange(event.target.value, textData.dataKey)}
        onBlur={(event) => handleChange(event.target.value, textData.dataKey, true)}
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
  const handleChange = (newData: any, dataKey: string, isFocus=false) => {
    const newDataBuffer: dataProps = {...data};
    let convertedData = newData;
    if (isFocus) {
      const clean = filterNotNumber(newData);
      if (clean !== null) {
        convertedData = printNumber(clean, 0, false);
      }else{
        convertedData = newData
      }
    }
    newDataBuffer[dataKey] = convertedData;
    setData(newDataBuffer);
  };
  const renderMenuitem = loadTickers().map((saham: string) => <MenuItem key={saham} value={saham}>{saham}</MenuItem>);
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
                    value={data.saham}
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
                  onBlur={(event) => handleChange(event.target.value, 'frekuensi', true)}
                  InputProps={{
                    endAdornment: (<InputAdornment className={classes.textField} position="end">Bulan</InputAdornment>),
                    className: classes.textField
                  }}
                  className={classes.textField}
                  variant="outlined"
                  type="numeric"
                  color="primary"
                  value={data.frekuensi}
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

const SocialMediaButtons = ({isShown, handleClose, initData}: modalProps) => {
  const classes = useStyles();
  const lines = `Kemungkinan saya ${initData.investData[initData.investData.length - 1] > 0 ? 'untung' : 'rugi'}: ${
    printNumber(initData.investData[initData.investData.length - 1], 0)
  }\nDengan investasi di ${initData.saham}\nSempoa Investasi by Jimmy\n`
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
            <h2>Bagiin dong ke temen-temen!</h2>
            <div className={classes.socials}>
              <FacebookShareButton
                url={window.location.href}
                quote={lines}
                className="Demo__some-network__share-button">
                <FacebookIcon size={64} round />
              </FacebookShareButton>
              <LineShareButton
                url={window.location.href}
                title={lines}
                className="Demo__some-network__share-button">
                <LineIcon size={64} round />
              </LineShareButton>
              <TwitterShareButton
                url={window.location.href}
                title={lines}
                className="Demo__some-network__share-button">
                <TwitterIcon size={64} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={window.location.href}
                title={lines}
                className="Demo__some-network__share-button">
                <LinkedinIcon size={64} round />
              </LinkedinShareButton>
              <Button color="primary" variant="outlined" onClick={handleClose}>Thanks!</Button>
            </div>
          </div>
        </Fade>
    </Modal>
  );
};

export {
  KreditModal,
  InvestasiModal,
  SocialMediaButtons
};