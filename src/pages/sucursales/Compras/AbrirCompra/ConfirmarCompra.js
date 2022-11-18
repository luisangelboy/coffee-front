import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import { ComprasContext } from "../../../../context/Compras/comprasContext";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { Done, Close } from "@material-ui/icons";
import { useDebounce } from "use-debounce";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmarCompra({ realizarCompraBD }) {
  const [open, setOpen] = useState(false);
  const [loading_modal, setLoadingModal] = useState(false);
  const [credito, setCredito] = useState(false);
  const [productos_recalculados, setProductosRecalculados] = useState([]);
  const { productosCompra, datosCompra, setDatosCompra, issue } = useContext(
    ComprasContext
  );
  const initial_state_descuento = {
    subtotal: 0,
    impuestos: 0,
    total: 0,
    descuento_aplicado: false,
    porcentaje: 0,
    cantidad_descontada: 0,
    precio_con_descuento: 0,
  };
  const [descuento_base, setDescuentoBase] = useState(initial_state_descuento);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [descuento_debounce, setDescuentoDebounce] = useState(0);
  const [porcentaje_debounce, setPorcentajeDebounce] = useState(0);

  const cleanStates = () => {
    setCredito(false);
    setProductosRecalculados([]);
    setDescuentoBase(initial_state_descuento);
  };

  const obtenerFormaPago = (forma_pago) => {
    setDatosCompra({
      ...datosCompra,
      forma_pago,
    });
  };

  const aplicarDescuento = (descuento_aplicado) => {
    if (!descuento_aplicado) {
      setDescuentoBase({
        ...descuento_base,
        subtotal: datosCompra.subtotal,
        total: datosCompra.total,
        descuento_aplicado,
        porcentaje: 0,
        cantidad_descontada: 0,
        precio_con_descuento: 0,
      });
      return;
    }
    setDescuentoBase({
      ...descuento_base,
      descuento_aplicado,
    });
  };

  const obtenerPorcentaje = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDescuentoBase({
        ...descuento_base,
        porcentaje: 0,
        cantidad_descontada: 0,
      });
      return;
    }
    let porcentaje = parseFloat(value);
    let cantidad_descontada = Math.round(
      (datosCompra.subtotal * porcentaje) / 100
    );

    setDescuentoBase({
      ...descuento_base,
      porcentaje,
      cantidad_descontada,
    });
  };

  const obtenerPrecio = (value) => {
    if (!value || parseFloat(value) === 0) {
      setDescuentoBase({
        ...descuento_base,
        porcentaje: 0,
        cantidad_descontada: 0,
      });
      return;
    }

    let cantidad_descontada = parseFloat(value);
    let porcentaje = Math.round(
      (cantidad_descontada / datosCompra.subtotal) * 100
    );

    setDescuentoBase({
      ...descuento_base,
      porcentaje,
      cantidad_descontada,
    });
  };

  const [DESCUENTO] = useDebounce(descuento_debounce, 700);
  const [PORCENTAJE] = useDebounce(porcentaje_debounce, 700);

  const recalcularPrecios = () => {
    //aplicar descuento a los productos y actualizar precios
    const productos = [...productosCompra];
    const datos_descuento = { ...initial_state_descuento };
    const {
      porcentaje,
      cantidad_descontada,
      descuento_aplicado,
    } = descuento_base;
    let productos_array = [];

    for (let index = 0; index < productos.length; index++) {
      const producto = productos[index];
      const copy_producto = { ...producto };
      const { precios } = copy_producto.producto;
      const { iva, ieps } = precios;
      const subtotal_actual = copy_producto.subtotal;

      const cantidad_descontada_product = Math.round(
        (subtotal_actual * porcentaje) / 100
      );
      const subtotal_con_descuento =
        subtotal_actual - cantidad_descontada_product;

      const iva_precio =
        parseFloat(subtotal_con_descuento) *
        parseFloat(iva < 10 ? ".0" + iva : "." + iva);
      const ieps_precio =
        parseFloat(subtotal_con_descuento) *
        parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);

      const impuestos = iva_precio + ieps_precio;
      const total = subtotal_con_descuento + impuestos;

      copy_producto.iva_total = iva_precio;
      copy_producto.ieps_total = ieps_precio;
      copy_producto.descuento_porcentaje = porcentaje;
      copy_producto.descuento_precio = cantidad_descontada_product;
      copy_producto.impuestos = impuestos;
      copy_producto.subtotal = subtotal_con_descuento;
      copy_producto.total = total;

      //sumar los totales a datosCompra
      datos_descuento.impuestos += impuestos;
      datos_descuento.subtotal += subtotal_con_descuento;
      datos_descuento.total += total;

      //meterlo al nuevo array
      productos_array.push(copy_producto);
    }
    //poner los nuevos productos
    setProductosRecalculados(productos_array);
    datos_descuento.porcentaje = porcentaje;
    datos_descuento.cantidad_descontada = cantidad_descontada;
    datos_descuento.descuento_aplicado = descuento_aplicado;
    setDescuentoBase(datos_descuento);
  };

  useEffect(() => {
    recalcularPrecios();
  }, [DESCUENTO, PORCENTAJE]);

  return (
    <div>
      <Button
        autoFocus
        color="primary"
        variant="contained"
        size="large"
        onClick={() => handleClickOpen()}
        disabled={!productosCompra.length || issue}
        startIcon={<Done />}
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
        aria-labelledby="dialog-confirmacion-compra"
        aria-describedby="dialog-confirmacion-compra-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle style={{ padding: 0 }}>
          <Box m={1} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}
              size="small"
              disabled={loading_modal}
            >
              <Close style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box my={2}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={credito}
                      onChange={(e) => setCredito(e.target.checked)}
                    />
                  }
                  label="Compra a crédito"
                />
                <Typography>Fecha de vencimiento del crédito</Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="date"
                  onChange={(e) => {
                    setDatosCompra({
                      ...datosCompra,
                      fecha_vencimiento_credito: e.target.value,
                    });
                  }}
                  disabled={!credito}
                  value={datosCompra.fecha_vencimiento_credito}
                />
              </Grid>
              <Grid item md={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="forma_pago"
                >
                  <InputLabel id="forma_pago">Forma de pago</InputLabel>
                  <Select
                    labelId="forma_pago"
                    value={datosCompra.forma_pago}
                    name="forma_pago"
                    onChange={(e) => obtenerFormaPago(e.target.value)}
                    label="Forma de pago"
                  >
                    {formaPago.map((res, index) => (
                      <MenuItem
                        key={index}
                        value={res.Value}
                      >{res.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={descuento_base.descuento_aplicado}
                      onChange={(e) => aplicarDescuento(e.target.checked)}
                      name="descuento_aplicado"
                    />
                  }
                  label="Aplicar descuento"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    obtenerPrecio(e.target.value);
                    setDescuentoDebounce(e.target.value);
                  }}
                  disabled={!descuento_base.descuento_aplicado}
                  value={descuento_base.cantidad_descontada}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  variant="outlined"
                  type="number"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    obtenerPorcentaje(e.target.value);
                    setPorcentajeDebounce(e.target.value);
                  }}
                  disabled={!descuento_base.descuento_aplicado}
                  value={descuento_base.porcentaje}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item md={4}>
                <Typography>
                  <b>Subtotal:</b>
                  {" $" +
                    formatoMexico(
                      !descuento_base.subtotal
                        ? datosCompra.subtotal
                        : descuento_base.subtotal
                    )}
                </Typography>
              </Grid>
              <Grid item md={4}>
                <Typography>
                  <b>Impuestos:</b>
                  {" $" +
                    formatoMexico(
                      !descuento_base.impuestos
                        ? datosCompra.impuestos
                        : descuento_base.impuestos
                    )}
                </Typography>
              </Grid>
              <Grid item md={4}>
                <Typography>
                  <b>Total:</b>
                  {" $" +
                    formatoMexico(
                      !descuento_base.total
                        ? datosCompra.total
                        : descuento_base.total
                    )}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              cleanStates();
              realizarCompraBD(
                false,
                credito,
                handleClose,
                setLoadingModal,
                descuento_base,
                productos_recalculados
              );
            }}
            variant="contained"
            color="primary"
            startIcon={
              loading_modal ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
            disabled={loading_modal || !datosCompra.forma_pago}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export const formaPago = [
  {
    Name: "Efectivo",
    Value: "01",
  },
  {
    Name: "Cheque nominativo",
    Value: "02",
  },
  {
    Name: "Transferencia electrónica de fondos",
    Value: "03",
  },
  {
    Name: "Tarjeta de crédito",
    Value: "04",
  },
  {
    Name: "Monedero electrónico",
    Value: "05",
  },
  {
    Name: "Vales de despensa",
    Value: "08",
  },
  {
    Name: "Tarjeta de débito",
    Value: "28",
  },
  {
    Name: "Por definir",
    Value: "99",
  },
];