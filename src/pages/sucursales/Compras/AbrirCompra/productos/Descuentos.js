import React, { Fragment, useContext } from "react";
import { Box, InputAdornment, TextField } from "@material-ui/core";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

export default function DescuentosInputs() {
  const { datosProducto, setDatosProducto, productoOriginal } = useContext(
    ComprasContext
  );
  const { presentaciones } = useContext(RegProductoContext);
  const { iva, ieps, precio_de_compra } = productoOriginal.precios;
  const { precio_sin_impuesto, precio_con_impuesto } = precio_de_compra;
  const iva_precio_actual = precio_de_compra.iva;
  const ieps_precio_actual = precio_de_compra.ieps;
  const impuesto_actual = iva_precio_actual + ieps_precio_actual;
  const { costo } = datosProducto;
  const PCSI_actual = costo - impuesto_actual;

  let cantidad_total = 0;
  let cantida_suma = 0;
  if (presentaciones.length > 0) {
    presentaciones.forEach((presentacion) => {
      const { cantidad_nueva } = presentacion;
      let nueva = cantidad_nueva ? cantidad_nueva : 0;
      cantida_suma += nueva;
    });
    if (isNaN(cantida_suma)) return;
    cantidad_total = cantida_suma;
  } else {
    cantidad_total = datosProducto.cantidad;
  }

  let PCSI_ACTUAL_TOTAL = PCSI_actual * cantidad_total;

  const obtenerPorcentaje = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDatosProducto({
        ...datosProducto,
        impuestos_descuento: impuesto_actual * cantidad_total,
        descuento_porcentaje: 0,
        descuento_precio: 0,
        subtotal_descuento: precio_sin_impuesto * cantidad_total,
        total_descuento: precio_con_impuesto * cantidad_total,
        iva_total: iva_precio_actual * cantidad_total,
        ieps_total: ieps_precio_actual * cantidad_total,
      });
      return;
    }
    let porcentaje = parseFloat(value);
    let cantidad_descontada = Math.round(
      (PCSI_ACTUAL_TOTAL * porcentaje) / 100
    );

    let subtotal_con_descuento = PCSI_ACTUAL_TOTAL - cantidad_descontada;

    const iva_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(iva < 10 ? ".0" + iva : "." + iva);
    const ieps_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
    const impuestos = iva_precio + ieps_precio;

    let total = subtotal_con_descuento + impuestos;

    setDatosProducto({
      ...datosProducto,
      impuestos_descuento: parseFloat(impuestos.toFixed(2)),
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(cantidad_descontada.toFixed(2)),
      subtotal_descuento: parseFloat(subtotal_con_descuento.toFixed(2)),
      total_descuento: parseFloat(total.toFixed(2)),
      iva_total: parseFloat(iva_precio.toFixed(2)),
      ieps_total: parseFloat(ieps_precio.toFixed(2)),
    });
  };

  const obtenerPrecio = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDatosProducto({
        ...datosProducto,
        impuestos_descuento: impuesto_actual * cantidad_total,
        descuento_porcentaje: 0,
        descuento_precio: 0,
        subtotal_descuento: precio_sin_impuesto * cantidad_total,
        total_descuento: precio_con_impuesto * cantidad_total,
        iva_total: iva_precio_actual * cantidad_total,
        ieps_total: ieps_precio_actual * cantidad_total,
      });
      return;
    }
    let cantidad_descontada = parseFloat(value);
    let porcentaje = Math.round(
      (cantidad_descontada / PCSI_ACTUAL_TOTAL) * 100
    );
    let subtotal_con_descuento = PCSI_ACTUAL_TOTAL - cantidad_descontada;
    const iva_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(iva < 10 ? ".0" + iva : "." + iva);
    const ieps_precio =
      parseFloat(subtotal_con_descuento) *
      parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
    const impuestos = iva_precio + ieps_precio;
    let total = subtotal_con_descuento + impuestos;

    setDatosProducto({
      ...datosProducto,
      impuestos_descuento: impuestos,
      descuento_porcentaje: parseFloat(porcentaje),
      descuento_precio: parseFloat(cantidad_descontada.toFixed(2)),
      subtotal_descuento: parseFloat(subtotal_con_descuento.toFixed(2)),
      total_descuento: parseFloat(total.toFixed(2)),
      iva_total: parseFloat(iva_precio.toFixed(2)),
      ieps_total: parseFloat(ieps_precio.toFixed(2)),
    });
  };

  return (
    <Fragment>
      <Box display="flex" width={200}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          inputMode="numeric"
          onChange={(e) => obtenerPrecio(e.target.value)}
          disabled={!datosProducto.producto.datos_generales}
          value={datosProducto.descuento_precio}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <Box mr={1} />
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          inputMode="numeric"
          onChange={(e) => obtenerPorcentaje(e.target.value)}
          disabled={!datosProducto.producto.datos_generales}
          value={datosProducto.descuento_porcentaje}
          InputProps={{
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
          }}
        />
      </Box>
    </Fragment>
  );
}
