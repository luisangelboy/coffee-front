import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { CANCELAR_COMPRA } from "../../../../gql/Compras/compras";
import { useMutation } from "@apollo/client";
import CircularProgres from "@material-ui/core/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelCompraConfirm({ compra, refetch }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    message: "",
    status: "",
    open: false,
  });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const isAdmin = sesion ? sesion.accesos.tesoreria.caja_principal.ver : false;

  const [cancelarCompra] = useMutation(CANCELAR_COMPRA);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelarCompraBD = async () => {
    setLoading(true);
    try {
      let turno = null;
      if (turnoEnCurso) {
        turno = {
          horario_en_turno: turnoEnCurso.horario_en_turno,
          numero_caja: turnoEnCurso ? parseInt(turnoEnCurso.numero_caja) : null,
          id_caja: turnoEnCurso.id_caja,
          id_usuario: sesion._id,
          token_turno_user: turnoEnCurso.token_turno_user,
          numero_usuario_creador: turnoEnCurso
            ? parseFloat(turnoEnCurso.usuario_en_turno.numero_usuario)
            : null,
          nombre_usuario_creador: turnoEnCurso.usuario_en_turno.nombre,
        };
      }

      const result = await cancelarCompra({
        variables: {
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          id_compra: compra._id,
          data_sesion: {
            turno,
            admin: isAdmin,
            sesion: {
              id_usuario: sesion._id,
              nombre_usuario: sesion.nombre,
              numero_usuario: sesion.numero_usuario,
            },
          },
        },
      });
      setAlert({
        message: `¡Listo! ${result.data.cancelarCompra.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
      refetch();
      handleClose();
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
    }
  };

  return (
    <div>
      <IconButton
        color="secondary"
        size="small" 
        onClick={handleClickOpen}
        disabled={compra.status && compra.status === "CANCELADO" ? true : false}
      >
        <Close />
      </IconButton>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-cancel-compra"
      >
        <DialogTitle id="alert-dialog-cancel-compra">
          {"¿Está seguro que desea cancelar esta compra?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cerrar
          </Button>
          <Button
            onClick={() => cancelarCompraBD()}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgres color="inherit" size={20} /> : null
            }
          >
            Cancelar Compra
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
