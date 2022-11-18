import moment from "moment";

export const numerosRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateCode = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateCodeNumerico = (length) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const formatoHora = (hora) => {
  if (!hora) {
    return null;
  } else {
    var newtime = new Date(hora);
    return newtime.toLocaleTimeString("en-US", { hour12: "false" });
  }
};

export const formatoFecha = (fecha) => {
  if (!fecha) {
    return null;
  } else {
    var newdate = new Date(fecha);
    return newdate.toLocaleDateString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const formatoFechaCorta = (fecha) => {
  if (!fecha) {
    return null;
  } else {
    /* var newdate = new Date(fecha); */
    return moment(fecha).locale("es-mx").format("ll");
    /*  return newdate.toLocaleDateString("es-mx", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }); */
  }
};

export const formatoMexico = (number) => {
  if (!number) {
    return 0.0;
  } else {
    let nueva;
    if (number % 1 === 0) {
      nueva = parseFloat(number).toFixed(2);
    } else {
      nueva = parseFloat(number).toFixed(2);
    }
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1,";
    return nueva.toString().replace(exp, rep);
  }
};

export const cleanTypenames = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanTypenames);
  } else if (value !== null && typeof value === "object") {
    const newObject = {};
    for (const property in value)
      if (property !== "__typename")
        newObject[property] = cleanTypenames(value[property]);
    return newObject;
  } else {
    return value;
  }
};

