import React, { useState, Fragment, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Add, Done } from "@material-ui/icons";
import SnackBarMessages from "../../../../../components/SnackBarMessages";

import { useMutation } from "@apollo/client";
import { CREAR_TALLAS } from "../../../../../gql/Catalogos/tallas";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

export default function CrearTallasProducto({
  setMedidasSeleccionadas,
  refetch,
  tipo_producto
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datos_generales } = useContext(RegProductoContext);

  const [crearTalla] = useMutation(CREAR_TALLAS);

  const toggleModal = () => setOpen(!open);

  const GuardarDatosBD = async (e) => {
    e.preventDefault();
    if (!value) {
      return; 
    }
    try {
      const nueva_talla = value;
      await crearTalla({
        variables: {
          input: {
            talla: nueva_talla,
            tipo: (datos_generales.tipo_producto) ? datos_generales.tipo_producto : tipo_producto,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          },
        },
      });
      refetch();
      setMedidasSeleccionadas([nueva_talla]);
      setValue("");
      setAlert({ message: "¡Listo!", status: "success", open: true });
      toggleModal();
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <Fragment>
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" onClick={() => toggleModal()}>
          <Add /> Nueva talla
        </Button>
      </Box>
      <Dialog
        open={open}
        scroll="paper"
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            toggleModal();
          }
        }}
      >
        <DialogContent>
          <Box>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              my={2}
            >
              <form
                id="form-registro-color"
                onSubmit={(e) => GuardarDatosBD(e)}
              >
                <TextField
                  id="outlined-error-helper-text"
                  label={
                    datos_generales.tipo_producto === "ROPA"
                      ? "Talla"
                      : "Número"
                  }
                  variant="outlined"
                  size="small"
                  focused
                  fullWidth
                  value={value}
                  onChange={(e) => setValue(e.target.value.toUpperCase())}
                />
              </form>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => toggleModal()}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            form="form-registro-color"
            size="large"
            startIcon={<Done />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
