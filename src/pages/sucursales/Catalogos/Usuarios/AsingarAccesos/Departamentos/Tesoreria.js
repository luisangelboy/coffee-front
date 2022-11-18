import { Box, Paper, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";

export default function Tesoreria({ obtenerAccesos, arregloAccesos }) {
  return (
    <Fragment>
      <Box p={1} display="flex" justifyContent="center">
        <Box width="80%">
          <Typography variant="h6">
            Marca los permisos que deseas asignar a este usuario
          </Typography>
        </Box>
      </Box>
      <Box p={1} display="flex" justifyContent="center">
        <Box width="80%">
          <Paper elevation={3}>
            <Box display="flex">
              <Box ml={1} p={1} flexGrow={1}>
                <Typography variant="h6">
                  <b>Cuentas</b>
                </Typography>
              </Box>
              <Parametros
                arregloAccesos={arregloAccesos}
                obtenerAccesos={obtenerAccesos}
                departamento={"tesoreria"}
                subDepartamento={"cuentas_empresa"}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box p={1} display="flex" justifyContent="center">
        <Box width="80%">
          <Paper elevation={3}>
            <Box display="flex">
              <Box ml={1} p={1} flexGrow={1}>
                <Typography variant="h6">
                  <b>Abonos Proveedores</b>
                </Typography>
              </Box>
              <Parametros
                arregloAccesos={arregloAccesos}
                obtenerAccesos={obtenerAccesos}
                departamento={"tesoreria"}
                subDepartamento={"abonos_proveedores"}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box p={1} display="flex" justifyContent="center">
        <Box width="80%">
          <Paper elevation={3}>
            <Box display="flex">
              <Box ml={1} p={1} flexGrow={1}>
                <Typography variant="h6">
                  <b>Abonos Clientes</b>
                </Typography>
              </Box>
              <Parametros
                arregloAccesos={arregloAccesos}
                obtenerAccesos={obtenerAccesos}
                departamento={"tesoreria"}
                subDepartamento={"abonos_clientes"}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box p={1} display="flex" justifyContent="center">
        <Box width="80%">
          <Paper elevation={3}>
            <Box display="flex">
              <Box ml={1} p={1} flexGrow={1}>
                <Typography variant="h6">
                  <b>Egresos</b>
                </Typography>
              </Box>
              <Parametros
                arregloAccesos={arregloAccesos}
                obtenerAccesos={obtenerAccesos}
                departamento={"tesoreria"}
                subDepartamento={"egresos"}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box p={1} display="flex" justifyContent="center">
        <Box width="80%">
          <Paper elevation={3}>
            <Box display="flex">
              <Box ml={1} p={1} flexGrow={1}>
                <Typography variant="h6">
                  <b>Caja principal</b>
                </Typography>
              </Box>
              <Parametros
                arregloAccesos={arregloAccesos}
                obtenerAccesos={obtenerAccesos}
                departamento={"tesoreria"}
                subDepartamento={"caja_principal"}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fragment>
  );
}
