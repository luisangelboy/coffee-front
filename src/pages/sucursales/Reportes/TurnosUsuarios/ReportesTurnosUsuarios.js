import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import TablaTurnosFiltrados from "./TablaTurnosFiltrados";
import { useQuery } from "@apollo/client";
import { OBTENER_CAJAS } from "../../../../gql/Cajas/cajas";
import { OBTENER_HISTORIAL_TURNOS } from "../../../../gql/Ventas/abrir_cerrar_turno";
import { useDebounce } from "use-debounce";
import ErrorPage from "../../../../components/ErrorPage";
import ExportarReportesTurnos from "./ExportarTurnosExcel";
import { Close } from "@material-ui/icons";
import TurnosIcon from "../../../../icons/ventas/shift.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function ReportesTurnosUsuarios() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(!open);
  };
  const classes = useStyles();

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClickOpen}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={TurnosIcon}
              alt="icono caja"
              style={{ width: 100 }}
            />
          </Box>
          Turnos de usuarios
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
              Reportes turnos de usuarios
            </Typography>
            <Box m={1} display="flex">
              <Box p={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpen}
                  size="large"
                >
                  <CloseIcon style={{ fontSize: 30 }} />
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <FiltroTablaTurnos />
        </DialogContent>
      </Dialog>
    </>
  );
}

const FiltroTablaTurnos = () => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [filtros, setFiltros] = useState([]);
  const [value] = useDebounce(filtros, 500);
  const [page, setPage] = useState(0);
  let historialTurnos = [];

  const cajas = useQuery(OBTENER_CAJAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });

  const { loading, data, error, refetch } = useQuery(OBTENER_HISTORIAL_TURNOS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: {
        horario_en_turno: filtros.horario_turno ? filtros.horario_turno : "",
        usuario_en_turno: value.usuario_en_turno ? value.usuario_en_turno : "",
        numero_caja: filtros.numero_caja ? filtros.numero_caja : "",
        fechaInicio: filtros.fechaInicio ? filtros.fechaInicio : "",
        fechaFin: filtros.fechaFin ? filtros.fechaFin : "",
      },
      limit: 20,
      offset: page,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const obtenerDatos = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value.toString() });
  };

  if (data && cajas.loading === false) {
    historialTurnos = data.obtenerFiltroTurnos;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  /*  const filtrarProductos = (event) => {
    event.preventDefault();
    refetch();
  }; */

  const limpiarFiltros = () => {
    setFiltros([]);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={2} xs={12}>
          <Typography>Fecha inicio:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fechaInicio"
            variant="outlined"
            type="date"
            onChange={obtenerDatos}
            value={filtros.fechaInicio ? filtros.fechaInicio : ""}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Fecha fin:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fechaFin"
            variant="outlined"
            type="date"
            onChange={obtenerDatos}
            value={filtros.fechaFin ? filtros.fechaFin : ""}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Usuario:</Typography>
          <TextField
            fullWidth
            size="small"
            name="usuario_en_turno"
            value={filtros.usuario_en_turno ? filtros.usuario_en_turno : ""}
            variant="outlined"
            onChange={obtenerDatos}
          />
        </Grid>
        <Grid item md={1} xs={12}>
          <Typography>Caja:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              id="form-producto-tipo"
              name="numero_caja"
              onChange={obtenerDatos}
              value={filtros.numero_caja ? filtros.numero_caja : ""}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {cajas.data?.obtenerCajasSucursal?.map((caja, index) => {
                return (
                  <MenuItem key={index} value={caja.numero_caja}>
                    Caja {caja.numero_caja}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={1} xs={12}>
          <Typography>Turno:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              id="form-producto-tipo"
              name="horario_turno"
              value={filtros.horario_turno ? filtros.horario_turno : ""}
              onChange={obtenerDatos}
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              <MenuItem value="VESPERTINO">Vespertino</MenuItem>
              <MenuItem value="MATUTINO">Matutino</MenuItem>
            </Select>
          </FormControl>
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
              onClick={limpiarFiltros}
              startIcon={<Close />}
            >
              Limpiar
            </Button>
            <Box mx={1} />
            <ExportarReportesTurnos
              datosExcel={historialTurnos.docs}
              refetch={refetch}
            />
          </Box>
        </Grid>
      </Grid>
      <Box my={1}>
        <TablaTurnosFiltrados
          loading={loading}
          turnos={historialTurnos}
          page={page}
          setPage={setPage}
        />
      </Box>
    </Box>
  );
};
