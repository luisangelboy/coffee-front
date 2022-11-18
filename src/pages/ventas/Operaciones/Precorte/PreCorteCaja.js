import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import useStyles from "../../styles";
import "moment/locale/es";
import { useQuery } from "@apollo/client";
import { OBTENER_PRE_CORTE_CAJA } from "../../../../gql/Cajas/cajas";
import { AccesosContext } from "../../../../context/Accesos/accesosCtx";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { imprimirTicketPrecorte } from "./PrintTicketPrecorte";
import Receipt from "@material-ui/icons/Receipt";
import CorteIcon from "../../../../icons/ventas/cash-register.svg"
moment.locale("es");

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreCorteCaja() {
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const {
    reloadVerPreCorte,
    setReloadVerPreCorte,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const input = {
    horario_en_turno: "ABRIR TURNO",
    id_caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
    id_usuario: sesion._id,
    token_turno_user: turnoEnCurso ? turnoEnCurso.token_turno_user : "",
  };

  const { loading, error, data, refetch } = useQuery(OBTENER_PRE_CORTE_CAJA, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: input,
    },
  });

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const handleClickOpen = () => {
    if (sesion.accesos.ventas.pre_corte.ver === true) {
      setOpen(!open);
    } else {
      setAbrirPanelAcceso(!abrirPanelAcceso);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "pre_corte",
        tipo_acceso: "ver",
      });
    }
  };

  useEffect(() => {
    if (reloadVerPreCorte === true) {
      setOpen(!open);
      setReloadVerPreCorte(false);
    }
  }, [reloadVerPreCorte]);

  if (!data || error || loading) {
    return <ComponenteSinConexion />;
  }

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 79) {
      handleClickOpen();
      refetch();
    }
  }

  const printTicket = async () => {
    setLoadingTicket(true);
    const datos = {
      turno: turnoEnCurso,
      sesion,
      monto: data?.obtenerPreCorteCaja?.monto_efectivo_precorte
        ? data?.obtenerPreCorteCaja?.monto_efectivo_precorte
        : 0.0,
    };
    await imprimirTicketPrecorte(datos);
    setLoadingTicket(true);
    setOpen(!open);
  };

  return (
    <>
      <Button
        onClick={() => {
          handleClickOpen();
          refetch();
        }}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={CorteIcon}
              alt="icono caja"
              style={{ width: 20 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Pre corte caja</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + O</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Dialog
        maxWidth="lg"
        open={open}
        onClose={() => setOpen(!open)}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Grid container>
            <Grid item lg={10}>
              <Box display="flex" alignItems="center">
                <Box>
                  <img
                    src={CorteIcon}
                    alt="icono caja"
                    className={classes.iconSizeDialogs}
                  />
                </Box>
                <Box ml={2}>
                  <Box textAlign="left">
                    <Typography variant="h6">Pre-Corte de Caja</Typography>
                  </Box>
                  <Box display="flex">
                    <Box textAlign="right">
                      <Typography variant="caption">
                        {moment().locale("es-mx").format("MM/DD/YYYY")}
                      </Typography>
                    </Box>
                    <Box textAlign="right" ml={2}>
                      <Typography variant="caption">
                        <b>{moment().locale("es-mx").format("h:mm")} hrs.</b>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={2}>
              <Box
                ml={4}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpen(!open)}
                  size="large"
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid>
            <Box p={2}>
              {sesion.turno_en_caja_activo === true && turnoEnCurso ? (
                <>
                  <Box>
                    <Typography variant="subtitle1">
                      <b>Usuario: </b> {sesion.nombre}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      <b>Caja: </b>{" "}
                      {turnoEnCurso ? turnoEnCurso.numero_caja : ""}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">
                      <b>Fecha y hora al precorte: </b>
                    </Typography>
                    <Typography variant="subtitle1">
                      {moment()
                        .locale("es-mx")
                        .format("MMMM D YYYY, h:mm:ss a")}
                    </Typography>
                  </Box>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h6">
                      <b>Monto total en efectivo: </b>
                    </Typography>
                    <Typography variant="h3" style={{ color: "green" }}>
                      <b>
                        $
                        {data?.obtenerPreCorteCaja?.monto_efectivo_precorte
                          ? formatoMexico(
                              data?.obtenerPreCorteCaja?.monto_efectivo_precorte
                            )
                          : 0.0}
                      </b>
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box textAlign="center" p={2}>
                  <Typography variant="h6">
                    <b>Por el momento no hay un turno en sesión</b>
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </DialogContent>

        <DialogActions>
          {sesion.turno_en_caja_activo === true && turnoEnCurso ? (
            <Button
              onClick={() => printTicket()}
              color="primary"
              variant="contained"
              size="large"
              autoFocus
              disabled={loadingTicket}
              startIcon={
                loadingTicket ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Receipt />
                )
              }
            >
              Imprimir
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
}

const ComponenteSinConexion = () => {
  return (
    <Button
      style={{ textTransform: "none", height: "100%", width: "100%" }}
      disabled={true}
    >
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            src={CorteIcon}
            alt="icono caja"
            style={{ width: 20 }}
          />
        </Box>
        <Box>
          <Typography variant="body2">
            <b>Pre corte caja</b>
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" style={{ color: "#808080" }}>
            <b>Alt + O</b>
          </Typography>
        </Box>
      </Box>
    </Button>
  );
};
