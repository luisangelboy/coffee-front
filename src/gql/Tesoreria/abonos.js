import {gql} from "@apollo/client";

export const OBTENER_ABONOS_PROVEEDORES = gql`
  query obtenerAbonosProveedores(
    $empresa: ID!
    $sucursal: ID!
    $filtro: String
    $limit: Int
    $offset: Int
  ) {
    obtenerAbonosProveedores(
      empresa: $empresa
      sucursal: $sucursal
      filtro: $filtro
      limit: $limit
      offset: $offset
    ) {
      docs {
      _id
      estatus_credito
      usuario {
        _id
        numero_usuario
        nombre
        estado_usuario
      }
      empresa {
        _id
        nombre_empresa
      }
      sucursal {
        _id
        nombre_sucursal
      }
      proveedor {
        id_proveedor {
          _id
          numero_cliente
          clave_cliente
          nombre_cliente
          telefono
          email
        }
        numero_cliente
        clave_cliente
        nombre_cliente
      }
      productos {
        _id
        id_compra
        id_traspaso
        id_producto
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
            inventario {
              inventario_minimo
              inventario_maximo
              unidad_de_inventario
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
              unidad_mayoreo
              utilidad
            }
            unidad_de_compra {
              cantidad
              precio_unitario_con_impuesto
              precio_unitario_sin_impuesto
              unidad
            }
          }
          unidades_de_venta {
            _id
            cantidad
            codigo_barras
            id_producto
            precio
            unidad
            unidad_principal
          }
        }
        concepto
        cantidad
        cantidad_regalo
        cantidad_total
        costo
        descuento_porcentaje
        descuento_precio
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
      }
      status
      almacen {
        id_almacen {
          _id
          nombre_almacen
          id_usuario_encargado {
            _id
            numero_usuario
            nombre
          }
        }
        nombre_almacen
      }
      compra_credito
      credito_pagado
      saldo_credito_pendiente
      fecha_vencimiento_credito
      subtotal
      impuestos
      total
      year_registro
      numero_semana_year
      numero_mes_year
      fecha_registro
      folio
    }
    totalDocs
    }
  }
`;


export const OBTENER_HISTORIAL_ABONOS = gql `
  query ObtenerHistorialAbonos(
    $empresa: ID!
    $sucursal: ID!
    $input: ObtenerHistorialAbonosInput,
  ) {
    obtenerHistorialAbonos(
      empresa: $empresa
      sucursal: $sucursal
      input: $input
    ) {
      _id
      numero_caja
      id_Caja
      horario_turno
      tipo_movimiento
      rol_movimiento
      fecha_movimiento {
        completa
      }
      numero_usuario_creador
      status
      nombre_usuario_creador
      monto_total_abonado
      numero_cliente
      nombre_cliente
      telefono_cliente
      email_cliente
      montos_en_caja {
        monto_efectivo {
          monto
        }
        monto_tarjeta_credito {
          monto
        }
        monto_tarjeta_debito {
          monto
        }
        monto_creditos {
          monto
        }
        monto_monedero {
          monto
        }
        monto_transferencia {
          monto
        }
        monto_cheques {
          monto
        }
        monto_vales_despensa {
          monto
        }
      }
    }
  }
`;

