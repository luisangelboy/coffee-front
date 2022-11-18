import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import TablaTallas from "./ListaTallas";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import ErrorPage from "../../../../components/ErrorPage";

import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_TALLAS,
  CREAR_TALLAS,
  ACTUALIZAR_TALLA,
} from "../../../../gql/Catalogos/tallas";
import { cleanTypenames } from "../../../../config/reuserFunctions";
import shirtIcon from "../../../../icons/shirt.svg";
import shoesIcon from "../../../../icons/shoes.svg";
import { AccesosContext } from "../../../../context/Accesos/accesosCtx";

export default function RegistroTallas({ tipo }) {
  const { isOnline } = useContext(AccesosContext);
  const [value, setValue] = useState("");
  const [toUpdate, setToUpdate] = useState("");
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [loading_bd, setLoadingBD] = useState({ loading: false, tipo: "" });

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_TALLAS, {
    variables: { empresa: sesion.empresa._id, tipo },
    fetchPolicy: "network-only"
  });
  /* Mutations */
  const [crearTalla] = useMutation(CREAR_TALLAS);
  const [actualizarTalla] = useMutation(ACTUALIZAR_TALLA);

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

  const { obtenerTallas } = data;

  const guardarDatosBD = async (e) => {
    e.preventDefault();
    if (!value) {
      return;
    }
    setLoadingBD({ loading: true, tipo });
    let resp;
    try {
      const nueva_talla = value;
      if (toUpdate) {
        if (sesion.accesos.catalogos.tallas_numeros.editar === false) {
          return setAlert({
            message: "Lo sentimos no tienes autorización para esta acción",
            status: "error",
            open: true,
          });
        } else {
          const talla_actualizada = cleanTypenames(nueva_talla);
          resp = await actualizarTalla({
            variables: {
              input: {
                talla: talla_actualizada,
                tipo,
              },
              id: toUpdate,
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id,
            },
          });
        }
      } else {
        if (sesion.accesos.catalogos.tallas_numeros.agregar === false) {
          return setAlert({
            message: "Lo sentimos no tienes autorización para esta acción",
            status: "error",
            open: true,
          });
        } else {
          resp = await crearTalla({
            variables: {
              input: {
                talla: nueva_talla,
                tipo,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            },
          });
        }
      }
      refetch();
      setValue("");
      setToUpdate("");
      setLoadingBD({ loading: false, tipo: "" });
      let msgAlert = toUpdate
        ? {
            message: resp.data.actualizarTalla.message,
            status: "success",
            open: true,
          }
        : {
            message: resp.data.crearTalla.message,
            status: "success",
            open: true,
          };
      setAlert(msgAlert);
    } catch (error) {
      setLoadingBD({ loading: false, tipo: "" });
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <Box>
      <SnackBarMessages alert={alert} setAlert={setAlert} />

      <Box my={2}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            {tipo === "ROPA" ? (
              <img src={shirtIcon} alt="icono tallas" style={{ width: 40 }} />
            ) : (
              <img src={shoesIcon} alt="icono numeros" style={{ width: 40 }} />
            )}
          </Grid>
          <Grid item>
            <form id="form-talla" onSubmit={guardarDatosBD}>
              <TextField
                id="outlined-error-helper-text"
                label={tipo === "ROPA" ? "Talla" : "Número"}
                variant="outlined"
                size="small"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                inputProps={{ style: { textTransform: "uppercase" } }}
                disabled={loading_bd.loading}
              />
            </form>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              size="large"
              disableElevation
              type="submit"
              onClick={guardarDatosBD}
              form="form-talla"
              disabled={
                !isOnline || (loading_bd.loading && loading_bd.tipo === tipo)
              }
              startIcon={
                loading_bd.loading && loading_bd.tipo === tipo ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <Add />
                )
              }
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Box>
      <TablaTallas
        isOnline={isOnline}
        datos={obtenerTallas}
        tipo={tipo}
        toUpdate={toUpdate}
        setToUpdate={setToUpdate}
        setValue={setValue}
        refetch={refetch}
      />
    </Box>
  );
}
