import React, { useState, forwardRef, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import {
  RestoreFromTrash,
  Close,
  Search,
  DeleteOutline,
} from "@material-ui/icons";
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
  TablePagination,
} from "@material-ui/core";
import { Fragment } from "react";
import ErrorPage from "../../../../components/ErrorPage";
import { useMutation, useQuery } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import {
  ACTUALIZAR_CLIENTE,
  OBTENER_CLIENTES,
} from "../../../../gql/Catalogos/clientes";
import moment from "moment";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import { useDebounce } from "use-debounce/lib";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ClientesInactivosComponent({
  tipo,
  refetchProveedores,
  isOnline,
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const handleModalToggle = () => setOpen(!open);
  console.log(isOnline);
  return (
    <div>
      <Button
        disableElevation
        color="inherit"
        onClick={handleModalToggle}
        startIcon={<DeleteOutline />}
        disabled={!isOnline}
      >
        {tipo === "CLIENTE" ? "Clientes" : "Proveedores "} eliminados
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
        aria-labelledby="dialog-clientes-eliminados"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="dialog-clientes-eliminados">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              {tipo === "CLIENTE" ? "Clientes" : "Proveedores "} eliminados
            </Typography>
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
              placeholder="Buscar cliente: No. cliente, clave o nombre..."
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
          <ClientesInactivos
            tipo={tipo}
            filter={filter}
            refetchProveedores={refetchProveedores}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const ClientesInactivos = ({ tipo, filter, refetchProveedores }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { update } = useContext(ClienteCtx);
  const [page, setPage] = useState(0);
  const limit = 20;

  const [value] = useDebounce(filter, 800);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES, {
    variables: {
      tipo,
      filtro: value ? value : "",
      empresa: sesion.empresa._id,
      eliminado: true,
      limit,
      offset: page,
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
        <Typography variant="h6">No hay clientes eliminados</Typography>
      </Box>
    );
  }

  const { obtenerClientes } = data;

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Box height="60vh">
      <TableContainer style={{ height: "50vh" }}>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>No. Cliente</TableCell>
              <TableCell>Clave</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Fecha Registro</TableCell>
              <TableCell align="right">Reactivar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerClientes.docs.map((row, index) => (
              <RenderClientes
                key={index}
                datos={row}
                refetchProveedores={refetchProveedores}
              />
            ))}
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
    </Box>
  );
};

const RenderClientes = ({ datos, refetchProveedores }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const { setUpdate, update } = useContext(ClienteCtx);

  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  const cambiarEstado = async (e) => {
    setLoading(true);
    try {
      await actualizarCliente({
        variables: {
          input: {
            eliminado: false,
          },
          id: datos._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      setLoading(false);
      setUpdate(!update);
      if (refetchProveedores) refetchProveedores();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDeleteToggle = () => setOpen(!open);

  return (
    <Fragment>
      <TableRow>
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
          <Typography>{datos.email}</Typography>
        </TableCell>
        <TableCell>
          <Typography>
            {moment(datos.fecha_registro).format("DD/MM/YYYY")}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <IconButton color="primary" size="small" onClick={handleDeleteToggle}>
            <RestoreFromTrash style={{ fontSize: 30 }} />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleDeleteToggle}
        aria-labelledby="reactivar-cliente-dialog"
      >
        <DialogTitle id="reactivar-cliente-dialog">
          {"Se reactivará este cliente"}
        </DialogTitle>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <DialogActions>
          <Button onClick={handleDeleteToggle} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => cambiarEstado()}
            color="primary"
            autoFocus
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
