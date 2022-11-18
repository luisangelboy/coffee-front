import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Add } from "@material-ui/icons";
import { TextField, CircularProgress, IconButton } from "@material-ui/core";
import Done from "@material-ui/icons/Done";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { CREAR_SUBCUENTA } from "../../../../gql/Catalogos/centroCostos";
import { useMutation } from "@apollo/client";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CrearNuevaSubcuenta({
  cuenta,
  refetch,
  setCuenta,
  datosMovimiento,
  setDatosMovimiento,
}) {
  const [open, setOpen] = React.useState(false);
  const [subcuenta, setSubcuenta] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [alert, setAlert] = React.useState({
    message: "",
    status: "",
    open: false,
  });

  /* const inputRef = React.useRef(null); */

  const [crearSubcuenta] = useMutation(CREAR_SUBCUENTA);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSubcuenta("");
  };

  const handleChangeSubcuenta = (value) => setSubcuenta(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("algo");
    if (!subcuenta) return;
    try {
      setLoading(true);
      await crearSubcuenta({
        variables: {
          input: {
            subcuenta,
          },
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          idCuenta: cuenta.cuenta._id,
        },
      });
      setAlert({
        message: "Guardado",
        status: "success",
        open: true,
      });
      setCuenta({
        ...cuenta,
        subcuentas: [
          ...cuenta.subcuentas,
          { _id: "", subcuenta: subcuenta.toUpperCase() },
        ],
      });
      setDatosMovimiento({
        ...datosMovimiento,
        concepto: subcuenta.toUpperCase(),
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

  /*  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (open) {
      if (e.keyCode === 86 || e.keyCode === 67) {
        inputRef.current.focus();
      }
    }
  } */

  return (
    <div>
      <IconButton
        color="primary"
        onClick={() => handleClickOpen()}
        disabled={!cuenta.cuenta}
      >
        <Add />
      </IconButton>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Nueva Subcuenta</DialogTitle>
        <DialogContent>
          <form id="crear-subcuenta-form" onSubmit={handleSubmit}>
            <TextField
              id="subcuenta-venta"
              label="Subcuenta"
              variant="outlined"
              size="small"
              fullWidth
              onChange={(e) => handleChangeSubcuenta(e.target.value)}
              value={subcuenta}
              /* inputRef={inputRef} */
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            color="inherit"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            form="crear-subcuenta-form"
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
