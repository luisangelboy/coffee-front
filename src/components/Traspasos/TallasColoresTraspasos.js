import React, { useState, useEffect, useCallback } from "react";
import { Typography, Tooltip } from "@material-ui/core";

import { Box, Grid } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import { Done } from "@material-ui/icons";
import TablaPresentacionesNotOrigen from "./TablePresentacionesNotOrigen";
import CrearColorProducto from "../../pages/sucursales/Catalogos/Producto/TallasColores/crearColor";
import CrearTallasProducto from "../../pages/sucursales/Catalogos/Producto/TallasColores/crearTalla";

const useStyles = makeStyles((theme) => ({
  colorContainer: {
    border: "1px solid rgba(0,0,0, .3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    margin: 1,
    borderRadius: "15%",
    cursor: "pointer",
  },
}));

const GenCodigoBarras = () => {
  return Math.floor(
    Math.random() * (999999999999 - 100000000000 + 1) + 100000000000
  ).toString();
};

export default function ColoresTallas({
  producto,
  new_medidas,
  setNew_medidas,
  obtenerConsultasProducto,
  refetch,
}) {

  
  const [medidasSeleccionadas, setMedidasSeleccionadas] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  /* const medidas =
    producto.datos_generales.tipo_producto === "ROPA" ? [...obtenerConsultasProducto.tallas] : [...obtenerConsultasProducto.calzados]; */

  const [onUpdate, setOnUpdate] = useState([]);
  //console.log(data.obtenerConsultasProducto)

  const obtenerColoresSeleccinados = useCallback(() => {
    let colors = [];
    let medidas = [];

    let copy_presentaciones = [...new_medidas];

    //const copy_presentaciones = [];
    /* Queries */

    copy_presentaciones.forEach((element) => {
      //console.log('obtenerColoresSeleccinados', element)
      if (element.medida.color._id) colors.push(element.medida.color);
      if (element.medida.medida._id) medidas.push(element.medida.medida);
    });

    var hashColor = {};
    var hashMedida = {};
    const colores_existentes = colors.filter((color) => {
      var existColor = !hashColor[color._id];
      hashColor[color._id] = true;
      return existColor;
    });
    const medidas_existentes = medidas.filter((medida) => {
      var existMedida = !hashMedida[medida._id];
      hashMedida[medida._id] = true;
      return existMedida;
    });
    //console.log('colores_existentes', colores_existentes, 'medidas_existentes', medidas_existentes)
    setColoresSeleccionados([...colores_existentes]);
    setMedidasSeleccionadas([...medidas_existentes]);
  }, [new_medidas, setColoresSeleccionados, setMedidasSeleccionadas]);

  useEffect(() => {
    obtenerColoresSeleccinados();
  }, [obtenerColoresSeleccinados]);
  

  return (
    <div>
     
      <Box alignContent="center" m={5} mt={1}>
        <Grid container spacing={4}>
          {/*  {!datos.medidas_registradas ? (
            <Grid item md={4}>
              <Box width="100%">
                <Typography>Almacen</Typography>
                <Box display="flex">
                  <FormControl
                    disabled={presentaciones.length === 0 || from === "compra"}
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="almacen"
                    error={
                      presentaciones.length > 0 && !almacen_inicial.almacen
                    }
                  >
                    
                    {presentaciones.length > 0  ? (
                      <FormLabel>* Campo obligatorio</FormLabel>
                    ) : null}
                  </FormControl>
            
                </Box>
              </Box>
            </Grid>
          ) : null} */}

          <Grid item md={6}>
            <Box
              width="100%"
              style={
                onUpdate.length > 0
                  ? {
                      pointerEvents: "none",
                      opacity: 0.4,
                    }
                  : null
              }
            >
              <Box display="flex" alignItems="center">
                <Typography>
                  {producto.datos_generales.tipo_producto === "ROPA"
                    ? "Talla"
                    : "Número"}
                </Typography>
                <Box mx={1} />
                <CrearTallasProducto
                  tipo_producto={producto.datos_generales.tipo_producto}
                  setMedidasSeleccionadas={setMedidasSeleccionadas}
                  refetch={refetch}
                />
              </Box>
              {producto.datos_generales.tipo_producto === "ROPA" ? (
                obtenerConsultasProducto.tallas !== undefined ? (
                  <Grid container>
                    {obtenerConsultasProducto.tallas.map((talla, index) => (
                      <RenderTallas
                        producto={producto}
                        key={index}
                        talla={talla}
                        coloresSeleccionados={coloresSeleccionados}
                        medidasSeleccionadas={medidasSeleccionadas}
                        setMedidasSeleccionadas={setMedidasSeleccionadas}
                        datos={new_medidas}
                        setNew_medidas={setNew_medidas}
                      />
                    ))}
                  </Grid>
                ) : (
                  <div />
                )
              ) : obtenerConsultasProducto.calzados !== undefined ? (
                <Grid container>
                  {obtenerConsultasProducto.calzados.map((talla, index) => (
                    <RenderTallas
                      producto={producto}
                      key={index}
                      talla={talla}
                      coloresSeleccionados={coloresSeleccionados}
                      medidasSeleccionadas={medidasSeleccionadas}
                      setMedidasSeleccionadas={setMedidasSeleccionadas}
                      datos={new_medidas}
                      setNew_medidas={setNew_medidas}
                    />
                  ))}
                </Grid>
              ) : (
                <div />
              )}
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box
              width="100%"
              style={
                onUpdate.length > 0
                  ? {
                      pointerEvents: "none",
                      opacity: 0.4,
                    }
                  : null
              }
            >
              <Box display="flex" alignItems="center">
                <Typography>Color</Typography>
                <Box mx={1} />
                <CrearColorProducto refetch={refetch} />
              </Box>
              {obtenerConsultasProducto.colores !== undefined ? (
                <Grid container>
                  {obtenerConsultasProducto.colores.map((color, index) => (
                    <Colores
                      producto={producto}
                      key={index}
                      color={color}
                      coloresSeleccionados={coloresSeleccionados}
                      setColoresSeleccionados={setColoresSeleccionados}
                      medidasSeleccionadas={medidasSeleccionadas}
                      datos={new_medidas}
                      setNew_medidas={setNew_medidas}
                    />
                  ))}
                </Grid>
              ) : (
                <div />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box mt={2} />
        <TablaPresentacionesNotOrigen
          productoData={producto}
          datos={new_medidas}
          setOnUpdate={setOnUpdate}
          onUpdate={onUpdate}
          setNew_medidas={setNew_medidas}
        />
      </Box>
    </div>
  );
}

const RenderTallas = ({
  producto,
  talla,
  coloresSeleccionados,
  setMedidasSeleccionadas,
  medidasSeleccionadas,
  setNew_medidas,
  datos,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  /*  const {
    setPresentaciones,
    presentaciones,
    datos_generales,
    preciosP,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
  } = useContext(RegProductoContext); */
  const [selected, setSelected] = useState(false);

  const seleccionarMedidas = useCallback(() => {
    medidasSeleccionadas.forEach((res) => {
      if (res._id === talla._id) setSelected(true);
    });
  }, [talla._id, medidasSeleccionadas]);

  useEffect(() => {
    if (datos) {
      return seleccionarMedidas();
    }
  }, [datos, seleccionarMedidas]);

  const handleAddTallas = (value) => {
    const medidas_seleccionadas_temp = [...medidasSeleccionadas];
    //console.log('handleAddTallas', datos)
    if (!selected) {
      medidas_seleccionadas_temp.push(talla);
      setSelected(value);
    } else {
      medidas_seleccionadas_temp.forEach((res, index) => {
        if (res._id === talla._id) {
          medidas_seleccionadas_temp.splice(index, 1);
          setSelected(value);
          /*     presentaciones.forEach((presentacion) => {
            if (!presentacion.nuevo) {
              if (presentacion.medida._id === res._id) {
                setPresentacionesEliminadas([
                  ...presentaciones_eliminadas,
                  presentacion,
                ]);
              }
            }
          }); */
        }
      });
    }

    let presentacion_temp = [];
    const array_medidad_finales = [...datos];
    const { iva, ieps } = producto.precios;
    //const array_medidad_finales = [];
    if (!coloresSeleccionados.length && !array_medidad_finales.length) {
      /* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        let iva_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
        );
        let ieps_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
        );
        presentacion_temp.push({
          medida: {
            existencia: false,
            codigo_barras: GenCodigoBarras(),
            nombre_comercial: producto.datos_generales.nombre_comercial,
            medida: producto_medida,
            color: { nombre: "", hex: "" },
            //precios: producto.precios,
            precio: producto.precios.precios_producto[0].precio_neto,
            cantidad: 0,
            //nuevo: true
            precio_unidad: {
              numero_precio: 1,
              precio_venta: producto.precios.precios_producto[0].precio_venta,
              precio_neto: producto.precios.precios_producto[0].precio_neto,
              unidad_mayoreo: 0,
              iva_precio: parseFloat(iva_precio.toFixed(2)),
              ieps_precio: parseFloat(ieps_precio.toFixed(2)),
              utilidad: producto.precios.precios_producto[0].utilidad,
              unidad_maxima: false,
            },
          },

          nuevaCantidad: 0,
        });
      }
    } else if (
      !coloresSeleccionados.length &&
      array_medidad_finales.length > 0
    ) {
      /* SI NO HAY COLORES REGISTRADOS PERO YA HAY TALLAS SE AGREGAN MAS */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        const result = array_medidad_finales.filter(
          (res) => res.medida.medida._id === producto_medida._id
        );
        let iva_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
        );
        let ieps_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
        );
        if (result.length) {
          presentacion_temp.push(result[0]);
        } else {
          presentacion_temp.push({
            medida: {
              existencia: false,
              codigo_barras: GenCodigoBarras(),
              nombre_comercial: producto.datos_generales.nombre_comercial,
              medida: producto_medida,
              color: { nombre: "", hex: "" },
              //precios:producto.precios,
              precio: producto.precios.precios_producto[0].precio_neto,
              cantidad: 0,
              //nuevo: true
              precio_unidad: {
                numero_precio: 1,
                precio_venta: producto.precios.precios_producto[0].precio_venta,
                precio_neto: producto.precios.precios_producto[0].precio_neto,
                unidad_mayoreo: 0,
                iva_precio: parseFloat(iva_precio.toFixed(2)),
                ieps_precio: parseFloat(ieps_precio.toFixed(2)),
                utilidad: producto.precios.precios_producto[0].utilidad,
                unidad_maxima: false,
              },
            },

            nuevaCantidad: 0,
          });
        }
      }
    } else if (
      coloresSeleccionados.length > 0 &&
      medidas_seleccionadas_temp.length === 1 &&
      value
    ) {
      /* SI HAY COLORES SE LE AGREGA TALLA POR PRIMERA VEZ */
      for (let i = 0; i < array_medidad_finales.length; i++) {
        for (let k = 0; k < medidas_seleccionadas_temp.length; k++) {
          presentacion_temp.push({
            medida: {
              existencia: array_medidad_finales[i].medida.existencia,
              codigo_barras: array_medidad_finales[i].medida.codigo_barras,
              nombre_comercial:
                array_medidad_finales[i].medida.nombre_comercial,
              medida: medidas_seleccionadas_temp[k],
              color: array_medidad_finales[i].medida.color,
              //precios:producto.precios,
              precio: array_medidad_finales[i].medida.precio,
              cantidad: array_medidad_finales[i].medida.cantidad,
              //nuevo: true
              precio_unidad: array_medidad_finales[i].medida.precio_unidad,
            },

            nuevaCantidad: array_medidad_finales[i].nuevaCantidad,
          });
        }
      }
    } else if (
      coloresSeleccionados.length > 0 &&
      medidas_seleccionadas_temp.length > 0
    ) {
      /* YA HAY COLORES Y MEDIDAS EN LAS PRESENTACIONES, SE AGREGAN NORMAL */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        for (let k = 0; k < coloresSeleccionados.length; k++) {
          const producto_color = coloresSeleccionados[k];
          const presentacion_existente = array_medidad_finales.filter(
            (producto_array_final) =>
              producto_array_final.medida.medida._id === producto_medida._id &&
              producto_color._id === producto_array_final.medida.color._id
          );
          let iva_precio = parseFloat(
            producto.precios.precios_producto[0].precio_venta *
              parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
          );
          let ieps_precio = parseFloat(
            producto.precios.precios_producto[0].precio_venta *
              parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
          );
          if (!presentacion_existente.length) {
            //console.log('YA HAY COLORES Y MEDIDAS EN LAS PRESENTACIONES, SE AGREGAN NORMAL' , array_medidad_finales, producto_medida, producto_color)
            presentacion_temp.push({
              medida: {
                existencia: false,
                codigo_barras: GenCodigoBarras(),
                nombre_comercial: producto.datos_generales.nombre_comercial,
                medida: producto_medida,
                color: producto_color,
                //precios:producto.precios,
                precio: producto.precios.precios_producto[0].precio_neto,
                cantidad: 0,
                precio_unidad: {
                  numero_precio: 1,
                  precio_venta:
                    producto.precios.precios_producto[0].precio_venta,
                  precio_neto: producto.precios.precios_producto[0].precio_neto,
                  unidad_mayoreo: 0,
                  iva_precio: parseFloat(iva_precio.toFixed(2)),
                  ieps_precio: parseFloat(ieps_precio.toFixed(2)),
                  utilidad: producto.precios.precios_producto[0].utilidad,
                  unidad_maxima: false,
                },
              },
              nuevaCantidad: 0,
            });
          } else {
            presentacion_temp.push(presentacion_existente[0]);
          }
        }
      }
    } else if (
      coloresSeleccionados.length > 0 &&
      !medidas_seleccionadas_temp.length
    ) {
      /* SI NO HAY TALLAS SE VUELVE A LISTAR LOS COLORES QUE YA ESTABAN EN PRESENTACIONES */
      const presentaciones_existentes = array_medidad_finales.filter(
        (producto) => producto.medida.medida._id
      );
      if (presentaciones_existentes.length) {
        for (let x = 0; x < array_medidad_finales.length; x++) {
          const objeto_presentaciones_final = array_medidad_finales[x];
          presentacion_temp.push({
            medida: {
              existencia: objeto_presentaciones_final.medida.existencia,
              codigo_barras: objeto_presentaciones_final.medida.codigo_barras,
              nombre_comercial:
                objeto_presentaciones_final.medida.nombre_comercial,
              medida: objeto_presentaciones_final.medida.medida,
              color: objeto_presentaciones_final.medida.color,
              //precios:producto.precios,
              precio: objeto_presentaciones_final.medida.precio,
              cantidad: objeto_presentaciones_final.medida.cantidad,
              //nuevo: true
              precio_unidad: objeto_presentaciones_final.precio_unidad,
            },

            nuevaCantidad: objeto_presentaciones_final.nuevaCantidad,
          });
        }
      }
    }

    setMedidasSeleccionadas([...medidas_seleccionadas_temp]);
    setNew_medidas(presentacion_temp);
  };

  return (
    <Grid item>
      <div
        className={classes.colorContainer}
        onClick={() => handleAddTallas(!selected)}
        style={
          selected
            ? {
                backgroundColor: theme.palette.primary.main,
              }
            : null
        }
      >
      <Tooltip
        title={talla.talla}
        placement="top"
        arrow
        TransitionComponent={Zoom}
      >
        <Typography
          variant="button"
          noWrap
          style={{
            color: theme.palette.getContrastText(
              selected ? theme.palette.primary.main : "#FFFFFF"
            ),
            fontSize: 16,
          }}
        >
          {talla.talla}
        </Typography>
      </Tooltip>  
      </div>
    </Grid>
  );
};

