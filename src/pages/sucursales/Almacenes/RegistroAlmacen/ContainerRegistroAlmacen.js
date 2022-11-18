import React, { useState, Fragment, useContext, useCallback } from "react";
import {
  Button,
  Dialog,
  TextField,
  Container,
  Typography,
  Box,
  IconButton,
  DialogTitle,
  Divider,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { CrearAlmacenContext } from "../../../../context/Almacenes/crearAlmacen";
import { useMutation, useQuery } from "@apollo/client";
import {
  REGISTRO_ALMACEN,
  ACTUALIZAR_ALMACEN,
} from "../../../../gql/Almacenes/Almacen";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import { OBTENER_USUARIOS } from "../../../../gql/Catalogos/usuarios";
import { Edit } from "@material-ui/icons";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
import { UsuarioProvider } from "../../../../context/Catalogos/usuarioContext";
import RegistroUsuario from "../../Catalogos/Usuarios/CrearUsuario";
import Add from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

export default function ContainerRegistroAlmacen({
  accion,
  datos,
  fromEmergent,
}) {
  const {
    datosAlmacen,
    setDatosAlmacen,
    error,
    setError,
    update,
    setUpdate,
  } = useContext(CrearAlmacenContext);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [CrearAlmacen] = useMutation(REGISTRO_ALMACEN);
  const [ActualizarAlmacen] = useMutation(ACTUALIZAR_ALMACEN);
  
 

  let obtenerUsuarios = [];

  const classes = useStyles();
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  // const empresa = '609eb3b4b995884dc49bbffa';
  const [open, setOpen] = useState(false);

 

  const { almacen_inicial, setAlmacenInicial } = useContext(RegProductoContext);
  const [loading, setLoading] = useState(false);

  // const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
  const  { data, refetch } = useQuery(OBTENER_USUARIOS, {
    variables: {
      sucursal: `${sesion.sucursal._id}`,
      empresa: `${sesion.empresa._id}`,
      eliminado: false,
    },
  });

  const limpiarCampos = useCallback(() => {
    setDatosAlmacen({
      nombre_almacen: "",
      id_usuario_encargado: "",
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
  }, [setDatosAlmacen]);

  const toggleModal = () => {
    setOpen(true);
    if (datos) {
      let input = {};
      if (datos.id_usuario_encargado) {
        const { id_usuario_encargado, ...datosNew } = datos;
        input = datosNew;
        input.id_usuario_encargado = id_usuario_encargado._id;
      } else {
        input = datos;
      }
      setDatosAlmacen(input);
    }
  };
  const onCloseModal = () => {
    setOpen(false);
    limpiarCampos();
  };

  const obtenerCampos = (e, child) => {
    if (e.target.name === "id_usuario_encargado") {
      setDatosAlmacen({
        ...datosAlmacen,
        [e.target.name]: child.props.user._id,
      });
      return;
    }
    setDatosAlmacen({
      ...datosAlmacen,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const obtenerCamposDireccion = (e) => {
    setDatosAlmacen({
      ...datosAlmacen,
      direccion: {
        ...datosAlmacen.direccion,
        [e.target.name]: e.target.value.toUpperCase(),
      },
    });
  };

  const saveData = async () => {
    try {
      if (!datosAlmacen.nombre_almacen) {
        setError(true);
        return;
      } else {
        if (accion === "registrar") {
          let input = {};
          let almacen_creado;
          if (datosAlmacen.id_usuario_encargado === "") {
            const { id_usuario_encargado, ...input } = datosAlmacen;
            almacen_creado = await CrearAlmacen({
              variables: {
                input,
                id: sesion.sucursal._id,
                empresa: sesion.empresa._id,
              },
            });
          } else {
            input = datosAlmacen;
            almacen_creado = await CrearAlmacen({
              variables: {
                input,
                id: sesion.sucursal._id,
                empresa: sesion.empresa._id,
              },
            });
          }

          const id_almacen = almacen_creado.data.crearAlmacen._id;
          if (refetch) {
            setAlmacenInicial({
              ...almacen_inicial,
              id_almacen,
              almacen: datosAlmacen.nombre_almacen,
            });
            refetch();
          }
        } else {
          const { id_sucursal, _id, ...input } = datosAlmacen;
         
          await ActualizarAlmacen({
            variables: {
             
              input:{
                nombre_almacen: input.nombre_almacen,
                id_usuario_encargado: input.id_usuario_encargado,
                direccion: input.direccion,
              },
              id: datosAlmacen._id,
            },
          });
        }
        setUpdate(!update);
        setAlert({ message: "¡Listo!", status: "success", open: true });
        setError(false);
        setLoading(false);
        onCloseModal();
      }
    } catch (error) {
      console.log(error)
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };


  if (data) {
    obtenerUsuarios = data.obtenerUsuarios;
  }

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      {accion === "registrar" ? (
        fromEmergent ? (
          <IconButton color="primary" onClick={toggleModal}>
            <Add />
          </IconButton>
        ) : (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={toggleModal}
            startIcon={<Add />}
          >
            AGREGAR
          </Button>
        )
      ) : (
        <IconButton onClick={toggleModal}>
          <Edit />
        </IconButton>
      )}
      <Dialog open={open} onClose={onCloseModal} fullWidth maxWidth="md">
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <Box display="flex" flexDirection="row">
          <Box style={{ width: "93%" }}>
            <DialogTitle id="form-dialog-title">Registro almacen</DialogTitle>
          </Box>
          <Box m={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={onCloseModal}
              size="large"
            >
              <CloseIcon style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </Box>
        <Container maxWidth="md">
          <div className={classes.formInputFlex}>
            <Box width="80%">
              <Typography>
                <span style={{ color: "red" }}>* </span>
                <b>Nombre Almacen</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error}
                name="nombre_almacen"
                id="form-producto-codigo-barras"
                variant="outlined"
                value={datosAlmacen.nombre_almacen}
                /* helperText="Incorrect entry." */
                onChange={obtenerCampos}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
            <Box width="100%" display="flex" flexDirection="row">
              <Box width="70%">
                <Typography>
                  <b>Encargado de almacen</b>
                </Typography>
                <FormControl fullWidth size="small" variant="outlined">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="id_usuario_encargado"
                    /* value={
                      datosAlmacen.id_usuario_encargado
                        ? datosAlmacen.id_usuario_encargado
                        : ""
                    } */
                    renderValue={(value) => value}
                    onChange={obtenerCampos}
                  >
                    {obtenerUsuarios?.map((user, index) => (
                      <MenuItem key={index} value={user.nombre} user={user}>
                        {user.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box mt={2} width="10%">
                <UsuarioProvider>
                  <RegistroUsuario
                    accion="registrar"
                    fromEmergent={true}
                    refetch={refetch}
                  />
                </UsuarioProvider>
              </Box>
              <Box width="35%">
                <Typography>
                  <b>Sucursal</b>
                </Typography>
                <Typography style={{ marginTop: "7px" }}>
                  {sesion.sucursal.nombre_sucursal}
                </Typography>
              </Box>
            </Box>
          </div>

          <Box mt={2}>
            <Typography>
              <b>Domicilio</b>
            </Typography>
            <Divider />
          </Box>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <Typography>
                <b>Calle</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.calle}
                name="calle"
                variant="outlined"
                value={datosAlmacen.direccion.calle}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
            <Box width="100%">
              <Typography>
                <b>No. exterior</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.no_ext}
                name="no_ext"
                variant="outlined"
                value={datosAlmacen.direccion.no_ext}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
            <Box width="100%">
              <Typography>
                <b>No. interior </b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.no_int}
                name="no_int"
                variant="outlined"
                value={datosAlmacen.direccion.no_int}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
          </div>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <Typography>
                <b>Codigo Postal</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                // error={error && !datosAlmacen.direccion.codigo_postal}
                name="codigo_postal"
                variant="outlined"
                value={datosAlmacen.direccion.codigo_postal}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
            <Box width="100%">
              <Typography>
                <b>Colonia</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.colonia}
                name="colonia"
                variant="outlined"
                value={datosAlmacen.direccion.colonia}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
            <Box width="100%">
              <Typography>
                <b>Municipio</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.municipio}
                name="municipio"
                variant="outlined"
                value={datosAlmacen.direccion.municipio}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
          </div>
          <div className={classes.formInputFlex}>
            <Box width="100%">
              <Typography>
                <b>Localidad</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.localidad}
                name="localidad"
                variant="outlined"
                value={datosAlmacen.direccion.localidad}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
            <Box width="100%">
              <Typography>
                <b>Estado</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                // error={error && !datosAlmacen.direccion.estado}
                name="estado"
                variant="outlined"
                value={datosAlmacen.direccion.estado}
                inputProps={{ style: { textTransform: "uppercase" } }}
                onChange={obtenerCamposDireccion}
              />
            </Box>
            <Box width="100%">
              <Typography>
                <b>País</b>
              </Typography>
              <TextField
                fullWidth
                size="small"
                //  error={error && !datosAlmacen.direccion.pais}
                name="pais"
                variant="outlined"
                value={datosAlmacen.direccion.pais}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Box>
          </div>
          <Box m={1} display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={saveData}
            >
              Guardar
            </Button>
          </Box>
        </Container>
      </Dialog>
    </Fragment>
  );
}
