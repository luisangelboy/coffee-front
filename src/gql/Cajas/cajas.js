import { gql } from "@apollo/client";

export const CREAR_CAJA = gql`
  mutation CrearCaja($input: CrearCajasInput!, $empresa: ID!, $sucursal: ID!) {
    crearCaja(input: $input, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const OBTENER_CAJAS = gql`
  query ObtenerCajasSucursales($empresa: ID!, $sucursal: ID!) {
    obtenerCajasSucursal(empresa: $empresa, sucursal: $sucursal) {
      _id
      numero_caja
      activa
      usuario_creador {
        numero_usuario
        nombre
        email
      }
      cantidad_efectivo_actual
      usuario_en_caja {
        _id
        numero_usuario
        nombre
        email
      }
      principal
    }
  }
`;

export const CREAR_HISTORIAL_CAJA = gql`
  mutation CrearHistorialCaja(
    $input: CrearHistorialCajasInput!
    $empresa: ID!
    $sucursal: ID!
  ) {
    crearHistorialCaja(input: $input, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const OBTENER_HISTORIAL_CAJA = gql`
  query ObtenerHistorialCaja(
    $input: HistorialCajasInput
    $id_Caja: ID!
    $empresa: ID!
    $sucursal: ID!
    $limit: Int
    $offset: Int
  ) {
    obtenerHistorialCaja(
      input: $input
      id_Caja: $id_Caja
      empresa: $empresa
      sucursal: $sucursal
      limit: $limit
      offset: $offset
    ) {
      docs {
        tipo_movimiento
        concepto
        horario_turno
        numero_caja
        numero_usuario_creador
        nombre_usuario_creador
        hora_moviento {
          hora
          minutos
          segundos
          completa
        }
        fecha_movimiento {
          year
          mes
          dia
          no_dia_year
          no_semana_year
          completa
        }
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
      totalDocs
    }
  }
`;

export const ELIMINAR_CAJA = gql`
  mutation eliminarCaja($id: ID!) {
    eliminarCaja(id: $id) {
      message
    }
  }
`;

export const ACTUALIZAR_CAJA = gql`
  mutation ActualizarCaja($input: EditarCaja, $id: ID!) {
    actualizarCaja(id: $id, input: $input) {
      _id
      numero_caja
      activa
    }
  }
`;

export const OBTENER_PRE_CORTE_CAJA = gql`
  query ObtenerPreCorteCaja(
    $empresa: ID!
    $sucursal: ID!
    $input: PreCortesDeCajaInput
    $cajaPrincipal: Boolean
  ) {
    obtenerPreCorteCaja(
      empresa: $empresa
      sucursal: $sucursal
      input: $input
      cajaPrincipal: $cajaPrincipal
    ) {
      monto_efectivo_precorte
    }
  }
`;

export const OBTENER_CORTES_CAJA = gql`
  query ObtenerCortesDeCaja(
    $empresa: ID!
    $sucursal: ID!
    $input: FiltroCorteDeCajaInput
    $limit: Int
    $offset: Int
  ) {
    obtenerCortesDeCaja(
      empresa: $empresa
      sucursal: $sucursal
      input: $input
      limit: $limit
      offset: $offset
    ) {
      docs {
        concepto
        token_turno_user
        numero_caja
        horario_en_turno
        id_caja
        hora_salida {
          completa
        }
        fecha_salida {
          completa
        }
        fecha_movimiento
        usuario_en_turno {
          nombre
          telefono
          email
          numero_usuario
        }
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
        sucursal {
          nombre_sucursal
        }
      }
      totalDocs
    }
  }
`;

export const OBTENER_CORTE_CAJA = gql`
  query ObtenerCorteCaja(
    $empresa: ID!
    $sucursal: ID!
    $input: CorteDeCajaInput
  ) {
    obtenerCorteCaja(empresa: $empresa, sucursal: $sucursal, input: $input) {
      montos_en_sistema {
        monto_efectivo
        monto_tarjeta_debito
        monto_tarjeta_credito
        monto_creditos
        monto_monedero
        monto_transferencia
        monto_cheques
        monto_vales_despensa
      }
      fecha_inicio
      fecha_fin
    }
  }
`;
