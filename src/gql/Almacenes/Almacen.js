import { gql } from "@apollo/client";

export const REGISTRO_ALMACEN = gql`
  mutation CrearAlmacen($input: CrearAlmacen, $id: ID!, $empresa: ID!) {
    crearAlmacen(input: $input, id: $id, empresa: $empresa) {
      _id
    }
  }
`;

export const OBTENER_ALMACENES = gql`
  query obtenerAlmacenes($id: ID!) {
    obtenerAlmacenes(id: $id) {
      _id
      nombre_almacen
      id_usuario_encargado {
        _id
        nombre
      }
      id_sucursal {
        _id
        nombre_sucursal
        descripcion
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
      default_almacen
    }
  }
`;

export const ACTUALIZAR_ALMACEN = gql`
  mutation ActualizarAlmacen($input: EditarAlmacen, $id: ID!) {
    actualizarAlmacen(input: $input, id: $id) {
      message
    }
  }
`;

export const ELIMINAR_ALMACEN = gql`
  mutation eliminarAlmacen($id: ID!) {
    eliminarAlmacen(id: $id) {
      message
    }
  }
`;

export const OBTENER_PRODUCTOS_ALMACEN = gql`
  query obtenerProductosAlmacenes(
    $input: InputProductosAlmacenes 
    $limit: Int 
    $offset: Int
  ) {
    obtenerProductosAlmacenes(
      input: $input
      limit: $limit
      offset: $offset
    ) {
      docs {
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
      totalDocs   
    }
  }
`;

export const OBTENER_CATEGORIAS = gql`
  query obtenerCategorias($empresa: ID!, $sucursal: ID!) {
    obtenerCategorias(empresa: $empresa, sucursal: $sucursal) {
      _id
      categoria
      subcategorias {
        _id
        subcategoria
      }
    }
  }
`;

export const REALIZAR_TRASPASO = gql`
  mutation CrearTraspaso(
    $input: CrearTraspasoInput
    $usuario: ID!
    $empresa: ID!
  ) {
    crearTraspaso(input: $input, usuario: $usuario, empresa: $empresa) {
      message
      resp
    }
  }
`;

export const OBTENER_PRODUCTOS_EMPRESA = gql`
  query obtenerProductosPorEmpresa($empresa: ID!, $filtro: String, $limit: Int, 
    $offset: Int) {
    obtenerProductosPorEmpresa(empresa: $empresa, filtro: $filtro,  limit: $limit
      offset: $offset) {
      docs {
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
        precio_plazos {
          precio_cajas {
            plazo
            unidad
            precio
          }
          precio_piezas {
            plazo
            unidad
            precio
          }
          precio_costales {
            plazo
            unidad
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
            unidad_mayoreo
            utilidad
            ieps_precio
            iva_precio
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
        sucursal
        usuario
        empresa
      },
      totalDocs  
    }
  }
`;

export const OBTENER_TRASPASOS = gql`
  query obtenerTraspasos(
    $input: ConsultaTraspasosInput
    $limit: Int
    $offset: Int
  ) { 
    obtenerTraspasos(input: $input, limit: $limit, offset: $offset) {
      docs {
        _id
        cantidad
        unidad
        id_traspaso {
          concepto_traspaso {
            nombre_concepto
          }
          fecha_registro
          almacen_origen {
            _id
            nombre_almacen
          }
          almacen_destino {
            _id
            nombre_almacen
          }
        }
        producto {
          datos_generales {
            nombre_comercial
          }
        }
      }
      totalDocs
    }
  }
`;
