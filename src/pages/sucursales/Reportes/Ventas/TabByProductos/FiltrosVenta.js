import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import TablaVentasFiltradas from "./TablaVentasFiltradas";
import { formaPago } from "../../../Facturacion/catalogos";
import { useDebounce } from "use-debounce/lib";
import { useQuery } from "@apollo/client";
import ErrorPage from "../../../../../components/ErrorPage";
import { ClearOutlined } from "@material-ui/icons";
import ExportarVentas from "./ExportarVentas";
import { OBTENER_VENTAS_REPORTES } from "../../../../../gql/Ventas/ventas_generales";
import ExportarRVPDF from "./ExportarRVPDF";
import CampoCajas from "../TabVentas/CampoCajas";
import {
  CustomCheckboxCanceladas,
  CustomCheckboxNotas,
} from "../CustomCheckBoxsStyles";

const initial_state_filtros = {
  fecha_inicio: "",
  fecha_fin: "",
  metodo_pago: "",
  forma_pago: "",
  producto: "",
  cliente: "",
  usuario: "",
  folio: "",
  caja: "",
  canceladas: false,
  facturadas: false,
  notas_credito: false,
  vencidas: false,
  vigentes: false,
  liquidadas: false,
};

export default function FiltrosVenta() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [page, setPage] = useState(0);
  const [filtro, setFiltro] = useState(initial_state_filtros);

  const limit = 20;

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_VENTAS_REPORTES, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: initial_state_filtros,
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
    //pollInterval: 5000
  });

  if (loading) {
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
  }

  if (error) {
    console.log(error);
    return <ErrorPage error={error} />;
  }

  const { obtenerVentasReportes } = data;

  return (
    <Fragment>
      <DialogContent>
        <CapturaDeDatos
          refetch={refetch}
          data={obtenerVentasReportes}
          filtro={filtro}
          setFiltro={setFiltro}
        />
        <TablaVentasFiltradas
          data={obtenerVentasReportes}
          page={page}
          setPage={setPage}
          filtro={filtro}
          refetch={refetch}
          limit={limit}
        />
      </DialogContent>
    </Fragment>
  );
}

