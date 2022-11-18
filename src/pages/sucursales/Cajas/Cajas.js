import React, { useState, useEffect, Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Box,
  Button,
  Toolbar,
  Slide,
} from "@material-ui/core";
import CardCaja from "./CardCaja";
import HistorialCaja from "./HistorialCaja";
import SnackBarMessages from "../../../components/SnackBarMessages";
import BackdropComponent from "../../../components/Layouts/BackDrop";
import { useQuery, useMutation } from "@apollo/client";
import AddIcon from "@material-ui/icons/Add";
import { OBTENER_CAJAS, CREAR_CAJA } from "../../../gql/Cajas/cajas";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },

  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  cantidadTitle: {
    justifyContent: "flex-end",
  },

  input: {
    width: "100%",
  },
  dialog: { width: "100%" },
  subtitle: {
    marginLeft: "10px",
    width: "100%",
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    "& span": {
      color: "red",
    },
  },
  icon: {
    fontSize: 40,
    width: 40,
  },
  container: {
    position: "absolute",
    backgroundColor: "red",
  },
}));

export default function Cajas() {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [cajaSelected, setCajaSelected] = React.useState({ name: "" });

  //const [ error, setError ] = useState({error: false, message: ''});
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let obtenerCajasSucursal = [];

  /* Queries */
  const { data, error, refetch } = useQuery(OBTENER_CAJAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });
  /* Mutation */
  const [crearCaja] = useMutation(CREAR_CAJA);

  useEffect(() => {
    setLoading(true);
    refetch();
    setLoading(false);
  }, [refetch]);

  if (data) {
    obtenerCajasSucursal = data.obtenerCajasSucursal;
  }

  const nuevaCaja = async () => {
    try {
      setLoading(true);
      await crearCaja({
        variables: {
          input: { usuario_creador: sesion._id },
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Container>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <BackdropComponent loading={loading} setLoading={setLoading} />

        <Box>
          <Toolbar>
            <Box mx={3}>
              <Button
                autoFocus
                color="primary"
                size="large"
                variant="contained"
                onClick={nuevaCaja}
              >
                <AddIcon />
                Agregar Caja
              </Button>
            </Box>
          </Toolbar>
        </Box>
        <Grid container spacing={1} justifyContent="center">
          {obtenerCajasSucursal?.map((caja, index) => {
            return (
              <Button
                onClick={() => {
                  handleClickOpen();
                  setCajaSelected(caja);
                }}
              >
                <CardCaja
                  name={caja.numero_caja}
                  activa={caja.activa}
                  cantidad_efectivo_actual={caja.cantidad_efectivo_actual}
                />
              </Button>
            );
          })}
        </Grid>
      </Container>
      <HistorialCaja
        open={open}
        fetchCajas={refetch}
        handleClickOpen={handleClickOpen}
        cajaSelected={cajaSelected}
        handleClose={handleClose}
        obtenerCajasSucursal={obtenerCajasSucursal}
      />
    </Fragment>
  );
}
