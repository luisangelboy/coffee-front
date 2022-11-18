import React, { Fragment, useContext } from "react";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { RegProductoContext } from "../../../context/Catalogos/CtxRegProducto";
import CatalogosProductosSAT from "../../sucursales/Catalogos/Producto/DatosGenerales/CatalogoProductosSAT";

const useStyles = makeStyles((theme) => ({
  titulos: {
    fontWeight: 500,
    "& .obligatorio": {
      color: "red",
    },
  },
}));

export default function RegistroInformacionRapido({
  setAbrirTallaColor,
  setCantidad,
  cantidad,
  obtenerConsultasProducto,
  refetch,
}) {
  const {
    datos_generales,
    precios,
    setPrecios,
    setDatosGenerales,
    validacion,
  } = useContext(RegProductoContext);
  const {
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    setUnidadVentaSecundaria,
    unidadVentaSecundaria,
    update,
  } = useContext(RegProductoContext);

  const obtenerCampos = (e) => {
    if (e.target.name === "codigo_barras") {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        codigo_barras: e.target.value,
      });
    }
    setDatosGenerales({
      ...datos_generales,
      [e.target.name]: e.target.value,
    });

    if (e.target.value === "CALZADO" || e.target.value === "ROPA") {
      setAbrirTallaColor(true);
    }
  };

  const checkFarmacia = (e) => {
    setDatosGenerales({
      ...datos_generales,
      receta_farmacia: e.target.checked,
    });
  };

  const obtenerChecks = (e) => {
    if (e.target.name === "granel" && e.target.checked) {
      setPrecios({
        ...precios,
        [e.target.name]: e.target.checked,
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
        [e.target.name]: e.target.checked,
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

  const classes = useStyles();

  return (
    <Fragment>
      <Box mb={2}>
        <Typography>
          <b>Información General</b>
        </Typography>
      </Box>
      <Divider />
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <FormControl
            variant="outlined"
            size="small"
            name="codigo_barras"
            fullWidth
          >
            <Typography className={classes.titulos}>Código de barras</Typography>
            <OutlinedInput
              disabled={update && datos_generales.codigo_barras}
              style={{ padding: 0 }}
              id="form-producto-codigo-barras"
              name="codigo_barras"
              value={
                datos_generales.codigo_barras
                  ? datos_generales.codigo_barras
                  : ""
              }
              onChange={obtenerCampos}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    disabled={update && datos_generales.codigo_barras}
                    onClick={() => GenCodigoBarras()}
                    /* edge="end" */
                    color="primary"
                    variant="outlined"
                    size="large"
                  >
                    Generar
                  </Button>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item md={3} xs={12}>
          <Typography className={classes.titulos}>
            <span className="obligatorio">* </span>Clave alterna
          </Typography>
          <TextField
            fullWidth
            size="small"
            error={validacion.error && !datos_generales.clave_alterna}
            name="clave_alterna"
            id="form-producto-clave-alterna"
            variant="outlined"
            value={
              datos_generales.clave_alterna ? datos_generales.clave_alterna : ""
            }
            helperText={validacion.message}
            onChange={obtenerCampos}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Typography className={classes.titulos}>
            <span className="obligatorio">* </span>Nombre comercial
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
        <Grid item md={3} xs={12}>
          <CatalogosProductosSAT
            refetch={refetch}
            codigos={obtenerConsultasProducto.codigos}
          />
        </Grid>
        <Grid
          item
          md={datos_generales.tipo_producto === "OTROS" ? 4 : 8}
          xs={12}
        >
          <Typography className={classes.titulos}>
            <span className="obligatorio">* </span>Nombre genérico
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
        <Grid
          item
          md={datos_generales.tipo_producto === "OTROS" ? 2 : 4}
          xs={12}
        >
          <Typography className={classes.titulos}>
            <span className="obligatorio">* </span>Tipo de producto
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
        {datos_generales.tipo_producto === "OTROS" ? (
          <Fragment>
            <Grid item md={2} xs={12}>
              <Typography className={classes.titulos}>
                <span className="obligatorio">* </span>Cantidad en Almacen
              </Typography>
              <TextField
                fullWidth
                size="small"
                error={validacion.error && !cantidad}
                name="cantidad"
                type="number"
                id="form-producto-nombre-generico"
                variant="outlined"
                value={cantidad ? cantidad : ""}
                helperText={validacion.message}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography  className={classes.titulos}>Granel</Typography>
              <FormControlLabel
                control={<Checkbox onChange={obtenerChecks} name="granel" />}
                label="Vender a granel"
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <Typography  className={classes.titulos}>Medicamento</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    // checked={datos_generales.receta_farmacia ? datos_generales.receta_farmacia : false}
                    onChange={checkFarmacia}
                    name="receta_farmacia"
                  />
                }
                label="Necesita receta"
                name="receta_farmacia"
              />
            </Grid>
          </Fragment>
        ) : null}
      </Grid>
    </Fragment>
  );
}