const CapturaDeDatos = ({ refetch, data, filtro, setFiltro }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [values] = useDebounce(filtro, 500);

  const limpiarFiltros = () => {
    setFiltro(initial_state_filtros);
  };

  const obtenerCamposFiltro = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value,
    });
  };

  const obtenerChecksFiltro = (e) => {
    const { name, checked } = e.target;
    setFiltro({
      ...filtro,
      [name]: checked,
    });
  };

  const obtenerChecksVencidas = (e) => {
    const { name, checked } = e.target;
    if (name === "vencidas") {
      setFiltro({
        ...filtro,
        [name]: checked,
        vigentes: false,
        liquidadas: false,
      });
    } else if (name === "liquidadas") {
      setFiltro({
        ...filtro,
        [name]: checked,
        vencidas: false,
        vigentes: false,
      });
    } else {
      setFiltro({
        ...filtro,
        [name]: checked,
        vencidas: false,
        liquidadas: false,
      });
    }
  };

  useEffect(() => {
    realizarBusquedaBD(values);
  }, [values]);

  const realizarBusquedaBD = (filtros) => {
    refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros,
    });
  };
  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item md={2}>
          <Typography>Fecha venta inicio:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_inicio"
            variant="outlined"
            type="date"
            onChange={obtenerCamposFiltro}
            value={filtro.fecha_inicio}
          />
          <Typography>Fecha venta fin:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_fin"
            variant="outlined"
            type="date"
            onChange={obtenerCamposFiltro}
            value={filtro.fecha_fin}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Método de pago:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              name="metodo_pago"
              onChange={obtenerCamposFiltro}
              value={filtro.metodo_pago}
            >
              <MenuItem value="">
                <em>Cualquier metodo</em>
              </MenuItem>
              <MenuItem value="CREDITO">Crédito</MenuItem>
              <MenuItem value="CONTADO">Contado</MenuItem>
            </Select>
          </FormControl>
          <Typography>Forma de Pago:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              name="forma_pago"
              onChange={obtenerCamposFiltro}
              value={filtro.forma_pago}
            >
              <MenuItem value="">
                <em>Cualquier forma</em>
              </MenuItem>
              {formaPago.map((res, index) => (
                <MenuItem
                  key={index}
                  value={res.Value}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2}>
          <Typography>Cliente venta:</Typography>
          <TextField
            fullWidth
            size="small"
            name="cliente"
            variant="outlined"
            placeholder="Nombre, clave..."
            onChange={obtenerCamposFiltro}
            value={filtro.cliente}
          />
          <Typography>Usuario:</Typography>
          <TextField
            fullWidth
            size="small"
            name="usuario"
            variant="outlined"
            placeholder="Nombre, numero de usuario..."
            onChange={obtenerCamposFiltro}
            value={filtro.usuario}
          />
        </Grid>
        <Grid item md={2}>
          <Typography>Folio venta:</Typography>
          <TextField
            fullWidth
            size="small"
            name="folio"
            variant="outlined"
            placeholder="Nombre, clave..."
            onChange={obtenerCamposFiltro}
            value={filtro.folio}
          />
          <CampoCajas setFiltro={setFiltro} filtro={filtro} />
        </Grid>
        <Grid item md={4}>
          <Typography>Producto:</Typography>
          <TextField
            fullWidth
            size="small"
            name="producto"
            variant="outlined"
            placeholder="Nombre, código, clave..."
            onChange={obtenerCamposFiltro}
            value={filtro.producto}
          />
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="flex-end"
            height="62px"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtro.vencidas}
                  onChange={obtenerChecksVencidas}
                  name="vencidas"
                  color="default"
                />
              }
              label="Vencidas"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtro.vigentes}
                  onChange={obtenerChecksVencidas}
                  name="vigentes"
                  color="default"
                />
              }
              label="Vigentes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtro.liquidadas}
                  onChange={obtenerChecksVencidas}
                  name="liquidadas"
                  color="default"
                />
              }
              label="Pagadas"
            />
            <FormControlLabel
              control={
                <CustomCheckboxCanceladas
                  checked={filtro.canceladas}
                  onChange={obtenerChecksFiltro}
                  name="canceladas"
                />
              }
              label="Canceladas"
            />
            <FormControlLabel
              control={
                <CustomCheckboxNotas
                  checked={filtro.notas_credito}
                  onChange={obtenerChecksFiltro}
                  name="notas_credito"
                />
              }
              label="Notas crédito"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtro.facturadas}
                  onChange={obtenerChecksFiltro}
                  name="facturadas"
                />
              }
              label="Facturadas"
            />
          </Box>
        </Grid>
      </Grid>
      <Box
        mt={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems="center"
          position="absolute"
          top={70}
          right={10}
        >
          {/* <Box display="flex" alignItems="center">
            <Box
              border={1}
              borderColor="#FF8A8A"
              bgcolor="#FFF4F4"
              height="20px"
              width="20px"
            />
            <Box mx={0.5} />
            <Typography>
              <b>Canceladas</b>
            </Typography>
            <Box mx={1} />
            <Box
              border={1}
              borderColor="#FCCF53"
              bgcolor="#FFFAEC"
              height="20px"
              width="20px"
            />
            <Box mx={0.5} />
            <Typography>
              <b>Notas de crédito</b>
            </Typography>
          </Box>
          <Box mx={1} /> */}
          <Button
            color="primary"
            startIcon={<ClearOutlined />}
            onClick={() => limpiarFiltros()}
          >
            Limpiar filtros
          </Button>
          <Box mx={1} />
          <ExportarVentas refetch={refetch} data={data} />
          <Box mx={1} />
          {/* <ExportarRVPDF data={data} /> */}
        </Box>
      </Box>
    </Fragment>
  );
};
