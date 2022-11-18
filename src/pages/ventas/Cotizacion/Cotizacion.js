import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Slide,
  Typography,
} from "@material-ui/core";
import { FcCurrencyExchange } from "react-icons/fc";
import NuevaCotizacion from "./NuevaCotizacion";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import "moment/locale/es";
import useStyles from "../styles";
import { AccesosContext } from "../../../context/Accesos/accesosCtx";
import { VentasContext } from "../../../context/Ventas/ventasContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Cotizacion({ type }) {
  moment.locale("es");
  const classes = useStyles();

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
  const [tipoVentana, setTipoVentana] = useState(type);

  const {
    reloadCrearCotizacion,
    setReloadCrearCotizacion,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const { setAlert } = useContext(VentasContext);

  const [open, setOpen] = useState(false);

  const handleClickOpen = (tipo) => {
    if (!datosVentas) {
      setAlert({
        message: `Lo sentimos no hay productos que cotizar`,
        status: "error",
        open: true,
      });
      return null;
    } else {
      if (sesion?.accesos.ventas.cotizaciones.ver === true) {
        setOpen(!open);
      } else {
        console.log("pedir permiso");
        setAbrirPanelAcceso(!abrirPanelAcceso);
        setDepartamentos({
          departamento: "ventas",
          subDepartamento: "cotizaciones",
          tipo_acceso: "ver",
        });
      }
    }
  };

  useEffect(() => {
    if (reloadCrearCotizacion === true) {
      setReloadCrearCotizacion(false);
      setTipoVentana("GENERAR");
      setOpen(!open);
    }
  }, [reloadCrearCotizacion]);

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 84) {
      handleClickOpen("", false);
    }
  }

  return (
    <>
      <Button
        className={classes.borderBotonChico}
        onClick={() => handleClickOpen(tipoVentana)}
        disabled={!turnoEnCurso || !datosVentas || (datosVentas && datosVentas.nota_credito)}
      >
        <Box>
          <Box>
            <FcCurrencyExchange style={{ fontSize: 50 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Generar cotizacion</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        fullWidth
        open={open}
        maxWidth={tipoVentana === "GENERAR" ? "md" : "lg"}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Box display={"flex"}>
            <Box display="flex" flexGrow={1}>
              <Box p={2} display={"flex"} alignItems={"center"}>
                <FcCurrencyExchange style={{ fontSize: 38 }} />
              </Box>
              <Box p={1} display={"flex"} alignItems={"center"}>
                <Typography style={{ fontSize: 18 }}>
                  Nueva Cotización
                </Typography>
              </Box>
            </Box>
            <Box p={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(!open)}
                size="medium"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>
        </AppBar>
        <NuevaCotizacion setOpen={setOpen} />
      </Dialog>
    </>
  );
}
