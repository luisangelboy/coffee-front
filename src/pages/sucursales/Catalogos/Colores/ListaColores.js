import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close, Delete, Edit } from "@material-ui/icons";
import SnackBarMessages from "../../../../components/SnackBarMessages";

import { useMutation } from "@apollo/client";
import { ELIMINAR_COLOR } from "../../../../gql/Catalogos/colores";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "60vh",
  },
}));

export default function TablaColores({
  datos,
  toUpdate,
  setToUpdate,
  setValues,
  refetch,
  isOnline,
}) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
    open: false,
  });

  useEffect(() => {
    setProductosFiltrados(
      datos.filter((datos) => {
        return datos.nombre.toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, datos]);

  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <TextField
            fullWidth
            placeholder="Buscar..."
            variant="outlined"
            size="small"
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Box>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Color</TableCell>
                <TableCell>Nombre</TableCell>
                {sesion.accesos.catalogos.colores.editar === false ? null : (
                  <TableCell padding="default">Editar</TableCell>
                )}
                {sesion.accesos.catalogos.colores.eliminar === false ? null : (
                  <TableCell padding="default">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.map((row, index) => {
                return (
                  <RowsRender
                    key={index}
                    row={row}
                    setAlert={setAlert}
                    toUpdate={toUpdate}
                    setToUpdate={setToUpdate}
                    setValues={setValues}
                    refetch={refetch}
                    isOnline={isOnline}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const RowsRender = ({
  row,
  setAlert,
  toUpdate,
  setToUpdate,
  setValues,
  refetch,
  isOnline,
}) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleModal = () => setOpenModal(!openModal);

  const [eliminarColor] = useMutation(
    ELIMINAR_COLOR /* , {
    update(cache, { data: { eliminarColor } }) {
      try {
        const { obtenerColores } = cache.readQuery({
          query: OBTENER_COLORES,
          variables: { empresa: row.empresa._id },
        });

        cache.writeQuery({
          query: OBTENER_COLORES,
          variables: { empresa: row.empresa._id },
          data: {
            obtenerColores: {
              ...obtenerColores,
              eliminarColor,
            },
          },
        });
      } catch (error) {}
    },
  } */
  );

  const handleDelete = async () => {
    try {
      setLoading(true);
      const resp = await eliminarColor({
        variables: {
          id: row._id,
          empresa:  sesion.empresa._id,
          sucursal: sesion.sucursal._id
        },
      });
      refetch(refetch);
      setAlert({
        message: resp.data.eliminarColor.message,
        status: "success",
        open: true,
      });
      setLoading(false);
      handleModal();
    } catch (error) {
      setLoading(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  const onUpdate = (row) => {
    if (!row) {
      setToUpdate("");
      setValues({ nombre: "", hex: "" });
      return;
    }
    setToUpdate(row._id);
    setValues({ nombre: row.nombre, hex: row.hex });
  };

  return (
    <TableRow
      role="checkbox"
      tabIndex={-1}
      selected={toUpdate === row._id ? true : false}
    >
      <TableCell padding="checkbox">
        <Box width={30} height={25} bgcolor={row.hex} borderRadius="10%" />
      </TableCell>
      <TableCell>
        <Typography>
          <b>{row.nombre}</b>
        </Typography>
      </TableCell>
      {sesion.accesos.catalogos.colores.editar === false ? null : (
        <TableCell padding="checkbox">
          {toUpdate === row._id ? (
            <IconButton onClick={() => onUpdate()}>
              <Close />
            </IconButton>
          ) : (
            <IconButton disabled={!isOnline} onClick={() => onUpdate(row)}>
              <Edit />
            </IconButton>
          )}
        </TableCell>
      )}
      {sesion.accesos.catalogos.colores.eliminar === false ? null : (
        <TableCell padding="checkbox">
          <Modal
            handleModal={handleModal}
            openModal={openModal}
            handleDelete={handleDelete}
            loading={loading}
            isOnline={isOnline}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

const Modal = ({ handleModal, openModal, handleDelete, loading, isOnline }) => {
  return (
    <div>
      <IconButton color="secondary" onClick={handleModal} disabled={!isOnline}>
        <Delete />
      </IconButton>
      <Dialog open={openModal} onClose={handleModal}>
        <DialogTitle>{"¿Seguro que quieres eliminar esto?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleModal} color="primary">
            Cancelar
          </Button>
          <Button
            color="secondary"
            autoFocus
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Delete />
              )
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