const Colores = ({
  producto,
  color,
  coloresSeleccionados,
  setColoresSeleccionados,
  medidasSeleccionadas,
  datos,
  setNew_medidas,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const [selected, setSelected] = useState(false);

  const seleccionarColores = useCallback(() => {
    coloresSeleccionados.forEach((res) => {
      if (res._id === color._id) setSelected(true);
    });
  }, [color._id, coloresSeleccionados]);

  useEffect(() => {
    if (producto) {
      return seleccionarColores();
    }
  }, [producto, seleccionarColores]);

  const obtenerColores = (value) => {
    if (!selected) {
      coloresSeleccionados.push(color);
      setSelected(value);
    } else {
      coloresSeleccionados.forEach((res, index) => {
        if (res._id === color._id) {
          coloresSeleccionados.splice(index, 1);
          setSelected(value);
          /*  new_medidas.forEach((presentacion) => {
            if (!presentacion.nuevo) {
              if (presentacion.color._id === res._id) {
                setPresentacionesEliminadas([
                  ...presentaciones_eliminadas,
                  presentacion,
                ]);
              }
            }
          }); */
        }
      });
    }
    let presentacion_temp = [];
    const array_medidad_finales = [...datos];
    const { iva, ieps } = producto.precios;
    if (!medidasSeleccionadas.length && !array_medidad_finales.length) {
      /* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        let iva_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
        );
        let ieps_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
        );
        presentacion_temp.push({
          medida: {
            existencia: false,
            codigo_barras: GenCodigoBarras(),
            nombre_comercial: producto.datos_generales.nombre_comercial,
            medida: {},
            color: producto_color,
            //precios:producto.precios,
            precio: producto.precios.precios_producto[0].precio_neto,
            cantidad: 0,
            //nuevo: true
            precio_unidad: {
              numero_precio: 1,
              precio_venta: producto.precios.precios_producto[0].precio_venta,
              precio_neto: producto.precios.precios_producto[0].precio_neto,
              unidad_mayoreo: 0,
              iva_precio: parseFloat(iva_precio.toFixed(2)),
              ieps_precio: parseFloat(ieps_precio.toFixed(2)),
              utilidad: producto.precios.precios_producto[0].utilidad,
              unidad_maxima: false,
            },
          },

          nuevaCantidad: 0,
        });
      }
    } else if (
      !medidasSeleccionadas.length &&
      array_medidad_finales.length > 0
    ) {
      /* SI YA HAY COLORES REGISTRADOS SE AGREGAN MAS */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        const result = array_medidad_finales.filter(
          (res) => res.medida.color._id === producto_color._id
        );
        let iva_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
        );
        let ieps_precio = parseFloat(
          producto.precios.precios_producto[0].precio_venta *
            parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
        );
        if (result.length) {
          presentacion_temp.push(result[0]);
        } else {
          presentacion_temp.push({
            medida: {
              existencia: false,
              codigo_barras: GenCodigoBarras(),
              nombre_comercial: producto.datos_generales.nombre_comercial,
              medida: {},
              color: producto_color,
              //precios:producto.precios,
              precio: producto.precios.precios_producto[0].precio_neto,
              cantidad: 0,
              //nuevo: true
              precio_unidad: {
                numero_precio: 1,
                precio_venta: producto.precios.precios_producto[0].precio_venta,
                precio_neto: producto.precios.precios_producto[0].precio_neto,
                unidad_mayoreo: 0,
                iva_precio: parseFloat(iva_precio.toFixed(2)),
                ieps_precio: parseFloat(ieps_precio.toFixed(2)),
                utilidad: producto.precios.precios_producto[0].utilidad,
                unidad_maxima: false,
              },
            },

            nuevaCantidad: 0,
          });
        }
      }
    } else if (
      medidasSeleccionadas.length > 0 &&
      coloresSeleccionados.length === 1 &&
      value
    ) {
      /* SI YA HAY TALLAS SE LE AGREGA EL COLOR POR PRIMERA VEZ */
      for (let i = 0; i < array_medidad_finales.length; i++) {
        for (let k = 0; k < coloresSeleccionados.length; k++) {
          presentacion_temp.push({
            medida: {
              existencia: array_medidad_finales[i].medida.existencia,
              codigo_barras: array_medidad_finales[i].medida.codigo_barras,
              nombre_comercial:
                array_medidad_finales[i].medida.nombre_comercial,
              medida: array_medidad_finales[i].medida.medida,
              color: coloresSeleccionados[k],
              precio: array_medidad_finales[i].medida.precio,
              cantidad: array_medidad_finales[i].medida.cantidad,

              //nuevo: true
              precio_unidad: array_medidad_finales[i].medida.precio_unidad,
            },

            nuevaCantidad: array_medidad_finales[i].nuevaCantidad,
          });
        }
      }
    } else if (
      medidasSeleccionadas.length > 0 &&
      coloresSeleccionados.length > 0
    ) {
      /* YA HAY TALLAS Y MEIDAS EN LAS PRESENTACIONES, SE REGISTRAN NORMAL */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        for (let k = 0; k < medidasSeleccionadas.length; k++) {
          const producto_medida = medidasSeleccionadas[k];
          const presentacion_existente = array_medidad_finales.filter(
            (producto_array_final) =>
              producto_array_final.medida.medida._id === producto_medida._id &&
              producto_color._id === producto_array_final.medida.color._id
          );
          let iva_precio = parseFloat(
            producto.precios.precios_producto[0].precio_venta *
              parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
          );
          let ieps_precio = parseFloat(
            producto.precios.precios_producto[0].precio_venta *
              parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
          );
          if (!presentacion_existente.length) {
            presentacion_temp.push({
              medida: {
                existencia: false,
                codigo_barras: GenCodigoBarras(),
                nombre_comercial: producto.datos_generales.nombre_comercial,
                medida: producto_medida,
                color: producto_color,
                // precios:producto.precios,
                precio: producto.precios.precios_producto[0].precio_neto,
                cantidad: 0,
                //nuevo: true
                precio_unidad: {
                  numero_precio: 1,
                  precio_venta:
                    producto.precios.precios_producto[0].precio_venta,
                  precio_neto: producto.precios.precios_producto[0].precio_neto,
                  unidad_mayoreo: 0,
                  iva_precio: parseFloat(iva_precio.toFixed(2)),
                  ieps_precio: parseFloat(ieps_precio.toFixed(2)),
                  utilidad: producto.precios.precios_producto[0].utilidad,
                  unidad_maxima: false,
                },
              },

              nuevaCantidad: 0,
            });
          } else {
            presentacion_temp.push(presentacion_existente[0]);
          }
        }
      }
    } else if (
      medidasSeleccionadas.length > 0 &&
      !coloresSeleccionados.length
    ) {
      /* SI NO HAY COLORES SE VUELVE A LISTAR LAS TALLAS QUE YA ESTABAN EN PRESENTACIONES */
      const presentaciones_existentes = array_medidad_finales.filter(
        (producto) => producto.medida.color._id
      );
      if (presentaciones_existentes.length) {
        for (let x = 0; x < array_medidad_finales.length; x++) {
          const objeto_presentaciones_final = array_medidad_finales[x];
          presentacion_temp.push({
            medida: {
              existencia: objeto_presentaciones_final.medida.existencia,
              codigo_barras: objeto_presentaciones_final.medida.codigo_barras,
              nombre_comercial:
                objeto_presentaciones_final.medida.nombre_comercial,
              medida: objeto_presentaciones_final.medida.medida,
              color: { nombre: "", hex: "" },
              // precios:producto.precios,
              precio: objeto_presentaciones_final.medida.precio,
              cantidad: objeto_presentaciones_final.medida.cantidad,
              //nuevo: true
              precio_unidad: objeto_presentaciones_final.medida.precio_unidad,
            },

            nuevaCantidad: objeto_presentaciones_final.nuevaCantidad,
          });
        }
      }
    }

    setColoresSeleccionados([...coloresSeleccionados]);
    setNew_medidas(presentacion_temp);
  };

  return (
    <Grid item>
      <Tooltip
        title={color.nombre}
        placement="top"
        arrow
        TransitionComponent={Zoom}
      >
        <div
          className={classes.colorContainer}
          style={{
            backgroundColor: color.hex,
            color: theme.palette.getContrastText(color.hex),
          }}
          onClick={() => obtenerColores(!selected, color)}
        >
          {selected ? <Done /> : null}
        </div>
      </Tooltip>
    </Grid>
  );
};
