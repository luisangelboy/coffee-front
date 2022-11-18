import React, { useState, Fragment, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import {
  Button,
  Badge,
  Typography,
  CircularProgress,
  Backdrop,
  IconButton,
} from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import RegistroInfoGenerales from "./DatosGenerales/registrarInfoGeneral";
import RegistroInfoAdidional from "../Producto/PreciosVenta/registrarInfoAdicional";
import CargarImagenesProducto from "./Imagenes/cargarImagenesProducto";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
import RegistroAlmacenInicial from "./Inventario&Almacen/AlmacenInicial";
import ColoresTallas from "./TallasColores/TallasColores";
import ErrorPage from "../../../../components/ErrorPage";

import { useMutation, useQuery } from "@apollo/client";
import {
  CREAR_PRODUCTO,
  OBTENER_CONSULTAS,
  ACTUALIZAR_PRODUCTO,
} from "../../../../gql/Catalogos/productos";
import { validaciones } from "./validaciones";
import CentroCostos from "./CentroCostos/CentroCostos";
import PrecioPlazos from "./PrecioPlazos/PrecioPlazos";

import {
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_unidadVentaXDefecto,
  initial_state_almacen_inicial,
  initial_state_centro_de_costos,
  initial_state_preciosPlazos,
  initial_state_unidadVentaSecundaria,
  initial_state_unidadesVenta,
} from "../../../../context/Catalogos/initialStatesProducto";
import {
  Add,
  Close,
  Edit,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons";
import { validateJsonEdit } from "./validateDatos";
/* import { cleanTypenames } from "../../../../config/reuserFunctions"; */
/* import SnackBarMessages from '../../../../components/SnackBarMessages'; */

import detallesImg from "../../../../icons/portapapeles.svg";
import preciosImg from "../../../../icons/etiqueta-de-precio.svg";
import almacenesImg from "../../../../icons/tarea-completada.svg";
import imagenesImg from "../../../../icons/imagenes.svg";
import tallasImg from "../../../../icons/tallas-colores.svg";

export const initial_state_preciosP = [
  {
    numero_precio: 1,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
    iva_precio: 0,
    ieps_precio: 0,
  },
  {
    numero_precio: 2,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
    iva_precio: 0,
    ieps_precio: 0,
  },
  {
    numero_precio: 3,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
    iva_precio: 0,
    ieps_precio: 0,
  },
  {
    numero_precio: 4,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
    iva_precio: 0,
    ieps_precio: 0,
  },
  {
    numero_precio: 5,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
    iva_precio: 0,
    ieps_precio: 0,
  },
  {
    numero_precio: 6,
    utilidad: 0,
    precio_neto: 0,
    unidad_mayoreo: 0,
    precio_venta: 0,
    iva_precio: 0,
    ieps_precio: 0,
  },
];

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
  root_app: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    maxHeight: "80vh",
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
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function CrearProducto({
  accion,
  datos,
  productosRefetch,
  fromCompra,
  getProductos,
  isOnline,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const {
    datos_generales,
    setDatosGenerales,
    precios,
    setPrecios,
    validacion,
    setValidacion,
    preciosP,
    setPreciosP,
    imagenes,
    setImagenes,
    setUnidadesVenta,
    almacen_inicial,
    setAlmacenInicial,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    centro_de_costos,
    setCentroDeCostos,
    setUpdate,
    preciosPlazos,
    setPreciosPlazos,
    setSubcategorias,
    setOnPreview,
    setSubcostos,
    imagenes_eliminadas,
    setImagenesEliminadas,
    presentaciones,
    setPresentaciones,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
    setAlmacenExistente,
    almacen_existente,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
  } = useContext(RegProductoContext);

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* const [ alert, setAlert ] = useState({ message: '', status: '', open: false }); */
  const { setAlert } = useContext(RegProductoContext);
  const [loading, setLoading] = useState(false);
  const tipo = datos_generales.tipo_producto;

  /* Mutations */
  const [crearProducto] = useMutation(CREAR_PRODUCTO);
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  const toggleModal = (producto) => {
    setOpen(!open);
    setUpdate(accion);
    if (producto && accion) {
      setInitialStates(producto);
    } else {
      resetInitialStates();
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  /* ###### GUARDAR LA INFO EN LA BD ###### */

  const saveData = async () => {
    const validate = validaciones(
      datos_generales,
      precios,
      almacen_inicial,
      presentaciones,
      almacen_existente
    );

    if (validate.error) {
      setValidacion(validate);
      return;
    }
    setValidacion(validate);
    if (presentaciones.length > 0) {
      const pres = presentaciones.filter(
        (res) => res.color._id && res.medida._id
      );

      if (pres.length !== presentaciones.length) {
        setValidacion({
          error: true,
          message: "Faltan medidas o colores a tus presentaciones",
          vista7: true,
        });
        setAlert({
          message: `Faltan medidas o colores en tus presentaciones`,
          status: "error",
          open: true,
        });
        return;
      }
    }

    let copy_unidadesVenta = [
      { ...unidadVentaXDefecto },
      { ...unidadVentaSecundaria },
    ];

    /* if (copy_unidadesVenta.length === 0) {
      copy_unidadesVenta.push(unidadVentaXDefecto);
    } else {
      const unidadxdefecto = copy_unidadesVenta.filter(
        (unidades) => unidades.default === true
      );
      if (unidadxdefecto.length === 0) {
        copy_unidadesVenta.splice(0, 0, unidadVentaXDefecto);
      }
    } */

    /* console.log(copy_unidadesVenta); */

    precios.precios_producto = preciosP;

    let imagenes_without_aws = imagenes;
    if (accion) {
      imagenes_without_aws = [...imagenes].filter((res) => !res.key_imagen);
    }

    let input = {
      datos_generales: await validateJsonEdit(
        datos_generales,
        "datos_generales"
      ),
      precios,
      imagenes: imagenes_without_aws,
      imagenes_eliminadas,
      almacen_inicial,
      centro_de_costos,
      unidades_de_venta: await validateJsonEdit(
        copy_unidadesVenta,
        "unidades_de_venta"
      ),
      presentaciones,
      presentaciones_eliminadas,
      precio_plazos: preciosPlazos,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      usuario: sesion._id,
    };

    /* const clean_data = cleanTypenames(input); */
    /* console.log(input); */

    setLoading(true);
    try {
      if (accion) {
        const result = await actualizarProducto({
          variables: {
            input,
            id: datos._id,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.actualizarProducto.message}`,
          status: "success",
          open: true,
        });
      } else {
        const result = await crearProducto({
          variables: {
            input,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.crearProducto.message}`,
          status: "success",
          open: true,
        });
      }
      setLoading(false);
      toggleModal();
      if (fromCompra) {
        getProductos();
      } else {
        productosRefetch();
      }
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      console.log(error);
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  /* ###### RESET STATES ###### */
  const resetInitialStates = () => {
    setDatosGenerales(initial_state_datos_generales);
    setPrecios(initial_state_precios);
    setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
    setUnidadVentaSecundaria(initial_state_unidadVentaSecundaria);
    setPreciosP(initial_state_preciosP);
    setUnidadesVenta(initial_state_unidadesVenta);
    setAlmacenInicial(initial_state_almacen_inicial);
    setCentroDeCostos({});
    setPreciosPlazos(initial_state_preciosPlazos);
    setSubcategorias([]);
    setImagenes([]);
    setOnPreview({ index: "", image: "" });
    setValidacion({ error: false, message: "" });
    setSubcostos([]);
    setImagenesEliminadas([]);
    setPresentaciones([]);
    setPresentacionesEliminadas([]);
    setValue(0);
  };

  /* SET STATES WHEN UPDATING */
  const setInitialStates = (producto) => {
    /* const producto = cleanTypenames(product); */
    /* console.log(producto); */
    const { precios_producto, ...new_precios } = producto.precios;
    const { unidades_de_venta } = producto;
    let unidades_secundaria = producto.unidades_de_venta.filter(
      (res) => res.default === false
    );
    let unidadxdefecto = producto.unidades_de_venta.filter(
      (res) => res.default === true
    );
    setDatosGenerales(producto.datos_generales);
    setPrecios(new_precios);
    setCentroDeCostos(
      producto.centro_de_costos
        ? producto.centro_de_costos
        : initial_state_centro_de_costos
    );
    setImagenes(producto.imagenes);
    setPreciosPlazos(producto.precio_plazos);
    setUnidadesVenta(unidades_de_venta);
    setPreciosP(producto.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    setUnidadVentaSecundaria(unidades_secundaria[0]);
    setPresentaciones(
      producto.medidas_producto ? producto.medidas_producto : []
    );
    if (producto.inventario_general.length > 0) {
      setAlmacenExistente(true);
    } else {
      setAlmacenExistente(false);
    }
  };

  function funcion_tecla(event) {
    const { keyCode } = event;
    if (keyCode === 114) {
      document.getElementById("modal-registro-product").click();
    }
  } /* CODIGO PARA PODER EJECUTAR LAS VENTANAS A BASE DE LAS TECLAS */

  window.onkeydown = funcion_tecla;

  const saveButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => saveData()}
      size="large"
      startIcon={<DoneIcon />}
      disabled={
        !datos_generales.clave_alterna ||
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
    if (!accion && value === 3) {
      return saveButton;
    } else if (accion && tipo === "OTROS" && value === 3) {
      return saveButton;
    } else if (accion && tipo !== "OTROS" && value === 4) {
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
  };

  return (
    <Fragment>
      {/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}

      {!accion ? (
        fromCompra ? (
          <IconButton
            disabled={!isOnline}
            color="primary"
            onClick={() => toggleModal()}
          >
            <Add />
          </IconButton>
        ) : (
          <Button
            id="modal-registro-product"
            color="primary"
            variant="contained"
            size="large"
            onClick={() => toggleModal()}
            startIcon={<Add />}
            disabled={!isOnline}
          >
            Agregar
          </Button>
        )
      ) : (
        <IconButton
          size="medium"
          color="default"
          onClick={() => toggleModal(datos)}
          disabled={!isOnline}
        >
          <Edit />
        </IconButton>
      )}
      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        disableEscapeKeyDown
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            toggleModal();
          }
        }}
      >
        <div className={classes.root_app}>
          <Tabs
            style={{ minWidth: "200px" }}
            value={value}
            onChange={handleChange}
            variant="scrollable"
            orientation="vertical"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
            className={classes.tabs}
          >
            <Tab
              style={{ minWidth: "200px" }}
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
                    src={detallesImg}
                    alt="icono registro"
                    className={classes.iconSvg}
                  />
                </Badge>
              }
              {...a11yProps(0)}
            />
            <Tab
              style={{ minWidth: "200px" }}
              label="Precios de venta"
              icon={
                <Badge
                  color="secondary"
                  badgeContent={<Typography variant="h6">!</Typography>}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  invisible={
                    validacion.error && validacion.vista2 ? false : true
                  }
                >
                  <img
                    src={preciosImg}
                    alt="icono venta"
                    className={classes.iconSvg}
                  />
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab
              style={{ minWidth: "200px" }}
              label="Inventario y almacen"
              icon={
                <Badge
                  color="secondary"
                  badgeContent={<Typography variant="h6">!</Typography>}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  invisible={
                    validacion.error && validacion.vista3 ? false : true
                  }
                >
                  <img
                    src={almacenesImg}
                    alt="icono almacen"
                    className={classes.iconSvg}
                  />
                </Badge>
              }
              {...a11yProps(2)}
            />
            {/* <Tab
              style={{ minWidth: "200px" }}
              label="Centro de costos"
              icon={
                <img
                  src="costos.svg"
                  alt="icono almacen"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(3)}
            /> */}
            {/* <Tab
              style={{ minWidth: "200px" }}
              label="Precios a plazos"
              icon={
                <img
                  src="calendar.svg"
                  alt="icono almacen"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(4)}
            /> */}
            <Tab
              style={{ minWidth: "200px" }}
              label="Imagenes"
              icon={
                <img
                  src={imagenesImg}
                  alt="icono imagenes"
                  className={classes.iconSvg}
                />
              }
              {...a11yProps(3)}
            />
            {accion ? (
              datos_generales.tipo_producto !== "OTROS" ? (
                <Tab
                  style={{ minWidth: "200px" }}
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
                        src={tallasImg}
                        alt="icono colores"
                        className={classes.iconSvg}
                      />
                    </Badge>
                  }
                  {...a11yProps(4)}
                />
              ) : null
            ) : null}
          </Tabs>
          <Box width="100%">
            <Box m={1} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => toggleModal()}
                size="large"
              >
                <Close />
              </Button>
            </Box>
            <DialogContent className={classes.dialogContent}>
              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <ContenidoModal value={value} />
            </DialogContent>
          </Box>
        </div>

        <DialogActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
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
          <ButtonActions />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

const ContenidoModal = ({ value }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CONSULTAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    return () => {
      refetch();
    };
  }, [refetch]);

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );

  if (error) return <ErrorPage error={error} />;

  const { obtenerConsultasProducto } = data;

  return (
    <Fragment>
      <TabPanel value={value} index={0}>
        <RegistroInfoGenerales
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RegistroInfoAdidional />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RegistroAlmacenInicial
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel>
      {/* <TabPanel value={value} index={3}>
        <CentroCostos
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel> */}
      {/* <TabPanel value={value} index={4}>
        <PrecioPlazos />
      </TabPanel> */}
      <TabPanel value={value} index={3}>
        <CargarImagenesProducto />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ColoresTallas
          obtenerConsultasProducto={obtenerConsultasProducto}
          refetch={refetch}
        />
      </TabPanel>
    </Fragment>
  );
};
