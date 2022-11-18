import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import {
  calculatePrices2,
  formatoMexico,
} from "../../../../../config/reuserFunctions";
import { useState } from "react";
import { Close } from "@material-ui/icons";
import { useContext } from "react";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarProductoFactura({ venta, producto, index }) {
  const [open, setOpen] = useState(false);
  const { setVentaFactura, setProductos, productos } = useContext(FacturacionCtx);
  const { datos_generales } = producto.id_producto;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const copy_venta = { ...venta };
    const copy_productos = [ ...productos];
    const { cantidad_venta, granel_producto, precio_actual_object } = producto;
    const { iva, ieps, impuestos, subTotal, total, monedero } = copy_venta;
    //devuelve cantidades a restar
    const precio_resta = await calculatePrices2({
      newP: producto,
      cantidad: cantidad_venta,
      granel: granel_producto,
      precio_boolean: true,
      precio: precio_actual_object,
    });
    //Restar precios a venta
    console.log(precio_resta);
    const {
      ivaCalculo,
      iepsCalculo,
      impuestoCalculo,
      subtotalCalculo,
      totalCalculo,
      monederoCalculo,
    } = precio_resta;

    copy_venta.iva = iva - ivaCalculo;
    copy_venta.ieps = ieps - iepsCalculo;
    copy_venta.impuestos = impuestos - impuestoCalculo;
    copy_venta.subTotal = subTotal - subtotalCalculo;
    copy_venta.total = total - totalCalculo;
    copy_venta.monedero = monedero - monederoCalculo;

    //remover de la lista
    copy_productos.splice(index, 1);
    setVentaFactura(copy_venta);
    setProductos(copy_productos);
    handleClose();
  };

  return (
    <div>
      <IconButton size="small" onClick={handleClickOpen}>
        <Close />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <DialogTitle>¿Está seguro de eliminar este producto?</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 100 }}>Producto</TableCell>
                  <TableCell style={{ width: 50 }}>Cantidad</TableCell>
                  <TableCell style={{ width: 100 }}>Subtotal</TableCell>
                  <TableCell style={{ width: 100 }}>Impuestos</TableCell>
                  <TableCell style={{ width: 100 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow tabIndex={-1}>
                  <TableCell>{datos_generales.nombre_comercial}</TableCell>
                  <TableCell>{producto.cantidad_venta}</TableCell>
                  <TableCell>
                    ${formatoMexico(producto.subtotal)}
                  </TableCell>
                  <TableCell>
                    ${formatoMexico(producto.impuestos)}
                  </TableCell>
                  <TableCell>
                    ${formatoMexico(producto.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={() => handleClose()} color="inherit">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete()} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
