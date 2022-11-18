import { gql } from "@apollo/client";

export const OBTENER_REPORTE_COMPRAS = gql`
  query obtenerProductoMovimientos(
    $empresa: ID!
    $sucursal: ID
    $input: ObteneReportesCompras
    $limit: Int
    $offset: Int
  ) {
    obtenerProductoMovimientos(
      empresa: $empresa
      sucursal: $sucursal
      input: $input
      limit: $limit
      offset: $offset
    ) {
      docs {
        _id
        id_compra
        id_traspaso
        id_producto
        id_proveedor
        id_almacen
        almacen {
          id_almacen
          nombre_almacen
        }
        proveedor {
          _id
          clave_cliente
          numero_cliente
          nombre_cliente
        }
        producto {
          almacen_inicial {
            almacen
            cantidad
            fecha_de_expiracion
            id_almacen
          }
          datos_generales {
            codigo_barras
            clave_alterna
            tipo_producto
            nombre_comercial
            nombre_generico
            descripcion
            id_categoria
            categoria
            subcategoria
            id_subcategoria
            id_departamento
            departamento
            id_marca
            marca
            clave_producto_sat {
              Name
              Value
            }
            receta_farmacia
          }
          precios {
            ieps
            ieps_activo
            iva
            iva_activo
            monedero
            monedero_electronico
            granel
            litros
            inventario {
              inventario_minimo
              inventario_maximo
              unidad_de_inventario
              codigo_unidad
            }
            precio_de_compra {
              precio_con_impuesto
              precio_sin_impuesto
              iva
              ieps
            }
            precios_producto {
              numero_precio
              precio_neto
              precio_venta
              iva_precio
              ieps_precio
              unidad_mayoreo
              utilidad
              precio_general
              cantidad_unidad
              unidad_maxima
            }
            unidad_de_compra {
              cantidad
              precio_unitario_con_impuesto
              unidad
              codigo_unidad
            }
          }
          unidades_de_venta {
            cantidad
            codigo_barras
            id_producto
            precio
            unidad
            unidad_principal
            _id
            precio_unidad {
              numero_precio
              precio_neto
              precio_venta
              iva_precio
              ieps_precio
              unidad_mayoreo
              utilidad
              precio_general
              cantidad_unidad
              unidad_maxima
            }
          }
        }
        concepto
        cantidad
        cantidad_regalo
        unidad_regalo
        cantidad_total
        iva_total
        ieps_total
        costo
        descuento_porcentaje
        descuento_precio
        compra_credito
        forma_pago
        impuestos
        mantener_precio
        subtotal
        total
        medida {
          id_medida
          medida
          tipo
        }
        color {
          id_color
          color
          hex
        }
        unidad
        id_unidad_venta
        empresa
        sucursal
        usuario
        year_registro
        numero_semana_year
        numero_mes_year
        fecha_registro
        compra {
        _id
        folio
        usuario {
          _id
          numero_usuario
          nombre
        }
        proveedor {
          id_proveedor {
            _id
          }
          nombre_cliente
          numero_cliente
          clave_cliente
        }
        en_espera
        almacen {
          id_almacen {
            _id
            nombre_almacen
            default_almacen
          }
          nombre_almacen
          default_almacen
        }
        compra_credito
        fecha_vencimiento_credito
        credito_pagado
        saldo_credito_pendiente
        forma_pago
        descuento_aplicado
        descuento {
          porcentaje
          cantidad_descontada
          precio_con_descuento
        }
        subtotal
        impuestos
        total
        fecha_registro
        estatus_credito
        status
      }
      }
      totalDocs
    }
  }
`;
