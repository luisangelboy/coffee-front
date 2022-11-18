import React, { forwardRef, Fragment, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import { CircularProgress, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
/* import SnackBarMessages from '../../../../components/SnackBarMessages'; */
import { useMutation } from "@apollo/client";
import { ELIMINAR_PRODUCTO } from "../../../../gql/Catalogos/productos";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EliminarProducto({
  datos,
  productosRefetch,
  isOnline,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  /* const [ alert, setAlert ] = useState({ message: '', status: '', open: false }); */
  const { actualizarLista, setActualizarLista, setAlert } =
    useContext(RegProductoContext);

  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO);

  const handleToggleModal = () => setOpen(!open);

  const eliminarProductoBD = async () => {
    setLoading(true);
    try {
      const result = await eliminarProducto({
        variables: {
          id: datos._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      setActualizarLista(!actualizarLista);
      productosRefetch();
      setAlert({
        message: `¡Listo! ${result.data.eliminarProducto.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
      handleToggleModal();
    } catch (error) {
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
      setLoading(false);
      handleToggleModal();
    }
  };

  console.log(isOnline);

  return (
    <Fragment>
      {/* <SnackBarMessages alert={alert} setAlert={setAlert} /> */}
      <Tooltip
        title="Solo se puede eliminar un producto si este tiene 0 en inventarios"
        arrow
      >
        <IconButton
          onClick={() => handleToggleModal()}
          disabled={!isOnline}
          color="secondary"
          /* disabled={
            datos.inventario_general && datos.inventario_general.length === 0
              ? true
              : datos.inventario_general[0].eliminado === true
              ? true
              : false
          } */
        >
          <Delete
          /* color={
              datos.inventario_general && datos.inventario_general.length === 0
                ? "disabled"
                : datos.inventario_general[0].eliminado === true
                ? "disabled"
                : "error"
            } */
          />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleToggleModal()}
        aria-labelledby="alert-dialog-delete-producto"
      >
        <DialogTitle id="alert-dialog-delete-producto">
          {"¿Estás seguro de eliminar este producto?"}
        </DialogTitle>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => handleToggleModal()} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => eliminarProductoBD()}
            color="secondary"
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : null
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
