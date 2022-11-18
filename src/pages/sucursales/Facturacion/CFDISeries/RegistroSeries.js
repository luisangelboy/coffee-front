import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Close, Done } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";
import { CREAR_SERIE } from "../../../../gql/Facturacion/Facturacion";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistroSeries({ refetch }) {
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState({ folio: "", serie: "", default: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [loading, setLoading] = useState(false);

  const [crearSerieCFDI] = useMutation(CREAR_SERIE);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDatos({ folio: "", serie: "", default: false });
  };

  const obtenerDatosSeries = (e) => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: value,
    });
  };

  const obtenerPredeterminado = (e) => {
    const { name, checked } = e.target;
    setDatos({
      ...datos,
      [name]: checked,
    });
  };

  const guardarDatosBD = async () => {
    if (!datos.folio || !datos.serie) return;

    try {
      setLoading(true);
      const result = await crearSerieCFDI({
        variables: {
          input: {
            serie: datos.serie,
            folio: parseInt(datos.folio),
            default: datos.default,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          },
        },
      });
      setAlert({
        message: `¡Listo! ${result.data.crearSerieCFDI.message}`,
        status: "success",
        open: true,
      });
      refetch();
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      console.log(error);
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={() => handleClickOpen()}
          color="primary"
          variant="contained"
          size="large"
          startIcon={<Add />}
        >
          Nueva serie
        </Button>
      </Box>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <DialogTitle>Registrar nueva serie</DialogTitle>
        <DialogContent>
          <Box width="100%">
            <Typography>Serie para CDFI:</Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                name="serie"
                onChange={obtenerDatosSeries}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
          </Box>
          <Box width="100%">
            <Typography>Folio Inicial:</Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                name="folio"
                onChange={obtenerDatosSeries}
              />
            </Box>
          </Box>
          <FormControlLabel
            style={{ marginTop: 8 }}
            control={
              <Checkbox
                checked={datos.default}
                onChange={obtenerPredeterminado}
                name="default"
              />
            }
            label="Serie predeterminada"
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button startIcon={<Close />} onClick={() => handleClose()}>
            Cancelar
          </Button>
          <Button
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <Done />}
            disabled={!datos.serie || !datos.folio || loading}
            onClick={() => guardarDatosBD()}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