export const findProductArray = async (producto) => {
  try {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let found = false;
    let producto_found = {
      producto: {},
      index: 0,
    };

    for (let i = 0; i < productosVentas.length; i++) {
      if (productosVentas[i].codigo_barras) {
        if (productosVentas[i].codigo_barras === producto.codigo_barras) {
          producto_found = {
            producto: productosVentas[i],
            index: i,
          };
          found = true;
        }
      } else {
        if (
          productosVentas[i].id_producto.datos_generales.clave_alterna ===
          producto.id_producto.datos_generales.clave_alterna
        ) {
          if (productosVentas[i].unidad === producto.unidad) {
            //esta condicion no estaba originalmente en codigo uriel
            producto_found = {
              producto: productosVentas[i],
              index: i,
            };
            found = true;
          }
        }
      }
    }
    return {
      producto_found,
      found,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const calculatePrices = async (
  newP,
  cantidad,
  granel,
  newPrising = 0
) => {
  let subtotalCalculo = 0,
    totalCalculo = 0,
    impuestoCalculo = 0,
    ivaCalculo = 0,
    iepsCalculo = 0,
    descuentoCalculo = 0,
    monederoCalculo = 0;
  // console.log("newPrising",newPrising);
  const cantidadNueva = cantidad > 0 ? cantidad : 1;
  // console.log(newP);
  const iva_producto =
    parseFloat(newP.id_producto.precios.precios_producto[0].precio_venta) *
    parseFloat(
      `0.${
        newP.id_producto.precios.iva < 9
          ? `0${newP.id_producto.precios.iva}`
          : newP.id_producto.precios.iva
      }`
    );

  const ieps_producto =
    parseFloat(newP.id_producto.precios.precios_producto[0].precio_venta) *
    parseFloat(
      `0.${
        newP.id_producto.precios.ieps < 9
          ? `0${newP.id_producto.precios.ieps}`
          : newP.id_producto.precios.ieps
      }`
    );

  const precioProducto = newPrising;
  // const precioDescuentoProducto = newP.descuento_activo ? parseFloat(newP.descuento.precio_con_descuento) : 0;

  totalCalculo =
    granel.granel === true
      ? precioProducto * cantidadNueva * parseFloat(granel.valor)
      : precioProducto * cantidadNueva;

  subtotalCalculo =
    granel.granel === true
      ? (precioProducto - (iva_producto + ieps_producto)) *
        cantidadNueva *
        parseFloat(granel.valor)
      : (precioProducto - (iva_producto + ieps_producto)) * cantidadNueva;

  impuestoCalculo =
    granel.granel === true
      ? (iva_producto + ieps_producto) *
        cantidadNueva *
        parseFloat(granel.valor)
      : (iva_producto + ieps_producto) * cantidadNueva;

  ivaCalculo =
    granel.granel === true
      ? iva_producto * cantidadNueva * parseFloat(granel.valor)
      : iva_producto * cantidadNueva;

  iepsCalculo =
    granel.granel === true
      ? ieps_producto * cantidadNueva * parseFloat(granel.valor)
      : ieps_producto * cantidadNueva;

  descuentoCalculo =
    granel.granel === true
      ? newP.descuento_activo === true
        ? parseFloat(newP.descuento.dinero_descontado) *
          cantidadNueva *
          parseFloat(granel.valor)
        : 0
      : newP.descuento_activo === true
      ? parseFloat(newP.descuento.dinero_descontado) * cantidadNueva
      : 0;

  monederoCalculo = newP.id_producto.precios.monedero
    ? newP.id_producto.precios.monedero_electronico * cantidadNueva
    : 0;

  return {
    totalCalculo,
    subtotalCalculo,
    impuestoCalculo,
    ivaCalculo,
    iepsCalculo,
    descuentoCalculo,
    monederoCalculo,
  };
};

export const calculatePrices2 = async ({
  newP,
  cantidad,
  granel,
  origen,
  precio_boolean = false,
  precio,
}) => {
  try {
    let subtotalCalculo = 0,
      totalCalculo = 0,
      impuestoCalculo = 0,
      ivaCalculo = 0,
      iepsCalculo = 0,
      descuentoCalculo = 0,
      monederoCalculo = 0;
    // const descuento = newP.descuento_activo === null ? false : true;
    const cantidadNueva = cantidad > 0 ? cantidad : 1;
    const valor_granel = granel.granel ? parseFloat(granel.valor) : 1;
    const precio_actual = precio_boolean
      ? precio
      : newP.descuento_activo
      ? newP.descuento
      : newP.precio_unidad;
    const cantidadCaja =
      precio_actual.unidad_maxima === true ? precio_actual.cantidad_unidads : 1;
    ivaCalculo = precio_actual.iva_precio * cantidadCaja;
    iepsCalculo = precio_actual.ieps_precio * cantidadCaja;
    impuestoCalculo = ivaCalculo + iepsCalculo;
    subtotalCalculo = precio_actual.precio_venta * cantidadCaja;
    totalCalculo = precio_actual.precio_neto * cantidadCaja;
    monederoCalculo = newP.id_producto.precios.monedero
      ? newP.id_producto.precios.monedero_electronico * cantidadCaja
      : 0;
    descuentoCalculo = totalCalculo - newP.precio_unidad.precio_neto;
    const ob = {
      ivaCalculo: parseFloat(
        (ivaCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      iepsCalculo: parseFloat(
        (iepsCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      impuestoCalculo: parseFloat(
        (impuestoCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      subtotalCalculo: parseFloat(
        (subtotalCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      totalCalculo: parseFloat(
        (totalCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      monederoCalculo: parseFloat(
        (monederoCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      descuentoCalculo: parseFloat(
        (descuentoCalculo * valor_granel * cantidadNueva).toFixed(2)
      ),
      newP,
    };
    if (origen === "Ventas1") {
      newP.cantidad_venta = valor_granel; //si hay granel pone su valor si no 1
      newP.granel_producto = granel;
      newP.precio_a_vender = ob.totalCalculo;
      newP.precio_actual_producto = parseFloat(
        precio_actual.precio_neto.toFixed(2)
      );
      newP.precio_actual_object = {
        cantidad_unidad: precio_actual.cantidad_unidad
          ? precio_actual.cantidad_unidad
          : 1,
        numero_precio: precio_actual.numero_precio
          ? precio_actual.numero_precio
          : 1,
        unidad_maxima: precio_actual.unidad_maxima
          ? precio_actual.unidad_maxima
          : false,
        precio_general: precio_actual.precio_general
          ? parseFloat(precio_actual.precio_general.toFixed(2))
          : 0,
        precio_neto: precio_actual.precio_neto
          ? parseFloat(precio_actual.precio_neto.toFixed(2))
          : 0,
        precio_venta: precio_actual.precio_venta
          ? parseFloat(precio_actual.precio_venta.toFixed(2))
          : 0,
        iva_precio: precio_actual.iva_precio
          ? parseFloat(precio_actual.iva_precio.toFixed(2))
          : 0,
        ieps_precio: precio_actual.ieps_precio
          ? parseFloat(precio_actual.ieps_precio.toFixed(2))
          : 0,
        utilidad: precio_actual.utilidad ? precio_actual.utilidad : 0,
        porciento: precio_actual.porciento ? precio_actual.porciento : 0,
        dinero_descontado: precio_actual.dinero_descontado
          ? parseFloat(precio_actual.dinero_descontado.toFixed(2))
          : 0,
      };
    } else if (origen === "Ventas2") {
      if (granel.granel) {
        newP.cantidad_venta = valor_granel; //si hay granel pone su valor si no 1
      }
      newP.granel_producto = granel;
      newP.precio_a_vender = ob.totalCalculo;
      newP.precio_anterior = newP.precio_actual_producto;
    }

    return ob;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const calculatePricesNota = async ({
  newP,
  cantidad,
  granel,
  origen,
  precio_boolean = false,
  precio,
}) => {
  try {
    let subtotalCalculo = 0,
      totalCalculo = 0,
      impuestoCalculo = 0,
      ivaCalculo = 0,
      iepsCalculo = 0,
      descuentoCalculo = 0,
      monederoCalculo = 0;
    // const descuento = newP.descuento_activo === null ? false : true;
    const cantidadNueva = cantidad > 0 ? cantidad : 1;
    const valor_granel = granel.granel ? parseFloat(granel.valor) : 1;
    const precio_actual = precio_boolean
      ? precio
      : newP.descuento_activo
      ? newP.descuento
      : newP.precio_unidad;
    const cantidadCaja =
      precio_actual.unidad_maxima === true ? precio_actual.cantidad_unidads : 1;
    ivaCalculo = precio_actual.iva_precio * cantidadCaja;
    iepsCalculo = precio_actual.ieps_precio * cantidadCaja;
    impuestoCalculo = ivaCalculo + iepsCalculo;
    subtotalCalculo = precio_actual.precio_venta * cantidadCaja;
    totalCalculo = precio_actual.precio_neto * cantidadCaja;
    monederoCalculo = newP.id_producto.precios.monedero
      ? newP.id_producto.precios.monedero_electronico * cantidadCaja
      : 0;
    descuentoCalculo = totalCalculo - newP.precio_unidad.precio_neto;
    console.log(totalCalculo, valor_granel, cantidadNueva);
    const ob = {
      ivaCalculo: parseFloat((ivaCalculo * cantidadNueva).toFixed(2)),
      iepsCalculo: parseFloat((iepsCalculo * cantidadNueva).toFixed(2)),
      impuestoCalculo: parseFloat((impuestoCalculo * cantidadNueva).toFixed(2)),
      subtotalCalculo: parseFloat((subtotalCalculo * cantidadNueva).toFixed(2)),
      totalCalculo: parseFloat((totalCalculo * cantidadNueva).toFixed(2)),
      monederoCalculo: parseFloat((monederoCalculo * cantidadNueva).toFixed(2)),
      descuentoCalculo: parseFloat(
        (descuentoCalculo * cantidadNueva).toFixed(2)
      ),
      newP,
    };
    if (origen === "Ventas1") {
      newP.cantidad_venta = valor_granel; //si hay granel pone su valor si no 1
      newP.granel_producto = granel;
      newP.precio_a_vender = ob.totalCalculo;
      newP.precio_actual_producto = parseFloat(
        precio_actual.precio_neto.toFixed(2)
      );
      newP.precio_actual_object = {
        cantidad_unidad: precio_actual.cantidad_unidad
          ? precio_actual.cantidad_unidad
          : 1,
        numero_precio: precio_actual.numero_precio
          ? precio_actual.numero_precio
          : 1,
        unidad_maxima: precio_actual.unidad_maxima
          ? precio_actual.unidad_maxima
          : false,
        precio_general: precio_actual.precio_general
          ? parseFloat(precio_actual.precio_general.toFixed(2))
          : 0,
        precio_neto: precio_actual.precio_neto
          ? parseFloat(precio_actual.precio_neto.toFixed(2))
          : 0,
        precio_venta: precio_actual.precio_venta
          ? parseFloat(precio_actual.precio_venta.toFixed(2))
          : 0,
        iva_precio: precio_actual.iva_precio
          ? parseFloat(precio_actual.iva_precio.toFixed(2))
          : 0,
        ieps_precio: precio_actual.ieps_precio
          ? parseFloat(precio_actual.ieps_precio.toFixed(2))
          : 0,
        utilidad: precio_actual.utilidad ? precio_actual.utilidad : 0,
        porciento: precio_actual.porciento ? precio_actual.porciento : 0,
        dinero_descontado: precio_actual.dinero_descontado
          ? parseFloat(precio_actual.dinero_descontado.toFixed(2))
          : 0,
      };
    } else if (origen === "Ventas2") {
      if (granel.granel) {
        newP.cantidad_venta = valor_granel; //si hay granel pone su valor si no 1
      }
      newP.granel_producto = granel;
      newP.precio_a_vender = ob.totalCalculo;
      newP.precio_anterior = newP.precio_actual_producto;
    }

    return ob;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const verifiPrising = async (newP) => {
  try {
    if (!newP) return false;
    if (newP.codigo_unidad === "XBX") return false;
    const amount = newP.cantidad_venta;
    const pricings = newP.id_producto.precios.precios_producto.filter(
      (p) => p.unidad_mayoreo > 0 && p.precio_neto > 0
    );

    let finalPrising = {
      found: false,
      pricing: 0,
      number_pricing: 0,
      object_prising: {},
    };
    const datoFinal = pricings.length;
    if (newP.precio_seleccionado) return finalPrising;
    //CONIDICONAR SI EL PRECIO ES MENOR Y MENOR PERO QUE NO SEA MAYOR AL SEGUNDO
    if (amount < newP.id_producto.precios.precios_producto[1].unidad_mayoreo)
      return (finalPrising = {
        found: true,
        pricing: newP.descuento_activo
          ? newP.descuento.precio_neto
          : newP.id_producto.precios.precios_producto[0].precio_neto,
        number_pricing:
          newP.id_producto.precios.precios_producto[0].numero_precio,
        object_prising: newP.descuento_activo
          ? newP.descuento
          : newP.id_producto.precios.precios_producto[0],
      });

    for (let i = 0; i < pricings.length; i++) {
      if (i + 1 === datoFinal && amount >= pricings[i].unidad_mayoreo)
        return (finalPrising = {
          found: true,
          pricing: pricings[i].precio_neto,
          number_pricing: pricings[i].numero_precio,
          object_prising: pricings[i],
        });

      if (
        i + 1 < datoFinal &&
        amount >= pricings[i].unidad_mayoreo &&
        amount < pricings[i + 1].unidad_mayoreo
      ) {
        finalPrising = {
          found: true,
          pricing: pricings[i].precio_neto,
          number_pricing: pricings[i].numero_precio,
          object_prising: pricings[i],
        };
      }
    }
    return finalPrising;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export function formatCurrency(number) {
  var formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(number);
  console.log(formatted);
  return formatted;
}

export const findProductArrayRefactor = async (producto) => {
  try {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    //Declarar variables
    let found = false;
    let producto_found = {
      producto: {},
      index: 0,
    };
    //Se recorren los productos
    for (let i = 0; i < productosVentas.length; i++) {
      //Se verifica si tiene codigo de barras ya que no es obligatorio
      if (typeof productosVentas[i].codigo_barras !== "undefined") {
        if (productosVentas[i].codigo_barras === producto.codigo_barras) {
          return {
            producto_found: {
              producto: productosVentas[i],
              index: i,
            },
            found: true,
          };
        }
      } else {
        if (
          productosVentas[i].id_producto.datos_generales.clave_alterna ===
          producto.id_producto.datos_generales.clave_alterna
        ) {
          return {
            producto_found: {
              producto: productosVentas[i],
              index: i,
            },
            found: true,
          };
        }
      }
    }

    return {
      producto_found,
      found,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const truncteDecimals = (number, digits) => {
  number = parseFloat(number);
  var multiplier = Math.pow(10, 2),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);
  return truncatedNum / multiplier;
};

export const NumerosaLetras = (cantidad) => {
  var numero = 0;
  cantidad = parseFloat(cantidad);

  if (cantidad == "0.00" || cantidad == "0") {
    return "CERO PESOS CON 00/100 MXN";
  } else {
    var ent = cantidad.toString().split(".");
    var arreglo = separar_split(ent[0]);
    var longitud = arreglo.length;

    switch (longitud) {
      case 1:
        numero = unidades(arreglo[0]);
        break;
      case 2:
        numero = decenas(arreglo[0], arreglo[1]);
        break;
      case 3:
        numero = centenas(arreglo[0], arreglo[1], arreglo[2]);
        break;
      case 4:
        numero = unidadesdemillar(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3]
        );
        break;
      case 5:
        numero = decenasdemillar(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4]
        );
        break;
      case 6:
        numero = centenasdemillar(
          arreglo[0],
          arreglo[1],
          arreglo[2],
          arreglo[3],
          arreglo[4],
          arreglo[5]
        );
        break;
    }

    ent[1] = isNaN(ent[1]) ? "00" : ent[1];

    return numero + "PESOS CON " + ent[1] + "/100 MXN";
  }
}

function unidades(unidad) {
  var unidades = Array(
    "UN ",
    "DOS ",
    "TRES ",
    "CUATRO ",
    "CINCO ",
    "SEIS ",
    "SIETE ",
    "OCHO ",
    "NUEVE "
  );

  return unidades[unidad - 1];
}

function decenas(decena, unidad) {
  var diez = Array(
    "ONCE ",
    "DOCE ",
    "TRECE ",
    "CATORCE ",
    "QUINCE",
    "DIECISEIS ",
    "DIECISIETE ",
    "DIECIOCHO ",
    "DIECINUEVE "
  );
  var decenas = Array(
    "DIEZ ",
    "VEINTE ",
    "TREINTA ",
    "CUARENTA ",
    "CINCUENTA ",
    "SESENTA ",
    "SETENTA ",
    "OCHENTA ",
    "NOVENTA "
  );

  if (decena == 0 && unidad == 0) {
    return "";
  }

  if (decena == 0 && unidad > 0) {
    return unidades(unidad);
  }

  if (decena == 1) {
    if (unidad == 0) {
      return decenas[decena - 1];
    } else {
      return diez[unidad - 1];
    }
  } else if (decena == 2) {
    if (unidad == 0) {
      return decenas[decena - 1];
    } else if (unidad == 1) {
      return ("VEINTI" + "UN ");
    } else {
      return ("VEINTI" + unidades(unidad));
    }
  } else {
    if (unidad == 0) {
      return decenas[decena - 1] + " ";
    }
    if (unidad == 1) {
      return decenas[decena - 1] + " Y " + "UNO";
    }

    return decenas[decena - 1] + " Y " + unidades(unidad);
  }
}

function centenas(centena, decena, unidad) {
  var centenas = Array(
    "CIENTO ",
    "DOSCIENTOS ",
    "TRESCIENTOS ",
    "CUATROCIENTOS ",
    "QUINIENTOS ",
    "SEISCIENTOS ",
    "SETECIENTOS ",
    "OCHOCIENTOS ",
    "NOVECIENTOS "
  );

  if (centena == 0 && decena == 0 && unidad == 0) {
    return "";
  }
  if (centena == 1 && decena == 0 && unidad == 0) {
    return "CIEN ";
  }

  if (centena == 0 && decena == 0 && unidad > 0) {
    return unidades(unidad);
  }

  if (decena == 0 && unidad == 0) {
    return centenas[centena - 1] + "";
  }

  if (decena == 0) {
    var numero = centenas[centena - 1] + "" + decenas(decena, unidad);
    return numero.replace(" Y ", " ");
  }
  if (centena == 0) {
    return decenas(decena, unidad);
  }

  return centenas[centena - 1] + "" + decenas(decena, unidad);
}

function unidadesdemillar(unimill, centena, decena, unidad) {
  var numero = unidades(unimill) + " MIL " + centenas(centena, decena, unidad);
  numero = numero.replace("UN MIL ", "MIL ");
  if (unidad == 0) {
    return numero.replace(" Y ", " ");
  } else {
    return numero;
  }
}

function decenasdemillar(decemill, unimill, centena, decena, unidad) {
  var numero =
    decenas(decemill, unimill) + " MIL " + centenas(centena, decena, unidad);
  return numero;
}

function centenasdemillar(
  centenamill,
  decemill,
  unimill,
  centena,
  decena,
  unidad
) {
  var numero = 0;
  numero =
    centenas(centenamill, decemill, unimill) +
    " MIL " +
    centenas(centena, decena, unidad);

  return numero;
}

function separar_split(texto) {
  var contenido = new Array();
  for (var i = 0; i < texto.length; i++) {
    contenido[i] = texto.substr(i, 1);
  }
  return contenido;
}
