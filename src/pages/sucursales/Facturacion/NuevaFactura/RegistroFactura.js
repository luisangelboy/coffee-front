import React, { useContext, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import ListaVentasFactura from "./ListaVentas/ListaVentasFactura.js";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx.js";
import CodigosPostales from "./Catalogos/CodigoPostal.js";
import { tipoCambio, tiposCfdi } from "../catalogos";
import ListaClientesFacturas from "./ClientesSelect.js";

export default function RegistroFactura({ serie_default }) {
  const { datosFactura, setDatosFactura, error_validation, venta_factura } = useContext(
    FacturacionCtx
  );

  useEffect(() => {
    const { folio, serie } = serie_default[0];
    setDatosFactura({ ...datosFactura, folio: folio.toString(), serie });
  }, []);

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setDatosFactura({
      ...datosFactura,
      [name]: value,
    });
  };

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item md={6} xs={12}>
          <Box mb={1}>
            <Typography>
              <b>{`Emisor: ${datosFactura.issuer.Name}`}</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <Typography>RFC</Typography>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                value={datosFactura.issuer.Rfc}
                disabled
                error={error_validation.status && !datosFactura.issuer.Rfc}
                helperText={
                  error_validation.status && !datosFactura.issuer.Rfc
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography>Regimen fiscal</Typography>
              <FormControl fullWidth size="small" variant="outlined">
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={datosFactura.issuer.FiscalRegime}
                  disabled
                  error={
                    error_validation.status && !datosFactura.issuer.FiscalRegime
                  }
                  helperText={
                    error_validation.status && !datosFactura.issuer.FiscalRegime
                      ? error_validation.message
                      : ""
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box mb={1}>
            <Typography>
              <b>Receptor</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <Typography>Cliente</Typography>
              <TextField
                value={datosFactura.receiver.Name}
                placeholder="Selecciona un cliente"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ListaClientesFacturas />
                    </InputAdornment>
                  ),
                  readOnly: true,
                  disabled: true,
                }}
                error={error_validation.status && !datosFactura.receiver.Name}
                helperText={
                  error_validation.status && !datosFactura.receiver.Name
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography>RFC</Typography>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                value={datosFactura.receiver.Rfc}
                disabled
                error={error_validation.status && !datosFactura.receiver.Rfc}
                helperText={
                  error_validation.status && !datosFactura.receiver.Rfc
                    ? error_validation.message
                    : ""
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={1} mb={2}>
        <Typography>
          <b>Datos factura</b>
        </Typography>
        <Divider />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            placeholder="Selecciona venta a facturar"
            fullWidth
            size="small"
            label="Folio Venta"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <ListaVentasFactura />
                </InputAdornment>
              ),
              readOnly: true,
              disabled: true,
            }}
            value={venta_factura ? venta_factura.folio : ''}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={1}>
          <TextField
            value={datosFactura.folio}
            label="Folio"
            fullWidth
            size="small"
            variant="outlined"
            disabled
            error={error_validation.status && !datosFactura.folio}
            helperText={
              error_validation.status && !datosFactura.folio
                ? error_validation.message
                : ""
            }
          />
        </Grid>
        <Grid item xs={12} sm={4} md={1}>
          <TextField
            value={datosFactura.serie}
            label="Serie"
            fullWidth
            size="small"
            variant="outlined"
            disabled
            error={error_validation.status && !datosFactura.serie}
            helperText={
              error_validation.status && !datosFactura.serie
                ? error_validation.message
                : ""
            }
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="cfdi_type"
            error={error_validation.status && !datosFactura.cfdi_type}
          >
            <InputLabel id="cfdi_type">Tipo de CFDI</InputLabel>
            <Select
              labelId="cfdi_type"
              value={datosFactura.cfdi_type}
              name="cfdi_type"
              onChange={obtenerDatos}
              label="tipo de CFDI"
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {tiposCfdi.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {error_validation.status && !datosFactura.cfdi_type
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            name="currency"
            error={error_validation.status && !datosFactura.currency}
          >
            <InputLabel id="moneda">Moneda</InputLabel>
            <Select
              labelId="moneda"
              value={datosFactura.currency}
              name="currency"
              onChange={obtenerDatos}
              label="moneda"
            >
              <MenuItem value="">
                <em>Selecciona uno</em>
              </MenuItem>
              {tipoCambio.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {error_validation.status && !datosFactura.currency
                ? error_validation.message
                : ""}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <CodigosPostales />
        </Grid>
      </Grid>
    </div>
  );
}
