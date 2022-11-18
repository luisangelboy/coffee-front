import React, { Fragment, useContext, useState } from "react";
import {
  Box,
  Button,
  DialogContent,
  InputAdornment,
  Grid,
  Paper,
  TextField,
  Typography,
  DialogActions,
} from "@material-ui/core";
import useStyles from "../styles";
import moment from "moment";
import "moment/locale/es";
import { CREAR_COTIZACION } from "../../../gql/Ventas/cotizaciones";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { useMutation } from "@apollo/client";
import {
  formatoMexico,
  generateCodeNumerico,
} from "../../../config/reuserFunctions";
import { Alert } from "@material-ui/lab";
import BackdropComponent from "../../../components/Layouts/BackDrop";
import RemoveCircleTwoToneIcon from "@material-ui/icons/RemoveCircleTwoTone";

export default function NuevaCotizacion({ setOpen }) {
  const { setAlert } = useContext(VentasContext);

  const [CrearCotizacion] = useMutation(CREAR_COTIZACION);

  const datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
  } = useContext(VentasContext);
  const [newCotizacion, setNewCotizacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preciosDescuentos, setPreciosDescuentos] = useState({
    productos: datosVentas?.productos,
    subTotal: datosVentas?.subTotal,
    impuestos: datosVentas?.impuestos,
    iva: datosVentas?.iva,
    ieps: datosVentas?.ieps,
    total: datosVentas?.total,
  });
  const [totalDescount, setTotalDescount] = useState(
    preciosDescuentos
      ? preciosDescuentos?.descuento_general?.precio_con_descuento
      : datosVentas?.total
  );
  const [porcentaje, setPorcentaje] = useState(
    preciosDescuentos?.descuento_general?.porciento
      ? preciosDescuentos?.descuento_general?.porciento
      : 0
  );
  let descuento_general = [];

  let original_datos_Ventas = datosVentas;

  const classes = useStyles();

  const obtenerDatos = (e) => {
    setNewCotizacion({ ...newCotizacion, [e.target.name]: e.target.value });
  };

  const crearCotizacion = async () => {
    try {
      if (!newCotizacion.fecha_vencimiento) {
        setAlert({
          message: `Por favor completa los datos necesarios`,
          status: "error",
          open: true,
        });
        return null;
      } else {
        setLoading(true);
        await CrearCotizacion({
          variables: {
            input: {
              folio: generateCodeNumerico(8),
              descuento: preciosDescuentos.descuento,
              ieps: preciosDescuentos.ieps,
              impuestos: preciosDescuentos.impuestos,
              iva: preciosDescuentos.iva,
              monedero: datosVentas.monedero,
              subTotal: preciosDescuentos.subTotal,
              total: preciosDescuentos.total,
              venta_cliente: datosVentas.cliente ? true : false,
              montos_en_caja: {},
              //credito: newCotizacion.tipo_venta === 'CREDITO' ? true : false,
              descuento_general_activo: porcentaje > 0 ? true : false,
              descuento_general: {
                porciento: parseFloat(porcentaje),
                precio_con_descuento: preciosDescuentos.total,
                cantidad_descontado: parseFloat(totalDescount),
              },
              dias_de_credito_venta: "",
              fecha_de_vencimiento_credito: "",
              fecha_vencimiento_cotizacion: newCotizacion.fecha_vencimiento,
              cliente: datosVentas.cliente ? datosVentas.cliente : {},
              productos: preciosDescuentos.productos,
              /* inventario_general: datosVentas.inventario_general, */
            },
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
            usuario: sesion._id,
            caja: turnoEnCurso.id_caja,
          },
        });

        setAlert({
          message: `La cotización se realizó correctamente.`,
          status: "success",
          open: true,
        });
      }
      setOpen(false);
      setLoading(false);
      localStorage.removeItem("DatosVentas");
      localStorage.removeItem("VentaOriginal");
      setUpdateTablaVentas(!updateTablaVentas);

      setDatosVentasActual({
        subTotal: 0,
        total: 0,
        impuestos: 0,
        iva: 0,
        ieps: 0,
        descuento: 0,
        monedero: 0,
      });
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Algo salió mal.`,
        status: "error",
        open: true,
      });
      if (error.networkError.result) {
        console.log(error.networkError.result.errors);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors.message);
      }
    }
  };

  const obtenerPorciento = (e) => {
    let newValue = e.target.value;

    setPorcentaje(newValue);
    if (e !== "") {
      let ventaSubtotal = original_datos_Ventas?.subTotal;
      const val =
        newValue < 10
          ? parseFloat(`0.0${newValue.replace(".", "")}`)
          : parseFloat(`0.${newValue.replace(".", "")}`);
      const porsent = ventaSubtotal * val;
      setTotalDescount(porsent.toFixed(2));
    }
  };

  const obtenerPrecioText = (e) => {
    try {
      var valorText = e.target.value !== "" ? parseFloat(e.target.value) : "";
      var ventaSubtotal = original_datos_Ventas?.subTotal;
      setTotalDescount(valorText);
      var porcentaje =
        valorText === ""
          ? 0
          : parseFloat(((valorText / ventaSubtotal) * 100).toFixed(2));
      var descuento = valorText === "" ? 0 : parseFloat(porcentaje.toFixed(2));
      setPorcentaje(descuento);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarDescuento = () => {
    try {
      descuento_general = {
        productos: datosVentas?.productos,
        subTotal: datosVentas?.subTotal,
        impuestos: datosVentas?.impuestos,
        iva: datosVentas?.iva,
        ieps: datosVentas?.ieps,
        total: datosVentas?.total,
      };
      setPorcentaje(0);
      setTotalDescount("");
      setPreciosDescuentos(descuento_general);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCalculateNewDiscountVenta = () => {
    //let venta = JSON.parse(localStorage.getItem("DatosVentas"));
    //Declarar la variables necesarias (total, subTotal, impuestos, iva ieps, productosFinal)
    let total = 0,
      subTotal = 0,
      impuestos = 0,
      iva = 0,
      ieps = 0,
      descuento = 0;
    let productosFinal = [];
    //Activar loading

    //Obtener productos
    const productStorage = original_datos_Ventas?.productos;
    //Mapearlos
    for (let i = 0; i < productStorage.length; i++) {
      //Obtener el producto valor i
      const product = productStorage[i];
      let precio_actual_object = {};
      const porsentajeNewDescuento = parseFloat(porcentaje);

      const dineroDescontadoDescuento =
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
            );
      //Calcular los nuevos precios
      const newPrecioVentaProduct = parseFloat(
        (
          product.precio_actual_object.precio_venta - dineroDescontadoDescuento
        ).toFixed(2)
      );
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
                parseFloat(porcentaje)
              ).toFixed(2)
            )
          : parseFloat(porcentaje),
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
          valorGranel *
          product.cantidad_venta
        ).toFixed(2)
      );
      const impuestos_total_producto = parseFloat(
        (
          (precio_actual_object.ieps_precio + precio_actual_object.iva_precio) *
          valorGranel *
          product.cantidad_venta
        ).toFixed(2)
      );
      const iva_total_producto = parseFloat(
        (
          precio_actual_object.iva_precio *
          valorGranel *
          product.cantidad_venta
        ).toFixed(2)
      );
      const subtotal_total_producto = parseFloat(
        (
          precio_actual_object.precio_venta *
          valorGranel *
          product.cantidad_venta
        ).toFixed(2)
      );
      const total_total_producto = parseFloat(
        (
          precio_actual_object.precio_neto *
          valorGranel *
          product.cantidad_venta
        ).toFixed(2)
      );
      const descuentoProducto = parseFloat(
        (
          parseFloat(precio_actual_object.dinero_descontado) *
          valorGranel *
          product.cantidad_venta
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
      });
      //Sumar los valores
      total += total_total_producto;
      subTotal += subtotal_total_producto;
      impuestos += impuestos_total_producto;
      iva += iva_total_producto;
      ieps += ieps_total_producto;
      descuento += descuentoProducto;
    }

    descuento_general = {
      productos: productosFinal,
      impuestos,
      subTotal,
      iva,
      ieps,
      total,
      descuento,
    };
    setPreciosDescuentos(descuento_general);
  };

  React.useEffect(() => {
    try {
      handleCalculateNewDiscountVenta();
    } catch (error) {}
  }, [porcentaje]);

  return (
    <Fragment>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <Typography>
              <b>Usuario:</b>
            </Typography>
            <Box display="flex">
              <TextField
                fullWidth
                size="small"
                disabled={true}
                variant="outlined"
                onChange={obtenerDatos}
                value={sesion ? sesion.nombre : ""}
              />
            </Box>
          </Grid>
          <Grid item md={datosVentas?.cliente?.nombre_cliente ? 2 : 3} xs={12}>
            <Typography>
              <b>Cliente:</b>
            </Typography>
            <Box display="flex">
              <TextField
                fullWidth
                size="small"
                disabled={true}
                onChange={obtenerDatos}
                variant="outlined"
                value={
                  datosVentas?.cliente?.nombre_cliente
                    ? datosVentas?.cliente?.nombre_cliente
                    : "Público General"
                }
              />
            </Box>
          </Grid>
          {datosVentas?.cliente?.nombre_cliente ? (
            <Grid item md={2} xs={12}>
              <Typography>
                <b>No. Cliente:</b>
              </Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  disabled={true}
                  onChange={obtenerDatos}
                  variant="outlined"
                  value={datosVentas ? datosVentas.cliente?.numero_cliente : ""}
                />
              </Box>
            </Grid>
          ) : null}

          <Grid item md={datosVentas?.cliente?.nombre_cliente ? 2 : 3} xs={12}>
            <Typography>
              <b>Fecha:</b>
            </Typography>
            <Box display="flex">
              <TextField
                fullWidth
                size="small"
                disabled={true}
                onChange={obtenerDatos}
                variant="outlined"
                value={moment().locale("es-mx").format("L")}
              />
            </Box>
          </Grid>
          <Grid item md={3} xs={12}>
            <Typography>
              <b>Fecha Vencimiento:</b>
            </Typography>
            <Box display="flex">
              <TextField
                fullWidth
                type="date"
                onChange={obtenerDatos}
                size="small"
                name="fecha_vencimiento"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
        <BackdropComponent loading={loading} />

        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Box mt={4}>
              <Paper elevation={3}>
                <Box textAlign={"center"}>
                  <Typography style={{ fontSize: 17 }}>
                    <b>Agregar descuento</b>
                  </Typography>
                  <Alert severity="info">
                    El descuento se aplica apartir del <b>SUBTOTAL</b>
                  </Alert>
                </Box>
                <Box p={2}>
                  <Grid container spacing={2}>
                    <Grid item md={6}>
                      <Typography>
                        <b>Porcentaje:</b>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="descuento"
                        id="form-venta-porsentaje-descuento"
                        variant="outlined"
                        value={porcentaje}
                        onChange={(e) => obtenerPorciento(e)}
                        type="number"
                        disabled={false}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">%</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <Typography>
                        <b>Dinero a descontar</b>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name="precioConDescuento"
                        onChange={obtenerPrecioText}
                        value={totalDescount}
                        className={classes.input}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      variant="text"
                      color="secondary"
                      size="medium"
                      onClick={eliminarDescuento}
                      startIcon={<RemoveCircleTwoToneIcon />}
                    >
                      Quitar descuento
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Box mt={3} width="100%">
              <Box m={1}>
                <Typography style={{ fontSize: 17 }}>
                  <b>No. Productos: </b> {datosVentas?.productos.length}
                </Typography>
              </Box>
              <Box m={1}>
                <Typography style={{ fontSize: 17 }}>
                  <b>Subtotal:</b> $
                  {preciosDescuentos.subTotal
                    ? formatoMexico(preciosDescuentos.subTotal)
                    : 0}
                </Typography>
              </Box>
              <Box m={1}>
                <Typography style={{ fontSize: 17 }}>
                  <b>Impuestos:</b> $
                  {preciosDescuentos.impuestos
                    ? formatoMexico(preciosDescuentos.impuestos)
                    : 0}
                </Typography>
              </Box>
              <Box m={1}>
                <Typography style={{ fontSize: 16 }}>
                  <b>IVA:</b> $
                  {preciosDescuentos.iva
                    ? formatoMexico(preciosDescuentos.iva)
                    : 0}
                </Typography>
              </Box>
              <Box m={1}>
                <Typography style={{ fontSize: 16 }}>
                  <b>IEPS:</b> $
                  {preciosDescuentos.ieps
                    ? formatoMexico(preciosDescuentos.ieps)
                    : 0}
                </Typography>
              </Box>
              <Box m={1}>
                <Typography style={{ fontSize: 17 }}>
                  <b>Descuento:</b>{" "}
                  <b style={{ color: "green" }}>
                    ${totalDescount ? formatoMexico(totalDescount) : 0}
                  </b>
                </Typography>
              </Box>
            </Box>
            <Box display="flex">
              <Typography style={{ fontSize: 27 }}>
                {`Total: `}
                <b>
                  $
                  {preciosDescuentos.total
                    ? formatoMexico(preciosDescuentos.total)
                    : 0}
                </b>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={crearCotizacion}
        >
          Guardar
        </Button>
      </DialogActions>
    </Fragment>
  );
}
