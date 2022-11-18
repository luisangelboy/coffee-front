import { gql } from "@apollo/client";

export const CREAR_COMPRA = gql`
  mutation crearCompra(
    $input: CrearCompraInput
    $empresa: ID!
    $sucursal: ID!
    $usuario: ID!
  ) {
    crearCompra(
      input: $input
      empresa: $empresa
      sucursal: $sucursal
      usuario: $usuario
    ) {
      message
    }
  }
`;

export const CREAR_COMPRA_ESPERA = gql`
  mutation crearCompraEnEspera(
    $input: CrearCompraInput
    $empresa: ID!
    $sucursal: ID!
    $usuario: ID!
  ) {
    crearCompraEnEspera(
      input: $input
      empresa: $empresa
      sucursal: $sucursal
      usuario: $usuario
    ) {
      message
    }
  }
`;

export const CANCELAR_COMPRA = gql`
  mutation cancelarCompra($empresa: ID!, $sucursal:ID!, $id_compra: ID!, $data_sesion: cancelarCompraInput){
    cancelarCompra(empresa:$empresa, sucursal:$sucursal, id_compra: $id_compra, data_sesion: $data_sesion){
      message
    }
  }
`;

export const OBTENER_COMPRAS_REALIZADAS = gql`
  query obtenerComprasRealizadas(
    $empresa: ID!
    $sucursal: ID!
    $filtro: String
    $fecha: String
    $limit: Int
    $offset: Int
  ) {
    obtenerComprasRealizadas(
      empresa: $empresa
      sucursal: $sucursal
      filtro: $filtro
      fecha: $fecha
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

export const OBTENER_COMPRAS_ESPERA = gql`
  query obtenerComprasEnEspera($empresa: ID!, $sucursal: ID!, $filtro: String, $limit: Int
    $offset: Int) {
    obtenerComprasEnEspera(
      empresa: $empresa
      sucursal: $sucursal
      filtro: $filtro
      limit: $limit
      offset: $offset
    ) {
      docs{
        _id
      en_espera
      proveedor {
        id_proveedor
        clave_cliente
        numero_cliente
        nombre_cliente
      }
      almacen {
        id_almacen
        nombre_almacen
      }
      productos {
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
            precio_de_compra {
              ieps
              iva
              precio_con_impuesto
              precio_sin_impuesto
            }
            precios_producto {
              numero_precio
              precio_neto
              precio_venta
              iva_precio
              ieps_precio
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
            }
            inventario {
              inventario_minimo
              inventario_maximo
              unidad_de_inventario
            }
            granel
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
              precio
            }
            precio_costales {
              plazo
              unidad
              precio
            }
            precio_piezas {
              plazo
              unidad
              precio
            }
          }
          empresa
          sucursal
          usuario
          unidades_de_venta {
            _id
            precio
            cantidad
            unidad
            unidad_principal
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
              unidad_mayoreo
              utilidad
              precio_general
              cantidad_unidad
              unidad_maxima
            }
          }
          presentaciones {
            _id
            almacen
            cantidad
            cantidad_nueva
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
              unidad_mayoreo
              utilidad
              precio_general
              cantidad_unidad
              unidad_maxima
            }
          }
        }
        id_producto
        cantidad
        cantidad_regalo
        unidad_regalo
        cantidad_total
        iva_total
        ieps_total
        costo
        descuento_porcentaje
        descuento_precio
        impuestos
        mantener_precio
        subtotal
        total
        subtotal_descuento
        total_descuento
      }
      impuestos
      subtotal
      total
      fecha_registro
      }
      totalDocs
    }
  }
`;

export const OBTENER_CONSULTA_GENERAL_PRODUCTO = gql`
  query obtenerConsultaGeneralCompras($empresa: ID!, $sucursal: ID!) {
    obtenerConsultaGeneralCompras(empresa: $empresa, sucursal: $sucursal) {
      productos {
        _id
        datos_generales {
          codigo_barras
          clave_alterna
          tipo_producto
          nombre_comercial
          nombre_generico
          descripcion
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
            unidad_mayoreo
            utilidad
          }
          unidad_de_compra {
            cantidad
            precio_unitario_con_impuesto
            precio_unitario_sin_impuesto
            unidad
          }
          granel
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
            precio
          }
          precio_costales {
            plazo
            unidad
            precio
          }
          precio_piezas {
            plazo
            unidad
            precio
          }
        }
        unidades_de_venta {
          _id
          precio
          cantidad
          concepto
          unidad
          unidad_principal
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
        }
        inventario_general {
          _id
          cantidad_existente
          unidad_inventario
          cantidad_existente_maxima
          unidad_maxima
        }
        medidas_producto {
          _id
          cantidad
          codigo_barras
          color {
            hex
            nombre
            _id
          }
          existencia
          medida {
            talla
            tipo
            _id
          }
          nombre_comercial
          precio
        }
        medidas_registradas
        empresa
        sucursal
        usuario
      }
      proveedores {
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
        banco
        numero_cuenta
        empresa {
          _id
        }
        sucursal {
          _id
        }
      }
      almacenes {
        _id
        nombre_almacen
        default_almacen
        id_usuario_encargado {
          _id
          numero_usuario
          nombre
          email
          imagen
          estado_usuario
        }
        id_sucursal {
          _id
          nombre_sucursal
          usuario_sucursal
        }
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
      }
    }
  }
`;

export const ELIMINAR_COMPRA_ESPERA = gql`
  mutation eliminarCompraEnEspera($id: ID!) {
    eliminarCompraEnEspera(id: $id) {
      message
    }
  }
`;
