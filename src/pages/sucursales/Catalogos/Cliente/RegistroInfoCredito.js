import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider, Grid, InputAdornment } from "@material-ui/core";
import { TextField, Typography } from "@material-ui/core";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import { Alert } from "@material-ui/lab";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { DateRange } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "500",
  },
}));

export default function RegistrarInfoCredito({ tipo, cliente_base }) {
  const classes = useStyles();
  const { cliente, setCliente } = useContext(ClienteCtx);

  const credito_disponible = cliente_base ? cliente_base.credito_disponible : 0;
  const limite_credito = cliente_base ? cliente_base.limite_credito : 0;
  const credito_usado = limite_credito - credito_disponible;

  const obtenerCampos = (e) => {
    const name = e.target.name;
    if (name === "numero_descuento") {
      setCliente({
        ...cliente,
        [e.target.name]: parseInt(e.target.value),
      });
      return;
    }
    if (name === "limite_credito") {
      let disponible = parseInt(e.target.value) - credito_usado;

      setCliente({
        ...cliente,
        [e.target.name]: parseInt(e.target.value),
        credito_disponible: disponible,
      });
      return;
    }
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Fragment>
      {tipo === "CLIENTE" ? (
        <Box my={3}>
          <Alert severity="info">
            Si deseas hacer facturas a este cliente el <b>RFC</b> y la{" "}
            <b>Razon social</b> son obligatorios.
          </Alert>
        </Box>
      ) : null}

      <Grid container spacing={2}>
        <Grid item>
          <Typography>
            <b>Crédito utilizado:</b> ${" "}
            {credito_usado ? formatoMexico(credito_usado) : 0.0}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <b>Crédito disponible:</b> ${" "}
            {cliente.credito_disponible
              ? formatoMexico(cliente.credito_disponible)
              : 0.0}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Typography className={classes.title}>RFC</Typography>
          <TextField
            fullWidth
            size="small"
            name="rfc"
            variant="outlined"
            value={cliente.rfc ? cliente.rfc : ""}
            onChange={obtenerCampos}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Typography className={classes.title}>Razon social</Typography>
          <TextField
            fullWidth
            size="small"
            name="razon_social"
            variant="outlined"
            value={cliente.razon_social ? cliente.razon_social : ""}
            onChange={obtenerCampos}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        {/* <Grid item md={4} xs={12}>
          <Typography className={classes.title}>Descuento</Typography>
          <TextField
            fullWidth
            size="small"
            name="numero_descuento"
            variant="outlined"
            value={cliente.numero_descuento ? cliente.numero_descuento : ""}
            onChange={obtenerCampos}
          />
        </Grid> */}
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>Limite de crédito</Typography>
          <TextField
            fullWidth
            size="small"
            name="limite_credito"
            variant="outlined"
            value={cliente.limite_credito ? cliente.limite_credito : ""}
            onChange={obtenerCampos}
            error={credito_usado > cliente.limite_credito}
            InputProps={{
              startAdornment: <InputAdornment>$</InputAdornment>
            }}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <Typography className={classes.title}>Días de crédito</Typography>
          <TextField
            fullWidth
            size="small"
            name="dias_credito"
            variant="outlined"
            placeholder="30"
            value={cliente.dias_credito ? cliente.dias_credito : ""}
            onChange={obtenerCampos}
            inputProps={{ style: { textTransform: "uppercase" } }}
            InputProps={{
              startAdornment: <InputAdornment><DateRange color="action" /></InputAdornment>
            }}
          />
        </Grid>
      </Grid>
      {tipo !== "CLIENTE" ? (
        <Fragment>
          <Box my={3}>
            <Typography className={classes.title}>Datos bancarios</Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Typography className={classes.title}>Banco</Typography>
              <TextField
                fullWidth
                size="small"
                name="banco"
                variant="outlined"
                value={cliente.banco ? cliente.banco : ""}
                onChange={obtenerCampos}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography className={classes.title}>
                No. de Cuenta Bancaria
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="numero_cuenta"
                variant="outlined"
                value={cliente.numero_cuenta ? cliente.numero_cuenta : ""}
                onChange={obtenerCampos}
              />
            </Grid>
          </Grid>
        </Fragment>
      ) : null}
    </Fragment>
  );
}
