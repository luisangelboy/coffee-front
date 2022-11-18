import React, { Fragment, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  FormControl,
  Divider,
  MenuItem,
  Select,
  Container,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  Grid,
  IconButton,
} from "@material-ui/core";
import {
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { Add, Autorenew } from "@material-ui/icons";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import CatalogosProductosSAT from "./CatalogoProductosSAT";

import { useMutation } from "@apollo/client";
import {
  CREAR_CATEGORIA,
  CREAR_SUBCATEGORIA,
} from "../../../../../gql/Catalogos/categorias";
import { REGISTRAR_DEPARTAMENTO } from "../../../../../gql/Catalogos/departamentos";
import { REGISTRAR_MARCAS } from "../../../../../gql/Catalogos/marcas";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import CategoriasProducto from "./Categorias";
import SubcategoriasProducto from "./Subcategorias";
import DepartamentosProducto from "./Departamentos";
import MarcasProducto from "./Marcas";

const useStyles = makeStyles((theme) => ({
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  obligatorio: {
    color: "red",
  },
  titulos: {
    fontWeight: 500,
  },
  without_arrows: {
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
}));

export default function RegistroInfoGenerales({
  obtenerConsultasProducto,
  refetch,
}) {
  const classes = useStyles();
  const {
    datos_generales,
    setDatosGenerales,
    validacion,
    precios,
    setPrecios,
    centro_de_costos,
    setSubcostos,
  } = useContext(RegProductoContext);
  const {
    setSubcategorias,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
    presentaciones,
    update,
  } = useContext(RegProductoContext);
  const {
    categorias,
    departamentos,
    marcas,
    centro_costos,
    codigos,
  } = obtenerConsultasProducto;

  const obtenerCampos = (e) => {
    const { name, value } = e.target;
    if (name === "monedero_electronico") {
      if (!value) {
        setPrecios({
          ...precios,
          [name]: "",
        });
        return;
      }
      setPrecios({
        ...precios,
        [name]: parseFloat(value),
      });
      return;
    }
    if (name === "codigo_barras") {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        codigo_barras: value,
      });
    }
    if(name === "tipo_producto" && value !== "OTROS"){
      setPrecios({
        ...precios,
        granel: false,
        inventario: {
          ...precios.inventario,
          unidad_de_inventario: "Pz",
          codigo_unidad: "H87",
        },
        unidad_de_compra: {
          ...precios.unidad_de_compra,
          unidad: "Pz",
          codigo_unidad: "H87",
        },
      });
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad: "Pz",
        codigo_unidad: "H87",
      });
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        unidad: "Caja",
        codigo_unidad: "XBX",
      });
    }
    setDatosGenerales({
      ...datos_generales,
      [name]: value,
    });
  };

  const checkFarmacia = (e) => {
    setDatosGenerales({
      ...datos_generales,
      receta_farmacia: e.target.checked,
    });
  };

  const obtenerChecks = (e) => {
    const { name, checked } = e.target;
    if (name === "monedero" && checked) {
      setPrecios({
        ...precios,
        monedero_electronico: 1,
        monedero: checked,
      });
      return;
    }
    /* setPrecios({
			...precios,
			[name]: checked
		}); */
    if (name === "granel" && checked) {
      setPrecios({
        ...precios,
        [name]: checked,
        inventario: {
          ...precios.inventario,
          unidad_de_inventario: "Kg",
          codigo_unidad: "KGM",
        },
        unidad_de_compra: {
          ...precios.unidad_de_compra,
          unidad: "Kg",
          codigo_unidad: "KGM",
        },
      });
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad: "Kg",
        codigo_unidad: "KGM",
      });
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        unidad: "Costal",
        codigo_unidad: "KGM",
      });
    } else {
      setPrecios({
        ...precios,
        [name]: checked,
        inventario: {
          ...precios.inventario,
          unidad_de_inventario: "Pz",
          codigo_unidad: "H87",
        },
        unidad_de_compra: {
          ...precios.unidad_de_compra,
          unidad: "Pz",
          codigo_unidad: "H87",
        },
      });
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad: "Pz",
        codigo_unidad: "H87",
      });
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        unidad: "Caja",
        codigo_unidad: "XBX",
      });
    }
  };

  /* const obtenerIDs = (event, child) => {
    setDatosGenerales({
      ...datos_generales,
      [event.target.name]: event.target.value,
      [child.props.name]: child.props.id,
    });
    if (child.props.categoria) {
      const { subcategorias } = child.props.categoria;
      setSubcategorias(subcategorias);
    }
  }; */

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setDatosGenerales({
      ...datos_generales,
      codigo_barras,
    });
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      codigo_barras,
    });
  };

  const verificarCampoVacio = (campo) => {
    if (!precios.monedero_electronico) {
      setPrecios({
        ...precios,
        monedero_electronico: 1,
      });
    }
  };

  useEffect(() => {
    if (update) {
      const categoria = categorias.filter(
        (res) => res._id === datos_generales.id_categoria
      );
      const costos = centro_costos.filter(
        (res) => res._id === centro_de_costos.id_cuenta
      );
      if (categoria.length > 0) {
        setSubcategorias(categoria[0].subcategorias);
      }
      if (costos.length > 0) {
        setSubcostos(costos[0].subcuentas);
      }
    }
  }, [update]);

  return (
    <Fragment>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <FormControl
              variant="outlined"
              size="small"
              name="codigo_barras"
              fullWidth
              className={classes.without_arrows}
            >
              <Typography className={classes.titulos}>
                Código de barras
              </Typography>
              <OutlinedInput
                disabled={update && datos_generales.codigo_barras ? true : false}
                style={{ padding: 0 }}
                id="form-producto-codigo-barras"
                name="codigo_barras"
                value={
                  datos_generales.codigo_barras
                    ? datos_generales.codigo_barras
                    : ""
                }
                type="number"
                onChange={obtenerCampos}
                autoFocus
                endAdornment={
                  <InputAdornment position="start">
                    <IconButton
                      disabled={update && datos_generales.codigo_barras ? true : false}
                      onClick={() => GenCodigoBarras()}
                      /* edge="end" */
                      color="primary"
                      size="small"
                    >
                      <Autorenew />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography className={classes.titulos}>
              <span className={classes.obligatorio}>* </span>Clave alterna
            </Typography>
            <TextField
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.clave_alterna}
              name="clave_alterna"
              id="form-producto-clave-alterna"
              variant="outlined"
              value={
                datos_generales.clave_alterna
                  ? datos_generales.clave_alterna
                  : ""
              }
              helperText={validacion.message}
              onChange={obtenerCampos}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <Typography className={classes.titulos}>
              <span className={classes.obligatorio}>* </span>Tipo de producto
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.tipo_producto}
            >
              <Select
                id="form-producto-tipo"
                name="tipo_producto"
                value={
                  datos_generales.tipo_producto
                    ? datos_generales.tipo_producto
                    : ""
                }
                disabled={presentaciones.length}
                onChange={obtenerCampos}
              >
                <MenuItem value="">
                  <em>Selecciona uno</em>
                </MenuItem>
                <MenuItem value="ROPA">ROPA</MenuItem>
                <MenuItem value="CALZADO">CALZADO</MenuItem>
                <MenuItem value="OTROS">OTROS</MenuItem>
              </Select>
              <FormHelperText>{validacion.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item md={5} xs={12}>
            <CatalogosProductosSAT codigos={codigos} refetch={refetch} />
          </Grid>

          <Grid item md={4} xs={12}>
            <Typography className={classes.titulos}>
              <span className={classes.obligatorio}>* </span>Nombre comercial
            </Typography>
            <TextField
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.nombre_comercial}
              name="nombre_comercial"
              id="form-producto-nombre-comercial"
              variant="outlined"
              value={
                datos_generales.nombre_comercial
                  ? datos_generales.nombre_comercial
                  : ""
              }
              helperText={validacion.message}
              onChange={obtenerCampos}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography className={classes.titulos}>
              <span className={classes.obligatorio}>* </span>Nombre genérico
            </Typography>
            <TextField
              fullWidth
              size="small"
              error={validacion.error && !datos_generales.nombre_generico}
              name="nombre_generico"
              id="form-producto-nombre-generico"
              variant="outlined"
              value={
                datos_generales.nombre_generico
                  ? datos_generales.nombre_generico
                  : ""
              }
              helperText={validacion.message}
              onChange={obtenerCampos}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography className={classes.titulos}>Descripción</Typography>
            <TextField
              fullWidth
              size="small"
              name="descripcion"
              id="form-producto-descripcion"
              variant="outlined"
              value={
                datos_generales.descripcion ? datos_generales.descripcion : ""
              }
              onChange={obtenerCampos}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <CategoriasProducto refetch={refetch} categorias={categorias} />
          </Grid>
          <Grid item md={6} xs={12}>
            <SubcategoriasProducto refetch={refetch} />
          </Grid>
          <Grid item md={6} xs={12}>
            <DepartamentosProducto refetch={refetch} departamentos={departamentos} />
          </Grid>
          <Grid item md={6} xs={12}>
            <MarcasProducto refetch={refetch} marcas={marcas} />
          </Grid>
        </Grid>
        <Box display="flex" mt={4}>
          <Grid container>
            <Grid item md={3} xs={12}>
              {!update ? (
                <Box>
                  <Box>
                    <Typography>
                      <b>Granel</b>
                    </Typography>
                    <Divider />
                  </Box>
                  <div className={classes.formInput}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={precios.granel ? precios.granel : false}
                          onChange={obtenerChecks}
                          name="granel"
                          disabled={datos_generales.tipo_producto !== "OTROS" ? true : false}
                        />
                      }
                      label="Vender a granel"
                    />
                  </div>
                </Box>
              ) : null}
            </Grid>
            <Grid item md={3} xs={12}>
              <Box>
                <Typography>
                  <b>Farmacia</b>
                </Typography>
                <Divider />
              </Box>
              <div className={classes.formInput}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        datos_generales.receta_farmacia
                          ? datos_generales.receta_farmacia
                          : false
                      }
                      onChange={checkFarmacia}
                      name="receta_farmacia"
                    />
                  }
                  label="Necesita receta"
                  name="receta_farmacia"
                />
              </div>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box>
                <Typography>
                  <b>Monedero eléctronico</b>
                </Typography>
                <Divider />
              </Box>
              <Box>
                <Box className={classes.formInput}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={precios.monedero}
                        onChange={obtenerChecks}
                        name="monedero"
                      />
                    }
                    label="Monedero electrónico"
                  />
                  <TextField
                    type="number"
                    InputProps={{ inputProps: { min: 0 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    size="small"
                    label="Valor por punto"
                    name="monedero_electronico"
                    id="form-producto-monedero_electronico"
                    variant="outlined"
                    value={precios.monedero_electronico}
                    onChange={obtenerCampos}
                    disabled={precios.monedero ? false : true}
                    onBlur={() => verificarCampoVacio("monedero_electronico")}
                    error={precios.monedero_electronico === ""}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
}

const RegistrarNuevoSelect = ({
  tipo,
  name,
  refetch,
  subcategorias,
  setSubcategorias,
}) => {
  const [open, setOpen] = useState(false);
  const [validacion, setValidacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /*  Categorias Mutation */
  const [crearCategoria] = useMutation(CREAR_CATEGORIA);
  /*  Subcategorias Mutation */
  const [crearSubcategoria] = useMutation(CREAR_SUBCATEGORIA);
  /*  Departamentos Mutation */
  const [CrearDepartamentos] = useMutation(REGISTRAR_DEPARTAMENTO);
  /*  Marcas Mutation */
  const [CrearMarca] = useMutation(REGISTRAR_MARCAS);

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
      },
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    };
    if (tipo === "categoria") {
      variables = {
        input: {
          [name]: value,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      };
    }
    if (tipo === "subcategoria") {
      variables = {
        input: {
          [name]: value,
        },
        idCategoria: datos_generales.id_categoria,
      };
    }
    setLoading(true);
    try {
      switch (tipo) {
        case "categoria":
          const categoria_creada = await crearCategoria({ variables });
          refetch();
          const id_categoria = categoria_creada.data.crearCategoria._id;
          setDatosGenerales({
            ...datos_generales,
            categoria: value,
            id_categoria,
          });
          break;
        case "subcategoria":
          const subcategoria_creada = await crearSubcategoria(
            {  
              empresa : sesion.empresa._id,
              sucursal :sesion.sucursal._id,
              ...variables
            });
          refetch();
          const id_subcategoria =
            subcategoria_creada.data.crearSubcategoria.message;
          setSubcategorias([
            ...subcategorias,
            { _id: id_subcategoria, subcategoria: value },
          ]);
          setDatosGenerales({
            ...datos_generales,
            subcategoria: value,
            id_subcategoria,
          });
          break;
        case "departamento":
          const departamento_creado = await CrearDepartamentos({ variables });
          refetch();
          const id_departamento =
            departamento_creado.data.crearDepartamentos.message;
          setDatosGenerales({
            ...datos_generales,
            departamento: value,
            id_departamento,
          });
          break;
        case "marca":
          const marca_creada = await CrearMarca({ variables });
          refetch();
          const id_marca = marca_creada.data.crearMarcas.message;
          setDatosGenerales({
            ...datos_generales,
            marca: value,
            id_marca,
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
        disabled={tipo === "subcategoria" && !datos_generales.id_categoria ? true : false}
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
              inputProps={{ style: { textTransform: "uppercase" } }}
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
