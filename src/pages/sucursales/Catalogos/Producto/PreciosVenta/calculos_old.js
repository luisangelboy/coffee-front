const calculos = () => {
  const utilidad = preciosVenta.utilidad;
  if (!utilidad) {
    preciosVenta.precio_venta =
      precios.unidad_de_compra.precio_unitario_sin_impuesto;
  }
  if (!precios.iva_activo && !precios.ieps_activo) {
    preciosVenta.precio_neto =
      precios.unidad_de_compra.precio_unitario_sin_impuesto;

    /* if (preciosVenta.numero_precio === 1) { */
    let precio = precios.unidad_de_compra.precio_unitario_sin_impuesto;
    if (
      unidadVentaXDefecto.unidad === "Caja" ||
      unidadVentaXDefecto.unidad === "Costal"
    ) {
      precio =
        unidadVentaXDefecto.cantidad *
        precios.unidad_de_compra.precio_unitario_sin_impuesto;
    }
    if (preciosVenta.numero_precio > 1) {
      setUnidadVentaXDefecto(unidadVentaXDefecto);
    } else {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        precio: parseFloat(precio.toFixed(2)),
      });
    }

    if (unidadVentaXDefecto.descuento_activo === true) {
      //calcular nuevo precio entre %
      let precio_neto = Math.round(
        precio -
          precio * parseFloat("." + unidadVentaXDefecto.descuento.porciento)
      );
      if (preciosVenta.numero_precio > 1) {
        setUnidadVentaXDefecto(unidadVentaXDefecto);
      } else {
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto,
          },
        });
      }
    }
    /* } */
  } else {
    preciosVenta.precio_neto =
      precios.unidad_de_compra.precio_unitario_con_impuesto;
    /* if (preciosVenta.numero_precio === 1) { */
    let precio = precios.unidad_de_compra.precio_unitario_con_impuesto;
    if (
      unidadVentaXDefecto.unidad === "Caja" ||
      unidadVentaXDefecto.unidad === "Costal"
    ) {
      precio =
        unidadVentaXDefecto.cantidad *
        precios.unidad_de_compra.precio_unitario_con_impuesto;
    }
    if (preciosVenta.numero_precio > 1) {
      setUnidadVentaXDefecto(unidadVentaXDefecto);
    } else {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        precio: parseFloat(precio.toFixed(2)),
      });
    }

    if (unidadVentaXDefecto.descuento_activo === true) {
      //calcular nuevo precio entre %
      let precio_neto = Math.round(
        precio -
          precio * parseFloat("." + unidadVentaXDefecto.descuento.porciento)
      );
      if (preciosVenta.numero_precio > 1) {
        setUnidadVentaXDefecto(unidadVentaXDefecto);
      } else {
        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto,
          },
        });
      }

      /* } */
    }
  }

  let verificacion_entero = false;
  let new_utilidad = 0;
  new_utilidad = utilidad;

  if (parseFloat(utilidad) < 10)
    new_utilidad = "0" + utilidad.toString().replace(/[.]/g, "");
  if (utilidad > 99) {
    new_utilidad = utilidad / 100;
    verificacion_entero = true;
  }

  if (!verificacion_entero) {
    new_utilidad = "." + new_utilidad.toString().replace(/[.]/g, "");
  } else {
    new_utilidad = parseFloat(new_utilidad);
  }

  const ganancia_utilidad_sin_impuestos =
    precios.unidad_de_compra.precio_unitario_sin_impuesto +
    precios.unidad_de_compra.precio_unitario_sin_impuesto * new_utilidad;

  preciosVenta.precio_venta = parseFloat(
    ganancia_utilidad_sin_impuestos.toFixed(2)
  );

  if (precios.iva_activo || precios.ieps_activo) {
    let impuestos =
      precios.precio_de_compra.iva + precios.precio_de_compra.ieps;
    const ganancia_utilidad_con_impuestos =
      precios.unidad_de_compra.precio_unitario_sin_impuesto +
      precios.unidad_de_compra.precio_unitario_sin_impuesto * new_utilidad +
      impuestos;
    preciosVenta.precio_neto = parseFloat(
      ganancia_utilidad_con_impuestos.toFixed(2)
    );

    let precio = parseFloat(ganancia_utilidad_con_impuestos.toFixed(2));
    if (
      unidadVentaXDefecto.unidad === "Caja" ||
      unidadVentaXDefecto.unidad === "Costal"
    ) {
      precio =
        unidadVentaXDefecto.cantidad *
        parseFloat(ganancia_utilidad_con_impuestos.toFixed(2));
    }
    if (preciosVenta.numero_precio > 1) {
      setUnidadVentaXDefecto(unidadVentaXDefecto);
    } else {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        precio: parseFloat(precio.toFixed(2)),
      });
      if (unidadVentaXDefecto.descuento_activo === true) {
        //calcular nuevo precio entre %
        let precio_neto = Math.round(
          precio -
            precio * parseFloat("." + unidadVentaXDefecto.descuento.porciento)
        );

        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto,
          },
        });
      }
    }
  } else {
    preciosVenta.precio_neto = parseFloat(
      ganancia_utilidad_sin_impuestos.toFixed(2)
    );
    let precio = parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2));
    if (
      unidadVentaXDefecto.unidad === "Caja" ||
      unidadVentaXDefecto.unidad === "Costal"
    ) {
      precio =
        unidadVentaXDefecto.cantidad *
        parseFloat(ganancia_utilidad_sin_impuestos.toFixed(2));
    }
    if (preciosVenta.numero_precio > 1) {
      setUnidadVentaXDefecto(unidadVentaXDefecto);
    } else {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        precio: parseFloat(precio.toFixed(2)),
      });
      if (unidadVentaXDefecto.descuento_activo === true) {
        //calcular nuevo precio entre %
        let precio_neto = Math.round(
          precio -
            precio * parseFloat("." + unidadVentaXDefecto.descuento.porciento)
        );

        setUnidadVentaXDefecto({
          ...unidadVentaXDefecto,
          precio: parseFloat(precio.toFixed(2)),
          descuento: {
            ...unidadVentaXDefecto.descuento,
            precio_neto,
          },
        });
      }
    }
  }
  //nuevos campos
  preciosVenta.iva_precio = precios.precio_de_compra.iva;
  preciosVenta.ieps_precio = precios.precio_de_compra.ieps;
  setUnidadVentaXDefecto({
    ...unidadVentaXDefecto,
    precio_unidad: {
      numero_precio: preciosVenta.numero_precio,
      precio_neto: preciosVenta.precio_neto,
      precio_venta: preciosVenta.precio_venta,
      unidad_mayoreo: preciosVenta.unidad_mayoreo,
      iva_precio: preciosVenta.iva_precio,
      ieps_precio: preciosVenta.ieps_precio,
      utilidad: preciosVenta.utilidad,
    },
  });

  newPreciosP.splice(index, 1, preciosVenta);
  setPreciosP(newPreciosP);
};
