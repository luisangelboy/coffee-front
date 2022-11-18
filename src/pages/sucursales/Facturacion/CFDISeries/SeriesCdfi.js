import React, { forwardRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import RegistroSeries from "./RegistroSeries";
import ListaSeriesCDFI from "./ListaSeries";
import { useQuery } from "@apollo/client";
import { OBTENER_SERIES } from "../../../../gql/Facturacion/Facturacion";
import ErrorPage from "../../../../components/ErrorPage";
import Factura1Icon from "../../../../icons/Facturacion/factura-1.png"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SeriesCDFI() {
  const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <img
              src={Factura1Icon}
              alt="icono Factura"
              style={{ width: 100 }}
            />
          </Box>
          Series CFDI
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Series para CFDI
            </Typography>
            <Box m={1}>
              <Button color="secondary" variant="contained" onClick={handleClickOpen} size="large">
                <CloseIcon />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <ContentSeriesCFDI />
      </Dialog>
    </div>
  );
}

const ContentSeriesCFDI = () => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { loading, data, error, refetch } = useQuery(OBTENER_SERIES, {
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

  const { obtenerSeriesCdfi } = data;

  return (
    <Container maxWidth="md">
      <Box my={2}>
        {sesion.accesos.facturacion.registro_series_cdfi.agregar === false ? (null) : (
          <RegistroSeries refetch={refetch} />
        )}
      </Box>
      <ListaSeriesCDFI
        obtenerSeriesCdfi={obtenerSeriesCdfi}
        refetch={refetch}
      />
    </Container>
  );
};
