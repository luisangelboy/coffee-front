import React, { Fragment, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import {
  Dialog,
  Typography,
  Box,
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Chip,
  TablePagination,
} from "@material-ui/core";
import DatosDeCompra from "./DatosDeCompra";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../../config/reuserFunctions";
import { AssignmentOutlined, Done } from "@material-ui/icons";
import CancelCompraConfirm from "./CancelarCompra";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "68vh",
  },
});

export default function ListaProductos({
  obtenerComprasRealizadas,
  refetch,
  limit,
  page,
  setPage,
  filtro,
  filtroFecha,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
    refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      offset: nextPage,
    });
  };

  return (
    <Paper className={classes.root} variant="outlined">
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Almacen</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha de compra</TableCell>
              <TableCell>Compra a credito</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell padding="checkbox">Detalles</TableCell>
              <TableCell padding="checkbox">Cancelar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerComprasRealizadas.docs.map((compra, index) => (
              <RenderRowsCompras
                key={index}
                compra={compra}
                refetch={refetch}
                theme={theme}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={obtenerComprasRealizadas.totalDocs}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
}

const RenderRowsCompras = ({ compra, refetch, theme }) => {
  const {
    almacen,
    proveedor,
    fecha_registro,
    compra_credito,
    credito_pagado,
    subtotal,
    impuestos,
    total,
  } = compra;

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{almacen.nombre_almacen}</TableCell>
      <TableCell>{proveedor.nombre_cliente}</TableCell>
      <TableCell>{formatoFechaCorta(fecha_registro)}</TableCell>
      <TableCell>
        {compra.status && compra.status === "CANCELADO" ? (
          <Chip label="CANCELADO" color="secondary" variant="outlined" />
        ) : compra_credito === true ? (
          <Chip
            label={credito_pagado === true ? "PAGADO" : "PENDIENTE"}
            style={{
              color:
                credito_pagado === true
                  ? theme.palette.primary.main
                  : theme.palette.warning.main,
              borderColor:
                credito_pagado === true
                  ? theme.palette.primary.main
                  : theme.palette.warning.main,
            }}
            variant="outlined"
          />
        ) : (
          <Chip label="CONTADO" color="default" variant="outlined" />
        )}
      </TableCell>
      <TableCell>
        <b>${formatoMexico(subtotal)}</b>
      </TableCell>
      <TableCell>
        <b>${formatoMexico(impuestos)}</b>
      </TableCell>
      <TableCell>
        <b>${formatoMexico(total)}</b>
      </TableCell>
      <TableCell>
        <DetallesCompra compra={compra} />
      </TableCell>
      <TableCell>
        <CancelCompraConfirm compra={compra} refetch={refetch} />
      </TableCell>
    </TableRow>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DetallesCompra = ({ compra }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <Fragment>
      <IconButton size="small" onClick={() => handleOpen()}>
        <AssignmentOutlined />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleOpen}
        fullWidth
        maxWidth="lg"
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Datos de venta
            </Typography>
            <Button
              variant="text"
              color="primary"
              onClick={handleOpen}
              size="large"
            >
              <CloseIcon style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DatosDeCompra compra={compra} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="primary"
            size="large"
            startIcon={<Done />}
            onClick={() => handleOpen()}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
