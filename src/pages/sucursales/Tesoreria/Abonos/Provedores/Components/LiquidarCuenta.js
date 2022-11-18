import React, { useContext, useState, Fragment } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import { withRouter } from "react-router";
import { formatoMexico } from "../../../../../../config/reuserFunctions";
import BackdropComponent from "../../../../../../components/Layouts/BackDrop";
import { formaPago } from "../../../../Facturacion/catalogos";
import moment from "moment";
import { CREAR_ABONO } from "../../../../../../gql/Tesoreria/abonos";
import { useMutation } from "@apollo/client";
import { TesoreriaCtx } from "../../../../../../context/Tesoreria/tesoreriaCtx";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  appBar: {
    position: "relative",
  },
}));


 function LiquidarCuenta(props) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { setAlert, setReload } = useContext(TesoreriaCtx);
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [CrearAbono] = useMutation(CREAR_ABONO);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [cuentaTotalDescuento, setCuentaTotalDescuento] = useState(0);
  const [dineroDescontado, setDineroDescontado] = useState(0);

  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");


   


    const handleClick = () => { 
      if(turnoEnCurso || sesion.accesos.tesoreria.caja_principal.ver){
        setOpen(!open);
        setCuentaTotalDescuento(0);
        setDineroDescontado(0);
        setValue(0);
      }else{
      
        props.history.push('/ventas/venta-general');
      }
  } 


  const classes = useStyles();

  const obtenerPorcientoSlide = (event, newValue) => {
    setValue(newValue);
    let porcentaje = parseFloat((100 - newValue).toFixed(2)); //Porcentaje para calculos de descuento
    let cuenta_con_descuento = parseFloat(
      ((props.cuenta.saldo_credito_pendiente * porcentaje) / 100).toFixed(2)
    );
    let dineroDescontado = parseFloat(
      (props.cuenta.saldo_credito_pendiente - cuenta_con_descuento).toFixed(2)
    );
    setCuentaTotalDescuento(cuenta_con_descuento);
    setDineroDescontado(dineroDescontado);
  };

  const obtenerPrecioText = (e) => {
    let valorText = parseFloat(e.target.value);

    let porcentaje = parseFloat(
      ((valorText * 100) / props.cuenta.saldo_credito_pendiente).toFixed(2)
    );
    let dineroDescontado = parseFloat(
      (props.cuenta.saldo_credito_pendiente - valorText).toFixed(2)
    );

    setCuentaTotalDescuento(valorText);
    setDineroDescontado(dineroDescontado);
    setValue(porcentaje);
  };

  function valuetext(e) {
    return `${e}`;
  }

  

  const enviarDatos = async () => {
    setLoading(true);
    try {
      const input = {
        tipo_movimiento: "ABONO_PROVEEDOR",
        rol_movimiento: ( turnoEnCurso) ? "CAJA" : "CAJA_PRINCIPAL",
        horario_turno: (turnoEnCurso) ? turnoEnCurso.horario_en_turno : '',
        hora_moviento: {
          hora: moment().locale("es-mx").format('hh'),
          minutos: moment().locale("es-mx").format('mm'),
          segundos: moment().locale("es-mx").format('ss'),
          completa: moment().locale("es-mx").format('HH:mm:ss')
      },
        fecha_movimiento: {
          year: moment().locale("es-mx").format("YYYY"),
          mes: moment().locale("es-mx").format("MM"),
          dia: moment().locale("es-mx").format("DD"),
          no_semana_year: moment().locale("es-mx").week().toString(),
          no_dia_year: moment().locale("es-mx").dayOfYear().toString(),
          completa: moment().locale("es-mx").format(),
        },
        concepto: 'ABONO_PROVEEDOR',
        monto_total_abonado: parseFloat(props.cuenta.saldo_credito_pendiente),
        descuento: {
          porciento_descuento: value,
          dinero_descontado: dineroDescontado,
          total_con_descuento: cuentaTotalDescuento,
        },
        montos_en_caja: {
          monto_efectivo: {
            monto:
              metodoPago === "01"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente * -1
                      : props.cuentaTotalDescuento * -1
                  )
                : 0,
            metodo_pago: "01",
          },
          monto_tarjeta_debito: {
            monto:
              metodoPago === "28"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente * -1
                      : props.cuentaTotalDescuento *-1
                  )
                : 0,
            metodo_pago: "28",
          },
          monto_tarjeta_credito: {
            monto:
              metodoPago === "04"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente * -1
                      : props.cuentaTotalDescuento * -1
                  )
                : 0,
            metodo_pago: "04",
          },
          monto_creditos: {
            monto:
              metodoPago === "99"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente *-1
                      : cuentaTotalDescuento *-1
                  )
                : 0,
            metodo_pago: "99",
          },
          monto_monedero: {
            monto:
              metodoPago === "05"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente *-1
                      : cuentaTotalDescuento *-1
                  )
                : 0,
            metodo_pago: "05",
          },
          monto_transferencia: {
            monto:
              metodoPago === "03"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente *-1
                      : props.cuentaTotalDescuento *-14
                  )
                : 0,
            metodo_pago: "03",
          },
          monto_cheques: {
            monto:
              metodoPago === "02"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente * -1
                      : props.cuentaTotalDescuento * -1
                  )
                : 0,
            metodo_pago: "02",
          },
          monto_vales_despensa: {
            monto:
              metodoPago === "08"
                ? parseFloat(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente * -1
                      : props.cuentaTotalDescuento * -1
                  )
                : 0,
            metodo_pago: "08",
          },
        },
        metodo_de_pago: {
          clave: "",
          metodo: "",
        },
        numero_caja: (turnoEnCurso) ? parseInt(turnoEnCurso.numero_caja) : 0,
        id_Caja: (turnoEnCurso) ? turnoEnCurso.id_caja : '',
        numero_usuario_creador: sesion.numero_usuario,
        nombre_usuario_creador: sesion.nombre,
        id_cliente: props.cuenta.proveedor.id_proveedor._id,
        numero_cliente: props.cuenta.proveedor.numero_cliente,
        nombre_cliente: props.cuenta.proveedor.nombre_cliente,
        telefono_cliente: props.cuenta.proveedor.id_proveedor.telefono,
        email_cliente: props.cuenta.proveedor.id_proveedor.email,
        id_compra: props.cuenta._id,
        caja_principal: sesion.accesos.tesoreria.caja_principal.ver,
      };
      
      if (metodoPago === "") {
        setAlert({
          message: "Por favor complete el metodo de pago",
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
      setMetodoPago("");
      setAlert({
        message: "Cuenta liquidada",
        status: "success",
        open: true,
      });
      handleClick();
      setLoading(false);
    } catch (error) {
      handleClick();
      setLoading(false);
      setAlert({
        message: "Ocurrio un problema en el servidor",
        status: "error",
        open: true,
      });
    }
  };

  return (
    <Fragment>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<DoneIcon />}
        onClick={handleClick}
      >
        Liquidar
      </Button>

      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        onClose={handleClick}
        aria-labelledby="draggable-dialog-title"
      >
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <Box display="flex">
          <Box flexGrow={1} p={2}>
            <Typography variant="h6" className={classes.title}>
              Liquidar Cuenta
            </Typography>
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
        <DialogContent>
          <Typography>
            Aplica un descuento por pronto pago a tu cuenta
          </Typography>
          <Box mt={1} textAlign="center">
            <Typography id="discrete-slider-always" gutterBottom>
              <b>Porcentaje de descuento</b>
            </Typography>
          </Box>
          <Box ml={1} mr={1} mb={2}>
            <Slider
              getAriaValueText={valuetext}
              valueLabelFormat={value.toFixed(2)}
              aria-labelledby="discrete-slider-small-steps"
              valueLabelDisplay="auto"
              onChange={obtenerPorcientoSlide}
            />
          </Box>
          <Box width="100%" textAlign="center">
            <Typography id="discrete-slider-always" gutterBottom>
              <b>Cantidad a pagar con descuento</b>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="descuento"
              variant="outlined"
              value={cuentaTotalDescuento ? cuentaTotalDescuento : 0}
              onChange={obtenerPrecioText}
            />
          </Box>
          <Box width="100%" mt={2} textAlign={"center"}>
            <Typography>
              <b>Metodo de pago:</b>
            </Typography>
            <FormControl variant="outlined" fullWidth size="small">
              <Select
                width="100%"
                name="metodo_pago"
                variant="outlined"
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
          <Box display="flex" mt={2}>
            <Box flexGrow={1}>
              <Typography>Total cuenta: </Typography>
            </Box>
            <Box>
              <Typography>
                <b>${formatoMexico(props.cuenta.total)}</b>
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography>Saldo pendiente: </Typography>
            </Box>
            <Box>
              <Typography>
                <b>${formatoMexico(props.cuenta.saldo_credito_pendiente)}</b>
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography>Dinero Descontado: </Typography>
            </Box>
            <Box>
              <Typography>
                <b>${formatoMexico(dineroDescontado)}</b>
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography>Porciento Descontado: </Typography>
            </Box>
            <Box>
              <Typography>
                <b>{formatoMexico(value)}%</b>
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography variant="h6">Total a pagar:</Typography>
            </Box>
            <Box>
              <Typography variant="h6">
                <b style={{ color: "green" }}>
                  $
                  {formatoMexico(
                    cuentaTotalDescuento === 0
                      ? props.cuenta.saldo_credito_pendiente
                      : props.cuentaTotalDescuento
                  )}
                </b>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={enviarDatos}
            color="primary"
            variant="contained"
            size="large"
          >
            Liquidar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default withRouter(LiquidarCuenta);