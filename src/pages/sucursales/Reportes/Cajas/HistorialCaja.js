import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  Slide,
  Box,
  Button,
  Toolbar,
  Typography,
  FormControl,
  MenuItem,
  Select,
  Grid,
  TextField,
  DialogContent,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AppBar from "@material-ui/core/AppBar";
import { useQuery } from "@apollo/client";
import { OBTENER_HISTORIAL_CAJA } from "../../../../gql/Cajas/cajas";
import { useDebounce } from "use-debounce/lib";
import TablaHistorialFiltrado from "./TablaHistorialFiltrado";
import ExportarReportesCajas from "./ExportarReportesCajas";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    position: "relative",
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  icon: {
    fontSize: 40,
    width: 40,
  },
  iconSave: {
    zIndex: 10,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(10),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tipos = [
  "TODOS",
  "COMPRA",
  "VENTA",
  "DEPOSITO",
  "RETIRO",
  "CUENTA_RETIRO",
  "CUENTA_DEPOSITO",
  "ABONO_CLIENTE",
  "ABONO_PROVEEDOR",
  "TRANSFERENCIA",
];

export default function HistorialCaja(props) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [datosBuscar, setDatosBuscar] = useState([]);
  const [value] = useDebounce(datosBuscar, 500);
  const [page, setPage] = useState(0);

  let obtenerHistorialCaja = [];

  /* Queries */
  const { data, refetch, loading } = useQuery(OBTENER_HISTORIAL_CAJA, {
    variables: {
      id_Caja: props.cajaSelected._id,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: {
        tipo_movimiento: datosBuscar.tipo_movimiento
          ? datosBuscar.tipo_movimiento
          : "",
        fecha_incio: datosBuscar.fecha_incio ? datosBuscar.fecha_incio : "",
        fecha_fin: datosBuscar.fecha_fin ? datosBuscar.fecha_fin : "",
        usuario: value.usuario ? value.usuario : "",
      },
      limit: 20,
      offset: page,
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (data) {
    obtenerHistorialCaja = data.obtenerHistorialCaja;
  }

  const handleDatos = (e) => {
    setDatosBuscar({ ...datosBuscar, [e.target.name]: e.target.value });
  };

  /* const filtrarProductos = (event) => {
    event.preventDefault();
    refetch();
  }; */

  const limpiarFiltros = () => {
    setDatosBuscar([]);
  };

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={() => {
        props.handleClose();
      }}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Caja {props.cajaSelected.numero_caja}
          </Typography>
          <Box m={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.handleClose();
              }}
              size="large"
            >
              <CloseIcon style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item md={2} xs={12}>
            <Typography>Movimiento</Typography>
            <FormControl variant="outlined" fullWidth size="small">
              <Select
                id="form-producto-tipo"
                name="tipo_movimiento"
                onChange={handleDatos}
                value={
                  datosBuscar.tipo_movimiento ? datosBuscar.tipo_movimiento : ""
                }
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                {tipos.map((tipo, index) => {
                  return (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>Fecha inicio:</Typography>
            <TextField
              fullWidth
              size="small"
              name="fecha_incio"
              variant="outlined"
              type="date"
              value={datosBuscar.fecha_incio ? datosBuscar.fecha_incio : ""}
              onChange={handleDatos}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>Fecha fin:</Typography>
            <TextField
              fullWidth
              size="small"
              name="fecha_fin"
              variant="outlined"
              type="date"
              value={datosBuscar.fecha_fin ? datosBuscar.fecha_fin : ""}
              onChange={handleDatos}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>Usuario:</Typography>
            <TextField
              fullWidth
              size="small"
              name="usuario"
              variant="outlined"
              value={datosBuscar.usuario ? datosBuscar.usuario : ""}
              onChange={handleDatos}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
              height="100%"
            >
              <Button
                color="primary"
                size="large"
                variant="text"
                startIcon={<Close />}
                onClick={limpiarFiltros}
              >
                Limpiar
              </Button>
              <Box mx={1} />
              <ExportarReportesCajas
                datos={obtenerHistorialCaja.docs}
                props={props}
                refetch={refetch}
              />
            </Box>
          </Grid>
        </Grid>
        <Box my={1}>
          <TablaHistorialFiltrado
            loading={loading}
            historial={obtenerHistorialCaja}
            page={page}
            setPage={setPage}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
