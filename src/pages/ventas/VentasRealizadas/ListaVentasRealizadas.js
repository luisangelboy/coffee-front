import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  makeStyles,
  Snackbar,
  TablePagination,
  Typography,
} from "@material-ui/core";
import moment from "moment";

import { Close } from "@material-ui/icons";
import ErrorPage from "../../../components/ErrorPage";
import { useQuery } from "@apollo/client";
import { OBTENER_VENTAS_SUCURSAL } from "../../../gql/Ventas/ventas_generales";
import { formatoMexico } from "../../../config/reuserFunctions";
//import { Alert } from "@material-ui/lab";
import { useDebounce } from "use-debounce/lib";
import { VentasContext } from "../../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import InfoVentaFolio from "./InfoVenta";
import CancelarFolio from "./CancelarFolio";
import { OBTENER_PRE_CORTE_CAJA } from "../../../gql/Cajas/cajas";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "55vh",
  },
}));

export default function ListaVentasRealizadas({ handleClose }) {
  const [filtro, setFiltro] = useState("");
  const [params, setParams] = useState("TODAS");

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [value] = useDebounce(filtro, 500);
  const [page, setPage] = useState(0);
  const limit = 20;

  const admin = sesion.accesos.ventas.cancelar_venta.editar;
  const fecha_entrada = turnoEnCurso.fecha_movimiento;

  const input_precorte = {
    horario_en_turno: "ABRIR TURNO",
    id_caja: turnoEnCurso ? turnoEnCurso.id_caja : "",
    id_usuario: sesion._id,
    token_turno_user: turnoEnCurso ? turnoEnCurso.token_turno_user : "",
  };

  const isDate = moment(value).isValid();

  /* Queries */
  const resultado_ventas = useQuery(OBTENER_VENTAS_SUCURSAL, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: {
        isDate,
        busqueda: value,
        filtro: params,
        vista: "VENTAS",
        turno: {
          id_caja: turnoEnCurso.id_caja,
          fecha_entrada,
        },
        admin,
      },
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
  });
  const res_precorte = useQuery(OBTENER_PRE_CORTE_CAJA, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      input: input_precorte,
    },
  });

  return (
    <Fragment>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por: Folio, cliente, clave o nombre"
              variant="outlined"
              onChange={(e) => setFiltro(e.target.value)}
              value={filtro}
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <FormControl variant="outlined" size="small" fullWidth>
              <Select
                value={params}
                onChange={(e) => setParams(e.target.value)}
              >
                <MenuItem value="TODAS">
                  <em>Todas</em>
                </MenuItem>
                <MenuItem value="HOY">Ventas de hoy</MenuItem>
                <MenuItem value="REALIZADAS">Ventas realizadas</MenuItem>
                <MenuItem value="CANCELADAS">Ventas canceladas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={3} xs={12}>
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
          Para ver la información completa una venta haz un doble click!
        </Alert>
      </Box> */}
      <Box my={1} display="flex">
        {admin ? (
          <Fragment>
            <Box
              border={1}
              borderColor="#58ff8f"
              bgcolor="#EDFFF3"
              height="24px"
              width="24px"
            />
            <Box mx={1} />
            <Typography>
              <b>- Ventas de hoy</b>
            </Typography>
            <Box mx={2} />
          </Fragment>
        ) : null}
        <Box
          border={1}
          borderColor="#FF8A8A"
          bgcolor="#FFF4F4"
          height="24px"
          width="24px"
        />
        <Box mx={1} />
        <Typography>
          <b>- Ventas canceladas</b>
        </Typography>
        <Box mx={1} />
        <Box
          border={1}
          borderColor="#FFA91C"
          bgcolor="#FFEAAD"
          height="24px"
          width="24px"
        />
        <Box mx={1} />
        <Typography>
          <b>- Notas de crédito</b>
        </Typography>
      </Box>
      <RenderLista
        resultado_ventas={resultado_ventas}
        res_precorte={res_precorte}
        handleClose={handleClose}
        admin={admin}
        page={page}
        setPage={setPage}
        limit={limit}
      />
    </Fragment>
  );
}

