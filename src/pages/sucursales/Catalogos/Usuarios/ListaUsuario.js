import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  IconButton,
  Typography,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Slide,
} from "@material-ui/core";
import CrearUsario from "./CrearUsuario";
import ErrorPage from "../../../../components/ErrorPage";
import { Delete } from "@material-ui/icons";
import { UsuarioContext } from "../../../../context/Catalogos/usuarioContext";

import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_USUARIOS,
  ACTUALIZAR_USUARIO,
} from "../../../../gql/Catalogos/usuarios";
import SnackBarMessages from "../../../../components/SnackBarMessages";

const columns = [
  { id: 1, label: "No. Usuario", minWidth: 100 },
  { id: 3, label: "Nombre", minWidth: 150 },
  { id: 5, label: "Correo", minWidth: 150 },
  { id: 7, label: "Estado", minWidth: 100, align: "right" },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "75vh",
  },
  avatar: {
    width: 130,
    height: 130,
  },
});

export default function ListaUsuarios({ empresa, sucursal, filtro, isOnline }) {
  const classes = useStyles();
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));
  const { update } = useContext(UsuarioContext);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_USUARIOS, {
    variables: { empresa, sucursal, filtro, eliminado: false },
  });

  useEffect(() => {
    refetch();
  }, [update, refetch]);

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

  const { obtenerUsuarios } = data;

  return (
    <Paper className={classes.root} variant="outlined">
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
              {permisosUsuario.accesos.catalogos.usuarios.editar ===
              false ? null : (
                <TableCell key={9} align={"right"}>
                  Editar
                </TableCell>
              )}
              {permisosUsuario.accesos.catalogos.usuarios.eliminar ===
              false ? null : (
                <TableCell key={10} align={"right"}>
                  Eliminar
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerUsuarios.map((row, index) => {
              return (
                <RowsRender
                  key={index}
                  datos={row}
                  setAlert={setAlert}
                  isOnline={isOnline}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RowsRender = ({ datos, setAlert, isOnline }) => {
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));
  const { update, setUpdate } = useContext(UsuarioContext);
  const [loading, setLoading] = useState(false);

  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);

  const cambiarEstado = async (e) => {
    setLoading(true);

    try {
      await actualizarUsuario({
        variables: {
          input: {
            estado_usuario: e.target.checked,
          },
          id: datos._id,
        },
      });
      setUpdate(!update);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <TableRow role="checkbox" tabIndex={-1}>
      <TableCell>
        <Typography>{datos.numero_usuario}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.nombre}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.email}</Typography>
      </TableCell>
      <TableCell align={"right"}>
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Switch
            checked={datos.estado_usuario}
            onChange={cambiarEstado}
            color="primary"
            disabled={!isOnline}
          />
        )}
      </TableCell>
      {permisosUsuario.accesos.catalogos.usuarios.editar === false ? null : (
        <TableCell width={50}>
          <CrearUsario accion="actualizar" datos={datos} isOnline={isOnline} />
        </TableCell>
      )}
      {permisosUsuario.accesos.catalogos.usuarios.eliminar === false ? null : (
        <TableCell width={50}>
          <EliminarUsuario
            datos={datos}
            setAlert={setAlert}
            isOnline={isOnline}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

const EliminarUsuario = ({ datos, setAlert, isOnline }) => {
  const [open, setOpen] = useState(false);
  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);
  const [loading, setLoading] = useState(false);
  const { update, setUpdate } = useContext(UsuarioContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUsuario = async (e) => {
    setLoading(true);

    try {
      const result = await actualizarUsuario({
        variables: {
          input: {
            eliminado: true,
          },
          id: datos._id,
        },
      });
      if (result) {
        const { message } = result.data.actualizarUsuario;
        setAlert({ message, status: "success", open: true });
      }
      setUpdate(!update);
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      handleClose();
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
        aria-labelledby="alert-eliminar-usuario"
      >
        <DialogTitle id="alert-eliminar-usuario">
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
            onClick={() => deleteUsuario()}
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
