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

export default function ExportarReportesCajas({ props, datos, refetch }) {
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
            -Exportar todo:exportará la pagina actual
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
            props={props}
            datosExcel={datos}
            refetch={refetch}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ExportarExcelAction = ({ props, datosExcel }) => {
  const reporteData = datosExcel.map((res) => {
    const arrayExcel = {
      fecha: res.fecha_movimiento.completa,
      hora_movimiento: res.hora_moviento.completa,
      nombre: res.nombre_usuario_creador,
      horario_turno: res.horario_turno,
      tipo_movimiento: res.tipo_movimiento,
      concepto: res.concepto,
      caja: res.numero_caja,
      monto_efectivo: res.montos_en_caja.monto_efectivo.monto,
      monto_creditos: res.montos_en_caja.monto_creditos.monto,
      monto_tarjeta_debito: res.montos_en_caja.monto_tarjeta_debito.monto,
      monto_tarjeta_credito: res.montos_en_caja.monto_tarjeta_credito.monto,
      monto_monedero: res.montos_en_caja.monto_monedero.monto,
      monto_cheques: res.montos_en_caja.monto_cheques.monto,
      monto_transferencia: res.montos_en_caja.monto_transferencia.monto,
      monto_vales_despensa: res.montos_en_caja.monto_vales_despensa.monto,
    };
    return arrayExcel;
  });

  return (
    <ExcelFile
      element={<Button color="primary">Exportar</Button>}
      filename={`Reporte de Historial de Caja ${props.cajaSelected.numero_caja}`}
    >
      <ExcelSheet
        data={reporteData}
        name={`Reporte de Historial de Caja ${props.cajaSelected.numero_caja}`}
      >
        <ExcelColumn label="Usuario" value="nombre" />
        <ExcelColumn label="Fecha Movimiento" value="fecha" />
        <ExcelColumn label="Hora Movimiento" value="hora_movimiento" />
        <ExcelColumn label="Horario en Turno" value="horario_turno" />
        <ExcelColumn label="Concepto" value="concepto" />
        <ExcelColumn label="Tipo Movimiento" value="tipo_movimiento" />
        <ExcelColumn label="No. de Caja" value="caja" />
        <ExcelColumn label="M. en Efectivo" value="monto_efectivo" />
        <ExcelColumn label="M. en Creditos" value="monto_creditos" />
        <ExcelColumn
          label="M. en Tarjeta Debito"
          value="monto_tarjeta_debito"
        />
        <ExcelColumn
          label="M. en Tarjeta Credito"
          value="monto_tarjeta_credito"
        />
        <ExcelColumn label="M. en monedero" value="monto_monedero" />
        <ExcelColumn label="M. en Cheques" value="monto_cheques" />
        <ExcelColumn label="M. en Transferencia" value="monto_transferencia" />
        <ExcelColumn label="M. en Vale Despensa" value="monto_vales_despensa" />
      </ExcelSheet>
    </ExcelFile>
  );
};
