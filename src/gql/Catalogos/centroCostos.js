import { gql } from '@apollo/client';

export const CREAR_CUENTA = gql`
	mutation crearCuenta($input: CrearCuentasInput) {
		crearCuenta(input: $input) {
			_id
			cuenta
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
		}
	}
`;
export const CREAR_SUBCUENTA= gql`
	mutation crearSubcuenta($idCuenta: ID!, $input: CrearSubcuentasInput, $empresa: ID!, $sucursal: ID!) {
		crearSubcuenta(idCuenta: $idCuenta, input: $input,  empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;

export const ACTUALIZAR_CUENTA= gql`
	mutation actualizarCuenta($idCuenta: ID!, $input: ActualizarCuentasInput, $empresa: ID!, $sucursal: ID!) {
		actualizarCuenta(idCuenta: $idCuenta, input: $input,  empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;
export const ACTUALIZAR_SUBCUENTA = gql`
	mutation actualizarSubcuenta($idCuenta: ID!, $idSubcuenta: ID!, $input: ActualizarSubcuentasInput, $empresa: ID!, $sucursal: ID!) {
		actualizarSubcuenta(idCuenta: $idCuenta, idSubcuenta: $idSubcuenta, input: $input,  empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;

export const OBTENER_CUENTAS = gql`
	query obtenerCuentas($empresa: ID!) {
		obtenerCuentas(empresa: $empresa) {
			_id
			cuenta
			subcuentas {
				_id
				subcuenta
			}
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
		}
	}
`;

export const ELIMINAR_CUENTA = gql`
	mutation eliminarCuenta($id: ID!, $empresa: ID!, $sucursal: ID!) {
		eliminarCuenta(id: $id,  empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`; 
export const ELIMINAR_SUBCUENTA = gql`
	mutation eliminarSubcuenta($idCuenta: ID!, $idSubcuenta: ID!, $empresa: ID!, $sucursal: ID!) {
		eliminarSubcuenta(idCuenta: $idCuenta, idSubcuenta: $idSubcuenta,  empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`; 