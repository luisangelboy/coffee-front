import { gql } from "@apollo/client";

export const CREAR_CODIGO_PRODUCTO = gql`
  mutation crearCodigoProducto($input: CodigoCatalogoProductoInput) {
    crearCodigoProducto(input: $input) {
      message
    }
  }
`;

export const OBTENER_CODIGOS_PRODUCTO = gql`
  query obtenerCodigosProducto($empresa: ID!, $sucursal: ID) {
    obtenerCodigosProducto(empresa: $empresa, sucursal: $sucursal) {
      _id
      Name
      Value
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

export const ELIMINAR_CODIGO_PRODUCTO = gql`
  mutation eliminarCodigoProducto($id: ID!) {
    eliminarCodigoProducto(id: $id) {
      message
    }
  }
`;
