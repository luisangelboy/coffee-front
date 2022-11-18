import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  fade,
} from "@material-ui/core";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { Add, Edit, ExpandMore, Close } from "@material-ui/icons";
import ErrorPage from "../../../../components/ErrorPage";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";

import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_CUENTAS,
  CREAR_CUENTA,
  CREAR_SUBCUENTA,
  ACTUALIZAR_SUBCUENTA,
  ACTUALIZAR_CUENTA,
} from "../../../../gql/Catalogos/centroCostos";
import { cleanTypenames } from "../../../../config/reuserFunctions";
import EliminarCuenta from "./eliminarCuenta";
import EliminarSubcuenta from "./eliminarSubcuenta";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  flexGrow: {
    flexGrow: 1,
  },
  selected: {
    background: fade(theme.palette.secondary.main, 0.1),
  },
}));

export default function RegistroCentroCostos({ isOnline }) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [cuenta, setCuenta] = useState("");
  const [toUpdateID, setToUpdateID] = useState("");
  const [loadingBackDrop, setLoadingBackDrop] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CUENTAS, {
    variables: { empresa: sesion.empresa._id },
  });
  /*  Categorias Mutations */
  const [crearCuenta] = useMutation(CREAR_CUENTA);
  const [actualizarCuenta] = useMutation(ACTUALIZAR_CUENTA);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} />;
  }

  const { obtenerCuentas } = data;
  const render_cuentas = obtenerCuentas.map((cuenta, index) => (
    <RenderCuentas
      key={index}
      cuenta={cuenta}
      setToUpdateID={setToUpdateID}
      setCuenta={setCuenta}
      refetch={refetch}
      toUpdateID={toUpdateID}
      isOnline={isOnline}
    />
  ));

  const obtenerDatos = (e) => {
    setCuenta(e.target.value);
  };

  const guardarCuenta = async () => {
    if (!cuenta) return;
    setLoadingBackDrop(true);
    try {
      if (!toUpdateID) {
        if (sesion.accesos.catalogos.centro_costos.agregar === false) {
          setLoadingBackDrop(false);
          return setAlert({
            message: "¡Lo sentimos no tienes autorización para esta acción!",
            status: "error",
            open: true,
          });
        } else {
          await crearCuenta({
            variables: {
              input: {
                cuenta,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            },
          });
        }
      } else {
        if (sesion.accesos.catalogos.centro_costos.editar === false) {
          setLoadingBackDrop(false);
          return setAlert({
            message: "¡Lo sentimos no tienes autorización para esta acción!",
            status: "error",
            open: true,
          });
        } else {
          const cuentaActualizada = cleanTypenames(cuenta);
          await actualizarCuenta({
            variables: {
              input: {
                cuenta: cuentaActualizada,
              },
              idCuenta: toUpdateID,
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id
            },
          });
        }
      }
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoadingBackDrop(false);
      setCuenta("");
      setToUpdateID("");
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoadingBackDrop(false);
    }
  };

  const pressEnter = (e) => {
    try {
      if (e.key === "Enter") {
        guardarCuenta();
      }
    } catch (error) {}
  };
  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BackdropComponent
        loading={loadingBackDrop}
        setLoading={setLoadingBackDrop}
      />
      <Typography variant="h6">Cuentas</Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          value={cuenta}
          variant="outlined"
          inputProps={{ style: { textTransform: "uppercase" } }}
          size="small"
          style={{ width: "35%" }}
          onKeyPress={pressEnter}
          onChange={obtenerDatos}
        />
        <Box ml={1} />
        <Button
          color="primary"
          variant="contained"
          size="large"
          disableElevation
          onClick={guardarCuenta}
          disabled={!isOnline}
        >
          <Add />
          Guardar
        </Button>
      </Box>
      {render_cuentas}
    </div>
  );
}

