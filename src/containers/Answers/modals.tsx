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
    },
    profit: {
      display: 'flex',
      flexDirection: 'column',
      height: '70%'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: '.05vh'
    },
    primary: {
      color: theme.palette.primary.main
    },
    secondary: {
      color: theme.palette.secondary.main
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
      const {analytics} = window as any
      analytics('event', 'select_content', {
        content_type: dataKey,
        item_id: `${newData}`
      });
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
                      checked={data.syariah}
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
      const {analytics} = window as any
      analytics('event', 'select_content', {
        content_type: dataKey,
        item_id: `${newData}`
      });
    }
    newDataBuffer[dataKey] = convertedData;
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
              {data.data ? <Grid item xs={12}>
                <div className={classes.profit}>
                  <div className={classes.row}>
                    <h5>Rata-Rata Kenaikan Per Bulan:</h5>
                    <h4 className={classes.primary}>{`${printNumber(data.data.Average, 0, false)}%`}</h4>
                  </div>
                  <div className={classes.row}>
                    <h5>Volatility:</h5>
                    <h4 className={classes.primary}>{`+- ${printNumber(data.data.Volatility, 0, false)}%`}</h4>
                  </div>
                </div>
              </Grid> : null}
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
  const {analytics} = window as any;
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
                className="Demo__some-network__share-button"
                onClick={() => {
                  analytics('event', 'share', {
                    method: 'Facebook',
                    content_type: 'URL',
                    content_id: window.location.search.substring(1),
                  });
                }}>
                <FacebookIcon size={64} round />
              </FacebookShareButton>
              <LineShareButton
                url={window.location.href}
                title={lines}
                className="Demo__some-network__share-button"
                onClick={() => {
                  analytics('event', 'share', {
                    method: 'Line',
                    content_type: 'URL',
                    content_id: window.location.search.substring(1),
                  });
                }}>
                <LineIcon size={64} round />
              </LineShareButton>
              <TwitterShareButton
                url={window.location.href}
                title={lines}
                className="Demo__some-network__share-button"
                onClick={() => {
                  analytics('event', 'share', {
                    method: 'Twitter',
                    content_type: 'URL',
                    content_id: window.location.search.substring(1),
                  });
                }}>
                <TwitterIcon size={64} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={window.location.href}
                title={lines}
                className="Demo__some-network__share-button"
                onClick={() => {
                  analytics('event', 'share', {
                    method: 'LinkedIn',
                    content_type: 'URL',
                    content_id: window.location.search.substring(1),
                  });
                }}>
                <LinkedinIcon size={64} round />
              </LinkedinShareButton>
              <Button color="primary" variant="outlined" onClick={handleClose}>Thanks!</Button>
            </div>
          </div>
        </Fade>
    </Modal>
  );
};

const Profit = ({isShown, handleClose, initData}: modalProps) => {
  const classes = useStyles();
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
            <h2>{`Estimasi ${initData.investData[initData.investData.length - 1] > 0 ? 'Keuntungan' : 'Kerugian'}`} </h2>
            <div className={classes.profit}>
              <div className={classes.row}>
                <h5>Total Pinjaman:</h5>
                <h4 className={classes.secondary}>{printNumber(initData.bulanan * initData.lama * 12)}</h4>
              </div>
              <div className={classes.row}>
                <h5>Sisa Investasi:</h5>
                <h4 className={classes[initData.investData[initData.investData.length - 1] > 0 ? 'primary' : 'secondary']}>{printNumber(initData.investData[initData.investData.length - 1])}</h4>
              </div>
              <div className={classes.row}>
                <h5>{`${initData.investData[initData.investData.length - 1] > 0 ? 'Keuntungan' : 'Kerugian'}:`}</h5>
                <h4 className={classes[initData.investData[initData.investData.length - 1] > 0 ? 'primary' : 'secondary']}>{`${printNumber((initData.investData[initData.investData.length - 1] / (initData.bulanan * (initData.lama * 12)) * 100), 0, false)}%`}</h4>
              </div>
              <Button color={initData.investData[initData.investData.length - 1] > 0 ? 'primary' : 'secondary'} variant="outlined" onClick={() => {window.location.href = 'https://kitangoding.jimmyganteng.com/sempoa_investasi'}}>👌🏽 Tutorial & Penjelasan 👌🏽</Button>
            </div>
          </div>
        </Fade>
    </Modal>
  );
};

export {
  KreditModal,
  InvestasiModal,
  SocialMediaButtons,
  Profit
};