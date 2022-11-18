import React, { useCallback, useContext, useState } from "react";

import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import {
  Button,
  Dialog,
  makeStyles,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  Typography,
  TextField,
  Slider,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import TablaPreciosDescuentos from "./ListaPrecios";

import { REGISTRAR_DESCUENTOS } from "../../../../../gql/Catalogos/descuentos";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../../components/Layouts/BackDrop";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

const useStyles = makeStyles((theme) => ({
  avatarGroup: {
    "& > .MuiAvatarGroup-avatar": {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  },
  root: {
    width: 400,
  },
  rootSlice: {
    width: 350,
  },
  margin: {
    height: theme.spacing(3),
  },
  rootTable: {
    height: 300,
  },
}));

export default function DescuentoProductos({
  datos,
  productosRefetch,
  isOnline,
}) {
  const [CrearDescuentoUnidad] = useMutation(REGISTRAR_DESCUENTOS);
  const {
    setDatosPreciosProducto,
    preciosDescuentos,
    setPreciosDescuentos,
    preciosProductos,
    setPreciosProductos,
  } = useContext(RegProductoContext);

  let iva = datos.precios.iva;
  let ieps = datos.precios.ieps;
  // Precio compra sin impuestos y sin utilidad
  let PCSI = datos.precios.unidad_de_compra.precio_unitario_sin_impuesto;

  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [openDescuento, setOpenDescuento] = useState(false);
  const [cleanList, setCleanList] = useState(false);
  const [validate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [precioPrueba, setPrecioPrueba] = useState(0);
  const [value, setValue] = useState(0);

  const classes = useStyles();

  const handleCloseDescuentos = () => {
    if (datos.medidas_producto.length > 0) {
      setDatosPreciosProducto(datos.medidas_producto);
      setLoading(false);
    } else {
      setDatosPreciosProducto(datos.unidades_de_venta);
      setLoading(false);
    }
    setPrecioPrueba(0);
    setValue(0);
    preciosDescuentos.splice(0, preciosDescuentos.length);
  };

  const cerrarModal = () => {
    setOpenDescuento(!openDescuento);
    handleCloseDescuentos();
  };

  const verificarDatos = useCallback(
    (datos) => {
      for (let i = 0; i < datos.length; i++) {
        if (datos[i].descuento) {
          if (datos[i].descuento.porciento !== 0) {
            setValue(datos[i].descuento.porciento);
            if (datos.length === 1) {
              setPrecioPrueba(datos[i].descuento.precio_neto);
            }
          }
        }
      }
    },
    [datos]
  );

  let arrayDescuento = [];

  const obtenerPorcientoSlide = (event, newValue) => {
    setValue(newValue);
    preciosDescuentos.splice(0, preciosDescuentos.length);

    for (let i = 0; i < preciosProductos.length; i++) {
      let porcentaje = parseFloat(100 - newValue /* .toFixed(2) */); //Porcentaje para calculos de descuento
      let PVCDSI = 0; // Precio venta con descuento sin impuestos
      let dineroDescontado = 0;
      let cantidad_unidad = preciosProductos[i].precio_unidad.cantidad_unidad;

      PVCDSI = parseFloat(
        (preciosProductos[i].precio_unidad.precio_venta * porcentaje) / 100
      );
      dineroDescontado = parseFloat(
        preciosProductos[i].precio_unidad.precio_venta - PVCDSI
      );

      let iva_precio = parseFloat(
        PVCDSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
      );

      let ieps_precio = parseFloat(
        PVCDSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
      );
      let utilidad = parseFloat(((PVCDSI - PCSI) / PCSI) * 100);
      let precio_neto = parseFloat(PVCDSI + iva_precio + ieps_precio);
      let precio_general = parseFloat(precio_neto * cantidad_unidad);

      arrayDescuento = {
        _id: preciosProductos[i]._id,
        descuento_activo: true,
        descuento: {
          cantidad_unidad: cantidad_unidad,
          numero_precio: preciosProductos[i].precio_unidad.numero_precio,
          unidad_maxima: preciosProductos[i].precio_unidad.unidad_maxima,
          precio_general: parseFloat(precio_general.toFixed(2)),
          precio_neto: parseFloat(precio_neto.toFixed(2)),
          precio_venta: parseFloat(PVCDSI.toFixed(2)),
          iva_precio: parseFloat(iva_precio.toFixed(2)),
          ieps_precio: parseFloat(ieps_precio.toFixed(2)),
          utilidad: parseFloat(utilidad.toFixed(2)),
          porciento: newValue,
          dinero_descontado: parseFloat(dineroDescontado.toFixed(2)),
        },
      };

      setPrecioPrueba(parseFloat(precio_neto.toFixed(2)));
      if (preciosProductos.length !== 1) {
        preciosDescuentos.push(arrayDescuento);
      } else {
        setPreciosDescuentos([arrayDescuento]);
      }
    }
  };

  const obtenerPrecioText = (e) => {
    let valorText = parseFloat(e.target.value);
    if (preciosProductos.length === 1) {
      setPrecioPrueba(valorText);

      let suma_impuestos =
        parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
        parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
      let PVSI = parseFloat(valorText / (suma_impuestos + 1));

      let cantidad_unidad = preciosProductos[0].precio_unidad.cantidad_unidad;
      let dineroDescontado = 0;
      let PVCDSI = 0; // Precio venta con descuento sin impuestos
      let porcentaje = parseFloat(
        (PVSI / preciosProductos[0].precio_unidad.precio_venta) * 100
      );
      let descuento = parseFloat(100 - porcentaje);

      PVCDSI = parseFloat(
        (preciosProductos[0].precio_unidad.precio_venta * porcentaje) / 100
      );
      dineroDescontado = parseFloat(
        preciosProductos[0].precio_unidad.precio_venta - PVCDSI
      );

      let iva_precio = parseFloat(
        PVCDSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
      );
      let ieps_precio = parseFloat(
        PVCDSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
      );
      let utilidad = parseFloat(((PVCDSI - PCSI) / PCSI) * 100);
      let precio_neto = parseFloat(PVCDSI + iva_precio + ieps_precio);
      let precio_general = parseFloat(precio_neto * cantidad_unidad);

      arrayDescuento = {
        _id: preciosProductos[0]._id,
        descuento_activo: true,
        descuento: {
          cantidad_unidad: cantidad_unidad,
          numero_precio: preciosProductos[0].precio_unidad.numero_precio,
          unidad_maxima: preciosProductos[0].precio_unidad.unidad_maxima,
          precio_general: parseFloat(precio_general.toFixed(2)),
          precio_neto: parseFloat(precio_neto.toFixed(2)),
          precio_venta: parseFloat(PVCDSI.toFixed(2)),
          iva_precio: parseFloat(iva_precio.toFixed(2)),
          ieps_precio: parseFloat(ieps_precio.toFixed(2)),
          utilidad: parseFloat(utilidad.toFixed(2)),
          porciento: parseFloat(descuento.toFixed(2)),
          dinero_descontado: parseFloat(dineroDescontado.toFixed(2)),
        },
      };

      setValue(parseFloat(descuento.toFixed(2)));
      setPreciosDescuentos([arrayDescuento]);
    }
  };

  function valuetext(e) {
    return `${e}`;
  }

  const saveData = async () => {
    setLoading(true);
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    try {
      await CrearDescuentoUnidad({
        variables: {
          input: {
            descuentos: preciosDescuentos,
          },
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,

        },
      });
      handleCloseDescuentos();
      productosRefetch();
      setValue(0);
      setPreciosProductos([]);
      setPreciosDescuentos([]);
      setCleanList(!cleanList);
      setAlert({
        message: "¡Listo descuentos realizados!",
        status: "success",
        open: true,
      });
    } catch (error) {
      setAlert({
        message: "¡Oh no, ocurrio un problema con el servidor!",
        status: "error",
        open: true,
      });
    }
  };

  const validacion = () => {
    if (datos.medidas_producto.length > 0) {
      for (let i = 0; i < datos.medidas_producto.length; i++) {
        if (datos.medidas_producto[i]?.descuento_activo === true) {
          return "primary";
        } else {
          return "default";
        }
      }
    } else {
      for (let i = 0; i < datos.unidades_de_venta.length; i++) {
        if (datos.unidades_de_venta[i]?.descuento_activo === true) {
          return "primary";
        } else {
          return "default";
        }
      }
    }
  };

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <IconButton
        color={validacion()}
        onClick={cerrarModal}
        size="medium"
        disabled={
          !isOnline ||
          (datos.inventario_general &&
            datos.inventario_general.length > 0 &&
            datos.inventario_general[0].eliminado === true)
        }
      >
        <LocalOfferIcon />
      </IconButton>
      <Dialog
        open={openDescuento}
        onClose={handleCloseDescuentos}
        fullWidth
        maxWidth="lg"
      >
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <DialogTitle>
          <Grid container>
            <Box flexGrow={1} display="flex" alignItems="center">
              {"Descuento de Producto"}
            </Box>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={cerrarModal}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center">
            <Typography>
              <b>Nombre comercial: </b>
              {datos.datos_generales.nombre_comercial
                ? datos.datos_generales.nombre_comercial
                : "-"}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography>
              <b>Nombre genérico: </b>
              {datos.datos_generales.nombre_generico
                ? datos.datos_generales.nombre_generico
                : "-"}
            </Typography>
          </Box>
          <Grid container>
            <Grid item lg={8} md={6} xs={12}>
              <Box p={1}>
                <TablaPreciosDescuentos
                  verificarDatos={verificarDatos}
                  productosRefetch={productosRefetch}
                  datos={datos}
                  value={value}
                  cleanList={cleanList}
                  setCleanList={setCleanList}
                  setPrecioPrueba={setPrecioPrueba}
                  setLoading={setLoading}
                  loading={loading}
                />
              </Box>
            </Grid>
            <Grid item lg={4} md={6} xs={12}>
              <Box mt={5} dislay="flex" justifyContent="center">
                <div className={classes.root}>
                  <Box textAlign="center">
                    <Typography id="discrete-slider-always" gutterBottom>
                      <b>Porcentaje de descuento</b>
                    </Typography>
                  </Box>
                  <Box my={5} />
                  <Box
                    display="flex"
                    justifyContent="center"
                    justifyItems="center"
                    className={classes.rootSlice}
                  >
                    <Slider
                      disabled={preciosProductos.length === 0 ? true : false}
                      getAriaValueText={valuetext}
                      value={value}
                      aria-labelledby="discrete-slider-small-steps"
                      valueLabelDisplay="auto"
                      onChange={obtenerPorcientoSlide}
                    />
                  </Box>
                </div>
              </Box>
              <Box mt={5} display="flex" justifyContent="center">
                {preciosProductos.length === 1 ? (
                  <div>
                    <Typography>Precio con Descuento</Typography>
                    <TextField
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      size="small"
                      variant="outlined"
                      value={precioPrueba}
                      onChange={(e) => obtenerPrecioText(e)}
                    />
                  </div>
                ) : null}
              </Box>
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  disabled={
                    preciosProductos.length === 0 || validate === true
                      ? true
                      : false
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={saveData}
                >
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
