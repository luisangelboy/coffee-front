import { gql } from "@apollo/client";

export const CONSULTA_PRODUCTOS = gql`
  query ObtenerConsultaGeneralVentas($empresa: ID!, $sucursal: ID!) {
    obtenerConsultaGeneralVentas(empresa: $empresa, sucursal: $sucursal) {
      _id
      precio
      cantidad
      concepto
      unidad
      unidad_principal
      codigo_barras
      descuento {
        porciento
        dinero_descontado
        precio_con_descuento
      }
      descuento_activo
      default
      id_producto {
        datos_generales {
          nombre_comercial
          codigo_barras
          tipo_producto
          clave_alterna
        }
      }
      inventario_general {
        cantidad_existente
        unidad_inventario
        cantidad_existente_maxima
        unidad_maxima
      }
    }
  }
`;

export const CONSULTA_PRODUCTO_UNITARIO = gql`
  query ObtenerUnProductoVentas(
    $empresa: ID!
    $sucursal: ID!
    $datosProductos: ID!
  ) {
    obtenerUnProductoVentas(
      empresa: $empresa
      sucursal: $sucursal
      datosProductos: $datosProductos
    ) {
      _id
      precio
      cantidad
      concepto
      unidad
      unidad_principal
      codigo_barras
      codigo_unidad
      precio_unidad {
        numero_precio
        precio_neto
        precio_venta
        iva_precio
        ieps_precio
        unidad_mayoreo
        precio_general
        cantidad_unidad
        unidad_maxima
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
        dinero_descontado
        porciento
      }
      medida {
        talla
        tipo
        _id
      }
      color {
        hex
        nombre
        _id
      }
      descuento_activo
      default
      id_producto {
        imagenes {
          url_imagen
        }
        _id
        datos_generales {
          nombre_comercial
          codigo_barras
          tipo_producto
          clave_alterna
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
        }
      }
      inventario_general {
        cantidad_existente
        unidad_inventario
        cantidad_existente_maxima
        unidad_maxima
        codigo_unidad
      }
    }
  }
`;

export const CONSULTA_PRODUCTOS_VENTAS = gql`
  query ObtenerProductosVentas(
    $empresa: ID!
    $sucursal: ID!
    $input: ObtenerProductosVentasInput
    $limit: Int
    $offset: Int
  ) {
    obtenerProductosVentas(
      empresa: $empresa
      sucursal: $sucursal
      input: $input
      limit: $limit
      offset: $offset
    ) {
      docs {
        _id
        precio
        cantidad
        concepto
        unidad
        unidad_principal
        codigo_barras
        codigo_unidad
        precio_unidad {
          numero_precio
          precio_neto
          precio_venta
          iva_precio
          ieps_precio
          unidad_mayoreo
          precio_general
          cantidad_unidad
          unidad_maxima
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
          dinero_descontado
          porciento
        }
        medida {
          talla
          tipo
          _id
        }
        color {
          hex
          nombre
          _id
        }
        descuento_activo
        default
        id_producto {
          imagenes {
            url_imagen
          }
          _id
          datos_generales {
            nombre_comercial
            codigo_barras
            tipo_producto
            clave_alterna
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
          }
        }
        inventario_general {
          cantidad_existente
          unidad_inventario
          cantidad_existente_maxima
          unidad_maxima
          codigo_unidad
          id_almacen_general
        }
      }
      totalDocs
    }
  }
`;

export const OBTENER_CLIENTES_VENTAS = gql`
  query ObtenerClientesVentas(
    $empresa: ID!
    $sucursal: ID!
    $limit: Int
    $offset: Int
    $filtro: String
  ) {
    obtenerClientesVentas(
      empresa: $empresa
      sucursal: $sucursal
      limit: $limit
      offset: $offset
      filtro: $filtro
    ) {
      docs {
        _id
        numero_cliente
        clave_cliente
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
        banco
        numero_cuenta
        monedero_electronico
        credito_disponible
      }
      totalDocs
    }
  }
`;

