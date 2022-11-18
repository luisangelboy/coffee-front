import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogContent,
  Container,
} from "@material-ui/core";
import {
  Slide,
  Typography,
  Toolbar,
  AppBar,
  Divider,
  DialogActions,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FcNook } from "react-icons/fc";
import { useMutation, useQuery } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import ErrorPage from "../../../../components/ErrorPage";
import {
  OBTENER_DATOS_SUCURSAL,
  ACTUALIZAR_SUCURSAL,
} from "../../../../gql/Empresa/sucursales";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
  subtitle: {
    marginLeft: "10px",
    width: "100%",
  },
  require: {
    "& span": {
      color: "red",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DatosSucursal() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();
  const [loadingPage, setLoadingPage] = React.useState(false);
  const [bloqueo] = useState(
    sesion.accesos.mi_empresa.datos_empresa.editar === false ? true : false
  );
  const [open, setOpen] = React.useState(false);
  const [errorPage, setErrorPage] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState(false);

  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const [actualizarSucursal] = useMutation(ACTUALIZAR_SUCURSAL);

  /* Queries */
  const { loading, data, refetch, error } = useQuery(OBTENER_DATOS_SUCURSAL, {
    variables: { id: sesion.sucursal._id },
  });

  const [sucursalDatos, setSucursalDatos] = useState({
    nombre_sucursal: "",
    descripcion: "",
    telefono: "",
    direccion: {
      calle: "",
      no_ext: "",
      no_int: "",
      codigo_postal: "",
      colonia: "",
      municipio: "",
      localidad: "",
      estado: "",
      pais: "",
    },
  });

  useEffect(() => {
    try {
      refetch();
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  }, [refetch]);
  useEffect(() => {
    try {
      setLoadingPage(loading);
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  }, [loading]);
  useEffect(() => {
    try {
      if (data !== undefined) {
        setSucursalDatos(data.obtenerDatosSucursal[0]);
      }
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [data, setSucursalDatos]);
  useEffect(() => {
    try {
      setErrorPage(error);
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [error]);

  const actEmp = async () => {
    if (!sucursalDatos.nombre_sucursal || !sucursalDatos.descripcion) {
      setErrorForm(true);
      return;
    }
    try {
      setLoadingPage(true);
      const {
        _id,
        usuario_sucursal,
        cuenta_sucursal,
        ...input
      } = sucursalDatos;
      await actualizarSucursal({
        variables: {
          id: sesion.sucursal._id,
          input,
        },
      });

      setLoadingPage(false);
      setAlert({
        message: "Se han actualizado correctamente los datos.",
        status: "success",
        open: true,
      });
      setErrorForm(false);
    } catch (errorCatch) {
      console.log(errorCatch);
      if (errorCatch.networkError) {
        console.log(errorCatch.networkError.result);
      } else if (errorCatch.graphQLErrors) {
        console.log(errorCatch.graphQLErrors);
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoadingPage(false);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const obtenerCampos = (e) => {
    console.log(e.target.value);
    setSucursalDatos({
      ...sucursalDatos,
      [e.target.name]: e.target.value,
    });
  };
  const obtenerCamposDireccion = (e) => {
    setSucursalDatos({
      ...sucursalDatos,
      direccion: {
        ...sucursalDatos.direccion,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcNook className={classes.icon} />
          </Box>
          Datos de sucursal
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <BackdropComponent loading={loadingPage} setLoading={setLoadingPage} />

        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Datos
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {errorPage ? (
            <ErrorPage error={errorPage} />
          ) : (
            <Container style={{ marginTop: 8 }}>
              <Grid container spacing={3} className={classes.require}>
                <Grid item md={4} flexdirection="row">
                  <Box>
                    <Typography>
                      <b>
                        <span>* </span>Nombre de sucursal
                      </b>
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      type="text"
                      size="small"
                      error={errorForm && !sucursalDatos.nombre_sucursal}
                      name="nombre_sucursal"
                      variant="outlined"
                      value={
                        sucursalDatos.nombre_sucursal
                          ? sucursalDatos.nombre_sucursal
                          : ""
                      }
                      helperText={
                        errorForm ? "El campo nombre es obligatorio" : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>
                        <span>* </span>Descripción
                      </b>
                    </Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      type="text"
                      size="small"
                      error={errorForm && !sucursalDatos.descripcion}
                      name="descripcion"
                      variant="outlined"
                      value={
                        sucursalDatos.descripcion
                          ? sucursalDatos.descripcion
                          : ""
                      }
                      helperText={
                        errorForm ? "El campo nombre es obligatorio" : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box>
                  {/*  <Box>
                    <Typography>Teléfono</Typography>
                    <TextField
                      fullWidth
                      disabled={bloqueo}
                      size="small"
                      name="telefono_dueno"
                      variant="outlined"
                      value={
                        sucursalDatos.telefono_dueno
                          ? sucursalDatos.telefono_dueno
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Box> */}
                </Grid>
              </Grid>

              <Box mt={5}>
                <Typography className={classes.subtitle}>
                  <b>Domicilio</b>
                </Typography>
                <Divider />
              </Box>
              <Grid container spacing={3} className={classes.require}>
                <Grid item md={4}>
                  <Box>
                    <Typography>
                      <b>Calle</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="calle"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.calle
                          ? sucursalDatos.direccion.calle
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>Num. Ext</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="no_ext"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.no_ext
                          ? sucursalDatos.direccion.no_ext
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>Num. Int</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="no_int"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.no_int
                          ? sucursalDatos.direccion.no_int
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                </Grid>
                <Grid item md={4}>
                  <Box>
                    <Typography>
                      <b>C.P.</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="codigo_postal"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.codigo_postal
                          ? sucursalDatos.direccion.codigo_postal
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>Colonia</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="colonia"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.colonia
                          ? sucursalDatos.direccion.colonia
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>Municipio</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="municipio"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.municipio
                          ? sucursalDatos.direccion.municipio
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                </Grid>
                <Grid item md={4}>
                  <Box>
                    <Typography>
                      <b>Localidad</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="localidad"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.localidad
                          ? sucursalDatos.direccion.localidad
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>Estado</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="estado"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.estado
                          ? sucursalDatos.direccion.estado
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                  <Box>
                    <Typography>
                      <b>Pais</b>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="pais"
                      variant="outlined"
                      disabled={bloqueo}
                      value={
                        sucursalDatos.direccion.pais
                          ? sucursalDatos.direccion.pais
                          : ""
                      }
                      onChange={obtenerCamposDireccion}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          )}
        </DialogContent>
        {sesion.accesos.mi_empresa.datos_empresa.editar === false ? null : (
          <DialogActions style={{ justifyContent: "center" }}>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => actEmp()}
              color="primary"
              variant="contained"
              autoFocus
            >
              Guardar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
