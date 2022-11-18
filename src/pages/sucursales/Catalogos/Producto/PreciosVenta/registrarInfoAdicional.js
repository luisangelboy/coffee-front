import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Checkbox,
  TextField,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Grid,
} from "@material-ui/core";
import { Typography, Divider, FormControl, Select } from "@material-ui/core";
import PreciosDeCompra from "./UnidadesVenta";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { useDebounce } from "use-debounce/lib";
import PreciosDeVenta from "./Precios";
import { unitCodes, unitCodes_granel } from "../unidades";
import { calcular_ieps, calcular_iva } from "../calculos_precios";

const useStyles = makeStyles((theme) => ({
  required: {
    color: "red",
  },
  precioTitle: {
    width: theme.spacing(20),
    display: "flex",
    alignItems: "center",
  },
  titulos: {
    fontWeight: 500,
  },
}));

export default function RegistroInfoAdidional() {
  const classes = useStyles();
  const {
    precios,
    setPrecios,
    validacion,
    preciosP,
    update,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
  } = useContext(RegProductoContext);

  /* CHECKBOX IVA */
  const obtenerIva = async (e) => {
    if (e.target.name === "iva" && !e.target.value) {
      setPrecios({
        ...precios,
        iva: "",
      });
      return;
    }
    const name = e.target.name;
    const value = name === "iva_activo" ? e.target.checked : e.target.value;
    const result = await calcular_iva(name, value, precios);
    setPrecioConImpuesto(result.precio_de_compra.precio_con_impuesto);
    setPrecioSinImpuesto(result.precio_de_compra.precio_sin_impuesto);
    setPrecioConImpuestoVariable(result.precio_de_compra.precio_con_impuesto);
    setPrecioSinImpuestoVariable(result.precio_de_compra.precio_sin_impuesto);
    setPrecios(result);
  };

  /* CHECKBOX IEPS */
  const obtenerIeps = async (e) => {
    if (e.target.name === "ieps" && !e.target.value) {
      setPrecios({
        ...precios,
        ieps: "",
      });
      return;
    }
    const name = e.target.name;
    const value = name === "ieps_activo" ? e.target.checked : e.target.value;
    const result = await calcular_ieps(name, value, precios);
    setPrecioConImpuesto(result.precio_de_compra.precio_con_impuesto);
    setPrecioSinImpuesto(result.precio_de_compra.precio_sin_impuesto);
    setPrecioConImpuestoVariable(result.precio_de_compra.precio_con_impuesto);
    setPrecioSinImpuestoVariable(result.precio_de_compra.precio_sin_impuesto);
    setPrecios(result);
  };

  const [precioConImpuesto, setPrecioConImpuesto] = useState(
    precios.precio_de_compra.precio_con_impuesto
  );
  const [precioSinImpuesto, setPrecioSinImpuesto] = useState(
    precios.precio_de_compra.precio_sin_impuesto
  );

  const [precioConImpuestoVariable, setPrecioConImpuestoVariable] = useState(
    precios.precio_de_compra.precio_con_impuesto
  );
  const [precioSinImpuestoVariable, setPrecioSinImpuestoVariable] = useState(
    precios.precio_de_compra.precio_sin_impuesto
  );

  const [PCI] = useDebounce(precioConImpuestoVariable, 800);
  const [PSI] = useDebounce(precioSinImpuestoVariable, 800);

  /* ARMAR OBJETO DE PRECIOS DE COMPRA */
  const obtenerPrecioConImpuesto = (value) => {
    let precio_con_impuesto = 0;
    let total_impuesto = 0;
    let precio_sin_impuesto = 0;
    let iva = 0;
    let ieps = 0;
    let precio_unitario_sin_impuesto = 0;
    let precio_unitario_con_impuesto = 0;

    /* Precio con impuesto */
    precio_con_impuesto = parseFloat(value);
    /* setPrecioConImpuesto(precio_con_impuesto); */
    total_impuesto =
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva) +
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
    precio_sin_impuesto = precio_con_impuesto / parseFloat(total_impuesto + 1);
    iva =
      precio_sin_impuesto *
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
    ieps =
      precio_sin_impuesto *
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
    precio_unitario_con_impuesto =
      precio_con_impuesto / precios.unidad_de_compra.cantidad;
    precio_unitario_sin_impuesto =
      precio_sin_impuesto / precios.unidad_de_compra.cantidad;

    if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
    if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;
    if (isNaN(iva)) iva = 0;
    if (isNaN(ieps)) ieps = 0;
    /* if (isNaN(precio_con_impuesto)) precio_con_impuesto = 0;
		if (isNaN(precio_sin_impuesto)) precio_sin_impuesto = 0; */

    
    setPrecioSinImpuesto(parseFloat(precio_sin_impuesto.toFixed(2)));
    setPrecios({
      ...precios,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(2)),
        iva: parseFloat(iva.toFixed(2)),
        ieps: parseFloat(ieps.toFixed(2)),
        precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(2)),
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(2)
        ),
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(2)
        ),
      },
    });
  };

  /* ARMAR OBJETO DE PRECIOS DE COMPRA */
  const obtenerPrecioSinImpuesto = (value) => {
    let precio_con_impuesto = 0;
    let precio_sin_impuesto = 0;
    let iva = 0;
    let ieps = 0;
    let precio_unitario_sin_impuesto = 0;
    let precio_unitario_con_impuesto = 0;

    /* Precio sin impuesto */
    precio_sin_impuesto = parseFloat(value);
    /* setPrecioSinImpuesto(precio_sin_impuesto); */
    iva =
      parseFloat((precio_sin_impuesto *
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva)));
    ieps =
      parseFloat((precio_sin_impuesto *
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps)));
    precio_con_impuesto = precio_sin_impuesto + iva + ieps;
    precio_unitario_sin_impuesto =
      precio_sin_impuesto / precios.unidad_de_compra.cantidad;
    precio_unitario_con_impuesto =
      precio_con_impuesto / precios.unidad_de_compra.cantidad;
    if (!precios.iva_activo && !precios.ieps_activo) {
      precio_con_impuesto = precio_sin_impuesto /*  / precios.unidad_de_compra.cantidad */;
      precio_unitario_con_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
    }

    if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
    if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;
    if (isNaN(iva)) iva = 0;
    if (isNaN(ieps)) ieps = 0;
    /* if (isNaN(precio_con_impuesto)) precio_con_impuesto = 0;
		if (isNaN(precio_sin_impuesto)) precio_sin_impuesto = 0; */

    setPrecioConImpuesto(parseFloat(precio_con_impuesto.toFixed(2)));
    setPrecios({
      ...precios,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_sin_impuesto: parseFloat(precio_sin_impuesto.toFixed(2)),
        iva: parseFloat(iva.toFixed(2)),
        ieps: parseFloat(ieps.toFixed(2)),
        precio_con_impuesto: parseFloat(precio_con_impuesto.toFixed(2)),
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(2)
        ),
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(2)
        ),
      },
    });
  };

  /* ARMAR OBJETO DE UNIDAD DE COMPRA */
  const obtenerUnidadCompra = (e, child) => {
    if (e.target.name === "unidad") {
      const { codigo_unidad, unidad } = child.props.unidad;
      let precio =
        precios.unidad_de_compra.cantidad * unidadVentaXDefecto.precio;
      if (unidad === "Caja" || unidad === "Costal") {
        setUnidadVentaSecundaria({
          ...unidadVentaSecundaria,
          precio: parseFloat(precio.toFixed(2)),
          codigo_unidad,
          unidad,
          unidad_activa: true,
          unidad_principal: true,
        });
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          unidad: unidad === "Caja" ? "Pz" : "kg",
          codigo_unidad: unidad === "Caja" ? "H87" : "KGM",
          cantidad: 1,
          precio: unidadVentaXDefecto.precio,
          unidad_principal: false,
        });
        /* setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            unidad,
            codigo_unidad,
          },
          inventario: {
            ...precios.inventario,
            unidad_de_inventario: unidad,
            codigo_unidad,
          },
        }); */
      } else {
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          unidad: unidad === "Pz" ? "Pz" : unidad === "Lt" ? "Lt " : "kg",
          codigo_unidad:
            unidad === "Pz" ? "H87" : unidad === "Lt" ? "LTR" : "KGM",
          cantidad: 1,
          precio: unidadVentaXDefecto.precio,
          unidad_principal: true,
        });
        setUnidadVentaSecundaria({
          ...unidadVentaSecundaria,
          precio: parseFloat(precio.toFixed(2)),
          codigo_unidad:
            unidad === "Pz" ? "XBX" : unidad === "Lt" ? "LTR" : "KGM",
          unidad:
            unidad === "Pz" ? "Caja" : unidad === "Caja" ? "LTR" : "Costal",
          unidad_activa: false,
          unidad_principal: false,
        });
      }

      /* setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            unidad: e.target.value,
            cantidad: 1,
          },
          inventario: {
            ...precios.inventario,
            unidad_de_inventario: e.target.value,
          },
        }); */
      setPrecios({
        ...precios,
        unidad_de_compra: {
          ...precios.unidad_de_compra,
          unidad,
          codigo_unidad,
          cantidad: 1,
        },
        inventario: {
          ...precios.inventario,
          unidad_de_inventario: unidad,
          codigo_unidad,
        },
      });
    } else {
      if (!precios.iva_activo && !precios.ieps_activo) {
        setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            [e.target.name]: parseFloat(e.target.value),
            precio_unitario_sin_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_sin_impuesto / e.target.value
              ).toFixed(2)
            ),
            precio_unitario_con_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_sin_impuesto / e.target.value
              ).toFixed(2)
            ),
          },
        });
      } else {
        setPrecios({
          ...precios,
          unidad_de_compra: {
            ...precios.unidad_de_compra,
            [e.target.name]: parseFloat(e.target.value),
            precio_unitario_sin_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_sin_impuesto / e.target.value
              ).toFixed(2)
            ),
            precio_unitario_con_impuesto: parseFloat(
              (
                precios.precio_de_compra.precio_con_impuesto / e.target.value
              ).toFixed(2)
            ),
          },
        });
      }
      if (
        precios.unidad_de_compra.unidad === "Caja" ||
        precios.unidad_de_compra.unidad === "Costal"
      ) {
        setUnidadVentaSecundaria({
          ...unidadVentaSecundaria,
          cantidad: parseFloat(e.target.value),
        });
      }
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        cantidad: 1,
      });
    }
  };

  const [count, setCount] = useState(0)

  useEffect(() => {
    if(count === 0) return
    obtenerPrecioConImpuesto(PCI);
  }, [PCI]);

  useEffect(() => {
    if(count === 0) return
    obtenerPrecioSinImpuesto(PSI);
  }, [PSI]);

  return (
    <Box>
      <div /* className={classes.input} */>
        <Box mb={2}>
          <Typography>
            <b>Impuestos</b>
          </Typography>
          <Divider />
        </Box>

        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography noWrap className={classes.titulos}>
                IVA
              </Typography>
              <TextField
                fullWidth
                disabled={!precios.iva_activo}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Checkbox
                        checked={precios.iva_activo}
                        onChange={obtenerIva}
                        name="iva_activo"
                      />
                      <Typography>%</Typography>
                    </InputAdornment>
                  ),
                }}
                size="small"
                name="iva"
                id="form-producto-iva"
                variant="outlined"
                value={precios.iva}
                onChange={obtenerIva}
                onFocus={(e) => {
                  const { name, value } = e.target;
                  if (parseFloat(value) === 0) {
                    setPrecios({
                      ...precios,
                      [name]: "",
                    });
                  }
                }}
                onBlur={(e) => {
                  const { name, value } = e.target;
                  if (!value) {
                    setPrecios({
                      ...precios,
                      [name]: 16,
                    });
                  }
                }}
                error={precios.iva === ""}
              />
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography noWrap className={classes.titulos}>
                porcentaje IEPS
              </Typography>
              <TextField
                disabled={!precios.ieps_activo}
                fullWidth
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Checkbox
                        checked={precios.ieps_activo}
                        onChange={obtenerIeps}
                        name="ieps_activo"
                      />
                      <Typography>%</Typography>
                    </InputAdornment>
                  ),
                }}
                size="small"
                name="ieps"
                id="form-producto-ieps"
                variant="outlined"
                value={precios.ieps}
                onChange={obtenerIeps}
                onFocus={(e) => {
                  const { name, value } = e.target;
                  if (parseFloat(value) === 0) {
                    setPrecios({
                      ...precios,
                      [name]: "",
                    });
                  }
                }}
                onBlur={(e) => {
                  const { name, value } = e.target;
                  if (!value) {
                    setPrecios({
                      ...precios,
                      [name]: 0,
                    });
                  }
                }}
                error={precios.ieps === ""}
              />
            </Box>
          </Grid>
          {/* 
          <Grid item md={4} xs={12}>
            <Box display="flex" alignItems="flex-end" height="100%" ml={1}>
              <Alert severity="info">Selecciona los impuestos aplicables</Alert>
            </Box>
          </Grid> */}
        </Grid>
        <Box my={3}>
          <Typography>
            <b>Precios y unidad de compra</b>
          </Typography>
          <Divider />
        </Box>

        <Grid container spacing={2}>
          <Grid item sm={4} md={2} xs={12}>
            <Box>
              <Typography noWrap className={classes.titulos}>
                Unidad Compra
              </Typography>
              <Box display="flex">
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={validacion.error && !precios.unidad_de_compra.unidad}
                >
                  {precios.granel ? (
                    <Select
                      disabled={update}
                      id="form-producto-categoria"
                      name="unidad"
                      value={precios.unidad_de_compra.unidad}
                      onChange={obtenerUnidadCompra}
                    >
                      {unitCodes_granel.map((res, index) => (
                        <MenuItem key={index} unidad={res} value={res.unidad}>
                          {res.unidad}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      disabled={update}
                      id="form-producto-categoria"
                      name="unidad"
                      value={precios.unidad_de_compra.unidad}
                      onChange={obtenerUnidadCompra}
                    >
                      {unitCodes.map((res, index) => (
                        <MenuItem key={index} unidad={res} value={res.unidad}>
                          {res.unidad}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  <FormHelperText>{validacion.message}</FormHelperText>
                </FormControl>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4} md={2} xs={12}>
            <Box>
              <Typography noWrap align="center" className={classes.titulos}>
                Unidad Conversion
              </Typography>
              <Typography align="center" variant="h6">
                <b>
                  {precios.unidad_de_compra.unidad === "Caja"
                    ? "Pz"
                    : precios.unidad_de_compra.unidad === "Costal"
                    ? "Kg"
                    : precios.unidad_de_compra.unidad}
                </b>
              </Typography>
            </Box>
          </Grid>
          <Grid item sm={4} md={2} xs={12}>
            <Box>
              <Typography noWrap className={classes.titulos}>
                <span className={classes.required}>* </span>Factor por Unidad
              </Typography>
              <TextField
                fullWidth
                disabled={
                  precios.unidad_de_compra.unidad === "Caja" ||
                  precios.unidad_de_compra.unidad === "Costal"
                    ? false
                    : true
                }
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                size="small"
                error={validacion.error && !precios.unidad_de_compra.cantidad}
                name="cantidad"
                id="form-producto-cantidad"
                variant="outlined"
                value={precios.unidad_de_compra.cantidad}
                helperText={validacion.message}
                onChange={obtenerUnidadCompra}
              />
            </Box>
          </Grid>
          <Grid item sm={6} md={3} xs={12}>
            <Box>
              <Typography noWrap className={classes.titulos}>
                <span className={classes.required}>* </span>Precio sin impuestos
              </Typography>
              <TextField
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                fullWidth
                size="small"
                error={validacion.error && !precioSinImpuesto}
                name="precio_sin_impuesto"
                id="form-producto-precio_sin_impuesto"
                variant="outlined"
                value={precioSinImpuesto}
                helperText={validacion.message}
                onChange={(e) => {
                  setCount(1)
                  setPrecioSinImpuesto(e.target.value);
                  setPrecioSinImpuestoVariable(e.target.value);
                }}
                /* onChange={(e) => obtenerPrecioSinImpuesto(e.target.value)} */
                onFocus={(e) => {
                  const { value } = e.target;
                  if (parseFloat(value) === 0) {
                    setPrecioSinImpuesto("");
                    setPrecioSinImpuestoVariable("");
                  }
                }}
                onBlur={(e) => {
                  const { value } = e.target;
                  if (!value) {
                    setPrecioSinImpuesto(0);
                    setPrecioSinImpuestoVariable("");
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item sm={6} md={3} xs={12}>
            <Box>
              <Typography noWrap className={classes.titulos}>
                <span className={classes.required}>* </span>Precio con impuestos
              </Typography>
              <TextField
                fullWidth
                disabled={!precios.iva_activo && !precios.ieps_activo}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                size="small"
                error={validacion.error && !precioConImpuesto}
                name="precio_con_impuesto"
                id="form-producto-precio_con_impuesto"
                variant="outlined"
                value={precioConImpuesto}
                helperText={validacion.message}
                onChange={(e) => {
                  setCount(1);
                  setPrecioConImpuesto(e.target.value);
                  setPrecioConImpuestoVariable(e.target.value);
                }}
                /* onChange={(e) => obtenerPrecioConImpuesto(e.target.value)} */
                onFocus={(e) => {
                  const { value } = e.target;
                  if (parseFloat(value) === 0) {
                    setPrecioConImpuesto("");
                    setPrecioConImpuestoVariable("");
                  }
                }}
                onBlur={(e) => {
                  const { value } = e.target;
                  if (!value) {
                    setPrecioConImpuesto(0);
                    setPrecioConImpuestoVariable(0);
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box my={3} />
        <Grid container spacing={2}>
          <Grid item md={2} xs={12}>
            <Box>
              <Typography align="center" className={classes.titulos}>
                IVA
              </Typography>
              <Typography align="center" variant="h6">
                <b>
                  $ {parseFloat(precios.precio_de_compra.iva.toFixed(2))}
                </b>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <Box>
              <Typography align="center" className={classes.titulos}>
                IEPS
              </Typography>
              <Typography align="center" variant="h6">
                <b>
                  $ {parseFloat(precios.precio_de_compra.ieps.toFixed(2))}
                </b>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography align="center" className={classes.titulos}>
                Precio unitario sin impuestos
              </Typography>
              <Typography align="center" variant="h6">
                <b>
                  ${" "}
                  {parseFloat(
                      precios.unidad_de_compra.precio_unitario_sin_impuesto.toFixed(2)
                  )}
                </b>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box>
              <Typography align="center" className={classes.titulos}>
                Precio unitario con impuestos
              </Typography>
              <Typography align="center" variant="h6">
                <b>
                  ${" "}
                  {parseFloat(
                      precios.unidad_de_compra.precio_unitario_con_impuesto.toFixed(2)
                  )}
                </b>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box my={2}>
          <Typography>
            <b>Precios de venta</b>
          </Typography>
          <Divider />
        </Box>

        <Box display="flex">
          <PreciosDeVenta />
        </Box>
        <Box my={2}>
          <Typography>
            <b>Unidades de venta</b>
          </Typography>
          <Divider />
        </Box>
        <Box>
          <PreciosDeCompra />
        </Box>
      </div>
    </Box>
  );
}
