import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { ELIMINAR_ALMACEN } from "../../../../gql/Almacenes/Almacen";
import { useMutation } from "@apollo/client";
import { Delete } from "@material-ui/icons";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { CircularProgress } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarAlmacen({ datos, refetch }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: "",
    status: "",
    open: false,
  });
  const [eliminarAlmacen] = useMutation(ELIMINAR_ALMACEN);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAlmacen = async () => {
    setLoading(true);
    try {
      const result = await eliminarAlmacen({
        variables: {
          id: datos._id,
        },
      });
      setLoading(false);
      setAlert({
        message: result.data.eliminarAlmacen.message,
        status: "success",
        open: true,
      });
      refetch();
      handleClose();
    } catch (error) {
      setLoading(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        handleClose();
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
      handleClose();
    }
  };

  return (
    <div>
      <IconButton color="secondary" onClick={handleClickOpen} disabled={datos.default_almacen}>
        <Delete />
      </IconButton>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="eliminarAlmacen-dialog"
      >
        <DialogTitle id="eliminarAlmacen-dialog">
          ¿Estás seguro de eliminar esto?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteAlmacen}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
