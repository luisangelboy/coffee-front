import React, { Fragment, useContext, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import FormularioPrecios from "../../../Catalogos/Producto/PreciosVenta/registrarInfoAdicional";
import { Close, LocalAtm, SquareFoot } from "@material-ui/icons";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import Done from "@material-ui/icons/Done";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { CircularProgress, DialogTitle } from "@material-ui/core";
import TablaPresentaciones from "../../../Catalogos/Producto/TallasColores/TablaPresentaciones";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ height: "80vh" }}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

export default function AlertDialogSlide({
  agregarCompra,
  handleClose,
  cargando,
}) {
  const [open, setOpen] = useState(false);
  const [onUpdate, setOnUpdate] = useState([]);
  const { datosProducto, productoOriginal /* setDatosProducto */ } = useContext(
    ComprasContext
  );
  const {
    precios,
    setPrecios,
    setUnidadesVenta,
    setPreciosP,
    setUnidadVentaXDefecto,
    setUnidadVentaSecundaria,
  } = useContext(RegProductoContext);

  const toggleDrawer = () => setOpen(!open);

  const resetProducto = () => {
    /* SET STATES WHEN UPDATING */
    const { precios_producto, ...new_precios } = productoOriginal.precios;
    const { unidades_de_venta } = productoOriginal;
    let unidades_secundaria = productoOriginal.unidades_de_venta.filter(
      (res) => res.default === false
    );
    let unidadxdefecto = productoOriginal.unidades_de_venta.filter(
      (res) => res.default === true
    );
    /* setDatosProducto({...datosProducto, mantener_precio: true}) */
    setPrecios(new_precios);
    setUnidadesVenta(unidades_de_venta);
    setPreciosP(productoOriginal.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    setUnidadVentaSecundaria(unidades_secundaria[0]);
    toggleDrawer();
  };

  const actualizarContextProducto = () => {
    toggleDrawer();
    let precio_unitario_con_impuesto =
      datosProducto.costo / precios.unidad_de_compra.cantidad;
    let precio_unitario_sin_impuesto =
      precios.precio_de_compra.precio_sin_impuesto /
      precios.unidad_de_compra.cantidad;

    if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
    if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;

    setPrecios({
      ...precios,
      precio_de_compra: {
        ...precios.precio_de_compra,
        precio_con_impuesto: datosProducto.costo,
      },
      unidad_de_compra: {
        ...precios.unidad_de_compra,
        precio_unitario_con_impuesto: parseFloat(
          precio_unitario_con_impuesto.toFixed(2)
        ),
        precio_unitario_sin_impuesto: parseFloat(
          precio_unitario_sin_impuesto.toFixed(2)
        ),
      },
    });
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Button
        color="primary"
        size="medium"
        onClick={() => actualizarContextProducto()}
      >
        Actualizar precios
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => resetProducto()}
        aria-labelledby="alert-precios-compra-title"
        aria-describedby="alert-precios-compra-description"
        fullWidth
        maxWidth="lg"
      >
        {datosProducto.producto.datos_generales &&
        datosProducto.producto.datos_generales.tipo_producto !== "OTROS" ? (
          <DialogTitle style={{ padding: 0 }}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                <Tab label="Precios" icon={<LocalAtm />} {...a11yProps(0)} />
                <Tab
                  label="Precios Medidas"
                  icon={<SquareFoot />}
                  {...a11yProps(1)}
                />
              </Tabs>
            </AppBar>
          </DialogTitle>
        ) : null}
        <DialogContent>
          {datosProducto.producto.datos_generales &&
          datosProducto.producto.datos_generales.tipo_producto !== "OTROS" ? (
            <div>
              <TabPanel value={value} index={0}>
                <FormularioPrecios />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TablaPresentaciones
                  from="compras"
                  datos={datosProducto.producto}
                  setOnUpdate={setOnUpdate}
                  onUpdate={onUpdate}
                  onlyPrice={true}
                />
              </TabPanel>
            </div>
          ) : (
            <FormularioPrecios />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            size="large"
            startIcon={<Close />}
            onClick={() => resetProducto()}
          >
            Cancelar
          </Button>
          <Button
            size="large"
            onClick={() => {
              /* setDatosProducto({...datosProducto, mantener_precio: false}) */
              agregarCompra("actualizar_precios");
              handleClose();
              toggleDrawer();
            }}
            startIcon={
              cargando ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Done />
              )
            }
            color="primary"
            variant="contained"
            disabled={!precios.precio_de_compra.precio_con_impuesto}
          >
            Aceptar y agregar compra
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
