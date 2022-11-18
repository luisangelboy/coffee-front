import React, { useState, useContext } from "react";
import { Button, Box, TextField } from "@material-ui/core";
import ListaMarcas from "./ListaMarcas";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { Add } from "@material-ui/icons";
import {
  /* OBTENER_MARCAS, */ REGISTRAR_MARCAS,
  ACTUALIZAR_MARCAS,
} from "../../../../gql/Catalogos/marcas";
import { useMutation } from "@apollo/client";
import { CreateMarcasContext } from "../../../../context/Catalogos/Marcas";
import { cleanTypenames } from "../../../../config/reuserFunctions";

export default function VistaMarcas({ isOnline }) {
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [data, setData] = useState({
    nombre_marca: "",
  });
  const [toUpdate, setToUpdate] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const { /* datosMarcas, setDatosMarcas, */ error, setError } =
    useContext(CreateMarcasContext);

  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [CrearMarca] = useMutation(REGISTRAR_MARCAS);
  const [actualzarMarcas] = useMutation(ACTUALIZAR_MARCAS);

  const obtenerDatos = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const saveData = async () => {
    try {
      if (!data.nombre_marca) {
        setError(true);
        return;
      } else {
        if (toUpdate) {
          if (sesion.accesos.catalogos.marcas.editar === false) {
            return setAlert({
              message: "¡Lo sentimos no tienes autorización para esta acción !",
              status: "error",
              open: true,
            });
          } else {
            const input = cleanTypenames(data);
            await actualzarMarcas({
              variables: {
                input: {
                  nombre_marca: input.nombre_marca,
                },
                id: toUpdate,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            });
            setData("");
          }
        } else {
          if (sesion.accesos.catalogos.marcas.agregar === false) {
            return setAlert({
              message: "¡Lo sentimos no tienes autorización para esta acción !",
              status: "error",
              open: true,
            });
          } else {
            const input = data;
            await CrearMarca({
              variables: {
                input,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            });
            setData("");
          }
        }
        setToUpdate("");
        setUpdateData(!updateData);
        setLoading(false);
        setAlert({ message: "¡Listo!", status: "success", open: true });
        setError(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") saveData();
  };

  return (
    <div>
      <BackdropComponent loading={loading} />
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <TextField
          id="outlined-error-helper-text"
          label="Nombre de marca"
          value={data.nombre_marca ? data.nombre_marca : ""}
          name="nombre_marca"
          variant="outlined"
          size="small"
          fullWidth
          inputProps={{ style: { textTransform: "uppercase" } }}
          onChange={obtenerDatos}
          error={error}
          onKeyPress={pressEnter}
        />
        <Box ml={1} />
        <Button
          color="primary"
          variant="contained"
          size="large"
          disableElevation
          onClick={saveData}
          disabled={!isOnline}
        >
          <Add />
          Guardar
        </Button>
      </Box>
      <ListaMarcas
        toUpdate={toUpdate}
        setToUpdate={setToUpdate}
        updateData={updateData}
        setData={setData}
        isOnline={isOnline}
      />
    </div>
  );
}
