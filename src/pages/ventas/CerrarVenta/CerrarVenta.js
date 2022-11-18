import React, { useState, useContext, Fragment } from "react";
import useStyles from "../styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ClearIcon from "@material-ui/icons/Clear";
import { Close, Done } from "@material-ui/icons";
import {
  formatoMexico,
  NumerosaLetras,
  numerosRandom,
} from "../../../config/reuserFunctions";
import { formaPago } from "../../sucursales/Facturacion/catalogos";
import { calcularMonedero } from "./calcularMonedero";
import { CREAR_VENTA } from "../../../gql/Ventas/ventas_generales";
import { useMutation } from "@apollo/client";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import { AccesosContext } from "../../../context/Accesos/accesosCtx";
import ObtenerMontos from "./Montos";
import InfoTotalesVenta from "./InfoVentaTotales";
import CreditoVenta from "./Credito";
import DescuentoVenta from "./Descuento";
import { Alert } from "@material-ui/lab";
import SnackBarMessages from "../../../components/SnackBarMessages";
import { imprimirTicketVenta } from "./PrintTicketVenta";
import { TextField } from "@material-ui/core";
import moment from "moment";
import { abrirCajonQuery } from "../../../components/TicketPrinter/AbrirCajon";
import CartIcon from "../../../icons/ventas/cart.svg";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initial_state_montos = {
  efectivo: 0,
  tarjeta: 0,
  puntos: 0,
  transferencia: 0,
  cheque: 0,
};

const initial_state_totales = {
  subtotal: 0,
  impuestos: 0,
  total: 0,
  descuento: 0,
  cambio: 0,
  monto_pagado: 0,
};

