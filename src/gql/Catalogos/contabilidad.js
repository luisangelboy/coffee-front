import { gql } from '@apollo/client';

export const OBTENER_CONTABILIDAD = gql`
    query obtenerContabilidad($empresa: ID!){
        obtenerContabilidad(empresa: $empresa){
                _id
            nombre_servicio
            empresa{
                _id
                nombre_empresa
            }
                sucursal{
                _id
                nombre_sucursal
            }
        }
    }
`;

export const REGISTRAR_CONTABILIDAD = gql`
    mutation CrearContabilidad($input: ContabilidadInput, $empresa: ID!, $sucursal: ID!, $usuario: ID!){
        crearContabilidad(input:$input,empresa:$empresa,sucursal:$sucursal, usuario:$usuario){
            message
        }
    }
`;

export const ACTUALIZAR_CONTABILIDAD = gql`
    mutation ActualizarContabilidad($input: ContabilidadInput, $id: ID!){
        actualzarContabilidad(input: $input, id: $id){
            message
        }
    }
`;

export const ELIMINAR_CONTABILIDAD = gql`
    mutation EliminarContabilidad($id: ID!){
        eliminarContabilidad(id: $id){
            message
        }
    }
`;