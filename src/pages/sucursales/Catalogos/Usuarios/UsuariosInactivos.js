import React, { useState, forwardRef, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { RestoreFromTrash, Close, Search } from "@material-ui/icons";
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
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { Fragment } from "react";
import ErrorPage from "../../../../components/ErrorPage";
import { useMutation, useQuery } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import {
  ACTUALIZAR_USUARIO,
  OBTENER_USUARIOS,
} from "../../../../gql/Catalogos/usuarios";
import { UsuarioContext } from "../../../../context/Catalogos/usuarioContext";
import { useDebounce } from "use-debounce/lib";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UsuariosInactivosComponent({ isOnline }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const handleModalToggle = () => setOpen(!open);

  return (
    <div>
      <Button
        disableElevation
        color="inherit"
        onClick={handleModalToggle}
        startIcon={<RestoreFromTrash />}
        disabled={!isOnline}
      >
        Usuarios inactivos
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
        aria-labelledby="dialog-usuarios-eliminados"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="dialog-usuarios-eliminados">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Usuarios inactivos</Typography>
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
          <Box mb={2}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Buscar usuario: No. usuario, email o nombre..."
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <UsuariosInactivos filter={filter} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const UsuariosInactivos = ({ filter }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { update } = useContext(UsuarioContext);

  const [value] = useDebounce(filter, 800);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_USUARIOS, {
    variables: {
      filtro: value ? value : "",
      empresa: sesion.empresa._id,
      eliminado: true,
    },
    fetchPolicy: "network-only",
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
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <ErrorPage error={error} />
      </Box>
    );
  }

  if (!loading && !error && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <Typography variant="h6">No hay usuarios inactivos</Typography>
      </Box>
    );
  }

  const { obtenerUsuarios } = data;

  return (
    <Box height="60vh">
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>No. Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell align="right">Restaurar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerUsuarios.map((row, index) => (
              <RenderClientes key={index} datos={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const RenderClientes = ({ datos }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const { setUpdate, update } = useContext(UsuarioContext);

  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);

  const cambiarEstado = async (e) => {
    setLoading(true);
    try {
      await actualizarUsuario({
        variables: {
          input: {
            eliminado: false,
          },
          id: datos._id,
        },
      });
      setLoading(false);
      setUpdate(!update);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDeleteToggle = () => setOpen(!open);

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <Typography>{datos.numero_usuario}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{datos.nombre}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{datos.email}</Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton color="primary" onClick={handleDeleteToggle}>
            <RestoreFromTrash style={{ fontSize: 30 }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleDeleteToggle}
        aria-labelledby="reactivar-usuario-dialog"
      >
        <DialogTitle id="reactivar-usuario-dialog">
          {"Se reactivará este usuario"}
        </DialogTitle>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <DialogActions>
          <Button
            onClick={handleDeleteToggle}
            color="inherit"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => cambiarEstado()}
            color="primary"
            autoFocus
            disabled={loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : null
            }
          >
            Restaurar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
