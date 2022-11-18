import React, { useState, useEffect, Fragment } from "react";
import useStyles from "../styles";
import { Box, TextField, Typography } from "@material-ui/core";
import { FcShop } from "react-icons/fc";
import MoneyIcon from "../../../icons/ventas/money.svg"
import TarjetaIcon from "../../../icons/ventas/tarjeta-de-credito.svg"
import TransfeIcon from "../../../icons/transferencia-bancaria.svg"
import ChequeIcon from "../../../icons/ventas/cheque.png"

export default function ObtenerMontos({
  montos,
  setMontos,
  totales,
  setTotales,
  venta_credito,
  montoEnCaja,
  setMontoEnCaja,
  datosCliente,
}) {
  const classes = useStyles();
  const [efectivoConstante, setEfectivoConstante] = useState(totales.total);

  let venta_original = JSON.parse(localStorage.getItem("DatosVentas"));
  const total_venta = venta_original
    ? parseFloat(venta_original.total.toFixed(2))
    : 0;

  const handlerChangeValue = (e, location) => {
    const { value } = e.target;
    switch (location) {
      case "EFECTIVO":
        setMontos({ ...montos, efectivo: value });
        setEfectivoConstante(value);
        break;
      case "TARJETA":
        setMontos({ ...montos, tarjeta: value });
        break;

      case "PUNTOS":
        const valor = value !== "" ? parseInt(value) : 0;
        if (valor <= datosCliente.monedero_electronico) {
          setMontos({
            ...montos,
            puntos: value,
            efectivo: efectivoConstante - valor,
          });
          setTotales({ ...totales, total: total_venta - valor });
        }
        break;
      case "TRANSFERENCIA":
        setMontos({ ...montos, transferencia: value });
        break;
      case "CHEQUE":
        setMontos({ ...montos, cheque: value });
        break;
      default:
        return alert("Error de pago");
    }
  };

  useEffect(() => {
    if (venta_credito) return;
    let monto_caja = 0;
    let monto_pagado =
      parseFloat(montos.efectivo) +
      parseFloat(montos.tarjeta) +
      parseFloat(montos.puntos) +
      parseFloat(montos.transferencia) +
      parseFloat(montos.cheque);
    let cambio_caja = parseFloat(monto_pagado) - total_venta;

    monto_caja = parseFloat(montos.efectivo - cambio_caja);

    setMontoEnCaja(monto_caja);
    setTotales({
      ...totales,
      monto_pagado,
      cambio: (monto_pagado - totales.total) - montos.puntos,
    });
  }, [montos]);

  const clearFieldOnFocus = (e) => {
    const { name, value } = e.target;
    const val = parseFloat(value);
    switch (name) {
      case "EFECTIVO":
        if (val === 0) {
          setMontos({ ...montos, efectivo: 0 });
          setEfectivoConstante(0);
        }
        break;
      case "TARJETA":
        if (val === 0) {
          setMontos({ ...montos, tarjeta: 0 });
        }
        break;
      case "PUNTOS":
        if (val === 0) {
          setMontos({ ...montos, puntos: 0 });
        }
        break;
      case "TRANSFERENCIA":
        if (val === 0) {
          setMontos({ ...montos, transferencia: 0 });
        }
        break;
      case "CHEQUE":
        if (val === 0) {
          setMontos({ ...montos, cheque: 0 });
        }
        break;
      default:
        break;
    }
  };

  const validateCantidadesCorrectas = (e) => {
    const { name, value } = e.target;
    const monto = parseFloat(montoEnCaja);
    switch (name) {
      case "EFECTIVO":
        if (value === "") {
          setMontos({ ...montos, efectivo: 0 });
          setEfectivoConstante(0);
        }
        break;
      case "TARJETA":
        if (value === "") {
          setMontos({ ...montos, tarjeta: 0 });
        } else if (monto < 0) {
          setMontos({ ...montos, tarjeta: 0 });
        }
        break;
      case "PUNTOS":
        if (value === "") {
          setMontos({ ...montos, puntos: 0 });
        } else if (
          monto < 0 &&
          parseFloat(montos.puntos) !== parseFloat(total_venta)
        ) {
          setMontos({ ...montos, puntos: 0 });
        }
        break;
      case "TRANSFERENCIA":
        if (value === "") {
          setMontos({ ...montos, transferencia: 0 });
        } else if (monto < 0) {
          setMontos({ ...montos, transferencia: 0 });
        }
        break;
      case "CHEQUE":
        if (value === "") {
          setMontos({ ...montos, cheque: 0 });
        } else if (monto < 0) {
          setMontos({ ...montos, cheque: 0 });
        }
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <div className={classes.formInputFlex}>
        <Box width="25%" textAlign="center">
          <Box>
            <img
              src={MoneyIcon}
              alt="icono ventas"
              className={classes.iconSizeDialogsPequeno}
            />
          </Box>
          <Typography variant="caption">Efectivo</Typography>
          <Box display="flex">
            <TextField
              fullWidth
              size="small"
              name="EFECTIVO"
              id="form-producto-efectivo"
              variant="outlined"
              value={montos.efectivo}
              onChange={(e) => handlerChangeValue(e, "EFECTIVO")}
              onBlur={validateCantidadesCorrectas}
              onFocus={clearFieldOnFocus}
              autoFocus
              disabled={venta_credito}
            />
          </Box>
        </Box>
        <Box width="25%" textAlign="center">
          <Box>
            <img
              src={TarjetaIcon}
              alt="icono ventas"
              className={classes.iconSizeDialogsPequeno}
            />
          </Box>
          <Typography variant="caption">Tarjeta</Typography>
          <Box display="flex">
            <TextField
              fullWidth
              size="small"
              name="TARJETA"
              variant="outlined"
              value={montos.tarjeta}
              onChange={(e) => handlerChangeValue(e, "TARJETA")}
              onBlur={validateCantidadesCorrectas}
              onFocus={clearFieldOnFocus}
              disabled={venta_credito}
            />
          </Box>
        </Box>
        <Box width="25%" textAlign="center">
          <Box>
            <FcShop style={{ fontSize: 50, cursor: "pointer" }} />
          </Box>
          <Typography variant="caption">Puntos</Typography>
          <Box display="flex">
            <TextField
              fullWidth
              size="small"
              name="PUNTOS"
              variant="outlined"
              value={montos.puntos}
              onChange={(e) => handlerChangeValue(e, "PUNTOS")}
              onBlur={validateCantidadesCorrectas}
              onFocus={clearFieldOnFocus}
              disabled={venta_credito}
            />
          </Box>
        </Box>
        <Box width="25%" textAlign="center">
          <Box p={0}>
            <img
              src={TransfeIcon}
              alt="icono ventas"
              className={classes.iconSizeDialogsPequeno}
            />
          </Box>
          <Typography variant="caption">Transferencia</Typography>
          <Box display="flex">
            <TextField
              fullWidth
              size="small"
              name="TRANSFERENCIA"
              variant="outlined"
              value={montos.transferencia}
              onChange={(e) => handlerChangeValue(e, "TRANSFERENCIA")}
              onBlur={validateCantidadesCorrectas}
              onFocus={clearFieldOnFocus}
              disabled={venta_credito}
            />
          </Box>
        </Box>
        <Box width="25%" textAlign="center">
          <Box p={0}>
            <img
              src={ChequeIcon}
              alt="icono ventas"
              className={classes.iconSizeDialogsPequeno}
            />
          </Box>
          <Typography variant="caption">Cheque</Typography>
          <Box display="flex">
            <TextField
              fullWidth
              size="small"
              name="CHEQUE"
              variant="outlined"
              value={montos.cheque}
              onChange={(e) => handlerChangeValue(e, "CHEQUE")}
              onBlur={validateCantidadesCorrectas}
              onFocus={clearFieldOnFocus}
              disabled={venta_credito}
            />
          </Box>
        </Box>
      </div>
    </Fragment>
  );
}
