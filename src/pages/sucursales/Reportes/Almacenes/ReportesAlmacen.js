import React, { useState, Fragment } from "react";

import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";
import { OBTENER_USUARIOS } from "../../../../gql/Catalogos/usuarios";
import CloseIcon from "@material-ui/icons/Close";
import { ClearOutlined } from "@material-ui/icons";
import ExportarTraspasos from "./ExportarTraspasos";
import TablaAlmacenFiltradas from "./TablaAlmacenFiltradas";
import { useQuery } from "@apollo/client";

import {
  OBTENER_ALMACENES,
  OBTENER_TRASPASOS,
} from "../../../../gql/Almacenes/Almacen";
import { useDebounce } from "use-debounce";
import AlmacenIcon from "../../../../icons/almacen.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
  CircularProgress: {
    width: "100%",
    height: 200,
    marginTop: 100,
    display: "flex",
    justifyContent: "center",
  },
}));

export default function ReportesAlmacen() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={AlmacenIcon}
              alt="icono almacen"
              style={{ width: 100 }}
            />
          </Box>
          Reportes Almacen
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Reportes Almacen
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <RenderComponentQuery />
      </Dialog>
    </>
  );
}

const RenderComponentQuery = () => {
  const classes = useStyles();
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [almacenOrigen, setAlmacenOrigen] = useState(null);
  const [almacenDestino, setAlmacenDestino] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputFilter, setFilter] = useState({
    empresa: sesion.empresa._id,
    sucursal: sesion.sucursal._id,
    producto: "",
    fecha_inicio: "",
    fecha_final: "",
    usuario: "",
  });
  const [page, setPage] = useState(0);
  const limit = 20;

  const [encargado, setEncargado] = useState("");
  const [value] = useDebounce(inputFilter, 1000);

  let almacenes = [];
  let traspasos = {docs:[], totalDocs: 0};
  let usuarios = [];

  const queryObtenerAlmacenes = useQuery(OBTENER_ALMACENES, {
    variables: {
      id: sesion.sucursal._id,
    },
    fetchPolicy: "network-only",
  });

  const queryObtenerUsuarios = useQuery(OBTENER_USUARIOS, {
    variables: {
      empresa: `${sesion.empresa._id}`,
      sucursal: `${sesion.sucursal._id}`,
      eliminado: false,
    },
    fetchPolicy: "network-only",
  });
  
  const traspasosAlmacenes = useQuery(OBTENER_TRASPASOS, {
    variables: {
      input: value,
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
  });

  const limpiarFiltros = () => {
    try {
      let filt = {
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
        producto: "",
        fecha_inicio: "",
        fecha_final: "",
        usuario: "",
      };

      setFilter(filt);
      setLoading(true);
      traspasosAlmacenes.refetch({
        input: filt,
      });
      setEncargado("");
      setAlmacenOrigen(null);
      setAlmacenDestino(null);
      setLoading(false);
    } catch (error) {}
  };

  if (queryObtenerAlmacenes.data) {
    almacenes = queryObtenerAlmacenes.data.obtenerAlmacenes;
  }

  const setDatosInput = (e) => {
    let fil = {
      ...inputFilter,
      [e.target.name]: e.target.value,
      almacen_destino: almacenDestino,
      almacen_origen: almacenOrigen,
    };
    setFilter(fil);
  };
  const setQueryAlmacenOrigen = (alm) => {
    let almDes = almacenDestino !== null ? almacenDestino._id : "";

    if (alm._id !== "") {
      setLoading(true);
      let fil = {
        ...inputFilter,
        almacen_origen: alm._id,
        almacen_destino: almDes,
      };

      traspasosAlmacenes.refetch({
        input: fil,
      });
    }
    setAlmacenOrigen(alm);
    setLoading(false);
  };
  const setQueryAlmacenDestino = (alm) => {
    let almOri = almacenOrigen !== null ? almacenOrigen._id : "";
    if (alm._id !== "") {
      let fil = {
        ...inputFilter,
        almacen_origen: almOri,
        almacen_destino: alm._id,
      };
      setLoading(true);
      traspasosAlmacenes.refetch({
        input: fil,
      });
    }

    setAlmacenDestino(alm);
    setLoading(false);
  };
  const setEncargadoInput = (enc) => {
    try {
      let almDes = almacenDestino !== null ? almacenDestino._id : "";
      let almOri = almacenOrigen !== null ? almacenOrigen._id : "";
      let encId = enc !== "" ? enc._id : "";
      let fil = {
        ...inputFilter,
        usuario: encId,
        almacen_destino: almDes,
        almacen_origen: almOri,
      };

      traspasosAlmacenes.refetch({
        input: fil,
      });
      setEncargado(enc);
      setLoading(false);
    } catch (error) {}
  };

  if (traspasosAlmacenes.data) {
    try {
      traspasos = traspasosAlmacenes.data.obtenerTraspasos;
    } catch (error) {}
  }

  if (queryObtenerUsuarios.data) {
    try {
      usuarios = queryObtenerUsuarios.data.obtenerUsuarios;
    } catch (error) {}
  }

  return (
    <DialogContent>
      <Grid container spacing={2}>
        <Grid item md={2} xs={12}>
          <Typography>Fecha inicio:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_inicio"
            variant="outlined"
            value={inputFilter.fecha_inicio}
            type="date"
            onChange={(e) => setDatosInput(e)}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Fecha fin:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_final"
            variant="outlined"
            type="date"
            onChange={(e) => setDatosInput(e)}
            value={inputFilter.fecha_final}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Encargado</Typography>
          <Box display="flex">
            <Autocomplete
              id="encargado"
              size="small"
              options={usuarios}
              getOptionLabel={(option) =>
                option.nombre ? `${option.nombre}` : ""
              }
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>{params.InputProps.endAdornment}</Fragment>
                    ),
                  }}
                />
              )}
              renderOption={(option) => (
                <Fragment>{`${option.nombre}`}</Fragment>
              )}
              onChange={(_, data) => setEncargadoInput(data)}
              getOptionSelected={(option, value) =>
                option.nombre === value.nombre
              }
              value={encargado.nombre ? encargado : null}
            />
          </Box>
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Producto:</Typography>
          <TextField
            fullWidth
            size="small"
            name="producto"
            variant="outlined"
            placeholder="Nombre, código, clave..."
            onChange={(e) => setDatosInput(e)}
            value={inputFilter.producto}
          />
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Almacen origen:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              id="form-almacen-origen"
              name="almacen_origen"
              onChange={(e) => setQueryAlmacenOrigen(e.target.value)}
              value={almacenOrigen !== null ? almacenOrigen : ""}
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              {almacenes.map((almacen) => (
                <MenuItem key={almacen._id} value={almacen}>
                  {almacen.nombre_almacen}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={2} xs={12}>
          <Typography>Almacen destino:</Typography>
          <FormControl variant="outlined" fullWidth size="small">
            <Select
              id="form-almacen-destino"
              name="almacen_destino"
              onChange={(e) => setQueryAlmacenDestino(e.target.value)}
              value={almacenDestino !== null ? almacenDestino : ""}
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              {almacenes.map((almacen) => (
                <MenuItem key={almacen._id} value={almacen}>
                  {almacen.nombre_almacen}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Box display="flex" mb={2}>
          <Button
            color="primary"
            startIcon={<ClearOutlined />}
            onClick={() => limpiarFiltros()}
          >
            Limpiar filtros
          </Button>
          <Box mx={1} />
          <ExportarTraspasos data={traspasos} refetch={traspasosAlmacenes.refetch} />
        </Box>
      </Grid>
      <Box>
        {traspasosAlmacenes.loading || loading ? (
          <div className={classes.CircularProgress}>
            <CircularProgress />
          </div>
        ) : (
          <TablaAlmacenFiltradas data={traspasos} page={page}
          setPage={setPage}
          limit={limit} />
        )}
      </Box>
    </DialogContent>
  );
};
