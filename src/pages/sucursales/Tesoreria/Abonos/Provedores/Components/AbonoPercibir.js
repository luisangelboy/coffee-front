import React, { useContext, useState, Fragment } from "react";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import { withRouter } from "react-router";
import { formaPago } from "../../../../Facturacion/catalogos";
import { formatoMexico } from "../../../../../../config/reuserFunctions";
import { useMutation } from "@apollo/client";
import { CREAR_ABONO } from "../../../../../../gql/Tesoreria/abonos";
import moment from "moment";
import BackdropComponent from "../../../../../../components/Layouts/BackDrop";
import { TesoreriaCtx } from "../../../../../../context/Tesoreria/tesoreriaCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  input: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
    },
    "& .obligatorio": {
      color: "red",
    },
    paddingTop: 0,
    alignItems: "center",
    justifyItems: "center",
  },
}));

function AbonoaRecibir(props) {
  const [CrearAbono] = useMutation(CREAR_ABONO);

  const { setReload, setAlert } = useContext(TesoreriaCtx);

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abono, setAbono] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const enviarDatos = async () => {
    setLoading(true);
    try {
      const input = {
        tipo_movimiento: "ABONO_PROVEEDOR",
        rol_movimiento: turnoEnCurso ? "CAJA" : "CAJA_PRINCIPAL",
        horario_turno: turnoEnCurso ? turnoEnCurso.horario_en_turno : "",
        hora_moviento: {
          hora: moment().locale("es-mx").format("hh"),
          minutos: moment().locale("es-mx").format("mm"),
          segundos: moment().locale("es-mx").format("ss"),
          completa: moment().locale("es-mx").format("HH:mm:ss"),
        },
        fecha_movimiento: {
          year: moment().locale("es-mx").format("YYYY"),
          mes: moment().locale("es-mx").format("MM"),
          dia: moment().locale("es-mx").format("DD"),
          no_semana_year: moment().locale("es-mx").week().toString(),
          no_dia_year: moment().locale("es-mx").dayOfYear().toString(),
          completa: moment().locale("es-mx").format(),
        },
        monto_total_abonado: parseFloat(abono),
        montos_en_caja: {
          monto_efectivo: {
            monto: metodoPago === "01" ? parseFloat(abono * -1) : 0,
            metodo_pago: "01",
          },
          monto_tarjeta_debito: {
            monto: metodoPago === "28" ? parseFloat(abono * -1) : 0,
            metodo_pago: "28",
          },
          monto_tarjeta_credito: {
            monto: metodoPago === "04" ? parseFloat(abono * -1) : 0,
            metodo_pago: "04",
          },
          monto_creditos: {
            monto: metodoPago === "99" ? parseFloat(abono * -1) : 0,
            metodo_pago: "99",
          },
          monto_monedero: {
            monto: metodoPago === "05" ? parseFloat(abono * -1) : 0,
            metodo_pago: "05",
          },
          monto_transferencia: {
            monto: metodoPago === "03" ? parseFloat(abono * -1) : 0,
            metodo_pago: "03",
          },
          monto_cheques: {
            monto: metodoPago === "02" ? parseFloat(abono * -1) : 0,
            metodo_pago: "02",
          },
          monto_vales_despensa: {
            monto: metodoPago === "08" ? parseFloat(abono * -1) : 0,
            metodo_pago: "08",
          },
        },
        metodo_de_pago: {
          clave: metodoPago.Value,
          metodo: metodoPago.Name,
        },
        numero_caja: turnoEnCurso ? parseInt(turnoEnCurso.numero_caja) : 0,
        id_Caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
        id_usuario: sesion._id,
        concepto: "ABONO_PROVEEDOR",
        numero_usuario_creador: sesion.numero_usuario,
        nombre_usuario_creador: sesion.nombre,
        id_cliente: props.cuenta.proveedor.id_proveedor._id,
        numero_cliente: props.cuenta.proveedor.numero_cliente,
        nombre_cliente: props.cuenta.proveedor.nombre_cliente,
        telefono_cliente: props.cuenta.proveedor.id_proveedor.telefono,
        email_cliente: props.cuenta.proveedor.id_proveedor.email,
        caja_principal: sesion.accesos.tesoreria.caja_principal.ver,
        id_compra: props.cuenta._id,
      };

      if (abono === "" || metodoPago === "") {
        setAlert({
          message: "Por favor complete los datos.",
          status: "error",
          open: true,
        });
        setLoading(false);
        return;
      }
      await CrearAbono({
        variables: {
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          input,
        },
      });
      setReload(true);
      setAbono("");
      setMetodoPago("");
      setAlert({
        message: "Abono registrado con éxito",
        status: "success",
        open: true,
      });
      handleClick();
      setLoading(false);
    } catch (error) {
      handleClick();
      setLoading(false);
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
      console.log(error);
      setAlert({
        message: "Ocurrio un problema en el servidor",
        status: "error",
        open: true,
      });
    }
  };

  const handleClick = () => {
    if (turnoEnCurso || sesion.accesos.tesoreria.caja_principal.ver) {
      setReload(true);
      setOpen(!open);
    } else {
      props.history.push("/ventas/venta-general");
    }
  };

  return (
    <Fragment>
      {props.cuenta.credito_pagado ? (
        <div />
      ) : (
        <Button
          size="large"
          variant="outlined"
          fullWidth
          color="primary"
          startIcon={<AddCircleOutlineIcon style={{ fontSize: 35 }} />}
          onClick={handleClick}
        >
          <Typography variant="h6">Abonar</Typography>
        </Button>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClick}
        fullWidth
        maxWidth="xs"
      >
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <DialogTitle id="alert-dialog-slide-title">
          <Box display="flex">
            <Box p={1} flexGrow={1}>
              Registrar nuevo abono
            </Box>
            <Box p={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClick}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography>
              <b>Cantidad a abonar:</b>
            </Typography>
            <TextField
              fullWidth
              className={classes.input}
              onChange={(e) => setAbono(e.target.value)}
              value={abono}
              size="small"
              name="abono_recibir"
              variant="outlined"
              type="number"
            />
          </Box>
          <Box>
            <Typography>
              <b>Metodo de pago:</b>
            </Typography>
            <FormControl variant="outlined" fullWidth size="small">
              <Select
                width="100%"
                name="metodo_pago"
                variant="outlined"
                value={metodoPago ? metodoPago : ""}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                {formaPago.map((metodo, index) => {
                  return (
                    <MenuItem key={index} value={metodo.Value}>
                      {metodo.Name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Typography variant="h6">
              <b>Total de la cuenta</b>
            </Typography>
            <Typography style={{ color: "#9B9B9B" }} variant="h6">
              <b>${formatoMexico(props.cuenta.total)}</b>
            </Typography>
          </Box>
          <Box display="flex"  justifyContent="space-between">
            <Typography variant="h6">
              <b>Total pagado</b>
            </Typography>

            <Typography style={{ color: "green" }} variant="h6">
              <b>
                $
                {formatoMexico(
                  props.cuenta.total - props.cuenta.saldo_credito_pendiente
                )}
              </b>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              <b>Total restante</b>
            </Typography>
            <Typography variant="h6">
              <b>${formatoMexico(props.cuenta.saldo_credito_pendiente)}</b>
            </Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              <b>Nuevo abono</b>
            </Typography>
            <Typography style={{ color: "green" }} variant="h6">
              <b>${formatoMexico(abono)} </b>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              <b>Nuevo total pagado</b>
            </Typography>
            <Typography style={{ color: "green" }} variant="h6">
              <b>
                $
                {formatoMexico(
                  props.cuenta.total - props.cuenta.saldo_credito_pendiente + abono
                )}
              </b>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              <b>Nuevo restante total</b>
            </Typography>

            <Typography variant="h6">
              <b>
                ${formatoMexico(props.cuenta.saldo_credito_pendiente - abono)}
              </b>
            </Typography>
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="center" alignContent="center" p={2}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            style={{ fontSize: 18 }}
            onClick={enviarDatos}
          >
            Registrar Abono
          </Button>
        </Box>
      </Dialog>
    </Fragment>
  );
}

export default withRouter(AbonoaRecibir);
