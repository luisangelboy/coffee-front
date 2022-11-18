import { gql } from '@apollo/client';

export const OBTENER_SUCURSALES = gql`
    query ObtenerSucursalesEmpresa($id: ID!){
        obtenerSucursalesEmpresa(id: $id){
            _id
            nombre_sucursal
            descripcion
            usuario_sucursal
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
            cuenta_sucursal {
                efectivo
            }         
        }
    }
`
export const OBTENER_DATOS_SUCURSAL = gql`
    query obtenerDatosSucursal($id: ID!){
        obtenerDatosSucursal(id: $id){
            _id
            nombre_sucursal
            descripcion
            usuario_sucursal
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
            cuenta_sucursal {
                efectivo
            }         
        }
    }
`
export const ACTUALIZAR_SUCURSAL = gql`
  mutation editarSucursal($id: ID!, $input: EditarSucursal) {
    editarSucursal(id: $id, input: $input) {
         _id
            nombre_sucursal
            descripcion
            usuario_sucursal
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
            cuenta_sucursal {
                efectivo
            }         
        }
    }
`

export const CREAR_MOVIMIENTO_CUENTA = gql`
    mutation CrearMovimientoCuenta($input: CrearMovimientoCuentaInput, $empresa: ID!, $sucursal: ID!, $tipo: Boolean){
        crearMovimientoCuenta(input: $input, empresa: $empresa, sucursal: $sucursal, tipo: $tipo){
            message
        }
    }
`;

export const OBTENER_HISTORIAL_CUENTAS = gql`
    query ObtenerHistorialCuenta($empresa: ID!, $sucursal: ID!, $input: ObtenerHistorialCuenta, $tipo: Boolean, $limit: Int, $offset: Int){
        obtenerHistorialCuenta(empresa: $empresa, sucursal: $sucursal, input: $input, tipo: $tipo, limit: $limit, offset: $offset){
            saldo_en_caja
            totalDocs
            docs {
                tipo_movimiento
                id_usuario
                numero_caja
                id_Caja
                numero_usuario_creador
                nombre_usuario_creador
                horario_turno
                concepto
                comentarios
                montos_en_caja { 
                    monto_efectivo{
                        monto 
                    }
                }
                fecha_movimiento{
                    completa
                }
               
                empresa
                sucursal 
            }            
        }
    }
`;