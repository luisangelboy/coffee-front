import React, { Fragment, useContext, useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Divider,
  Avatar,
  InputAdornment,
  IconButton,
  Button,
} from "@material-ui/core";
import { TextField, Typography, Grid } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
import { Cached, DeleteOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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
  input: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  title: {
    fontWeight: "500",
    "& span": {
      color: "red",
    },
  },
}));

export default function RegistrarInfoBasica({ tipo, accion }) {
  const classes = useStyles();
  const { cliente, setCliente, error } = useContext(ClienteCtx);
  const [preview, setPreview] = useState("");

  //dropzone
  const onDrop = useCallback(
    (acceptedFiles) => {
      let reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = function () {
        let image = reader.result;
        setPreview(image);
      };
      setCliente({
        ...cliente,
        imagen: acceptedFiles[0],
      });
    },
    [cliente, setCliente]
  );

  const removerImagen = () => {
    setCliente({
      ...cliente,
      imagen: "",
    });
    setPreview("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const obtenerCampos = (e) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      [name]: value,
    });
  };
  const obtenerCamposDireccion = (e) => {
    const { name, value } = e.target;
    setCliente({
      ...cliente,
      direccion: { ...cliente.direccion, [name]: value },
    });
  };

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const clave_cliente = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setCliente({
      ...cliente,
      clave_cliente,
    });
  };

  return (
    <Fragment>
      <Grid container className={classes.input}>
        <Grid
          item
          md={3}
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "8px",
            flexDirection: "column",
          }}
        >
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
                src={`${cliente.imagen}`}
              />
            )}
          </Box>
          <Box>
            <Button
              color="secondary"
              size="medium"
              onClick={removerImagen}
              startIcon={<DeleteOutline />}
            >
              Remover imagen
            </Button>
          </Box>
        </Grid>
        <Grid item md={9} xs={12}>
          <Grid container spacing={2}>
            {accion === "registrar" ? null : (
              <Grid item md={3} xs={12}>
                <Typography className={classes.title}>N. Cliente</Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="numero_cliente"
                  variant="outlined"
                  value={cliente.numero_cliente ? cliente.numero_cliente : ""}
                  onChange={obtenerCampos}
                  disabled
                  type="number"
                />
              </Grid>
            )}
            <Grid item md={accion === "registrar" ? 12 : 9} xs={12}>
              <Typography className={classes.title}>
                <span>* </span>Nombre{" "}
                {tipo === "CLIENTE" ? "cliente" : "proveedor"}
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.nombre_cliente}
                name="nombre_cliente"
                variant="outlined"
                value={cliente.nombre_cliente ? cliente.nombre_cliente : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCampos}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            {tipo === "CLIENTE" ? null : (
              <Grid item md={4} xs={12}>
                <Typography className={classes.title}>
                  <span>* </span>Representante
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  error={error && !cliente.representante}
                  name="representante"
                  variant="outlined"
                  value={cliente.representante ? cliente.representante : ""}
                  helperText={error ? "Campo Requerido" : ""}
                  onChange={obtenerCampos}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
              </Grid>
            )}
            {tipo !== "CLIENTE" ? null : (
              <Fragment>
                <Grid item md={tipo === "CLIENTE" ? 6 : 4} xs={12}>
                  <Typography className={classes.title}>
                    <span>* </span>Clave(Tarjeta de puntos)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    error={error && !cliente.clave_cliente}
                    name="clave_cliente"
                    variant="outlined"
                    value={cliente.clave_cliente ? cliente.clave_cliente : ""}
                    helperText={error ? "Campo Requerido" : ""}
                    onChange={obtenerCampos}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => GenCodigoBarras()}
                          >
                            <Cached />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    type="number"
                  />
                </Grid>
                <Grid item md={tipo === "CLIENTE" ? 6 : 4} xs={12}>
                  <Typography className={classes.title}>
                    Fecha nacimiento
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="fecha_nacimiento"
                    variant="outlined"
                    type="date"
                    onChange={obtenerCampos}
                    value={
                      cliente.fecha_nacimiento ? cliente.fecha_nacimiento : ""
                    }
                  />
                </Grid>
              </Fragment>
            )}
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>CURP</Typography>
              <TextField
                fullWidth
                size="small"
                name="curp"
                variant="outlined"
                value={cliente.curp ? cliente.curp : ""}
                onChange={obtenerCampos}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                <span>* </span>Email
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.email}
                name="email"
                variant="outlined"
                value={cliente.email ? cliente.email : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCampos}
              />
            </Grid>

            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                <span>* </span>Num. Telefono
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.telefono}
                name="telefono"
                variant="outlined"
                value={cliente.telefono ? cliente.telefono : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCampos}
                type="number"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>Num. Celular</Typography>
              <TextField
                fullWidth
                size="small"
                name="celular"
                variant="outlined"
                value={cliente.celular ? cliente.celular : ""}
                onChange={obtenerCampos}
                type="number"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Box my={2}>
            <Typography className={classes.title}>
              <b>Domicilio</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Calle
              </Typography>

              <TextField
                size="small"
                fullWidth
                error={error && !cliente.direccion.calle}
                name="calle"
                variant="outlined"
                value={cliente.direccion.calle ? cliente.direccion.calle : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Num. Ext
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.direccion.no_ext}
                name="no_ext"
                variant="outlined"
                value={cliente.direccion.no_ext ? cliente.direccion.no_ext : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography className={classes.title}>Num. Int</Typography>
              <TextField
                fullWidth
                size="small"
                name="no_int"
                variant="outlined"
                value={cliente.direccion.no_int ? cliente.direccion.no_int : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Código postal
              </Typography>
              <TextField
                size="small"
                fullWidth
                error={error && !cliente.direccion.codigo_postal}
                name="codigo_postal"
                variant="outlined"
                value={
                  cliente.direccion.codigo_postal
                    ? cliente.direccion.codigo_postal
                    : ""
                }
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Colonia
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.direccion.colonia}
                name="colonia"
                variant="outlined"
                value={
                  cliente.direccion.colonia ? cliente.direccion.colonia : ""
                }
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Municipio
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.direccion.municipio}
                name="municipio"
                variant="outlined"
                value={
                  cliente.direccion.municipio ? cliente.direccion.municipio : ""
                }
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>Localidad</Typography>
              <TextField
                size="small"
                name="localidad"
                variant="outlined"
                value={
                  cliente.direccion.localidad ? cliente.direccion.localidad : ""
                }
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Estado
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.direccion.estado}
                name="estado"
                variant="outlined"
                value={cliente.direccion.estado ? cliente.direccion.estado : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography className={classes.title}>
                {tipo === "CLIENTE" ? <span>* </span> : null}Pais
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={error && !cliente.direccion.pais}
                name="pais"
                variant="outlined"
                value={cliente.direccion.pais ? cliente.direccion.pais : ""}
                helperText={error ? "Campo Requerido" : ""}
                onChange={obtenerCamposDireccion}
                inputProps={{ style: { textTransform: "uppercase" } }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
}
