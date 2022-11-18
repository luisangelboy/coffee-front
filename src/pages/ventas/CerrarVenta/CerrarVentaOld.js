import React, { useState, useEffect, useContext, Fragment } from "react";
import useStyles from "../styles";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Slide,
  TextField,
  Typography,
  InputAdornment,
  DialogTitle,
  Container,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import { FcDonate, FcShop } from "react-icons/fc";
import CloseIcon from "@material-ui/icons/Close";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ClearIcon from "@material-ui/icons/Clear";
import { Close, Done, Edit } from "@material-ui/icons";
import { FcBusinessman, FcSalesPerformance } from "react-icons/fc";
import { formatoMexico, numerosRandom } from "../../../config/reuserFunctions";
import { formaPago } from "../../sucursales/Facturacion/catalogos";
import { CREAR_VENTA } from "../../../gql/Ventas/ventas_generales";
import { useMutation } from "@apollo/client";
import moment from "moment";

import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import { Alert } from "@material-ui/lab";
import CartIcon from "../../../icons/ventas/cart.svg"
import MoneyIcon from "../../../icons/ventas/money.svg"
import TarjetaIcon from "../../../icons/ventas/tarjeta-de-credito.svg"
import TransfeIcon from "../../../icons/ventas/transferencia-bancaria.svg"
import ChequeIcon from "../../../icons/ventas/cheque.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CerrarVenta() {
  const classes = useStyles();
  const [cambio, setCambio] = useState(false);
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));

  const abrirCajon = () => {
    setCambio(!cambio);
  };
  const [open, setOpen] = useState(false);
  const [openModalDescuento, setOpenModalDescuento] = useState(false);
  const [recalcular, setRecalcular] = useState(false);
  //Datos del context
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
    openBackDrop,
    setOpenBackDrop,
    setVentaRetomada,
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);
  //States de venta
  const [totalVenta, setTotalVenta] = useState(0);
  const [totalVentaConstante, setTotalVentaConstante] = useState(0);
  const [subtotalVenta, setSubtotalVenta] = useState(0);
  const [impuestosVenta, setImpuestosVenta] = useState(0);
  const [montoPagado, setMontoPagado] = useState(0);
  const [cambioVenta, setCambioVenta] = useState(0);
  const [datosCliente, setDatosCliente] = useState({});
  const [monedero, setMonedero] = useState(0);
  const [descuentoVenta, setDescuentoVenta] = useState(0);
  const [fechaVencimientoDate, setfechaVencimientoDate] = useState("");
  /* const [valorPuntoProducto, setValorPuntoProducto] = useState(0.5); */
  const [valorFinalCambioPuntos, setValorFinalCambioPuntos] = useState(0);
  const [monederoTotal, setMonederoTotal] = useState(0);
  const [ventaActual, setVentaActual] = useState(0);
  const [editableClient, setEditableClient] = useState(true);
  const [visible, setVisible] = useState(false);

  //States descuento venta
  const [descuentoAplicarVenta, setDescuentoAplicarVenta] = useState(0);
  const [descuentoPorsentajeVenta, setDescuentoPorsentajeVenta] = useState(0);

  // const [descuentoAplicadoVenta, setDescuentoAplicadoVenta] = useState(0);
  const [ventaOriginal, setVentaOriginal] = useState(0);
  const [creditoActivo, setCreditoActivo] = useState(false);

  //States de los montos a pagar
  const [monto_efectivo_real, setMontoEfectivo] = useState(0);

  const [efectivo, setEfectivo] = useState(0);
  const [tarjeta, setTarjeta] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [transferencia, setTransferencia] = useState(0);
  const [cheque, setCheque] = useState(0);

  const [efectivoConstante, setEfectivoConstante] = useState(0);
  const [limite_superado, setLimiteSuperado] = useState(false);

  let venta_original = JSON.parse(localStorage.getItem("VentaOriginal"));

  const [createVenta] = useMutation(CREAR_VENTA);
  const handleClickOpen = () => {
    if (open) {
      localStorage.setItem("DatosVentas", JSON.stringify(venta_original));
    }
    setOpen(!open);
    setRecalcular(!recalcular);
    //TODO: Guardar la venta original en un context u localstorage por si se quiere resetear el descuento
  };

  const hancleClickCerrarVentaCambio = () => {
    setCambio(!cambio);

    //Limpiar el storage de ventas
    localStorage.removeItem("DatosVentas");
    localStorage.removeItem("VentaOriginal");
    /* localStorage.setItem(
      "DatosVentas",
      JSON.stringify({
        cliente: {},
        venta_cliente: false,
        monedero: 0,
        productos: [],
        total: 0,
        subTotal: 0,
        impuestos: 0,
        iva: 0,
        ieps: 0,
        descuento: 0,
      })
    ); */
    //Actualizar la tabla de ventas
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
    setDatosVentasActual({
      subTotal: 0,
      total: 0,
      impuestos: 0,
      iva: 0,
      ieps: 0,
      descuento: 0,
      monedero: 0,
    });
    //Quitar venta a credito
    setCreditoActivo(false);
    //limpiar states
  };

  const resetStates = () => {
    setTotalVenta(0);
    setTotalVentaConstante(0);
    setSubtotalVenta(0);
    setImpuestosVenta(0);
    setMontoPagado(0);
    setCambioVenta(0);
    setDatosCliente({});
    setMonedero(0);
    setDescuentoVenta(0);
    setfechaVencimientoDate("");
    /* setValorPuntoProducto(0.5); */
    setValorFinalCambioPuntos(0);
    setMonederoTotal(0);
    setVentaActual(0);
    setEditableClient(true);
    setVisible(false);

    //States descuento venta
    setDescuentoAplicarVenta(0);
    setDescuentoPorsentajeVenta(0);
    setVentaOriginal(0);
    setCreditoActivo(false);

    //States de los montos a pagar
    setMontoEfectivo(0);
    setEfectivo(0);
    setEfectivoConstante(0);
    setTarjeta(0);
    setPuntos(0);
    setTransferencia(0);
    setCheque(0);
    setVentaRetomada(null);
  };

  function funcion_tecla(event) {
    const tecla_escape = event.keyCode;
    if (tecla_escape === 27 && datosVenta) {
      handleClickOpen();
    }
  }

  const handleClickFinishVenta = async () => {
    if (visible && ventaActual.total > datosCliente.credito_disponible) {
      setLimiteSuperado(true);
      return;
    }
    setLimiteSuperado(false);
    try {
      //TODO: Colocar loading en el modal
      setOpenBackDrop(!openBackDrop);
      //Obtener datos del storage
      const sesion = JSON.parse(localStorage.getItem("turnoEnCurso"));
      const usuario = JSON.parse(localStorage.getItem("sesionCafi"));
      //Obtener ventad final
      const ventaFinal = { ...ventaActual };
      //Generar folio
      const folio = numerosRandom(100000000000, 999999999999);
      //Agregar folio venta
      ventaFinal.folio = `${folio}`;
      //Agregar los montos en caja
      const montosEnCaja = {
        monto_efectivo: {
          monto: parseFloat(monto_efectivo_real),
          metodo_pago: formaPago[0].Value,
        },
        monto_tarjeta_debito: {
          monto: parseFloat(tarjeta),
          metodo_pago: formaPago[3].Value,
        },
        monto_tarjeta_credito: {
          monto: 0,
          metodo_pago: formaPago[3].Value,
        },
        monto_creditos: {
          monto: 0,
          metodo_pago: "",
        },
        monto_monedero: {
          monto: parseFloat(puntos),
          metodo_pago: formaPago[4].Value,
        },
        monto_transferencia: {
          monto: parseFloat(transferencia),
          metodo_pago: formaPago[2].Value,
        },
        monto_cheques: {
          monto: parseFloat(cheque),
          metodo_pago: formaPago[1].Value,
        },
        monto_vales_despensa: {
          monto: 0,
          metodo_pago: formaPago[6].Value,
        },
      };
      ventaFinal.montos_en_caja = montosEnCaja;
      //Colocamos si es venta a credito
      ventaFinal.credito = visible;
      //Agregar descuentos de ventas
      ventaFinal.descuento_general_activo = false;
      ventaFinal.descuento_general = null;
      //Declarar dias de credito como false
      ventaFinal.dias_de_credito_venta = datosCliente
        ? datosCliente.dias_credito
        : null;
      ventaFinal.fecha_de_vencimiento_credito = fechaVencimientoDate;
      ventaFinal.fecha_vencimiento_cotizacion = null;
      ventaFinal.cambio = cambioVenta;
      //Editar cliente
      ventaFinal.editar_cliente = editableClient;
      //Agregando los puntos finales
      //si pago con puntos y su compra genero puntos, hacer que no genere esos puntos
      ventaFinal.puntos_totales_venta =
        parseFloat(puntos) > 0 ? monederoTotal - monedero : monederoTotal;
      //Enviar los datos

      /* console.log(ventaFinal); */
      await createVenta({
        variables: {
          input: ventaFinal,
          empresa: sesion.empresa,
          sucursal: sesion.sucursal,
          usuario: usuario._id,
          caja: sesion.id_caja,
        },
      });
      //TODO: Mandar mensaje de error en dado caso de que la venta sea incorrecta
      //Cerrar modal venta
      setOpen(!open);
      //Mandar mensaje de cambio en dado caso de ser correcta
      //Quitar loading
      setOpenBackDrop(false);
      hancleClickCerrarVentaCambio();
      resetStates();
    } catch (error) {
      console.log(error);
      if (error.networkError.result) {
        console.log(error.networkError.result.errors);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors.message);
      }
    }
  };

  const handlerChangeValue = (e, location) => {
    switch (location) {
      case "EFECTIVO":
        setEfectivo(e.target.value);
        setEfectivoConstante(e.target.value);
        break;
      case "TARJETA":
        setTarjeta(e.target.value);
        break;

      case "PUNTOS":
        const valor = e.target.value !== "" ? parseInt(e.target.value) : 0;
        if (valor <= datosCliente.monedero_electronico) {
          /* const valor2 = valorPuntoProducto * parseFloat(valor); */
          setPuntos(valor);
          setValorFinalCambioPuntos(valor);
          setEfectivo(efectivoConstante - valor);
          setTotalVenta(totalVentaConstante - valor);
          // console.log("Valor efectivo >>> ", efectivo);
          // console.log("Valor2 >>", valor2);
          // console.log("Faltante >>> ",efectivo - valor2);
        }
        break;
      case "TRANSFERENCIA":
        setTransferencia(e.target.value);
        break;
      case "CHEQUE":
        setCheque(e.target.value);
        break;
      default:
        return alert("Error de pago");
    }
  };

  window.onkeydown = funcion_tecla;

  const handlerChangeDiscountVenta = (e) => {
    const valor = e.target.value;
    setDescuentoAplicarVenta(valor);
    setDescuentoPorsentajeVenta(0);
    if (valor !== "") {
      const ventaSubtotal = venta_original.subTotal;
      const descuento =
        ((ventaSubtotal - parseFloat(valor)) * 100) / venta_original.subTotal -
        100;
      const positiveDiscount = Math.abs(descuento);
      setDescuentoPorsentajeVenta(parseFloat(positiveDiscount.toFixed(2)));
    }
  };

  const handleChangePorsentDiscount = (e) => {
    const valor = e.target.value;
    setDescuentoAplicarVenta(0);
    setDescuentoPorsentajeVenta(valor);
    if (valor !== "") {
      const ventaSubtotal = venta_original.subTotal;
      const val =
        valor < 10
          ? parseFloat(`0.0${valor.replace(".", "")}`)
          : parseFloat(`0.${valor.replace(".", "")}`);
      const porsent = ventaSubtotal * val;
      setDescuentoAplicarVenta(porsent.toFixed(2));
    }
  };

  const handleCalculateNewDiscountVenta = () => {
    let venta = JSON.parse(localStorage.getItem("DatosVentas"));
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
    const productStorage = venta_original.productos;
    //Mapearlos
    for (let i = 0; i < productStorage.length; i++) {
      //Obtener el producto valor i
      const product = productStorage[i];
      let precio_actual_object = {};
      const porsentajeNewDescuento = parseFloat(descuentoPorsentajeVenta);
      /* const dineroDescontadoDescuento = parseFloat(
        product.precio_actual_object.precio_venta *
          parseFloat((`0.${porsentajeNewDescuento}`).toFixed(2))
      );
 */
      const dineroDescontadoDescuento =
        porsentajeNewDescuento > 1
          ? porsentajeNewDescuento > 10
            ? parseFloat(
                (
                  product.precio_actual_object.precio_venta *
                  parseFloat(`0.${porsentajeNewDescuento}`)
                ).toFixed(2)
              )
            : parseFloat(
                (product.precio_actual_object.precio_venta *
                  parseFloat(`0.${porsentajeNewDescuento}`)) /
                  10
              ).toFixed(2)
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

      /* parseFloat(`0.${product.id_producto.precios.iva < 10 ? `0${product.id_producto.precios.iva}` : product.id_producto.precios.iva}`)
      parseFloat(`0.${product.id_producto.precios.ieps < 10 ? `0${product.id_producto.precios.ieps}` : product.id_producto.precios.ieps}`) */

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
    localStorage.setItem(
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
    );
    setDescuentoVenta(descuento);
    setRecalcular(!recalcular);
    setOpenModalDescuento(!openModalDescuento);
  };

  const calcularMonedero = (venta) => {
    let suma = 0;
    if (venta) {
      venta.productos.forEach((element) => {
        if (element.id_producto.precios.monedero) {
          //multiplicacion del puntos de este producto con el total de este
          const { monedero_electronico } = element.id_producto.precios;
          const resultado = monedero_electronico * element.precio_a_vender;
          suma += resultado;
        }
      });
    }
    return suma;
  };

  useEffect(() => {
    const venta = JSON.parse(localStorage.getItem("DatosVentas"));
    console.log(venta);
    setVentaActual(venta);

    setVentaOriginal(venta);
    const total = venta === null ? 0 : venta.total;
    const subtotal = venta === null ? 0 : venta.subTotal;
    const impuestos = venta === null ? 0 : venta.impuestos;
    /* const monederoVenta = venta === null ? 0 : venta.monedero; */
    const cliente = venta && venta.cliente ? venta.cliente : {};
    if (cliente.numero_cliente === undefined) {
      setCreditoActivo(true);
    } else {
      setCreditoActivo(false);
    }
    /* setValorPuntoProducto(parseFloat(sesion.empresa.valor_puntos)); */
    setTotalVenta(total.toFixed(2));
    setTotalVentaConstante(total.toFixed(2));
    setSubtotalVenta(subtotal);
    setImpuestosVenta(impuestos);
    setEfectivo(total.toFixed(2));
    setEfectivoConstante(ttotal.toFixed(2));
    setMontoEfectivo(total.toFixed(2));
    setDatosCliente(cliente);

    const monedero_generado = calcularMonedero(venta);
    /* setMonedero(parseFloat(monederoVenta)); */
    setMonedero(parseFloat(monedero_generado));
    setMonederoTotal(
      !cliente.monedero_electronico
        ? parseFloat(monedero_generado)
        : parseFloat(cliente.monedero_electronico) +
            parseFloat(monedero_generado)
    );
    //Recargar tabla ventas
    setUpdateTablaVentas(!updateTablaVentas);
  }, [recalcular]);

  useEffect(() => {
    setfechaVencimientoDate(
      moment()
        .add(
          datosCliente.dias_credito ? parseInt(datosCliente.dias_credito) : 0,
          "days"
        )
        .format("YYYY-MM-DD")
    );
  }, [datosCliente, datosCliente.dias_credito]);

  useEffect(() => {
    if (visible) return;
    let monto_caja = 0;
    let monto_pagado =
      parseFloat(efectivo) +
      parseFloat(tarjeta) +
      parseFloat(valorFinalCambioPuntos) +
      parseFloat(transferencia) +
      parseFloat(cheque);
    let cambio_caja =
      parseFloat(monto_pagado) - parseFloat(totalVentaConstante);

    monto_caja = parseFloat(efectivo - cambio_caja);

    setMontoEfectivo(monto_caja);
    setMontoPagado(monto_pagado);
  }, [efectivo, tarjeta, puntos, transferencia, cheque]);

  useEffect(() => {
    setCambioVenta(montoPagado - totalVenta);
  }, [montoPagado]);

  useEffect(() => {
    if (visible) {
      setMontoPagado(totalVentaConstante);
      setMontoEfectivo(0);
      setEfectivo(0);
      setTarjeta(0);
      setPuntos(0);
      setTransferencia(0);
      setCheque(0);
      setCambioVenta(0);
    } else {
      setEfectivo(efectivoConstante);
      setMontoEfectivo(efectivoConstante);
    }
  }, [visible]);

  const clearFieldOnFocus = (e) => {
    const { name, value } = e.target;
    const val = parseFloat(value);
    switch (name) {
      case "EFECTIVO":
        if (val === 0) {
          setEfectivo("");
          setEfectivoConstante("");
        }
        break;
      case "TARJETA":
        if (val === 0) {
          setTarjeta("");
        }
        break;
      case "PUNTOS":
        if (val === 0) {
          setPuntos("");
        }
        break;
      case "TRANSFERENCIA":
        if (val === 0) {
          setTransferencia("");
        }
        break;
      case "CHEQUE":
        if (val === 0) {
          setCheque("");
        }
        break;
      default:
        break;
    }
  };

  const validateCantidadesCorrectas = (e) => {
    const { name, value } = e.target;
    const monto = parseFloat(monto_efectivo_real);
    switch (name) {
      case "EFECTIVO":
        if (value === "") {
          setEfectivo(0);
          setEfectivoConstante(0);
        } /* else if(parseFloat(value) > parseFloat(monto_efectivo_real)){
          setEfectivo(parseFloat(monto_efectivo_real));
        } */
        break;
      case "TARJETA":
        if (value === "") {
          setTarjeta(0);
        } else if (monto < 0) {
          setTarjeta(0);
        }
        break;
      case "PUNTOS":
        if (value === "") {
          setPuntos(0);
        } else if (
          monto < 0 &&
          parseFloat(puntos) !== parseFloat(totalVentaConstante)
        ) {
          setPuntos(0);
        }
        break;
      case "TRANSFERENCIA":
        if (value === "") {
          setTransferencia(0);
        } else if (monto < 0) {
          setTransferencia(0);
        }
        break;
      case "CHEQUE":
        if (value === "") {
          setCheque(0);
        } else if (monto < 0) {
          setCheque(0);
        }
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso || !datosVenta}
      >
        <Box>
          <Box>
            <img
              src={CartIcon}
              alt="icono ventas"
              style={{ width: 38 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Pagar</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>ESC</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={limite_superado}
          autoHideDuration={5000}
          onClose={() => setLimiteSuperado(false)}
          message="La cantidad total de la venta supera el crédito disponible del cliente"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setLimiteSuperado(false)}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        />
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box>
              <img
                src={CartIcon}
                alt="icono ventas"
                className={classes.iconSizeDialogsPequeno}
              />
            </Box>
            <Box mx={2} flexGrow={1}>
              <Typography variant="h4">Cerrar Venta</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
              size="large"
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <div className={classes.formInputFlex}>
            <Box width="25%" textAlign="center">
              <Box>
                <img
                  src={MoneyIcon}
                  alt="icono ventas"
                  className={classes.iconSizeDialogsPequeno}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              <Typography variant="caption">Efectivo</Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  name="EFECTIVO"
                  id="form-producto-efectivo"
                  variant="outlined"
                  value={efectivo}
                  onChange={(e) => handlerChangeValue(e, "EFECTIVO")}
                  onBlur={validateCantidadesCorrectas}
                  onFocus={clearFieldOnFocus}
                />
              </Box>
            </Box>
            <Box width="25%" textAlign="center">
              <Box>
                <img
                  src={TarjetaIcon}
                  alt="icono ventas"
                  className={classes.iconSizeDialogsPequeno}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              <Typography variant="caption">Tarjeta</Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  name="TARJETA"
                  variant="outlined"
                  value={tarjeta}
                  onChange={(e) => handlerChangeValue(e, "TARJETA")}
                  onBlur={validateCantidadesCorrectas}
                  onFocus={clearFieldOnFocus}
                />
              </Box>
            </Box>
            <Box width="25%" textAlign="center">
              <Box>
                <FcShop style={{ fontSize: 50, cursor: "pointer" }} />
              </Box>
              <Typography variant="caption">Puntos</Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  name="PUNTOS"
                  variant="outlined"
                  value={puntos}
                  onChange={(e) => handlerChangeValue(e, "PUNTOS")}
                  onBlur={validateCantidadesCorrectas}
                  onFocus={clearFieldOnFocus}
                  InputProps={{
                    min: 0,
                    max: datosCliente.monedero_electronico,
                  }}
                />
              </Box>
            </Box>
            <Box width="25%" textAlign="center">
              <Box p={0}>
                <img
                  src={TransfeIcon}
                  alt="icono ventas"
                  className={classes.iconSizeDialogsPequeno}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              <Typography variant="caption">Transferencia</Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  name="TRANSFERENCIA"
                  variant="outlined"
                  value={transferencia}
                  onChange={(e) => handlerChangeValue(e, "TRANSFERENCIA")}
                  onBlur={validateCantidadesCorrectas}
                  onFocus={clearFieldOnFocus}
                />
              </Box>
            </Box>
            <Box width="25%" textAlign="center">
              <Box p={0}>
                <img
                  src={ChequeIcon}
                  alt="icono ventas"
                  className={classes.iconSizeDialogsPequeno}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              <Typography variant="caption">Cheque</Typography>
              <Box display="flex">
                <TextField
                  fullWidth
                  size="small"
                  name="CHEQUE"
                  variant="outlined"
                  value={cheque}
                  onChange={(e) => handlerChangeValue(e, "CHEQUE")}
                  onBlur={validateCantidadesCorrectas}
                  onFocus={clearFieldOnFocus}
                />
              </Box>
            </Box>
          </div>
          <Container maxWidth="lg">
            <Box my={1}>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item md={5} xs={12}>
                  <Box textAlign="left">
                    <Box display="flex">
                      <Box display="flex" alignItems={"center"} mr={2}>
                        <Box mt={0.5} mr={0.5}>
                          <FcBusinessman style={{ fontSize: 19 }} />
                        </Box>
                        <Typography variant="subtitle1">
                          <b>Cliente:</b>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        {datosCliente
                          ? datosCliente.nombre_cliente
                          : "Sin cliente"}
                      </Typography>
                    </Box>

                    <Box display="flex">
                      <Box display="flex" alignItems={"center"} mr={2}>
                        <Box mt={0.5} mr={0.5}>
                          <FcSalesPerformance style={{ fontSize: 19 }} />
                        </Box>
                        <Typography variant="subtitle1">
                          <b>Dinero electronico generado:</b>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        ${monedero ? formatoMexico(monedero) : 0.0}
                      </Typography>
                    </Box>

                    <Box display="flex">
                      <Box display="flex" alignItems={"center"} mr={2}>
                        <Box mt={0.5} mr={0.5}>
                          <FcSalesPerformance style={{ fontSize: 19 }} />
                        </Box>
                        <Typography variant="subtitle1">
                          <b>Dinero electrónico disponible:</b>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        $
                        {!datosCliente.monedero_electronico
                          ? 0.0
                          : formatoMexico(
                              datosCliente.monedero_electronico - puntos
                            )}
                      </Typography>
                    </Box>

                    <Box display="flex">
                      <Box display="flex" alignItems={"center"} mr={2}>
                        <Box mt={0.5} mr={0.5}>
                          <FcSalesPerformance style={{ fontSize: 19 }} />
                        </Box>
                        <Typography variant="subtitle1">
                          <b>Total puntos:</b>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        $
                        {monederoTotal
                          ? formatoMexico(monederoTotal - puntos)
                          : 0.0}
                      </Typography>
                    </Box>

                    {/* <Box display="flex">
                      <Box display="flex" alignItems={"center"} mr={2}>
                        <Box mt={0.5} mr={0.5}>
                          <FcSalesPerformance style={{ fontSize: 19 }} />
                        </Box>
                        <Typography variant="subtitle1">
                          <b>Valor:</b>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1">
                        ${monederoTotal * valorPuntoProducto}
                      </Typography>
                    </Box> */}
                  </Box>
                </Grid>
                <Grid item md={5} xs={12}>
                  <Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography style={{ fontSize: "17px" }}>
                        <b>Monto pagado:</b>
                      </Typography>
                      <Box mx={1} />
                      <Typography variant="h6">
                        $ {formatoMexico(montoPagado)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography style={{ fontSize: "17px" }}>
                        <b>Subtotal:</b>
                      </Typography>
                      <Box mx={1} />
                      <Typography variant="h6">
                        $ {formatoMexico(subtotalVenta)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography style={{ fontSize: "17px" }}>
                        <b>Impuestos:</b>
                      </Typography>
                      <Box mx={1} />
                      <Typography variant="h6">
                        $ {formatoMexico(impuestosVenta)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography style={{ fontSize: "17px" }}>
                        <b>Total:</b>
                      </Typography>
                      <Box mx={1} />
                      <Typography variant="h6">
                        $ {formatoMexico(totalVenta)}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography style={{ fontSize: "17px" }}>
                        <b>Descuento:</b>
                      </Typography>
                      <Box mx={1} />
                      <Typography variant="h6">
                        $ {descuentoVenta ? formatoMexico(descuentoVenta) : 0}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography align="left" style={{ fontSize: "17px" }}>
                        <b>Cambio:</b>
                      </Typography>
                      <Box mx={1} />
                      <Typography variant="h6">
                        $ {cambioVenta ? formatoMexico(cambioVenta) : 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {visible ? (
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item md={2} xs={12}>
                        <Typography variant="caption">
                          <b>Dias de Crédito:</b>
                        </Typography>

                        <TextField
                          fullWidth
                          size="small"
                          name="codigo_barras"
                          id="form-producto-codigo-barras"
                          variant="outlined"
                          value={
                            datosCliente.dias_credito === null
                              ? 0
                              : datosCliente.dias_credito
                          }
                          onChange={(e) =>
                            setDatosCliente({
                              ...datosCliente,
                              dias_credito: e.target.value,
                            })
                          }
                          disabled={editableClient}
                        />
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Typography variant="caption">
                          <b>Límite de Crédito:</b>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="codigo_barras"
                          id="form-producto-codigo-barras"
                          variant="outlined"
                          value={
                            datosCliente.limite_credito === null
                              ? 0
                              : datosCliente.limite_credito
                          }
                          disabled={editableClient}
                        />
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Typography variant="caption">
                          <b>Crédito Disponible:</b>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="codigo_barras"
                          id="form-producto-codigo-barras"
                          variant="outlined"
                          value={
                            datosCliente.credito_disponible === null
                              ? 0
                              : datosCliente.credito_disponible
                          }
                          disabled={true}
                        />
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Typography variant="caption">
                          <b>Total a Crédito:</b>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="codigo_barras"
                          id="form-producto-codigo-barras"
                          variant="outlined"
                          disabled={editableClient}
                          value={totalVenta}
                        />
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <Typography variant="caption">
                          <b>Fecha de Vencimiento:</b>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name="codigo_barras"
                          id="form-producto-codigo-barras"
                          variant="outlined"
                          type="date"
                          value={fechaVencimientoDate}
                          onChange={(e) => {
                            const modelDate = moment(e.target.value).add(
                              1,
                              "days"
                            );
                            const hoy = moment();
                            const diasDiff = modelDate.diff(hoy, "days");
                            setfechaVencimientoDate(e.target.value);
                            setDatosCliente({
                              ...datosCliente,
                              dias_credito: diasDiff,
                            });
                          }}
                          disabled={editableClient}
                        />
                      </Grid>
                      <Grid item md={1} xs={12}>
                        <Box display="flex" alignItems="flex-end" height="100%">
                          <Button
                            color="primary"
                            variant="outlined"
                            size="large"
                            onClick={() => setEditableClient(!editableClient)}
                          >
                            <Edit />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          </Container>
        </DialogContent>

        <DialogActions style={{ justifyContent: "space-between" }}>
          <Box display={"flex"} justifyContent="flex-start">
            <Box pr={1}>
              {visible ? (
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setVisible(!visible);
                    setEditableClient(!editableClient);
                  }}
                  startIcon={<ClearIcon style={{ fontSize: "28px" }} />}
                >
                  Cancelar
                </Button>
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => setVisible(!visible)}
                  startIcon={<CreditCardIcon style={{ fontSize: "28px" }} />}
                  disabled={creditoActivo || !ventaActual}
                >
                  Credito
                </Button>
              )}
            </Box>

            <Box>
              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={<LocalOfferIcon style={{ fontSize: "28px" }} />}
                onClick={() => setOpenModalDescuento(!openModalDescuento)}
                disabled={!ventaActual}
              >
                Descuento
              </Button>
            </Box>
          </Box>
          <Button
            onClick={() => {
              handleClickFinishVenta();
            }}
            size="large"
            variant="contained"
            color="primary"
            autoFocus
            disabled={!ventaActual}
          >
            Terminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openModalDescuento}
        onClose={abrirCajon}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box textAlign="center" display="flex" justifyContent="space-between">
            <Typography variant="h5">Descuento</Typography>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={() => setOpenModalDescuento(!openModalDescuento)}
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">
            El descuento se aplica apartir del <b>SUBTOTAL</b>
          </Alert>
          <Box my={1}>
            <Grid container spacing={2}>
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
                  onChange={(e) => handlerChangeDiscountVenta(e)}
                  variant="outlined"
                  disabled={false}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography>
                  <b>Porcentaje:</b>
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  name="codigo_barras"
                  id="form-venta-porsentaje-descuento"
                  variant="outlined"
                  value={descuentoPorsentajeVenta}
                  onChange={(e) => handleChangePorsentDiscount(e)}
                  type="number"
                  disabled={false}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCalculateNewDiscountVenta()}
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

      <Dialog
        open={cambio}
        onClose={() => setCambio(!cambio)}
        TransitionComponent={Transition}
      >
        <DialogContent>
          <Box textAlign="center">
            <Box>
              <FcDonate style={{ fontSize: 80 }} />
            </Box>
            <Box textAlign="center">
              <Typography variant="h5">Su cambio</Typography>
            </Box>
          </Box>
          <Grid item lg={12}>
            <Paper elevation={3}>
              <Box p={3} width="100%" textAlign="center">
                <Typography variant="h3" style={{ color: "red" }}>
                  ${cambioVenta.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setCambio(!cambio)}
            variant="contained"
            size="large"
            color="primary"
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
