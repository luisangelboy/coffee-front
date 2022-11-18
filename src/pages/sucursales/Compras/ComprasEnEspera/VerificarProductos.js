import React, { Fragment, useCallback, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Slide from "@material-ui/core/Slide";
import { CheckCircle, Done, VerifiedUser } from "@material-ui/icons";
import { Box, CircularProgress } from "@material-ui/core";

import { useLazyQuery } from "@apollo/client";
import { OBTENER_PRODUCTOS } from "../../../../gql/Catalogos/productos";
import ErrorPage from "../../../../components/ErrorPage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VerificarProductosCompras({
  compra,
  nuevoArray,
  setNuevoArray,
  setVerificado,
}) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (success) {
      setVerificado(true);
    }
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
        startIcon={<VerifiedUser />}
      >
        Continuar compra
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        /* onClose={() => handleClose()} */
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        aria-labelledby="dialog-verificarcompra-title"
        aria-describedby="dialog-verificarcompra-description"
        fullWidth
        maxWidth="sm"
      >
        <ModalVerificacion
          handleClose={handleClose}
          compra={compra}
          handleClickOpen={handleClickOpen}
          open={open}
          nuevoArray={nuevoArray}
          setNuevoArray={setNuevoArray}
          setSuccess={setSuccess}
        />
      </Dialog>
    </div>
  );
}

