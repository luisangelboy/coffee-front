import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { Close, Search } from "@material-ui/icons";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import {
  CREAR_CODIGO_PRODUCTO,
  ELIMINAR_CODIGO_PRODUCTO,
} from "../../../../../gql/CatalogosSat/catalogoProductosSat";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import { useDebounce } from "use-debounce";
import { Alert } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  spin_container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spin: {
    zIndex: 9999,
  },
  titulos: {
    fontWeight: 500,
  },
}));

export default function CatalogosProductosSAT({ codigos, refetch }) {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = React.useState(false);
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading_save, setLoadingSave] = useState(false);
  const [loading_delete, setLoadingDelete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState({});

  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  const [crearCodigoProducto] = useMutation(CREAR_CODIGO_PRODUCTO);
  const [eliminarCodigoProducto] = useMutation(ELIMINAR_CODIGO_PRODUCTO);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const limpiarDataModal = () => {
    setSelectedIndex({});
    setProductos([]);
    setBusqueda("");
    handleClose();
  };

  const [value] = useDebounce(busqueda, 500);

  const handleOk = async (selectedIndex) => {
    const { Name, Value } = selectedIndex;
    setDatosGenerales({
      ...datos_generales,
      clave_producto_sat: {
        Name,
        Value,
      },
    });
    //Crear Codigo product a la BD
    try {
      setLoadingSave(true);
      const result = await crearCodigoProducto({
        variables: {
          input: {
            Name,
            Value,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          },
        },
      });

      if (result) {
        const { message } = result.data.crearCodigoProducto;
        setAlert({
          message: message,
          status: "success",
          open: true,
        });
        setLoadingSave(false);
        refetch();
        limpiarDataModal();
      }
    } catch (error) {
      setLoadingSave(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
    }
  };

  const eliminarCodigoBD = async (data) => {
    try {
      setLoadingDelete(true);
      const result = await eliminarCodigoProducto({
        variables: {
          id: data._id,
        },
      });

      if (result) {
        const { message } = result.data.eliminarCodigoProducto;
        setAlert({
          message: message,
          status: "success",
          open: true,
        });
        setDatosGenerales({
          ...datos_generales,
          clave_producto_sat: {
            Name: "",
            Value: "",
          },
        });
        setLoadingDelete(false);
        refetch();
      }
    } catch (error) {
      setLoadingDelete(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "error",
        open: true,
      });
    }
  };

  const handleCancel = () => {
    limpiarDataModal();
  };

  const obtenerCampos = (data) => {
    if (!data) {
      setDatosGenerales({
        ...datos_generales,
        clave_producto_sat: {
          Name: "",
          Value: "",
        },
      });
      return null;
    }
    setDatosGenerales({
      ...datos_generales,
      clave_producto_sat: {
        Name: data.Name,
        Value: data.Value,
      },
    });
  };

  const buscarCatalogo = useCallback(
    async () => {
      if (!value) {
        setProductos([]);
        return;
      }
      setLoading(true);
      try {
        await Facturama.Catalogs.ProductsOrServices(
          value,
          function (result) {
            setProductos(result);
            setLoading(false);
          },
          function (error) {
            if (error && error.responseJSON) {
              setError(error.responseJSON);
            }
            setLoading(false);
          }
        );
      } catch (error) {
        if (error && error.responseJSON) {
          setError(error.responseJSON.Message);
        }
        setLoading(false);
      }
    },
    [ value],
  )
  ;

  useEffect(() => {
    buscarCatalogo();
  }, [ buscarCatalogo]);

  return (
    <div>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Typography className={classes.titulos}>Clave de producto SAT</Typography>
      <Box display="flex">
        <Autocomplete
          id="catalogos-bd-productos"
          size="small"
          options={codigos}
          disabled={loading_delete}
          getOptionLabel={(option) =>
            option.Name ? `${option.Value} - ${option.Name}` : ""
          }
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {loading_delete ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              }}
            />
          )}
          renderOption={(option) => (
            <Fragment>
              {`${option.Value} - ${option.Name}`}
              <div style={{ flexGrow: 1 }} />
              <IconButton size="small" onClick={() => eliminarCodigoBD(option)}>
                <Close />
              </IconButton>
            </Fragment>
          )}
          onChange={(_, data) => obtenerCampos(data)}
          getOptionSelected={(option, value) => option.Value === value.Value}
          value={datos_generales.clave_producto_sat}
        />
        <Button color="primary" onClick={handleClickOpen}>
          <Search />
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCancel}
        aria-labelledby="alert-dialog-clave-producto"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-clave-producto">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              Catalogo de productos y servicios SAT
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleCancel()}
                size="large"
                disabled={loading_save}
              >
                <Close />
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        {loading_save ? (
          <div className={classes.spin_container}>
            <CircularProgress className={classes.spin} size={35} />
          </div>
        ) : null}
        <div
          style={
            loading_save
              ? {
                  pointerEvents: "none",
                  opacity: 0.4,
                }
              : null
          }
        >
          <Box p={2}>
            <TextField
              variant="outlined"
              label="producto, servicio o giro de la empresa"
              fullWidth
              size="small"
              onChange={(e) => {
                setBusqueda(e.target.value);
                setError("");
              }}
              value={busqueda}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="disabled" />
                  </InputAdornment>
                ),
              }}
              error={error ? true : false}
              helperText={error ? error : ""}
            />
            <Box my={1}>
              <Alert severity="info">
                Para seleccionar un cliente haz un doble click!
              </Alert>
            </Box>
          </Box>

          <DialogContent style={{ height: "50vh" }}>
            <Box my={3} className={classes.root}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="25vh"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <List dense component="nav" aria-label="main mailbox folders">
                  {productos.map((res, index) => (
                    <SelectedListItem
                      key={index}
                      producto={res}
                      busqueda={busqueda}
                      handleOk={handleOk}
                      setSelectedIndex={setSelectedIndex}
                      selectedIndex={selectedIndex}
                    />
                  ))}
                </List>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCancel()}>Cancelar</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}

const SelectedListItem = ({
  producto,
  busqueda,
  handleOk,
  selectedIndex,
  setSelectedIndex,
}) => {
  const handleListItemClick = (click, data) => {
    setSelectedIndex(data);
    if (click === 2) {
      handleOk(data);
    }
  };

  const contiene = busqueda.includes("potacio");
  if (producto.Value === "0" && !contiene) {
    return null;
  }

  return (
    <Fragment>
      <ListItem
        button
        selected={selectedIndex.Value === producto.Value}
        onClick={(e) => handleListItemClick(e.detail, producto)}
      >
        <ListItemText primary={`${producto.Value} - ${producto.Name}`} />
      </ListItem>
      <Divider />
    </Fragment>
  );
};
