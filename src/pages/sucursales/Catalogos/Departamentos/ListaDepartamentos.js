import React, { useState, useEffect, useContext } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
} from "@material-ui/core/";

import { Delete, Edit, Close } from "@material-ui/icons";

import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_DEPARTAMENTOS,
  ELIMINAR_DEPARTAMENTO,
} from "../../../../gql/Catalogos/departamentos";
// import ContainerRegistroAlmacen from './RegistroDepartamento';
import { CreateDepartamentosContext } from "../../../../context/Catalogos/Departamentos";
import ErrorPage from "../../../../components/ErrorPage";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "55vh",
  },
}));

export default function TablaDepartamentos({ isOnline }) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let obtenerDepartamentos = [];
  const { update, setData } = useContext(CreateDepartamentosContext);

  /* Queries */
  const { data, loading, error, refetch } = useQuery(OBTENER_DEPARTAMENTOS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
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

  if (data) {
    obtenerDepartamentos = data.obtenerDepartamentos;
  }

  return (
    <div className={classes.root}>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Departamentos</TableCell>
                {sesion.accesos.catalogos.departamentos.editar ===
                false ? null : (
                  <TableCell padding="default">Editar</TableCell>
                )}
                {sesion.accesos.catalogos.departamentos.eliminar ===
                false ? null : (
                  <TableCell padding="default">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerDepartamentos.map((row, index) => {
                return (
                  <ListaDepartamentosRender
                    key={index}
                    row={row}
                    setData={setData}
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

const ListaDepartamentosRender = ({ row, setData, refetch, isOnline }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { setAccion, setIdDepartamento, idDepartamento } = useContext(
    CreateDepartamentosContext
  );

  const handleCancel = () => {
    setIdDepartamento("");
    setAccion(true);
    setData({
      nombre_departamentos: "",
    });
  };

  const handleEdit = () => {
    setIdDepartamento(row._id);
    setAccion(false);
    setData({
      nombre_departamentos: row.nombre_departamentos,
    });
  };

  return (
    <TableRow
      role="checkbox"
      tabIndex={-1}
      selected={idDepartamento === row._id}
    >
      <TableCell>{row.nombre_departamentos}</TableCell>
      {sesion.accesos.catalogos.departamentos.editar === false ? null : (
        <TableCell padding="checkbox">
          {idDepartamento === row._id ? (
            <IconButton onClick={() => handleCancel()}>
              <Close />
            </IconButton>
          ) : (
            <IconButton disabled={!isOnline} onClick={() => handleEdit()}>
              <Edit />
            </IconButton>
          )}
        </TableCell>
      )}
      {sesion.accesos.catalogos.departamentos.eliminar === false ? null : (
        <TableCell padding="checkbox">
          <DeleteDepartamento
            isOnline={isOnline}
            data={row}
            refetch={refetch}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

const DeleteDepartamento = ({ data, refetch, isOnline }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState();
  const handleModal = () => setOpen(!open);
  const { setAlert } = useContext(CreateDepartamentosContext);

  const [eliminarDepartamento] = useMutation(ELIMINAR_DEPARTAMENTO);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const resultado = await eliminarDepartamento({
        variables: {
          id: data._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });

      if (resultado.data.eliminarDepartamento.message === "false") {
        setAlert({
          message: "Departamento eliminado",
          status: "success",
          open: true,
        });
      } else {
        setAlert({
          message: resultado.data.eliminarDepartamento.message,
          status: "error",
          open: true,
        });
      }

      refetch();
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };
  return (
    <div>
      <IconButton
        color="secondary"
        disabled={!isOnline}
        onClick={() => {
          handleModal();
        }}
      >
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleModal}>
        <DialogTitle>{"¿Seguro que quieres eliminar esto?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleModal} color="primary">
            Cancelar
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={handleDelete}
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
