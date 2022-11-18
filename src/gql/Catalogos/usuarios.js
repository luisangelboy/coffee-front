import { gql } from "@apollo/client";

export const VERIFY_USER = gql`
  mutation verifyUserName($username: String) {
    verifyUserName(username: $username) {
      message
    }
  }
`;

export const CREAR_USUARIO = gql`
  mutation crearUsuario($input: CrearUsuarioInput) {
    crearUsuario(input: $input) {
      _id
      numero_usuario
      nombre
      telefono
      celular
      email
      turno_en_caja_activo
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
      estado_usuario
      empresa {
        _id
        nombre_empresa
        correo_empresa
        nombre_dueno
        telefono_dueno
      }
      sucursal {
        _id
        nombre_sucursal
        descripcion
      }
      accesos {
        mi_empresa {
          datos_empresa {
            ver
            agregar
            editar
            eliminar
          }
          informacion_fiscal {
            ver
            agregar
            editar
            eliminar
          }
        }
        compras {
          abrir_compra {
            ver
            agregar
            editar
            eliminar
          }
          compras_realizadas {
            ver
            agregar
            editar
            eliminar
          }
          compras_espera {
            ver
            agregar
            editar
            eliminar
          }
        }
        tesoreria {
          cuentas_empresa {
            ver
            agregar
            editar
            eliminar
          }
          egresos {
            ver
            agregar
            editar
            eliminar
          }
          abonos_proveedores {
            ver
            agregar
            editar
            eliminar
          }
          abonos_clientes {
            ver
            agregar
            editar
            eliminar
          }
          caja_principal {
            ver
            agregar
            editar
            eliminar
          }
        }
        reportes {
          reporte_historial_cajas {
            ver
            agregar
            editar
            eliminar
          }
          reporte_turnos {
            ver
            agregar
            editar
            eliminar
          }
          reporte_compras {
            ver
            agregar
            editar
            eliminar
          }
          reporte_ventas {
            ver
            agregar
            editar
            eliminar
          }
          rerporte_almacen {
            ver
            agregar
            editar
            eliminar
          }
          reporte_corte_caja {
            ver
            agregar
            editar
            eliminar
          }
          reporte_tesoreria {
            ver
            agregar
            editar
            eliminar
          }
        }
        ventas {
          cancelar_venta {
            ver
            agregar
            editar
            eliminar
          }
          precios_productos {
            ver
            agregar
            editar
            eliminar
          }
          pre_corte {
            ver
            agregar
            editar
            eliminar
          }
          cotizaciones {
            ver
            agregar
            editar
            eliminar
          }
          administrador {
            ver
            agregar
            editar
            eliminar
          }
          eliminar_ventas {
            ver
            agregar
            editar
            eliminar
          }
          producto_rapido {
            ver
            agregar
            editar
            eliminar
          }
        }
        facturacion {
          generar_cdfi {
            ver
            agregar
            editar
            eliminar
          }
          cdfi_realizados {
            ver
            agregar
            editar
            eliminar
          }
          registro_series_cdfi {
            ver
            agregar
            editar
            eliminar
          }
        }
        almacenes {
          almacen {
            ver
            agregar
            editar
            eliminar
          }
          traspasos {
            ver
            agregar
            editar
            eliminar
          }
          inventario_almacen {
            ver
            agregar
            editar
            eliminar
          }
        }
        catalogos {
          clientes {
            ver
            agregar
            editar
            eliminar
          }
          usuarios {
            ver
            agregar
            editar
            eliminar
          }
          productos {
            ver
            agregar
            editar
            eliminar
          }
          marcas {
            ver
            agregar
            editar
            eliminar
          }
          contabilidad {
            ver
            agregar
            editar
            eliminar
          }
          provedores {
            ver
            agregar
            editar
            eliminar
          }
          cajas {
            ver
            agregar
            editar
            eliminar
          }
          departamentos {
            ver
            agregar
            editar
            eliminar
          }
          centro_costos {
            ver
            agregar
            editar
            eliminar
          }
          conceptos_almacen {
            ver
            agregar
            editar
            eliminar
          }
          categorias {
            ver
            agregar
            editar
            eliminar
          }
          colores {
            ver
            agregar
            editar
            eliminar
          }
          colores {
            ver
            agregar
            editar
            eliminar
          }
          tallas_numeros {
            ver
            agregar
            editar
            eliminar
          }
        }
      }
    }
  }
`;

