import { gql } from "@apollo/client";

export const CREAR_FACTURA = gql`
  mutation crearFactura($input: CrearFacturaInput) {
    crearFactura(input: $input) {
      message
      success
      pdf
      xml
    }
  }
`;

export const CREAR_SERIE = gql`
  mutation crearSerieCFDI($input: CrearSerieCfdiInput!) {
    crearSerieCFDI(input: $input) {
      message
      success
    }
  }
`;

export const ACTUALIZAR_DEFAULT_SERIE = gql`
  mutation modificarDefaultSerie($id: ID!, $empresa: ID!, $sucursal: ID!) {
    modificarDefaultSerie(id: $id, empresa: $empresa, sucursal: $sucursal) {
      message
    }
  }
`;

export const ELIMINAR_SERIE = gql`
  mutation eliminarSerie($id: ID!) {
    eliminarSerie(id: $id) {
      message
    }
  }
`;

export const OBTENER_SERIES = gql`
  query obtenerSeriesCdfi($empresa: ID!, $sucursal: ID!) {
    obtenerSeriesCdfi(empresa: $empresa, sucursal: $sucursal) {
      message
      success
      seriesCfdi {
        _id
        serie
        folio
        default
      }
    }
  }
`;

export const CREAR_SELLO_CFDI = gql`
  mutation crearCSDS($input: CrearCSDSInput!) {
    crearCSDS(input: $input) {
      message
      success
    }
  }
`;

export const ELIMINAR_SELLO_CFDI = gql`
  mutation eliminarCSD($rfc: String, $empresa: ID!) {
    eliminarCSD(rfc: $rfc, empresa: $empresa) {
      message
    }
  }
`;

export const CONSULTA_CATALOGOS_SAT_API = gql`
  query obtenerCatalogosSAT($input: CrearFacturaInput!) {
    obtenerCatalogosSAT(input: $input) {
      message
      currencies {
        Decimals
        PrecisionRate
        Name
        Value
      }
      paymentForms {
        Name
        Value
      }
      paymentMethods {
        Name
        Value
      }
      fiscalRegimens {
        Natural
        Moral
        Name
        Value
      }
      cfdiTypes {
        NameId
        Name
        Value
      }
    }
  }
`;

export const CONSULTA_PRODUCTOS_SERVICIOS_SAT_API = gql`
  query obtenerProductosOServicios($input: CrearFacturaInput!) {
    obtenerProductosOServicios(input: $input) {
      message
      productosOServicios {
        DangerousMaterial
        Complement
        Name
        Value
      }
    }
  }
`;

export const CONSULTA_POSTAL_CODES_SAT_API = gql`
  query obtenerCodigoPostal($input: CrearFacturaInput!) {
    obtenerCodigoPostal(input: $input) {
      message
      codigoPostal {
        StateCode
        MunicipalityCode
        LocationCode
        Name
        Value
      }
    }
  }
`;

export const CONSULTA_CFDIU_USES_SAT_API = gql`
  query obtenerCfdiUses($input: CrearFacturaInput!) {
    obtenerCfdiUses(input: $input) {
      message
      cfdiUses {
        message
        Natural
        Moral
        Name
        Value
      }
    }
  }
`;

export const OBTENER_FACTURAS_REALIZADAS = gql`
  query obtenerFacturas(
    $empresa: ID!
    $sucursal: ID!
    $filtros: filtrosFactura
    $limit: Int
    $offset: Int
  ) {
    obtenerFacturas(
      empresa: $empresa
      sucursal: $sucursal
      filtros: $filtros
      limit: $limit
      offset: $offset
    ) {
      docs {
        id_cfdi
        serie
        currency
        expedition_place
        folio
        cfdi_type
        payment_form
        payment_method
        logo_url
        date
        issuer {
          FiscalRegime
          Rfc
          TaxName
        }
        receiver {
          Rfc
          Name
          CfdiUse
        }
        items {
          ProductCode
          IdentificationNumber
          Description
          Unit
          UnitCode
          UnitPrice
          Quantity
          Subtotal
          Discount
          Total
        }
        taxes {
          Total
          Name
          Rate
          Type
        }
        complement {
          TaxStamp {
            Uuid
            Date
            CdfiSign
            SatCertNumber
            SatSign
            RfcProvCertif
          }
        }
        original_string
        sub_total
        total
        discount
        fecha_registro
        id_venta
        folio_venta
        complementos {
          id_cfdi
          serie
          currency
          expedition_place
          folio
          cfdi_type
          payment_form
          payment_method
          logo_url
          date
          issuer {
            FiscalRegime
            Rfc
            TaxName
          }
          receiver {
            Rfc
            Name
            CfdiUse
          }
          items {
            ProductCode
            IdentificationNumber
            Description
            Unit
            UnitCode
            UnitPrice
            Quantity
            Subtotal
            Discount
            Total
          }
          taxes {
            Total
            Name
            Rate
            Type
          }
          complement {
            TaxStamp {
              Uuid
              Date
              CdfiSign
              SatCertNumber
              SatSign
              RfcProvCertif
            }
            Payments {
              _id
              RelatedDocuments {
                _id
                Uuid
                Folio
                Currency
                PaymentMethod
                PartialityNumber
                PreviousBalanceAmount
                AmountPaid
                ImpSaldoInsoluto
              }
              Date
              PaymentForm
              Currency
              Amount
              ExpectedPaid
            }
          }
          original_string
          sub_total
          total
          discount
          fecha_registro
          id_venta
          folio_venta
        }
        id_nota
        tipo
      }
      totalDocs
    }
  }
`;

export const OBTENER_DOCUMENTO_FACTURA = gql`
  query obtenerDocumentCfdi($id: String!) {
    obtenerDocumentCfdi(id: $id) {
      htmlBase64
      pdfBase64
      xmlBase64
    }
  }
`;
