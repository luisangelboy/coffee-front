import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { FacturacionCtx } from "../../../../context/Facturacion/facturacionCtx";
import { factura_initial_state } from "./initial_factura_states";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelarFactura({ open, setOpen, handleCloseFactura }) {
  const {
    setDatosFactura,
    setCodigoPostal,
    setProductos,
    setVentaFactura,
    setCPValido,
    setError,
  } = useContext(FacturacionCtx);

  const limpiarCampos = () => {
    setDatosFactura(factura_initial_state);
    setVentaFactura(null);
    setProductos([]);
    setCodigoPostal("");
    setCPValido(false);
    setError({ status: false, message: "" });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelar = () => {
    limpiarCampos();
    handleClose();
    handleCloseFactura();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
      >
        <DialogTitle>{"¿Estás seguro de cancelar esta factura?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cerrar</Button>
          <Button onClick={() => cancelar()} color="primary">
            Cancelar Factura
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
