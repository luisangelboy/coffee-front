import React, { forwardRef, Fragment, useContext, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";

import RegistroFactura from "./RegistroFactura";
import DetallesFactura from "./TablaVenta/TablaDetallesFactura";
import {
  FacturacionCtx,
  FacturacionProvider,
} from "../../../../context/Facturacion/facturacionCtx";

import { useQuery } from "@apollo/client";
import { OBTENER_SERIES } from "../../../../gql/Facturacion/Facturacion";
import ErrorPage from "../../../../components/ErrorPage";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import RealizarFactura from "./RealizarFactura";
import CancelarFactura from "./CancelarFactura";
import FacturaIcon from "../../../../icons/Facturacion/factura-2.png"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NuevaFactura() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth onClick={() => handleClickOpen()}>
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <img
              src={FacturaIcon}
              alt="icono Factura"
              style={{ width: 100 }}
            />
          </Box>
          Nuevo CFDI
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={() => handleClose()}
        disableEscapeKeyDown
        TransitionComponent={Transition}
      >
        <FacturacionProvider>
          <DialogFacturaPrincipal handleClose={handleClose} />
        </FacturacionProvider>
      </Dialog>
    </div>
  );
}

const DialogFacturaPrincipal = ({ handleClose }) => {
  const classes = useStyles();
  const { venta_factura } = useContext(FacturacionCtx);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const handleClickOpen = () => {
    setOpenCancel(true);
  };

  const cancelarCFDI = () => {
    if (venta_factura !== null) {
      handleClickOpen();
    } else {
      handleClose();
    }
  };

  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Nuevo CFDI
          </Typography>
          <Box m={1}>
            <Button
              variant="contained"
              onClick={() => cancelarCFDI()}
              color="secondary"
              size="large"
            >
              <CloseIcon style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <FacturaModalContent />
      </DialogContent>
      <DialogActions>
        <RealizarFactura setAlert={setAlert} />
      </DialogActions>
      <CancelarFactura
        open={openCancel}
        setOpen={setOpenCancel}
        handleCloseFactura={handleClose}
      />
    </Fragment>
  );
};

const FacturaModalContent = () => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { loading, data, error } = useQuery(OBTENER_SERIES, {
    variables: {
      sucursal: sesion.sucursal._id,
      empresa: sesion.empresa._id,
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <ErrorPage error={error} />;
  }

  const { seriesCfdi } = data.obtenerSeriesCdfi;

  let serie_default = [];
  serie_default = seriesCfdi.filter((serie) => serie.default === true);
  if (!serie_default.length) {
    serie_default = [{ folio: "", serie: "" }];
  }

  return (
    <Fragment>
      {!seriesCfdi.length ? (
        <Alert severity="warning">No tienes Series CFDI registradas</Alert>
      ) : null}
      <Box my={2}>
        <RegistroFactura serie_default={serie_default} />
      </Box>
      <DetallesFactura />
    </Fragment>
  );
};
