import React, { forwardRef, Fragment, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { VentasContext } from "../../context/Ventas/ventasContext";

import {
  findProductArray,
  calculatePrices2,
} from "../../config/reuserFunctions";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarProducto({ producto, setDatosVentasActual }) {
  const [open, setOpen] = useState(false);
  const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);
  let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));


  const handleToggleModal = () => {
    if(datosVenta.nota_credito){
      return
    }
    setOpen(!open)
  };

  const eliminarProductoBD = async () => {
    // console.log(producto);
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    const venta_actual = venta === null ? [] : venta;
    let productosVentasTemp = productosVentas;
    let venta_existente =
      venta === null
        ? {
            subTotal: 0,
            total: 0,
            impuestos: 0,
            iva: 0,
            ieps: 0,
            descuento: 0,
            monedero: 0,
          }
        : venta;

    const producto_encontrado = await findProductArray(producto);
    if (producto_encontrado.found) {
      const { cantidad_venta, ...newP } = producto;

      // newP.precio_actual_producto = newP.descuento_activo ? newP.descuento.precio_con_descuento :  newP.precio;
      //Sacar los impuestos que se van a restar
      // let calculoResta = await calculatePrices(newP, cantidad_venta, newP.granel_producto, newP.precio_actual_producto);

      const new_resta = await calculatePrices2({
        newP: newP,
        cantidad: cantidad_venta,
        precio_boolean: true,
        precio: newP.precio_actual_object,
        granel: newP.granel_producto,
        origen: "",
      });

      productosVentasTemp.splice(producto_encontrado.producto_found.index, 1);
      const CalculosData = {
        subTotal:
          parseFloat(venta_existente.subTotal) -
          parseFloat(new_resta.subtotalCalculo),
        total:
          parseFloat(venta_existente.total) -
          parseFloat(new_resta.totalCalculo),
        impuestos:
          parseFloat(venta_existente.impuestos) -
          parseFloat(new_resta.impuestoCalculo),
        iva: parseFloat(venta_existente.iva) - parseFloat(new_resta.ivaCalculo),
        ieps:
          parseFloat(venta_existente.ieps) - parseFloat(new_resta.iepsCalculo),
        descuento:
          parseFloat(venta_existente.descuento) -
          parseFloat(new_resta.descuentoCalculo),
        monedero:
          parseFloat(venta_existente.monedero) -
          parseFloat(new_resta.monederoCalculo),
      };

      let saldo_favor = 0;
      if(venta.nota_credito){
        saldo_favor = venta.total_original - CalculosData.total
      }

      if (productosVentasTemp.length === 0 && !venta.cliente.nombre_cliente) {
        localStorage.removeItem("DatosVentas");
        localStorage.removeItem("VentaOriginal");
      } else {
        localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            ...venta,
            ...CalculosData,
            saldo_favor,
            cliente:
              venta_actual.venta_cliente === true ? venta_actual.cliente : {},
            venta_cliente:
              venta_actual.venta_cliente === true
                ? venta_actual.venta_cliente
                : false,
            productos: productosVentasTemp,
            tipo_emision: venta_actual.tipo_emision
              ? venta_actual.tipo_emision
              : "TICKET",
          })
        );
      }

      setDatosVentasActual(CalculosData);
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  return (
    <Fragment>
      {/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}
      <IconButton size="small" onClick={() => handleToggleModal()} disabled={datosVenta && datosVenta.nota_credito}>
        <Delete size="small" color={datosVenta && datosVenta.nota_credito ? "disabled" : "error"} />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleToggleModal()}
        aria-labelledby="alert-dialog-delete-producto"
      >
        <DialogTitle id="alert-dialog-delete-producto">
          {"¿Estás seguro de eliminar este producto?"}
        </DialogTitle>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => handleToggleModal()} color="inherit">
            Cancelar
          </Button>
          <Button onClick={() => eliminarProductoBD()} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
