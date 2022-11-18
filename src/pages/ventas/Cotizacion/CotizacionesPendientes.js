import React, { Fragment, useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
/* import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle"; */
import Snackbar from "@material-ui/core/Snackbar";
import { Box, CircularProgress, IconButton } from "@material-ui/core";
//import DeleteIcon from '@material-ui/icons/Delete';
import Close from "@material-ui/icons/Close";
import AutorenewIcon from "@material-ui/icons/Autorenew";
//import {formatoFecha} from '../../../config/reuserFunctions';
import moment from "moment";
import { useQuery } from "@apollo/client";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import { CONSULTAR_COTIZACIONES } from "../../../gql/Ventas/cotizaciones";
import DetalleCotizacion from "./DetalleCotizacion";

const columns = [
  { id: "folio", label: "Folio", minWidth: 20, align: "center" },
  { id: "cliente", label: "Cliente", minWidth: 100 },
  { id: "fecha", label: "Fecha", minWidth: 80, align: "center" },
  {
    id: "fechaVencimiento",
    label: "Fecha de vencimiento",
    minWidth: 60,
    align: "center",
  },
  { id: "productos", label: "Productos", minWidth: 50, align: "center" },
  { id: "total", label: "Total", minWidth: 50, align: "center" },
];
/* 
function createData(folio, cliente, fecha, total) {
	return { folio, cliente, fecha, total};
}
 */

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "70vh",
  },
});

export default function CotizacionesPendientes({ setOpen }) {
  const classes = useStyles();
  //const [ page, setPage ] = React.useState(0);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  //const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [view, setView] = useState(false);
  const [selected, setSelected] = useState("");

  const { data, refetch, loading } = useQuery(CONSULTAR_COTIZACIONES, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });

  useEffect(() => {
    try {
      refetch();
    } catch (error) {}
  }, []);

  let rows = [];
  const handleCloseView = () => {
    setView(false);
  };
  /* 	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	}; */
  const handleModalCotizacion = () => {
    setOpen(false);
  };
  if (data) rows = data.obtenerCotizaciones;
  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="medium" aria-label="enhanced table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center" style={{ width: 35 }}>
                Retomar
              </TableCell>
              {/* 	<TableCell align='center' style={{ width: 35 }}>
								Eliminar
							</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <CotizacionRow
                  cotizacion={row}
                  handleModalCotizacion={handleModalCotizacion}
                  setView={setView}
                  setSelected={setSelected}
                />
              );
            })}
          </TableBody>
        </Table>
        <DetalleCotizacion
          venta={selected}
          open={view}
          handleClose={handleCloseView}
          refetch={refetch}
        />
      </TableContainer>
      {/* 	<TablePagination
				rowsPerPageOptions={[ 10, 25, 100 ]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/> */}
    </Paper>
  );
}

const CotizacionRow = ({
  cotizacion,
  index,
  handleModalCotizacion,
  setSelected,
  setView,
}) => {
  const [openMessage, setOpenMessage] = useState({ message: "", open: false });
  //const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
  const { updateTablaVentas, setUpdateTablaVentas } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);

  const AgregarVentaDeNuevo = () => {
    try {
      //	(_cotizacion.fecha_vencimiento_cotizacion
      console.log(cotizacion.productos);
      let objectToSave = JSON.stringify({
        cliente:
          cotizacion.cliente.nombre_cliente === null ? {} : cotizacion.cliente,
        descuento: cotizacion.descuento,
        ieps: cotizacion.ieps,
        impuestos: cotizacion.impuestos,
        iva: cotizacion.iva,
        monedero: cotizacion.monedero,
        productos: cotizacion.productos,
        subTotal: cotizacion.subTotal,
        total: cotizacion.total,
        venta_cliente: false,
        tipo_emision: cotizacion.tipo_emision
          ? cotizacion.tipo_emision
          : "TICKET",
      });

      //Veriricar si hay una
      if (datosVenta === null) {
        //setOpenMessage({message: 'agregarVentaDeNuevo', open:true});

        if (
          moment(cotizacion.fecha_vencimiento_cotizacion).isBefore(
            moment().locale("es-mx").format("YYYY MM DD")
          )
        ) {
          setOpenMessage({
            message: "La cotización seleccionada ya tiene la fecha vencida.",
            open: true,
          });
          return;
        }
        localStorage.setItem("DatosVentas", objectToSave);
        handleModalCotizacion();
        updateDataStorage();
      } else {
        setOpenMessage({
          message: "No puedes agregar una venta cuando ya está una en curso.",
          open: true,
        });
      }
    } catch (error) {
      console.log("agregarVentaDeNuevo", error);
    }
  };

  const openDetail = (click) => {
    try {
      if (click === 2) {
        console.log(cotizacion);
        setSelected(cotizacion);
        setView(true);
      }
    } catch (error) {}
  };
  const updateDataStorage = () => {
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
  };
  const handleClickOpen = () => {
    try {
      setOpenMessage(!openMessage.open);
    } catch (error) {}
  };

  try {
    /* 	function borrarCotizacion() {
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
		const verificarPermisos = () => {
			if (sesion.accesos.ventas.eliminar_ventas.ver === true) {
				borrarCotizacion();
			} else {
			  setAbrirPanelAcceso(!abrirPanelAcceso);
			  setDepartamentos({
				departamento: "ventas",
				subDepartamento: "eliminar_ventas",
				tipo_acceso: "ver",
			  });
			}
		  }; */
    return (
      <>
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          key={cotizacion.code}
          onClick={(e) => openDetail(e.detail)}
        >
          <TableCell align="center">{cotizacion.folio}</TableCell>
          <TableCell>
            {cotizacion.cliente.nombre_cliente
              ? cotizacion.cliente.nombre_cliente
              : "Público general"}
          </TableCell>
          <TableCell align="center">{cotizacion.fecha_registro}</TableCell>
          <TableCell align="center">
            {cotizacion.fecha_vencimiento_cotizacion}
          </TableCell>
          <TableCell align="center">{cotizacion.productos.length}</TableCell>
          <TableCell align="center">{cotizacion.total}</TableCell>
          <TableCell align="center">
            <RegresarVenta
              AgregarVentaDeNuevo={AgregarVentaDeNuevo}
              openMessage={openMessage}
              handleClickOpen={handleClickOpen}
            />
          </TableCell>

          {/* <TableCell align="center">
					<EliminarVentaEspera verificarPermisos={verificarPermisos} />
					</TableCell> */}

          {/* <TableCell align='center' >
						<IconButton aria-label="delete" size='small'>
						    <AutorenewIcon fontSize="medium" />
						</IconButton>
					</TableCell> */}
          {/* 	<TableCell align='center' >
						<IconButton aria-label="delete" size='small'>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</TableCell> */}
        </TableRow>
      </>
    );
  } catch (error) {}
};

const RegresarVenta = ({
  openMessage,
  handleClickOpen,
  AgregarVentaDeNuevo,
}) => {
  return (
    <Fragment>
      <IconButton
        aria-label="regresar"
        color="primary"
        size="small"
        onClick={AgregarVentaDeNuevo}
      >
        <AutorenewIcon fontSize="medium" />
      </IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openMessage.open}
        autoHideDuration={5000}
        onClose={handleClickOpen}
        message={openMessage.message}
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

/*  const EliminarCotizacion = ({ verificarPermisos }) => {
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
  }; */
