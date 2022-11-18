import { initial_state_precios } from "../../../../context/Catalogos/initialStatesProducto";
import moment from 'moment';

export const initial_state_datosProducto = {
  producto: {},
  costo: 0,
  cantidad: 0,
  cantidad_regalo: 0,
  unidad_regalo: '',
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
};

export const initial_state_datosCompra = {
  productos: [],
    proveedor: {},
    en_espera: false,
    fecha_registro: moment().locale("es-mx").format(),
    almacen: {},
    compra_credito: false,
    fecha_vencimiento_credito: moment().locale("es-mx").format(),
    credito_pagado: false,
    saldo_credito_pendiente: 0,
    forma_pago: "",
    descuento_aplicado: false,
    descuento: {
      porcentaje: 0,
      cantidad_descontada: 0,
      precio_con_descuento: 0
    },
    subtotal: 0,
    impuestos: 0,
    total: 0,
};

export const initial_state_precios_venta = [
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
];

export const initial_state_productoOriginal = {
  precios: initial_state_precios,
};
export const initial_state_productosCompra = [];
