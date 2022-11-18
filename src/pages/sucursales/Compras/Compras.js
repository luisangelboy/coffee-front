import React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import AbrirCompra from "./AbrirCompra/AbrirCompra";
import ComprasRealizadas from "./ComprasRealizadas/ComprasRealizadas";
/* import CargaMasiva from './CargaMasiva/CargaMasiva'; */
import ComprasEnEspera from "./ComprasEnEspera/ComprasEnEspera";

export default function Compras() {
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} justifyContent="center">
        {permisosUsuario.accesos.compras.abrir_compra.ver === false ? null : (
          <Grid item md={4}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <AbrirCompra />
            </Box>
          </Grid>
        )}
        {permisosUsuario.accesos.compras.compras_realizadas.ver ===
        false ? null : (
          <Grid item md={4}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <ComprasRealizadas />
            </Box>
          </Grid>
        )}
        {permisosUsuario.accesos.compras.compras_espera.ver === false ? null : (
          <Grid item md={4}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <ComprasEnEspera />
            </Box>
          </Grid>
        )}
        {/* <Grid item md={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<CargaMasiva />
					</Box>
				</Grid> */}
      </Grid>
    </Container>
  );
}
