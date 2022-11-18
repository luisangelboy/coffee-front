import React, { useContext, useState } from "react";
import NavegacionVentas from "../Navegaciones/NavegacionVentas";
import NavegacionVentasLateral from "../Navegaciones/NavegacionVentasLateral";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
  VentasContext,
  VentasProvider,
} from "../../context/Ventas/ventasContext";
import VentaIndex from "../../pages/ventas/venta_index";
import useStyles from "../Navegaciones/styles";
import moment from "moment";
import { AccesosContext } from "../../context/Accesos/accesosCtx";
import { Cached, PowerSettingsNew, Settings } from "@material-ui/icons";
import TicketPrinterComponent from "../TicketPrinter/TicketPrinter";
import { CircularProgress } from "@material-ui/core";
import ComponentOnline from "../../components/Connection/ComponentOnline";

export default function LayoutVentas(props) {
  const sesion = localStorage.getItem("sesionCafi");

  if (!sesion) props.history.push("/");

  return (
    <Box height="100%">
      <VentasProvider>
        <LayoutWithProvider props={props} />
      </VentasProvider>
    </Box>
  );
}

const LayoutWithProvider = ({ props }) => {
  return (
    <Box>
      <Box height="5vh">
        <NavDataCajaUsers props={props} />
      </Box>
      <Grid container>
        <Grid item lg={9} md={8}>
          <Box height="10vh">
            <NavegacionVentas />
          </Box>
          <Box height="85vh">
            <VentaIndex />
          </Box>
        </Grid>
        <Grid item lg={3} md={4}>
          <NavegacionVentasLateral />
        </Grid>
      </Grid>
    </Box>
  );
};

const NavDataCajaUsers = ({ props }) => {
  const classes = useStyles();
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [reloadPage, setReloadPage] = useState(false)

  const {
    abrirTurnosDialog,
    setAbrirTurnosDialog,
    setUbicacionTurno,
  } = useContext(VentasContext);
  const {
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
    isOnline,
    ventasToCloud
  } = useContext(AccesosContext);
  moment.locale("es");

  const signOut = () => {
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
  };

  function Mi_función(e) {
    if (e.keyCode === 112) {
      Administrador();
    }
  }

  window.onkeydown = Mi_función;

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

  const reloadApp = () =>{
    setReloadPage(true);
    window.location.reload()
  }

  return (
    <Grid container alignItems="center">
      <Grid item md={6} style={{ display: "flex" }}>
        <Avatar
          alt="Remy Sharp"
          srsc="/static/images/avatar/1.jpg"
          className={classes.avatar}
        />
        <Typography color="textSecondary">{sesion?.nombre}</Typography>
        <Box mx={1} />
        {!turnoEnCurso?.numero_caja ? (
          ""
        ) : (
          <Typography color="textSecondary">
            <b>Caja: </b>
            {turnoEnCurso?.numero_caja}
          </Typography>
        )}
        <Box mx={1} />
        <Typography color="textSecondary">
          {moment().locale("es-mx").format("ll")}
        </Typography>
      </Grid>
      <Grid
        item
        md={6}
        style={
          !turnoEnCurso
            ? { display: "flex", justifyContent: "flex-end", zIndex: 99999 }
            : { display: "flex", justifyContent: "flex-end" }
        }
      >
        <ComponentOnline isOnline={isOnline} classes={classes} ventasToCloud={ventasToCloud} sesion={sesion} fromVentas={true} />
        <Box display="flex" alignItems={'center'}>
          <Button
            onClick={() => reloadApp()}
            className={classes.buttonIcon}
            style={
              !turnoEnCurso ? { color: "white", borderColor: "white" } : null
            }
          >
            {(reloadPage) ? <CircularProgress color="inherit" size={20} /> : <Cached />}
          </Button>
        </Box>
        <TicketPrinterComponent turnoEnCurso={turnoEnCurso} />
        <Box mx={1} />
        <Button
          onClick={() => Administrador()}
          startIcon={<Settings />}
          style={
            !turnoEnCurso ? { color: "white", borderColor: "white" } : null
          }
        >
          F1 Admin
        </Button>
        <Box mx={1} />
        <Button
          color="secondary"
          onClick={() => {
            signOut();
          }}
          startIcon={<PowerSettingsNew />}
          style={
            !turnoEnCurso ? { color: "white", borderColor: "white" } : null
          }
        >
          Salir
        </Button>
        <Box mr={2} />
      </Grid>
    </Grid>
  );
};
