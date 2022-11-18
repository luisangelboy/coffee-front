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
import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import TablaComprasFiltradas from "./TablaCortesFiltradas";
import ExportExcel from "./ExportExcel";

import { useQuery } from "@apollo/client";
import {
  OBTENER_CAJAS,
  OBTENER_CORTES_CAJA,
} from "../../../../gql/Cajas/cajas";
import { useDebounce } from "use-debounce/lib";
import TicketPrinterComponent from "../../../../components/TicketPrinter/TicketPrinter";
import Close from "@material-ui/icons/Close";
import CashRegisterIcon from "../../../../icons/ventas/cash-register.svg"
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

export default function ReportesCortes() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [datosFiltro, setDatosFiltro] = useState([]);
  const [value] = useDebounce(datosFiltro, 500);
  const limit = 20;
  let cajas = [];
  let historialCortes = [];

  const cajasBase = useQuery(OBTENER_CAJAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });

  const { loading, data, error, refetch } = useQuery(OBTENER_CORTES_CAJA, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: {
        fecha_consulta: datosFiltro.fecha_consulta
          ? datosFiltro.fecha_consulta
          : "",
        usuario: value.usuario ? value.usuario : "",
        numero_caja: datosFiltro.numero_caja
          ? parseInt(datosFiltro.numero_caja)
          : null,
      },
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
  });

  if (cajasBase.loading === false && loading === false) {
    cajas = cajasBase.data.obtenerCajasSucursal;
    historialCortes = data.obtenerCortesDeCaja;
  }

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const obtenerDatos = (e) => {
    setDatosFiltro({ ...datosFiltro, [e.target.name]: e.target.value });
  };

  /* const filtrarProductos = (event) => {
    event.preventDefault();
    refetch();
  }; */

  const limpiarDatos = () => {
    setDatosFiltro([]);
  };

  return (
    <>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={CashRegisterIcon}
              alt="icono caja"
              style={{ width: 100 }}
            />
          </Box>
          Reportes cortes de caja
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
              Reportes cortes de caja
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item md={7} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <Typography>Fecha de corte:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="fecha_consulta"
                    variant="outlined"
                    type="date"
                    onChange={obtenerDatos}
                    value={
                      datosFiltro.fecha_consulta
                        ? datosFiltro.fecha_consulta
                        : ""
                    }
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography>Usuario:</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="usuario"
                    variant="outlined"
                    onChange={obtenerDatos}
                    value={datosFiltro.usuario ? datosFiltro.usuario : ""}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography>Caja:</Typography>
                  <FormControl variant="outlined" fullWidth size="small">
                    <Select
                      id="form-producto-tipo"
                      name="numero_caja"
                      onChange={obtenerDatos}
                      value={
                        datosFiltro.numero_caja ? datosFiltro.numero_caja : ""
                      }
                    >
                      <MenuItem value="">
                        <em>Selecciona uno</em>
                      </MenuItem>
                      {cajas?.map((caja) => {
                        return (
                          <MenuItem
                            key={caja.numero_caja}
                            value={caja.numero_caja}
                          >
                            Caja {caja.numero_caja}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box height="100%" display="flex" alignItems="flex-end">
                <Button
                  color="primary"
                  variant="text"
                  onClick={limpiarDatos}
                  startIcon={<Close />}
                >
                  Limpiar Filtro
                </Button>
                <Box mx={1} />
                <ExportExcel historialCortes={historialCortes} refetch={refetch} />
                <Box mx={1} />
                <TicketPrinterComponent turnoEnCurso={true} icon="config" />
              </Box>
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
              <TablaComprasFiltradas
                cortes={historialCortes}
                loading={loading}
                page={page}
                setPage={setPage}
                limit={limit}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
