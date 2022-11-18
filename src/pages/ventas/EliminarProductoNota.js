import React, { Fragment, useContext } from "react";
import { IconButton } from "@material-ui/core";
import { Add, Close, Delete } from "@material-ui/icons";
import { VentasContext } from "../../context/Ventas/ventasContext";

import {
  findProductArray,
  calculatePrices2,
  calculatePricesNota,
} from "../../config/reuserFunctions";
import { TRUE } from "sass";

export default function EliminarProductoNota({
  producto,
  setDatosVentasActual,
  index,
}) {
  const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);

  const eliminarProducto = async () => {
    let copy_product = { ...producto };
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    const venta_actual = venta === null ? [] : venta;
    let productosVentasTemp = [...productosVentas];
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

    const producto_encontrado = await findProductArray(copy_product);
    if (producto_encontrado.found) {
      const new_resta = await calculatePricesNota({
        newP: copy_product,
        cantidad: copy_product.cantidad_venta,
        precio_boolean: false,
        precio: copy_product.precio_actual_object,
        granel: copy_product.granel_producto,
        origen: "",
      });

      copy_product.cantidad_regresada = copy_product.cantidad_venta_original;
      copy_product.cantidad_venta = 0;
      copy_product.eliminado = true;
      //precios producto
      copy_product.impuestos_total_producto = 0;
      copy_product.subtotal_total_producto = 0;
      copy_product.total_total_producto = 0;

      const CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) -
          parseFloat(new_resta.subtotalCalculo),
        total:
          parseFloat(venta_existente.total) -
          parseFloat(new_resta.totalCalculo),
        impuestos:
          parseFloat(venta_existente.impuestos) -
          parseFloat(new_resta.impuestoCalculo),
        iva: parseFloat(venta_existente.iva) - parseFloat(new_resta.ivaCalculo),
        ieps:
          parseFloat(venta_existente.ieps) - parseFloat(new_resta.iepsCalculo),
        descuento:
          parseFloat(venta_existente.descuento) -
          parseFloat(new_resta.descuentoCalculo),
        monedero:
          parseFloat(venta_existente.monedero) -
          parseFloat(new_resta.monederoCalculo),
      };

      productosVentasTemp.splice(index, 1, copy_product);

      let saldo_favor = 0;
      if (venta.nota_credito) {
        saldo_favor = venta.total_original - CalculosData.total;
      }

      if (productosVentasTemp.length === 0 && !venta.cliente.nombre_cliente) {
        localStorage.removeItem("DatosVentas");
        localStorage.removeItem("VentaOriginal");
      } else {
        localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            ...venta,
            ...CalculosData,
            saldo_favor,
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
      }

      setDatosVentasActual(CalculosData);
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  const agregarProducto = async () => {
    // console.log(producto);
    let copy_product = {...producto}
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    const venta_actual = venta === null ? [] : venta;
    let productosVentasTemp = [...productosVentas];
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

    const producto_encontrado = await findProductArray(copy_product);
    if (producto_encontrado.found) {
      const { cantidad_venta, ...newP } = copy_product;

      // newP.precio_actual_producto = newP.descuento_activo ? newP.descuento.precio_con_descuento :  newP.precio;
      //Sacar los impuestos que se van a restar
      // let calculoResta = await calculatePrices(newP, cantidad_venta, newP.granel_producto, newP.precio_actual_producto);

      const new_resta = await calculatePricesNota({
        newP: newP,
        cantidad: copy_product.cantidad_venta_original,
        precio_boolean: true,
        precio: newP.precio_actual_object,
        granel: newP.granel_producto,
        origen: "",
        add: true
      });

      //productosVentasTemp.splice(producto_encontrado.producto_found.index, 1);
      copy_product.cantidad_regresada = 0;
      copy_product.cantidad_venta = copy_product.cantidad_venta_original;
      copy_product.eliminado = false;
      //precios producto
      copy_product.impuestos_total_producto = copy_product.ieps_total_producto + copy_product.iva_total_producto;
      copy_product.subtotal_total_producto = copy_product.precio_a_vender - copy_product.impuestos_total_producto;
      copy_product.total_total_producto = copy_product.precio_a_vender;

      productosVentasTemp.splice(index, 1, copy_product)
        
      const CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) +
          parseFloat(new_resta.subtotalCalculo),
        total:
          parseFloat(venta_existente.total) +
          parseFloat(new_resta.totalCalculo),
        impuestos:
          parseFloat(venta_existente.impuestos) +
          parseFloat(new_resta.impuestoCalculo),
        iva: parseFloat(venta_existente.iva) + parseFloat(new_resta.ivaCalculo),
        ieps:
          parseFloat(venta_existente.ieps) + parseFloat(new_resta.iepsCalculo),
        descuento:
          parseFloat(venta_existente.descuento) +
          parseFloat(new_resta.descuentoCalculo),
        monedero:
          parseFloat(venta_existente.monedero) +
          parseFloat(new_resta.monederoCalculo),
      };

      let saldo_favor = 0;
      if (venta.nota_credito) {
        saldo_favor = venta.total_original - CalculosData.total;
      }

      if (productosVentasTemp.length === 0 && !venta.cliente.nombre_cliente) {
        localStorage.removeItem("DatosVentas");
        localStorage.removeItem("VentaOriginal");
      } else {
        localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            ...venta,
            ...CalculosData,
            saldo_favor,
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
      }

      setDatosVentasActual(CalculosData);
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  return (
    <Fragment>
      {producto.eliminado ? (
        <IconButton size="small" onClick={() => agregarProducto()}>
          <Add size="small" color="primary" />
        </IconButton>
      ) : (
        <IconButton size="small" onClick={() => eliminarProducto()}>
          <Close size="small" color="error" />
        </IconButton>
      )}
    </Fragment>
  );
}
