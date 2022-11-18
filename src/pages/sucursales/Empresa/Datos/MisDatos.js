import React, { useContext, useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Container,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Typography, Divider, DialogActions } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { useMutation, useQuery } from "@apollo/client";
import { EmpresaContext } from "../../../../context/Catalogos/empresaContext";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import ErrorPage from "../../../../components/ErrorPage";
import {
  ACTUALIZAR_EMPRESA,
  OBTENER_DATOS_EMPRESA,
} from "../../../../gql/Empresa/empresa";

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
    "& .requerido": {
      color: "red",
    },
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
    height: "150px",
    border: "dashed 2px black",
    borderRadius: "100%",
  },
  avatar: {
    width: "90%",
    height: "90%",
    "& > .icon": {
      fontSize: 100,
    },
  },
}));

export default function MisDatos(props) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();
  const [loadingPage, setLoadingPage] = React.useState(false);
  const [bloqueo] = useState(
    sesion.accesos.mi_empresa.datos_empresa.editar === false ? true : false
  );
  const [preview, setPreview] = useState("");

  const [errorPage, setErrorPage] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState(false);

  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const { empresa, update, setEmpresa, setUpdate } = useContext(EmpresaContext);

  const [actualizarEmpresa] = useMutation(ACTUALIZAR_EMPRESA);

  /* Queries */
  const { loading, data, refetch, error } = useQuery(OBTENER_DATOS_EMPRESA, {
    variables: { id: sesion.empresa._id },
  });

  const [empresaDatos, setEmpresaDatos] = useState({
    nombre_empresa: "",
    nombre_dueno: "",
    telefono_dueno: "",
    celular: "",
    correo_empresa: "",
    valor_puntos: "",
    nombre_fiscal: "",
    rfc: "",
    regimen_fiscal: "",
    curp: "",
    info_adicio: "",
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
    direccionFiscal: {
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
    datosBancarios: {
      cuenta: "",
      sucursal: "",
      clave_banco: "",
    },
    imagen: null,
    vender_sin_inventario: false,
  });
  useEffect(() => {
    try {
      refetch();
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  }, [update, refetch]);
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
        setEmpresa(data.obtenerEmpresa);
      }
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [data, setEmpresa]);
  useEffect(() => {
    try {
      setErrorPage(error);
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [error]);
  useEffect(() => {
    try {
      setEmpresaDatos({
        nombre_empresa: empresa.nombre_empresa,
        nombre_dueno: empresa.nombre_dueno,
        telefono_dueno: empresa.telefono_dueno,
        celular: empresa.celular,
        valor_puntos: empresa.valor_puntos,
        correo_empresa: empresa.correo_empresa,
        direccion: empresa.direccion,
        imagen: empresa.imagen,
        vender_sin_inventario: empresa.vender_sin_inventario,
      });
    } catch (errorCatch) {
      // console.log(errorCatch)
    }
  }, [empresa]);

  const actEmp = async () => {
    try {
      if(!empresaDatos.nombre_empresa || !empresaDatos.nombre_dueno){
        setErrorForm(true);
        return
      }
      setLoadingPage(true);
      /* const input = cleanTypenames(empresaDatos); */
      await actualizarEmpresa({
        variables: {
          id: sesion.empresa._id,
          input: empresaDatos,
        },
      });
      const empresa = { ...sesion.empresa, ...empresaDatos };
      let nueva_sesion = { ...sesion };
      nueva_sesion.empresa = empresa;
      localStorage.setItem("sesionCafi", JSON.stringify(nueva_sesion));

      setUpdate(true);
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

  const obtenerCampos = (e) => {
    try {
      let valor = e.target.value;
      if (e.target.name === "valor_puntos") {
        valor = parseFloat(valor);
      }
      setEmpresaDatos({
        ...empresaDatos,
        [e.target.name]: valor,
      });
    } catch (error) {}
  };
  const obtenerCamposDireccion = (e) => {
    setEmpresaDatos({
      ...empresaDatos,
      direccion: { ...empresaDatos.direccion, [e.target.name]: e.target.value },
    });
  };
  const handleClose = () => {
    props.setOpen(false);
  };
  //dropzone
  const onDrop = useCallback(
    (acceptedFiles) => {
      let reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = function () {
        let image = reader.result;
        setPreview(image);
      };
      setEmpresaDatos({
        ...empresaDatos,
        imagen: acceptedFiles[0],
      });
    },
    [empresaDatos, setEmpresaDatos]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const removerImagen = () => {
    setEmpresaDatos({
      ...empresaDatos,
      imagen: "",
    });
    setPreview("");
  };

  const handleChangeVenderInventario = (e) => {
    setEmpresaDatos({
      ...empresaDatos,
      vender_sin_inventario: e.target.checked,
    });
  };

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BackdropComponent loading={loadingPage} setLoading={setLoadingPage} />
      {errorPage ? (
        <ErrorPage error={errorPage} />
      ) : (
        <Container style={{ marginTop: 8 }}>
          <Grid container spacing={3} className={classes.require}>
            <Grid
              item
              md={2}
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box>
                <Box className={classes.avatarContainer} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {preview ? (
                    <Avatar className={classes.avatar} src={`${preview}`} />
                  ) : (
                    <Avatar
                      className={classes.avatar}
                      src={`${empresaDatos.imagen}`}
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
            <Grid item md={5} xs={12} className={classes.require}>
              <Box my={1}>
                <Typography>
                  <b>
                    <span className="requerido">* </span>Nombre de empresa
                  </b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  type="text"
                  size="small"
                  error={errorForm && !empresaDatos.nombre_empresa}
                  name="nombre_empresa"
                  variant="outlined"
                  value={
                    empresaDatos.nombre_empresa
                      ? empresaDatos.nombre_empresa
                      : ""
                  }
                  helperText={
                    errorForm ? "El campo nombre es obligatorio" : ""
                  }
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>
                    <span className="requerido">* </span>Nombre dueño
                  </b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  type="text"
                  size="small"
                  error={errorForm && !empresaDatos.nombre_dueno}
                  name="nombre_dueno"
                  variant="outlined"
                  value={
                    empresaDatos.nombre_dueno ? empresaDatos.nombre_dueno : ""
                  }
                  helperText={
                    errorForm ? "El campo nombre es obligatorio" : ""
                  }
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>Teléfono</b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  size="small"
                  name="telefono_dueno"
                  variant="outlined"
                  value={
                    empresaDatos.telefono_dueno
                      ? empresaDatos.telefono_dueno
                      : ""
                  }
                  onChange={obtenerCampos}
                />
              </Box>
            </Grid>
            <Grid item md={5} xs={12}>
              <Box my={1}>
                <Typography>
                  <b>Celular</b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  size="small"
                  name="celular"
                  variant="outlined"
                  value={empresaDatos.celular ? empresaDatos.celular : ""}
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>E-mail</b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  size="small"
                  name="correo_empresa"
                  variant="outlined"
                  value={
                    empresaDatos.correo_empresa
                      ? empresaDatos.correo_empresa
                      : ""
                  }
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Typography>
                      <b>Valor de puntos</b>
                    </Typography>
                    <TextField
                      inputMode="numeric"
                      type="number"
                      disabled={bloqueo}
                      size="small"
                      name="valor_puntos"
                      variant="outlined"
                      value={
                        empresaDatos.valor_puntos
                          ? empresaDatos.valor_puntos
                          : ""
                      }
                      onChange={obtenerCampos}
                    />
                  </Grid>
                  <Grid
                    item
                    md={8}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={bloqueo}
                          checked={empresaDatos.vender_sin_inventario}
                          onChange={handleChangeVenderInventario}
                          name="checkedA"
                        />
                      }
                      label="Vender productos sin inventario"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box mt={3} mb={2}>
            <Typography className={classes.subtitle}>
              <b>Domicilio empresa</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={3} className={classes.require}>
            <Grid item md={4}>
              <Box my={1}>
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
                    empresaDatos.direccion.calle
                      ? empresaDatos.direccion.calle
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
              <Box my={1}>
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
                    empresaDatos.direccion.no_ext
                      ? empresaDatos.direccion.no_ext
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
              <Box my={1}>
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
                    empresaDatos.direccion.no_int
                      ? empresaDatos.direccion.no_int
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
            </Grid>
            <Grid item md={4}>
              <Box my={1}>
                <Typography>
                  <b>C.P.</b>{" "}
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="codigo_postal"
                  variant="outlined"
                  disabled={bloqueo}
                  value={
                    empresaDatos.direccion.codigo_postal
                      ? empresaDatos.direccion.codigo_postal
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
              <Box my={1}>
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
                    empresaDatos.direccion.colonia
                      ? empresaDatos.direccion.colonia
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
              <Box my={1}>
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
                    empresaDatos.direccion.municipio
                      ? empresaDatos.direccion.municipio
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
            </Grid>
            <Grid item md={4}>
              <Box my={1}>
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
                    empresaDatos.direccion.localidad
                      ? empresaDatos.direccion.localidad
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
              <Box my={1}>
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
                    empresaDatos.direccion.estado
                      ? empresaDatos.direccion.estado
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
              <Box my={1}>
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
                    empresaDatos.direccion.pais
                      ? empresaDatos.direccion.pais
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
            </Grid>
          </Grid>
          {sesion.accesos.mi_empresa.datos_empresa.editar === false ? null : (
            <DialogActions
              style={{ marginTop: 15, width: "100%", justifyContent: "center" }}
            >
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => actEmp()}
                color="primary"
                variant="contained"
              >
                Guardar
              </Button>
            </DialogActions>
          )}
        </Container>
      )}
    </div>
  );
}
