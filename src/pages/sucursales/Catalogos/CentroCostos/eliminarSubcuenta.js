import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Delete } from "@material-ui/icons";
import { ELIMINAR_SUBCUENTA } from "../../../../gql/Catalogos/centroCostos";
import { useMutation } from "@apollo/client";

export default function EliminarSubcuenta({
  idCuenta,
  subcuenta,
  refetch,
  setAlert,
  isOnline,
}) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [eliminarSubcuenta] = useMutation(ELIMINAR_SUBCUENTA);
 
  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteSubCuenta = async () => {
    setLoading(true);
    try {
      await eliminarSubcuenta({
        variables: {
          idCuenta,
          idSubcuenta: subcuenta._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      setLoading(false);
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      handleClose();
    } catch (error) {
      setLoading(false);
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <Fragment>
      <IconButton
        color="secondary"
        onClick={handleClickOpen}
        onFocus={(event) => event.stopPropagation()}
        disabled={!isOnline}
      >
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Se eliminará esta cuenta</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancelar
          </Button>
          <Button
            onClick={() => deleteSubCuenta()}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
