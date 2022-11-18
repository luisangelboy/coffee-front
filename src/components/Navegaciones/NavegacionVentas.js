import React, { useState, useContext, useEffect } from "react";
import { Divider, BottomNavigation } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { withRouter } from "react-router";
import useStyles from "./styles";
import moment from "moment";
import "moment/locale/es";

import DepositoRetiroCaja from "../../pages/ventas/Operaciones/DepositoRetiros/DepositoRetiroCaja";
import Turnos from "../../pages/ventas/AbrirCerrarTurno/Turnos";
import PreCorteCaja from "../../pages/ventas/Operaciones/Precorte/PreCorteCaja";
import VentaEnEspera from "../../pages/ventas/Operaciones/VentaEnEspera";
import ProductoRapidoIndex from "../../pages/ventas/ArticuloRapido/indexArticuloRapido";

import SnackBarMessages from "../SnackBarMessages";
import { VentasContext } from "../../context/Ventas/ventasContext";
import Acceso from "../AccesosPassword/Acceso";
import { AccesosContext } from "../../context/Accesos/accesosCtx";
import ListaCotizaciones from "../../pages/ventas/Cotizacion/ListaCotizaciones";

function NavegacionVentas(props) {
  const {
    alert,
    setAlert
  } = useContext(VentasContext);

  const {
    reloadAdministrador,
    setReloadAdministrador,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const classes = useStyles();
  const [value, setValue] = useState("venta-general");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  /* const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso")); */

  moment.locale("es");

  /* const signOut = () => {
    if (sesion.turno_en_caja_activo === true && turnoEnCurso) {
      setAbrirTurnosDialog(!abrirTurnosDialog);
      setUbicacionTurno("SESION");
    } else {
      localStorage.removeItem("sesionCafi");
      localStorage.removeItem("tokenCafi");
      localStorage.removeItem("DatosVentas");
      localStorage.removeItem("VentaOriginal");
      localStorage.removeItem("turnoEnCurso");
      localStorage.removeItem("ListaEnEspera");
      props.history.push("/");
    }
  }; */

  function Mi_función(e) {
    if (e.keyCode === 112) {
      Administrador();
    }
  }

  function Administrador() {
    if (sesion.accesos.ventas.administrador.ver === true) {
      props.history.push("/admin");
    } else {
      setAbrirPanelAcceso(!abrirPanelAcceso);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "administrador",
        tipo_acceso: "ver",
      });
    }
  }

  useEffect(() => {
    if (reloadAdministrador === true) {
      props.history.push("/admin");
      setReloadAdministrador(false);
    }
  }, [reloadAdministrador]);

  window.addEventListener("keydown", Mi_función);

  return (
    <Box height="100%">
      <Acceso setReloadAdministrador={setReloadAdministrador} />
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        className={classes.navigationTop}
      >
        <ProductoRapidoIndex />
        <Divider orientation="vertical" />
        <ListaCotizaciones />
        <Divider orientation="vertical" />
        <DepositoRetiroCaja />
        <Divider orientation="vertical" />
        <Turnos />
        <Divider orientation="vertical" />
        <PreCorteCaja />
        <Divider orientation="vertical" />
        <VentaEnEspera />
      </BottomNavigation>
    </Box>
  );
}

export default withRouter(NavegacionVentas);
