import React, { useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DoneIcon from "@material-ui/icons/Done";
import moment from "moment";
import { verificarDatosFactura } from "./validacion_factura";
import { factura_initial_state } from "./initial_factura_states";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx";
import { CREAR_FACTURA } from "../../../../gql/Facturacion/Facturacion";
import { useMutation } from "@apollo/client";
import { formaPago, metodoPago, usosCfdi } from "../catalogos";
import { Close, Done } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RealizarFactura({ setAlert }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    datosFactura,
    setDatosFactura,
    codigo_postal,
    setCodigoPostal,
    productos,
    setProductos,
    venta_factura,
    setVentaFactura,
    setError,
  } = useContext(FacturacionCtx);

  const [CrearFactura] = useMutation(CREAR_FACTURA);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const limpiarCampos = () => {
    setDatosFactura(factura_initial_state);
    setVentaFactura(null);
    setProductos([]);
    setCodigoPostal("");
  };

  const crearFactura = async () => {
    try {
      setLoading(true);
      let nuevo_obj = { ...datosFactura };
      const items = [];

      productos.forEach((producto) => {
        let { iva, ieps } = producto.id_producto.precios;
        let Taxes = [];

        if (producto.iva_total) {
          Taxes.push({
            Total: producto.iva_total.toFixed(2),
            Name: "IVA",
            Base: producto.subtotal.toFixed(2),
            Rate: `0.${iva < 10 ? `0${iva}` : iva}`,
            IsRetention: "false",
          });
        }
        if (producto.ieps_total) {
          Taxes.push({
            Total: producto.ieps_total.toFixed(2),
            Name: "IEPS",
            Base: producto.subtotal.toFixed(2),
            Rate: `0.${ieps < 10 ? `0${ieps}` : ieps}`,
            IsRetention: "true",
          });
        }
        items.push({
          ProductCode:
            producto.id_producto.datos_generales.clave_producto_sat.Value,
          IdentificationNumber: producto.id_producto._id,
          Description: producto.id_producto.datos_generales.nombre_comercial,
          UnitCode: producto.codigo_unidad,
          UnitPrice: producto.precio_unidad.precio_venta.toFixed(2),
          Quantity: producto.cantidad_venta.toString(),
          Subtotal: producto.subtotal_antes_de_impuestos.toFixed(2),
          Discount: producto.descuento_activo
            ? producto.descuento_producto.dinero_descontado.toFixed(2)
            : "0.00",
          Taxes: Taxes.length ? Taxes : null,
          Total: producto.total.toFixed(2),
        });
      });
      //poner la fecha de facturacion
      if (datosFactura.date === "1") {
        nuevo_obj.date = moment()
          .subtract(1, "d")
          .format("YYYY-MM-DDTHH:mm:ss");
      } else if (datosFactura.date === "2") {
        nuevo_obj.date = moment()
          .subtract(2, "d")
          .format("YYYY-MM-DDTHH:mm:ss");
      } else {
        nuevo_obj.date = moment().locale("es-mx").format("YYYY-MM-DDTHH:mm:ss");
      }

      nuevo_obj.items = items;
      nuevo_obj.expedition_place = codigo_postal;
      nuevo_obj.id_venta = venta_factura._id;
      nuevo_obj.folio_venta = venta_factura.folio;

      //console.log(nuevo_obj);

      /* validar todos los datos */
      const validate = verificarDatosFactura(nuevo_obj);
      if (validate.length) {
        setError({ status: true, message: validate[0].message });
        setLoading(false);
        return;
      }
      setError({ status: false, message: "" });

      /* console.log(nuevo_obj); */

      let result = await CrearFactura({
        variables: {
          input: nuevo_obj,
        },
      });
      setLoading(false);
      setAlert({
        message: `¡Listo! ${result.data.crearFactura.message}`,
        status: "success",
        open: true,
      });
      limpiarCampos();
      handleClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.message) {
        setAlert({
          message: error.message,
          status: "error",
          open: true,
        });
      } else if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        startIcon={<DoneIcon />}
        size="large"
        onClick={() => handleClickOpen()}
      >
        Guardar
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <Box display="flex" justifyContent="flex-end" m={1}>
          <Button
            onClick={() => handleClose()}
            size="large"
            color="secondary"
            variant="contained"
            disabled={loading}
          >
            <Close />
          </Button>
        </Box>
        <DialogContent>
          <InputsFacturaModal />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
            onClick={() => crearFactura()}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const InputsFacturaModal = () => {
  const { datosFactura, setDatosFactura, error_validation } = useContext(
    FacturacionCtx
  );

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    setDatosFactura({
      ...datosFactura,
      [name]: value,
    });
  };

  const obtenerUsoCfdi = (e) => {
    const { name, value } = e.target;
    setDatosFactura({
      ...datosFactura,
      receiver: {
        ...datosFactura.receiver,
        [name]: value,
      },
    });
  };

  return (
    <Box>
      <Box my={1}>
        <Typography>Fecha de facturación</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          name="date"
          error={error_validation.status && !datosFactura.date}
        >
          <Select value={datosFactura.date} name="date" onChange={obtenerDatos}>
            <MenuItem value="">
              <em>Selecciona una fecha</em>
            </MenuItem>
            <MenuItem value="0">
              {moment().locale("es-mx").format("LL")}
            </MenuItem>
            <MenuItem value="1">
              {moment().subtract(1, "d").format("LL")}
            </MenuItem>
            <MenuItem value="2">
              {moment().subtract(2, "d").format("LL")}
            </MenuItem>
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.date
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box my={1}>
        <Typography>Forma de pago</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          name="payment_form"
          error={error_validation.status && !datosFactura.payment_form}
        >
          <Select
            value={datosFactura.payment_form}
            name="payment_form"
            onChange={obtenerDatos}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            {formaPago.map((res, index) => (
              <MenuItem
                key={index}
                value={res.Value}
              >{`${res.Value} - ${res.Name}`}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.payment_form
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box my={1}>
        <Typography>Método de pago</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          name="payment_method"
          error={error_validation.status && !datosFactura.payment_method}
        >
          <Select
            value={datosFactura.payment_method}
            name="payment_method"
            onChange={obtenerDatos}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            {metodoPago.map((res, index) => (
              <MenuItem
                key={index}
                value={res.Value}
              >{`${res.Value} - ${res.Name}`}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.payment_method
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <Typography>Uso de CFDi</Typography>
        <FormControl
          fullWidth
          size="small"
          variant="outlined"
          error={error_validation.status && !datosFactura.receiver.CfdiUse}
        >
          <Select
            value={datosFactura.receiver.CfdiUse}
            name="CfdiUse"
            onChange={obtenerUsoCfdi}
          >
            <MenuItem value="">
              <em>Selecciona uno</em>
            </MenuItem>
            {usosCfdi.map((res, index) => (
              <MenuItem
                key={index}
                value={res.Value}
              >{`${res.Value} - ${res.Name}`}</MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {error_validation.status && !datosFactura.receiver.CfdiUse
              ? error_validation.message
              : ""}
          </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};
