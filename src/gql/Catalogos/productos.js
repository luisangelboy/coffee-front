import { gql } from "@apollo/client";

export const OBTENER_CONSULTAS = gql`
  query obtenerConsultasProducto($empresa: ID!, $sucursal: ID!) {
    obtenerConsultasProducto(empresa: $empresa, sucursal: $sucursal) {
      categorias {
        _id
        categoria
        subcategorias {
          _id
          subcategoria
        }
      }
      departamentos {
        _id
        nombre_departamentos
      }
      marcas {
        _id
        nombre_marca
      }
      colores {
        _id
        nombre
        hex
      }
      tallas {
        _id
        talla
        tipo
      }
      calzados {
        _id
        talla
        tipo
      }
      almacenes {
        _id
        nombre_almacen
      }
      centro_costos {
        _id
        cuenta
        subcuentas {
          _id
          subcuenta
        }
      }
      codigos {
        _id
        Name
        Value
      }
    }
  }
`;

export const CREAR_PRODUCTO = gql`
  mutation crearProducto($input: CrearProductoInput) {
    crearProducto(input: $input) {
      message
    }
  }
`;

export const OBTENER_PRODUCTOS = gql`
  query obtenerProductos(
    $empresa: ID!
    $sucursal: ID!
    $filtro: String
    $almacen: ID
    $existencias: Boolean
    $limit: Int
    $offset: Int
  ) {
    obtenerProductos(
      empresa: $empresa
      sucursal: $sucursal
      filtro: $filtro
      almacen: $almacen
      existencias: $existencias
      limit: $limit
      offset: $offset
    ) {
      docs {
        _id
        centro_de_costos {
          id_cuenta
          cuenta
          id_subcuenta
          subcuenta
        }
        unidades_de_venta {
          _id
          precio
          cantidad
          unidad
          codigo_unidad
          unidad_principal
          codigo_barras
          id_producto
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
        empresa
        imagenes {
          location_imagen
          extencion_imagen
          url_imagen
          key_imagen
        }
        precio_plazos {
          precio_cajas {
            plazo
            unidad
            precio
            codigo_unidad
          }
          precio_piezas {
            plazo
            unidad
            precio
            codigo_unidad
          }
          precio_costales {
            plazo
            unidad
            codigo_unidad
            precio
          }
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
          inventario {
            inventario_minimo
            inventario_maximo
            unidad_de_inventario
            codigo_unidad
          }
          granel
        }
        medidas_producto {
          _id
          cantidad
          codigo_unidad
          unidad
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
        medidas_registradas
        sucursal
        usuario
      }
      totalDocs
    }
  }
`;

export const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ActualizarProductoInput, $empresa:ID!, $sucursal:ID!) {
    actualizarProducto(id: $id, input: $input, empresa: $empresa, sucursal:$sucursal ) {
      message
    }
  }
`;

export const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!, $empresa:ID!, $sucursal:ID!) {
    eliminarProducto(id: $id, empresa: $empresa, sucursal:$sucursal) {
      message
    }
  }
`;

export const PRODUCTOS_ELIMINADOS = gql`
  query obtenerProductosInactivos($empresa: ID!, $sucursal: ID!) {
    obtenerProductosInactivos(empresa: $empresa, sucursal: $sucursal) {
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
            unidad_mayoreo
            utilidad
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
      }
      cantidad_existente
      unidad_de_inventario
      id_almacen
      eliminado
      empresa
      sucursal
    }
  }
`;

export const ACTIVAR_PRODUCTOS = gql`
  mutation activarProducto($id: ID!, $empresa:ID!, $sucursal:ID!) {
    activarProducto(id: $id, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const CREAR_PRODUCTO_RAPIDO = gql`
  mutation crearProductoRapido($input: CrearProductoRapidoInput) {
    crearProductoRapido(input: $input) {
      message
    }
  }
`;
