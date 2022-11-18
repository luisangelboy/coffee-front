import React, { useState, useEffect } from "react";
import {
  Paper,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core/";
import { Delete, Edit, Close } from "@material-ui/icons";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import {
  OBTENER_MARCAS,
  ELIMINAR_MARCAS,
} from "../../../../gql/Catalogos/marcas";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import ErrorPage from "../../../../components/ErrorPage";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

export default function ListaMarcas({
  updateData,
  toUpdate,
  setToUpdate,
  setData,
  isOnline,
}) {
  const classes = useStyles();
  const [alert, setAlert] = useState({
    status: "",
    message: "",
    open: false,
  });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let obtenerMarcas = [];

  const { loading, data, refetch, error } = useQuery(OBTENER_MARCAS, {
    variables: {
      empresa: sesion.empresa._id,
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, updateData]);

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

  if (data) {
    obtenerMarcas = data.obtenerMarcas;
  }

  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Paper className={classes.paper}>
        <TableContainer style={{ height: "72vh" }}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Marca</TableCell>
                {sesion.accesos.catalogos.marcas.editar === false ? null : (
                  <TableCell padding="default">Editar</TableCell>
                )}
                {sesion.accesos.catalogos.marcas.eliminar === false ? null : (
                  <TableCell padding="default">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerMarcas.map((row, index) => {
                return (
                  <RowsRender
                    key={index}
                    setAlert={setAlert}
                    refetch={refetch}
                    datos={row}
                    toUpdate={toUpdate}
                    setToUpdate={setToUpdate}
                    setData={setData}
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
  datos,
  updateData,
  toUpdate,
  setAlert,
  setToUpdate,
  setData,
  refetch,
  isOnline,
}) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => setOpenModal(!openModal);

  const [eliminarMarca] = useMutation(ELIMINAR_MARCAS);

  const handleDelete = async () => {
    try {
      const resultado = await eliminarMarca({
        variables: {
          id: datos._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      if (resultado.data.eliminarMarca.message === "false") {
        setAlert({
          message: "Marca eliminada",
          status: "success",
          open: true,
        });
      } else {
        setAlert({
          message: resultado.data.eliminarMarca.message,
          status: "error",
          open: true,
        });
      }
      refetch();
      handleModal();
    } catch (error) {
      setAlert({ message: error.message, status: "error", open: true });
    }
  };

  const onUpdate = (dato) => {
    if (!dato) {
      setToUpdate("");
      setData("");
      refetch();
      return;
    }
    refetch();
    setToUpdate(dato._id);
    setData(dato);
  };

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      selected={toUpdate === datos._id ? true : false}
    >
      <TableCell>{datos.nombre_marca}</TableCell>
      {sesion.accesos.catalogos.marcas.editar === false ? null : (
        <TableCell padding="checkbox">
          {toUpdate === datos._id ? (
            <IconButton onClick={() => onUpdate()}>
              <Close />
            </IconButton>
          ) : (
            <IconButton onClick={() => onUpdate(datos)} disabled={!isOnline}>
              <Edit />
            </IconButton>
          )}
        </TableCell>
      )}
      {sesion.accesos.catalogos.marcas.eliminar === false ? null : (
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
  );
};

//ELIMINAR DATOS DE LA TABLA
const Modal = ({ handleModal, openModal, handleDelete, isOnline }) => {
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
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
