import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { RiFileExcel2Line } from "react-icons/ri";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../../config/reuserFunctions";
import { formaPago, metodoPago } from "../../../Facturacion/catalogos";
import { useApolloClient } from "@apollo/client";
import { OBTENER_REPORTE_VENTAS_VENTA } from "../../../../../gql/Ventas/ventas_generales";

import ReactExport from "react-export-excel";
import { InfoOutlined } from "@material-ui/icons";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarVentas({ filtros }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState(false);

  const client = useApolloClient();

  /* Queries */
  const getProductos = async () => {
    try {
      setLoading(true);
      const response = await client.query({
        query: OBTENER_REPORTE_VENTAS_VENTA,
        variables: {
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          filtros,
          limit: 0,
          offset: 0,
        },
        fetchPolicy: "network-only",
      });
      setLoading(false);
      if (response.data) {
        setData(response.data.obtenerVentasByVentaReportes.docs);
        document.getElementById("export-excel-button").click();
      }
      if (response.error) setError(true);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    getProductos();
  };

  if (loading) {
    return (
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<CircularProgress size={20} color="inherit" />}
      >
        Exportar PDF
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<InfoOutlined />}
      >
        Exportar PDF
      </Button>
    );
  }

  return (
    <div>
      {data ? (
        <ExportarExcelAction datosExcel={data} />
      ) : (
        <Button
          variant="text"
          color="primary"
          size="large"
          startIcon={<RiFileExcel2Line />}
          onClick={handleClickOpen}
        >
          Exportar Excel
        </Button>
      )}
    </div>
  );
}

const ExportarExcelAction = ({ datosExcel }) => {
  const compras = datosExcel.map((venta) => {
    const {
      folio,
      fecha_registro,
      cliente,
      id_caja,
      tipo_emision,
      saldo_credito_pendiente,
      credito,
      fecha_de_vencimiento_credito,
      usuario,
      status,
      factura,
      nota_credito,
      descuento,
      iva,
      ieps,
      subTotal,
      impuestos,
      total,
    } = venta;
    let forma_pago = "";
    let metodo_pago = "";
    if (venta.forma_pago && venta.metodo_pago) {
      const forma_pago_filtrada = formaPago.filter(
        (forma) => forma.Value === venta.forma_pago
      );
      const metodo_pago_filtrada = metodoPago.filter(
        (metodo) => metodo.Value === venta.metodo_pago
      );
      forma_pago = forma_pago_filtrada[0];
      metodo_pago = metodo_pago_filtrada[0];
    }

    const compra_realizada = {
      folio_venta: folio,
      fecha_registro: formatoFechaCorta(fecha_registro),
      nombre_cliente:
        cliente !== null ? cliente.nombre_cliente : "Publico general",
      clave_cliente: cliente !== null ? cliente.clave_cliente : "-",
      numero_cliente: cliente !== null ? cliente.numero_cliente : "-",
      caja: id_caja.numero_caja,
      usuario_caja: usuario.nombre,
      tipo_emision: tipo_emision,
      venta_credito: credito ? "SI " : "NO",
      saldo_credito_pendiente: `$${
        saldo_credito_pendiente ? formatoMexico(saldo_credito_pendiente) : 0
      }`,
      fecha_de_vencimiento_credito: formatoFechaCorta(
        fecha_de_vencimiento_credito
      ),
      forma_pago: `${forma_pago.Value} - ${forma_pago.Name}`,
      metodo_pago: credito ? "Crédito" : "Contado",
      nota_credito: nota_credito.length ? "SI" : "NO",
      facturada: factura.length ? "SI" : "NO",
      status,
      descuento: `$${descuento ? formatoMexico(descuento) : 0}`,
      iva: `$${iva ? formatoMexico(iva) : 0}`,
      ieps: `$${ieps ? formatoMexico(ieps) : 0}`,
      subtotal: `$${subTotal ? formatoMexico(subTotal) : 0}`,
      impuestos: `$${impuestos ? formatoMexico(impuestos) : 0}`,
      total: `$${total ? formatoMexico(total) : 0}`,
    };

    return compra_realizada;
  });
  return (
    <ExcelFile
      element={
        <Button
          id="export-excel-button"
          color="primary"
          startIcon={<RiFileExcel2Line />}
        >
          Exportar a Excel
        </Button>
      }
      filename="Reporte de compras"
    >
      <ExcelSheet data={compras} name="Reporte de compras">
        <ExcelColumn label="Folio de venta" value="folio_venta" />
        <ExcelColumn label="Cliente" value="nombre_cliente" />
        <ExcelColumn label="Número cliente" value="numero_cliente" />
        <ExcelColumn label="Clave cliente" value="clave_cliente" />
        <ExcelColumn label="Caja" value="caja" />
        <ExcelColumn label="Usuario en caja" value="usuario_caja" />
        <ExcelColumn label="Tipo de emision" value="tipo_emision" />
        <ExcelColumn label="Venta a crédito" value="venta_credito" />
        <ExcelColumn
          label="Saldo crédito pendiente"
          value="saldo_credito_pendiente"
        />
        <ExcelColumn
          label="Fecha vencimiento crédito"
          value="fecha_de_vencimiento_credito"
        />
        <ExcelColumn label="Forma pago" value="forma_pago" />
        <ExcelColumn label="Metodo pago" value="metodo_pago" />
        <ExcelColumn label="Facturada" value="facturada" />
        <ExcelColumn label="Nota de crédito" value="nota_credito" />
        <ExcelColumn label="Descuento" value="descuento" />
        <ExcelColumn label="IVA" value="iva" />
        <ExcelColumn label="IEPS" value="ieps" />
        <ExcelColumn label="Subtotal" value="subtotal" />
        <ExcelColumn label="Impuestos" value="impuestos" />
        <ExcelColumn label="Total" value="total" />
      </ExcelSheet>
    </ExcelFile>
  );
};
