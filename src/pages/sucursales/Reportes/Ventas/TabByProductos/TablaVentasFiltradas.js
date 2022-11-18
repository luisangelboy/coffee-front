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
  { label: "Folio venta", minWidth: 100 },
  { label: "Cliente", minWidth: 180 },
  { label: "Clave cliente", minWidth: 100 },
  { label: "Usuario en caja", minWidth: 180 },
  { label: "Caja", minWidth: 50 },
  { label: "Artículo", minWidth: 200 },
  { label: "Medida", minWidth: 100 },
  { label: "Color", minWidth: 100 },
  { label: "Fecha venta", minWidth: 120 },
  { label: "M. pago", minWidth: 90, padding: "checkbox" },
  { label: "F. pago", minWidth: 100, padding: "checkbox" },
  { label: "Cantidad", minWidth: 90, padding: "checkbox" },
  { label: "Unidad", minWidth: 90, padding: "checkbox" },
  { label: "Desc.", minWidth: 100, padding: "checkbox" },
  { label: "Subtotal", minWidth: 90 },
  { label: "Impuestos", minWidth: 90 },
  { label: "Total", minWidth: 100 },
  { label: "Regresó" },
  { label: "Cant. venta", minWidth: 120 },
  { label: "Total" },
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
  filtro,
  refetch,
  setPage,
  limit,
}) {
  const classes = useStyles();
  //const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

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
                  const result = formaPago.filter(
                    (res) => res.Value === data.forma_pago
                  );
                  forma_pago = result[0];
                }

                return (
                  <TableRow key={index} role="checkbox" tabIndex={-1}>
                    <TableCell
                      className={
                        data.nota_credito
                          ? classes.notas_credito
                          : data.venta.status === "CANCELADO"
                          ? classes.cancelada
                          : classes.normal_color
                      }
                    >
                      {data.venta.folio}
                    </TableCell>
                    <TableCell>
                      {data.venta.cliente !== null
                        ? data.venta.cliente.nombre_cliente
                        : "Público General"}
                    </TableCell>
                    <TableCell>
                      {data.venta.cliente !== null
                        ? data.venta.cliente.clave_cliente
                        : "-"}
                    </TableCell>
                    <TableCell>{data.venta.usuario.nombre}</TableCell>
                    <TableCell>{data.venta.id_caja.numero_caja}</TableCell>
                    <TableCell>
                      {data.producto.datos_generales.nombre_comercial}
                    </TableCell>
                    <TableCell>
                      {data.medida.medida !== null ? data.medida.medida : "-"}
                    </TableCell>
                    <TableCell>
                      {data.color.color !== null ? data.color.color : "-"}
                    </TableCell>
                    <TableCell>
                      {moment(data.fecha_registro).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {data.venta_credito ? "Crédito" : "Contado"}
                    </TableCell>
                    <TableCell>{`${forma_pago.Name}`}</TableCell>
                    <TableCell>{data.cantidad_venta}</TableCell>
                    <TableCell>{data.unidad}</TableCell>
                    <TableCell>
                      {`$${
                        data.descuento_precio
                          ? formatoMexico(data.descuento_precio)
                          : 0
                      }`}
                    </TableCell>
                    <TableCell>${formatoMexico(data.subtotal)}</TableCell>
                    <TableCell>${formatoMexico(data.impuestos)}</TableCell>
                    <TableCell>${formatoMexico(data.total)}</TableCell>
                    <TableCell
                      style={{ backgroundColor: "#FFFAEC" }}
                      align="center"
                    >
                      {" "}
                      {data.nota_credito
                        ? data.nota_credito.cantidad_devuelta
                        : ""}
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#FFFAEC" }}
                      align="center"
                    >
                      {data.nota_credito
                        ? data.nota_credito.cantidad_vendida
                        : ""}
                    </TableCell>
                    <TableCell style={{ backgroundColor: "#FFFAEC" }}>
                      {data.nota_credito
                        ? `$${formatoMexico(data.nota_credito.total)}`
                        : ""}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" mr={3}>
          <Typography variant="h6">
            Total: $ {formatoMexico(data.totalVenta)}
          </Typography>
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
