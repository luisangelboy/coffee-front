import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Add,
  Close,
  CloudUpload,
  Done,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { CREAR_SELLO_CFDI } from "../../../../gql/Facturacion/Facturacion";
import { useMutation } from "@apollo/client";

export default function RegistroSellos({
  datosEmpresa,
  firma_disabled,
  refetch,
}) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState({
    certificate: "",
    private_key: "",
    private_key_password: "",
    rfc: sesion && datosEmpresa.rfc ? datosEmpresa.rfc : "",
    empresa: sesion && sesion.empresa._id ? sesion.empresa._id : "",
    sucursal: sesion && sesion.sucursal._id ? sesion.sucursal._id : "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDatos({
      certificate: "",
      private_key: "",
      private_key_password: "",
      rfc: sesion && datosEmpresa.rfc ? datosEmpresa.rfc : "",
      empresa: sesion && sesion.empresa._id ? sesion.empresa._id : "",
      sucursal: sesion && sesion.sucursal._id ? sesion.sucursal._id : "",
    });
  };

  const [crearCSDS] = useMutation(CREAR_SELLO_CFDI);

  const handleClickShowPassword = () => setShow(!show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const obtenerFiles = (e) => {
    const { name, files } = e.target;
    setDatos({
      ...datos,
      [name]: files[0],
    });
  };

  const obtenerDatos = (e) => {
    setDatos({
      ...datos,
      private_key_password: e.target.value,
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const guardarBD = async () => {
    if (
      !datos.certificate ||
      !datos.private_key ||
      !datos.private_key_password ||
      !datos.rfc
    )
      return;

    try {
      let data = { ...datos };
      let cer = data.certificate;
      let key = data.private_key;
      await getBase64(cer)
        .then((result) => {
          const base = result.split(",");
          data.certificate = base[1];
          data.nombre_cer = cer.name;
        })
        .catch((err) => {
          console.log(err);
        });
      await getBase64(key)
        .then((result) => {
          const base = result.split(",");
          data.private_key = base[1];
          data.nombre_key = key.name;
        })
        .catch((err) => {
          console.log(err);
        });

      setLoading(true);
      const result = await crearCSDS({
        variables: {
          input: {
            certificate: data.certificate,
            private_key: data.private_key,
            private_key_password: data.private_key_password,
            rfc: data.rfc,
            empresa: data.empresa,
            sucursal: data.sucursal,
            nombre_cer: data.nombre_cer,
            nombre_key: data.nombre_key,
          },
        },
      });
      setAlert({
        message: `¡Listo! ${result.data.crearCSDS.message}`,
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
          startIcon={<Add />}
          disabled={firma_disabled}
        >
          Agregar CSD
        </Button>
      </Box>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={() => handleClose()}>
        <DialogTitle>Registrar firma digital</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            {datosEmpresa.rfc ? (
              <Typography>{`RFC: ${datosEmpresa.rfc}`}</Typography>
            ) : (
              <Typography color="error">
                *No tienes registrado un RFC
              </Typography>
            )}
          </Box>
          <Box width="100%">
            <Typography>
              Archivo *.cer <b>Certificado de la firma Digital</b>
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                value={datos.certificate ? datos.certificate.name : ""}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="archivo-cer-sello-digital">
                        <Button
                          startIcon={<CloudUpload />}
                          color="primary"
                          component="span"
                          disableElevation
                        >
                          Upload
                        </Button>
                      </label>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
              <input
                accept=".cer"
                style={{ display: "none" }}
                id="archivo-cer-sello-digital"
                multiple
                type="file"
                name="certificate"
                onChange={obtenerFiles}
              />
            </Box>
          </Box>
          <Box width="100%" mt={2}>
            <Typography>
              Archivo *.key <b>Llave Privada de la Firma Digital</b>
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                value={datos.private_key ? datos.private_key.name : ""}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <label htmlFor="archivo-key-llave_privada">
                        <Button
                          startIcon={<CloudUpload />}
                          color="primary"
                          component="span"
                          disableElevation
                        >
                          Upload
                        </Button>
                      </label>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
              <input
                accept=".key"
                style={{ display: "none" }}
                id="archivo-key-llave_privada"
                multiple
                type="file"
                name="private_key"
                onChange={obtenerFiles}
              />
            </Box>
          </Box>
          <Box width="100%" my={2}>
            <Typography>
              Contraseña de la llave <b>Privada de la Firma Digital</b>
            </Typography>
            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                type={show ? "text" : "password"}
                size="small"
                variant="outlined"
                name="private_key_password"
                onChange={obtenerDatos}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {show ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
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
            startIcon={loading ? <CircularProgress size={20} /> : <Done />}
            color="primary"
            size="large"
            onClick={() => guardarBD()}
            disabled={loading || !datos.rfc}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
