import React from "react";

import { Box, Container, Grid } from "@material-ui/core";

import NuevaFactura from "./NuevaFactura/NuevaFactura";
import SeriesCDFI from "./CFDISeries/SeriesCdfi";
/* import SellosCDFI from './CFDISellos/SellosCdfi'; */
import FacturasRealizadas from "./FacturasRealizadas/FacturasRealizadas";

export default function Facturacion() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  return (
    <div>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          {sesion.accesos.facturacion.generar_cdfi.ver === false ? null : (
            <Grid item lg={2}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <NuevaFactura />
              </Box>
            </Grid>
          )}
          {sesion.accesos.facturacion.cdfi_realizados.ver === false ? null : (
            <Grid item lg={2}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <FacturasRealizadas />
              </Box>
            </Grid>
          )}
          {/* 
                    <Grid item lg={2}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <SellosCDFI />
                        </Box>
                    </Grid> */}
          {sesion.accesos.facturacion.registro_series_cdfi.ver ===
          false ? null : (
            <Grid item lg={2}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <SeriesCDFI />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
}
