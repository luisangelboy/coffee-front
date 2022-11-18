import React from "react";
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RiFileExcel2Line } from "react-icons/ri";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function ExportarReportesTurnos({ datosExcel, refetch }) {
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
        <DialogTitle>{"Exportar Reportes Historial caja"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            -Exportar pagina actual: exportará la pagina actual
          </DialogContentText>
          <DialogContentText>
            -Exportar todo: exportará la pagina actual
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
          <ExportarExcelAction datosExcel={datosExcel} refetch={refetch} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ExportarExcelAction = ({ datosExcel }) => {
  const reportesData = datosExcel.map((res) => {
    const arrayExcel = {
      fecha: res.fecha_movimiento,
      nombre: res.usuario_en_turno.nombre,
      numero_usuario: res.usuario_en_turno.numero_usuario,
      fecha_entrada: res.fecha_entrada.completa,
      fecha_salida: res.fecha_salida.completa,
      hora_entrada: res.hora_entrada.completa,
      hora_salida: res.hora_salida.completa,
      horario_en_turno: res.horario_en_turno,
      concepto: res.concepto,
      caja: res.numero_caja,
    };
    return arrayExcel;
  });
  return (
    <ExcelFile
      element={<Button color="primary">Exportar</Button>}
      filename="Reporte de Turnos Usuarios"
    >
      <ExcelSheet data={reportesData} name={"Reporte de Turnos Usuarios"}>
        <ExcelColumn label="No. Usuario" value="numero_usuario" />
        <ExcelColumn label="Usuario" value="nombre" />
        <ExcelColumn label="Fecha Movimiento" value="fecha" />
        <ExcelColumn label="Fecha Entrada" value="fecha_entrada" />
        <ExcelColumn label="Fecha Salida" value="fecha_salida" />
        <ExcelColumn label="Hora Entrada" value="hora_entrada" />
        <ExcelColumn label="Hora Salida" value="hora_salida" />
        <ExcelColumn label="Horario en Turno" value="horario_en_turno" />
        <ExcelColumn label="Concepto" value="concepto" />
        <ExcelColumn label="No. de Caja" value="caja" />
      </ExcelSheet>
    </ExcelFile>
  );
};
