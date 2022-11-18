import React, { useState, useContext, Fragment, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  DialogTitle,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../styles";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import SnackBarMessages from "../../../components/SnackBarMessages";
import {
  findProductArray,
  calculatePrices2,
  formatoMexico,
} from "../../../config/reuserFunctions";
import { AccesosContext } from "../../../context/Accesos/accesosCtx";
import MoneyIcon from "../../../icons/ventas/money.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreciosProductos() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
  // const [selected, setSelected] = useState([]);

  const [preciosProductos, setPreciosProductos] = useState({});

  const {
    productoCambioPrecio,
    precioSelectProductoVenta,
    setPrecioSelectProductoVenta,
    setUpdateTablaVentas,
    updateTablaVentas,
  } = useContext(VentasContext);

  const {
    reloadVerPrecios,
    setReloadVerPrecios,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const [selectPrisingProduct, setSelectPrisingProduct] = useState(
    precioSelectProductoVenta.length > 0 ? precioSelectProductoVenta[0] : {}
  );

  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const handleClickOpen = () => {
    if (sesion.accesos.ventas.precios_productos.ver === true) {
      setOpen(!open);
    } else {
      setAbrirPanelAcceso(!abrirPanelAcceso);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "precios_productos",
        tipo_acceso: "ver",
      });
    }
  };

  useEffect(() => {
    setPreciosProductos(productoCambioPrecio);
  }, [productoCambioPrecio]);

  useEffect(() => {
    if (reloadVerPrecios === true) {
      setOpen(!open);
      setReloadVerPrecios(false);
    }
  }, [reloadVerPrecios]);

  const handleAceptChangePrising = async () => {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    let productosVentas = venta === null ? [] : venta.productos;
    let venta_actual = venta === null ? [] : venta;
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
    let productosVentasTemp = productosVentas;

    if (
      selectPrisingProduct.precio_neto > 0 ||
      precioSelectProductoVenta.length > 0
    ) {
      const newProductoPrecioNuevo = { ...productoCambioPrecio };
      const newProductoPrecioActual = { ...productoCambioPrecio };

      const producto_encontrado = await findProductArray(productoCambioPrecio);

      if (producto_encontrado.found) {
        const new_resta = await calculatePrices2({
          newP: newProductoPrecioNuevo,
          cantidad: newProductoPrecioNuevo.cantidad_venta,
          precio_boolean: true,
          precio: newProductoPrecioNuevo.precio_actual_object,
          granel: newProductoPrecioNuevo.granel_producto,
          origen: "",
        });

        /* console.log(precioSelectProductoVenta[0]); */
        const new_suma = await calculatePrices2({
          newP: newProductoPrecioActual,
          cantidad: newProductoPrecioActual.cantidad_venta,
          precio_boolean: true,
          precio: precioSelectProductoVenta[0],
          granel: newProductoPrecioActual.granel_producto,
          origen: "Tabla",
        });

        newProductoPrecioActual.precio_a_vender =
          precioSelectProductoVenta[0].precio_neto;
        newProductoPrecioActual.precio_seleccionado = true;
        newProductoPrecioActual.precio_actual_producto = parseFloat(
          precioSelectProductoVenta[0].precio_neto.toFixed(2)
        );
        newProductoPrecioActual.precio_actual_object =
          precioSelectProductoVenta[0];

        newProductoPrecioActual.iva_total_producto = parseFloat(
          new_suma.ivaCalculo
        );
        newProductoPrecioActual.ieps_total_producto = parseFloat(
          new_suma.iepsCalculo
        );
        newProductoPrecioActual.impuestos_total_producto = parseFloat(
          new_suma.impuestoCalculo
        );
        newProductoPrecioActual.subtotal_total_producto = parseFloat(
          new_suma.subtotalCalculo
        );
        newProductoPrecioActual.total_total_producto = parseFloat(
          new_suma.totalCalculo
        );

        newProductoPrecioActual.precio_actual_object = {
          cantidad_unidad: precioSelectProductoVenta[0].cantidad_unidad
            ? precioSelectProductoVenta[0].cantidad_unidad
            : null,
          numero_precio: precioSelectProductoVenta[0].numero_precio
            ? precioSelectProductoVenta[0].numero_precio
            : null,
          unidad_maxima: precioSelectProductoVenta[0].unidad_maxima
            ? precioSelectProductoVenta[0].unidad_maxima
            : null,
          precio_general: precioSelectProductoVenta[0].precio_general
            ? precioSelectProductoVenta[0].precio_general
            : null,
          precio_neto: precioSelectProductoVenta[0].precio_neto
            ? precioSelectProductoVenta[0].precio_neto
            : null,
          precio_venta: precioSelectProductoVenta[0].precio_venta
            ? precioSelectProductoVenta[0].precio_venta
            : null,
          iva_precio: precioSelectProductoVenta[0].iva_precio
            ? precioSelectProductoVenta[0].iva_precio
            : null,
          ieps_precio: precioSelectProductoVenta[0].ieps_precio
            ? precioSelectProductoVenta[0].ieps_precio
            : null,
          utilidad: precioSelectProductoVenta[0].utilidad
            ? precioSelectProductoVenta[0].utilidad
            : null,
          porciento: precioSelectProductoVenta[0].porciento
            ? precioSelectProductoVenta[0].porciento
            : null,
          dinero_descontado: precioSelectProductoVenta[0].dinero_descontado
            ? precioSelectProductoVenta[0].dinero_descontado
            : null,
        };

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newProductoPrecioActual
        );

        /* console.log("venta >>", venta_existente.subTotal);

        console.log("resta >>", new_resta.subtotalCalculo);

        console.log("suma >>", new_suma.subtotalCalculo); */

        const CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(new_resta.subtotalCalculo) +
            new_suma.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(new_resta.totalCalculo) +
            new_suma.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(new_resta.impuestoCalculo) +
            new_suma.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(new_resta.ivaCalculo) +
            new_suma.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(new_resta.iepsCalculo) +
            new_suma.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(new_resta.descuentoCalculo) +
            new_suma.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(new_resta.monederoCalculo) +
            new_suma.monederoCalculo,
        };

        //Guardarlo en el localStorage
        localStorage.setItem(
          "DatosVentas",
          JSON.stringify({
            ...CalculosData,
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
        // newProductoPrecio = {...newProductoPrecio};
        setUpdateTablaVentas(!updateTablaVentas);
        setPrecioSelectProductoVenta([]);
        setPreciosProductos({});
        //Cerrar modal
        handleClickOpen();
      } else {
        console.log("Producto no encontrado");
      }
    } else {
      setAlert({
        message: "Este precio no es valido.",
        status: "error",
        open: true,
      });
    }
  };

  const handleClick = (precio) => {
    let newSelected = [];
    newSelected = newSelected.concat([], precio);
    setSelectPrisingProduct(precio);
    setPrecioSelectProductoVenta(newSelected);
  };

  const isSelected = (name) => precioSelectProductoVenta.indexOf(name) !== -1;

  window.addEventListener("keydown", Mi_función);

  function Mi_función(e) {
    if (e.keyCode === 114) {
      handleClickOpen();
    }
  }

  return (
    <>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso || !precioSelectProductoVenta.length || (datosVentas && datosVentas.nota_credito)}
      >
        <Box>
          <Box
            style={
              !turnoEnCurso || !precioSelectProductoVenta.length || (datosVentas && datosVentas.nota_credito)
                ? {
                    pointerEvents: "none",
                    opacity: 0.5,
                  }
                : null
            }
          >
            <img
              src={MoneyIcon}
              alt="icono money"
              style={{ fontSize: 25 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Precios</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>F3</b>
            </Typography>
          </Box>
        </Box>
      </Button>

      <Dialog
        maxWidth="lg"
        open={open}
        onClose={() => setOpen(!open)}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Precios de Producto</Typography>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(!open)}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box my={1}>
            <Typography variant="h6" align="center">
              {productoCambioPrecio
                ? productoCambioPrecio?.id_producto?.datos_generales
                    ?.nombre_comercial
                : ""}
            </Typography>
          </Box>
          <Paper variant="outlined">
            <TableContainer>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>No. Precio</TableCell>
                    <TableCell>Precio neto</TableCell>
                    <TableCell>Unidad mayoreo</TableCell>
                    <TableCell>Utilidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preciosProductos?.id_producto?.precios?.precios_producto?.map(
                    (precio, index) => {
                      const isItemSelected = isSelected(precio);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <RenderTableRows
                          key={index}
                          precio={precio}
                          isItemSelected={isItemSelected}
                          labelId={labelId}
                          handleClick={handleClick}
                        />
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleAceptChangePrising()}
            variant="contained"
            color="primary"
            size="large"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const RenderTableRows = ({ precio, isItemSelected, labelId, handleClick }) => {
  const doubleClick = (e) => {
    if (precio.precio_neto <= 0) return;
    try {
      if (e.detail === 2) {
        handleClick(precio);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={precio.numero_precio}
        selected={isItemSelected}
        hover
        onClick={(e) => doubleClick(e)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            disabled={precio.precio_neto <= 0}
            onClick={(event) => {
              handleClick(precio);
            }}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell align={"center"}>{precio.numero_precio}</TableCell>
        <TableCell align={"center"}>
          {precio.precio_neto > 0 ? formatoMexico(precio.precio_neto) : 0}
        </TableCell>
        <TableCell align={"center"}>{precio.unidad_mayoreo}</TableCell>
        <TableCell align={"center"}>{precio.utilidad} %</TableCell>
      </TableRow>
    </Fragment>
  );
};
