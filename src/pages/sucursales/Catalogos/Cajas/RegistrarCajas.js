import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useMutation, useQuery } from "@apollo/client";
import TablaCajas from "./ListaCajas";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { CREAR_CAJA, OBTENER_CAJAS } from "../../../../gql/Cajas/cajas";

export default function RegistroCajas({ isOnline }) {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  let obtenerCajasSucursal = [];
  /* Mutation */
  const [crearCaja] = useMutation(CREAR_CAJA);

  /* Queries */
  const { data, refetch } = useQuery(OBTENER_CAJAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
  });
  const nuevaCaja = async () => {
    try {
      setLoading(true);
      await crearCaja({
        variables: {
          input: {
            usuario_creador: sesion._id,
            numero_usuario_creador: sesion.numero_usuario,
            nombre_usuario_creador: sesion.nombre,
          },
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };

  if (data) {
    obtenerCajasSucursal = data.obtenerCajasSucursal;
  }

  return (
    <Box>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Box display="flex" justifyContent="flex-end" my={2}>
        {sesion.accesos.catalogos.cajas.agregar === false ? null : (
          <Button
            color="primary"
            variant="contained"
            size="large"
            disableElevation
            onClick={() => nuevaCaja()}
            disabled={loading || !isOnline}
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : <Add />
            }
          >
            Agregar
          </Button>
        )}
      </Box>
      <TablaCajas
        obtenerCajasSucursal={obtenerCajasSucursal}
        setAlert={setAlert}
        refetch={refetch}
        isOnline={isOnline}
      />
    </Box>
  );
}
