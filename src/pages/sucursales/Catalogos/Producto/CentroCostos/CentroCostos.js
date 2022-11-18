import React, { Fragment, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import Add from "@material-ui/icons/Add";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import {
  CREAR_CUENTA,
  CREAR_SUBCUENTA,
} from "../../../../../gql/Catalogos/centroCostos";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  titulos: {
    fontWeight: 500,
  },
}));

export default function CentroCostos({ obtenerConsultasProducto, refetch }) {
  const classes = useStyles();
  const {
    centro_de_costos,
    setCentroDeCostos,
    subcostos,
    setSubcostos,
  } = useContext(RegProductoContext);
  const { centro_costos } = obtenerConsultasProducto;

  const obtenerAlmacenes = (event, child) => {
    setCentroDeCostos({
      ...centro_de_costos,
      [event.target.name]: event.target.value,
      [child.props.name]: child.props.id,
    });
    if (child.props.costos) {
      const { subcuentas } = child.props.costos;
      setSubcostos(subcuentas);
    }
  };

  return (
    <Fragment>
      <Box my={3}>
        <Typography>
          <b>Centro de costos</b>
        </Typography>
        <Divider />
      </Box>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Box>
            <Typography className={classes.titulos}>Cuenta</Typography>
            <Box display="flex">
              <FormControl
                variant="outlined"
                fullWidth
                size="small"
                name="cuenta"
              >
                <Select
                  name="cuenta"
                  value={centro_de_costos.cuenta ? centro_de_costos.cuenta : ""}
                  onChange={obtenerAlmacenes}
                >
                  <MenuItem value="">
                    <em>Seleccione uno</em>
                  </MenuItem>
                  {centro_costos ? (
                    centro_costos.map((res) => {
                      return (
                        <MenuItem
                          name="id_cuenta"
                          key={res._id}
                          value={res.cuenta}
                          id={res._id}
                          costos={res}
                        >
                          {res.cuenta}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" />
                  )}
                </Select>
              </FormControl>
              <RegistrarNuevoSelect
                tipo="cuenta"
                name="cuenta"
                refetch={refetch}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box>
            <Typography className={classes.titulos}>Subcuenta</Typography>
            <Box display="flex">
              <FormControl
                variant="outlined"
                fullWidth
                size="small"
                name="subcuenta"
              >
                <Select
                  name="subcuenta"
                  value={
                    centro_de_costos.subcuenta ? centro_de_costos.subcuenta : ""
                  }
                  onChange={obtenerAlmacenes}
                >
                  <MenuItem value="">
                    <em>Seleccione uno</em>
                  </MenuItem>
                  {subcostos ? (
                    subcostos.map((res) => {
                      return (
                        <MenuItem
                          name="id_subcuenta"
                          key={res._id}
                          value={res.subcuenta}
                          id={res._id}
                        >
                          {res.subcuenta}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem value="" />
                  )}
                </Select>
              </FormControl>
              <RegistrarNuevoSelect
                tipo="subcuenta"
                name="subcuenta"
                refetch={refetch}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}

const RegistrarNuevoSelect = ({ tipo, name, refetch }) => {
  const [open, setOpen] = useState(false);
  const [validacion, setValidacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    centro_de_costos,
    setCentroDeCostos,
    subcostos,
    setSubcostos,
  } = useContext(RegProductoContext);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /*  costos Mutation */
  const [crearCuenta] = useMutation(CREAR_CUENTA);
  /*  subcostos Mutation */
  const [crearSubcuenta] = useMutation(CREAR_SUBCUENTA);

  const handleToggle = () => {
    setOpen(!open);
  };

  const obtenerDatos = (e) => {
    setValue(e.target.value);
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!value) {
      setValidacion(true);
      return;
    }
    let variables = {
      input: {
        [name]: value,
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
      },
    };
    if (tipo === "subcuenta") {
      variables = {
        input: {
          [name]: value,
        },
        idCuenta: centro_de_costos.id_cuenta,
      };
    }

    setLoading(true);
    try {
      switch (tipo) {
        case "cuenta":
          const cuenta_creada = await crearCuenta({ variables });
          refetch();
          const id_cuenta = cuenta_creada.data.crearCuenta._id;
          setCentroDeCostos({
            ...centro_de_costos,
            cuenta: value,
            id_cuenta,
          });
          break;
        case "subcuenta":
          const subcuenta_creada = await crearSubcuenta(
            {   
              empresa: sesion.empresa._id,
              sucursal: sesion.sucursal._id,
              ...variables
            });
          refetch();
          const id_subcuenta = subcuenta_creada.data.crearSubcuenta._id;
          setSubcostos([...subcostos, { _id: id_subcuenta, subcuenta: value }]);
          setCentroDeCostos({
            ...centro_de_costos,
            subcuenta: value,
            id_subcuenta,
          });
          break;
        default:
          break;
      }
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
      handleToggle();
    } catch (error) {
      setAlert({ message: "Hubo un error", status: "error", open: true });
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Button
        color="primary"
        onClick={() => handleToggle()}
        disabled={tipo === "subcuenta" && !centro_de_costos.id_cuenta}
      >
        <Add />
      </Button>
      <Dialog
        open={open}
        onClose={handleToggle}
        aria-labelledby={`modal-title-${tipo}`}
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <DialogTitle id={`modal-title-${tipo}`}>Registrar {tipo}</DialogTitle>
        <DialogContent>
          <form id={`registro-${name}`} onSubmit={(e) => guardarDatos(e)}>
            <TextField
              error={validacion}
              name={name}
              autoFocus
              label={tipo}
              fullWidth
              variant="outlined"
              onChange={obtenerDatos}
              helperText={validacion ? "Campo obligatorio" : ""}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggle()} color="primary">
            Cancelar
          </Button>
          <Button
            /* onClick={() => guardarDatos()} */
            form={`registro-${name}`}
            type="submit"
            variant="contained"
            color="primary"
            endIcon={
              loading ? <CircularProgress color="inherit" size={18} /> : null
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
