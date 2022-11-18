import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorPage from "../../../../components/ErrorPage";
import VistaProductoNormal from "./ProductoNormal";
import VistaProductoMedidas from "./ProductoMedidas";
import { VentasContext } from "../../../../context/Ventas/ventasContext";
import {
  calculatePrices2,
  findProductArray,
  verifiPrising,
} from "../../../../config/reuserFunctions";
import { Snackbar } from "@material-ui/core";

export default function ProductosViewComponent({ dataQuery, handleClickOpen }) {
  let productoBase = null;
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open_message, setOpenMessage] = useState(false);
  const { data, loading, error } = dataQuery;
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
  } = useContext(VentasContext);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="53vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        <ErrorPage />
      </Box>
    );
  }

  if (data && data.obtenerUnProductoVentas.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        NO HAY
      </Box>
    );
  }

  if (data) productoBase = data.obtenerUnProductoVentas;

  if (productoBase === null) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        BUSCA UN PRODUCTO
      </Box>
    );
  }

  const without_inventary = sesion.empresa.vender_sin_inventario;

  const agregarProductos = async (producto) => {
    if (producto.concepto === "medidas") {
      //cantidad
      if (!without_inventary && producto.cantidad === 0) {
        setOpenMessage(true);
        return;
      }
    } else {
      //inventario_general
      if (
        !without_inventary &&
        producto.inventario_general[0].cantidad_existente === 0
      ) {
        setOpenMessage(true);
        return;
      }
    }
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
    let venta_existente =
      venta === null
        ? {
            subTotal: 0,
            total: 0,
            impuestos: 0,
            iva: 0,
            ieps: 0,
            descuento: 0,
            monedero: 0,
          }
        : venta;

    let productosVentasTemp = productosVentas;

    let CalculosData = {
      subTotal: 0,
      total: 0,
      impuestos: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0,
    };

    const producto_encontrado = await findProductArray(producto);

    if (!producto_encontrado.found && producto._id) {
      const newP = { ...producto };
      //Tomar el precio con descuento o normal
      const productoPrecioFinal = newP.descuento_activo
        ? newP.descuento.precio_neto
        : newP.precio_unidad.precio_neto;

      const new_prices = await calculatePrices2({
        newP,
        cantidad: 0,
        granel: {
          granel: false,
          valor: 0,
        },
        origen: "Ventas1",
        precio_boolean: false,
      });

      new_prices.newP.precio_anterior = productoPrecioFinal;

      new_prices.newP.iva_total_producto = parseFloat(new_prices.ivaCalculo);
      new_prices.newP.ieps_total_producto = parseFloat(new_prices.iepsCalculo);
      new_prices.newP.impuestos_total_producto = parseFloat(
        new_prices.impuestoCalculo
      );
      new_prices.newP.subtotal_total_producto = parseFloat(
        new_prices.subtotalCalculo
      );
      new_prices.newP.total_total_producto = parseFloat(
        new_prices.totalCalculo
      );

      //   console.log(new_prices.newP);
      //agregar producto al inicio del arreglo
      productosVentasTemp.splice(0, 0, new_prices.newP);

      CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) +
          parseFloat(new_prices.subtotalCalculo),
        total:
          parseFloat(venta_existente.total) +
          parseFloat(new_prices.totalCalculo),
        impuestos:
          parseFloat(venta_existente.impuestos) +
          parseFloat(new_prices.impuestoCalculo),
        iva:
          parseFloat(venta_existente.iva) + parseFloat(new_prices.ivaCalculo),
        ieps:
          parseFloat(venta_existente.ieps) + parseFloat(new_prices.iepsCalculo),
        descuento:
          parseFloat(venta_existente.descuento) +
          parseFloat(new_prices.descuentoCalculo),
        monedero:
          parseFloat(venta_existente.monedero) +
          parseFloat(new_prices.monederoCalculo),
      };
    } else if (producto_encontrado.found && producto._id) {
      const {
        cantidad_venta,
        ...newP
      } = producto_encontrado.producto_found.producto;

      newP.cantidad_venta = parseInt(cantidad_venta) + 1;

      const verify_prising = await verifiPrising(newP);

      //   console.log(verify_prising);

      //Verificar si el precio fue encontrado
      if (verify_prising.found) {
        const calculo_resta = await calculatePrices2({
          newP,
          cantidad_venta,
          granel: newP.granel_producto,
          origen: "",
          precio_boolean: true,
          precio: newP.precio_actual_object,
        });

        const calculo_sumar = await calculatePrices2({
          newP,
          cantidad_venta: newP.cantidad_venta,
          granel: newP.granel_producto,
          origen: "",
          precio_boolean: true,
          precio: verify_prising.object_prising,
        });

        newP.precio_a_vender = calculo_sumar.totalCalculo;
        newP.precio_anterior = newP.precio_actual_producto;
        newP.precio_actual_producto = verify_prising.pricing;

        // console.log(calculo_sumar);

        newP.iva_total_producto = parseFloat(calculo_sumar.ivaCalculo);
        newP.ieps_total_producto = parseFloat(calculo_sumar.iepsCalculo);
        newP.impuestos_total_producto = parseFloat(
          calculo_sumar.impuestoCalculo
        );
        newP.subtotal_total_producto = parseFloat(
          calculo_sumar.subtotalCalculo
        );
        newP.total_total_producto = parseFloat(calculo_sumar.totalCalculo);

        // console.log(newP);

        newP.precio_actual_object = {
          cantidad_unidad: verify_prising.object_prising.cantidad_unidad
            ? verify_prising.object_prising.cantidad_unidad
            : null,
          numero_precio: verify_prising.object_prising.numero_precio
            ? verify_prising.object_prising.numero_precio
            : null,
          unidad_maxima: verify_prising.object_prising.unidad_maxima
            ? verify_prising.object_prising.unidad_maxima
            : null,
          precio_general: verify_prising.object_prising.precio_general
            ? verify_prising.object_prising.precio_general
            : null,
          precio_neto: verify_prising.object_prising.precio_neto
            ? verify_prising.object_prising.precio_neto
            : null,
          precio_venta: verify_prising.object_prising.precio_venta
            ? verify_prising.object_prising.precio_venta
            : null,
          iva_precio: verify_prising.object_prising.iva_precio
            ? verify_prising.object_prising.iva_precio
            : null,
          ieps_precio: verify_prising.object_prising.ieps_precio
            ? verify_prising.object_prising.ieps_precio
            : null,
          utilidad: verify_prising.object_prising.utilidad
            ? verify_prising.object_prising.utilidad
            : null,
          porciento: verify_prising.object_prising.porciento
            ? verify_prising.object_prising.porciento
            : null,
          dinero_descontado: verify_prising.object_prising.dinero_descontado
            ? verify_prising.object_prising.dinero_descontado
            : null,
        };

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(calculo_resta.subtotalCalculo) +
            calculo_sumar.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(calculo_resta.totalCalculo) +
            calculo_sumar.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(calculo_resta.impuestoCalculo) +
            calculo_sumar.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(calculo_resta.ivaCalculo) +
            calculo_sumar.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(calculo_resta.iepsCalculo) +
            calculo_sumar.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(calculo_resta.descuentoCalculo) +
            calculo_sumar.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(calculo_resta.monederoCalculo) +
            calculo_sumar.monederoCalculo,
        };
      } else {
        // console.log("Entro");
        const productoPrecioFinal = newP.descuento_activo
          ? newP.descuento.precio_neto
          : newP.precio_unidad.precio_neto;

        const new_prices = await calculatePrices2({
          newP,
          cantidad: 0,
          granel: {
            granel: false,
            valor: 0,
          },
          origen: "Ventas2",
        });

        new_prices.newP.precio_actual_producto = productoPrecioFinal;

        // console.log(new_prices);

        new_prices.newP.iva_total_producto =
          parseFloat(new_prices.ivaCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.ieps_total_producto =
          parseFloat(new_prices.iepsCalculo) * parseFloat(newP.cantidad_venta);
        new_prices.newP.impuestos_total_producto =
          parseFloat(new_prices.impuestoCalculo) *
          parseFloat(newP.cantidad_venta);
        new_prices.newP.subtotal_total_producto =
          parseFloat(new_prices.subtotalCalculo) *
          parseFloat(newP.cantidad_venta);
        new_prices.newP.total_total_producto =
          parseFloat(new_prices.totalCalculo) * parseFloat(newP.cantidad_venta);

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          new_prices.newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) +
            parseFloat(new_prices.subtotalCalculo),
          total: parseFloat(venta_existente.total) + new_prices.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) + new_prices.impuestoCalculo,
          iva: parseFloat(venta_existente.iva) + new_prices.ivaCalculo,
          ieps: parseFloat(venta_existente.ieps) + new_prices.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) + new_prices.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) + new_prices.monederoCalculo,
        };
      }
    }

    localStorage.setItem(
      "DatosVentas",
      JSON.stringify({
        ...CalculosData,
        cliente:
          venta_actual.venta_cliente === true ? venta_actual.cliente : {},
        venta_cliente:
          venta_actual.venta_cliente === true
            ? venta_actual.venta_cliente
            : false,
        productos: productosVentasTemp,
        tipo_emision: venta_actual.tipo_emision
          ? venta_actual.tipo_emision
          : "TICKET",
      })
    );
    setDatosVentasActual({
      ...CalculosData,
    });
    setUpdateTablaVentas(!updateTablaVentas);
    handleClickOpen();
  };

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open_message}
        onClose={() => setOpenMessage(false)}
        message="Producto sin existencias"
        autoHideDuration={3000}
      />
      {productoBase.length === 1 ? (
        <VistaProductoNormal
          productoBase={productoBase[0]}
          agregarProductos={agregarProductos}
        />
      ) : (
        <VistaProductoMedidas
          productos={productoBase}
          agregarProductos={agregarProductos}
        />
      )}
    </Fragment>
  );
}
