import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  fade,
  Grid,
} from "@material-ui/core";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { Add, Delete, Edit, ExpandMore, Close } from "@material-ui/icons";
import ErrorPage from "../../../../components/ErrorPage";
import SnackBarMessages from "../../../../components/SnackBarMessages";

import { useQuery, useMutation } from "@apollo/client";
import {
  OBTENER_CATEGORIAS,
  CREAR_CATEGORIA,
  CREAR_SUBCATEGORIA,
  ACTUALIZAR_SUBCATEGORIA,
  ACTUALIZAR_CATEGORIA,
  ELIMINAR_CATEGORIA,
  ELIMINAR_SUBCATEGORIA,
} from "../../../../gql/Catalogos/categorias";
import { cleanTypenames } from "../../../../config/reuserFunctions";

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

export default function RegistroCategorias({ isOnline }) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [categoria, setCategoria] = useState("");
  const [toUpdateID, setToUpdateID] = useState("");
  const [loadingBackDrop, setLoadingBackDrop] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CATEGORIAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
    fetchPolicy: "network-only"
  });
  /*  Categorias Mutations */
  const [crearCategoria] = useMutation(CREAR_CATEGORIA);
  const [actualizarCategoria] = useMutation(ACTUALIZAR_CATEGORIA);

  const obtenerDatos = (e) => {
    setCategoria(e.target.value);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    if (!categoria) return;
    setLoadingBackDrop(true);
    try {
      if (!toUpdateID) {
        if (sesion.accesos.catalogos.categorias.agregar === false) {
          setLoadingBackDrop(false);
          return setAlert({
            message: "Lo sentimos no tienes autorización para esta acción",
            status: "error",
            open: true,
          });
        } else {
          await crearCategoria({
            variables: {
              input: {
                categoria,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            },
          });
        }
      } else {
        if (sesion.accesos.catalogos.categorias.editar === false) {
          setLoadingBackDrop(false);
          return setAlert({
            message: "Lo sentimos no tienes autorización para esta acción",
            status: "error",
            open: true,
          });
        } else {
          const categoriaActualizada = cleanTypenames(categoria);
          await actualizarCategoria({
            variables: {
              input: {
                categoria: categoriaActualizada,
              },
              idCategoria: toUpdateID,
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id,
            },
          });
        }
      }
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoadingBackDrop(false);
      setCategoria("");
      setToUpdateID("");
    } catch (error) {
      setLoadingBackDrop(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };
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

  const { obtenerCategorias } = data;
  const render_categorias = obtenerCategorias.map((categoria, index) => (
    <RenderCategorias
      isOnline={isOnline}
      key={index}
      categoria={categoria}
      setToUpdateID={setToUpdateID}
      setCategoria={setCategoria}
      refetch={refetch}
      toUpdateID={toUpdateID}
    />
  ));
  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Box>
        <Typography>
          <b>Categoria</b>
        </Typography>
        <form onSubmit={guardarCategoria}>
          <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
              <TextField
                value={categoria}
                variant="outlined"
                size="small"
                onChange={obtenerDatos}
                fullWidth
                inputProps={{ style: { textTransform: "uppercase" } }}
                disabled={loadingBackDrop}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                disableElevation
                type="submit"
                disabled={loadingBackDrop || !isOnline}
                startIcon={
                  loadingBackDrop ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <Add />
                  )
                }
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Box my={1}>
        <Typography variant="h6">Categorias</Typography>
      </Box>
      <Box mb={5}>{render_categorias}</Box>
    </div>
  );
}

