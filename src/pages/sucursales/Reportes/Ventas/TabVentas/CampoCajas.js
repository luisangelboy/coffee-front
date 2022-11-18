import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useQuery } from "@apollo/client";
import ErrorPage from "../../../../../components/ErrorPage";
import { OBTENER_CAJAS } from "../../../../../gql/Cajas/cajas";

export default function CampoCajas({ setFiltro, filtro }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* Queries */
  const { data, error, loading, refetch } = useQuery(OBTENER_CAJAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });

  if (loading) {
    return (
      <FormControl variant="outlined" fullWidth size="small">
        <Select>
          <MenuItem value="">
            <em>Cargando...</em>
          </MenuItem>
        </Select>
      </FormControl>
    );
  }

  if (error) {
    console.log(error.networkError.result);
    return <ErrorPage error={error} />;
  }

  const { obtenerCajasSucursal } = data;

  const obtenerCamposFiltro = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value.toString(),
    });
  };

  return (
    <Box>
      <Typography>Caja:</Typography>
      <FormControl variant="outlined" fullWidth size="small">
        <Select name="caja" onChange={obtenerCamposFiltro} value={filtro.caja}>
          <MenuItem value="">
            <em>Selecciona una</em>
          </MenuItem>
          {obtenerCajasSucursal.map((res, index) => (
            <MenuItem key={index} value={res.numero_caja}>
              {res.numero_caja}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
