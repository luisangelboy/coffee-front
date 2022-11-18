export const calculos_precios = ({
  productoOriginal,
  porcentaje,
  cantidad,
  costo,
}) => {
  const { iva, ieps, precio_de_compra } = productoOriginal.precios;
  const { /* precio_sin_impuesto, */ precio_con_impuesto } = precio_de_compra;

  let total_impuesto = 0;
  let precio_sin_impuesto = 0;

  total_impuesto =
    parseFloat(iva < 10 ? ".0" + iva : "." + iva) +
    parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
  precio_sin_impuesto = precio_con_impuesto / parseFloat(total_impuesto + 1);
  let iva_precio_actual =
    precio_sin_impuesto * parseFloat(iva < 10 ? ".0" + iva : "." + iva);
  let ieps_precio_actual =
    precio_sin_impuesto * parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);

  const impuesto_actual = iva_precio_actual + ieps_precio_actual;
  const PCSI_actual = costo - impuesto_actual;
  const PCSI_ACTUAL_TOTAL = PCSI_actual * cantidad;

  let cantidad_descontada = Math.round((PCSI_ACTUAL_TOTAL * porcentaje) / 100);
  let subtotal_con_descuento = PCSI_ACTUAL_TOTAL - cantidad_descontada;

  const iva_precio =
    parseFloat(subtotal_con_descuento) *
    parseFloat(iva < 10 ? ".0" + iva : "." + iva);
  const ieps_precio =
    parseFloat(subtotal_con_descuento) *
    parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
  const impuestos = iva_precio + ieps_precio;

  let total = subtotal_con_descuento + impuestos;
  return {
    result: {
      iva_precio,
      ieps_precio,
      impuestos,
      porcentaje,
      cantidad_descontada,
      subtotal_con_descuento,
      total,
    },
    anterior: {
      impuesto_actual,
      precio_sin_impuesto,
      precio_con_impuesto,
      cantidad,
      iva_precio_actual,
      ieps_precio_actual,
    },
  };
};