export const CREAR_VENTA = gql`
  mutation createVenta(
    $input: CrearVentasInput!
    $empresa: ID!
    $sucursal: ID!
    $usuario: ID!
    $caja: ID!
    $isOnline: Boolean!
  ) {
    createVenta(
      input: $input
      empresa: $empresa
      sucursal: $sucursal
      usuario: $usuario
      caja: $caja
      isOnline: $isOnline
    ) {
      message
      done
      datos_to_save_storage{
        historialCajaInstance{
          _id
          montos_en_caja {
            monto_efectivo{monto metodo_pago}
            monto_tarjeta_debito{monto metodo_pago}
            monto_tarjeta_credito{monto metodo_pago}
            monto_creditos{monto metodo_pago}
            monto_monedero{monto metodo_pago}
            monto_transferencia{monto metodo_pago}
            monto_cheques{monto metodo_pago}
            monto_vales_despensa{monto metodo_pago}
          }
          id_movimiento
          tipo_movimiento
          concepto
          rol_movimiento
          id_Caja
          numero_caja
          horario_turno
          hora_moviento{
            hora
            minutos
            segundos
            completa
          }
          fecha_movimiento{
            year
            mes
            dia
            no_semana_year
            no_dia_year
            completa
          }
          id_User
          numero_usuario_creador
          nombre_usuario_creador
          empresa
          sucursal
        }
        new_venta{
          _id
          folio
          descuento
          ieps
          impuestos
          iva
          monedero
          subTotal
          total
          venta_cliente
          status
          montos_en_caja {
            monto_efectivo{monto metodo_pago}
            monto_tarjeta_debito{monto metodo_pago}
            monto_tarjeta_credito{monto metodo_pago}
            monto_creditos{monto metodo_pago}
            monto_monedero{monto metodo_pago}
            monto_transferencia{monto metodo_pago}
            monto_cheques{monto metodo_pago}
            monto_vales_despensa{monto metodo_pago}
          }
          credito
          abono_minimo
          saldo_credito_pendiente
          credito_pagado
          descuento_general_activo
          descuento_general{ 
            cantidad_descontado
            porciento
            precio_con_descuento
          }
          id_caja
          fecha_de_vencimiento_credito
          dias_de_credito_venta
          empresa
          sucursal
          usuario
          cliente{
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
            credito_disponible
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
            banco
            numero_cuenta
            empresa {
              _id
              nombre_empresa
              correo_empresa
              nombre_dueno
              telefono_dueno
              sucursales_activas
              limite_sucursales
            }
            sucursal {
              _id
              nombre_sucursal
              descripcion
            }
            monedero_electronico
            fecha_nacimiento
            fecha_registro
            eliminado
          }
          year_registro
          numero_semana_year
          numero_mes_year
          fecha_registro

          forma_pago
          metodo_pago
          tipo_emision
          fecha_venta
          turno
        }
        productos_base {
          _id
          id_venta
          id_producto
          forma_pago
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
          cantidad_venta
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
          subtotal_antes_de_impuestos
          precio_actual_object{
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
          granel_producto{
            granel
            valor
          }
          precio
          precio_a_vender
          precio_actual_producto
          descuento_activo
          default
         
        }
      }
    }
  }
`;

export const CREAR_NOTA_CREDITO = gql`
  mutation crearNotaCredito(
    $input: CrearNotaCreditoInput!
    $empresa: ID!
    $sucursal: ID!
    $turno: turnoVenta
  ) {
    crearNotaCredito(
      input: $input
      empresa: $empresa
      sucursal: $sucursal
      turno: $turno
    ) {
      message
    }
  }
`;

