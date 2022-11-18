import { gql } from "@apollo/client";

export const CREAR_COLOR = gql`
  mutation crearColor($input: CrearColorInput) {
    crearColor(input: $input) {
      _id
      nombre
      hex
      empresa {
        nombre_empresa
        correo_empresa
        nombre_dueno
        telefono_dueno
        sucursales_activas
        limite_sucursales
        _id
      }
    }
  }
`;

export const OBTENER_COLORES = gql`
  query obtenerColores($empresa: ID!) {
    obtenerColores(empresa: $empresa) {
      _id
      nombre
      hex
      empresa {
        nombre_empresa
        correo_empresa
        nombre_dueno
        telefono_dueno
        sucursales_activas
        limite_sucursales
        _id
      }
      sucursal {
        _id
        nombre_sucursal
        descripcion
      }
    }
  }
`;

export const ACTUALIZAR_COLOR = gql`
	mutation actualizarColor($input: ActualizarColorInput, $id: ID!, $empresa:ID!, $sucursal:ID!) {
		actualizarColor(id: $id, input: $input, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;
export const ELIMINAR_COLOR = gql`
	mutation eliminarColor($id: ID!, $empresa:ID!, $sucursal:ID!) {
		eliminarColor(id: $id, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;
