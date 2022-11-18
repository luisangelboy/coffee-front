import React, { useState, useRef, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { FcOvertime } from "react-icons/fc";
import { SearchOutlined } from "@material-ui/icons";

import { useQuery } from "@apollo/client";

import ListaEnEspera from "./ListaEnEspera";
import ErrorPage from "../../../../components/ErrorPage";
import { OBTENER_COMPRAS_ESPERA } from "../../../../gql/Compras/compras";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ComprasEnEspera() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcOvertime className={classes.icon} />
          </Box>
          Compras en espera
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Compras en espera
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <ContentDialogCompras />
        </Container>
      </Dialog>
    </div>
  );
}

const ContentDialogCompras = () => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [filtro, setFiltro] = useState("");
  const searchfilter = useRef(null);
  const [page, setPage] = useState(0);
  const limit = 20;

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_COMPRAS_ESPERA, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtro,
      limit,
      offset: 0,
    },
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        <CircularProgress />
        <Typography variant="h5">Cargando</Typography>
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} altura={300} />;
  }

  let obtenerComprasEnEspera = [];
  if (data) obtenerComprasEnEspera = data.obtenerComprasEnEspera;

  const obtenerBusqueda = (e, value) => {
    e.preventDefault();
    refetch({ filtro: value });
    setFiltro(value);
  };

  return (
    <Fragment>
      <Box my={3} maxWidth={500}>
        <form onSubmit={(e) => obtenerBusqueda(e, e.target[0].value)}>
          <TextField
            inputRef={searchfilter}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Buscar una compra..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary" size="medium">
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
      <ListaEnEspera
        obtenerComprasEnEspera={obtenerComprasEnEspera}
        refetch={refetch}
        page={page}
        setPage={setPage}
        limit={limit}
        filtro={filtro}
      />
    </Fragment>
  );
};