const ModalVerificacion = ({
  handleClose,
  compra,
  handleClickOpen,
  open,
  nuevoArray,
  setNuevoArray,
  setSuccess,
}) => {
  const [loadingVerificacion, setLoadingVerificacion] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let count = 0;

  /* Queries */
  const [getQuery, { loading, data, error }] = useLazyQuery(OBTENER_PRODUCTOS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      almacen: compra.almacen.id_almacen,
      limit: 0,
      offset: 0
    },
    fetchPolicy: "network-only",
  });

  if (data) count = 1;

  useEffect(() => {
    if (open && count === 0) {
      getQuery();
      count = 1;
    }
  }, [handleClickOpen]);

  useEffect(() => {
    if (data) {
      verificarProductos();
    }
  }, [data]);

  if (loading) {
    return (
      <Fragment>
        <DialogContent
          style={{
            height: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <DialogContentText id="dialog-verificarcompra-description">
            Si ya no hay existencias en tu producto se marcaran en la tabla y se
            quitaran al retomar la compra para no causar conflictos, podras
            editar tu compra mas adelante
          </DialogContentText>
          <Box display="flex" alignItems="center">
            <CircularProgress
              size={18}
              color="primary"
              style={{ marginRight: 8 }}
            />
            Obteniendo productos de la Base de datos...
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        <DialogContent>
          <ErrorPage error={error} altura={130} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Fragment>
    );
  }

  let obtenerProductos = [];
  if (data) obtenerProductos = data.obtenerProductos.docs;

  /* console.log(compra); */

  function verificarProductos() {
    setLoadingVerificacion(true);
    const { productos } = compra;
    let productos_nuevos = [...productos];
    let conflicto = false;

    for (let i = 0; i < productos.length; i++) {
      const productosCompra = productos[i];
      let copy_producto_compra = { ...productosCompra };
      let copy_producto = { ...productosCompra.producto };

      //Filtrar los productos
      const productos_filtrados = obtenerProductos.filter(
        (res) => res._id === copy_producto_compra.id_producto
      );

      const { precios, unidades_de_venta, presentaciones } = copy_producto;

      const precios_base = productos_filtrados[0].precios;
      const unidades_base = productos_filtrados[0].unidades_de_venta;
      const presentaciones_base = productos_filtrados[0].medidas_producto;

      //verificacion de Precios
      if (
        precios.unidad_de_compra.cantidad !==
          precios_base.unidad_de_compra.cantidad ||
        precios.unidad_de_compra.precio_unitario_con_impuesto !==
          precios_base.unidad_de_compra.precio_unitario_con_impuesto ||
        precios.unidad_de_compra.unidad !== precios_base.unidad_de_compra.unidad
      ) {
        /* console.log("conflicto precios"); */
        //si son diferentes se agrega los precios_base al compra_nueva
        copy_producto.precios = precios_base;
        copy_producto_compra.producto = copy_producto;
        copy_producto_compra.conflicto = true;
        productos_nuevos[i] = copy_producto_compra;
        conflicto = true;
      }
      //verificacion de Unidades de venta
      const u_default = unidades_de_venta.filter((res) => res.default === true);
      const u_default_base = unidades_base.filter(
        (res) => res.default === true
      );
      if (
        u_default[0].cantidad !== u_default_base[0].cantidad ||
        u_default[0].precio !== u_default_base[0].precio ||
        u_default[0].unidad !== u_default_base[0].unidad
      ) {
        //si son diferentes se agrega los precios_base al compra_nueva
        copy_producto.unidades_de_venta = unidades_base;
        copy_producto_compra.producto = copy_producto;
        copy_producto_compra.conflicto = true;
        productos_nuevos[i] = copy_producto_compra;
        conflicto = true;
        /* console.log("conflicto unidades"); */
      }

      //verificacion de Presentaciones si hay presentaciones

      if (presentaciones.length > 0) {
        /* console.log(presentaciones, presentaciones_base); */
        if (presentaciones_base.length > 0) {
          if (presentaciones.length === presentaciones_base.length) {
            for (let x = 0; x < presentaciones.length; x++) {
              const present = presentaciones[x];
              for (let y = 0; y < presentaciones_base.length; y++) {
                const present_base = presentaciones_base[y];

                if (
                  present.medida._id === present_base.medida._id &&
                  present.color._id === present_base.color._id &&
                  present.almacen === present_base.almacen
                ) {
                  if (
                    present.cantidad !== present_base.cantidad ||
                    present.precio !== present_base.precio
                  ) {
                    //si son diferentes se agrega las presentaciones_base al compra_nueva
                    copy_producto.presentaciones = presentaciones_base;
                    copy_producto_compra.producto = copy_producto;
                    copy_producto_compra.conflicto = true;
                    productos_nuevos[i] = copy_producto_compra;
                    conflicto = true;
                    /* console.log("conflicto presentaciones"); */
                  }
                }
              }
            }
          } else {
            //si son diferentes se agrega las presentaciones al compra_nueva
            copy_producto.presentaciones = presentaciones_base;
            copy_producto_compra.producto = copy_producto;
            copy_producto_compra.conflicto = true;
            productos_nuevos[i] = copy_producto_compra;
            conflicto = true;
            /* console.log("conflicto diferentes presentaciones "); */
          }
        } else {
          //si no hay se agrega las presentaciones al compra_nueva
          copy_producto_compra.conflicto = true;
          productos_nuevos[i] = copy_producto_compra;
          conflicto = true;
          /* console.log("conflicto sin presentaciones "); */
        }
      }
    }

    const nuevo_producto_compra = [];
    let subtotal = 0;
    let impuestos = 0;
    let total = 0;
    if (conflicto) {
      for (let k = 0; k < productos_nuevos.length; k++) {
        const datosProducto = { ...productos_nuevos[k] };

        if (datosProducto.producto.datos_generales.tipo_producto !== "OTROS") {
          //si es calzado o ropa
          //CANTIDADES
          if (datosProducto.producto.presentaciones.length > 0) {
            datosProducto.cantidad = 0;
            datosProducto.producto.presentaciones.forEach((presentacion) => {
              const { cantidad, cantidad_nueva } = presentacion;
              let nueva = cantidad_nueva ? cantidad_nueva : 0;
              datosProducto.cantidad += cantidad + nueva;
            });
            if (isNaN(datosProducto.cantidad)) datosProducto.cantidad = 0;
            datosProducto.cantidad_total = datosProducto.cantidad;
          } else {
            datosProducto.cantidad = 0;
            datosProducto.cantidad_total = datosProducto.cantidad;
          }
        } else {
          //Si es una unidad normal

          //CANTIDADES
          const { cantidad_regalo, cantidad, unidad_regalo } = datosProducto;
          //convertir todo a la unidad media y sumar (Pz, Kg, Lt)
          const factor =
            datosProducto.producto.precios.unidad_de_compra.cantidad;
          const cantiad_media = cantidad * factor;
          let cantidad_regalo_media =
            unidad_regalo === "Pz" ||
            unidad_regalo === "Kg" ||
            unidad_regalo === "Lt"
              ? cantidad_regalo
              : cantidad_regalo * factor;
          let cantidad_total_media = cantiad_media + cantidad_regalo_media;

          //si factor es > 1 es caja o costal y dividir unidad media entre factor y si no mandar la cantidad total media;
          if (factor > 1) {
            datosProducto.cantidad_regalo = cantidad_regalo_media / factor;
            datosProducto.cantidad_total = cantidad_total_media / factor;
          } else {
            datosProducto.cantidad_regalo = cantidad_regalo_media;
            datosProducto.cantidad_total = cantidad_total_media;
          }
        }

        //PRECIOS
        const {
          iva,
          ieps,
          precio_con_impuesto,
          precio_sin_impuesto,
        } = datosProducto.producto.precios.precio_de_compra;

        datosProducto.total_con_descuento = precio_con_impuesto;
        datosProducto.costo = precio_con_impuesto;
        datosProducto.iva_total = iva * datosProducto.cantidad_total;
        datosProducto.ieps_total = ieps * datosProducto.cantidad_total;
        datosProducto.impuestos = (iva + ieps) * datosProducto.cantidad_total;
        datosProducto.subtotal =
          precio_sin_impuesto * datosProducto.cantidad_total;
        datosProducto.total =
          precio_con_impuesto * datosProducto.cantidad_total;

        if (datosProducto.descuento_porcentaje > 0) {
          datosProducto.descuento_precio = Math.round(
            (precio_con_impuesto * datosProducto.descuento_porcentaje) / 100
          );
          datosProducto.total_con_descuento =
            precio_con_impuesto - datosProducto.descuento_precio;
        }

        subtotal += datosProducto.subtotal;
        impuestos += datosProducto.impuestos;
        total +=
          datosProducto.total_con_descuento * datosProducto.cantidad_total;

        nuevo_producto_compra.push(datosProducto);
      }
      setNuevoArray({
        _id: compra._id,
        almacen: compra.almacen,
        proveedor: compra.proveedor,
        productos: nuevo_producto_compra,
        en_espera: compra.en_espera,
        fecha_registro: compra.fecha_registro,
        impuestos,
        subtotal,
        total,
      });
    } else {
      setNuevoArray(compra);
    }

    setTimeout(() => {
      setLoadingVerificacion(false);
      setSuccess(true);
    }, 1500);
  }

  return (
    <Fragment>
      <DialogContent
        style={{
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <DialogContentText id="dialog-verificarcompra-description">
          Si ya no hay existencias en tu producto se marcaran en la tabla y se
          quitaran al retomar la compra para no causar conflictos, podras editar
          tu compra mas adelante
        </DialogContentText>
        {loadingVerificacion ? (
          <Box display="flex" alignItems="center">
            <CircularProgress
              size={18}
              color="primary"
              style={{ marginRight: 8 }}
            />
            Verificando existencias en tus productos...
          </Box>
        ) : null}
        {!loadingVerificacion ? (
          <Box display="flex" alignItems="center">
            <CheckCircle color="primary" style={{ marginRight: 8 }} />
            Listo, producto verificados
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        {loadingVerificacion ? (
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
        ) : (
          <Button onClick={handleClose} color="primary" startIcon={<Done />}>
            Aceptar
          </Button>
        )}
      </DialogActions>
    </Fragment>
  );
};