export const OBTENER_VENTAS_SUCURSAL = gql`
  query obtenerVentasSucursal(
    $empresa: ID!
    $sucursal: ID!
    $filtros: filtrosObtenerVentas
    $limit: Int
    $offset: Int
  ) {
    obtenerVentasSucursal(
      empresa: $empresa
      sucursal: $sucursal
      filtros: $filtros
      limit: $limit
      offset: $offset
    ) {
      docs {
        _id
        folio
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
          eliminado
          banco
          numero_cuenta
          monedero_electronico
          credito_disponible
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
        empresa
        sucursal
        usuario {
          _id
          numero_usuario
          nombre
        }
        productos {
          _id
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
            empresa
            sucursal
            default
          }
          id_producto {
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
          subtotal_antes_de_impuestos
          descuento_activo
          descuento_producto {
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
        tipo_emision
        forma_pago
        metodo_pago
        abono_minimo
        cambio
        nota_credito {
          _id
          cliente {
            _id
            numero_cliente
            clave_cliente
            nombre_cliente
            representante
            rfc
          }
          generar_cfdi
          descuento
          ieps
          impuestos
          iva
          subTotal
          total
          id_factura
          observaciones
          empresa
          sucursal
          usuario {
            _id
            numero_usuario
            nombre
            email
          }
          venta {
            _id
          }
          fecha_registro
          cambio
          devolucion_en
        }
      }
      totalDocs
    }
  }
`;
export const OBTENER_VENTAS_REPORTES = gql`
  query obtenerVentasReportes(
    $empresa: ID!
    $sucursal: ID!
    $filtros: filtrosReportesVentas
    $limit: Int
    $offset: Int
  ) {
    obtenerVentasReportes(
      empresa: $empresa
      sucursal: $sucursal
      filtros: $filtros
      limit: $limit
      offset: $offset
    ) {
      docs {
        _id
        id_compra
        id_traspaso
        id_producto
        id_proveedor
        id_venta
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
        cantidad_venta
        unidad_regalo
        cantidad_total
        iva_total
        ieps_total
        costo
        descuento_porcentaje
        descuento_precio
        compra_credito
        venta_credito
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
        factura {
          id_cfdi
          serie
          currency
          expedition_place
          folio
          cfdi_type
          payment_form
          payment_method
          date
        }
        nota_credito {
          id_nota_credito
          cantidad_devuelta
          cantidad_vendida
          total
        }
        venta {
          _id
          folio
          cliente {
            _id
            numero_cliente
            clave_cliente
            nombre_cliente
          }
          descuento
          ieps
          ieps
          impuestos
          iva
          monedero
          subTotal
          total
          venta_cliente
          factura {
            id_cfdi
            folio
            serie
          }
          status
          tipo_emision
          observaciones
          forma_pago
          metodo_pago
          credito
          descuento_general_activo
          id_caja {
            _id
            numero_caja
          }
          usuario {
            _id
            numero_usuario
            nombre
          }
          fecha_registro
          cambio
        }
      }
      totalDocs
      totalVenta
    }
  }
`;

export const OBTENER_REPORTE_VENTAS_VENTA = gql`
  query obtenerVentasByVentaReportes(
    $empresa: ID!
    $sucursal: ID!
    $filtros: filtrosReportesVentasByVenta
    $limit: Int
    $offset: Int
  ) {
    obtenerVentasByVentaReportes(
      empresa: $empresa
      sucursal: $sucursal
      filtros: $filtros
      limit: $limit
      offset: $offset
    ) {
      docs {
        _id
        folio
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
          eliminado
          banco
          numero_cuenta
          monedero_electronico
          credito_disponible
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
        empresa
        sucursal
        usuario {
          _id
          numero_usuario
          nombre
        }
        productos {
          _id
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
            empresa
            sucursal
            default
          }
          id_producto {
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
          subtotal_antes_de_impuestos
          descuento_activo
          descuento_producto {
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
        tipo_emision
        forma_pago
        metodo_pago
        abono_minimo
        cambio
        nota_credito {
          _id
          cliente {
            _id
            numero_cliente
            clave_cliente
            nombre_cliente
            representante
            rfc
          }
          generar_cfdi
          descuento
          ieps
          impuestos
          iva
          subTotal
          total
          id_factura
          observaciones
          empresa
          sucursal
          usuario {
            _id
            numero_usuario
            nombre
            email
          }
          venta {
            _id
          }
          fecha_registro
          cambio
          devolucion_en
        }
      }
      totalDocs
      totalVenta
    }
  }
`;

export const CANCELAR_VENTA_SUCURSAL = gql`
  mutation cancelarVentasSucursal(
    $empresa: ID!
    $sucursal: ID!
    $folio: String!
    $input: cancelarVentaInput
  ) {
    cancelarVentasSucursal(
      empresa: $empresa
      sucursal: $sucursal
      folio: $folio
      input: $input
    ) {
      message
    }
  }
`;

