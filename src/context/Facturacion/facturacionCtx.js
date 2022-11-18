import React, { createContext, useState } from "react";

export const FacturacionCtx = createContext();

export const FacturacionProvider = ({ children }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [datosFactura, setDatosFactura] = useState({
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
  });

  const [venta_factura, setVentaFactura] = useState(null);
  const [productos, setProductos] = useState([]);

  const [cp_valido, setCPValido] = useState(false);
  const [codigo_postal, setCodigoPostal] = useState("");
  const [error_validation, setError] = useState({ status: false, message: "" });

  return (
    <FacturacionCtx.Provider
      value={{
        datosFactura,
        setDatosFactura,
        cp_valido,
        setCPValido,
        codigo_postal,
        setCodigoPostal,
        error_validation,
        setError,
        venta_factura,
        setVentaFactura,
        productos,
        setProductos,
      }}
    >
      {children}
    </FacturacionCtx.Provider>
  );
};
