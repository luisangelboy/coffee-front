import React, { Fragment, useContext } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { AlmacenProvider } from "../../../../../context/Almacenes/crearAlmacen";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import RegistroProvedor from "../../../Catalogos/Cliente/CrearCliente";
import RegistroAlmacen from "../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

import { useQuery } from "@apollo/client";
import { OBTENER_CONSULTA_GENERAL_PRODUCTO } from "../../../../../gql/Compras/compras";
import { ErrorOutline } from "@material-ui/icons";
import { initial_state_datosProducto } from "../initial_states";
import {
  initial_state_almacen_inicial,
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_preciosP,
  initial_state_preciosPlazos,
  initial_state_unidadVentaXDefecto,
  initial_state_unidadVentaSecundaria,
} from "../../../../../context/Catalogos/initialStatesProducto";
import moment from "moment";

export default function DatosProveedorAlmacen({ getProductos, status }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    datosCompra,
    setDatosCompra,
    setDatosProducto,
    productosCompra,
  } = useContext(ComprasContext);

  const {
    setDatosGenerales,
    setPrecios,
    setValidacion,
    setPreciosP,
    setImagenes,
    setUnidadesVenta,
    almacen_inicial,
    setAlmacenInicial,
    setUnidadVentaXDefecto,
    setUnidadVentaSecundaria,
    setCentroDeCostos,
    setPreciosPlazos,
    setSubcategorias,
    setOnPreview,
    setSubcostos,
    setImagenesEliminadas,
    setPresentaciones,
    setPresentacionesEliminadas,
  } = useContext(RegProductoContext);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(
    OBTENER_CONSULTA_GENERAL_PRODUCTO,
    {
      variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
    }
  );

  const obtenerProveedorAlmacen = (tipo, value) => {
    if (!value) {
      setDatosCompra({ ...datosCompra, [tipo]: {} });
      return;
    }
    if (tipo === "proveedor") {
      setDatosCompra({
        ...datosCompra,
        proveedor: {
          id_proveedor: value._id,
          nombre_cliente: value.nombre_cliente,
          numero_cliente: value.numero_cliente,
          clave_cliente: value.clave_cliente,
        },
      });
    } else {
      setDatosProducto(initial_state_datosProducto);
      resetInitialStates();
      setDatosCompra({
        ...datosCompra,
        almacen: {
          id_almacen: value._id,
          nombre_almacen: value.nombre_almacen,
          default_almacen: value.default_almacen,
        },
      });
      setAlmacenInicial({
        ...almacen_inicial,
        id_almacen: value._id,
        almacen: value.nombre_almacen,
        default_almacen: value.default_almacen,
      });
      getProductos(value._id);
    }
  };

  const resetInitialStates = () => {
    setDatosGenerales(initial_state_datos_generales);
    setPrecios(initial_state_precios);
    setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
    setUnidadVentaSecundaria(initial_state_unidadVentaSecundaria);
    setPreciosP(initial_state_preciosP);
    setUnidadesVenta([]);
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
  };

  const errorRender = (
    <Grid item xs={12} md={4}>
      <Box display="flex" alignItems="center">
        <TextField
          size="small"
          fullWidth
          value="Error"
          error
          disabled
          variant="outlined"
        />
        <IconButton disabled>
          <ErrorOutline fontSize="default" />
        </IconButton>
      </Box>
    </Grid>
  );

  const loadingRender = (
    <Grid item xs={12} md={4}>
      <Box display="flex" alignItems="center">
        <TextField
          size="small"
          fullWidth
          disabled
          value="Cargando..."
          variant="outlined"
        />
        <IconButton disabled>
          <CircularProgress size={24} />
        </IconButton>
      </Box>
    </Grid>
  );

  if (loading)
    return (
      <Grid container spacing={2} alignItems="center">
        {loadingRender}
        {loadingRender}
        {loadingRender}
      </Grid>
    );
  if (error) {
    return (
      <Fragment>
        <Grid container spacing={2} alignItems="center">
          {errorRender}
          {errorRender}
          {errorRender}
        </Grid>
      </Fragment>
    );
  }

  const { almacenes, proveedores } = data.obtenerConsultaGeneralCompras;

  return (
    <Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Autocomplete
              disabled={productosCompra.length > 0}
              id="combo-box-proveedor"
              size="small"
              fullWidth
              options={proveedores}
              getOptionLabel={(option) => option.nombre_cliente}
              renderInput={(params) => (
                <TextField {...params} label="Proveedor" variant="outlined" />
              )}
              onChange={(_, value) =>
                obtenerProveedorAlmacen("proveedor", value)
              }
              getOptionSelected={(option) => option.nombre_cliente}
              value={
                datosCompra.proveedor.nombre_cliente
                  ? datosCompra.proveedor
                  : null
              }
            />
            <RegistroProvedor
              accion="registrar"
              tipo="PROVEEDOR"
              refetch={refetch}
              fromCompras={true}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <Autocomplete
              disabled={productosCompra.length > 0}
              id="combo-box-almacen"
              size="small"
              fullWidth
              options={almacenes}
              getOptionLabel={(option) => option.nombre_almacen}
              renderInput={(params) => (
                <TextField {...params} label="Almacen" variant="outlined" />
              )}
              onChange={(_, value) => obtenerProveedorAlmacen("almacen", value)}
              getOptionSelected={(option) => option.nombre_almacen}
              value={
                datosCompra.almacen.nombre_almacen ? datosCompra.almacen : null
              }
            />
            <AlmacenProvider>
              <RegistroAlmacen accion="registrar" fromEmergent={true} refetch={refetch} />
            </AlmacenProvider>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="date"
              onChange={(e) => {
                setDatosCompra({
                  ...datosCompra,
                  fecha_registro: e.target.value,
                });
              }}
              InputProps={{
                inputProps: {
                  max: moment().locale("es-mx").format("YYYY-MM-DD"),
                },
              }}
              value={datosCompra.fecha_registro}
            />
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}
