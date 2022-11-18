import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, TablePagination, Typography } from "@material-ui/core";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { formaPago } from "../../../Facturacion/catalogos";
import moment from "moment";

const columns = [
  { label: "Folio", minWidth: 100 },
  { label: "Fecha", minWidth: 90 },
  { label: "Cliente", minWidth: 180 },
  { label: "Clave Cliente", minWidth: 120 },
  { label: "Usuario venta", minWidth: 180 },
  { label: "Caja", minWidth: 50, padding: "checkbox" },
  { label: "T. emisión", minWidth: 110 },
  { label: "F. pago", minWidth: 110, padding: "checkbox" },
  { label: "M. pago", minWidth: 100, padding: "checkbox" },
  { label: "Pendiente", minWidth: 100 },
  { label: "F. límite crédito", minWidth: 140 },
  { label: "Descuento", minWidth: 100 },
  { label: "Subtotal", minWidth: 90 },
  { label: "Impuestos", minWidth: 90 },
  { label: "Total", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    height: "55vh",
  },
  normal_color: {
    borderLeft: "6px solid #FFF",
  },
  notas_credito: {
    borderLeft: " 6px solid #FFEAAD",
  },
  cancelada: {
    borderLeft: " 6px solid #FF8A8A",
  },
}));

export default function TablaVentasFiltradas({
  data,
  page,
  setPage,
  limit,
}) {
  const classes = useStyles();

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
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
                    padding={column.checkbox}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.docs.map((data, index) => {
                let forma_pago = "-";
                if (data.forma_pago) {
                  const resultForma = formaPago.filter(
                    (res) => res.Value === data.forma_pago
                  );
                  forma_pago = resultForma[0];
                }

                return (
                  <TableRow key={index} role="checkbox" tabIndex={-1}>
                    <TableCell
                      className={
                        data.nota_credito.length
                          ? classes.notas_credito
                          : data.status === "CANCELADO"
                          ? classes.cancelada
                          : classes.normal_color
                      }
                    >
                      {data.folio}
                    </TableCell>
                    <TableCell>
                      {moment(data.fecha_registro).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {data.cliente !== null
                        ? data.cliente.nombre_cliente
                        : "Público general"}
                    </TableCell>
                    <TableCell>
                      {data.cliente !== null
                        ? data.cliente.clave_cliente
                        : "N/A"}
                    </TableCell>
                    <TableCell>{data.usuario.nombre}</TableCell>
                    <TableCell>{data.id_caja.numero_caja}</TableCell>
                    <TableCell>{data.tipo_emision}</TableCell>
                    <TableCell>{`${forma_pago.Name}`}</TableCell>
                    <TableCell>{`${data.credito ? "Credito" : "Contado"}`}</TableCell>
                    <TableCell>
                      {`$${
                        data.credito
                          ? formatoMexico(data.saldo_credito_pendiente)
                          : 0
                      }`}
                    </TableCell>
                    <TableCell>
                      {data.credito
                        ? moment(data.fecha_de_vencimiento_credito).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {`$${data.descuento ? formatoMexico(data.descuento) : 0}`}
                    </TableCell>
                    <TableCell>${formatoMexico(data.subTotal)}</TableCell>
                    <TableCell>${formatoMexico(data.impuestos)}</TableCell>
                    <TableCell>${formatoMexico(data.total)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" mr={3}>
          <Typography variant="h6">Total: $ {formatoMexico(data.totalVenta)}</Typography>
        </Box>
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
