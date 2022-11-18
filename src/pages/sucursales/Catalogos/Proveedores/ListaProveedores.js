import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CrearCliente from "../Cliente/CrearCliente";

import { useMutation } from "@apollo/client";
import { ELIMINAR_CLIENTE } from "../../../../gql/Catalogos/clientes";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  Slide,
  TablePagination,
} from "@material-ui/core";
import { DialogTitle, IconButton, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { formatoFechaCorta } from "../../../../config/reuserFunctions";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";

const columns = [
  { id: 1, label: "No. Cliente", minWidth: 100 },
  { id: 2, label: "Clave", minWidth: 100 },
  { id: 3, label: "Nombre", minWidth: 150 },
  { id: 4, label: "Razon Social", minWidth: 150 },
  { id: 5, label: "Correo", minWidth: 150 },
  { id: 6, label: "Fecha registro", minWidth: 100 },
  { id: 7, label: "Estado", minWidth: 100 },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "68vh",
  },
  avatar: {
    width: 130,
    height: 130,
  },
});

export default function TablaProveedores({
  obtenerClientes,
  refetch,
  page,
  setPage,
  limit,
  isOnline,
}) {
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const classes = useStyles();

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Paper className={classes.root} variant="outlined">
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
              {permisosUsuario.accesos.catalogos.provedores.editar ===
              false ? null : (
                <TableCell key={9} align={"right"}>
                  Editar
                </TableCell>
              )}
              {permisosUsuario.accesos.catalogos.provedores.eliminar ===
              false ? null : (
                <TableCell key={10} align={"right"}>
                  Eliminar
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerClientes.docs.map((row, index) => {
              return (
                <RowsRender
                  key={index}
                  datos={row}
                  setAlert={setAlert}
                  refetch={refetch}
                  isOnline={isOnline}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={obtenerClientes.totalDocs}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
}

const RowsRender = ({ datos, setAlert, refetch, isOnline }) => {
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  return (
    <TableRow role="checkbox" tabIndex={-1}>
      <TableCell>
        <Typography>{datos.numero_cliente}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.clave_cliente}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.nombre_cliente}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.razon_social}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.email}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{formatoFechaCorta(datos.fecha_registro)}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.estado_cliente ? "Activo" : "Inactivo"}</Typography>
      </TableCell>
      {permisosUsuario.accesos.catalogos.provedores.editar === false ? null : (
        <TableCell width={50}>
          <CrearCliente
            tipo="PRROVEEDOR"
            accion="actualizar"
            datos={datos}
            refetch={refetch}
            isOnline={isOnline}
          />
        </TableCell>
      )}
      {permisosUsuario.accesos.catalogos.provedores.eliminar ===
      false ? null : (
        <TableCell width={50}>
          <EliminarCliente
            datos={datos}
            setAlert={setAlert}
            refetch={refetch}
            isOnline={isOnline}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

const EliminarCliente = ({ datos, setAlert, refetch, isOnline }) => {
  const [open, setOpen] = useState(false);
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);
  const [loading, setLoading] = useState(false);
  const { setUpdate, update } = useContext(ClienteCtx);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const eliminarClienteBD = async () => {
    setLoading(true);
    try {
      const result = await eliminarCliente({
        variables: {
          id: datos._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      if (result) {
        const { message } = result.data.eliminarCliente;
        setAlert({ message, status: "success", open: true });
        refetch();
      }
      setLoading(false);
      setUpdate(!update);
      handleClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <div>
      <IconButton
        disabled={!isOnline}
        size="small"
        color="secondary"
        onClick={() => handleClickOpen()}
      >
        <Delete />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-labelledby="alert-eliminar-cliente"
      >
        <DialogTitle id="alert-eliminar-cliente">
          {"¿Está seguro de eliminar esto?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            color="inherit"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => eliminarClienteBD()}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
