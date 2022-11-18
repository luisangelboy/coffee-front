import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Box, Typography } from "@material-ui/core";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import ModificarProductoFactura from "./EditarProductoFactura";
import EliminarProductoFactura from "./EliminarProductoFactura";
import { useContext } from "react";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "36vh",
  },
});

export default function DetallesFactura() {
  const classes = useStyles();
  const { venta_factura, productos } = useContext(FacturacionCtx);

  if (!venta_factura) {
    return null;
  }

  return (
    <Paper className={classes.root} variant="elevation">
      <Box textAlign="center">
        <Typography variant="button">Detalles de Venta</Typography>
      </Box>
      <TableContainer>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 250 }}>Folio</TableCell>
              <TableCell style={{ width: 50 }}>Cliente</TableCell>
              <TableCell style={{ width: 50 }}>Descuento</TableCell>
              <TableCell style={{ width: 50 }}>IVA</TableCell>
              <TableCell style={{ width: 50 }}>IEPS</TableCell>
              <TableCell style={{ width: 100 }}>Subtotal</TableCell>
              <TableCell style={{ width: 100 }}>Impuestos</TableCell>
              <TableCell style={{ width: 100 }}>Total</TableCell>
              <TableCell style={{ width: 50 }}>Usuario</TableCell>
              <TableCell style={{ width: 50 }}>Caja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover role="checkbox" tabIndex={-1}>
              <TableCell style={{ width: 200 }}>
                {venta_factura.folio}
              </TableCell>
              <TableCell style={{ width: 50 }}>
                {venta_factura.cliente !== null
                  ? venta_factura.cliente.nombre_cliente
                  : "-"}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                ${formatoMexico(venta_factura.descuento)}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                $
                {venta_factura.iva
                  ? formatoMexico(venta_factura.iva)
                  : 0}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                $
                {venta_factura.ieps
                  ? formatoMexico(venta_factura.ieps)
                  : 0}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                ${formatoMexico(venta_factura.subTotal)}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                ${formatoMexico(venta_factura.impuestos)}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                ${formatoMexico(venta_factura.total)}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                {venta_factura.usuario.nombre}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                {venta_factura.id_caja.numero_caja}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box textAlign="center" mt={1}>
        <Typography variant="button">Productos de Venta</Typography>
      </Box>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 250 }}>Producto</TableCell>
              <TableCell style={{ width: 50 }}>Cantidad</TableCell>
              <TableCell style={{ width: 50 }}>IVA</TableCell>
              <TableCell style={{ width: 50 }}>IEPS</TableCell>
              <TableCell style={{ width: 100 }}>Subtotal</TableCell>
              <TableCell style={{ width: 100 }}>Impuestos</TableCell>
              <TableCell style={{ width: 100 }}>Total</TableCell>
              <TableCell style={{ width: 50 }}>Modificar</TableCell>
              <TableCell style={{ width: 50 }}>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto, index) => {
              return (
                <RowTableProductos
                  venta={venta_factura}
                  producto={producto}
                  key={index}
                  index={index}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RowTableProductos = ({ venta, producto, index }) => {
  const { datos_generales } = producto.id_producto;
  return (
    <TableRow tabIndex={-1}>
      <TableCell>{datos_generales.nombre_comercial}</TableCell>
      <TableCell>{producto.cantidad_venta}</TableCell>
      <TableCell>${formatoMexico(producto.iva_total)}</TableCell>
      <TableCell>${formatoMexico(producto.ieps_total)}</TableCell>
      <TableCell>${formatoMexico(producto.subtotal)}</TableCell>
      <TableCell>${formatoMexico(producto.impuestos)}</TableCell>
      <TableCell>${formatoMexico(producto.total)}</TableCell>
      <TableCell>
        <ModificarProductoFactura
          venta={venta}
          producto={producto}
          index={index}
        />
      </TableCell>
      <TableCell>
        <EliminarProductoFactura
          venta={venta}
          producto={producto}
          index={index}
        />
      </TableCell>
    </TableRow>
  );
};
