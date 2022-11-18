import { Button } from "@material-ui/core";
import React from "react";
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RiFileExcel2Line } from "react-icons/ri";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function ExportExcel({ historialCortes, refetch }) {
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
        startIcon={<RiFileExcel2Line />}
        onClick={handleClickOpen}
      >
        Exportar Excel
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{"Exportar Reporte de cortes de caja"}</DialogTitle>
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
          <ExportarExcelAction datosExcel={historialCortes.docs} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ExportarExcelAction = ({ datosExcel }) => {
  const cortesCajaData = datosExcel.map((cortes) => {
    const cortes_caja = {
      fecha: cortes.fecha_salida.completa,
      hora_movimiento: cortes.hora_salida.completa,
      horario_turno: cortes.horario_en_turno,
      sucursal: cortes.sucursal.nombre_sucursal,
      nombre: cortes.usuario_en_turno.nombre,
      numero_usuario: cortes.usuario_en_turno.numero_usuario,
      concepto: "Corte Caja",
      caja: cortes.numero_caja,
      monto_efectivo: cortes.montos_en_caja.monto_efectivo.monto,
      monto_creditos: cortes.montos_en_caja.monto_creditos.monto,
      monto_tarjeta_debito: cortes.montos_en_caja.monto_tarjeta_debito.monto,
      monto_tarjeta_credito: cortes.montos_en_caja.monto_tarjeta_credito.monto,
      monto_monedero: cortes.montos_en_caja.monto_monedero.monto,
      monto_cheques: cortes.montos_en_caja.monto_cheques.monto,
      monto_transferencia: cortes.montos_en_caja.monto_transferencia.monto,
      monto_vales_despensa: cortes.montos_en_caja.monto_vales_despensa.monto,
    };

    return cortes_caja;
  });

  return (
    <>
      <ExcelFile
        element={
          <Button
            variant="text"
            color="primary"
            aria-label="Guardar"
            startIcon={<RiFileExcel2Line />}
          >
            Exportar
          </Button>
        }
        filename={`Reporte de Historial de Cortes`}
      >
        <ExcelSheet
          data={cortesCajaData}
          name={`Reporte de Historial de Cortes`}
        >
          <ExcelColumn label="Usuario" value="nombre" />
          <ExcelColumn label="No. Usuario" value="numero_usuario" />
          <ExcelColumn label="Sucursal" value="sucursal" />
          <ExcelColumn label="Fecha Corte" value="fecha" />
          <ExcelColumn label="Hora Corte" value="hora_movimiento" />
          <ExcelColumn label="Horario Turno" value="horario_turno" />
          <ExcelColumn label="Concepto" value="concepto" />
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
          <ExcelColumn label="M. en Monedero" value="monto_monedero" />
          <ExcelColumn label="M. en Cheques" value="monto_cheques" />
          <ExcelColumn
            label="M. en Transferencia"
            value="monto_transferencia"
          />
          <ExcelColumn
            label="M. en Vale Despensa"
            value="monto_vales_despensa"
          />
        </ExcelSheet>
      </ExcelFile>
    </>
  );
};