export const OBTENER_HISTORIAL_ABONOS_CLIENTE = gql `
  query historialVentasACredito(
    $empresa: ID!
    $sucursal: ID!
    $idCliente: ID
    $limit: Int
    $offset: Int
  ) {
    historialVentasACredito(
      empresa: $empresa
      sucursal: $sucursal
      idCliente: $idCliente
      limit: $limit
      offset:  $offset
    ) {
      docs {  
        _id
        folio
        facturacion
        estatus_credito
        cliente {
          _id
          numero_cliente
          clave_cliente
          representante
          nombre_cliente
          rfc
          curp
          telefono
          celular
          email
          numero_descuento
          limite_credito
          dias_credito
          razon_social
          direccion {
            calle
            no_ext
            no_int
            codigo_postal
            colonia
            municipio
            localidad
            estado
            pais
          }
          imagen
          estado_cliente
          tipo_cliente
          eliminado
          banco
          numero_cuenta
          monedero_electronico
          credito_disponible
          empresa {
            _id
          }
          sucursal {
            _id
          }
        }
        descuento
        ieps
        impuestos
        iva
        monedero
        subTotal
        total
        venta_cliente
        credito
        descuento_general_activo
        id_caja {
          _id
          numero_caja
          activa
        }
        fecha_de_vencimiento_credito
        dias_de_credito_venta
        saldo_credito_pendiente
        credito_pagado
        empresa
        sucursal
        usuario {
          _id
          numero_usuario
          nombre
        }
        productos {
          _id
          producto {
            _id
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
              inventario {
                inventario_minimo
                inventario_maximo
                unidad_de_inventario
                codigo_unidad
              }
              iva
              iva_activo
              monedero
              monedero_electronico
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
                precio_unitario_sin_impuesto
                unidad
                codigo_unidad
              }
              granel
              litros
            }
            imagenes {
              url_imagen
              location_imagen
              key_imagen
              extencion_imagen
            }
            centro_de_costos {
              cuenta
              id_cuenta
              id_subcuenta
              subcuenta
            }
            precio_plazos {
              precio_cajas {
                plazo
                unidad
                codigo_unidad
                precio
              }
              precio_costales {
                plazo
                unidad
                codigo_unidad
                precio
              }
              precio_piezas {
                plazo
                unidad
                codigo_unidad
                precio
              }
            }
            unidades_de_venta {
              _id
              precio
              cantidad
              concepto
              unidad
              codigo_unidad
              unidad_principal
              codigo_barras
              codigo_barras
              id_producto
              empresa
              sucursal
              descuento {
                cantidad_unidad
                numero_precio
                unidad_maxima
                precio_general
                precio_neto
                precio_venta
                iva_precio
                ieps_precio
                utilidad
                porciento
                dinero_descontado
              }
              descuento_activo
              default
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
            inventario_general {
              _id
              cantidad_existente
              unidad_inventario
              codigo_unidad
              cantidad_existente_maxima
              unidad_maxima
              id_almacen_general
              eliminado
            }
            medidas_producto {
              _id
              cantidad
              cantidad_nueva
              almacen
              codigo_barras
              color {
                hex
                nombre
                _id
              }
              descuento {
                cantidad_unidad
                numero_precio
                unidad_maxima
                precio_general
                precio_neto
                precio_venta
                iva_precio
                ieps_precio
                utilidad
                porciento
                dinero_descontado
              }
              descuento_activo
              existencia
              medida {
                talla
                tipo
                _id
              }
              nombre_comercial
              precio
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
            empresa
            sucursal
          }
          concepto
          cantidad
          iva_total
          ieps_total
          subtotal
          impuestos
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
          cantidad_venta
          granel_producto {
            granel
            valor
          }
          precio
          precio_a_vender
          precio_actual_producto
          default
          unidad
          codigo_unidad
          id_unidad_venta {
            _id
            precio
            cantidad
            concepto
            unidad
            codigo_unidad
            unidad_principal
            unidad_activa
            codigo_barras
            id_producto
            descuento {
              cantidad_unidad
              numero_precio
              unidad_maxima
              precio_general
              precio_neto
              precio_venta
              iva_precio
              ieps_precio
              utilidad
              porciento
              dinero_descontado
            }
            descuento_activo
            default
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
          inventario_general {
            _id
            cantidad_existente
            unidad_inventario
            codigo_unidad
            cantidad_existente_maxima
            unidad_maxima
            id_almacen_general
            eliminado
          }
          year_registro
          fecha_registro
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
          precio_actual_object {
            cantidad_unidad
            numero_precio
            unidad_maxima
            unidad_mayoreo
            precio_general
            precio_neto
            precio_venta
            iva_precio
            ieps_precio
            utilidad
            porciento
            dinero_descontado
          }
        }
        fecha_registro
        factura {
          id_cfdi
          serie
          currency
          expedition_place
          folio
          cfdi_type
          payment_form
          payment_method
          logo_url
          date
          issuer {
            FiscalRegime
            Rfc
            TaxName
          }
          receiver {
            Rfc
            Name
            CfdiUse
          }
          items {
            ProductCode
            IdentificationNumber
            Description
            Unit
            UnitCode
            UnitPrice
            Quantity
            Subtotal
            Discount
            Taxes {
              Total
              Name
              Base
              Rate
              IsRetention
            }
            Total
          }
          original_string
          sub_total
          total
          discount
          fecha_registro
          empresa
          sucursal
        }
        montos_en_caja {
          monto_efectivo {
            monto
            metodo_pago
          }
          monto_tarjeta_debito {
            monto
            metodo_pago
          }
          monto_tarjeta_credito {
            monto
            metodo_pago
          }
          monto_creditos {
            monto
            metodo_pago
          }
          monto_monedero {
            monto
            metodo_pago
          }
          monto_transferencia {
            monto
            metodo_pago
          }
          monto_cheques {
            monto
            metodo_pago
          }
          monto_vales_despensa {
            monto
            metodo_pago
          }
        }
        status
        abonos {
          _id
          numero_caja
          status
          id_Caja
          horario_turno
          tipo_movimiento
          rol_movimiento
          fecha_movimiento {
            completa
          }
          numero_usuario_creador
          nombre_usuario_creador
          monto_total_abonado
          numero_cliente
          nombre_cliente
          telefono_cliente
          email_cliente
          montos_en_caja {
            monto_efectivo {
              monto
            }
            monto_tarjeta_credito {
              monto
            }
            monto_tarjeta_debito {
              monto
            }
            monto_creditos {
              monto
            }
            monto_monedero {
              monto
            }
            monto_transferencia {
              monto
            }
            monto_cheques {
              monto
            }
            monto_vales_despensa {
              monto
            }
          }
          
        }
      }
      totalDocs   
    }
  }
`;

export const CREAR_ABONO = gql `
  mutation CrearAbono($empresa: ID!, $sucursal: ID!, $input: CrearAbonoInput) {
    crearAbono(empresa: $empresa, sucursal: $sucursal, input: $input) {
      message
    }
  }
`;

export const CREAR_ABONO_CLIENTE = gql `
  mutation crearAbonoVentaCredito($empresa: ID!, $sucursal: ID!, $input: AbonoVentasCreditoInput) {
    crearAbonoVentaCredito(empresa: $empresa, sucursal: $sucursal, input: $input) {
      message
      pdf
      xml
      success
    }
  }
`;

export const CANCELAR_ABONO_CLIENTE = gql `
  mutation cancelarAbonoCliente($empresa: ID!, $sucursal: ID!, $input: CancelarAbonoInput) {
    cancelarAbonoCliente(empresa: $empresa, sucursal: $sucursal, input: $input) {
      message
    }
  }
`;

export const CANCELAR_ABONO_PROVEEDOR = gql `
  mutation cancelarAbonoProveedor($empresa: ID!, $sucursal: ID!, $input: CancelarAbonoProveedorInput) {
    cancelarAbonoProveedor(empresa: $empresa, sucursal: $sucursal, input: $input) {
      message
    }
  }
`;

