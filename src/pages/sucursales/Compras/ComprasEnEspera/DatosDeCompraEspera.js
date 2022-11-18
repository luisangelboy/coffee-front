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
import { Button, useTheme } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { formatoMexico } from "../../../../config/reuserFunctions";
import AbrirCompra from "../AbrirCompra/AbrirCompra";
import VerificarProductosCompras from "./VerificarProductos";

import {
  Dialog,
  CircularProgress,
  DialogTitle,
  DialogActions,
  Slide,
} from "@material-ui/core";
import { CheckCircle, DeleteOutlined, Done, Error } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import { useMutation } from "@apollo/client";
import { ELIMINAR_COMPRA_ESPERA } from "../../../../gql/Compras/compras";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "50vh",
  },
});

export default function DatosDeCompra({
  compra,
  setAlert,
  refetch,
  handleOpenDetalles,
}) {
  const classes = useStyles();
  const theme = useTheme();
  /* let compra_temp = {...compra} */
  const [compra_temp, setCompraTemp] = useState({ ...compra });
  const { productos } = compra_temp;
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const [nuevoArray, setNuevoArray] = useState();
  const [verificado, setVerificado] = useState(false);

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

  useEffect(() => {
    if (verificado && nuevoArray) {
      setCompraTemp(nuevoArray);
    }
  }, [verificado]);

  return (
    <Fragment>
      <Box mb={1} display="flex">
        <Typography style={{ marginRight: 16 }}>
          <b>Proveedor: </b>
          {compra_temp.proveedor.nombre_cliente}
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Almacen: </b>
          {compra_temp.almacen.nombre_almacen}
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Subtotal: ${parseFloat(compra_temp.subtotal.toFixed(2))}</b>
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>Impuestos: ${parseFloat(compra_temp.impuestos.toFixed(2))}</b>
        </Typography>
        <Typography style={{ marginRight: 16 }}>
          <b>
            Total: ${formatoMexico(parseFloat(compra_temp.total.toFixed(2)))}
          </b>
        </Typography>
      </Box>
      <Box mb={2} display="flex">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Buscar una compra..."
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
              {permisosUsuario.accesos.compras.compras_espera.eliminar ===
              false ? null : (
                <ModalEliminarCompra
                  compra={compra_temp}
                  setAlert={setAlert}
                  refetch={refetch}
                  handleOpenDetalles={handleOpenDetalles}
                />
              )}
              <Box mx={1} />

              {permisosUsuario.accesos.compras.compras_espera.editar ===
              false ? null : verificado ? (
                <AbrirCompra
                  compra={compra_temp}
                  status="enEspera"
                  handleOpenDetalles={handleOpenDetalles}
                  refetchEspera={refetch}
                />
              ) : (
                <VerificarProductosCompras
                  compra={compra_temp}
                  nuevoArray={nuevoArray}
                  setNuevoArray={setNuevoArray}
                  setVerificado={setVerificado}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Paper className={classes.root} variant="outlined">
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                {verificado ? <TableCell /> : null}
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
                /* console.log(datos); */
                return (
                  <TableRow
                    tabIndex={-1}
                    key={index}
                    selected={datos.conflicto}
                  >
                    {verificado ? (
                      <TableCell
                        style={{
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                      >
                        {datos.conflicto ? (
                          <Error color="primary" />
                        ) : (
                          <CheckCircle
                            style={{
                              color: theme.palette.success.main,
                            }}
                          />
                        )}
                      </TableCell>
                    ) : null}
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalEliminarCompra = ({
  compra,
  setAlert,
  refetch,
  handleOpenDetalles,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [eliminarCompraEnEspera] = useMutation(ELIMINAR_COMPRA_ESPERA);

  const handleOpen = () => {
    setOpen(!open);
  };

  const eliminarCompra = async () => {
    setLoading(true);
    try {
      const result = await eliminarCompraEnEspera({
        variables: {
          id: compra._id,
        },
      });
      setAlert({
        message: `¡Listo! ${result.data.eliminarCompraEnEspera.message}`,
        status: "success",
        open: true,
      });
      refetch();
      setLoading(false);
      handleOpen();
      handleOpenDetalles();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
    }
  };
  return (
    <Fragment>
      <Button
        color="secondary"
        startIcon={<DeleteOutlined />}
        onClick={() => handleOpen()}
      >
        Eliminar compra
      </Button>
      <Dialog open={open} onClose={handleOpen} TransitionComponent={Transition}>
        <DialogTitle>¿Desea eliminar esta compra?</DialogTitle>
        <DialogActions>
          <Button
            variant="text"
            color="inherit"
            size="large"
            startIcon={<Close />}
            onClick={() => handleOpen()}
          >
            Cancelar
          </Button>
          <Button
            variant="text"
            color="secondary"
            size="large"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Done />
              )
            }
            onClick={() => eliminarCompra()}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
