import React, { useEffect, useState, Fragment } from "react";
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
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close, Delete, Edit } from "@material-ui/icons";

import { useMutation } from "@apollo/client";
import { ELIMINAR_TALLA } from "../../../../gql/Catalogos/tallas";
import SnackBarMessages from "../../../../components/SnackBarMessages";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "50vh",
  },
}));

export default function TablaTallas({
  tipo,
  datos,
  toUpdate,
  setToUpdate,
  setValue,
  refetch,
  isOnline,
}) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();
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
        return datos.talla.toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, datos]);

  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
        <TextField
          fullWidth
          placeholder="Buscar..."
          variant="outlined"
          size="small"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Box>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell>{tipo === "ROPA" ? "Talla" : "Número"}</TableCell>
                {sesion.accesos.catalogos.tallas_numeros.editar ===
                false ? null : (
                  <TableCell padding="normal">Editar</TableCell>
                )}
                {sesion.accesos.catalogos.tallas_numeros.eliminar ===
                false ? null : (
                  <TableCell padding="normal">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {productosFiltrados.map((row, index) => (
                <RowsRender
                  key={index}
                  row={row}
                  setAlert={setAlert}
                  tipo={tipo}
                  toUpdate={toUpdate}
                  setToUpdate={setToUpdate}
                  setValue={setValue}
                  refetch={refetch}
                  isOnline={isOnline}
                />
              ))}
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
  tipo,
  toUpdate,
  setToUpdate,
  setValue,
  refetch,
  isOnline,
}) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => setOpenModal(!openModal);
  const [eliminarTalla] = useMutation(ELIMINAR_TALLA);

  const handleDelete = async () => {
    try {
      const resp = await eliminarTalla({
        variables: {
          id: row._id,
          input: {
            tipo: tipo,
            talla: "",
          },
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });

      let msgAlert = {
        message: resp.data.eliminarTalla.message,
        status: "success",
        open: true,
      };
      setAlert(msgAlert);
      refetch();
      handleModal();
    } catch (error) {
      handleModal();
      setAlert({ message: error.message, status: "error", open: true });
    }
  };

  const onUpdate = (dato) => {
    if (!dato) {
      setToUpdate("");
      setValue("");
      return;
    }
    setToUpdate(dato._id);
    setValue(dato.talla);
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        tabIndex={-1}
        selected={toUpdate === row._id ? true : false}
      >
        <TableCell>
          <Typography>
            <b>{row.talla}</b>
          </Typography>
        </TableCell>
        {sesion.accesos.catalogos.tallas_numeros.editar === false ? null : (
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
        {sesion.accesos.catalogos.tallas_numeros.eliminar === false ? null : (
          <TableCell padding="checkbox">
            <Modal
              handleModal={handleModal}
              openModal={openModal}
              handleDelete={handleDelete}
              isOnline={isOnline}
            />
          </TableCell>
        )}
      </TableRow>
    </Fragment>
  );
};

const Modal = ({ handleModal, openModal, handleDelete, isOnline }) => {
  return (
    <div>
      <IconButton disabled={!isOnline} color="secondary" onClick={handleModal}>
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
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
