import React from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RiFileExcel2Line } from "react-icons/ri";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../../config/reuserFunctions";
import { formaPago } from "../../../Facturacion/catalogos";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarVentas({ data, refetch }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (value) => {
    setValue(value);

    if (!value) {
      refetch({
        limit: 20,
        offset: 0,
      });
    } else {
      refetch({
        limit: 0,
        offset: 0,
      });
    }
  };
  return (
    <div>
      <Button
        variant="text"
        color="primary"
        size="large"
        startIcon={<RiFileExcel2Line />}
        onClick={handleClickOpen}
      >
        Exportar Excel
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{"Exportar Reportes de ventas"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            -Exportar pagina actual: exportará la pagina actual
          </DialogContentText>
          <DialogContentText>
            -Exportar todo: exportará todos los registros filtrados
          </DialogContentText>
          <FormControl variant="outlined" fullWidth>
            <Select
              value={value}
              onChange={(e) => handleChange(e.target.value)}
            >
              <MenuItem value={0}>Contenido Actual</MenuItem>
              <MenuItem value={1}>Todos los registros</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <ExportarExcelAction datosExcel={data.docs} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ExportarExcelAction = ({ datosExcel }) => {
  const compras = datosExcel.map((compra) => {
    const {
      producto,
      fecha_registro,
      color,
      medida,
      cantidad_venta,
      unidad,
      venta_credito,
      descuento_porcentaje,
      descuento_precio,
      iva_total,
      ieps_total,
      subtotal,
      impuestos,
      total,
      nota_credito,
      factura,
      venta,
    } = compra;
    let forma_pago = "";
    if (compra.forma_pago) {
      const forma_pago_filtrada = formaPago.filter(
        (forma) => forma.Value === compra.forma_pago
      );
      forma_pago = forma_pago_filtrada[0];
    }

    const compra_realizada = {
      folio_venta: venta.folio,
      cliente_venta:
        venta.cliente !== null
          ? venta.cliente.nombre_cliente
          : "Publico general",
      clave_cliente: venta.cliente !== null ? venta.cliente.clave_cliente : "-",
      usuario: venta.usuario.nombre,
      caja: venta.id_caja.numero_caja,
      tipo_emision: venta.tipo_emision,
      producto: producto.datos_generales.nombre_comercial,
      codigo_barras: producto.datos_generales.codigo_barras,
      clave_alterna: producto.datos_generales.clave_alterna,
      fecha_registro: formatoFechaCorta(fecha_registro),
      color: color.color ? color.color : "N/A",
      medida: medida.medida ? `${medida.medida}/${medida.tipo}` : "N/A",
      cantidad_venta: cantidad_venta,
      unidad,
      venta_credito: venta_credito === true ? "Credito" : "Contado",
      forma_pago: `${forma_pago.Value} - ${forma_pago.Name}`,
      nota_credito: nota_credito ? "SI" : "NO",
      facturada: factura && factura.length > 0 ? "SI" : "NO",
      descuento_porcentaje: `%${
        descuento_porcentaje ? descuento_porcentaje : 0
      }`,
      descuento_precio: `$${
        descuento_precio ? formatoMexico(descuento_precio) : 0
      }`,
      iva_total: `$${iva_total ? formatoMexico(iva_total) : 0}`,
      ieps_total: `$${ieps_total ? formatoMexico(ieps_total) : 0}`,
      subtotal: `$${subtotal ? formatoMexico(subtotal) : 0}`,
      impuestos: `$${impuestos ? formatoMexico(impuestos) : 0}`,
      total: `$${total ? formatoMexico(total) : 0}`,
      cantidad_regresada: nota_credito ? nota_credito.cantidad_devuelta : "",
      cantidad_vendida: nota_credito ? nota_credito.cantidad_vendida : "",
      total_nota: nota_credito ? formatoMexico(nota_credito.total) : "",
    };

    return compra_realizada;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<RiFileExcel2Line />}>
          Exportar a Excel
        </Button>
      }
      filename="Reporte de compras"
    >
      <ExcelSheet data={compras} name="Reporte de compras">
        <ExcelColumn label="Folio de venta" value="folio_venta" />
        <ExcelColumn label="Cliente venta" value="cliente_venta" />
        <ExcelColumn label="Clave cliente" value="clave_cliente" />
        <ExcelColumn label="Usuario en caja" value="usuario" />
        <ExcelColumn label="Caja" value="caja" />
        <ExcelColumn label="Tipo de emision" value="tipo_emision" />
        <ExcelColumn label="Producto" value="producto" />
        <ExcelColumn label="Código_barras" value="codigo_barras" />
        <ExcelColumn label="Clave alterna" value="clave_alterna" />
        <ExcelColumn label="Fecha de compra" value="fecha_registro" />
        <ExcelColumn label="Color" value="color" />
        <ExcelColumn label="Medida" value="medida" />
        <ExcelColumn label="Cantidad" value="cantidad_venta" />
        <ExcelColumn label="Unidad" value="unidad" />
        <ExcelColumn label="Metodo de Pago" value="venta_credito" />
        <ExcelColumn label="Forma de pago" value="forma_pago" />
        <ExcelColumn label="Facturada" value="facturada" />
        <ExcelColumn label="Nota de crédito" value="nota_credito" />
        <ExcelColumn
          label="Descuento en Porcentaje"
          value="descuento_porcentaje"
        />
        <ExcelColumn label="Descuento en Cantidad" value="descuento_precio" />
        <ExcelColumn label="IVA" value="iva_total" />
        <ExcelColumn label="IEPS" value="ieps_total" />
        <ExcelColumn label="Subtotal" value="subtotal" />
        <ExcelColumn label="Impuestos" value="impuestos" />
        <ExcelColumn label="Total" value="total" />
        <ExcelColumn
          label="Cantidad regresada(NOTA C.)"
          value="cantidad_regresada"
        />
        <ExcelColumn
          label="Cantidad vendida(NOTA C.)"
          value="cantidad_vendida"
        />
        <ExcelColumn label="Total(NOTA C.)" value="total_nota" />
      </ExcelSheet>
    </ExcelFile>
  );
};
