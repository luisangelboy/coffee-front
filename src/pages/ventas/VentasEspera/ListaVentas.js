import React, { Fragment, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import DeleteIcon from "@material-ui/icons/Delete";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { AccesosContext } from "../../../context/Accesos/accesosCtx";
import { useEffect } from "react";
import { formatoMexico } from "../../../config/reuserFunctions";
import Close from "@material-ui/icons/Close";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";

const columns = [
  /* { id: "folio", label: "Folio", minWidth: 20, align: "center" }, */
  { id: "fecha", label: "Fecha", minWidth: 20, align: "center" },
  { id: "cliente", label: "Cliente", minWidth: 330, align: "center" },
  { id: "productos", label: "Productos", minWidth: 20, align: "center" },
  { id: "total", label: "Total", minWidth: 200, align: "center" },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "45vh",
    "& ::-webkit-scrollbar": {
      display: "none",
    },
  },
});

export default function ListaVentas({ handleModalEspera }) {
  const classes = useStyles();

  let listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ width: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center" style={{ width: 35 }}>
                Regresar
              </TableCell>

              <TableCell align="center" style={{ width: 35 }}>
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaEnEspera?.map((row, index) => {
              return (
                <RowsVentas
                  venta={row}
                  index={index}
                  key={index}
                  handleModalEspera={handleModalEspera}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RowsVentas = ({ venta, index, handleModalEspera }) => {
  const {
    reloadEliminarVentaEspera,
    setReloadEliminarVentaEspera,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);

  const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);
  const [open, setOpen] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  let listaEnEspera = JSON.parse(localStorage.getItem("ListaEnEspera"));
  let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));

  function borrarVenta() {
    if (sesion.accesos.ventas.eliminar_ventas.ver === true) {
      let nueva_venta_espera = [...listaEnEspera];
      nueva_venta_espera.splice(index, 1);
      if (nueva_venta_espera.length === 0) {
        localStorage.removeItem("ListaEnEspera");
      } else {
        localStorage.setItem(
          "ListaEnEspera",
          JSON.stringify(nueva_venta_espera)
        );
      }
      setUpdateTablaVentas(!updateTablaVentas);
    } else {
      return null;
    }
  }

  const AgregarVentaDeNuevo = () => {
    if (datosVenta === null) {
      let nueva_venta_espera = [...listaEnEspera];
      localStorage.setItem("DatosVentas", JSON.stringify(venta.datosVenta));
      nueva_venta_espera.splice(index, 1);
      if (nueva_venta_espera.length === 0) {
        localStorage.removeItem("ListaEnEspera");
        updateDataStorage();
        handleModalEspera();
        return;
      }
      localStorage.setItem("ListaEnEspera", JSON.stringify(nueva_venta_espera));
      updateDataStorage();
      handleModalEspera();
    } else {
      setOpen(!open);
    }
  };

  const updateDataStorage = () => {
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
  };

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const verificarPermisos = () => {
    if (sesion.accesos.ventas.eliminar_ventas.ver === true) {
      borrarVenta();
    } else {
      setAbrirPanelAcceso(!abrirPanelAcceso);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "eliminar_ventas",
        tipo_acceso: "ver",
      });
    }
  };

  useEffect(() => {
    if (reloadEliminarVentaEspera === true) {
      borrarVenta();
      setReloadEliminarVentaEspera(false);
    }
  }, [reloadEliminarVentaEspera]);

  return (
    <Fragment>
      <TableRow hover tabIndex={-1}>
        <TableCell align="center">{venta.fecha ? venta.fecha : ""}</TableCell>
        <TableCell align="center">
          {venta.datosVenta.cliente && venta.datosVenta.cliente.nombre_cliente
            ? venta.datosVenta.cliente.nombre_cliente
            : "Pub. General"}
        </TableCell>
        <TableCell align="center">
          {venta.datosVenta.productos.length}
        </TableCell>
        <TableCell align="center">
          $ {formatoMexico(venta.datosVenta.total)}
        </TableCell>
        <TableCell align="center">
          <RegresarVenta
            AgregarVentaDeNuevo={AgregarVentaDeNuevo}
            open={open}
            handleClickOpen={handleClickOpen}
          />
        </TableCell>
        <TableCell align="center">
          <EliminarVentaEspera verificarPermisos={verificarPermisos} />
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const RegresarVenta = ({ open, handleClickOpen, AgregarVentaDeNuevo }) => {
  return (
    <Fragment>
      <IconButton
        aria-label="regresar"
        color="primary"
        size="small"
        onClick={() => AgregarVentaDeNuevo()}
      >
        <AutorenewIcon fontSize="medium" />
      </IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClickOpen}
        message="No puedes agregar una venta cuando ya está una en curso."
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClickOpen}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Fragment>
  );
};

const EliminarVentaEspera = ({ verificarPermisos }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleClickOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <Fragment>
      <IconButton
        aria-label="delete"
        size="small"
        onClick={() => handleClickOpen()}
      >
        <DeleteIcon fontSize="medium" />
      </IconButton>
      <Dialog onClose={() => handleClose()} open={openModal}>
        <DialogTitle>Se eliminara esta venta en espera</DialogTitle>
        <DialogActions>
          <Button color="inherit" size="small" onClick={() => handleClose()}>
            Cancelar
          </Button>
          <Button
            color="secondary"
            size="small"
            onClick={() => verificarPermisos()}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
