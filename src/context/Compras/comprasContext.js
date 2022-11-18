import React, { createContext, useState } from "react";
import { initial_state_precios } from "../Catalogos/initialStatesProducto";
import moment from "moment";

export const ComprasContext = createContext();

export const ComprasProvider = ({ children }) => {
  const [datosProducto, setDatosProducto] = useState({
    producto: {},
    costo: 0,
    cantidad: 1,
    cantidad_regalo: 0,
    unidad_regalo: "",
    cantidad_total: 0,
    descuento_porcentaje: 0,
    descuento_precio: 0,
    iva_total: 0,
    ieps_total: 0,
    subtotal: 0,
    impuestos: 0,
    total: 0,
    mantener_precio: true,
    impuestos_descuento: 0,
    subtotal_descuento: 0,
    total_descuento: 0,
  });

  const [datosCompra, setDatosCompra] = useState({
    productos: [],
    proveedor: {},
    en_espera: false,
    fecha_registro: moment().locale("es-mx").format("YYYY-MM-DD"),
    almacen: {},
    compra_credito: false,
    fecha_vencimiento_credito: moment().locale("es-mx").format("YYYY-MM-DD"),
    credito_pagado: false,
    saldo_credito_pendiente: 0,
    forma_pago: "",
    descuento_aplicado: false,
    descuento: {
      porcentaje: 0,
      cantidad_descontada: 0,
      precio_con_descuento: 0,
    },
    subtotal: 0,
    impuestos: 0,
    total: 0,
  });

  const [preciosVenta, setPreciosVenta] = useState([
    {
      numero_precio: 1,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
      iva_precio: 0,
      ieps_precio: 0,
    },
    {
      numero_precio: 2,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
      iva_precio: 0,
      ieps_precio: 0,
    },
    {
      numero_precio: 3,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
      iva_precio: 0,
      ieps_precio: 0,
    },
    {
      numero_precio: 4,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
      iva_precio: 0,
      ieps_precio: 0,
    },
    {
      numero_precio: 5,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
      iva_precio: 0,
      ieps_precio: 0,
    },
    {
      numero_precio: 6,
      utilidad: 0,
      precio_neto: 0,
      unidad_mayoreo: 0,
      precio_venta: 0,
      iva_precio: 0,
      ieps_precio: 0,
    },
  ]);

  const [productoOriginal, setProductoOriginal] = useState({
    precios: initial_state_precios,
  });
  const [productosCompra, setProductosCompra] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [editFinish, setEditFinish] = useState(false);
  const [costo, setCosto] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [issue, setIssue] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  return (
    <ComprasContext.Provider
      value={{
        datosProducto,
        setDatosProducto,
        productosCompra,
        setProductosCompra,
        datosCompra,
        setDatosCompra,
        productoOriginal,
        setProductoOriginal,
        preciosVenta,
        setPreciosVenta,
        isEditing,
        setIsEditing,
        editFinish,
        setEditFinish,
        costo,
        setCosto,
        cantidad,
        setCantidad,
        issue,
        setIssue,
        loadingProductos,
        setLoadingProductos,
      }}
    >
      {children}
    </ComprasContext.Provider>
  );
};
