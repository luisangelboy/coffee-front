import React, { useState } from "react";
import { Box, Button, Typography } from "@material-ui/core";
import useStyles from "../styles";
import SnackBarMessages from "../../../components/SnackBarMessages";
import { abrirCajonQuery } from "../../../components/TicketPrinter/AbrirCajon";
import CajonIcon from "../../../icons/ventas/cajon.svg"

export default function AbrirCajon() {
  const classes = useStyles();
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const impresora = localStorage.getItem("cafiTicketPrint");

  const abrirCajon = async () => {
    const result = await abrirCajonQuery(impresora);
    if (result.success === true) {
      setAlert({
        message: `Cajon abierto`,
        status: "success",
        open: true,
      });
    } else {
      setAlert({
        message: `Error al abrir cajon: ${result.message}`,
        status: "error",
        open: true,
      });
    }
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.keyCode === 119) {
      abrirCajon();
    }
  }

  return (
    <>
      <Button className={classes.borderBotonChico} onClick={abrirCajon}>
        <Box>
          <Box>
            <img
              src={CajonIcon}
              alt="icono ventas"
              style={{ width: 38 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Cajon</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>F8</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
    </>
  );
}
