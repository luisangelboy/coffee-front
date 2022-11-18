import { gql } from "@apollo/client";

export const REGISTRAR_TURNOS = gql`
  mutation crearRegistroDeTurno(
    $input: AbrirCerrarTurnoInput
    $activa: Boolean
  ) {
    crearRegistroDeTurno(input: $input, activa: $activa) {
      _id
      horario_en_turno
      token_turno_user
      concepto
      numero_caja
      id_caja
      comentarios
      hora_entrada {
        hora
        minutos
        segundos
      }
      hora_salida {
        hora
        minutos
        segundos
      }
      fecha_entrada {
        year
        mes
        dia
        no_semana_year
        no_dia_year
      }
      fecha_salida {
        year
        mes
        dia
        no_semana_year
        no_dia_year
      }
      fecha_movimiento
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
      usuario_en_turno {
        numero_usuario
        nombre
      }
      id_usuario
      empresa
      sucursal
    }
  }
`;
export const UP_TURNO = gql`
  mutation subirTurnoCloud(
    $input: AbrirCerrarTurnoInput
    $activa: Boolean,
    $isOnline: Boolean
  ) {
    subirTurnoCloud(input: $input, activa: $activa, isOnline: $isOnline) {
      message
      done
    }
  }
`;
export const OBTENER_HISTORIAL_TURNOS = gql`
  query obtenerFiltroTurnos(
    $input: HistorialTurnosInput
    $empresa: ID!
    $sucursal: ID!
	$limit: Int
	$offset: Int
  ) {
    obtenerFiltroTurnos(input: $input, empresa: $empresa, sucursal: $sucursal, limit: $limit, offset: $offset) {
      docs {
        horario_en_turno
        concepto
        numero_caja
        id_caja
        comentarios
        hora_entrada {
          hora
          minutos
          segundos
          completa
        }
        hora_salida {
          hora
          minutos
          segundos
          completa
        }
        fecha_entrada {
          year
          mes
          dia
          no_semana_year
          no_dia_year
          completa
        }
        fecha_salida {
          year
          mes
          dia
          no_semana_year
          no_dia_year
          completa
        }
        fecha_movimiento
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
        usuario_en_turno {
          numero_usuario
          nombre
        }
        empresa
        sucursal
      }
      totalDocs
    }
  }
`;
