import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from "@material-ui/core";
/* import "date-fns";
import local from "date-fns/locale/es";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"; */
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import ContainerRegistroAlmacen from "../../../Almacenes/RegistroAlmacen/ContainerRegistroAlmacen";
import { AlmacenProvider } from "../../../../../context/Almacenes/crearAlmacen";
import { unitCodes, unitCodes_granel } from "../unidades";

const useStyles = makeStyles((theme) => ({
  titulos: {
    fontWeight: 500,
  },
}));

export default function RegistroAlmacenInicial({
  obtenerConsultasProducto,
  refetch,
}) {
  const classes = useStyles();
  const {
    datos_generales,
    precios,
    setPrecios,
    almacen_inicial,
    setAlmacenInicial,
    selectedDate,
    setSelectedDate,
    update,
  } = useContext(RegProductoContext);
  const { almacenes } = obtenerConsultasProducto;

  /*ARMAR OBJETO DE INVENTARIO  */
  const obtenerInventario = (e, child) => {
    if (!e.target.value) {
      setPrecios({
        ...precios,
        inventario: { ...precios.inventario, [e.target.name]: "" },
      });
      return;
    }
    if (e.target.name === "unidad_de_inventario") {
      const { codigo_unidad, unidad } = child.props.unidad;
      setPrecios({
        ...precios,
        inventario: {
          ...precios.inventario,
          [e.target.name]: unidad,
          codigo_unidad,
        },
      });
      return;
    }
    setPrecios({
      ...precios,
      inventario: {
        ...precios.inventario,
        [e.target.name]: parseFloat(e.target.value),
      },
    });
  };

  const obtenerAlmacenInicial = (e) => {
    if (!e.target.value) {
      setAlmacenInicial({
        ...almacen_inicial,
        [e.target.name]: "",
      });
      return;
    }
    if (e.target.name === "almacen") {
      setAlmacenInicial({
        ...almacen_inicial,
        [e.target.name]: e.target.value,
      });
      return;
    }
    setAlmacenInicial({
      ...almacen_inicial,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const obtenerAlmacenes = (event, child) => {
    setAlmacenInicial({
      ...almacen_inicial,
      [event.target.name]: event.target.value,
      [child.props.name]: child.props.id,
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAlmacenInicial({
      ...almacen_inicial,
      fecha_de_expiracion: date,
    });
  };

  return (
    <Fragment>
      <Box my={2}>
        <Typography>
          <b>Inventario</b>
        </Typography>
        <Divider />
      </Box>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography className={classes.titulos}>
              Inventario mínimo
            </Typography>
            <TextField
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              size="small"
              name="inventario_minimo"
              id="form-producto-inventario_minimo"
              variant="outlined"
              value={precios.inventario.inventario_minimo}
              onChange={obtenerInventario}
              onFocus={(e) => {
                const { name, value } = e.target;
                if (parseFloat(value) === 0) {
                  setPrecios({
                    ...precios,
                    inventario: { ...precios.inventario, [name]: "" },
                  });
                }
              }}
              onBlur={(e) => {
                const { name, value } = e.target;
                if (value === "") {
                  setPrecios({
                    ...precios,
                    inventario: { ...precios.inventario, [name]: 0 },
                  });
                }
              }}
              error={precios.inventario.inventario_minimo === ""}
            />
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography className={classes.titulos}>
              Inventario máximo
            </Typography>
            <TextField
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              size="small"
              name="inventario_maximo"
              id="form-producto-inventario_maximo"
              variant="outlined"
              value={precios.inventario.inventario_maximo}
              onChange={obtenerInventario}
              onFocus={(e) => {
                const { name, value } = e.target;
                if (parseFloat(value) === 0) {
                  setPrecios({
                    ...precios,
                    inventario: { ...precios.inventario, [name]: "" },
                  });
                }
              }}
              onBlur={(e) => {
                const { name, value } = e.target;
                if (value === "") {
                  setPrecios({
                    ...precios,
                    inventario: { ...precios.inventario, [name]: 0 },
                  });
                }
              }}
              error={precios.inventario.inventario_maximo === ""}
            />
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          <Box>
            <Typography className={classes.titulos}>
              Unidad de inventario
            </Typography>
            <Box display="flex">
              <FormControl
                variant="outlined"
                fullWidth
                size="small"
                name="unidad_de_inventario"
              >
                {precios.granel ? (
                  <Select
                    name="unidad_de_inventario"
                    value={precios.inventario.unidad_de_inventario}
                    onChange={obtenerInventario}
                  >
                    {unitCodes_granel.map((res, index) => (
                      <MenuItem key={index} unidad={res} value={res.unidad}>
                        {res.unidad}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Select
                    name="unidad_de_inventario"
                    value={precios.inventario.unidad_de_inventario}
                    onChange={obtenerInventario}
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
        </Grid>
      </Grid>
      {update ? null : datos_generales.tipo_producto === "OTROS" ? (
        <Fragment>
          <Box my={3}>
            <Typography>
              <b>Almacen incial</b>
            </Typography>
            <Divider />
          </Box>
          <Grid container spacing={2} style={{ alignItems: "center" }}>
            <Grid item md={6} xs={12}>
              <Box>
                <Typography className={classes.titulos}>
                  Cantidad inicial en <b>{precios.unidad_de_compra.unidad}</b>
                </Typography>
                <Box display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    size="small"
                    name="cantidad"
                    variant="outlined"
                    value={almacen_inicial.cantidad}
                    onChange={obtenerAlmacenInicial}
                    onFocus={(e) => {
                      const { name, value } = e.target;
                      if (parseFloat(value) === 0) {
                        setAlmacenInicial({
                          ...almacen_inicial,
                          [name]: "",
                        });
                      }
                    }}
                    onBlur={(e) => {
                      const { name, value } = e.target;
                      if (value === "") {
                        setAlmacenInicial({
                          ...almacen_inicial,
                          [name]: 0,
                        });
                      }
                    }}
                    error={almacen_inicial.cantidad === ""}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <Box>
                <Typography className={classes.titulos}>Almacen</Typography>
                <Box display="flex" alignItems="center">
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="almacen"
                    error={
                      almacen_inicial.cantidad > 0 && !almacen_inicial.almacen
                    }
                  >
                    <Select
                      name="almacen"
                      value={almacen_inicial.almacen}
                      onChange={obtenerAlmacenes}
                    >
                      <MenuItem value="">
                        <em>Seleccione uno</em>
                      </MenuItem>
                      {almacenes ? (
                        almacenes.map((res) => {
                          return (
                            <MenuItem
                              name="id_almacen"
                              key={res._id}
                              value={res.nombre_almacen}
                              id={res._id}
                            >
                              {res.nombre_almacen}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem value="" />
                      )}
                    </Select>
                  </FormControl>
                  <AlmacenProvider>
                    <ContainerRegistroAlmacen
                      accion="registrar"
                      refetch={refetch}
                      fromEmergent={true}
                    />
                  </AlmacenProvider>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/*  <Box width="100%">
              <Typography>Fecha de expiración</Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={local}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    margin="dense"
                    id="date-picker-dialog"
                    placeholder="ex: DD/MM/AAAA"
                    format="dd/MM/yyyy"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </Box> */}
        </Fragment>
      ) : null}
    </Fragment>
  );
}
