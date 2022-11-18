import React, { useState, Fragment } from "react";
import useStyles from "../styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CrearNota from "./CrearNota";
import NotaIcon from "../../../icons/notacredito.png"

export default function NotaCredito() {
  const classes = useStyles();
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function funcion_tecla(event) {
    const tecla_escape = event.keyCode;
    if (tecla_escape === 27 && datosVenta) {
      handleClickOpen();
    }
  }
  window.onkeydown = funcion_tecla;

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={() => handleClickOpen()}
        disabled={!turnoEnCurso || !datosVenta}
      >
        <Box>
          <Box>
            <img
              src={NotaIcon}
              alt="icono ventas"
              style={{ width: 38 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Crear Nota</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>ESC</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <CrearNota open={open} handleClose={handleClose} />
    </Fragment>
  );
}
