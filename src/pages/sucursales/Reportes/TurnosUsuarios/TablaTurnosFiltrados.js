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
  Grid,
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
  TablePagination,
} from "@material-ui/core";
import { formatoFechaCorta } from "../../../../config/reuserFunctions";
const columns = [
  { id: "fecha", label: "Fecha", minWidth: 100 },
  { id: "hora", label: "Hora", minWidth: 100 },
  { id: "usuario", label: "Usuario", minWidth: 100 },
  { id: "hTurno", label: "Horario Turno", minWidth: 100 },
  { id: "concepto", label: "Concepto", minWidth: 100 },
  { id: "caja", label: "Caja", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "68vh",
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

export default function TablaTurnosFiltrados({
  loading,
  turnos,
  page,
  setPage,
}) {
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

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Box>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {turnos.docs.map((row, index) => {
                return <RowsRender key={index} turno={row} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={turnos.totalDocs}
          rowsPerPage={20}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}

function RowsRender({ turno }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleClickOpen = () => setOpen(!open);

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        onClick={handleClickOpen}
        tabIndex={-1}
        key={turno._id}
      >
        <TableCell align="center">
          {formatoFechaCorta(turno.fecha_movimiento)}
        </TableCell>
        <TableCell align="center">
          {turno.concepto === "ABRIR TURNO" ? (
            <>{turno.hora_entrada.completa}</>
          ) : (
            <>{turno.hora_salida.completa}</>
          )}
        </TableCell>
        <TableCell align="center">{turno.usuario_en_turno.nombre}</TableCell>
        <TableCell align="center">{turno.horario_en_turno}</TableCell>
        <TableCell align="center">{turno.concepto}</TableCell>
        <TableCell align="center">{turno.numero_caja}</TableCell>
      </TableRow>

      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={handleClickOpen}
      >
        <DialogContent>
          <Grid container>
            <Grid item lg={12} xs={12}>
              <Box textAlign="center" p={2}>
                <Typography variant="h6">Información del turno</Typography>
              </Box>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Box p={1}>
                <Typography>
                  <b>Usuario</b>: {turno.usuario_en_turno.nombre}
                </Typography>
              </Box>
              <Box p={1}>
                <Typography>
                  <b>Numero de caja</b>: {turno.numero_caja}
                </Typography>
              </Box>
              <Box p={1}>
                <Typography>
                  <b>Moviento de turno</b>: {turno.concepto}
                </Typography>
              </Box>
              <Box p={1}>
                <Typography>
                  <b>Horario de turno</b>: {turno.horario_en_turno}
                </Typography>
              </Box>
              <Box p={1}>
                <Typography>
                  {turno.concepto === "ABRIR TURNO" ? (
                    <>
                      <b>Hora de Entrada de turno: </b>
                      {turno.hora_entrada.completa}
                    </>
                  ) : (
                    <>
                      <b>Hora de Salida de turno: </b>
                      {turno.hora_salida.completa}
                    </>
                  )}
                </Typography>
              </Box>
              <Box p={1}>
                <Typography>
                  <b>Comentarios</b>: {turno.comentarios}
                </Typography>
              </Box>
              <Box p={1}>
                <Typography>
                  <b>Fecha de movimiento</b>: {turno.fecha_movimiento}
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ minWidth: 100 }}>
                          Concepto
                        </TableCell>
                        <TableCell align="center" style={{ minWidth: 100 }}>
                          Monto depositado
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">
                          <b>Monto Total Efectivo:</b>
                        </TableCell>
                        <TableCell align="center">
                          <b>${turno.montos_en_caja.monto_efectivo.monto}</b>
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Creditos</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_creditos.monto}
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Tarjeta Debito</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_tarjeta_debito.monto}
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Tarjeta Credito</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_tarjeta_credito.monto}
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Monedero</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_monedero.monto}
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Cheques</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_cheques.monto}
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Transferencias</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_transferencia.monto}
                        </TableCell>
                      </TableRow>
                      <TableRow hover tabIndex={-1}>
                        <TableCell align="center">Vales de despensa</TableCell>
                        <TableCell align="center">
                          ${turno.montos_en_caja.monto_vales_despensa.monto}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
