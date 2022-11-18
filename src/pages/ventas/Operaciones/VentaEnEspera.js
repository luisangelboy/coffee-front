import React, { Fragment, useContext, useState } from "react";
import {
  Box,
  Button,
  Snackbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { FcExpired } from "react-icons/fc";
import moment from "moment";
import "moment/locale/es";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
moment.locale("es");

export default function VentaEnEspera() {
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const ventaLS = JSON.parse(localStorage.getItem("DatosVentas"));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const agregarVentaEnEspera = () => {
    let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
    let datos = localStorage.getItem("ListaEnEspera");

    if (datosVenta !== null) {
      if (datos === null) {
        localStorage.setItem(
          "ListaEnEspera",
          JSON.stringify([{ datosVenta, fecha: moment().locale("es-mx").format("MM/DD/YYYY") }])
        );
        cleanData();
        handleClickOpen();
      } else {
        let data = JSON.parse(datos);
        data.push({ datosVenta, fecha: moment().locale("es-mx").format("MM/DD/YYYY") });
        localStorage.setItem("ListaEnEspera", JSON.stringify(data));
        cleanData();
        handleClickOpen();
      }
    }
  };

  const cleanData = () => {
    localStorage.removeItem("DatosVentas");
    localStorage.removeItem("VentaOriginal");
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
    setDatosVentasActual({
      subTotal: 0,
      total: 0,
      impuestos: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0,
    });
  };

  window.addEventListener("keydown", Mi_función);

  function Mi_función(e) {
    if (e.altKey && e.keyCode === 69) {
      agregarVentaEnEspera();
    }
  }

  return (
    <Fragment>
      <Button
        onClick={() => agregarVentaEnEspera()}
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso || !ventaLS || (ventaLS && ventaLS.nota_credito)}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcExpired style={{ fontSize: 25 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>En espera</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + E</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClickOpen}
        message="Compra agregada en espera"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClickOpen}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Fragment>
  );
}
