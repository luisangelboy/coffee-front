import { gql } from "@apollo/client";

export const OBTENER_MARCAS = gql`
  query ObtenerMarcas($empresa: ID!, $sucursal: ID) {
    obtenerMarcas(empresa: $empresa, sucursal: $sucursal) {
      _id
      nombre_marca
    }
  }
`;

export const REGISTRAR_MARCAS = gql`
  mutation CrearMarca($input: MarcasInput!, $empresa: ID!, $sucursal: ID!) {
    crearMarcas(input: $input, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const ACTUALIZAR_MARCAS = gql`
    mutation actualzarMarcas($input: MarcasInput, $id: ID!, $empresa:ID!, $sucursal:ID! ) {
		actualzarMarcas(id: $id, input: $input, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;

export const ELIMINAR_MARCAS = gql`
  mutation eliminarMarca($id: ID!, $empresa: ID!, $sucursal: ID!) {
    eliminarMarca(id: $id, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;
