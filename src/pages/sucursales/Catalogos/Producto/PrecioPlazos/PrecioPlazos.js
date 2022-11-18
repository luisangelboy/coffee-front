import React, { Fragment, useContext, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import TablaPreciosPlazos from "./tabla_precios";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { unitCodes, unitCodes_granel } from "../unidades";

const useStyles = makeStyles((theme) => ({
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    "& > .precios-box": {
      margin: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    },
  },
}));

export default function PrecioPlazos() {
  const classes = useStyles();
  const {
    precios,
    preciosPlazos,
    setPreciosPlazos,
    unidadesVenta,
    unidadVentaXDefecto,
  } = useContext(RegProductoContext);
  const [plazo, setPlazo] = useState({
    plazo: "1",
    unidad: precios.granel ? "Costal" : "Pz",
    codigo_unidad: precios.granel ? "KGM" : "H87",
    precio: 0,
  });

  const obtenerPlazos = (e, child) => {
    if (e.target.name === "precio") {
      setPlazo({
        ...plazo,
        [e.target.name]: parseFloat(e.target.value),
      });
      return;
    }
    if (e.target.name === "unidad") {
      const { codigo_unidad, unidad } = child.props.unidad;
      setPlazo({
        ...plazo,
        unidad,
        codigo_unidad,
      });
      return;
    }
    setPlazo({
      ...plazo,
      [e.target.name]: e.target.value,
    });
  };

  const guardarPlazo = () => {
    if (!plazo.plazo || !plazo.precio || !plazo.unidad) return;
    switch (plazo.unidad) {
      case "Pz":
        setPreciosPlazos({
          ...preciosPlazos,
          precio_piezas: [...preciosPlazos.precio_piezas, plazo],
        });
        break;
      case "Caja":
        setPreciosPlazos({
          ...preciosPlazos,
          precio_cajas: [...preciosPlazos.precio_cajas, plazo],
        });
        break;
      case "Costal":
        setPreciosPlazos({
          ...preciosPlazos,
          precio_costales: [...preciosPlazos.precio_costales, plazo],
        });
        break;
      default:
        break;
    }
    setPlazo({
      ...plazo,
      precio: 0,
    });
  };

  return (
    <Fragment>
      <Box className={classes.formInputFlex}>
        <Typography className="precios-box">
          Precio venta de <b>{unidadVentaXDefecto.unidad}</b> con
          impuestos(NETO): <b>${unidadVentaXDefecto.precio}</b>
        </Typography>
        {unidadesVenta.map((unidades, index) => {
          if (!unidades.default)
            return (
              <Typography key={index} className="precios-box">
                Precio venta de <b>{unidades.unidad}</b> con impuestos(NETO):{" "}
                <b>${unidades.precio}</b>
              </Typography>
            );
          return null;
        })}
      </Box>
      <Divider />
      <Box className={classes.formInputFlex} justifyContent="center">
        <Box>
          <Typography>Plazo</Typography>
          <Box display="flex">
            <FormControl variant="outlined" fullWidth size="small" name="plazo">
              <Select name="plazo" value={plazo.plazo} onChange={obtenerPlazos}>
                <MenuItem value="1">1 Mes</MenuItem>
                <MenuItem value="2">2 Meses</MenuItem>
                <MenuItem value="6">6 Meses</MenuItem>
                <MenuItem value="8">8 Meses</MenuItem>
                <MenuItem value="12">12 Meses</MenuItem>
                <MenuItem value="18">18 Meses</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography>Unidad</Typography>
          <Box display="flex">
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
              name="unidad"
            >
              {precios.granel ? (
                <Select
                  name="unidad"
                  value={plazo.unidad}
                  onChange={obtenerPlazos}
                >
                  {unitCodes_granel.map((res, index) =>
                    res.unidad === "Costal" ? (
                      <MenuItem key={index} unidad={res} value={res.unidad}>
                        {res.unidad}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
              ) : (
                <Select
                  name="unidad"
                  value={plazo.unidad}
                  onChange={obtenerPlazos}
                >
                  {unitCodes.map((res, index) => (
                    <MenuItem key={index} unidad={res} value={res.unidad}>
                      {res.unidad}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography>Precio</Typography>
          <TextField
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            size="small"
            name="precio"
            value={plazo.precio}
            variant="outlined"
            onChange={obtenerPlazos}
          />
        </Box>
        <Box display="flex" alignItems="flex-end">
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => guardarPlazo()}
          >
            Agregar
          </Button>
        </Box>
      </Box>
      <Box>
        <Grid container spacing={2} justifyContent="center">
          {precios.granel ? (
            <Fragment>
              <Grid item lg={3}>
                <Typography variant="h6" align="center">
                  Costal
                </Typography>
                <TablaPreciosPlazos precios={preciosPlazos.precio_costales} />
              </Grid>
            </Fragment>
          ) : (
            <Fragment>
              <Grid item lg={3}>
                <Typography variant="h6" align="center">
                  Piezas
                </Typography>
                <TablaPreciosPlazos precios={preciosPlazos.precio_piezas} />
              </Grid>
              <Grid item lg={3}>
                <Typography variant="h6" align="center">
                  Cajas
                </Typography>
                <TablaPreciosPlazos precios={preciosPlazos.precio_cajas} />
              </Grid>
            </Fragment>
          )}
        </Grid>
      </Box>
    </Fragment>
  );
}
