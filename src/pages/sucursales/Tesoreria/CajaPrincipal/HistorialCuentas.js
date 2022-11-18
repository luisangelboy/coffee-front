import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  TablePagination,
} from "@material-ui/core";
import moment from "moment";
import ErrorPage from "../../../../components/ErrorPage";

import { useQuery } from "@apollo/client";
import { OBTENER_HISTORIAL_CUENTAS } from "../../../../gql/Empresa/sucursales";
import { useDebounce } from "use-debounce/lib";
import { formatoMexico } from "../../../../config/reuserFunctions";

const columns = [
  { id: "fecha", label: "Fecha", minWidth: 100 },
  { id: "tipo", label: "Tipo Movimiento", minWidth: 100 },
  { id: "concepto", label: "Concepto", minWidth: 150 },
  { id: "cantidad", label: "Cantidad", minWidth: 150 },
  { id: "name", label: "Usuario", minWidth: 150 },
  { id: "movimiento", label: "Origen Movimiento", minWidth: 100 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "50vh",
  },
  container: {
    minHeight: "40vh",
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formComboBox: {
    height: "50%",
  },
  rootBusqueda: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
}));

export default function HistorialCuentas({
  cuenta,
  tipo,
  reload,
  setSaldoCaja,
}) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  moment.locale("es");
  const classes = useStyles();
  /* const [open, setOpen] = useState(false); */
  const [datosFiltro, setDatosFiltro] = useState([]);
  const [value] = useDebounce(datosFiltro, 500);
  const [page, setPage] = useState(0);
  const limit = 10;

  /* const handleClickOpen = () => {
        setOpen(!open);
        setDatosFiltro([]);
        refetch();
    }; */

  const { data, loading, refetch, error } = useQuery(OBTENER_HISTORIAL_CUENTAS, {
    variables: {
      input: {
        fecha_inicio: datosFiltro.fecha_inicio ? datosFiltro.fecha_inicio : "",
        fecha_fin: datosFiltro.fecha_fin ? datosFiltro.fecha_fin : "",
        usuario: value.usuario ? value.usuario : "",
        tipo_movimiento: datosFiltro.tipo_movimiento
          ? datosFiltro.tipo_movimiento
          : "",
      },
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      tipo: tipo,
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
  });

  let historialCuenta = [];
  if (data) {
    setSaldoCaja(data.obtenerHistorialCuenta.saldo_en_caja);
    historialCuenta = data.obtenerHistorialCuenta;
  }

  const obtenerDatos = (e) => {
    setDatosFiltro({ ...datosFiltro, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (reload) {
      refetch();
    }
  }, [reload]);

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
    refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      offset: nextPage,
    });
  };

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="65vh"
      >
        <CircularProgress />
        <Typography variant="h5">Cargando</Typography>
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} altura={300} />;
  }

  return (
    <Fragment>
      <Box>
        <div className={classes.formInputFlex}>
          <Box width="25%">
            <Typography>Fecha:</Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              name="fecha_inicio"
              onChange={obtenerDatos}
              variant="outlined"
            />
          </Box>
          {/*    <Box width="100%">
                        <Typography>Fecha fin:</Typography>
                        <TextField 
                            fullWidth
                            size="small"
                            type='date'
                            onChange={obtenerDatos}
                            name="fecha_fin"
                            variant="outlined"
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>Usuario:</Typography>
                        <TextField 
                            fullWidth
                            size="small"
                            onChange={obtenerDatos}
                            name="usuario"
                            variant="outlined"
                        />
                    </Box> */}
          <Box width="25%">
            <Typography>Tipo Movimiento:</Typography>
            <Select
              className={classes.formComboBox}
              size="small"
              variant="outlined"
              name="tipo_movimiento"
              onChange={obtenerDatos}
              fullWidth
            >
              <MenuItem value="TODOS">Ninguno</MenuItem>
              <MenuItem value="CUENTA_DEPOSITO">Deposito</MenuItem>
              <MenuItem value="CUENTA_RETIRO">Retiro</MenuItem>
            </Select>
          </Box>
        </div>
      </Box>
      <Box p={2}>
        <Paper>
          <TableContainer className={classes.container}>
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {historialCuenta?.docs?.map((row, index) => {
                  return (
                    <RowsHistorial key={index} row={row} loading={loading} />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={historialCuenta.totalDocs}
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Box>
    </Fragment>
  );
}

function RowsHistorial({ row, loading }) {
  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <TableRow hover role="checkbox" handleClickOpen tabIndex={-1}>
      <TableCell>
        {moment(row?.fecha_movimiento.completa).format("D MMMM YYYY")}
      </TableCell>
      <TableCell>
        {row?.tipo_movimiento === "CUENTA_DEPOSITO" ||
        row?.tipo_movimiento === "ABONO_CLIENTE" ||
        row?.tipo_movimiento === "CANCELACION_ABONO_PROVEEDOR"
          ? "DEPOSITO"
          : "RETIRO"}
      </TableCell>
      <TableCell>{row?.concepto}</TableCell>
      <TableCell>
        <b style={{ fontSize: 17 }}>
          ${formatoMexico(row.montos_en_caja.monto_efectivo.monto)}
        </b>
      </TableCell>
      <TableCell>{row?.nombre_usuario_creador}</TableCell>
      <TableCell>
        Caja {row.numero_caja !== "" ? row.numero_caja : ""}
      </TableCell>
    </TableRow>
  );
}
