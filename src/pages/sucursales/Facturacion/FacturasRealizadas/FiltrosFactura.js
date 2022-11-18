import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import TablaFacturasFiltradas from "./TablaFacturasFiltradas";
import { formaPago } from "../catalogos";
import { useDebounce } from "use-debounce/lib";
import { useQuery } from "@apollo/client";
import ErrorPage from "../../../../components/ErrorPage";
import { ClearOutlined } from "@material-ui/icons";
import ExportarFactuas from "./ExportarFacturas";
import { OBTENER_FACTURAS_REALIZADAS } from "../../../../gql/Facturacion/Facturacion";

export default function FiltrosFactura() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [page, setPage] = useState(0);
  const limit = 20;
  const [filtro, setFiltro] = useState({
    fecha: "",
    metodo_pago: "",
    forma_pago: "",
    busqueda: "",
  });

  /* Queries */
  const { loading, data, error, refetch } = useQuery(
    OBTENER_FACTURAS_REALIZADAS,
    {
      variables: {
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
        filtros: {
          fecha: "",
          metodo_pago: "",
          forma_pago: "",
          busqueda: "",
        },
        limit,
        offset: 0,
      },
      fetchPolicy: "network-only",
    }
  );

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

  const { obtenerFacturas } = data;

  return (
    <Fragment>
      <DialogContent>
        <CapturaDeDatos
          refetch={refetch}
          data={obtenerFacturas}
          filtro={filtro}
          setFiltro={setFiltro}
        />
        <TablaFacturasFiltradas
          data={obtenerFacturas}
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

  const [values] = useDebounce(filtro, 800);

  const limpiarFiltros = () => {
    setFiltro({
      fecha: "",
      metodo_pago: "",
      forma_pago: "",
      busqueda: "",
    });
  };

  const obtenerCamposFiltro = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value,
    });
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
        <Grid item md={3} sm={3}>
          <Typography>Buscar por:</Typography>
          <TextField
            fullWidth
            size="small"
            name="busqueda"
            variant="outlined"
            placeholder="Folio CFDi, Folio de venta, Cliente..."
            onChange={obtenerCamposFiltro}
            value={filtro.busqueda}
          />
        </Grid>
        <Grid item md={3} sm={3}>
          <Typography>Fecha Factura:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha"
            variant="outlined"
            type="date"
            onChange={obtenerCamposFiltro}
            value={filtro.fecha}
          />
        </Grid>
        <Grid item md={3} sm={3}>
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
              <MenuItem value="PPD - Pago en parcialidades ó diferido">
                Pago en parcialidades ó diferido
              </MenuItem>
              <MenuItem value="PUE - Pago en una sola exhibición">
                Pago en parcialidades ó diferido
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3} sm={3}>
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
                  value={`${res.Value} - ${res.Name}`}
                >{`${res.Value} - ${res.Name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box display="flex" alignItems="center" my={1}>
        <Button
          color="primary"
          startIcon={<ClearOutlined />}
          onClick={() => limpiarFiltros()}
        >
          Limpiar filtros
        </Button>
        <Box mx={1} />
        <ExportarFactuas data={data} refetch={refetch} />
        <Box mx={1} />
        <Box
          border={1}
          borderColor="#FFA91C"
          bgcolor="#FFEAAD"
          height="24px"
          width="24px"
        />
        <Box mx={0.5} />
        <Typography>
          <b>Notas de crédito</b>
        </Typography>
        <Box mx={1} />
        <Box
          border={1}
          borderColor="#52A3FF"
          bgcolor="#C0DEFF"
          height="24px"
          width="24px"
        />
        <Box mx={0.5} />
        <Typography>
          <b>Con complementos de pago</b>
        </Typography>
      </Box>
    </Fragment>
  );
};
