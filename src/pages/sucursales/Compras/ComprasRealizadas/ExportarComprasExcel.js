import React, { Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RiFileExcel2Line } from "react-icons/ri";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button, Box } from "@material-ui/core";
import ReactExport from "react-export-excel";
import {
  formatoFecha,
  formatoMexico,
} from "../../../../config/reuserFunctions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarComprasExcel({
  obtenerComprasRealizadas,
  filtro,
  filtroFecha,
  refetch,
}) {
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
        <DialogTitle>{"Exportar Reportes de compras"}</DialogTitle>
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
          <ExportarExcelAction
            datosExcel={obtenerComprasRealizadas.docs}
            filtro={filtro}
            filtroFecha={filtroFecha}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ExportarExcelAction = ({ datosExcel, filtro, filtroFecha }) => {
  const compras = datosExcel.map((compra) => {
    const {
      almacen,
      proveedor,
      fecha_registro,
      subtotal,
      impuestos,
      total,
    } = compra;
    const compra_realizada = {
      almacen: almacen.nombre_almacen,
      proveedor: proveedor.nombre_cliente,
      fecha_registro: formatoFecha(fecha_registro),
      subtotal: formatoMexico(subtotal),
      impuestos: formatoMexico(impuestos),
      total: formatoMexico(total),
    };

    return compra_realizada;
  });

  let nombre_documento = "";
  if (filtro && filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas desde hace ${filtroFecha.since} y filtradas por ${filtro}`;
  } else if (filtro && !filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas filtradas por ${filtro}`;
  } else if (!filtro && filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas desde hace ${filtroFecha.since}`;
  } else if (!filtro && !filtroFecha.fecha) {
    nombre_documento = `Lista de compras realizadas`;
  }

  return (
    <Fragment>
      <ExcelFile
        element={
          <Button
            variant="contained"
            color="primary"
            startIcon={<RiFileExcel2Line />}
            disableElevation
          >
            Exportar
          </Button>
        }
        filename={nombre_documento}
      >
        <ExcelSheet data={compras} name={nombre_documento}>
          <ExcelColumn label="Almacen" value="almacen" />
          <ExcelColumn label="Proveedor" value="proveedor" />
          <ExcelColumn label="Fecha de compra" value="fecha_registro" />
          <ExcelColumn label="Subtotal" value="subtotal" />
          <ExcelColumn label="Impuestos" value="impuestos" />
          <ExcelColumn label="Total" value="total" />
        </ExcelSheet>
      </ExcelFile>
    </Fragment>
  );
};
