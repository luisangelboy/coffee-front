import React, { Fragment, useContext, useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useDropzone } from "react-dropzone";
import { UsuarioContext } from "../../../../context/Catalogos/usuarioContext";
import SnackBarMessages from "../../../../components/SnackBarMessages";

import { useMutation } from "@apollo/client";
import { ACTUALIZAR_USUARIO } from "../../../../gql/Catalogos/usuarios";
import VerifyUsername from "./VerifyUsername";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "500",
    "& span": {
      color: "red",
    },
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    border: "dashed 2px #000000",
  },
  avatar: {
    width: 135,
    height: 135,
    "& > .icon": {
      fontSize: 100,
    },
  },
}));

export default function FormularioUsuario({ accion }) {
  const classes = useStyles();
  const { usuario, setUsuario, error } = useContext(UsuarioContext);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //dropzone
  const onDrop = useCallback(
    (acceptedFiles) => {
      let reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = function () {
        let image = reader.result;
        setPreview(image);
      };
      setUsuario({
        ...usuario,
        imagen: acceptedFiles[0],
      });
    },
    [usuario, setUsuario]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const removerImagen = () => {
    setUsuario({
      ...usuario,
      imagen: "",
    });
    setPreview("");
  };

  const obtenerCampos = (e) => {
    const name = e.target.name;
    if (name === "numero_usuario") {
      setUsuario({
        ...usuario,
        [e.target.name]: parseInt(e.target.value),
      });
      return;
    }
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };
  const obtenerCamposDireccion = (e) => {
    setUsuario({
      ...usuario,
      direccion: { ...usuario.direccion, [e.target.name]: e.target.value },
    });
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid
          item
          md={3}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          <Box>
            <Box className={classes.avatarContainer} {...getRootProps()}>
              <input {...getInputProps()} />
              {preview ? (
                <Avatar
                  variant="square"
                  className={classes.avatar}
                  src={`${preview}`}
                />
              ) : (
                <Avatar
                  variant="square"
                  className={classes.avatar}
                  src={`${usuario.imagen}`}
                />
              )}
            </Box>
            <Box>
              <Button
                color="secondary"
                size="medium"
                onClick={removerImagen}
                startIcon={<DeleteOutlineIcon />}
              >
                Remover imagen
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography className={classes.title}>
                <span>* </span>Nombre usuario
              </Typography>
              <TextField
                fullWidth
                autoComplete="new-password"
                type="text"
                size="small"
                error={error.error && !usuario.nombre}
                name="nombre"
                variant="outlined"
                value={usuario.nombre ? usuario.nombre : ""}
                helperText={
                  error.error &&
                  error.message !== "Las contraseñas no coinciden"
                    ? error.message
                    : ""
                }
                inputProps={{ style: { textTransform: "uppercase" } }}
                onChange={obtenerCampos}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <VerifyUsername accion={accion} />
            </Grid>
            {accion === "registrar" ? (
              <Fragment>
                <Grid item xs={12} md={6}>
                  <Typography className={classes.title}>
                    <span>* </span>Contraseña
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    error={
                      error.error && !usuario.password
                        ? true
                        : error.error &&
                          error.message === "Las contraseñas no coinciden"
                        ? true
                        : false
                    }
                    name="password"
                    variant="outlined"
                  >
                    <OutlinedInput
                      autoComplete="new-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={usuario.password ? usuario.password : ""}
                      onChange={obtenerCampos}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Visibility color="primary" />
                            ) : (
                              <VisibilityOff color="primary" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>{error.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography className={classes.title}>
                    <span>* </span>Repetir contraseña
                  </Typography>
                  <FormControl
                    fullWidth
                    size="small"
                    error={
                      error.error && !usuario.password
                        ? true
                        : error.error &&
                          error.message === "Las contraseñas no coinciden"
                        ? true
                        : false
                    }
                    name="repeatPassword"
                    variant="outlined"
                  >
                    <OutlinedInput
                      name="repeatPassword"
                      type={showPassword ? "text" : "password"}
                      value={
                        usuario.repeatPassword ? usuario.repeatPassword : ""
                      }
                      onChange={obtenerCampos}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Visibility color="primary" />
                            ) : (
                              <VisibilityOff color="primary" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>{error.message}</FormHelperText>
                  </FormControl>
                </Grid>
              </Fragment>
            ) : (
              <Grid item xs={12} md={12}>
                <ActualizarPasswordModal />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography className={classes.title}>
            <span>* </span>Email
          </Typography>
          <TextField
            fullWidth
            size="small"
            error={error.error && !usuario.email}
            name="email"
            variant="outlined"
            value={usuario.email ? usuario.email : ""}
            helperText={
              error.error && error.message !== "Las contraseñas no coinciden"
                ? error.message
                : ""
            }
            onChange={obtenerCampos}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography className={classes.title}>
            <span>* </span>Num. Telefono
          </Typography>
          <TextField
            fullWidth
            size="small"
            error={error.error && !usuario.telefono}
            name="telefono"
            variant="outlined"
            value={usuario.telefono ? usuario.telefono : ""}
            helperText={
              error.error && error.message !== "Las contraseñas no coinciden"
                ? error.message
                : ""
            }
            onChange={obtenerCampos}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography className={classes.title}>Num. Celular</Typography>
          <TextField
            fullWidth
            size="small"
            name="celular"
            variant="outlined"
            value={usuario.celular ? usuario.celular : ""}
            onChange={obtenerCampos}
          />
        </Grid>
      </Grid>
      <Box my={2}>
        <Typography className={classes.title}>
          <b>Domicilio</b>
        </Typography>
        <Divider />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography className={classes.title}>Calle</Typography>
          <TextField
            size="small"
            fullWidth
            name="calle"
            variant="outlined"
            value={usuario.direccion.calle ? usuario.direccion.calle : ""}
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography className={classes.title}>Colonia</Typography>
          <TextField
            size="small"
            fullWidth
            name="colonia"
            variant="outlined"
            value={usuario.direccion.colonia ? usuario.direccion.colonia : ""}
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography className={classes.title}>Num. Ext</Typography>
          <TextField
            size="small"
            fullWidth
            name="no_ext"
            variant="outlined"
            value={usuario.direccion.no_ext ? usuario.direccion.no_ext : ""}
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography className={classes.title}>Num. Int</Typography>
          <TextField
            size="small"
            fullWidth
            name="no_int"
            variant="outlined"
            value={usuario.direccion.no_int ? usuario.direccion.no_int : ""}
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography className={classes.title}>CP</Typography>
          <TextField
            size="small"
            fullWidth
            name="codigo_postal"
            variant="outlined"
            value={
              usuario.direccion.codigo_postal
                ? usuario.direccion.codigo_postal
                : ""
            }
            onChange={obtenerCamposDireccion}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography className={classes.title}>Municipio</Typography>
          <TextField
            fullWidth
            size="small"
            name="municipio"
            variant="outlined"
            value={
              usuario.direccion.municipio ? usuario.direccion.municipio : ""
            }
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography className={classes.title}>Localidad</Typography>
          <TextField
            size="small"
            fullWidth
            name="localidad"
            variant="outlined"
            value={
              usuario.direccion.localidad ? usuario.direccion.localidad : ""
            }
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography className={classes.title}>Estado</Typography>
          <TextField
            size="small"
            fullWidth
            name="estado"
            variant="outlined"
            value={usuario.direccion.estado ? usuario.direccion.estado : ""}
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography className={classes.title}>Pais</Typography>
          <TextField
            size="small"
            fullWidth
            name="pais"
            variant="outlined"
            value={usuario.direccion.pais ? usuario.direccion.pais : ""}
            onChange={obtenerCamposDireccion}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

const ActualizarPasswordModal = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const {
    usuario,
    setUsuario,
    error,
    setError,
    update,
    setUpdate,
  } = useContext(UsuarioContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError({ error: false, message: "" });
  };

  const obtenerCampos = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const confirmarPassowrd = async () => {
    if (!usuario.password || !usuario.repeatPassword) {
      setError({ error: true, message: "Este campo es requerido" });
      return;
    }
    if (usuario.password !== usuario.repeatPassword) {
      setError({ error: true, message: "Las contraseñas no coinciden" });
      return;
    }
    setLoading(true);

    try {
      await actualizarUsuario({
        variables: {
          input: {
            password: usuario.password,
            repeatPassword: usuario.repeatPassword,
          },
          id: usuario._id,
        },
      });
      setUpdate(!update);
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
      handleClose();
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Button color="primary" variant="text" onClick={handleClickOpen}>
        Cambiar contraseña
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <DialogTitle id="alert-dialog-title">
          {"Cambiar contraseña"}
        </DialogTitle>
        <DialogContent>
          <form autocomplete="off">
            <Box width="100%">
              <Typography className={classes.title}>
                <span>* </span>Contraseña
              </Typography>
              <FormControl
                fullWidth
                size="small"
                error={
                  error.error && !usuario.password
                    ? true
                    : error.error &&
                      error.message === "Las contraseñas no coinciden"
                    ? true
                    : false
                }
                name="password"
                variant="outlined"
              >
                <OutlinedInput
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={usuario.password ? usuario.password : ""}
                  onChange={obtenerCampos}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Visibility color="primary" />
                        ) : (
                          <VisibilityOff color="primary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>{error.message}</FormHelperText>
              </FormControl>
            </Box>
            <Box width="100%">
              <Typography className={classes.title}>
                <span>* </span>Repetir contraseña
              </Typography>
              <FormControl
                fullWidth
                size="small"
                error={
                  error.error && !usuario.password
                    ? true
                    : error.error &&
                      error.message === "Las contraseñas no coinciden"
                    ? true
                    : false
                }
                name="repeatPassword"
                variant="outlined"
              >
                <OutlinedInput
                  name="repeatPassword"
                  type={showPassword ? "text" : "password"}
                  value={usuario.repeatPassword ? usuario.repeatPassword : ""}
                  onChange={obtenerCampos}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Visibility color="primary" />
                        ) : (
                          <VisibilityOff color="primary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>{error.message}</FormHelperText>
              </FormControl>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={confirmarPassowrd}
            color="primary"
            variant="contained"
            autoFocus
            endIcon={
              loading ? <CircularProgress color="inherit" size={25} /> : null
            }
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
