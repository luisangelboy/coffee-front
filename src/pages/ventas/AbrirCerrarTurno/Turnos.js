import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  makeStyles,
  Slide,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CerrarTurno from "./CerrarTurno";
import moment from "moment";
import "moment/locale/es";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import TurnosIcon from "../../../icons/ventas/shift.svg"

moment.locale("es");

const useStyles = makeStyles((theme) => ({
  iconSvg: {
    width: 50,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Turnos() {
  const {
    abrirTurnosDialog,
    setAbrirTurnosDialog,
    /* setTurnoActivo, */
  } = useContext(VentasContext);
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setAbrirTurnosDialog(!abrirTurnosDialog);
    /* setTurnoActivo(true); */
  };

  window.addEventListener("keydown", Mi_función);

  function Mi_función(e) {
    if (e.altKey && e.keyCode === 85) {
      handleClickOpen();
    }
  }

  return (
    <>
      <Button
        onClick={() => handleClickOpen()}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso}
      >
        <Box
          display="flex"
          flexDirection="column"
          style={{ height: "100%", width: "100%" }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={TurnosIcon}
              alt="icono caja"
              style={{ width: 20 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Cerrar turno</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + U</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={abrirTurnosDialog}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClickOpen();
          }
        }}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex">
              <img
                src={TurnosIcon}
                alt="icono almacen"
                className={classes.iconSvg}
              />
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box>
                <Box>
                  <Typography variant="h6">Cerrar turno</Typography>
                </Box>
                <Box display="flex" textAlign="right">
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
                  <Box textAlign="right" ml={2}>
                    <Typography variant="caption">
                      <b>Caja: </b>
                      {turnoEnCurso?.numero_caja}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
              size="large"
              disabled={loading}
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <CerrarTurno
          setLoading={setLoading}
          loading={loading}
          handleClickOpen={handleClickOpen}
        />
        {/* <ContenidoTurnos handleClickOpen={handleClickOpen} value={value} /> */}
      </Dialog>
    </>
  );
}

/* 
const ContenidoTurnos = ({ handleClickOpen, value }) => {
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [loading, setLoading] = useState(false);

  if (loading) return <BackdropComponent loading={loading} />;

  return (
    <DialogContent style={{ padding: 0 }}>
      {sesion?.turno_en_caja_activo === true && turnoEnCurso ? (
        <TabPanel style={{ padding: 0 }} value={value} index={0}>
          <CerrarTurno
            setLoading={setLoading}
            handleClickOpen={handleClickOpen}
          />
        </TabPanel>
      ) : (
        <TabPanel value={value} index={0}>
          <AbrirTurno
            loading={loading}
            setLoading={setLoading}
            handleClickOpen={handleClickOpen}
          />
        </TabPanel>
      )}
    </DialogContent>
  );
}; */
