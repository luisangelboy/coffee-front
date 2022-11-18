import React, { useContext, useEffect, useState } from "react";
import useStyles from "../styles";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Typography,
  Slide,
  Badge,
} from "@material-ui/core";
import ListaVentas from "./ListaVentas";
import CloseIcon from "@material-ui/icons/Close";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import EnEsperaIcon from "../../../icons/ventas/lista-de-espera.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentasEspera() {
  let listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));
  let turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));

  const { updateTablaVentas } = useContext(VentasContext);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 76) {
      handleClickOpen();
    }
  }

  useEffect(() => {
    if (listaEnEspera) {
      listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));
    }
  }, [updateTablaVentas]);

  useEffect(() => {
    turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  }, [updateTablaVentas, turnoEnCurso]);

  return (
    <>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso || (datosVentas && datosVentas.nota_credito)}
      >
        <Box>
          <Box>
            <Badge
              badgeContent={listaEnEspera ? listaEnEspera.length : 0}
              color="primary"
              style={{ fontSize: 45 }}
            >
              <img
                src={EnEsperaIcon}
                alt="icono caja2"
                style={{ width: 38 }}
              />
            </Badge>
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Ventas en Espera</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + L</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Grid container item lg={12}>
            <Box display="flex" flexGrow={1}>
              <Box>
                <img
                  src={EnEsperaIcon}
                  alt="icono caja"
                  className={classes.iconSizeDialogs}
                />
              </Box>
              <Box m={2}>
                <Divider orientation="vertical" />
              </Box>
              <Box mt={3}>
                <Typography variant="h6">Ventas en espera</Typography>
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Grid>
          <Grid>
            <ListaVentas handleModalEspera={handleClickOpen} />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