const RenderLista = ({
  resultado_ventas,
  res_precorte,
  handleClose,
  admin,
  page,
  setPage,
  limit,
}) => {
  const {
    updateTablaVentas,
    setUpdateTablaVentas,
    setVentaRetomada,
  } = useContext(VentasContext);
  const { updateClientVenta, setUpdateClientVenta } = useContext(ClienteCtx);
  const classes = useStyles();
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const { loading, data, error, refetch } = resultado_ventas;
  const [view, setView] = useState(false);

  const handleClickView = () => {
    setView(true);
  };

  const handleCloseView = () => {
    setView(false);
  };

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

  //obtener dinero en caja
  const { obtenerVentasSucursal } = data;
  const data_precorte = res_precorte.data;
  const pre_corte = data_precorte.obtenerPreCorteCaja
    ? data_precorte.obtenerPreCorteCaja.monto_efectivo_precorte
    : 0;

  const obtenerVenta = (click, data) => {
    setSelected(data);
    let temp = true;
    if (click === 2 && !temp) {
      let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
      if (datosVenta === null) {
        //armar array de productos
        let productos = [];

        data.productos.forEach((res) => {
          productos.push({
            cantidad: res.cantidad,
            cantidad_venta: res.cantidad_venta,
            codigo_barras: res.id_producto.datos_generales.codigo_barras,
            codigo_unidad: res.codigo_unidad,
            color: res.color,
            concepto: res.concepto,
            default: res.default,
            descuento: res.id_unidad_venta.descuento,
            descuento_activo: res.id_unidad_venta.descuento_activo,
            granel_producto: res.granel_producto,
            id_producto: res.id_producto,
            ieps_total_producto: res.ieps_total,
            impuestos_total_producto: res.impuestos,
            inventario_general: res.inventario_general,
            iva_total_producto: res.iva_total,
            medida: res.medida,
            precio: res.precio,
            precio_a_vender: res.precio_a_vender,
            precio_actual_object: res.precio_actual_object,
            precio_actual_producto: res.precio_actual_producto,
            precio_anterior: res.precio_actual_producto,
            precio_unidad: res.precio_unidad,
            subtotal_total_producto: res.subtotal,
            total_total_producto: res.total,
            unidad: res.unidad,
            unidad_principal: res.id_unidad_venta.unidad_principal,
            _id: res.id_unidad_venta._id,
          });
        });

        //armar objeto para Storage

        let datosVenta = {
          cliente: data.cliente,
          descuento: data.descuento,
          ieps: data.ieps,
          impuestos: data.impuestos,
          iva: data.iva,
          monedero: data.monedero,
          productos,
          subTotal: data.subTotal,
          total: data.total,
          venta_cliente: data.venta_cliente,
          tipo_emision: data.tipo_emision,
        };

        //se agregan la venta a localStorage
        localStorage.setItem("DatosVentas", JSON.stringify(datosVenta));
        setVentaRetomada(datosVenta);
        updateDataStorage();
        handleClose();
      } else {
        handleClickOpen();
      }
    } else if (click === 2 && temp) {
      handleClickView();
    }
  };

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const updateDataStorage = () => {
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
  };

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <Paper variant="outlined">
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
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Folio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Caja</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Impuestos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Cancelar Venta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerVentasSucursal.docs.map((data, index) => {
              return (
                <RowComprasRealizadas
                  key={index}
                  data={data}
                  selected={selected}
                  obtenerVenta={obtenerVenta}
                  refetch={refetch}
                  admin={admin}
                  pre_corte={pre_corte}
                />
              );
            })}
          </TableBody>
        </Table>
        <InfoVentaFolio
          venta={selected}
          open={view}
          handleClose={handleCloseView}
          handleCloseListaVentas={handleClose}
          refetch={refetch}
        />
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

const tableStyles = makeStyles((theme) => ({
  today_color: {
    backgroundColor: "#EDFFF3",
    "&:hover": {
      backgroundColor: "#D8FFE5",
    },
  },
  normal_color: {
    backgroundColor: "#FFF",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
  root: {
    "&$root": {
      backgroundColor: "#FFF4F4",
      color: "#FF8A8A",
    },
    "&$root:hover": {
      backgroundColor: "#FFE0E0",
    },
  },
  notas_credito: {
    borderLeft: " 6px solid #FFEAAD",
  },
  selected: {
    "&$selected, &$selected:hover": {
      backgroundColor: "#E8F4FD",
    },
  },
}));

const RowComprasRealizadas = ({
  data,
  selected,
  obtenerVenta,
  refetch,
  admin,
  pre_corte,
}) => {
  const classes = tableStyles();
  let today =
    moment(data.fecha_registro).format("YYYY-MM-DD") ===
    moment().locale("es-mx").format("YYYY-MM-DD");

  return (
    <TableRow
      role="checkbox"
      tabIndex={-1}
      selected={data.folio === selected.folio}
      onClick={(e) => obtenerVenta(e.detail, data)}
      classes={{
        selected: classes.selected,
        root: data.status === "CANCELADO" ? classes.root : null,
      }}
      className={ today && admin ? classes.today_color : classes.normal_color}
    >
      <TableCell className={data.nota_credito.length ? classes.notas_credito + " delete-color" : " delete-color"  }>{data.folio}</TableCell>
      <TableCell className="delete-color">
        {moment(data.fecha_registro).format("DD/MM/YYYY")}
      </TableCell>
      <TableCell className="delete-color">
        <div className="noWrap2">
          {data.cliente !== null
            ? data.cliente.nombre_cliente
            : "Publico General"}
        </div>
      </TableCell>
      <TableCell className="delete-color">
        <div className="noWrap2">{data.usuario.nombre}</div>
      </TableCell>
      <TableCell className="delete-color">{data.id_caja.numero_caja}</TableCell>
      <TableCell className="delete-color">
        ${data.descuento ? formatoMexico(data.descuento) : 0}
      </TableCell>
      <TableCell className="delete-color">
        ${formatoMexico(data.subTotal)}
      </TableCell>
      <TableCell className="delete-color">
        ${formatoMexico(data.impuestos)}
      </TableCell>
      <TableCell className="delete-color">
        ${formatoMexico(data.total)}
      </TableCell>
      <TableCell className="delete-color" align="center">
        <CancelarFolio
          venta={data}
          refetch={refetch}
          dinero_disponible={pre_corte}
          selected={selected}
          view="table"
        />
      </TableCell>
    </TableRow>
  );
};
