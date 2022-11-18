export const verificarDatosFactura = (datos) => {
  const {
    cfdi_type,
    currency,
    date,
    empresa,
    expedition_place,
    folio,
    issuer,
    items,
    /* logo_url, */
    payment_form,
    payment_method,
    receiver,
    serie,
    sucursal,
  } = datos;

  //verificar datos factura
  if (
    !cfdi_type ||
    !currency ||
    !date ||
    !empresa ||
    !expedition_place ||
    !folio ||
    !issuer ||
    !items ||
    /* !logo_url || */
    !payment_form ||
    !payment_method ||
    !receiver ||
    !serie ||
    !sucursal
  ){
      return [{message: "Campo requerido"}]
  }
//verificar productos factura


    return [];
};
