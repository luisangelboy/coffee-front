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
import { formatoFechaCorta } from "../../../../config/reuserFunctions";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarTraspasos({ data, refetch }) {
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
        <DialogTitle>{"Exportar Reportes de almacen"}</DialogTitle>
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
  const traspasos = datosExcel.map((traspaso) => {
    const trasp = {
      producto: traspaso.producto.datos_generales.nombre_comercial,
      cantidad: traspaso.cantidad,
      unidad: traspaso.unidad,
      fecha: formatoFechaCorta(traspaso.id_traspaso.fecha_registro),
      concepto: traspaso.id_traspaso.concepto_traspaso.nombre_concepto,
      almacen_origen:
        traspaso.id_traspaso.almacen_origen !== null
          ? traspaso.id_traspaso.almacen_origen.nombre_almacen
          : "",
      almacen_destino:
        traspaso.id_traspaso.almacen_destino !== null
          ? traspaso.id_traspaso.almacen_destino.nombre_almacen
          : "",
    };

    return trasp;
  });
  return (
    <ExcelFile
      element={
        <Button color="primary" startIcon={<RiFileExcel2Line />}>
          Exportar a Excel
        </Button>
      }
      filename="Reporte de traspasos"
    >
      <ExcelSheet data={traspasos} name="Reporte de traspasos">
        <ExcelColumn label="Producto" value="producto" />
        <ExcelColumn label="Cantidad" value="cantidad" />
        <ExcelColumn label="Unidad" value="unidad" />
        <ExcelColumn label="Fecha" value="fecha" />
        <ExcelColumn label="Concepto" value="concepto" />
        <ExcelColumn label="Almacén Origen" value="almacen_origen" />
        <ExcelColumn label="Almacén Destino" value="almacen_destino" />
      </ExcelSheet>
    </ExcelFile>
  );
};
