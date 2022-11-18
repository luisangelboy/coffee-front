import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Box, Button, CircularProgress, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import ListaServicios from "./ListaServicios";
import {
  REGISTRAR_CONTABILIDAD,
  ACTUALIZAR_CONTABILIDAD,
} from "../../../../gql/Catalogos/contabilidad";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { cleanTypenames } from "../../../../config/reuserFunctions";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  flexGrow: {
    flexGrow: 1,
  },
});

export default function RegistroServicios() {
  const classes = useStyles();
  const [updateData, setUpdateData] = useState(false);
  const [data, setData] = useState({
    nombre_servicio: "",
  });
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [error, setError] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [accion, setAccion] = useState(true);
  const [idService, setIdService] = useState("");
  const [loading, setLoading] = useState(false);

  const [CrearContabilidad] = useMutation(REGISTRAR_CONTABILIDAD);
  const [ActualizarContabilidad] = useMutation(ACTUALIZAR_CONTABILIDAD);

  const handleChangeInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!data.nombre_servicio) return
    try {
      setLoading(true);
      if (!data.nombre_servicio) {
        setError(true);
        return;
      } else {
        const input = data;
        if (accion) {
          if (sesion.accesos.catalogos.contabilidad.agregar === false) {
            return setAlert({
              message: "¡Lo sentimos no tienes autorización para esta acción!",
              status: "error",
              open: true,
            });
          } else {
            await CrearContabilidad({
              variables: {
                input,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
                usuario: sesion._id,
              },
            });
          }
        } else {
          if (sesion.accesos.catalogos.contabilidad.editar === false) {
            return setAlert({
              message: "¡Lo sentimos no tienes autorización para esta acción!",
              status: "error",
              open: true,
            });
          } else {
            const inputActualizado = cleanTypenames(input);
            await ActualizarContabilidad({
              variables: {
                input: inputActualizado,
                id: idService,
              },
            });
            setAccion(true);
          }
        }
        setAlert({ message: "¡Listo!", status: "success", open: true });
        setData({ nombre_servicio: "" });
        setUpdateData(!updateData);
        setIdService("");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Typography>
        <b>Tipo de Servicio</b>
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <form id="form-contabilidad" onSubmit={handleSubmit}>
          <TextField
            error={error}
            id="outlined-error-helper-text"
            variant="outlined"
            size="small"
            name="nombre_servicio"
            value={data.nombre_servicio}
            onChange={handleChangeInput}
            inputProps={{
              style: { textTransform: "uppercase", width: "400px" },
            }}
            disabled={loading}
          />
        </form>
        <Box ml={1} />
        <Button
          color="primary"
          variant="contained"
          size="large"
          type="submit"
          form="form-contabilidad"
          disableElevation
          startIcon={
            loading ? <CircularProgress color="inherit" size={20} /> : <Add />
          }
        >
          Guardar
        </Button>
      </Box>
      <ListaServicios
        setData={setData}
        idService={idService}
        setIdService={setIdService}
        setAccion={setAccion}
        updateData={updateData}
        setAlert={setAlert}
      />
    </div>
  );
}
