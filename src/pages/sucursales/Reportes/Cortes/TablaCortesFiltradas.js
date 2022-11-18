import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TablePagination,
  Typography,
} from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { OBTENER_CORTE_CAJA } from "../../../../gql/Cajas/cajas";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { formatoFechaCorta } from "../../../../config/reuserFunctions";
import { imprimirTicketCorte } from "./PrintTicketCorte";

const columns = [
  { label: "Fecha Corte", minWidth: 100 },
  { label: "Hora Corte", minWidth: 100 },
  { label: "Usuario", minWidth: 100 },
  { label: "Turno Horario", minWidth: 100 },
  { label: "Caja", minWidth: 100 },
  { label: "Sucursal", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "65vh",
    "& ::-webkit-scrollbar": {
      display: "none",
    },
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  rootBusqueda: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
}));

export default function TablaCortesFiltradas({
  loading,
  cortes,
  page,
  setPage,
  limit,
}) {
  const classes = useStyles();

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cortes.docs.map((row) => {
                return <RowsRender key={row._id} corte={row} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={cortes.totalDocs}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}

function RowsRender({ corte }) {
  const [open, setOpen] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [loadingPrint, setLoadingPrint] = useState(false);

  const [obtenerCorte, { data, error, loading }] = useLazyQuery(
    OBTENER_CORTE_CAJA,
    {
      variables: {
        sucursal: sesion.sucursal._id,
        empresa: sesion.empresa._id,
        input: {
          usuario: sesion._id,
          caja: corte.id_caja,
          token_turno_user: corte.token_turno_user,
          number_user: sesion.numero_usuario,
        },
      },
      fetchPolicy: "network-only",
    }
  );

  let montos_sistema = [];
  let fechaInicio = '';
  let fechaFin = "";

  if (data) {
    montos_sistema = data.obtenerCorteCaja.montos_en_sistema;
    fechaInicio = data.obtenerCorteCaja.fecha_inicio;
    fechaFin = data.obtenerCorteCaja.fecha_fin;
  }
  const handleClickOpen = () => {
    setOpen(!open);
    obtenerCorte();
  };

  const handlePrintTicket = async () => {
    setLoadingPrint(true);
    await imprimirTicketCorte(corte, montos_sistema, fechaInicio, fechaFin);
    setLoadingPrint(false);
  };

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        handleClickOpen
        onClick={handleClickOpen}
        tabIndex={-1}
        key={corte._id}
      >
        <TableCell align="center">
          {formatoFechaCorta(corte.fecha_salida.completa)}
        </TableCell>
        <TableCell align="center">{corte.hora_salida.completa}</TableCell>
        <TableCell align="center">{corte.usuario_en_turno.nombre}</TableCell>
        <TableCell align="center">{corte.horario_en_turno}</TableCell>
        <TableCell align="center">{corte.numero_caja}</TableCell>
        <TableCell align="center">{corte.sucursal.nombre_sucursal}</TableCell>
      </TableRow>

      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
      >
        <DialogContent>
          <InformacionCorteCaja
            corte={corte}
            montos_sistema={montos_sistema}
            loading={loading}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={() => handlePrintTicket()}
            disabled={loadingPrint}
            startIcon={
              loadingPrint ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ReceiptIcon />
              )
            }
          >
            Imprimir Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function InformacionCorteCaja({ corte, montos_sistema, loading, fechaInicio, fechaFin }) {
  const classes = useStyles();

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Grid item lg={12} md={12} xs={12}>
        <Box p={1} textAlign="center">
          <Typography variant="h5">
            <b>Reporte de Corte de Caja</b>
          </Typography>
        </Box>
        <Box p={1} textAlign="center">
          <Typography variant="h6">
            {`Del ${moment(fechaInicio).locale("es-mx").format("LLL")} al ${moment(fechaFin).locale("es-mx").format("LLL")}`}
          </Typography>
        </Box>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <Box p={2} display="flex" justifyContent="center">
          <Box p={1}>
            <Typography>
              <b>Usuario: </b> {corte.usuario_en_turno.nombre}
            </Typography>
          </Box>
          <Box p={1}>
            <Typography>
              <b>No. de usuario: </b>
              {corte.usuario_en_turno.numero_usuario}
            </Typography>
          </Box>

          <Box p={1}>
            <Typography>
              <b>Horario en turno: </b>
              {corte.horario_en_turno}
            </Typography>
          </Box>
          <Box p={1}>
            <Typography>
              <b>Numero de caja: </b>
              {corte.numero_caja}
            </Typography>
          </Box>
          <Box p={1}>
            <Typography>
              <b>Sucursal: </b>
              {corte.sucursal.nombre_sucursal}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">CONCEPTO</TableCell>
                  <TableCell align="center">CAJERO</TableCell>
                  <TableCell align="center">SISTEMA</TableCell>
                  <TableCell align="center">DIFERENCIA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO EFECTIVO</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_efectivo.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_efectivo.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_efectivo.monto -
                    montos_sistema.monto_efectivo
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO TARJETA DEBITO</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_tarjeta_debito.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_tarjeta_debito.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_tarjeta_debito.monto -
                    montos_sistema.monto_tarjeta_debito
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO TARJETA DE CREDITO</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_tarjeta_credito.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_tarjeta_credito.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_tarjeta_credito.monto -
                    montos_sistema.monto_tarjeta_credito
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO TRANSFERENCIAS</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_transferencia.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_transferencia.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_transferencia.monto -
                    montos_sistema.monto_transferencia
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO EN MONEDERO</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_monedero.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_monedero.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_monedero.monto -
                    montos_sistema.monto_monedero
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO EN CREDITOS</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_creditos.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_creditos.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_creditos.monto -
                    montos_sistema.monto_creditos
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO EN CHEQUES</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_cheques.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_cheques.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_cheques.monto -
                    montos_sistema.monto_cheques
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
              <TableBody>
                <TableCell align="center">
                  <b>MONTO EN VALE DE DESPENSA</b>
                </TableCell>
                <TableCell align="center">
                  ${corte.montos_en_caja.monto_vales_despensa.monto.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  ${montos_sistema.monto_vales_despensa.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  $
                  {(
                    corte.montos_en_caja.monto_vales_despensa.monto -
                    montos_sistema.monto_vales_despensa
                  ).toFixed(2)}
                </TableCell>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
}
