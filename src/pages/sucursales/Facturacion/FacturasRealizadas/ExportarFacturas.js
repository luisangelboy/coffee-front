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
import { formatoMexico } from "../../../../config/reuserFunctions";
/* import { formaPago } from "../catalogos"; */

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarFacturas({ data, refetch }) {
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
        <DialogTitle>{"Exportar Facturas Realizadas"}</DialogTitle>
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
  const facturas = datosExcel.map((factura) => {
    const {
      serie,
      folio,
      folio_venta,
      fecha_registro,
      expedition_place,
      cfdi_type,
      payment_form,
      payment_method,
      issuer,
      receiver,
      taxes,
      complement,
      sub_total,
      total,
      discount,
      tipo
    } = factura;

    const iva = taxes.filter((res) => res.Name === "IVA");
    const ieps = taxes.filter((res) => res.Name === "IEPS");

    const factura_realizada = {
      serie,
      folio,
      folio_venta,
      fecha_registro,
      expedition_place,
      cfdi_type,
      tipo,
      payment_form,
      payment_method,
      issuer: issuer.TaxName,
      receiver: receiver.Name,
      iva: iva.length ? iva[0].Total : 0,
      ieps: ieps.length ? ieps[0].Total : 0,
      satCertNumber: complement.TaxStamp.SatCertNumber,
      sub_total: formatoMexico(sub_total),
      total: formatoMexico(total),
      discount: formatoMexico(discount),
    };

    return factura_realizada;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<RiFileExcel2Line />}>
          Exportar
        </Button>
      }
      filename="Facturas realizadas CAFI"
    >
      <ExcelSheet data={facturas} name="Facturas realizadas CAFI">
        <ExcelColumn label="Serie" value="serie" />
        <ExcelColumn label="Folio" value="folio" />
        <ExcelColumn label="Folio de venta" value="folio_venta" />
        <ExcelColumn label="Fecha" value="fecha_registro" />
        <ExcelColumn label="Lugar de Expedición" value="expedition_place" />
        <ExcelColumn label="tipo de documento" value="tipo" />
        <ExcelColumn label="tipo de CFDI" value="cfdi_type" />
        <ExcelColumn label="Metodo de Pago" value="payment_method" />
        <ExcelColumn label="Forma de pago" value="payment_form" />
        <ExcelColumn label="Emisor" value="issuer" />
        <ExcelColumn label="Receptor" value="receiver" />
        <ExcelColumn label="IVA" value="iva" />
        <ExcelColumn label="IEPS" value="ieps" />
        <ExcelColumn label="Num. Certificado SAT" value="satCertNumber" />
        <ExcelColumn label="Descuento" value="discount" />
        <ExcelColumn label="Subtotal" value="sub_total" />
        <ExcelColumn label="Total" value="total" />
      </ExcelSheet>
    </ExcelFile>
  );
};
