import React, { useContext, useEffect, useState } from "react";
import useStyles from "../styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CloseIcon from "@material-ui/icons/Close";
import SnackBarMessages from "../../../components/SnackBarMessages";
import { Checkbox, CircularProgress, Divider } from "@material-ui/core";
import { formatoMexico } from "../../../config/reuserFunctions";
import { CREAR_NOTA_CREDITO } from "../../../gql/Ventas/ventas_generales";
import { useMutation } from "@apollo/client";
import { Add } from "@material-ui/icons";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import NotaIcon from "../../../icons/notacredito.png"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CrearNota = ({ open, handleClose }) => {
  const classes = useStyles();
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
  const [cambio, setCambio] = useState({
    tipo: "monto_efectivo-01",
    cambio: datosVenta.saldo_favor,
  });
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setDatosVentasActual,
    setAlert
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);


  const [crearNotaCredito] = useMutation(CREAR_NOTA_CREDITO);

  useEffect(() => {
    setCambio({ tipo: "monto_efectivo-01", cambio: datosVenta.saldo_favor });
  }, [open]);

  const handleChangeCambio = (e) => {
    const { value } = e.target;
    setCambio({ ...cambio, tipo: value });
  };
  const crearNota = async () => {
    try {
      setLoading(true);
      const venta = { ...datosVenta };
      let productos = [];

      venta.productos.forEach((prod) => {
        const cantidad_regresada =
          prod.cantidad_venta_original - prod.cantidad_venta;
        let {
          granel,
          litros,
          centro_de_costos,
          precio_plazos,
          unidades_de_venta,
          imagenes,
          inventario_general,
          medidas_producto,
          ...id_producto
        } = prod.id_producto;

        delete id_producto.precios.granel;
        delete id_producto.precios.litros;

        productos.push({
          cantidad_venta: prod.cantidad_venta,
          cantidad_venta_original: prod.cantidad_venta_original,
          cantidad_regresada,
          codigo_barras: prod.codigo_barras,
          codigo_unidad: prod.codigo_unidad,
          id_producto,
          id_unidad_venta: prod.id_unidad_venta,
          ieps_total_producto: prod.ieps_total_producto,
          impuestos_total_producto: prod.impuestos_total_producto,
          iva_total_producto: prod.iva_total_producto,
          precio_unidad: prod.precio_unidad,
          precio: prod.precio,
          precio_a_vender: prod.precio_a_vender,
          subtotal_total_producto: prod.subtotal_total_producto,
          total_total_producto: prod.total_total_producto,
          unidad: prod.unidad,
          unidad_principal: prod.unidad_principal,
        });
      });

      const turno = {
        horario_en_turno: turnoEnCurso.horario_en_turno,
        numero_caja: parseInt(turnoEnCurso.numero_caja),
        id_caja: turnoEnCurso.id_caja,
        usuario_en_turno: {
          nombre: turnoEnCurso.usuario_en_turno.nombre,
          numero_usuario: parseInt(turnoEnCurso.usuario_en_turno.numero_usuario),
          _id: sesion._id,
        },
        empresa: turnoEnCurso.empresa,
        sucursal: turnoEnCurso.sucursal,
      };

      let cliente = venta.cliente;
      if(cliente !== null){
        delete cliente.imagen;
        delete cliente.eliminado;
        delete cliente.direccion;
      }
      const forma_pago = cambio.tipo.split("-");
      const datos = {
        cliente: venta.cliente,
        productos,
        descuento: venta.descuento,
        generar_cfdi: venta.factura.length ? true : false,
        ieps: parseFloat(venta.ieps.toFixed(2)),
        impuestos: parseFloat(venta.impuestos.toFixed(2)),
        iva: parseFloat(venta.iva.toFixed(2)),
        subTotal: venta.subTotal,
        total: venta.total,
        observaciones,
        usuario: venta.usuario,
        venta: venta._id,
        folio: venta.folio,
        cambio: venta.saldo_favor,
        devolucion_en: forma_pago[0],
        payment_form: forma_pago[1],
        payment_method: "PUE"
      };
      await crearNotaCredito({
        variables: {
          input: datos,
          empresa: turnoEnCurso.empresa,
          sucursal: turnoEnCurso.sucursal,
          turno
        },
      });
      setLoading(false);
      setAlert({ message: "Listo", status: "success", open: true });
      handleClose();
      setObservaciones("");
      localStorage.removeItem("DatosVentas")
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
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box>
              <img
                src={NotaIcon}
                alt="icono ventas"
                className={classes.iconSizeDialogsPequeno}
              />
            </Box>
            <Box mx={2} flexGrow={1}>
              <Typography variant="h5">Crear nota de crédito</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}
              size="large"
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Container maxWidth="xs">
              <TextField
                label="Observaciones o comentarios"
                onChange={(e) => setObservaciones(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={2}
              />
              <Box mb={2} />
              <Box
                mb={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Devolución en:</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={datosVenta.factura.length ? true : false}
                    />
                  }
                  label="Generar CFDI"
                />
              </Box>
              <FormControl component="fieldset">
                <RadioGroup
                  value={cambio.tipo}
                  onChange={handleChangeCambio}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControlLabel
                      value="monto_efectivo-01"
                      control={<Radio />}
                      label="Efectivo"
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled={cambio.tipo !== "monto_efectivo-01"}
                      value={
                        cambio.tipo === "monto_efectivo-01" ? cambio.cambio : "0"
                      }
                      style={{ width: "150px" }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControlLabel
                      value="monto_tarjeta_credito-04"
                      control={<Radio />}
                      label="T. crébito"
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled={cambio.tipo !== "monto_tarjeta_credito-04"}
                      value={
                        cambio.tipo === "monto_tarjeta_credito-04"
                          ? cambio.cambio
                          : "0"
                      }
                      style={{ width: "150px" }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControlLabel
                      value="monto_monedero-05"
                      control={<Radio />}
                      label="M. electrónico"
                      disabled={!datosVenta.cliente}
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled={cambio.tipo !== "monto_monedero-05"}
                      value={
                        cambio.tipo === "monto_monedero-05" ? cambio.cambio : "0"
                      }
                      style={{ width: "150px" }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControlLabel
                      value="monto_transferencia-03"
                      control={<Radio />}
                      label="Transferencia"
                    />
                    <TextField
                      variant="standard"
                      disabled={cambio.tipo !== "monto_transferencia-03"}
                      size="small"
                      value={
                        cambio.tipo === "monto_transferencia-03"
                          ? cambio.cambio
                          : "0"
                      }
                      style={{ width: "150px" }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControlLabel
                      value="monto_cheques-02"
                      control={<Radio />}
                      label="Cheques"
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled={cambio.tipo !== "monto_cheques-02"}
                      value={
                        cambio.tipo === "monto_cheques-02" ? cambio.cambio : "0"
                      }
                      style={{ width: "150px" }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
              <Box mt={2}>
                <Typography>{`Subtotal: $${formatoMexico(
                  datosVenta.subTotal
                )}`}</Typography>
                <Typography>{`Impuestos: $${formatoMexico(
                  datosVenta.impuestos
                )}`}</Typography>

                <Typography>
                  <b>{`Total anterior: $${formatoMexico(
                    datosVenta.total_original
                  )}`}</b>
                </Typography>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">{`Total: $${formatoMexico(
                    datosVenta.total
                  )}`}</Typography>
                  <Typography variant="h6">{`Cambio: $${formatoMexico(
                    datosVenta.saldo_favor
                  )}`}</Typography>
                </Box>
              </Box>
            </Container>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => crearNota()}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : <Add />
            }
            disabled={!datosVenta.saldo_favor}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CrearNota;
