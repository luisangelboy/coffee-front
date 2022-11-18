import { Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function MostrarPrecios() {
  const { datosProducto } = useContext(ComprasContext);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography style={{ fontSize: 16 }}>Subtotal:</Typography>
        <Typography style={{ fontSize: 18 }}>
          <b>${formatoMexico(datosProducto.subtotal_descuento)}</b>
        </Typography>
      </Grid>
      <Grid item>
        <Typography style={{ fontSize: 16 }}>Impuestos:</Typography>
        <Typography style={{ fontSize: 18 }}>
          <b>${formatoMexico(datosProducto.impuestos_descuento)}</b>
        </Typography>
      </Grid>
      <Grid item>
        <Typography style={{ fontSize: 16 }}>Descuento:</Typography>
        <Typography style={{ fontSize: 18 }}>
          <b>{datosProducto.descuento_porcentaje}%</b>
        </Typography>
      </Grid>
      <Grid item>
        <Typography style={{ fontSize: 16 }}>Total:</Typography>
        <Typography style={{ fontSize: 18 }}>
          <b>
            $
            {formatoMexico(
              datosProducto.total_descuento
            )}
          </b>
        </Typography>
      </Grid>
    </Grid>
  );
}
