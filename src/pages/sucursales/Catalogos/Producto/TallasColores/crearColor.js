import React, { useState, Fragment } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { Add, Done } from "@material-ui/icons";
import { SketchPicker } from "react-color";
import SnackBarMessages from "../../../../../components/SnackBarMessages";

import { useMutation } from "@apollo/client";
import { CREAR_COLOR } from "../../../../../gql/Catalogos/colores";

export default function CrearColorProducto({ refetch }) {
  const [color, setColor] = useState({});
  const [values, setValues] = useState({ nombre: "", hex: "" });
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = useState(false);

  const toggleModal = () => setOpen(!open);

  /* Mutations */
  const [crearColor] = useMutation(CREAR_COLOR);

  const handleChangeComplete = (color) => {
    setColor(color);
    setValues({
      ...values,
      hex: color.hex.toUpperCase(),
    });
  };

  const GuardarDatosBD = async (e) => {
    e.preventDefault();
    if (!values.nombre || !values.hex) {
      return;
    }
    try {
      const colores = values;
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
      refetch();
      setValues({ nombre: "", hex: "" });
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
          <Add />
          nuevo color
        </Button>
      </Box>
      <Dialog
        open={open}
        /* onClose={() => toggleModal()} */
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
            <SketchPicker
              color={color}
              onChangeComplete={handleChangeComplete}
            />
            <Box mt={2}>
              <Typography>Color seleccionado:</Typography>
              {!values.hex ? (
                <Box display="flex" justifyContent="center" width={220}>
                  <Typography color="secondary">NINGUNO</Typography>
                </Box>
              ) : (
                <Box bgcolor={values.hex} height={30} width={220} />
              )}
            </Box>
            <Box my={2}>
              <form
                id="form-registro-color"
                onSubmit={(e) => GuardarDatosBD(e)}
              >
                <TextField
                  label="Nombre del color"
                  variant="outlined"
                  size="small"
                  value={values.nombre}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      nombre: e.target.value.toUpperCase(),
                    })
                  }
                  fullWidth
                  focused
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
