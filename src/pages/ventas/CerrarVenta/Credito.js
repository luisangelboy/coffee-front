import React, { useEffect, Fragment } from "react";
import { Grid, TextField, Typography } from "@material-ui/core";
/* import { Edit } from "@material-ui/icons"; */
import moment from "moment";

export default function CreditoVenta({
  montos,
  setMontos,
  totales,
  setTotales,
  venta_credito,
  setMontoEnCaja,
  datosCliente,
  setDatosCliente,
  venta_base,
  /* editarCliente,
  setEditarCliente, */
  fechaVencimientoDate,
  setfechaVencimientoDate,
  setAbonoMinimo,
  abono_minimo,
}) {
  let venta_original = JSON.parse(localStorage.getItem("DatosVentas"));
  const total_venta = venta_original
    ? parseFloat(venta_original.total.toFixed(2))
    : 0;

  useEffect(() => {
    setfechaVencimientoDate(
      moment()
        .add(
          datosCliente.dias_credito ? parseInt(datosCliente.dias_credito) : 0,
          "days"
        )
        .format("YYYY-MM-DD")
    );
  }, [datosCliente, datosCliente.dias_credito]);

  useEffect(() => {
    if (venta_credito) {
      setMontos({
        efectivo: 0,
        tarjeta: 0,
        puntos: 0,
        transferencia: 0,
        cheque: 0,
      });
      setTotales({
        ...totales,

        cambio: 0,
        monto_pagado: total_venta,
      });
      setMontoEnCaja(0);
    } else {
      setMontos({
        ...montos,
        efectivo: total_venta,
      });
      setMontoEnCaja(total_venta);
    }
  }, [venta_credito]);

  return (
    <Fragment>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item md={4} xs={12}>
            <Typography variant="caption">
              <b>Dias de Crédito:</b>
            </Typography>

            <TextField
              fullWidth
              size="small"
              name="codigo_barras"
              id="form-producto-codigo-barras"
              variant="outlined"
              value={
                datosCliente.dias_credito === null
                  ? 0
                  : datosCliente.dias_credito
              }
              onChange={(e) =>
                setDatosCliente({
                  ...datosCliente,
                  dias_credito: e.target.value,
                })
              }
              /* disabled={!editarCliente} */
              disabled
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="caption">
              <b>Límite de Crédito:</b>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="codigo_barras"
              id="form-producto-codigo-barras"
              variant="outlined"
              value={
                datosCliente.limite_credito === null
                  ? 0
                  : datosCliente.limite_credito
              }
              /* disabled={!editarCliente} */
              disabled
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="caption">
              <b>Crédito Disponible:</b>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="codigo_barras"
              id="form-producto-codigo-barras"
              variant="outlined"
              value={
                datosCliente.credito_disponible === null
                  ? 0
                  : datosCliente.credito_disponible
              }
              disabled
            />
          </Grid>
          {/* <Grid item md={2} xs={12}>
            <Typography variant="caption">
              <b>Total a Crédito:</b>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="codigo_barras"
              id="form-producto-codigo-barras"
              variant="outlined"
              //disabled={!editarCliente} 
              disabled
              value={total_venta}
            />
          </Grid> */}
          <Grid item md={6} xs={12}>
            <Typography variant="caption">
              <b>Abono mínimo:</b>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="abono_minimo"
              id="form-abono_minim"
              variant="outlined"
              onChange={(e) => setAbonoMinimo(e.target.value)}
              value={abono_minimo}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="caption">
              <b>Fecha de Vencimiento:</b>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="codigo_barras"
              id="form-producto-codigo-barras"
              variant="outlined"
              type="date"
              value={fechaVencimientoDate}
              onChange={(e) => {
                const modelDate = moment(e.target.value).add(1, "days");
                const hoy = moment();
                const diasDiff = modelDate.diff(hoy, "days");
                setfechaVencimientoDate(e.target.value);
                setDatosCliente({
                  ...datosCliente,
                  dias_credito: diasDiff,
                });
              }}
              /* disabled={!editarCliente} */
              disabled
            />
          </Grid>
          {/* <Grid item md={2} xs={12}>
            <Box display="flex" alignItems="flex-end" height="100%">
              <Button
                color="primary"
                variant="outlined"
                size="large"
                onClick={() => setEditarCliente(true)}
              >
                <Edit />
              </Button>
            </Box>
          </Grid> */}
        </Grid>
      </Grid>
    </Fragment>
  );
}
