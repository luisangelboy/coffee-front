import React, { Fragment, useState, useContext, useEffect } from "react";

import CloseIcon from "@material-ui/icons/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  makeStyles,
  DialogTitle,
  Slide,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Divider,
} from "@material-ui/core";
import BackdropComponent from "../../../../../../components/Layouts/BackDrop";
import { AbonosCtx } from "../../../../../../context/Tesoreria/abonosCtx";
import { CREAR_ABONO_CLIENTE } from "../../../../../../gql/Tesoreria/abonos";

import { formatoMexico } from "../../../../../../config/reuserFunctions";
import { formaPago } from "../../../../Facturacion/catalogos";
import { withRouter } from "react-router";
import { useMutation } from "@apollo/client";
import moment from "moment";
import AddIcon from "@material-ui/icons/Add";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(6)}px ${theme.spacing(4)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Abonar(props) {
  //listo
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abono, setAbono] = useState("");
  const { abonos } = useContext(AbonosCtx);
  const [metodoPago, setMetodoPago] = useState({});
  const [nameMetodo, setNameMetodo] = useState("");
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [crearAbonoVentaCredito] = useMutation(CREAR_ABONO_CLIENTE);

  const handleClick = () => {
    setOpen(false);
  };
  const hacerAbono = async () => {
    try {
      setLoading(true);

      let ObjectMetodoPago = {};
      formaPago.forEach((val) => {
        if (metodoPago === val.Value) {
          ObjectMetodoPago = val;
        }
      });

      const input = {
        tipo_movimiento: "ABONO_CLIENTE",
        rol_movimiento: turnoEnCurso ? "CAJA" : "CAJA_PRINCIPAL",
        numero_caja: turnoEnCurso ? parseInt(turnoEnCurso.numero_caja) : 0,
        id_Caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
        fecha_movimiento: {
          year: moment().locale("es-mx").format("YYYY"),
          mes: moment().locale("es-mx").format("MM"),
          dia: moment().locale("es-mx").format("DD"),
          no_semana_year: moment().locale("es-mx").week().toString(),
          no_dia_year: moment().locale("es-mx").dayOfYear().toString(),
          completa: moment().locale("es-mx").format(),
        },
        monto_total: props.total_ventas,
        concepto: "ABONO_CLIENTE",
        horario_turno: turnoEnCurso ? turnoEnCurso.horario_en_turno : "",
        hora_moviento: {
          hora: moment().locale("es-mx").format("hh"),
          minutos: moment().locale("es-mx").format("mm"),
          segundos: moment().locale("es-mx").format("ss"),
          completa: moment().locale("es-mx").format("HH:mm:ss"),
        },
        metodo_de_pago: {
          clave: ObjectMetodoPago.Value,
          metodo: ObjectMetodoPago.Name,
        },

        id_usuario: sesion._id,
        numero_usuario_creador: sesion.numero_usuario,
        nombre_usuario_creador: sesion.nombre,
        id_cliente: props.cliente._id,
        credito_disponible: props.cliente.credito_disponible,
        numero_cliente: props.cliente.numero_cliente,
        nombre_cliente: props.cliente.nombre_cliente,
        telefono_cliente: props.cliente.telefono_cliente,
        email_cliente: props.cliente.email_cliente,

        ventas: [
          {
            monto_total_abonado: parseFloat(abono),
            id_venta: abonos[props.index].id_venta,
            saldo_credito_pendiente:
              abonos[props.index].saldo_credito_pendiente,
          },
        ],
        liquidar: false,
        facturacion: props.venta.facturacion,
        caja_principal: sesion.accesos.tesoreria.caja_principal.ver,
      };
      if (metodoPago && abono !== "" && abono > 0) {
        const doAbono = await crearAbonoVentaCredito({
          variables: {
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
            input,
          },
        });

        props.recargar();
        setOpen(false);
        setLoading(false);
        props.setAlert({
          message: "Abono registrado con éxito.",
          status: "success",
          open: true,
        });
      } else {
        setLoading(false);
        props.setAlert({
          message: "Por favor complete los datos.",
          status: "error",
          open: true,
        });
      }
    } catch (error) {
      console.log(error);
      let message = error;
      if (error.networkError) {
        console.log(error.networkError.result);
        message = error.networkError.result;
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors[0].message);
        message = error.graphQLErrors[0].message;
      }
      props.setAlert({
        message: message,
        status: "error",
        open: true,
      });
    }
  };

  const enviarCantidad = (e) => {
    try {
      let cantidad = e.target.value;
      if (cantidad >= 0 && cantidad <= props.venta.saldo_credito_pendiente) {
        setAbono(cantidad);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openDialog = () => {
    try {
      if (turnoEnCurso || sesion.accesos.tesoreria.caja_principal.ver) {
        setOpen(true);
      } else {
        props.history.push("/ventas/venta-general");
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (metodoPago) {
      setNameMetodo(metodoPago.name);
    }
  }, [metodoPago]);

  return (
    <Box m={1}>
      <Box display="flex">
        <IconButton
          size="small"
          aria-label="detalle"
          onClick={() => {
            openDialog();
          }}
          disabled={props.estatus_credito === "PAGADA"}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClick}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-slide-title">
            <Box display="flex">
              <Box width="100%" display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpen(false)}
                  size="large"
                >
                  <CloseIcon />
                </Button>
              </Box>
            </Box>
          </DialogTitle>

          <BackdropComponent loading={loading} setLoading={setLoading} />

          <DialogContent>
            <Box>
              <Typography>
                <b>Cantidad a abonar:</b>
              </Typography>
              <TextField
                fullWidth
                className={classes.input}
                onChange={(e) => enviarCantidad(e)}
                value={abono}
                size="small"
                name="abono_recibir"
                variant="outlined"
                type="number"
              />
            </Box>
            <Box>
              <Typography>
                <b>Método de pago:</b>
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
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  <b>Total de la cuenta</b>
                </Typography>
                <Typography style={{ color: "#9B9B9B" }} variant="h6">
                  <b>${formatoMexico(props.venta.total)}</b>
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  <b>Total pagado</b>
                </Typography>
                <Typography style={{ color: "green" }} variant="h6">
                  <b>
                    $
                    {formatoMexico(
                      props.venta.total - props.venta.saldo_credito_pendiente
                    )}
                  </b>
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  <b>Total restante</b>
                </Typography>

                <Typography variant="h6">
                  <b>${formatoMexico(props.venta.saldo_credito_pendiente)}</b>
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
                      parseFloat(props.venta.total) - parseFloat(props.venta.saldo_credito_pendiente) + parseFloat(abono)
                    )}
                  </b>
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  <b>Nuevo restante total</b>
                </Typography>

                <Typography variant="h6">
                  <b>${formatoMexico(props.venta.saldo_credito_pendiente - abono)}</b>
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignContent="center"
            p={2}
            mt={2}
          >
            <Button
              size="large"
              variant="contained"
              color="primary"
              style={{ fontSize: 15 }}
              onClick={() => hacerAbono()}
            >
              Registrar Abono
            </Button>
          </Box>
        </Dialog>
      </Fragment>
    </Box>
  );
}

export default withRouter(Abonar);
