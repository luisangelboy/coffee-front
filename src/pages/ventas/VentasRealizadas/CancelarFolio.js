import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";

import { Close, Delete } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import { CANCELAR_VENTA_SUCURSAL } from "../../../gql/Ventas/ventas_generales";
import SnackBarMessages from "../../../components/SnackBarMessages";
import { AccesosContext } from "../../../context/Accesos/accesosCtx";
import { Alert } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CancelarFolio({
  venta,
  handleCloseInfoVenta,
  refetch,
  dinero_disponible,
  selected,
  view,
}) {
  const {
    reloadCancelarVenta,
    setReloadCancelarVenta,
    setAbrirPanelAcceso,
    abrirPanelAcceso,
    setDepartamentos,
  } = useContext(AccesosContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [values, setValues] = useState({
    observaciones: "",
    devolucion_efectivo: false,
    devolucion_credito: false,
  });
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const [cancelarVentasSucursal] = useMutation(CANCELAR_VENTA_SUCURSAL);

  const handleClickOpen = () => {
    if (sesion.accesos.ventas.cancelar_venta.editar === true) {
      setOpen(true);
    } else {
      if (!reloadCancelarVenta) return;
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeChecks = (e) => {
    const { name, checked } = e.target;
    setValues({
      ...values,
      [name]: checked,
    });
  };

  const handleCancelSale = async () => {
    setLoading(true);
    try {
      values.turno = {
        horario_en_turno: turnoEnCurso.horario_en_turno,
        numero_caja: parseInt(turnoEnCurso.numero_caja),
        id_caja: turnoEnCurso.id_caja,
        usuario_en_turno: {
          nombre: turnoEnCurso.usuario_en_turno.nombre,
          numero_usuario: turnoEnCurso.usuario_en_turno.numero_usuario,
          _id: sesion._id,
        },
        empresa: turnoEnCurso.empresa,
        sucursal: turnoEnCurso.sucursal,
      };
      const result = await cancelarVentasSucursal({
        variables: {
          input: values,
          empresa: venta.empresa,
          sucursal: venta.sucursal,
          folio: venta.folio,
        },
      });
      setAlert({
        message: `¡Listo! ${result.data.cancelarVentasSucursal.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
      setValues({
        devolucion_efectivo: false,
        observaciones: "",
        devolucion_credito: false,
      });
      refetch();
      handleClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.message) {
        setAlert({
          message: error.message,
          status: "error",
          open: true,
        });
      } else {
        setAlert({
          message: "Hubo un error",
          status: "error",
          open: true,
        });
      }
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  const verificarPermisos = () => {
    if (sesion.accesos.ventas.cancelar_venta.editar === true) {
      handleClickOpen();
    } else {
      setAbrirPanelAcceso(!abrirPanelAcceso);
      setDepartamentos({
        departamento: "ventas",
        subDepartamento: "cancelar_venta",
        tipo_acceso: "editar",
      });
    }
  };

  let seleccionado = "";
  if (view === "table") {
    seleccionado = selected;
  }

  useEffect(() => {
    if (reloadCancelarVenta === true && seleccionado._id === venta._id) {
      handleClickOpen();
      setReloadCancelarVenta(false);
    }
  }, [reloadCancelarVenta]);

  return (
    <div>
      {handleCloseInfoVenta ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => verificarPermisos()}
          startIcon={<Close />}
          disabled={venta.status === "CANCELADO" || venta.factura.length ? true : false}
        >
          Cancelar venta
        </Button>
      ) : (
        <IconButton
          size="small"
          color="secondary"
          onClick={() => verificarPermisos()}
          disabled={venta.status === "CANCELADO"}
        >
          <Delete />
        </IconButton>
      )}
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Cancelar venta</Typography>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}
            >
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {venta.factura.length ? (
            <Alert severity="info">Una venta facturada no se puede hacer devolucion de dinero</Alert>
          ) : null}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.devolucion_credito}
                  onChange={handleChangeChecks}
                  name="devolucion_credito"
                  disabled={!venta.credito || venta.factura.length ? true : false}
                />
              }
              label="Realizar devolucion de crédito"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.devolucion_efectivo}
                  onChange={handleChangeChecks}
                  name="devolucion_efectivo"
                  disabled={
                    venta.montos_en_caja.monto_efectivo.monto >
                    dinero_disponible || venta.factura.length ? true : false
                  }
                />
              }
              label="Realizar devolucion de dinero"
            />
            <Box my={2}>
              <Container maxWidth="xs">
                <Box mb={1}>
                  <Typography>Devolución en:</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ width: "120px" }}>Efectivo</Typography>
                    <Box mr={1} />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled
                      value={venta.montos_en_caja.monto_efectivo.monto}
                      style={{ width: "150px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ width: "120px" }}>
                      T. Crédito
                    </Typography>
                    <Box mr={1} />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled
                      value={venta.montos_en_caja.monto_tarjeta_credito.monto}
                      style={{ width: "150px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ width: "120px" }}>
                      M. Electrónico
                    </Typography>
                    <Box mr={1} />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled
                      value={venta.montos_en_caja.monto_monedero.monto}
                      style={{ width: "150px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ width: "120px" }}>
                      Transferencia
                    </Typography>
                    <Box mr={1} />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled
                      value={venta.montos_en_caja.monto_transferencia.monto}
                      style={{ width: "150px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ width: "120px" }}>Cheques</Typography>
                    <Box mr={1} />
                    <TextField
                      variant="standard"
                      size="small"
                      disabled
                      value={venta.montos_en_caja.monto_cheques.monto}
                      style={{ width: "150px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Container>
            </Box>
            <TextField
              label="Observaciones"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={values.observaciones}
              onChange={(e) =>
                setValues({ ...values, observaciones: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Salir
          </Button>
          <Button
            onClick={handleCancelSale}
            color="secondary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Cancelar Venta
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
