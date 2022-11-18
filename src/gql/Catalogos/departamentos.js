import { gql } from "@apollo/client";

export const OBTENER_DEPARTAMENTOS = gql`
  query ObtenerDepartamentos($empresa: ID!, $sucursal: ID!) {
    obtenerDepartamentos(empresa: $empresa, sucursal: $sucursal) {
      _id
      nombre_departamentos
      empresa {
        _id
        nombre_empresa
      }
      sucursal {
        _id
        nombre_sucursal
      }
    }
  }
`;

export const REGISTRAR_DEPARTAMENTO = gql`
  mutation CrearDepartamentos(
    $input: DepartamentosInput
    $empresa: ID!
    $sucursal: ID!
  ) {
    crearDepartamentos(input: $input, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const ACTUALIZAR_DEPARTAMENTO = gql`
	mutation ActualzarDepartamentos($input: DepartamentosInput, $id: ID!, $empresa:ID!, $sucursal:ID!){
        actualzarDepartamentos(input: $input, id: $id, empresa: $empresa, sucursal: $sucursal){
            message
        }
    }
`;

export const ELIMINAR_DEPARTAMENTO = gql`
    mutation EliminarDepartamento($id: ID!, $empresa:ID!, $sucursal:ID!){
        eliminarDepartamento(id: $id, empresa: $empresa, sucursal: $sucursal){
            message
        }
    }
	
`;
