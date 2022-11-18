import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatoFechaCorta } from "../../../../config/reuserFunctions";
import { TablePagination } from "@material-ui/core";

const columns = [
  { id: "producto", label: "Producto", minWidth: 200 },
  { id: "cantidad", label: "Cantidad", minWidth: 50 },
  { id: "unidad", label: "Unidad", minWidth: 50 },
  { id: "fecha", label: "Fecha ", minWidth: 50 },
  { id: "concepto", label: "Concepto ", minWidth: 100 },
  { id: "almacen_origen", label: "Almacén Origen", minWidth: 100 },
  { id: "almacen_destino", label: "Almacén Destino", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "60vh",
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

export default function TablaAlmacenFiltradas({
  data,
  page,
  setPage,
  limit,
}) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
    /* refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: filtro,
      offset: nextPage,
    }); */
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.docs.map((element, index) => {
              return (
                <TableRow key={index} role="checkbox" tabIndex={-1}>
                  <TableCell>
                    {element.producto.datos_generales.nombre_comercial}
                  </TableCell>

                  <TableCell>{element.cantidad}</TableCell>
                  <TableCell>{element.unidad}</TableCell>
                  <TableCell>
                    {formatoFechaCorta(element.id_traspaso.fecha_registro)}
                  </TableCell>
                  <TableCell>
                    {element.id_traspaso.concepto_traspaso.nombre_concepto}
                  </TableCell>
                  <TableCell>
                    {element.id_traspaso.almacen_origen !== null
                      ? element.id_traspaso.almacen_origen.nombre_almacen
                      : " - "}
                  </TableCell>
                  <TableCell>
                    {element.id_traspaso.almacen_destino !== null
                      ? element.id_traspaso.almacen_destino.nombre_almacen
                      : " - "}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data.totalDocs}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
}
