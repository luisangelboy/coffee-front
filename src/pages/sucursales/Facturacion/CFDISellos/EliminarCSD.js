import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Close, DeleteOutline } from "@material-ui/icons";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { ELIMINAR_SELLO_CFDI } from "../../../../gql/Facturacion/Facturacion";
import { useMutation } from "@apollo/client";

export default function EliminarSellos({ datosEmpresa, refetch }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState({
    rfc: datosEmpresa && datosEmpresa.rfc ? datosEmpresa.rfc : "",
    empresa: sesion && sesion.empresa._id ? sesion.empresa._id : "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDatos({
      rfc: sesion && datosEmpresa.rfc ? datosEmpresa.rfc : "",
      empresa: sesion && sesion.empresa._id ? sesion.empresa._id : "",
    });
  };

  const [eliminarCSD] = useMutation(ELIMINAR_SELLO_CFDI);

  const eliminarSelloCSD = async () => {
    if (!datos.rfc) return;

    try {
      setLoading(true);
      const result = await eliminarCSD({
        variables: {
          rfc: datos.rfc,
          empresa: datos.empresa,
        },
      });

      setAlert({
        message: `¡Listo! ${result.data.eliminarCSD.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
      handleClose();
      refetch();
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
          color="inherit"
          startIcon={<DeleteOutline />}
        >
          Remover CSD
        </Button>
      </Box>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={() => handleClose()}>
        <DialogTitle>Eliminar Firma Digital</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Se eliminara el CSD registrado con el RFC ${datosEmpresa.rfc}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            startIcon={<Close />}
            size="large"
            onClick={() => handleClose()}
          >
            Cancelar
          </Button>
          <Button
            startIcon={
              loading ? <CircularProgress size={20} /> : <DeleteOutline />
            }
            color="secondary"
            size="large"
            onClick={() => eliminarSelloCSD()}
            disabled={loading || !datos.rfc}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
