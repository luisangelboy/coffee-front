import { gql } from '@apollo/client';

export const REGISTRAR_DESCUENTOS = gql`
	mutation CrearDescuentoUnidad($input: ObjetoDescuentoUnidadesInput!, $empresa:ID!, $sucursal:ID!){
        crearDescuentoUnidad(input: $input, empresa:$empresa, sucursal: $sucursal){
            message
        }
  }
`;

export const ACTUALIZAR_DESCUENTOS = gql`
	mutation ActualizarDescuentoUnidad($input: ObjetoDescuentoUnidadesInput!, $empresa:ID!, $sucursal:ID!){
        actualizarDescuentoUnidad(input: $input, empresa:$empresa, sucursal: $sucursal){
            message
        }
    }
`;

export const DESACTIVAR_DESCUENTOS = gql`
	mutation DesactivarDescuentoUnidad($input: ActivarDescuentoUnidades , $id: ID!, $empresa:ID!, $sucursal:ID!){
        desactivarDescuentoUnidad(input: $input, id: $id, empresa:$empresa, sucursal: $sucursal){
            message
        }
    }
`;

export const ELIMINAR_DESCUENTOS = gql`
	mutation ELiminarDescuentoUnidad( $id: ID!, $empresa:ID!, $sucursal:ID!){
        eliminarDescuentoUnidad( id: $id, empresa:$empresa, sucursal: $sucursal){
            message
        }
    }
`;