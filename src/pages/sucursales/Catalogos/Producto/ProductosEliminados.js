import React, { useState, forwardRef, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { RestoreFromTrash, Publish, Close } from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  IconButton,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Fragment } from "react";
import ErrorPage from "../../../../components/ErrorPage";
import {
  ACTIVAR_PRODUCTOS,
  PRODUCTOS_ELIMINADOS,
} from "../../../../gql/Catalogos/productos";
import { useMutation, useQuery } from "@apollo/client";
/* import SnackBarMessages from '../../../../components/SnackBarMessages'; */
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProdcutosEliminados({
  productosActivosRefetch,
  isOnline,
}) {
  const [open, setOpen] = useState(false);

  const handleModalToggle = () => setOpen(!open);

  return (
    <div>
      <Button
        disableElevation
        color="primary"
        onClick={handleModalToggle}
        size="large"
        startIcon={<RestoreFromTrash />}
        disabled={!isOnline}
      >
        Productos inactivos
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalToggle();
          }
        }}
        aria-labelledby="dialog-productos-eliminados"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="dialog-productos-eliminados">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Productos inactivos</Typography>
            <Button
              variant="contained"
              onClick={handleModalToggle}
              color="secondary"
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TablaProductosEliminados
            productosActivosRefetch={productosActivosRefetch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TablaProductosEliminados = ({ productosActivosRefetch }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { actualizarLista } = useContext(RegProductoContext);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(PRODUCTOS_ELIMINADOS, {
    variables: { sucursal: sesion.sucursal._id, empresa: sesion.empresa._id },
  });

  useEffect(() => {
    refetch();
  }, [refetch, actualizarLista]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} />;
  }

  if (!loading && !error && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <Typography variant="h6">No hay productos inactivos</Typography>
      </Box>
    );
  }

  const { obtenerProductosInactivos } = data;

  return (
    <Box height="60vh">
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">Código de barras</TableCell>
              <TableCell align="left">Clave alterna</TableCell>
              <TableCell>Nombre comercial</TableCell>
              <TableCell align="right">Reactivar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerProductosInactivos.map((producto, index) => (
              <RenderProductosTabla
                key={index}
                datos={producto}
                refetch={refetch}
                productosActivosRefetch={productosActivosRefetch}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const RenderProductosTabla = ({ datos, refetch, productosActivosRefetch }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datos_generales } = datos.producto;
  /* const [ alert, setAlert ] = useState({ message: '', status: '', open: false }); */
  const { setAlert } = useContext(RegProductoContext);

  const [activarProducto] = useMutation(ACTIVAR_PRODUCTOS);

  const handleDeleteToggle = () => setOpen(!open);

  const reactivarProducto = async () => {
    setLoading(true);
    try {
      const result = await activarProducto({
        variables: {
          id: datos._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      refetch();
      productosActivosRefetch();
      setAlert({
        message: `¡Listo! ${result.data.activarProducto.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
      handleDeleteToggle();
    } catch (error) {
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell align="left">{datos_generales.codigo_barras}</TableCell>
        <TableCell align="left">{datos_generales.clave_alterna}</TableCell>
        <TableCell>{datos_generales.nombre_comercial}</TableCell>
        <TableCell align="right">
          {loading ? (
            <IconButton color="primary" disabled onClick={handleDeleteToggle}>
              <CircularProgress size={26} />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={handleDeleteToggle}>
              <Publish />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleDeleteToggle}
        aria-labelledby="reactivar-producto-dialog"
      >
        <DialogTitle id="reactivar-producto-dialog">
          {"Se reactivará este producto"}
        </DialogTitle>
        {/* <SnackBarMessages alert={alert} setAlert={setAlert} />        */}
        <DialogActions>
          <Button onClick={handleDeleteToggle} color="inherit">
            Cancelar
          </Button>
          <Button onClick={() => reactivarProducto()} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