export const SUBIR_VENTAS_CLOUD = gql`
  mutation subirVentasCloud(
  $arrayVentasCloud: [VentasCloudInput]
 
) {
  subirVentasCloud(
    arrayVentasCloud: $arrayVentasCloud
  ) {
    message
    done
    ventas_fail{

      historialCajaInstance{
          _id
          montos_en_caja {
            monto_efectivo{monto metodo_pago}
            monto_tarjeta_debito{monto metodo_pago}
            monto_tarjeta_credito{monto metodo_pago}
            monto_creditos{monto metodo_pago}
            monto_monedero{monto metodo_pago}
            monto_transferencia{monto metodo_pago}
            monto_cheques{monto metodo_pago}
            monto_vales_despensa{monto metodo_pago}
          }
          id_movimiento
          tipo_movimiento
          concepto
          rol_movimiento
          id_Caja
          numero_caja
          horario_turno
          hora_moviento{
            hora
            minutos
            segundos
            completa
          }
          fecha_movimiento{
            year
            mes
            dia
            no_semana_year
            no_dia_year
            completa
          }
          id_User
          numero_usuario_creador
          nombre_usuario_creador
          empresa
          sucursal
      }

      new_venta{
        _id
        folio
        descuento
        ieps
        impuestos
        iva
        monedero
        subTotal
        total
        venta_cliente
        status
        montos_en_caja {
          monto_efectivo{monto metodo_pago}
          monto_tarjeta_debito{monto metodo_pago}
          monto_tarjeta_credito{monto metodo_pago}
          monto_creditos{monto metodo_pago}
          monto_monedero{monto metodo_pago}
          monto_transferencia{monto metodo_pago}
          monto_cheques{monto metodo_pago}
          monto_vales_despensa{monto metodo_pago}
        }
        credito
        abono_minimo
        saldo_credito_pendiente
        credito_pagado
        descuento_general_activo
        descuento_general{ 
          cantidad_descontado
          porciento
          precio_con_descuento
        }
        id_caja
        fecha_de_vencimiento_credito
        dias_de_credito_venta
        empresa
        sucursal
        usuario
        cliente{
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
          credito_disponible
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
          banco
          numero_cuenta
          empresa {
            _id
            nombre_empresa
            correo_empresa
            nombre_dueno
            telefono_dueno
            sucursales_activas
            limite_sucursales
          }
          sucursal {
            _id
            nombre_sucursal
            descripcion
          }
          monedero_electronico
          fecha_nacimiento
          fecha_registro
          eliminado
        }
        year_registro
        numero_semana_year
        numero_mes_year
        fecha_registro
        forma_pago
        metodo_pago
        tipo_emision
        fecha_venta
        turno
      }

      productos_base {
        _id
        id_venta
        id_producto
        forma_pago
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
        subtotal_antes_de_impuestos
        precio_actual_object{
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
        granel_producto{
          granel
          valor
        }
        precio
        precio_a_vender
        precio_actual_producto
        descuento_activo
        default
      }

      empresa
      sucursal
      
      cliente{
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
        direccion{
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
        fecha_nacimiento
        fecha_registro
        eliminado
        banco
        numero_cuenta
        empresa {
          _id
          nombre_empresa
          correo_empresa
          nombre_dueno
          telefono_dueno
          sucursales_activas
          limite_sucursales
        }
        sucursal {
          _id
          nombre_sucursal
          descripcion
        }
        monedero_electronico
        credito_disponible
      } 

      productos {
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
          inventario {
            inventario_maximo
            inventario_minimo
            unidad_de_inventario
            codigo_unidad
          }
          precio_de_compra {
            ieps
            iva
            precio_con_impuesto
            precio_sin_impuesto
          }
          unidad_de_compra {
            cantidad
            precio_unitario_con_impuesto
            precio_unitario_sin_impuesto
            unidad
          }
        }
        medidas_producto {
          _id
          cantidad
          almacen
          descuento_activo
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
          codigo_barras
          color {
            _id
            nombre
            hex
          }
          existencia
          medida {
            _id
            talla
            tipo
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
        existencia_almacenes {
          _id {
            producto
            almacen {
              _id
              nombre_almacen
            }
          }
          unidad_inventario
          cantidad_existente
          unidad_maxima
          cantidad_existente_maxima
        }
        empresa
        sucursal
      }

      puntos_totales_venta
      usuario
      caja
      credito
      forma_pago
      
      montos_en_caja {
        monto_efectivo{monto metodo_pago}
        monto_tarjeta_debito{monto metodo_pago}
        monto_tarjeta_credito{monto metodo_pago}
        monto_creditos{monto metodo_pago}
        monto_monedero{monto metodo_pago}
        monto_transferencia{monto metodo_pago}
        monto_cheques{monto metodo_pago}
        monto_vales_despensa{monto metodo_pago}
      }
    }
  }
}
`;