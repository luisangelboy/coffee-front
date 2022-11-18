import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import TablaColores from "./ListaColores";
import { SketchPicker } from "react-color";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import ErrorPage from "../../../../components/ErrorPage";

import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_COLORES,
  CREAR_COLOR,
  ACTUALIZAR_COLOR,
} from "../../../../gql/Catalogos/colores";

export default function RegistroColores({ isOnline }) {
  const [color, setColor] = useState({});
  const [toUpdate, setToUpdate] = useState("");
  const [values, setValues] = useState({ nombre: "", hex: "" });
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [error_data, setError] = useState(false);
  const [loading_data, setLoading] = useState(false);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_COLORES, {
    variables: { empresa: sesion.empresa._id },
  });

  /* Mutations */
  const [crearColor] = useMutation(CREAR_COLOR);
  const [actualizarColor] = useMutation(ACTUALIZAR_COLOR);

  const handleChangeComplete = (color) => {
    setColor(color);
    setValues({
      ...values,
      hex: color.hex.toUpperCase(),
    });
  };

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

  const { obtenerColores } = data;

  const GuardarDatosBD = async (e) => {
    e.preventDefault();
    if (!values.nombre || !values.hex) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    try {
      const colores = values;
      let msg;
      if (toUpdate) {
        if (sesion.accesos.catalogos.colores.editar === false) {
          return setAlert({
            message: "¡Lo sentimos no tienes autorización para esta acción!",
            status: "error",
            open: true,
          });
        } else {
          /* const colorActualizado = cleanTypenames(colores); */
          const resp = await actualizarColor({
            variables: {
              input: {
                nombre: colores.nombre,
                hex: colores.hex,
              },
              id: toUpdate,
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id,
            },
          });
          msg = resp.data.actualizarColor.message;
        }
      } else {
        if (sesion.accesos.catalogos.colores.agregar === false) {
          return setAlert({
            message: "¡Lo sentimos no tienes autorización para esta acción!",
            status: "error",
            open: true,
          });
        } else {
          await crearColor({
            variables: {
              input: {
                nombre: colores.nombre,
                hex: colores.hex,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            },
          });
          msg = "¡Listo!. Color creado.";
        }
      }
      refetch();
      setValues({ nombre: "", hex: "" });
      setToUpdate("");
      setLoading(false);
      setAlert({ message: msg, status: "success", open: true });
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
    <Box display="flex" justifyContent="center">
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Grid container spacing={2}>
        <Grid
          item
          sm={5}
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Box>
            <SketchPicker
              color={color}
              onChangeComplete={handleChangeComplete}
            />
            <Box my={5}>
              <form id="form-colores" onSubmit={GuardarDatosBD}>
                <TextField
                  label="Nombre del color"
                  variant="outlined"
                  size="small"
                  value={values.nombre}
                  onChange={(e) =>
                    setValues({ ...values, nombre: e.target.value })
                  }
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {!values.hex ? (
                          <Box
                            border={1}
                            style={
                              error_data && !values.hex
                                ? { borderColor: "red" }
                                : { borderColor: "black" }
                            }
                            borderRadius={2}
                            height={20}
                            width={20}
                          />
                        ) : (
                          <Box
                            border={1}
                            borderRadius={2}
                            bgcolor={values.hex}
                            height={20}
                            width={20}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  error={error_data ? (!values.nombre ? true : false) : false}
                  disabled={loading_data}
                  helperText={
                    error_data
                      ? !values.nombre
                        ? "Campo obligatorio"
                        : ""
                      : ""
                  }
                />
              </form>

              <Box my={1} />
              <Button
                disabled={!isOnline || loading_data}
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                form="form-colores"
                startIcon={
                  loading_data ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <Add />
                  )
                }
              >
                {toUpdate ? "Actualizar" : "Guardar"}
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item sm={7} xs={12}>
          <TablaColores
            datos={obtenerColores}
            toUpdate={toUpdate}
            setToUpdate={setToUpdate}
            setValues={setValues}
            refetch={refetch}
            isOnline={isOnline}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
