import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Slide,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import RegistroInfoAdidional from "../../sucursales/Catalogos/Producto/PreciosVenta/registrarInfoAdicional";
import RegistroInformacionRapido from "./RegistroInformacionRapido";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import {
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_preciosP,
  initial_state_unidadVentaXDefecto,
  initial_state_presentaciones,
  initial_state_unidadVentaSecundaria,
} from "../../../context/Catalogos/initialStatesProducto";
import { cleanTypenames } from "../../../config/reuserFunctions";
import TallasColoresRapidos from "./TallasColoresRapidos/TallasColoresRapidos";
import { RegProductoContext } from "../../../context/Catalogos/CtxRegProducto";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREAR_PRODUCTO_RAPIDO,
  OBTENER_CONSULTAS,
} from "../../../gql/Catalogos/productos";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import Acceso from "../../../components/AccesosPassword/Acceso";
import { AccesosContext } from "../../../context/Accesos/accesosCtx";
import { validateJsonEdit } from "../../sucursales/Catalogos/Producto/validateDatos";
import ArticuloIcon from "../../../icons/ventas/tiempo-rapido.svg"
import DetallesIcon from "../../../icons/portapapeles.svg"
import ColoresIcon from "../../../icons/tallas-colores.svg"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-reg-product-${index}`}
      aria-labelledby={`reg-product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} height="70vh">
          {children}
        </Box>
      )}
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
    id: `reg-product-tab-${index}`,
    "aria-controls": `tabpanel-reg-product-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  iconSizeDialogs: {
    width: 80,
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  iconSvg: {
    width: 50,
  },
  dialogContent: {
    padding: 0,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  iconSizeSecondSuperior: {
    width: 20,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ArticuloRapido() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [cargando, setCargando] = useState(false);

  const {
    datos_generales,
    setDatosGenerales,
    precios,
    setPrecios,
    validacion,
    setValidacion,
    setPreciosP,
    preciosP,
    setUnidadesVenta,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
    setCentroDeCostos,
    presentaciones,
    setPresentaciones,
  } = useContext(RegProductoContext);

  const { setAlert, open, setOpen , updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);

  const {
    reloadProductoRapido,
    setReloadProductoRapido,
    setAbrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  let datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
  const [crearProductoRapido] = useMutation(CREAR_PRODUCTO_RAPIDO);

  const { data, refetch, loading, error } = useQuery(OBTENER_CONSULTAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
  });

  const resetInitialStates = () => {
    setDatosGenerales(initial_state_datos_generales);
    setPrecios(initial_state_precios);
    setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
    setUnidadVentaSecundaria(initial_state_unidadVentaSecundaria);
    setPreciosP(initial_state_preciosP);
    setUnidadesVenta([]);
    setCentroDeCostos({});
    setValidacion({ error: false, message: "" });
    setPresentaciones([]);
    setValue(0);
  };

  const [abrirTallaColor, setAbrirTallaColor] = useState(false);

  const [cantidad, setCantidad] = useState(0);

  const handleClickOpen = () => {
    setOpen(!open);
    resetInitialStates();
    setAbrirTallaColor(false);
  };

  const AceesoProductoRapido = () => {
    if (sesion.accesos.ventas.producto_rapido.ver === true) {
      handleClickOpen();
    } else {
      setAbrirPanelAcceso(true);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "producto_rapido",
        tipo_acceso: "ver",
      });
    }
  };

  useEffect(() => {
    if (reloadProductoRapido === true) {
      handleClickOpen();
      setReloadProductoRapido(false);
    }
  }, [reloadProductoRapido]);

  useEffect(() => {
    return () => {
      refetch();
    };
  }, []);
  window.addEventListener("keydown", Mi_función);

  function Mi_función(e) {
    if (e.altKey && e.keyCode === 82) {
      AceesoProductoRapido();
    }
  }

  if (loading | !data || error)
    return (
      <Button
        disabled
        value="articulo-rapido"
        style={{
          textTransform: "none",
          height: "100%",
          width: "100%",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={ArticuloIcon}
              alt="icono caja2"
              className={classes.iconSizeSecondSuperior}
            />
          </Box>
          <Typography variant="body2">
            <b>Producto Rapido</b>
          </Typography>
          <Typography variant="caption" style={{ color: "#808080" }}>
            <b>Alt + R</b>
          </Typography>
        </Box>
      </Button>
    );

  const { obtenerConsultasProducto } = data;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const saveData = async () => {
    setCargando(true);
    if (datos_generales.tipo_producto === "OTROS" && cantidad < 1) {
      return setValidacion(true);
    } else {
      if (
        !datos_generales.clave_alterna ||
        !datos_generales.tipo_producto ||
        !datos_generales.nombre_generico ||
        !datos_generales.nombre_comercial ||
        !precios.precio_de_compra.precio_con_impuesto ||
        !precios.precio_de_compra.precio_sin_impuesto ||
        !precios.unidad_de_compra.cantidad
      ) {
        return setValidacion(true);
      }
    }
    /* if (unidadesVenta.length === 0) {
      unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = unidadesVenta.filter(
        (unidades) => unidades.default
      );
      if (unidadxdefecto.length === 0) unidadesVenta.push(unidadVentaXDefecto);
    } */
    let copy_unidadesVenta = [
      { ...unidadVentaXDefecto },
      { ...unidadVentaSecundaria },
    ];
    precios.precios_producto = preciosP;

    if (datos_generales.tipo_producto === "OTROS" && cantidad < 1) {
      setPresentaciones(initial_state_presentaciones);
      setCantidad(0);
    }

    const data = {
      datos_generales: await validateJsonEdit(
        datos_generales,
        "datos_generales"
      ),
      precios,
      unidades_de_venta: await validateJsonEdit(
        copy_unidadesVenta,
        "unidades_de_venta"
      ),
      presentaciones,
      cantidad,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      usuario: sesion._id,
    };

    try {
      const input = cleanTypenames(data);
      const result = await crearProductoRapido({
        variables: {
          input,
        },
      });
      resetInitialStates();
      refetch();
      setUpdateTablaVentas(!updateTablaVentas);
      setAlert({
        message: `¡Listo ${result.data.crearProductoRapido.message}!`,
        status: "success",
        open: true,
      });
      setCargando(false);
      handleClickOpen();
    } catch (error) {
      resetInitialStates();
      refetch();
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      setCargando(false);
      handleClickOpen();
      console.log(error);
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  const saveButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => saveData()}
      size="large"
      startIcon={<DoneIcon />}
      disabled={
        datos_generales.tipo_producto === "OTROS"
          ? !datos_generales.clave_alterna ||
            !datos_generales.tipo_producto ||
            !datos_generales.nombre_generico ||
            !datos_generales.nombre_comercial ||
            !cantidad ||
            !precios.precio_de_compra.precio_con_impuesto ||
            !precios.precio_de_compra.precio_sin_impuesto ||
            !precios.unidad_de_compra.cantidad
            ? true
            : false
          : !datos_generales.clave_alterna ||
            !datos_generales.tipo_producto ||
            !datos_generales.nombre_generico ||
            !datos_generales.nombre_comercial ||
            !precios.precio_de_compra.precio_con_impuesto ||
            !precios.precio_de_compra.precio_sin_impuesto ||
            !precios.unidad_de_compra.cantidad
          ? true
          : false
      }
    >
      Guardar
    </Button>
  );

  const ButtonActions = () => {
    if (value === 1) {
      return saveButton;
    } else {
      if (
        datos_generales.tipo_producto === "OTROS" ||
        !datos_generales.tipo_producto
      ) {
        return saveButton;
      } else {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setValue(value + 1)}
            size="large"
            endIcon={<NavigateNext />}
            disableElevation
          >
            Siguiente
          </Button>
        );
      }
    }
  };

  return (
    <>
      <Acceso />
      <Button
        onClick={() => {
          AceesoProductoRapido();
        }}
        value="articulo-rapido"
        style={{ textTransform: "none", height: "100%", width: "100%" }}
        disabled={!turnoEnCurso || (datosVentas && datosVentas.nota_credito)}
      >
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={ArticuloIcon}
              alt="icono caja2"
              className={classes.iconSizeSecondSuperior}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Producto Rapido</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>Alt + R</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        maxWidth="lg"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClickOpen();
          }
        }}
        TransitionComponent={Transition}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Box display="flex">
            <Box display="flex" flexGrow={1} justifyContent="space-between">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                <Tab
                  label="Datos generales"
                  icon={
                    <Badge
                      color="secondary"
                      badgeContent={<Typography variant="h6">!</Typography>}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      invisible={
                        validacion.error && validacion.vista1 ? false : true
                      }
                    >
                      <img
                        src={DetallesIcon}
                        alt="icono registro"
                        className={classes.iconSvg}
                      />
                    </Badge>
                  }
                  {...a11yProps(0)}
                />
                {abrirTallaColor === false ||
                datos_generales.tipo_producto === "OTROS" ? null : (
                  <Tab
                    label="Tallas y colores"
                    icon={
                      <Badge
                        color="secondary"
                        badgeContent={<Typography variant="h6">!</Typography>}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        invisible={
                          validacion.error && validacion.vista7 ? false : true
                        }
                      >
                        <img
                          src={ColoresIcon}
                          alt="icono colores"
                          className={classes.iconSvg}
                        />
                      </Badge>
                    }
                    {...a11yProps(6)}
                  />
                )}
              </Tabs>
            </Box>
            <Box p={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleClickOpen();
                  resetInitialStates();
                }}
                size="large"
              >
                <CloseIcon />
              </Button>
            </Box>
          </Box>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
          <Backdrop className={classes.backdrop} open={cargando}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className={classes.root}>
            <TabPanel value={value} index={0}>
              <RegistroInformacionRapido
                setAbrirTallaColor={setAbrirTallaColor}
                setCantidad={setCantidad}
                cantidad={cantidad}
                obtenerConsultasProducto={obtenerConsultasProducto}
                refetch={refetch}
              />
              <RegistroInfoAdidional />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TallasColoresRapidos
                obtenerConsultasProducto={obtenerConsultasProducto}
                refetch={refetch}
              />
            </TabPanel>
          </div>
        </DialogContent>
        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Box p={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setValue(value - 1)}
              size="large"
              startIcon={<NavigateBefore />}
              disabled={value === 0}
            >
              Anterior
            </Button>
          </Box>
          <Box p={1}>
            <ButtonActions />
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
