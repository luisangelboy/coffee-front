const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

export const factura_initial_state = {
    serie: "",
    currency: "MXN",
    expedition_place: "",
    folio: "",
    cfdi_type: "I",
    payment_form: "",
    payment_method: "",
    logo_url: sesion && sesion.empresa.imagen ? sesion.empresa.imagen : '',
    date: "0",
    issuer: {
      FiscalRegime: sesion ? sesion.empresa.regimen_fiscal : "",
      Rfc: sesion ? sesion.empresa.rfc : "",
      Name: sesion ? sesion.empresa.nombre_fiscal : "",
    },
    receiver: {
      Rfc: "",
      Name: "",
      CfdiUse: "",
    },
    items: [],
    empresa: sesion ? sesion.empresa._id : "",
    sucursal: sesion ? sesion.sucursal._id : "",
  }