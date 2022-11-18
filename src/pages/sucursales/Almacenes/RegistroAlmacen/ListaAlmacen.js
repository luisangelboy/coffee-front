import React, { useEffect, useContext } from "react";
import {
  Paper,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
} from "@material-ui/core/";
import ErrorPage from "../../../../components/ErrorPage";

import { useQuery } from "@apollo/client";
import { OBTENER_ALMACENES } from "../../../../gql/Almacenes/Almacen";
import ContainerRegistroAlmacen from "./ContainerRegistroAlmacen";
import { CrearAlmacenContext } from "../../../../context/Almacenes/crearAlmacen";
import EliminarAlmacen from "./EliminarAlmacen";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  root: {
    width: "100%",
    heigth: "75%",
  },
  container: {
    maxHeight: "77vh",
    "& ::-webkit-scrollbar": {
      display: "none",
    },
  },
});

const columns = [
  { id: 1, label: "Nombre", minWidth: 100 },
  { id: 2, label: "Encargado", minWidth: 100 },
  { id: 3, label: "Sucursal", minWidth: 150 },
  { id: 13, label: "Editar", minWidth: 50, align: "right" },
  { id: 14, label: "Eliminar", minWidth: 50, align: "right" },
];

export default function ListaAlmacen() {
  const classes = useStyles();
  const { update } = useContext(CrearAlmacenContext);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_ALMACENES, {
    variables: {
      id: sesion.sucursal._id,
    },
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
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} />;
  }

  const { obtenerAlmacenes } = data;

  return (
    <Paper className={classes.root}>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="a dense table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {obtenerAlmacenes.map((row, index) => {
                return <RowsRender key={index} datos={row} refetch={refetch}  />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const RowsRender = ({ datos, refetch }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell>
        <Typography>{datos.nombre_almacen}</Typography>
      </TableCell>
      <TableCell>
        <Typography>
          {!datos.id_usuario_encargado
            ? "Sin encargado"
            : datos.id_usuario_encargado.nombre}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{datos.id_sucursal.nombre_sucursal}</Typography>
      </TableCell>
      <TableCell width={50}>
        {sesion.accesos.almacenes.almacen.editar === false ? null : (
          <ContainerRegistroAlmacen accion="actualizar" datos={datos} />
        )}
      </TableCell>
      <TableCell width={50}>
        {sesion.accesos.almacenes.almacen.eliminar === false ? null : (
          <EliminarAlmacen datos={datos} refetch={refetch} />
        )}
      </TableCell>
    </TableRow>
  );
};
