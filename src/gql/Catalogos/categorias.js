import { gql } from '@apollo/client';
 
export const CREAR_CATEGORIA = gql`
	mutation crearCategoria($input: CrearCategoriasInput) {
		crearCategoria(input: $input) {
			_id
			categoria
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
export const CREAR_SUBCATEGORIA = gql`
	mutation crearSubcategoria($idCategoria: ID!, $input: CrearSubcategoriasInput, $empresa: ID!, $sucursal: ID!) {
		crearSubcategoria(idCategoria: $idCategoria, input: $input, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;

export const ACTUALIZAR_CATEGORIA = gql`
	mutation actualizarCategoria($idCategoria: ID!, $input: ActualizarCategoriasInput, $empresa: ID!, $sucursal: ID!) {
		actualizarCategoria(idCategoria: $idCategoria, input: $input, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;
export const ACTUALIZAR_SUBCATEGORIA = gql`
	mutation actualizarSubcategoria($idCategoria: ID!, $idSubcategoria: ID!, $input: ActualizarSubcategoriasInput, $empresa: ID!, $sucursal: ID!) {
		actualizarSubcategoria(idCategoria: $idCategoria, idSubcategoria: $idSubcategoria, input: $input, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;

export const OBTENER_CATEGORIAS = gql`
	query obtenerCategorias($empresa: ID!, $sucursal: ID!) {
		obtenerCategorias(empresa: $empresa, sucursal: $sucursal) {
			_id
			categoria
			subcategorias {
				_id
				subcategoria
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
export const ELIMINAR_CATEGORIA = gql`
	mutation eliminarCategoria($idCategoria: ID!,$empresa: ID!, $sucursal: ID!) {
		eliminarCategoria(idCategoria: $idCategoria, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`; 

export const ELIMINAR_SUBCATEGORIA = gql`
	mutation eliminarSubcategoria($idCategoria: ID!, $idSubcategoria: ID!, $empresa: ID!, $sucursal: ID!) {
		eliminarSubcategoria(idCategoria: $idCategoria, idSubcategoria: $idSubcategoria, empresa: $empresa, sucursal: $sucursal) {
			message
		}
	}
`;