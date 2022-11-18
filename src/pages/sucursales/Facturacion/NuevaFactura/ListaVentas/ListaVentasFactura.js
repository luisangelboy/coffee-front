import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
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
import Grid from "@material-ui/core/Grid";
import { makeStyles, Snackbar, TablePagination } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import { Close, Description, Search } from "@material-ui/icons";
import ErrorPage from "../../../../../components/ErrorPage";
import { useQuery } from "@apollo/client";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";
import ProductosSinClaveSat from "./ProductosSinClave";
import { OBTENER_VENTAS_SUCURSAL } from "../../../../../gql/Ventas/ventas_generales";
import { formatoMexico } from "../../../../../config/reuserFunctions";
//import { Alert } from "@material-ui/lab";
import { useDebounce } from "use-debounce/lib";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "50vh",
  },
}));

export default function ListaVentasFactura() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={() => handleOpen()} size="small">
        <Search />
      </IconButton>
      <Dialog
        maxWidth="lg"
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
            <Typography variant="h6">Selecionar venta</Typography>
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
          <ComponentBusquedaVenta handleClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ComponentBusquedaVenta = ({ handleClose }) => {
  const [filtro, setFiltro] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open_productos, setOpenProductos] = useState(false);
  const [productos_sin_clave, setProductosSinClave] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 20;

  const openProductosClaves = () => setOpenProductos(true);
  const closeProductosClaves = () => setOpenProductos(false);

  const [value] = useDebounce(filtro, 500);

  const isDate = moment(value).isValid();

  /* Queries */
  const resultado_ventas = useQuery(OBTENER_VENTAS_SUCURSAL, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: {
        isDate,
        busqueda: value ? value : "",
        filtro: "",
        vista: "FACTURACION",
      },
      limit,
      offset: value ? 0 : page
    },
    fetchPolicy: "network-only",
  });

  return (
    <Fragment>
      <ProductosSinClaveSat
        productos={productos_sin_clave}
        open={open_productos}
        handleClose={closeProductosClaves}
      />
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item sm={8} xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por: Folio, cliente, clave o nombre"
              variant="outlined"
              onChange={(e) => setFiltro(e.target.value)}
              value={filtro}
            />
          </Grid>
          <Grid item sm={4} xs={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type="date"
              onChange={(e) => setFiltro(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      {/* <Box my={1}>
        <Alert severity="info">
          Para seleccionar una venta haz un doble click!
        </Alert>
      </Box> */}
      <RenderLista
        resultado_ventas={resultado_ventas}
        handleClose={handleClose}
        setProductosSinClave={setProductosSinClave}
        openProductosClaves={openProductosClaves}
        page={page}
        setPage={setPage}
        limit={limit}
      />
    </Fragment>
  );
};

const RenderLista = ({
  resultado_ventas,
  handleClose,
  setProductosSinClave,
  openProductosClaves,
  page,
  setPage,
  limit
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState("");
  const {
    setVentaFactura,
    setProductos,
    setDatosFactura,
    datosFactura,
  } = useContext(FacturacionCtx);
  const { loading, data, error } = resultado_ventas;
  const [open, setOpen] = useState(false);

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

  const { obtenerVentasSucursal } = data;

  const obtenerVenta = (click, data, facturada) => {
    /* console.log(data); */
    setSelected(data.folio);
    if (click === 2) {
      if (facturada) {
        setOpen(true);
        return;
      }
      const without_sat_code = data.productos.filter(
        (res) => !res.id_producto.datos_generales.clave_producto_sat.Value
      );

      if (without_sat_code.length > 0) {
        setProductosSinClave(without_sat_code);
        openProductosClaves();
        return;
      }

      const { productos, ...venta } = { ...data };
      const productos_base = [...data.productos];

      let datos_factura = {
        ...datosFactura,
        payment_form: venta.forma_pago,
        payment_method: venta.metodo_pago,
      };

      if (data.cliente && data.cliente.rfc) {
        datos_factura = {
          ...datos_factura,
          receiver: {
            ...datosFactura.receiver,
            Name: data.cliente.nombre_cliente,
            Rfc: data.cliente.rfc,
          },
        };
      }

      setDatosFactura(datos_factura);
      setVentaFactura(venta);
      setProductos(productos_base);
      handleClose();
    }
  };

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Paper variant="outlined">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        message="Esta venta ya fue facturada"
        autoHideDuration={3000}
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Folio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Caja</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerVentasSucursal.docs.map((data, index) => {
              const facturada = data.factura.length > 0;
              return (
                <TableRow
                  key={index}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  selected={data.folio === selected}
                  onClick={(e) => obtenerVenta(e.detail, data, facturada)}
                >
                  <TableCell>
                    {facturada ? <Description color="primary" /> : null}
                  </TableCell>
                  <TableCell>{data.folio}</TableCell>
                  <TableCell>
                    {moment(data.fecha_registro).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    {data.cliente !== null ? data.cliente.nombre_cliente : "-"}
                  </TableCell>
                  <TableCell>{data.usuario.nombre}</TableCell>
                  <TableCell>{data.id_caja.numero_caja}</TableCell>
                  <TableCell>
                    ${data.descuento ? formatoMexico(data.descuento) : 0}
                  </TableCell>
                  <TableCell>${formatoMexico(data.subTotal)}</TableCell>
                  <TableCell>${formatoMexico(data.impuestos)}</TableCell>
                  <TableCell>${formatoMexico(data.total)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={obtenerVentasSucursal.totalDocs}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
};
