
export const calcular_iva = (name, value, precios) => {
  let precio_con_impuesto = 0;
  let precio_sin_impuesto = 0;
  let iva = 0;
  let ieps = 0;
  let precio_unitario_sin_impuesto = 0;
  let precio_unitario_con_impuesto = 0;
  if (name === "iva_activo") {
    if (value) {
      precio_sin_impuesto = parseFloat(
        precios.precio_de_compra.precio_sin_impuesto
      );
      iva = parseFloat(precio_sin_impuesto) * 0.16;
      ieps =
        parseFloat(precio_sin_impuesto) *
        parseFloat(
          precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps
        );
      precio_con_impuesto = precio_sin_impuesto + iva + ieps;
      precio_unitario_sin_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_con_impuesto =
        precio_con_impuesto / precios.unidad_de_compra.cantidad;
    } else {
      precio_sin_impuesto = parseFloat(
        precios.precio_de_compra.precio_sin_impuesto
      );
      iva = 0;
      ieps =
        parseFloat(precio_sin_impuesto) *
        parseFloat(
          precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps
        );
      precio_con_impuesto = precio_sin_impuesto + iva + ieps;
      precio_unitario_sin_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_con_impuesto =
        precio_con_impuesto / precios.unidad_de_compra.cantidad;
      if (!precios.ieps_activo) {
        precio_con_impuesto = 0;
        precio_unitario_con_impuesto =
          precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      }
    }
  } else {
    precio_sin_impuesto = parseFloat(
      precios.precio_de_compra.precio_sin_impuesto
    );
    iva =
      parseFloat(precio_sin_impuesto) *
      parseFloat(value < 10 ? ".0" + value : "." + value);
    ieps =
      parseFloat(precio_sin_impuesto) *
      parseFloat(precios.ieps < 10 ? ".0" + precios.ieps : "." + precios.ieps);
    precio_con_impuesto = precio_sin_impuesto + iva + ieps;
    precio_unitario_con_impuesto =
      precio_con_impuesto / precios.unidad_de_compra.cantidad;
    precio_unitario_sin_impuesto =
      precio_sin_impuesto / precios.unidad_de_compra.cantidad;
  }

  return {
    ...precios,
    iva_activo: name === "iva_activo" ? value : precios.iva_activo,
    iva: name === "iva" ? parseFloat(value) : value ? 16 : 0,
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
  };
};

export const calcular_ieps = (name, value, precios) => {
  let precio_con_impuesto = 0;
  let precio_sin_impuesto = 0;
  let iva = 0;
  let ieps = 0;
  let precio_unitario_sin_impuesto = 0;
  let precio_unitario_con_impuesto = 0;
  if (name === "ieps_activo") {
    if (value) {
      precio_sin_impuesto = parseFloat(
        precios.precio_de_compra.precio_sin_impuesto
      );
      iva =
        parseFloat(precio_sin_impuesto) *
        parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
      ieps = parseFloat(precio_sin_impuesto) * precios.ieps;
      precio_con_impuesto = precio_sin_impuesto + iva + ieps;
      precio_unitario_sin_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_con_impuesto =
        precio_con_impuesto / precios.unidad_de_compra.cantidad;
    } else {
      precio_sin_impuesto = parseFloat(
        precios.precio_de_compra.precio_sin_impuesto
      );
      ieps = 0;
      iva =
        parseFloat(precio_sin_impuesto) *
        parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
      precio_con_impuesto = precio_sin_impuesto + iva + ieps;
      precio_unitario_sin_impuesto =
        precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      precio_unitario_con_impuesto =
        precio_con_impuesto / precios.unidad_de_compra.cantidad;
      if (!precios.iva_activo) {
        precio_con_impuesto = 0;
        precio_unitario_con_impuesto =
          precio_sin_impuesto / precios.unidad_de_compra.cantidad;
      }
    }
  } else {
    precio_sin_impuesto = parseFloat(
      precios.precio_de_compra.precio_sin_impuesto
    );
    iva =
      parseFloat(precio_sin_impuesto) *
      parseFloat(precios.iva < 10 ? ".0" + precios.iva : "." + precios.iva);
    ieps =
      parseFloat(precio_sin_impuesto) *
      parseFloat(value < 10 ? ".0" + value : "." + value);
    precio_con_impuesto = precio_sin_impuesto + iva + ieps;
    precio_unitario_con_impuesto =
      precio_con_impuesto / precios.unidad_de_compra.cantidad;
    precio_unitario_sin_impuesto =
      precio_sin_impuesto / precios.unidad_de_compra.cantidad;
  }
  return {
    ...precios,
    ieps_activo: name === "ieps_activo" ? value : precios.ieps_activo,
    ieps: name === "ieps" ? parseFloat(value) : value ? precios.ieps : 0,
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
  };
};
