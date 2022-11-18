import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Add } from "@material-ui/icons";
import { CircularProgress, IconButton, TextField } from "@material-ui/core";
import Done from "@material-ui/icons/Done";
import { CREAR_CUENTA } from "../../../../gql/Catalogos/centroCostos";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearNuevaCuenta({ refetch }) {
  const [open, setOpen] = React.useState(false);
  const [cuenta, setCuenta] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: "",
    status: "",
    open: false,
  });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [crearCuenta] = useMutation(CREAR_CUENTA);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCuenta = (value) => setCuenta(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cuenta) return;
    try {
      setLoading(true);
      await crearCuenta({
        variables: {
          input: {
            cuenta,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          },
        },
      });
      setAlert({
        message: "Guardado",
        status: "success",
        open: true,
      });
      setLoading(false);
      refetch();
      handleClose();
    } catch (error) {
      setLoading(false);
      if (error.message) {
        setAlert({
          message: error.message,
          status: "error",
          open: true,
        });
      }
      setAlert({
        message: "Hubo un error",
        status: "error",
        open: true,
      });
    }
  };

  return (
    <div>
      <IconButton color="primary" onClick={handleClickOpen}>
        <Add />
      </IconButton>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Nueva cuenta</DialogTitle>
        <DialogContent>
          <form id="crear-cuenta-form" onSubmit={handleSubmit}>
            <TextField
              label="Cuenta"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => handleChangeCuenta(e.target.value)}
              value={cuenta}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            form="crear-cuenta-form"
            type="submit"
            color="primary"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Done />
              )
            }
            disabled={loading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
