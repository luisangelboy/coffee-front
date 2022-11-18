import React from "react";
import useStyles from "../styles";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";

import {
  TableContainer,
  Table,
  Box,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Typography,
} from "@material-ui/core";
import { formatoMexico } from "../../../config/reuserFunctions";

export default function InformacionProducto({
  producto,
  productoSeleccionado,
}) {
  const classes = useStyles();

  /* console.log(producto);
  console.log(productoSeleccionado); */
  /* if (productoSeleccionado.length === 0) return null; */

  return (
    <Grid container alignItems="center">
      <Grid item md={2} style={{ display: "flex", justifyContent: "center" }}>
        {productoSeleccionado?.id_producto?.imagenes.length > 0 ? (
          <Box className={classes.containerImage}>
            <img
              alt="Imagen producto"
              src={productoSeleccionado?.id_producto?.imagenes[0].url_imagen}
              className={classes.imagen}
            />
          </Box>
        ) : (
          <Box p={4} display="flex" justifyContent="center" alignItems="center">
            <PhotoLibraryIcon style={{ fontSize: 40 }} />
          </Box>
        )}
      </Grid>
      <Grid item md={10}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <Typography>
              <b>Nombre:</b>
            </Typography>

            <Typography>
              {productoSeleccionado.id_producto
                ? productoSeleccionado.id_producto.datos_generales
                    .nombre_comercial
                : "-"}
            </Typography>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography>
              <b>Codigo Barras:</b>
            </Typography>
            <Typography>
              {productoSeleccionado.codigo_barras
                ? productoSeleccionado.codigo_barras
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography align="center">
              <b>Cantidad:</b>
            </Typography>
            <Typography align="center">
              {productoSeleccionado.cantidad
                ? productoSeleccionado.cantidad
                : "-"}
            </Typography>
          </Grid>
          <Grid item md={1} xs={12}>
            <Typography align="center">
              <b>Unidad:</b>
            </Typography>
            <Typography align="center">
              {productoSeleccionado.unidad ? productoSeleccionado.unidad : "-"}
            </Typography>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography align="center">
              <b>Descuento:</b>
            </Typography>
            <Typography align="center">
              {productoSeleccionado.descuento
                ? productoSeleccionado.descuento.precio_neto
                : 0}
            </Typography>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography align="center">
              <b>% Descuento:</b>
            </Typography>
            <Typography align="center">
              {productoSeleccionado.descuento
                ? productoSeleccionado.descuento.precio_neto
                : 0}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={12} lg={12}>
        <PreciosDeVentaCompras
          precios={productoSeleccionado?.id_producto?.precios?.precios_producto}
        />
      </Grid>
    </Grid>
  );
}

function PreciosDeVentaCompras({ precios }) {
  return (
    <Box>
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Numero precio</TableCell>
              {[1, 2, 3, 4, 5, 6].map((numero, index) => (
                <TableCell style={{ minWidth: 100 }} key={index}>
                  {numero}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {["Precios de venta"].map((tipo, index) => (
              <TableRow key={index}>
                <TableCell style={{ border: 0 }}>
                  <b>{tipo}</b>
                </TableCell>
                {precios?.map((data, index) => (
                  <TableCell key={index} style={{ border: 0 }}>
                    ${data?.precio_neto ? formatoMexico(data.precio_neto) : 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