const RenderCategorias = ({
  categoria,
  setToUpdateID,
  setCategoria,
  refetch,
  toUpdateID,
  isOnline,
}) => {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [subcategoria, setSubcategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /*  Subcategorias Mutations */
  const [crearSubcategoria] = useMutation(CREAR_SUBCATEGORIA);
  const [actualizarSubcategoria] = useMutation(ACTUALIZAR_SUBCATEGORIA);

  const render_subcategorias = categoria.subcategorias.map((subcategoria) => (
    <RenderSubcategorias
      key={subcategoria._id}
      idCategoria={categoria._id}
      subcategoria={subcategoria}
      setToUpdateID={setToUpdateID}
      toUpdateID={toUpdateID}
      setSubcategoria={setSubcategoria}
      setAlert={setAlert}
      refetch={refetch}
      isOnline={isOnline}
    />
  ));

  const obtenerCamposParaActualizar = (event) => {
    window.scrollTo(0, 0);
    event.stopPropagation();
    setToUpdateID(categoria._id);
    setCategoria(categoria.categoria);
  };

  const cancelarUpdate = (event) => {
    event.stopPropagation();
    setToUpdateID("");
    setCategoria("");
  };

  const obtenerDatos = (e) => {
    setSubcategoria(e.target.value);
  };

  const guardarSubcategoria = async (e) => {
    e.preventDefault();
    if (!subcategoria) return;
    setLoading(true);
    let msgAlert = "";
    let resp;
    try {
      if (!toUpdateID) {
        if (sesion.accesos.catalogos.categorias.agregar === false) {
          setLoading(false);
          return setAlert({
            message: "Lo sentimos no tienes autorización para esta acción",
            status: "error",
            open: true,
          });
        } else {
          resp = await crearSubcategoria({
            variables: {
              input: {
                subcategoria,
              },
              idCategoria: categoria._id,
              empresa : sesion.empresa._id,
              sucursal :sesion.sucursal._id
            },
          });
          msgAlert =
            resp.data.crearSubcategoria.message === "false"
              ? { message: "¡Listo!", status: "success", open: true }
              : {
                  message: resp.data.crearSubcategoria.message,
                  status: "error",
                  open: true,
                };
        }
      } else {
        if (sesion.accesos.catalogos.categorias.editar === false) {
          setLoading(false);
          return setAlert({
            message: "Lo sentimos no tienes autorización para esta acción",
            status: "error",
            open: true,
          });
        } else {
          const subCategoriaActualizada = cleanTypenames(subcategoria);
          resp = await actualizarSubcategoria({
            variables: {
              input: {
                subcategoria: subCategoriaActualizada,
              },
              idCategoria: categoria._id,
              idSubcategoria: toUpdateID,
              empresa : sesion.empresa._id,
              sucursal :sesion.sucursal._id
            },
          });
          msgAlert =
            resp.data.actualizarSubcategoria.message === "false"
              ? { message: "¡Listo!", status: "success", open: true }
              : {
                  message: resp.data.actualizarSubcategoria.message,
                  status: "error",
                  open: true,
                };
        }
      }
      refetch();

      setAlert(msgAlert);
      setLoading(false);
      setSubcategoria("");
      setToUpdateID("");
    } catch (error) {
      setLoading(false);
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Accordion>
        <AccordionSummary
          style={{ height: 32 }}
          className={
            toUpdateID && toUpdateID === categoria._id ? classes.selected : ""
          }
          expandIcon={<ExpandMore />}
          aria-label="Expand"
          aria-controls={`categoria-action-${categoria._id}`}
          id={`categoria-${categoria._id}`}
        >
          <Box display="flex" alignItems="center" width="100%">
            <Typography>{categoria.categoria}</Typography>
            <div className={classes.flexGrow} />
            {sesion.accesos.catalogos.categorias.editar ===
            false ? null : toUpdateID && toUpdateID === categoria._id ? (
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
            {sesion.accesos.catalogos.categorias.eliminar === false ? null : (
              <ModalEliminar
                idCategoria={categoria._id}
                refetch={refetch}
                tipo="categoria"
                setAlert={setAlert}
                isOnline={isOnline}
                sesion={sesion}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box width="100%">
            <Divider />
            <Box mb={2} />
            <form onSubmit={guardarSubcategoria}>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <Typography>
                    <b>Subcategorias</b>
                  </Typography>
                  <TextField
                    value={subcategoria}
                    variant="outlined"
                    size="small"
                    onChange={obtenerDatos}
                    fullWidth
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    disabled={loading}
                  />
                </Grid>
                <Grid
                  item
                  sm={6}
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    disableElevation
                    onClick={guardarSubcategoria}
                    disabled={loading || !isOnline}
                    startIcon={
                      loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <Add />
                      )
                    }
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box my={1}>
              <Typography variant="h6">Subcategorias</Typography>
            </Box>
            {render_subcategorias}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
};

const RenderSubcategorias = ({
  subcategoria,
  idCategoria,
  toUpdateID,
  setToUpdateID,
  setSubcategoria,
  setAlert,
  refetch,
  isOnline,
}) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();

  const obtenerCamposParaActualizar = (event) => {
    event.stopPropagation();
    setToUpdateID(subcategoria._id);
    setSubcategoria(subcategoria.subcategoria);
  };

  const cancelarUpdate = (event) => {
    event.stopPropagation();
    setToUpdateID("");
    setSubcategoria("");
  };
  return (
    <Fragment>
      <Box
        display="flex"
        alignItems="center"
        borderRadius={3}
        px={1}
        className={
          toUpdateID && toUpdateID === subcategoria._id ? classes.selected : ""
        }
      >
        <Typography>{subcategoria.subcategoria}</Typography>
        <div className={classes.flexGrow} />
        {sesion.accesos.catalogos.categorias.editar ===
        false ? null : toUpdateID && toUpdateID === subcategoria._id ? (
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
        {sesion.accesos.catalogos.categorias.eliminar === false ? null : (
          <ModalEliminar
            idCategoria={idCategoria}
            subcategoria={subcategoria}
            refetch={refetch}
            tipo="subcategoria"
            setAlert={setAlert}
            isOnline={isOnline}
            sesion={sesion}
          />
        )}
      </Box>
      <Divider />
    </Fragment>
  );
};

const ModalEliminar = ({
  idCategoria,
  subcategoria,
  refetch,
  tipo,
  setAlert,
  isOnline,

  sesion
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [eliminarCategoria] = useMutation(ELIMINAR_CATEGORIA);
  const [eliminarSubcategoria] = useMutation(ELIMINAR_SUBCATEGORIA);

  const handleOpen = (event) => {
    console.log(event);
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setOpen(false);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    setLoading(true);
    let msgAlert = {};
    try {
      if (tipo !== "categoria") {
        const resp = await eliminarSubcategoria({
          variables: {
            idCategoria: idCategoria,
            idSubcategoria: subcategoria._id,
            empresa : sesion.empresa._id,
            sucursal :sesion.sucursal._id,
          },
        });

        msgAlert =
          resp.data.eliminarSubcategoria.message === "false"
            ? { message: "¡Listo!", status: "success", open: true }
            : {
                message: resp.data.eliminarSubcategoria.message,
                status: "error",
                open: true,
              };
      } else {
        const resp = await eliminarCategoria({
          variables: {
            idCategoria: idCategoria,
            empresa : sesion.empresa._id,
              sucursal :sesion.sucursal._id,
          },
        });

        msgAlert =
          resp.data.eliminarCategoria.message === "false"
            ? { message: "¡Listo!", status: "success", open: true }
            : {
                message: resp.data.eliminarCategoria.message,
                status: "error",
                open: true,
              };
      }
      setOpen(false);
      setLoading(false);
      setAlert(msgAlert);
      refetch();
    } catch (error) {
      
      setOpen(false);
      setLoading(false);
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };
  // console.log(isOnline);
  return (
    <div>
      <IconButton
        disabled={!isOnline}
        color="secondary"
        onClick={(e) => handleOpen(e)}
      >
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={(e) => handleClose(e)}>
        <DialogTitle>{"¿Seguro que quieres eliminar esto?"}</DialogTitle>
        <DialogActions>
          <Button onClick={(e) => handleClose(e)} color="primary">
            Cancelar
          </Button>
          <Button
            color="secondary"
            autoFocus
            variant="contained"
            onClick={(e) => handleDelete(e)}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : <></>
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