export default function CerrarVenta() {
  const classes = useStyles();
  const [cambio, setCambio] = useState(false);
  const sesionUsuario = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
  const impresora = localStorage.getItem("cafiTicketPrint");
  const [open, setOpen] = useState(false);
  //Datos del context
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
    setOpenBackDrop,
    setVentaRetomada,
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);
  const { isOnline, saveVentasToCloud } = useContext(AccesosContext);
  //States de los montos a pagar
  const [montos, setMontos] = useState(initial_state_montos);
  const [totales, setTotales] = useState(initial_state_totales);
  const [venta_credito, setVentaCredito] = useState(false);
  const [credito_disponible, setCreditoDisponible] = useState(false);
  const [fechaVencimientoDate, setfechaVencimientoDate] = useState("");
  const [limite_superado, setLimiteSuperado] = useState(false);
  const [monederoTotal, setMonederoTotal] = useState(0);
  const [montoEnCaja, setMontoEnCaja] = useState(0);
  const [venta_base, setVentaBase] = useState(0);
  const [editarCliente, setEditarCliente] = useState(false);
  const [datosCliente, setDatosCliente] = useState({});
  const [monedero, setMonedero] = useState(0);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [abono_minimo, setAbonoMinimo] = useState(0);
  const [fecha_venta, setFechaVenta] = useState("");

  const [createVenta] = useMutation(CREAR_VENTA);

  const handleClickOpen = () => {
    if (!open) {
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      setVentaBase(venta);
      const { cliente, subTotal, impuestos, total } = venta;

      const datos_cliente = venta && cliente ? cliente : {};
      if (datos_cliente.credito_disponible) {
        setCreditoDisponible(true);
      } else {
        setCreditoDisponible(false);
      }
      setDatosCliente(datos_cliente);
      setMontoEnCaja(venta === null ? 0 : parseFloat(total.toFixed(2)));
      setTotales({
        subtotal: venta === null ? 0 : parseFloat(subTotal.toFixed(2)),
        impuestos: venta === null ? 0 : parseFloat(impuestos.toFixed(2)),
        total: venta === null ? 0 : parseFloat(total.toFixed(2)),
        descuento: 0,
        cambio: 0,
        monto_pagado: venta === null ? 0 : parseFloat(total.toFixed(2)),
      });
      setMontos({
        efectivo: venta === null ? 0 : parseFloat(total.toFixed(2)),
        tarjeta: 0,
        puntos: 0,
        transferencia: 0,
        cheque: 0,
      });
      const monedero_generado = calcularMonedero(venta);
      setMonedero(parseFloat(monedero_generado));
      setMonederoTotal(
        !cliente.monedero_electronico
          ? parseFloat(monedero_generado)
          : parseFloat(cliente.monedero_electronico) +
              parseFloat(monedero_generado)
      );
    }
    setOpen(!open);
  };

  const hancleClickCerrarVentaCambio = () => {
    setCambio(true);

    //Limpiar el storage de ventas
    localStorage.removeItem("DatosVentas");
    localStorage.removeItem("VentaOriginal");
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
  };

  const handleCloseCambio = () => {
    //limpiar states
    setCambio(false);
    resetStates();
  };

  const resetStates = () => {
    setDatosCliente({});
    setMonedero(0);
    setfechaVencimientoDate("");
    setMonederoTotal(0);
    setVentaBase(0);
    setEditarCliente(false);
    setVentaCredito(false);

    //States de los montos a pagar
    setMontoEnCaja(0);
    setTotales(initial_state_totales);
    setMontos(initial_state_montos);
    setVentaRetomada(null);
    setAbonoMinimo(0);
    setFechaVenta("");
  };

  function funcion_tecla(event) {
    const tecla_escape = event.keyCode;
    if (tecla_escape === 27 && datosVenta) {
      handleClickOpen();
    } /* else if (tecla_escape === 13 && open && venta_base){
      console.log("ejecuta 1");
      handleClickFinishVenta();
      return
    } */ else if (
      tecla_escape === 13 &&
      cambio &&
      !open
    ) {
      handleCloseCambio();
    }
  }

  const handleClickFinishVenta = async () => {
    if (venta_credito && venta_base.total > datosCliente.credito_disponible) {
      setLimiteSuperado(true);
      return;
    }
    if (totales.cambio < 0) return;
    setLimiteSuperado(false);
    try {
      setOpenBackDrop(true);
      //Obtener datos del storage
      const sesion = JSON.parse(localStorage.getItem("turnoEnCurso"));
      const usuario = JSON.parse(localStorage.getItem("sesionCafi"));
      //Obtener ventad final
      const ventaFinal = { ...venta_base };
      //Generar folio
      const folio = numerosRandom(100000000000, 999999999999);
      //Agregar folio venta
      ventaFinal.folio = `${folio}`;
      //Agregar los montos en caja
      const montosEnCaja = {
        monto_efectivo: {
          monto: parseFloat(montos.efectivo),
          metodo_pago: formaPago[0].Value,
        },
        monto_tarjeta_debito: {
          monto: parseFloat(montos.tarjeta),
          metodo_pago: formaPago[3].Value,
        },
        monto_tarjeta_credito: {
          monto: 0,
          metodo_pago: formaPago[3].Value,
        },
        monto_creditos: {
          monto: venta_credito ? ventaFinal.total : 0,
          metodo_pago: "99",
        },
        monto_monedero: {
          monto: parseFloat(montos.puntos),
          metodo_pago: formaPago[4].Value,
        },
        monto_transferencia: {
          monto: parseFloat(montos.transferencia),
          metodo_pago: formaPago[2].Value,
        },
        monto_cheques: {
          monto: parseFloat(montos.cheque),
          metodo_pago: formaPago[1].Value,
        },
        monto_vales_despensa: {
          monto: 0,
          metodo_pago: formaPago[6].Value,
        },
      };

      const abonoMinimo = parseFloat(abono_minimo);
      ventaFinal.montos_en_caja = montosEnCaja;
      //Colocamos si es venta a credito
      ventaFinal.credito = venta_credito;
      ventaFinal.abono_minimo = venta_credito && abonoMinimo ? abonoMinimo : 0;
      //Agregar descuentos de ventas
      ventaFinal.descuento_general_activo = ventaFinal.descuento_general_activo
        ? ventaFinal.descuento_general_activo
        : false;
      ventaFinal.descuento_general = ventaFinal.descuento_general
        ? ventaFinal.descuento_general
        : null;
      //Declarar dias de credito como false
      ventaFinal.dias_de_credito_venta = datosCliente
        ? datosCliente.dias_credito
        : null;
      ventaFinal.fecha_de_vencimiento_credito = fechaVencimientoDate;
      ventaFinal.fecha_vencimiento_cotizacion = null;
      ventaFinal.cambio = totales.cambio;
      //Editar cliente
      ventaFinal.editar_cliente = editarCliente;
      //Agregando los puntos finales
      //si pago con puntos y su compra genero puntos, hacer que no genere esos puntos
      ventaFinal.puntos_totales_venta =
        parseFloat(montos.puntos) > 0
          ? monederoTotal - monedero
          : monederoTotal;
      //poner metodo y forma de pago
      ventaFinal.metodo_pago = venta_credito ? "PPD" : "PUE";
      let numero_mayor = 0;
      let forma_pago;

      if (venta_credito) {
        forma_pago = "99";
      } else {
        Object.keys(montosEnCaja).forEach((key) => {
          if (montosEnCaja[key].monto > numero_mayor) {
            numero_mayor = montosEnCaja[key].monto;
            forma_pago = montosEnCaja[key].metodo_pago;
          }
        });
      }

      if (fecha_venta) ventaFinal.fecha_venta = fecha_venta;

      ventaFinal.forma_pago = forma_pago;
      ventaFinal.turno = sesion.horario_en_turno;

      //Enviar los datos
      let ventaTo = await createVenta({
        variables: {
          input: ventaFinal,
          empresa: sesion.empresa,
          sucursal: sesion.sucursal,
          usuario: usuario._id,
          caja: sesion.id_caja,
          isOnline: isOnline,
        },
      });
      if (!isOnline) {
        //guardarEnStorageVentas

        saveVentasToCloud({
          ...ventaTo.data.createVenta.datos_to_save_storage,
          empresa: sesion.empresa,
          sucursal: sesion.sucursal,
          cliente: ventaFinal.cliente,
          productos: ventaFinal.productos,
          puntos_totales_venta: ventaFinal.puntos_totales_venta,
          usuario: usuario._id,
          caja: ventaFinal.caja,
          credito: ventaFinal.credito,
          forma_pago: ventaFinal.forma_pago,
          tipo_venta: ventaFinal.tipo_venta,
          montos_en_caja: ventaFinal.montos_en_caja,
        });
        setOpenBackDrop(false);
        setOpen(false);
      }

      //print ticket
      if (ventaFinal.tipo_emision === "TICKET") {
        let datos = {
          ventaFinal,
          monto_pagado: numero_mayor,
          turno: sesion,
          sesion: sesionUsuario,
        };
        await imprimirTicketVenta(datos);
      }
      const resultCajon = await abrirCajonQuery(impresora);
      if (resultCajon.success === true) {
        setAlert({
          message: `Cajon abierto`,
          status: "success",
          open: true,
        });
      } else {
        setAlert({
          message: `Error al abrir cajon: ${resultCajon.message}`,
          status: "error",
          open: true,
        });
      }
      //Quitar loading
      setOpenBackDrop(false);
      setOpen(false);
      hancleClickCerrarVentaCambio();
    } catch (error) {
      setOpenBackDrop(false);
      setAlert({ message: "Hubo un error", status: "error", open: true });
      console.log(error);
      if (error.networkError.result) {
        console.log(error.networkError.result.errors);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors.message);
      }
    }
  };

  window.onkeydown = funcion_tecla;

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={() => handleClickOpen()}
        disabled={!turnoEnCurso || !datosVenta}
      >
        <Box>
          <Box>
            <img src={CartIcon} alt="icono ventas" style={{ width: 38 }} />
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
        maxWidth="sm"
        open={open}
        onClose={() => handleClickOpen()}
        TransitionComponent={Transition}
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
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
              <img src={CartIcon} alt="icono ventas" style={{ width: 40 }} />
            </Box>
            <Box mx={2} flexGrow={1}>
              <Typography variant="h5">Terminar Venta</Typography>
            </Box>
            <Box mx={2}>
              <TextField
                size="small"
                variant="outlined"
                type="date"
                defaultValue={moment().locale("es-mx").format("YYYY-MM-DD")}
                InputProps={{
                  inputProps: {
                    max: moment().locale("es-mx").format("YYYY-MM-DD"),
                  },
                }}
                onChange={(e) => setFechaVenta(e.target.value)}
                disabled={!sesionUsuario.accesos.ventas.administrador.ver}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleClickOpen()}
              size="large"
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography style={{ fontSize: "18px" }}>
              <b>{venta_credito ? "Total a crédito" : "Total a pagar"}</b>
            </Typography>

            <Typography variant="h2" style={{ color: "#4caf50" }}>
              <b>$ {formatoMexico(totales.total)}</b>
            </Typography>
            <Typography style={{ color: "#4caf50" }}>
              <b>{NumerosaLetras(totales.total)}</b>
            </Typography>
          </Box>
          <ObtenerMontos
            montos={montos}
            setMontos={setMontos}
            totales={totales}
            setTotales={setTotales}
            venta_credito={venta_credito}
            montoEnCaja={montoEnCaja}
            setMontoEnCaja={setMontoEnCaja}
            datosCliente={datosCliente}
          />
          <Box my={1}>
            <Grid container spacing={2} justifyContent="space-between">
              <InfoTotalesVenta
                montos={montos}
                totales={totales}
                datosCliente={datosCliente}
                monedero={monedero}
                monederoTotal={monederoTotal}
              />

              <Box display={venta_credito ? "flex" : "none"}>
                <CreditoVenta
                  montos={montos}
                  setMontos={setMontos}
                  totales={totales}
                  setTotales={setTotales}
                  venta_credito={venta_credito}
                  venta_base={venta_base}
                  setMontoEnCaja={setMontoEnCaja}
                  datosCliente={datosCliente}
                  setDatosCliente={setDatosCliente}
                  editarCliente={editarCliente}
                  setEditarCliente={setEditarCliente}
                  fechaVencimientoDate={fechaVencimientoDate}
                  setfechaVencimientoDate={setfechaVencimientoDate}
                  setAbonoMinimo={setAbonoMinimo}
                  abono_minimo={abono_minimo}
                />
              </Box>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions style={{ justifyContent: "space-between" }}>
          <Box display={"flex"} justifyContent="flex-start">
            <Box pr={1}>
              {venta_credito ? (
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setVentaCredito(false);
                    setEditarCliente(false);
                  }}
                  startIcon={<ClearIcon />}
                >
                  Cancelar
                </Button>
              ) : (
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setVentaCredito(true);
                  }}
                  startIcon={
                    <Typography variant="h4">
                      <b>$</b>
                    </Typography>
                  }
                  disabled={!credito_disponible || !venta_base}
                >
                  Credito
                </Button>
              )}
            </Box>
            <DescuentoVenta
              venta_base={venta_base}
              setVentaBase={setVentaBase}
              montos={montos}
              setMontos={setMontos}
              totales={totales}
              setTotales={setTotales}
            />
          </Box>
          <Button
            onClick={() => {
              handleClickFinishVenta();
            }}
            size="large"
            variant="contained"
            color="primary"
            autoFocus
            disabled={!venta_base || totales.cambio < 0}
            startIcon={<Done />}
          >
            Terminar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={cambio}
        onClose={() => handleCloseCambio()}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle style={{ textAlign: "center" }}>
          <Alert
            severity="success"
            action={
              <IconButton
                onClick={() => handleCloseCambio()}
                size="small"
                color="inherit"
                autoFocus
              >
                <Close style={{ fontSize: "25px" }} />
              </IconButton>
            }
          >
            Venta finalizada
          </Alert>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="h6" align="center">
              Su cámbio
            </Typography>
            <Typography variant="h3" align="center">
              ${formatoMexico(totales.cambio)}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
