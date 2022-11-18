import {gql} from "@apollo/client";

export const CREAR_COTIZACION = gql `
  mutation crearCotizacion(
    $input: CrearVentasInput!
    $empresa: ID!
    $sucursal: ID!
    $usuario: ID!
    $caja: ID!
  ) {
    crearCotizacion(
      input: $input
      empresa: $empresa
      sucursal: $sucursal
      usuario: $usuario
      caja: $caja
    ) {
      message
    }
  }
`;

export const CONSULTAR_COTIZACIONES = gql `
  query obtenerCotizaciones($empresa: ID!, $sucursal: ID!) {
    obtenerCotizaciones(empresa: $empresa, sucursal: $sucursal) {
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
      credito
      descuento_general {
        cantidad_descontado
        porciento
        precio_con_descuento
      }
      descuento_general_activo
      dias_de_credito_venta
      fecha_de_vencimiento_credito
      fecha_vencimiento_cotizacion
      cliente {
        _id
        numero_cliente
        clave_cliente
        nombre_cliente
        rfc
        telefono
        celular
        email
        razon_social
      }
      productos {
        _id
         inventario_general {
            cantidad_existente
            unidad_inventario
            codigo_unidad
            cantidad_existente_maxima
            unidad_maxima
            id_almacen_general
          }
        iva_total_producto
        ieps_total_producto
        impuestos_total_producto
        subtotal_total_producto
        total_total_producto  
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
           
          }
          imagenes {
            url_imagen
            location_imagen
            key_imagen
            extencion_imagen
          }
        
         
          
         
          
        }
        concepto
        cantidad
        medida {
          _id
          talla
          tipo
        }
        color {
          _id
          nombre
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
      id_caja{
        _id
        numero_caja
        activa
      }
      usuario{
        _id
        numero_usuario
        nombre
      }
      year_registro
      numero_semana_year
      numero_mes_year
      fecha_registro
  
    }
  }
`;