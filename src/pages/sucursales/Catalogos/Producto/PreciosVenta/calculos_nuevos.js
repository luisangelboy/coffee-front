

const calculos = () => {
  let { iva, ieps } = precios.precio_de_compra;
  let { unidad, cantidad, descuento, descuento_activo } = unidadVentaXDefecto;
  let I = iva + ieps;
  let PUCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
  let utilidad_base = preciosVenta.utilidad ? preciosVenta.utilidad : 0;

  //sacar ganancia y porcentaje de utilidad
  utilidad_base.toString().replace(/[.]/g, "");
  let utilidad = "." + utilidad_base;
  if (utilidad_base < 10) utilidad = ".0" + utilidad_base;
  if (utilidad_base % 100 === 0) utilidad = utilidad_base / 100;

  //precio venta y neto con utilidad
  const precio_venta = parseFloat((PUCSI * utilidad + PUCSI));
  const precio_neto = parseFloat((PUCSI * utilidad + I + PUCSI));

  //meter los valores a preciosVenta
  preciosVenta.precio_venta = parseFloat(precio_venta.toFixed(2));
  preciosVenta.precio_neto = parseFloat(precio_neto.toFixed(2));
  preciosVenta.iva_precio = iva;
  preciosVenta.ieps_precio = ieps;

  //meter los precios a unidadXdefecto
  let unidadXDefecto = {
    ...unidadVentaXDefecto,
    precio_unidad: {
      numero_precio: preciosVenta.numero_precio,
      precio_neto: parseFloat(precio_neto.toFixed(2)),
      precio_venta: parseFloat(precio_venta.toFixed(2)),
      unidad_mayoreo: preciosVenta.unidad_mayoreo,
      iva_precio: iva,
      ieps_precio: ieps,
      utilidad: preciosVenta.utilidad,
      unidad_maxima: false,
    },
  };
  if (preciosVenta.numero_precio === 1) {
    if (unidad === "Caja" || unidad === "Costal") {
      unidadXDefecto = {
        ...unidadXDefecto,
        precio: parseFloat((cantidad * precio_neto).toFixed(2)),
      };
    } else {
      unidadXDefecto = {
        ...unidadXDefecto,
        precio: parseFloat(precio_neto.toFixed(2)),
      };
    }
    if (descuento_activo === true) {
      //calcular nuevo precio entre %
      let new_precio_neto = Math.round(
        precio_neto - precio_neto * parseFloat("." + descuento.porciento)
      );

      unidadXDefecto = {
        ...unidadXDefecto,
        precio: parseFloat(precio_neto.toFixed(2)),
        descuento: { ...unidadVentaXDefecto.descuento, precio_neto: parseFloat(new_precio_neto.toFixed(2)) },
      };
    }
  }
  setUnidadVentaXDefecto(unidadXDefecto);

  newPreciosP.splice(index, 1, preciosVenta);
  setPreciosP(newPreciosP);
};
