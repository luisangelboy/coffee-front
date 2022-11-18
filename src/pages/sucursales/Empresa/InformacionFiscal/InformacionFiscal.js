import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Box,
  Grid,
  TextField,
  Button,
  Container,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Typography, Divider, DialogActions } from "@material-ui/core";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import ErrorPage from "../../../../components/ErrorPage";
import { useMutation, useQuery } from "@apollo/client";

import { EmpresaContext } from "../../../../context/Catalogos/empresaContext";
import {
  ACTUALIZAR_EMPRESA,
  OBTENER_DATOS_EMPRESA,
} from "../../../../gql/Empresa/empresa";
import { regimenFiscal } from "../../Facturacion/catalogos";
import { Alert, AlertTitle } from "@material-ui/lab";
import RegistroSellos from "../../Facturacion/CFDISellos/RegistrarSellos";
import EliminarSellos from "../../Facturacion/CFDISellos/EliminarCSD";
import moment from "moment";

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

export default function InformacionFiscal(props) {
  const classes = useStyles();
  const [loadingPage, setLoadingPage] = React.useState(false);

  const [errorPage, setErrorPage] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState(
    useState({ error: false, message: "" })
  );
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [bloqueo] = useState(
    sesion.accesos.mi_empresa.informacion_fiscal.editar === false ? true : false
  );
  const { empresa, setEmpresa } = useContext(EmpresaContext);
  const [actualizarEmpresa] = useMutation(ACTUALIZAR_EMPRESA);
  const [firma_disabled, setFirmaDisabled] = useState(false);
  const [empresaFiscal, setEmpresaFiscal] = useState({
    nombre_fiscal: "",
    rfc: "",
    curp: "",
    info_adicio: "",
    regimen_fiscal: "",
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
  });
  /* Queries */

  const { loading, data, refetch, error } = useQuery(OBTENER_DATOS_EMPRESA, {
    variables: { id: sesion.empresa._id },
  });

  useEffect(() => {
    try {
      setErrorPage(error);
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [error]);

  useEffect(() => {
    try {
      if (data !== undefined) {
        setEmpresa(data.obtenerEmpresa);
        let new_sesion = sesion;
        new_sesion.empresa = data.obtenerEmpresa;
        localStorage.setItem("sesionCafi", JSON.stringify(new_sesion));
        if (!data.obtenerEmpresa.rfc) {
          setFirmaDisabled(true);
        } else {
          setFirmaDisabled(false);
        }
      }
    } catch (errorCatch) {
      //console.log("SESSIONREFECT",errorCatch)
    }
  }, [data, setEmpresa, sesion]);

  useEffect(() => {
    try {
      setErrorPage(error);
    } catch (errorCatch) {
      // console.log("SESSIONREFECT",errorCatch)
    }
  }, [error]);

  useEffect(() => {
    try {
      setLoadingPage(loading);
    } catch (errorCatch) {
      // console.log("SESSIONREFECTUPDATE",errorCatch)
    }
  }, [loading]);

  useEffect(() => {
    try {
      setEmpresaFiscal({
        nombre_fiscal: empresa.nombre_fiscal,
        rfc: empresa.rfc,
        curp: empresa.curp,
        fecha_registro_sello_sat: empresa.fecha_registro_sello_sat
          ? moment(empresa.fecha_registro_sello_sat).format("DD/MM/YYYY")
          : "",
        info_adicio: empresa.info_adicio,
        regimen_fiscal: empresa.regimen_fiscal,
        sello_sat: empresa.sello_sat,
        nombre_cer: empresa.nombre_cer,
        nombre_key: empresa.nombre_key,
        limite_timbres: empresa.limite_timbres,
        timbres_usados: empresa.timbres_usados,
        direccionFiscal: {
          calle: empresa.direccionFiscal.calle,
          no_ext: empresa.direccionFiscal.no_ext,
          no_int: empresa.direccionFiscal.no_int,
          codigo_postal: empresa.direccionFiscal.codigo_postal,
          colonia: empresa.direccionFiscal.colonia,
          municipio: empresa.direccionFiscal.municipio,
          localidad: empresa.direccionFiscal.localidad,
          estado: empresa.direccionFiscal.estado,
          pais: empresa.direccionFiscal.pais,
        },
        datosBancarios: {
          cuenta: empresa.datosBancarios.cuenta,
          sucursal: empresa.datosBancarios.sucursal,
          clave_banco: empresa.datosBancarios.clave_banco,
        },
      });
    } catch (errorCatch) {}
  }, [empresa]);

  const actEmp = async () => {
    try {
      setLoadingPage(true);
      /* const input = cleanTypenames(empresaFiscal); */
      delete empresaFiscal.fecha_registro_sello_sat;

      await actualizarEmpresa({
        variables: {
          id: sesion.empresa._id,
          input: empresaFiscal,
        },
      });
      setLoadingPage(false);
      setAlert({
        message: "Se han actualizado correctamente los datos.",
        status: "success",
        open: true,
      });
      setErrorForm(false);
      refetch();
    } catch (error) {
      setLoadingPage(false);
      setAlert({ message: "Hubo un error", status: "error", open: true });
      console.log(error);
      if (error.response) {
        console.log(error.response);
      } else if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  const handleClose = () => {
    props.setOpen(false);
  };
  const obtenerCampos = (e) => {
    setEmpresaFiscal({
      ...empresaFiscal,
      [e.target.name]: e.target.value,
    });
  };
  const obtenerCamposDireccion = (e) => {
    setEmpresaFiscal({
      ...empresaFiscal,
      direccionFiscal: {
        ...empresaFiscal.direccionFiscal,
        [e.target.name]: e.target.value,
      },
    });
  };
  const obtenerCamposBancarios = (e) => {
    setEmpresaFiscal({
      ...empresaFiscal,
      datosBancarios: {
        ...empresaFiscal.datosBancarios,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BackdropComponent loading={loadingPage} setLoading={setLoadingPage} />

      {errorPage ? (
        <ErrorPage error={errorPage} />
      ) : (
        <Container>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12} className={classes.require}>
              <Box my={1}>
                <Typography>
                  <b>
                    {" "}
                    <span>* </span>Nombre fiscal
                  </b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  type="text"
                  size="small"
                  error={errorForm.error && !empresaFiscal.nombre_fiscal}
                  name="nombre_fiscal"
                  variant="outlined"
                  value={
                    empresaFiscal.nombre_fiscal
                      ? empresaFiscal.nombre_fiscal
                      : ""
                  }
                  helperText={
                    errorForm.error &&
                    errorForm.message !== "El campo nombre es obligatorio"
                      ? errorForm.message
                      : ""
                  }
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>RFC</b>
                </Typography>
                <TextField
                  fullWidth
                  disabled={bloqueo}
                  size="small"
                  name="rfc"
                  variant="outlined"
                  value={empresaFiscal.rfc ? empresaFiscal.rfc : ""}
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Typography>Régimen fiscal</Typography>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="regimen_fiscal"
                >
                  <Select
                    value={
                      empresaFiscal.regimen_fiscal
                        ? empresaFiscal.regimen_fiscal
                        : ""
                    }
                    name="regimen_fiscal"
                    onChange={obtenerCampos}
                  >
                    <MenuItem value="">
                      <em>Selecciona uno</em>
                    </MenuItem>
                    {regimenFiscal.map((res, index) => (
                      <MenuItem
                        key={index}
                        value={res.Value}
                      >{`${res.Value} - ${res.Name}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box my={1}>
                <Typography>
                  <b>CURP</b>
                </Typography>
                <TextField
                  disabled={bloqueo}
                  fullWidth
                  size="small"
                  name="curp"
                  variant="outlined"
                  value={empresaFiscal.curp ? empresaFiscal.curp : ""}
                  onChange={obtenerCampos}
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>Info. Adicional</b>
                </Typography>
                <TextField
                  disabled={bloqueo}
                  fullWidth
                  size="small"
                  name="info_adicio"
                  variant="outlined"
                  value={
                    empresaFiscal.info_adicio ? empresaFiscal.info_adicio : ""
                  }
                  onChange={obtenerCampos}
                  multiline
                />
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography className={classes.subtitle}>
                <b>Firma digital</b>
              </Typography>
              <Divider />
              <Box m={1}>
                {empresaFiscal.sello_sat === true ? (
                  <Alert
                    severity="success"
                    action={
                      <EliminarSellos
                        firma_disabled={firma_disabled}
                        datosEmpresa={empresaFiscal}
                        refetch={refetch}
                      />
                    }
                  >
                    <AlertTitle>Firma Digital Activa</AlertTitle>
                  </Alert>
                ) : (
                  <Alert
                    severity="info"
                    action={
                      <RegistroSellos
                        firma_disabled={firma_disabled}
                        datosEmpresa={empresaFiscal}
                        refetch={refetch}
                      />
                    }
                  >
                    <AlertTitle>Sin Firma Digital</AlertTitle>
                    Sin esta firma no prodrás realizar facturas
                    {firma_disabled ? (
                      <li>Necesitas tener un RFC registrado</li>
                    ) : null}
                  </Alert>
                )}
              </Box>
              <Box my={1}>
                <Typography>
                  <b>Archivo *.cer</b>
                </Typography>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={
                    empresaFiscal.nombre_cer ? empresaFiscal.nombre_cer : ""
                  }
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>Archivo *.key</b>
                </Typography>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={
                    empresaFiscal.nombre_key ? empresaFiscal.nombre_key : ""
                  }
                />
              </Box>
              <Box my={1}>
                <Typography>
                  <b>Fecha de registro</b>
                </Typography>
                <TextField
                  disabled
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={empresaFiscal.fecha_registro_sello_sat}
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Typography className={classes.subtitle}>
              <b>Domicilio</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
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
                    empresaFiscal.direccionFiscal.calle
                      ? empresaFiscal.direccionFiscal.calle
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
                    empresaFiscal.direccionFiscal.no_ext
                      ? empresaFiscal.direccionFiscal.no_ext
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
                    empresaFiscal.direccionFiscal.no_int
                      ? empresaFiscal.direccionFiscal.no_int
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
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
                    empresaFiscal.direccionFiscal.codigo_postal
                      ? empresaFiscal.direccionFiscal.codigo_postal
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
                    empresaFiscal.direccionFiscal.colonia
                      ? empresaFiscal.direccionFiscal.colonia
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
                    empresaFiscal.direccionFiscal.municipio
                      ? empresaFiscal.direccionFiscal.municipio
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
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
                    empresaFiscal.direccionFiscal.localidad
                      ? empresaFiscal.direccionFiscal.localidad
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
                    empresaFiscal.direccionFiscal.estado
                      ? empresaFiscal.direccionFiscal.estado
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
                    empresaFiscal.direccionFiscal.pais
                      ? empresaFiscal.direccionFiscal.pais
                      : ""
                  }
                  onChange={obtenerCamposDireccion}
                />
              </Box>
            </Grid>
          </Grid>
          <Box mt={1}>
            <Typography className={classes.subtitle}>
              <b>Datos bancarios</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography>
                  <b>Cuenta</b>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="cuenta"
                  variant="outlined"
                  disabled={bloqueo}
                  value={
                    empresaFiscal.datosBancarios.cuenta
                      ? empresaFiscal.datosBancarios.cuenta
                      : ""
                  }
                  onChange={obtenerCamposBancarios}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography>
                  <b>Sucursal</b>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="sucursal"
                  variant="outlined"
                  disabled={bloqueo}
                  value={
                    empresaFiscal.datosBancarios.sucursal
                      ? empresaFiscal.datosBancarios.sucursal
                      : ""
                  }
                  onChange={obtenerCamposBancarios}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography>
                  <b>Clave de banco</b>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  name="clave_banco"
                  variant="outlined"
                  disabled={bloqueo}
                  value={
                    empresaFiscal.datosBancarios.clave_banco
                      ? empresaFiscal.datosBancarios.clave_banco
                      : ""
                  }
                  onChange={obtenerCamposBancarios}
                />
              </Box>
            </Grid>
          </Grid>
          {sesion.accesos.mi_empresa.informacion_fiscal.editar ===
          false ? null : (
            <DialogActions
              m={2}
              style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
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
