import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { formatoMexico } from "../../../../config/reuserFunctions";
import ExportarProductosComprasExcel from "./ExportarProductosCompra";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "50vh",
  },
});

export default function DatosDeCompra({ compra }) {
  const classes = useStyles();
  const theme = useTheme();
  const { productos } = compra;
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const obtenerBusqueda = (value) => setBusqueda(value);

  useEffect(() => {
    setProductosFiltrados(
      productos.filter((datos) => {
        return datos.producto.datos_generales.nombre_comercial
          .toLowerCase()
          .includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, productos]);

  return (
    <Fragment>
      <Box mb={1} display="flex">
        <Typography style={{ marginRight: 16 }}>
          <b>Proveedor: </b>
          {compra.proveedor.nombre_cliente}
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Almacen: </b>
          {compra.almacen.nombre_almacen}
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Subtotal: ${compra.subtotal}</b>
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Impuestos: ${compra.impuestos}</b>
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Total: ${compra.total}</b>
        </Typography>
        {compra.status && compra.status === "CANCELADO" ? (
          <Chip label="Compra Cancelada" color="secondary" variant="outlined" />
        ) : compra.compra_credito === true ? (
          <Chip
            label={
              compra.credito_pagado === true
                ? "Credito pagado"
                : `Saldo pendiente: $${formatoMexico(
                    compra.saldo_credito_pendiente
                  )}`
            }
            style={{
              color:
                compra.compra_credito === true
                  ? theme.palette.primary.main
                  : theme.palette.warning.main,
              borderColor:
                compra.compra_credito === true
                  ? theme.palette.primary.main
                  : theme.palette.warning.main,
            }}
            variant="outlined"
          />
        ) : (
          <Chip label="CONTADO" color="inherit" variant="outlined" />
        )}
      </Box>
      <Box mb={2} display="flex">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Buscar un producto en esta compra..."
              onChange={(e) => obtenerBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <ExportarProductosComprasExcel compra={compra} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Medida</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>C. regalo</TableCell>
                <TableCell>C. total</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Impuestos</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.map((datos, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell>
                      {datos.producto.datos_generales.nombre_comercial}
                    </TableCell>
                    <TableCell padding="checkbox">
                      {datos.medida && datos.medida.medida
                        ? datos.medida.medida
                        : "N/A"}
                    </TableCell>
                    <TableCell padding="checkbox">
                      {datos.color && datos.color.hex ? (
                        <Chip
                          label={datos.color.color}
                          size="small"
                          style={{
                            backgroundColor: datos.color.hex,
                            color: theme.palette.getContrastText(
                              datos.color.hex
                            ),
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{datos.unidad}</TableCell>
                    <TableCell>{datos.cantidad}</TableCell>
                    <TableCell>{datos.cantidad_regalo}</TableCell>
                    <TableCell>{datos.cantidad_total}</TableCell>
                    <TableCell>{`$${datos.descuento_precio} - %${datos.descuento_porcentaje}`}</TableCell>
                    <TableCell>
                      <b>${formatoMexico(datos.subtotal)}</b>
                    </TableCell>
                    <TableCell>
                      <b>${formatoMexico(datos.impuestos)}</b>
                    </TableCell>
                    <TableCell>
                      <b>${formatoMexico(datos.total)}</b>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
}
