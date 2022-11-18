import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
}));

export default function BackdropComponent({loading, setLoading}) {
  const classes = useStyles();

  /* const handleClose = () => {
    setLoading(false);
  }; */

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading} /* onClick={handleClose} */>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
