import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, TablePagination } from "@material-ui/core";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { formaPago } from "../../Facturacion/catalogos";

const columns = [
  { label: "Nombre producto", minWidth: 300 },
  { label: "Fecha de Compra", minWidth: 160 },
  { label: "Almacen", minWidth: 100 },
  { label: "Proveedor", minWidth: 150 },
  { label: "M. pago", minWidth: 100 },
  { label: "F. pago", minWidth: 130 },
  { label: "Cantidad", minWidth: 90 },
  { label: "Fecha límite crédito", minWidth: 170 },
  { label: "Saldo pendiente", minWidth: 150 },
  { label: "Descuento", minWidth: 120 },
  { label: "Subtotal", minWidth: 120 },
  { label: "Impuestos", minWidth: 120 },
  { label: "Total", minWidth: 120 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    height: "60vh",
  },
}));

export default function TablaComprasFiltradas({
  data,
  page,
  setPage,
  refetch,
  filtro,
  limit
}) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
    refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: filtro,
      offset: nextPage,
    });
  };

  return (
    <Box my={2}>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table size="small" stickyHeader aria-label="a dense table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    /* align={column.align} */
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.docs.map((data, index) => {
                const result = formaPago.filter(
                  (res) => res.Value === data.forma_pago
                );
                let forma_pago = result[0];

                return (
                  <TableRow key={index} role="checkbox" tabIndex={-1}>
                    <TableCell>
                      {data.producto.datos_generales.nombre_comercial}
                    </TableCell>
                    <TableCell>
                      {formatoFechaCorta(data.fecha_registro)}
                    </TableCell>
                    <TableCell>{data.almacen.nombre_almacen}</TableCell>
                    <TableCell>{data.proveedor.nombre_cliente}</TableCell>
                    <TableCell>
                      {data.compra_credito ? "Crédito" : "Contado"}
                    </TableCell>
                    <TableCell>
                      {`${forma_pago.Value}-${forma_pago.Name}`}
                    </TableCell>
                    <TableCell>
                      {`${data.cantidad_total} - ${data.unidad}`}
                    </TableCell>
                    <TableCell>
                    {formatoFechaCorta(data.compra.fecha_vencimiento_credito)}
                    </TableCell>
                    <TableCell>
                    {formatoMexico(data.compra.saldo_credito_pendiente)}
                    </TableCell>
                    <TableCell>
                      {`%${data.descuento_porcentaje} - $${
                        data.descuento_precio
                          ? formatoMexico(data.descuento_precio)
                          : 0
                      }`}
                    </TableCell>
                    <TableCell>${formatoMexico(data.subtotal)}</TableCell>
                    <TableCell>${formatoMexico(data.impuestos)}</TableCell>
                    <TableCell>${formatoMexico(data.total)}</TableCell>
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
    </Box>
  );
}
