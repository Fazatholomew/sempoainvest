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
  handleSubmit?: () => void;
};

const KreditModal = ({isShown, handleClose=() => (null), handleSubmit, initDisable=true}: modalProps) => {
  const [disable, setDisable] = useState(initDisable);
  const handleDisable = () => {
    if (handleSubmit) {
      handleSubmit();
    }
    setDisable(!disable);
  }
  const classes = useStyles();
  const renderTextField = [
    {
      label: 'Harga Barang',
      startAdornment: 'Rp'
    },
    {
      label: 'DP',
      endAdornment: '%'
    },
    {
      label: 'Waktu Cicilan',
      endAdornment: 'Tahun'
    },
    {
      label: 'Waktu Cicilan',
      endAdornment: 'Bulan'
    },
  ].map((textData) => (
    <Grid item xs={12}>
      <TextField
        label={textData.label}
        id="filled-start-adornment"
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
                  control={<Switch disabled={disable} color="secondary" name="syariah" />}
                  label="Syariah?"
                />
              </Grid>
              <Grid item xs={12}>
                <Button color="secondary" onClick={handleDisable}>Edit</Button>
              </Grid>
            </Grid>
          </div>
        </Fade>
    </Modal>
  );
};

const InvestasiModal = ({isShown, handleClose, handleSubmit, initDisable=true}: modalProps) => {
  const classes = useStyles();
  const [disable, setDisable] = useState(initDisable);
  const handleDisable = () => {
    if (handleSubmit) {
      handleSubmit();
    }
    setDisable(!disable);
  }
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
                    id="saham-select"
                    label="Saham"
                    disabled={disable}
                    className={classes.textField}>
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
                  InputProps={{
                    endAdornment: (<InputAdornment className={classes.textField} position="end">Bulan</InputAdornment>),
                    className: classes.textField
                  }}
                  className={classes.textField}
                  variant="outlined"
                  type="numeric"
                  color="primary"
                />
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" onClick={handleDisable}>Edit</Button>
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