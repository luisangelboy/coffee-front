import { gql } from "@apollo/client";
export const OBTENER_DATOS_EMPRESA = gql`
  query obtenerEmpresa($id: ID!) {
    obtenerEmpresa(id: $id) {
      _id
      nombre_empresa
      nombre_dueno
      telefono_dueno
      celular
      correo_empresa
      limite_timbres
      timbres_usados
      sello_sat
      nombre_cer
      nombre_key
      fecha_registro_sello_sat
      imagen
      nombre_fiscal
      rfc
      regimen_fiscal
      curp
      info_adicio
      valor_puntos
      direccion {
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
      direccionFiscal {
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
      datosBancarios {
        cuenta
        sucursal
        clave_banco
      }
      vender_sin_inventario
    }
  }
`;

export const ACTUALIZAR_EMPRESA = gql`
  mutation actualizarEmpresa($id: ID!, $input: EditarEmpresa) {
    actualizarEmpresa(id: $id, input: $input) {
      _id
      nombre_empresa
      nombre_dueno
      telefono_dueno
      celular
      correo_empresa
      limite_timbres
      timbres_usados
      sello_sat
      nombre_cer
      nombre_key
      imagen
      nombre_fiscal
      rfc
      regimen_fiscal
      curp
      info_adicio
      valor_puntos
      direccion {
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
      direccionFiscal {
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
      datosBancarios {
        cuenta
        sucursal
        clave_banco
      }
    }
  }
`;