const RenderCuentas = ({
  cuenta,
  setToUpdateID,
  setCuenta,
  refetch,
  toUpdateID,
  isOnline,
}) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const classes = useStyles();
  const [subcuenta, setSubcuenta] = useState("");
  const [loadingBackDrop, setLoadingBackDrop] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /*  Subcategorias Mutations */
  const [crearSubcuenta] = useMutation(CREAR_SUBCUENTA);
  const [actualizarSubcuenta] = useMutation(ACTUALIZAR_SUBCUENTA);

  const render_subcuentas =
    cuenta.subcuentas !== null ? (
      cuenta.subcuentas.map((subcuenta) => (
        <RenderSubcuentas
          key={subcuenta._id}
          idCuenta={cuenta._id}
          subcuenta={subcuenta}
          setToUpdateID={setToUpdateID}
          toUpdateID={toUpdateID}
          setSubcuenta={setSubcuenta}
          refetch={refetch}
          isOnline={isOnline}
        />
      ))
    ) : (
      <div />
    );
  const obtenerCamposParaActualizar = (event) => {
    event.stopPropagation();
    setToUpdateID(cuenta._id);
    setCuenta(cuenta.cuenta);
  };

  const cancelarUpdate = (event) => {
    event.stopPropagation();
    setToUpdateID("");
    setCuenta("");
  };

  const obtenerDatos = (e) => {
    setSubcuenta(e.target.value);
  };

  const guardarSubcuenta = async () => {
    if (!subcuenta) return;
    setLoadingBackDrop(true);
    try {
      if (!toUpdateID) {
        if (sesion.accesos.catalogos.centro_costos.agregar === false) {
          setLoadingBackDrop(false);
          return setAlert({
            message: "¡Lo sentimos no tienes autorización para esta acción!",
            status: "error",
            open: true,
          });
        } else {
          await crearSubcuenta({
            variables: {
              input: {
                subcuenta,
              },
              idCuenta: cuenta._id,
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id
            },
          });
        }
      } else {
        if (sesion.accesos.catalogos.centro_costos.editar === false) {
          setLoadingBackDrop(false);
          return setAlert({
            message: "¡Lo sentimos no tienes autorización para esta acción!",
            status: "error",
            open: true,
          });
        } else {
          const subCuentaActualizada = cleanTypenames(subcuenta);
          await actualizarSubcuenta({
            variables: {
              input: {
                subcuenta: subCuentaActualizada,
              },
              idCuenta: cuenta._id,
              idSubcuenta: toUpdateID,
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id,
            },
          });
        }
      }
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoadingBackDrop(false);
      setSubcuenta("");
      setToUpdateID("");
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoadingBackDrop(false);
    }
  };

  const pressEnter = (e) => {
    try {
      if (e.key === "Enter") {
        guardarSubcuenta();
      }
    } catch (error) {}
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BackdropComponent
        loading={loadingBackDrop}
        setLoading={setLoadingBackDrop}
      />
      <Accordion>
        <AccordionSummary
          className={
            toUpdateID && toUpdateID === cuenta._id ? classes.selected : ""
          }
          expandIcon={<ExpandMore />}
          aria-label="Expand"
          aria-controls={`cuenta-action-${cuenta._id}`}
          id={`cuenta-${cuenta._id}`}
        >
          <Box display="flex" alignItems="center" width="100%">
            <Typography style={{ fontSize: 15 }}>{cuenta.cuenta}</Typography>
            <div className={classes.flexGrow} />
            {toUpdateID && toUpdateID === cuenta._id ? (
              <IconButton
                onClick={cancelarUpdate}
                onFocus={(event) => event.stopPropagation()}
              >
                <Close />
              </IconButton>
            ) : sesion.accesos.catalogos.centro_costos.editar ===
              false ? null : (
              <IconButton
                onClick={obtenerCamposParaActualizar}
                onFocus={(event) => event.stopPropagation()}
                disabled={!isOnline}
              >
                <Edit />
              </IconButton>
            )}
            {sesion.accesos.catalogos.centro_costos.eliminar ===
            false ? null : (
              <EliminarCuenta
                cuenta={cuenta}
                refetch={refetch}
                setAlert={setAlert}
                isOnline={isOnline}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box width="100%">
            <Divider />
            <Box mb={2} />
            <Box ml={5} width="100%" display="flex">
              <Typography variant="h6" style={{ fontSize: 20 }}>
                Subcuenta
              </Typography>
              <Box mr={2} />
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  value={subcuenta}
                  variant="outlined"
                  size="small"
                  onChange={obtenerDatos}
                  onKeyPress={pressEnter}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
                <Box ml={1} />
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  disableElevation
                  onClick={guardarSubcuenta}
                  disabled={!isOnline}
                >
                  <Add />
                  Guardar
                </Button>
              </Box>
            </Box>
            {cuenta.subcuentas !== null ? (
              <Box ml={5}>{render_subcuentas}</Box>
            ) : (
              <div />
            )}
            {/* <Box ml={5}>{render_subcostos}</Box> */}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

const RenderSubcuentas = ({
  idCuenta,
  subcuenta,
  toUpdateID,
  setToUpdateID,
  setSubcuenta,
  refetch,
  isOnline,
}) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const classes = useStyles();
  const [loadingBackDrop, setLoadingBackDrop] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const obtenerCamposParaActualizar = (event) => {
    event.stopPropagation();
    setToUpdateID(subcuenta._id);
    setSubcuenta(subcuenta.subcuenta);
  };

  const cancelarUpdate = (event) => {
    event.stopPropagation();
    setToUpdateID("");
    setSubcuenta("");
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <BackdropComponent
        loading={loadingBackDrop}
        setLoading={setLoadingBackDrop}
      />
      <Box
        display="flex"
        alignItems="center"
        borderRadius={3}
        px={1}
        className={
          toUpdateID && toUpdateID === subcuenta._id ? classes.selected : ""
        }
      >
        <Typography>{subcuenta.subcuenta}</Typography>
        <div className={classes.flexGrow} />
        {sesion.accesos.catalogos.centro_costos.editar ===
        false ? null : toUpdateID && toUpdateID === subcuenta._id ? (
          <IconButton
            onClick={cancelarUpdate}
            onFocus={(event) => event.stopPropagation()}
          >
            <Close />
          </IconButton>
        ) : (
          <IconButton
            onClick={obtenerCamposParaActualizar}
            onFocus={(event) => event.stopPropagation()}
            disabled={!isOnline}
          >
            <Edit />
          </IconButton>
        )}
        {sesion.accesos.catalogos.centro_costos.eliminar === false ? null : (
          <EliminarSubcuenta
            idCuenta={idCuenta}
            subcuenta={subcuenta}
            refetch={refetch}
            setAlert={setAlert}
            isOnline={isOnline}
          />
        )}
      </Box>
      <Divider />
    </Fragment>
  );
};
