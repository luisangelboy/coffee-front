import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import AgregarTipoVenta from "./TipoVenta";
import AgregarClienteVenta from "./AgregarCliente";
import AgregarProductoVenta from "./AgregarProducto";

export default function ContenedorInputsGeneral({ loading, setLoading }) {

  return (
    <Fragment>
      <Paper>
        <Grid container spacing={3} style={{ padding: 2 }}>
          <Grid item md={4} xs={12}>
            <AgregarProductoVenta loading={loading} setLoading={setLoading} />
          </Grid>
          <Grid item md={4} xs={12}>
            <AgregarClienteVenta />
          </Grid>
          <Grid item md={4} xs={12}>
            <AgregarTipoVenta />
          </Grid>
        </Grid>
      </Paper>
    </Fragment>
  );
}
