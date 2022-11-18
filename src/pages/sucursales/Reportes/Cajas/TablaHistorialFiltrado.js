import React, { useState } from "react";
import "moment";
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
import moment from "moment";

const columns = [
  { id: "fecha", label: "Fecha", minWidth: 100 },
  { id: "hora", label: "Hora", minWidth: 100 },
  { id: "movimiento", label: "Movimiento", minWidth: 100 },
  { id: "usuario", label: "Usuario", minWidth: 100 },
  { id: "hTurno", label: "Horario Turno", minWidth: 100 },
  { id: "concepto", label: "Concepto", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "70vh",
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

export default function TablaHistorialFiltrado({
  loading,
  historial,
  page,
  setPage
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
              {historial.docs.map((row, index) => {
                return <RowsRender key={index} datos={row} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={historial.totalDocs}
          rowsPerPage={20}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}

function RowsRender({ datos }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(!open);

  const classes = useStyles();

  return (
    <>
      <TableRow hover role="checkbox" onClick={handleClickOpen} tabIndex={-1}>
        <TableCell align="center">
          {formatoFechaCorta(datos.fecha_movimiento.completa)}
        </TableCell>
        <TableCell align="center">{datos.hora_moviento.completa}</TableCell>
        <TableCell align="center">{datos.tipo_movimiento}</TableCell>
        <TableCell align="center">{datos.nombre_usuario_creador}</TableCell>
        <TableCell align="center">{datos.horario_turno}</TableCell>
        <TableCell align="center">{datos.concepto}</TableCell>
      </TableRow>

      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={open}
        onClose={handleClickOpen}
      >
        <DialogContent>
          <Grid container>
            <Grid item lg={12} xs={12}>
              <Box textAlign="center" p={2}>
                <Typography variant="h6">Información de movimiento</Typography>
              </Box>
            </Grid>
            <Grid item lg={12} xs={12}>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Fecha Movimiento: </b>{" "}
                  {moment(datos.fecha_movimiento.completa).format("YYYY-MM-DD")}
                </Typography>
              </Box>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Hora Movimiento: </b> {datos.hora_moviento.completa}
                </Typography>
              </Box>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Usuario: </b> {datos.nombre_usuario_creador}
                </Typography>
              </Box>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Horario en Turno: </b>
                </Typography>
              </Box>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Tipo Movimiento: </b> {datos.tipo_movimiento}
                </Typography>
              </Box>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Concepto: </b> {datos.concepto}
                </Typography>
              </Box>
              <Box display="flex" textAlign="left" p={1}>
                <Typography>
                  <b>Caja: </b> {datos.numero_caja}
                </Typography>
              </Box>
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
                          <b>
                            $
                            {Math.abs(
                              datos.montos_en_caja.monto_efectivo.monto
                            )}
                          </b>
                        </TableCell>
                      </TableRow>
                      {/* <TableRow hover tabIndex={-1} >
												<TableCell align="center">Creditos</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_creditos.monto)}</TableCell>
											</TableRow>
											<TableRow hover tabIndex={-1} >
												<TableCell align="center">Tarjeta Debito</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_tarjeta_debito.monto)}</TableCell>
											</TableRow>
											<TableRow hover tabIndex={-1} >
												<TableCell align="center">Tarjeta Credito</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_tarjeta_credito.monto)}</TableCell>
											</TableRow>
											<TableRow hover tabIndex={-1} >
												<TableCell align="center">Monedero</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_monedero.monto)}</TableCell>
											</TableRow>
											<TableRow hover tabIndex={-1} >
												<TableCell align="center">Cheques</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_cheques.monto)}</TableCell>
											</TableRow>
											<TableRow hover tabIndex={-1} >
												<TableCell align="center">Transferencias</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_transferencia.monto)}</TableCell>
											</TableRow>
											<TableRow hover tabIndex={-1} >
												<TableCell align="center">Vales de despensa</TableCell>
												<TableCell align="center">${Math.abs(datos.montos_en_caja.monto_vales_despensa.monto)}</TableCell>
											</TableRow> */}
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