export const OBTENER_USUARIOS = gql`
  query obtenerUsuarios(
    $empresa: String!
    $sucursal: String
    $filtro: String
    $eliminado: Boolean
  ) {
    obtenerUsuarios(empresa: $empresa, sucursal: $sucursal, filtro: $filtro, eliminado: $eliminado) {
      _id
      numero_usuario
      nombre
      telefono
      celular
      turno_en_caja_activo
      email
      username_login
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
      estado_usuario
      empresa {
        _id
        nombre_empresa
        correo_empresa
        nombre_dueno
        telefono_dueno
      }
      sucursal {
        _id
        nombre_sucursal
        descripcion
      }
      accesos {
        mi_empresa {
          datos_empresa {
            ver
            agregar
            editar
            eliminar
          }
          informacion_fiscal {
            ver
            agregar
            editar
            eliminar
          }
        }
        compras {
          abrir_compra {
            ver
            agregar
            editar
            eliminar
          }
          compras_realizadas {
            ver
            agregar
            editar
            eliminar
          }
          compras_espera {
            ver
            agregar
            editar
            eliminar
          }
        }
        tesoreria {
          cuentas_empresa {
            ver
            agregar
            editar
            eliminar
          }
          egresos {
            ver
            agregar
            editar
            eliminar
          }
          abonos_proveedores {
            ver
            agregar
            editar
            eliminar
          }
          abonos_clientes {
            ver
            agregar
            editar
            eliminar
          }
          caja_principal {
            ver
            agregar
            editar
            eliminar
          }
        }
        reportes {
          reporte_historial_cajas {
            ver
            agregar
            editar
            eliminar
          }
          reporte_turnos {
            ver
            agregar
            editar
            eliminar
          }
          reporte_compras {
            ver
            agregar
            editar
            eliminar
          }
          reporte_ventas {
            ver
            agregar
            editar
            eliminar
          }
          rerporte_almacen {
            ver
            agregar
            editar
            eliminar
          }
          reporte_corte_caja {
            ver
            agregar
            editar
            eliminar
          }
          reporte_tesoreria {
            ver
            agregar
            editar
            eliminar
          }
        }
        ventas {
          cancelar_venta {
            ver
            agregar
            editar
            eliminar
          }
          precios_productos {
            ver
            agregar
            editar
            eliminar
          }
          pre_corte {
            ver
            agregar
            editar
            eliminar
          }
          cotizaciones {
            ver
            agregar
            editar
            eliminar
          }
          administrador {
            ver
            agregar
            editar
            eliminar
          }
          eliminar_ventas {
            ver
            agregar
            editar
            eliminar
          }
          producto_rapido {
            ver
            agregar
            editar
            eliminar
          }
        }
        almacenes {
          almacen {
            ver
            agregar
            editar
            eliminar
          }
          traspasos {
            ver
            agregar
            editar
            eliminar
          }
          inventario_almacen {
            ver
            agregar
            editar
            eliminar
          }
        }
        facturacion {
          generar_cdfi {
            ver
            agregar
            editar
            eliminar
          }
          cdfi_realizados {
            ver
            agregar
            editar
            eliminar
          }
          registro_series_cdfi {
            ver
            agregar
            editar
            eliminar
          }
        }
        catalogos {
          clientes {
            ver
            agregar
            editar
            eliminar
          }
          usuarios {
            ver
            agregar
            editar
            eliminar
          }
          productos {
            ver
            agregar
            editar
            eliminar
          }
          marcas {
            ver
            agregar
            editar
            eliminar
          }
          contabilidad {
            ver
            agregar
            editar
            eliminar
          }
          provedores {
            ver
            agregar
            editar
            eliminar
          }
          cajas {
            ver
            agregar
            editar
            eliminar
          }
          departamentos {
            ver
            agregar
            editar
            eliminar
          }
          centro_costos {
            ver
            agregar
            editar
            eliminar
          }
          conceptos_almacen {
            ver
            agregar
            editar
            eliminar
          }
          categorias {
            ver
            agregar
            editar
            eliminar
          }
          colores {
            ver
            agregar
            editar
            eliminar
          }
          tallas_numeros {
            ver
            agregar
            editar
            eliminar
          }
        }
      }
    }
  }
`;

export const ACTUALIZAR_USUARIO = gql`
  mutation actualizarUsuario( $id: ID!, $input: ActualizarUsuarioInput, $empresa: ID!, $sucursal: ID!) {
    actualizarUsuario(id: $id, input: $input, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const LOGEAR_USUARIO = gql`
  mutation logearUsuario($input: LogearUsuarioInput) {
    logearUsuario(input: $input) {
      token
    }
  }
`;

export const LOGEAR_USUARIO_ACCESOS = gql`
  query ObtenerAccesoPermiso($input: ObtenerAccesoPermisosInput) {
    obtenerAccesoPermiso(input: $input) {
      permiso_concedido
      departamento
      subDepartamento
    }
  }
`;

export const AGIGNAR_PERMISOS_USUARIO = gql`
  mutation asignarAccesosUsuario($input: CrearArregloDeAccesosInput, $id: ID!) {
    asignarAccesosUsuario(id: $id, input: $input) {
      message
    }
  }
`;

export const ACTUALIZAR_BD_LOCAL = gql`
  mutation actualizarBDLocal($empresa: ID!, $sucursal: ID!) {
    actualizarBDLocal(empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;
