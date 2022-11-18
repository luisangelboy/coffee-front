import React, { useContext, useState, Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Slide from "@material-ui/core/Slide";
import CrearCliente from "./CrearCliente";
import ErrorPage from "../../../../components/ErrorPage";
import { Delete } from "@material-ui/icons";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_CLIENTES,
  ACTUALIZAR_CLIENTE,
  ELIMINAR_CLIENTE,
} from "../../../../gql/Catalogos/clientes";
import { formatoFechaCorta } from "../../../../config/reuserFunctions";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { TablePagination } from "@material-ui/core";
// import { VentasContext } from "../../../../context/Ventas/ventasContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "63vh",
  },
});

export default function ListaClientes({
  user,
  tipo,
  filtro,
  ventas,
  handleClickOpen,
  isOnline,
}) {
  const classes = useStyles();
  const { setUpdateClientVenta, updateClientVenta, update } =
    useContext(ClienteCtx);
  const [value] = useDebounce(filtro, 1000);
  const [page, setPage] = useState(0);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const limit = 20;
  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CLIENTES, {
    variables: {
      tipo,
      filtro: value,
      empresa: sesion.empresa._id,
      eliminado: false,
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    refetch();
  }, [update, refetch]);

  //show modal accept client
  const [showModal, setShowModal] = useState(false);
  const [dataSelectRowClient, setDataSelectRowClient] = useState({});
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const handleClickOpenModal = (data, e) => {
    if (ventas) {
      setShowModal(true);
      setDataSelectRowClient(data);
    }
  };

  const handleClickSelectClient = () => {
    //clear object
    const {
      representante,
      estado_cliente,
      tipo_cliente,
      empresa,
      sucursal,
      fecha_nacimiento,
      fecha_registro,
      eliminado,
      ...clean_cliente
    } = dataSelectRowClient;
    try {
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let venta_actual = venta === null ? {} : venta;
      localStorage.setItem(
        "DatosVentas",
        JSON.stringify({
          ...venta_actual,
          subTotal:
            venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
          total: venta_actual.total === undefined ? 0 : venta_actual.total,
          impuestos:
            venta_actual.impuestos === undefined ? 0 : venta_actual.impuestos,
          iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
          ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
          descuento:
            venta_actual.descuento === undefined ? 0 : venta_actual.descuento,
          monedero:
            venta_actual.monedero === undefined ? 0 : venta_actual.monedero,
          // tipo_cambio: venta_actual.tipo_cambio ? venta_actual.tipo_cambio : {},
          cliente: clean_cliente ? clean_cliente : {},
          venta_cliente: true,
          productos:
            venta_actual.productos?.length > 0 ? venta_actual.productos : [],
          tipo_emision: venta_actual.tipo_emision
            ? venta_actual.tipo_emision
            : "TICKET",
        })
      );
      setUpdateClientVenta(!updateClientVenta);
      setShowModal(!showModal);
      handleClickOpen();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
        width="120vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} />;
  }

  const { obtenerClientes } = data;

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Paper className={classes.root} variant="outlined">
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell width="110">No. Cliente</TableCell>
                <TableCell width="100">Clave</TableCell>
                <TableCell width="200">Nombre</TableCell>
                <TableCell width="150">Correo</TableCell>
                <TableCell width="200">Fecha Registro</TableCell>
                {user === "EMPLEADO" ? null : (
                  <TableCell width="100">Estado</TableCell>
                )}
                <TableCell width="50">Editar</TableCell>
                {user === "EMPLEADO" ? null : (
                  <TableCell width="50">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerClientes.docs.map((row, index) => {
                return (
                  <RowsRender
                    isOnline={isOnline}
                    user={user}
                    key={index}
                    datos={row}
                    handleClickOpenModal={handleClickOpenModal}
                    setAlert={setAlert}
                    refetch={refetch}
                    ventas={ventas}
                    dataSelectRowClient={dataSelectRowClient}
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
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="select-dialog-cliente-venta"
          aria-describedby="select-cliente-venta-description"
        >
          <DialogTitle id="select-dialog-cliente-venta">
            {"¿Estas seguro que desea seleccionar este cliente?"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {`Cliente: ${dataSelectRowClient.nombre_cliente}`}
            </Typography>
            <Typography>
              {`Número de clave: ${dataSelectRowClient.clave_cliente}`}
            </Typography>
            <DialogContentText id="select-cliente-venta-description">
              Al seleccionar el cliente se colocara en la venta.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowModal(false)}
              color="primary"
              autoFocus
            >
              cancelar
            </Button>
            <Button onClick={() => handleClickSelectClient()} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fragment>
  );
}

const RowsRender = ({
  datos,
  user,
  handleClickOpenModal,
  setAlert,
  refetch,
  ventas,
  dataSelectRowClient,
  isOnline,
}) => {
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const { update, setUpdate } = useContext(ClienteCtx);
  const [loading, setLoading] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* console.log(datos); */

  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  const cambiarEstado = async (e) => {
    setLoading(true);

    try {
      await actualizarCliente({
        variables: {
          input: {
            estado_cliente: e.target.checked,
          },
          id: datos._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      setUpdate(!update);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        tabIndex={-1}
        onClick={(e) => handleClickOpenModal(datos, e)}
        hover={ventas}
        style={ventas ? { cursor: "pointer" } : null}
        selected={
          ventas && dataSelectRowClient.numero_cliente === datos.numero_cliente
        }
      >
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
          <Typography>{formatoFechaCorta(datos.fecha_registro)}</Typography>
        </TableCell>
        {user === "EMPLEADO" ? null : (
          <TableCell>
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <Switch
                checked={datos.estado_cliente}
                disabled={!isOnline}
                onChange={cambiarEstado}
                color="primary"
                size="small"
              />
            )}
          </TableCell>
        )}
        <TableCell width={50}>
          {permisosUsuario.accesos.catalogos.clientes.editar ===
          false ? null : (
            <CrearCliente
              tipo="CLIENTE"
              accion="actualizar"
              datos={datos}
              refetch={refetch}
              isOnline={isOnline}
            />
          )}
        </TableCell>
        <TableCell width={50}>
          {permisosUsuario.accesos.catalogos.clientes.eliminar ===
          false ? null : (
            <EliminarCliente
              isOnline={isOnline}
              datos={datos}
              setAlert={setAlert}
              refetch={refetch}
            />
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const EliminarCliente = ({ datos, setAlert, refetch, isOnline }) => {
  const [open, setOpen] = useState(false);
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);
  const [loading, setLoading] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { update, setUpdate } = useContext(ClienteCtx);

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
