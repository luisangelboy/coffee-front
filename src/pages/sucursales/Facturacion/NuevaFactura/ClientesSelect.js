import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, TablePagination } from "@material-ui/core";
import { Close, Error, Search } from "@material-ui/icons";
import ErrorPage from "../../../../components/ErrorPage";
import { useQuery } from "@apollo/client";
import { OBTENER_CLIENTES } from "../../../../gql/Catalogos/clientes";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx";
import CrearCliente from "../../Catalogos/Cliente/CrearCliente";
import { Alert } from "@material-ui/lab";
import { useDebounce } from "use-debounce";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "45vh",
  },
}));

export default function ListaClientesFacturas() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={() => handleOpen()} size="small">
        <Search />
      </IconButton>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box style={{ display: "flex" }}>
            <Typography variant="h6">Selecionar cliente</Typography>
            <Box flexGrow={1} />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleClose()}
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <BuscadorClienteComponent handleClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={() => handleClose()}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const BuscadorClienteComponent = ({ handleClose }) => {
  const [filtro, setFiltro] = useState("");
  const [openAlertRfc, setOpenAlertRfc] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [value] = useDebounce(filtro, 500);
  const [page, setPage] = useState(0);
  const limit = 20;

  /* Queries */
  const resultado_clientes = useQuery(OBTENER_CLIENTES, {
    variables: {
      tipo: "CLIENTE",
      filtro: value,
      empresa: sesion.empresa._id,
      eliminado: false,
      limit,
      offset: page
    },
    fetchPolicy: "network-only",
  });

  const handleCloseAlertRFC = () => {
    setOpenAlertRfc(false);
  };
  const openAlertRFC = () => {
    setOpenAlertRfc(true);
  };

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlertRfc}
        onClose={handleCloseAlertRFC}
        message="Debes registrar un RFC y RAZÓN SOCIAL a este cliente."
        autoHideDuration={2000}
      />
      <Box mb={2} display="flex" alignItems="center">
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por: Numero de cliente, clave o nombre"
          variant="outlined"
          onChange={(e) => setFiltro(e.target.value)}
          value={filtro}
        />
        <CrearCliente
          tipo="CLIENTE"
          accion="registrar"
          refetch={resultado_clientes.refetch}
        />
      </Box>
      <Box my={1}>
        <Alert severity="info">
          Para seleccionar un cliente haz un doble click!
        </Alert>
      </Box>
      <RenderListClientes
        handleClose={handleClose}
        resultado_clientes={resultado_clientes}
        openAlertRFC={openAlertRFC}
        page={page}
        setPage={setPage}
        limit={limit}
      />
    </Fragment>
  );
};

const RenderListClientes = ({
  handleClose,
  resultado_clientes,
  openAlertRFC,
  page,
  setPage,
  limit,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState("");
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  const { loading, data, error, refetch } = resultado_clientes;

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage />;
  }

  const { obtenerClientes } = data;

  const obtenerClienteTabla = (click, row) => {
    setSelected(row.nombre_cliente);
    if (click === 2) {
      if (!row.rfc) {
        openAlertRFC();
        return;
      }
      setDatosFactura({
        ...datosFactura,
        receiver: {
          ...datosFactura.receiver,
          Name: row.nombre_cliente,
          Rfc: row.rfc,
        },
      });
      handleClose();
    }
  };

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Paper variant="outlined">
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell minwidth="100">No. Cliente</TableCell>
              <TableCell minwidth="100">Clave</TableCell>
              <TableCell minwidth="150">Nombre</TableCell>
              <TableCell minwidth="150">Razon Social</TableCell>
              <TableCell minwidth="150">RFC</TableCell>
              <TableCell minwidth="150">Editar Cliente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerClientes.docs.map((row, index) => {
              return (
                <TableRow
                  key={index}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  onClick={(e) => obtenerClienteTabla(e.detail, row)}
                  selected={row.nombre_cliente === selected}
                >
                  <TableCell>
                    <Typography>{row.numero_cliente}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.clave_cliente}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.nombre_cliente}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.razon_social}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {row.rfc ? row.rfc : <Error color="primary" />}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <CrearCliente
                      tipo="CLIENTE"
                      accion="actualizar"
                      datos={row}
                      refetch={refetch}
                    />
                  </TableCell>
                </TableRow>
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
};
