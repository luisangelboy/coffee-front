import React, { useState, Fragment, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Slide,
  TextField,
  Typography,
  InputAdornment,
  DialogTitle,
} from "@material-ui/core";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { Close, Done } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { formatoMexico } from "../../../config/reuserFunctions";
import { useDebounce } from "use-debounce";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DescuentoVenta({
  venta_base,
  setVentaBase,
  totales,
  setTotales,
  montos,
  setMontos,
}) {
  const [open, setOpen] = useState(false);

  //States descuento venta
  const [descuentoAplicarVenta, setDescuentoAplicarVenta] = useState(0);
  const [descuentoPorsentajeVenta, setDescuentoPorsentajeVenta] = useState(0);
  const [variables, setVariables] = useState({
    productos: venta_base.productos,
    total: totales.total,
    subTotal: totales.subtotal,
    impuestos: totales.impuestos,
    iva: venta_base.iva,
    ieps: venta_base.ieps,
    descuento: totales.descuento,
    descuento_general_activo: false,
    descuento_general: {
      cantidad_descontado: 0,
      porciento: 0,
      precio_con_descuento: 0,
    },
  });

  let venta_original = JSON.parse(localStorage.getItem("DatosVentas"));
  const subtotal_venta = venta_original
    ? parseFloat(venta_original.subTotal.toFixed(2))
    : 0;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlerChangeDiscountVenta = (PRICE) => {
    /* const { value } = e.target; */
    const value = PRICE.toString();
    if (value && value !== "0") {
      const nuevo_subtotal = subtotal_venta;
      const descuento =
        ((nuevo_subtotal - parseFloat(value)) * 100) / subtotal_venta - 100;
      const positiveDiscount = Math.abs(descuento);
      const descuento_porcentaje = parseFloat(positiveDiscount.toFixed(2));
      setDescuentoPorsentajeVenta(descuento_porcentaje);
      handleCalculateNewDiscountVenta(descuento_porcentaje, value);
      return;
    }
    setVariables({
      productos: venta_original.productos,
      total: venta_original.total,
      subTotal: venta_original.subTotal,
      impuestos: venta_original.impuestos,
      iva: venta_original.iva,
      ieps: venta_original.ieps,
      descuento: venta_original.descuento,
      descuento_general_activo: false,
      descuento_general: {
        cantidad_descontado: 0,
        porciento: 0,
        precio_con_descuento: 0,
      },
    });
  };

  const handleChangePorsentDiscount = (PERCENT) => {
    const value = PERCENT.toString();
    if (value && value !== "0") {
      const ventaSubtotal = subtotal_venta;
      const val =
        value < 10
          ? parseFloat(`0.0${value.replace(".", "")}`)
          : parseFloat(value) === 100
          ? 1
          : parseFloat(`0.${value.replace(".", "")}`);
      const dineroDescuento = ventaSubtotal * val;
      setDescuentoAplicarVenta(dineroDescuento.toFixed(2));
      handleCalculateNewDiscountVenta(value, dineroDescuento.toFixed(2));
      return;
    }
    setVariables({
      productos: venta_original.productos,
      total: venta_original.total,
      subTotal: venta_original.subTotal,
      impuestos: venta_original.impuestos,
      iva: venta_original.iva,
      ieps: venta_original.ieps,
      descuento: venta_original.descuento,
      descuento_general_activo: false,
      descuento_general: {
        cantidad_descontado: 0,
        porciento: 0,
        precio_con_descuento: 0,
      },
    });
  };

  const handleCalculateNewDiscountVenta = (
    descuentoPorsentaje,
    descuentoPrecio
  ) => {
    let venta = { ...venta_original };
    const productStorage = venta.productos;
    //Declarar la variables necesarias (total, subTotal, impuestos, iva ieps, productosFinal)
    let total = 0,
      subTotal = 0,
      impuestos = 0,
      iva = 0,
      ieps = 0,
      descuento = 0;
    let productosFinal = [];
    //Activar loading

    //Mapearlos
    for (let i = 0; i < productStorage.length; i++) {
      //Obtener el producto valor i
      const product = productStorage[i];
      let precio_actual_object = {};
      const porsentajeNewDescuento = parseFloat(descuentoPorsentaje);
      const dineroDescontadoDescuento = parseFloat(descuentoPrecio);
      /* const dineroDescontadoDescuento = parseFloat(
        product.precio_actual_object.precio_venta *
          parseFloat((`0.${porsentajeNewDescuento}`).toFixed(2))
      );
 */

      /* const dineroDescontadoDescuento =
        porsentajeNewDescuento > 1
          ? porsentajeNewDescuento >= 10
            ? parseFloat(
                (
                  product.precio_actual_object.precio_venta *
                  parseFloat(`0.${porsentajeNewDescuento}`)
                ).toFixed(2)
              )
            : parseFloat(
                (
                  (product.precio_actual_object.precio_venta *
                    parseFloat(`0.${porsentajeNewDescuento}`)) /
                  10
                ).toFixed(2)
              )
          : parseFloat(
              (product.precio_actual_object.precio_venta *
                porsentajeNewDescuento) /
                100
            ); */
      //Calcular los nuevos precios
      const newPrecioVentaProduct = parseFloat(
        (
          (product.precio_actual_object.precio_venta * product.cantidad_venta) - dineroDescontadoDescuento
        ).toFixed(2)
      ); //aqui no se multiplicaba => * product.cantidad_venta
      const newIvaProduct = parseFloat(
        (
          newPrecioVentaProduct *
          parseFloat(
            `0.${
              product.id_producto.precios.iva < 10
                ? `0${product.id_producto.precios.iva}`
                : product.id_producto.precios.iva
            }`
          )
        ).toFixed(2)
      );

      const newIepsProduct = parseFloat(
        (
          newPrecioVentaProduct *
          parseFloat(
            `0.${
              product.id_producto.precios.ieps < 10
                ? `0${product.id_producto.precios.ieps}`
                : product.id_producto.precios.ieps
            }`
          )
        ).toFixed(2)
      );

      const newPrecioNetoProduct = parseFloat(
        (newPrecioVentaProduct + newIvaProduct + newIepsProduct).toFixed(2)
      );
      const newUtilidadProduct = parseFloat(
        (
          ((newPrecioVentaProduct -
            product.id_producto.precios.precio_de_compra.precio_sin_impuesto) /
            product.id_producto.precios.precio_de_compra.precio_sin_impuesto) *
          100
        ).toFixed(2)
      );

      precio_actual_object = {
        cantidad_unidad: 1,
        dinero_descontado: dineroDescontadoDescuento,
        ieps_precio: newIepsProduct,
        iva_precio: newIvaProduct,
        numero_precio: product.precio_actual_object.numero_precio,
        porciento: product.precio_actual_object.porciento
          ? parseFloat(
              (
                parseFloat(product.precio_actual_object.porciento) +
                parseFloat(descuentoPorsentajeVenta)
              ).toFixed(2)
            )
          : parseFloat(descuentoPorsentajeVenta),
        precio_general: 0,
        precio_neto: newPrecioNetoProduct,
        precio_venta: newPrecioVentaProduct,
        unidad_maxima: false,
        utilidad: newUtilidadProduct,
      };

      if (product.precio_actual_object.unidad_maxima) {
        //Aqui se calcula la unidad por mayoreo (Cajas y costales)
        precio_actual_object.cantidad_unidad =
          product.precio_actual_object.cantidad_unidad;
        precio_actual_object.precio_general =
          newPrecioNetoProduct *
          parseFloat(product.precio_actual_object.cantidad_unidad);
        precio_actual_object.unidad_maxima = true;
      }
      const valorGranel =
        product.granel_producto.granel === true
          ? parseFloat(product.granel_producto.valor)
          : 1;
      //Guardar el nuevo producto en el arreglo
      const ieps_total_producto = parseFloat(
        (
          precio_actual_object.ieps_precio *
          valorGranel //aqui se multiplicaba por cantidad => * product.cantidad_venta
        ).toFixed(2)
      ); 
      const impuestos_total_producto = parseFloat(
        (
          (precio_actual_object.ieps_precio + precio_actual_object.iva_precio) *
          valorGranel //aqui se multiplicaba por cantidad => * product.cantidad_venta
        ).toFixed(2)
      );
      const iva_total_producto = parseFloat(
        (
          precio_actual_object.iva_precio *
          valorGranel //aqui se multiplicaba por cantidad => * product.cantidad_venta
        ).toFixed(2)
      );
      const subtotal_total_producto = parseFloat(
        (
          precio_actual_object.precio_venta *
          valorGranel //aqui se multiplicaba por cantidad => * product.cantidad_venta
        ).toFixed(2)
      );
      const total_total_producto = parseFloat(
        (
          precio_actual_object.precio_neto *
          valorGranel //aqui se multiplicaba por cantidad => * product.cantidad_venta
        ).toFixed(2)
      );
      const descuentoProducto = parseFloat(
        (
          parseFloat(precio_actual_object.dinero_descontado) *
          valorGranel //aqui se multiplicaba por cantidad => * product.cantidad_venta
        ).toFixed(2)
      );

      productosFinal.push({
        ...product,
        precio_actual_object,
        ieps_total_producto,
        impuestos_total_producto,
        iva_total_producto,
        subtotal_total_producto,
        total_total_producto,
        descuento_activo: true,
        descuento: {
          cantidad_unidad: product.precio_actual_object.cantidad_unidad,
          numero_precio: product.precio_actual_object.numero_precio,
          unidad_maxima: product.precio_actual_object.unidad_maxima,
          precio_general: product.precio_actual_object.precio_general,
          precio_neto: newPrecioNetoProduct,
          precio_venta: newPrecioVentaProduct,
          iva_precio: newIvaProduct,
          ieps_precio: newIepsProduct,
          utilidad: newUtilidadProduct,
          dinero_descontado: descuentoProducto,
          porciento: product.precio_actual_object.porciento
            ? parseFloat(
                (
                  parseFloat(product.precio_actual_object.porciento) +
                  parseFloat(porsentajeNewDescuento)
                ).toFixed(2)
              )
            : parseFloat(porsentajeNewDescuento),
        },
      });
      //Sumar los valores
      total += total_total_producto;
      subTotal += subtotal_total_producto;
      impuestos += impuestos_total_producto;
      iva += iva_total_producto;
      ieps += ieps_total_producto;
      descuento += descuentoProducto;
    }
    setVariables({
      productos: productosFinal,
      total,
      subTotal,
      impuestos,
      iva,
      ieps,
      descuento,
      descuento_general_activo: true,
      descuento_general: {
        cantidad_descontado: descuento,
        porciento: parseFloat(descuentoPorsentajeVenta),
        precio_con_descuento: total,
      },
    });
  };

  const aplicarDescuento = () => {
    let venta = { ...venta_original };
    const {
      productos,
      total,
      subTotal,
      impuestos,
      iva,
      ieps,
      descuento,
      descuento_general_activo,
      descuento_general,
    } = variables;
    /* localStorage.setItem(
      "DatosVentas",
      JSON.stringify({
        ...venta,
        productos: productosFinal,
        total,
        subTotal,
        impuestos,
        iva,
        ieps,
        descuento,
      })
    ); */
    setVentaBase({
      ...venta,
      productos,
      total,
      subTotal,
      impuestos,
      iva,
      ieps,
      descuento,
      descuento_general_activo,
      descuento_general,
    });
    setTotales({ ...totales, total, subtotal: subTotal, impuestos, descuento });
    setMontos({ ...montos, efectivo: total });
    handleClose();
  };

  const handleInvalidInput = (e) => {
    const { value } = e.target;
    if (!value || value === "0" || parseFloat(value) === 0) {
      setVariables({
        productos: venta_original.productos,
        total: venta_original.total,
        subTotal: venta_original.subTotal,
        impuestos: venta_original.impuestos,
        iva: venta_original.iva,
        ieps: venta_original.ieps,
        descuento: venta_original.descuento,
        descuento_general_activo: false,
        descuento_general: {
          cantidad_descontado: 0,
          porciento: 0,
          precio_con_descuento: 0,
        },
      });
      setDescuentoAplicarVenta(0);
      setDescuentoPorsentajeVenta(0);
    }
  };

  //states para calcular con estos y no se recalcule cuando se ejecuten las funciones
  const [precioVariable, setPrecioVariable] = useState(0);
  const [porcentVariable, setPorcentVariable] = useState(0);

  const [PRICE] = useDebounce(precioVariable, 700);
  const [PERCENT] = useDebounce(porcentVariable, 700);

  useEffect(() => {
    handlerChangeDiscountVenta(descuentoAplicarVenta);
  }, [PRICE]);

  useEffect(() => {
    handleChangePorsentDiscount(descuentoPorsentajeVenta);
  }, [PERCENT]);

  return (
    <Fragment>
      <Button
        size="large"
        variant="outlined"
        color="primary"
        startIcon={<Typography variant="h4"><b>%</b></Typography>}
        onClick={handleClickOpen}
        disabled={!venta_base}
      >
        Descuento
      </Button>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box textAlign="center" display="flex" justifyContent="space-between">
            <Typography variant="h5">Descuento</Typography>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={handleClose}
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">
            El descuento se aplica en el <b>SUBTOTAL</b> de la venta.
          </Alert>
          <Box my={1}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item md={6} xs={12}>
                <Typography>
                  <b>Dinero a descontar:</b>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="dinero-descuento"
                  id="form-venta-dinero-descuento"
                  value={descuentoAplicarVenta}
                  /* onChange={(e) => handlerChangeDiscountVenta(e)} */
                  onChange={(e) => {
                    setDescuentoAplicarVenta(e.target.value);
                    setPrecioVariable(e.target.value);
                  }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  onBlur={handleInvalidInput}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography>
                  <b>Porcentaje:</b>
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  id="form-venta-porsentaje-descuento"
                  variant="outlined"
                  value={descuentoPorsentajeVenta}
                  /* onChange={(e) => handleChangePorsentDiscount(e)} */
                  onChange={(e) => {
                    setDescuentoPorsentajeVenta(e.target.value);
                    setPorcentVariable(e.target.value);
                  }}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                  onBlur={handleInvalidInput}
                />
              </Grid>
            </Grid>
          </Box>
          <Box my={1}>
            <Grid container spacing={2}>
              <Grid item md={2} xs={12}>
                <Typography variant="subtitle2" align="center">
                  IVA
                </Typography>
                <Typography variant="subtitle2" align="center">
                  <b>${formatoMexico(variables.iva)}</b>
                </Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography variant="subtitle2" align="center">
                  IEPS
                </Typography>
                <Typography variant="subtitle2" align="center">
                  <b>${formatoMexico(variables.ieps)}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography variant="subtitle2" align="center">
                  Subtotal
                </Typography>
                <Typography variant="subtitle2" align="center">
                  <b>${formatoMexico(variables.subTotal)}</b>
                </Typography>
              </Grid>
              <Grid item md={2} xs={12}>
                <Typography variant="subtitle2" align="center">
                  Impuestos
                </Typography>
                <Typography variant="subtitle2" align="center">
                  <b>${formatoMexico(variables.impuestos)}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12}>
                <Typography variant="subtitle2" align="center">
                  Total
                </Typography>
                <Typography variant="subtitle2" align="center">
                  <b>${formatoMexico(variables.total)}</b>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => aplicarDescuento()}
            variant="contained"
            size="large"
            color="primary"
            autoFocus
            startIcon={<Done />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
