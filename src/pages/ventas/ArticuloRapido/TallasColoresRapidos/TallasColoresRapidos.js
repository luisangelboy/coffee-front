import React, { useContext, useState, useEffect, useCallback } from "react";
import { Typography, Divider, Tooltip } from "@material-ui/core";
import { Box, Grid } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";

import { Done } from "@material-ui/icons";
import TablaPresentaciones from "./TablaPresentaciones";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
// import { AlmacenProvider } from '../../../../context/Almacenes/crearAlmacen';
// import ContainerRegistroAlmacen from '../../../sucursales/Almacenes/RegistroAlmacen/ContainerRegistroAlmacen';
import CrearColorProducto from "../../../sucursales/Catalogos/Producto/TallasColores/crearColor";
import CrearTallasProducto from "../../../sucursales/Catalogos/Producto/TallasColores/crearTalla";

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

export default function TallasColoresRapidos({
  obtenerConsultasProducto,
  refetch,
  datos,
  from,
}) {
  const {
    // almacen_inicial,
    // setAlmacenInicial,
    presentaciones,
    datos_generales,
  } = useContext(RegProductoContext);
  const { colores, tallas, calzados } = obtenerConsultasProducto;
  const [medidasSeleccionadas, setMedidasSeleccionadas] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const medidas =
    datos_generales.tipo_producto === "ROPA" ? [...tallas] : [...calzados];
  const [onUpdate, setOnUpdate] = useState([]);

  const obtenerColoresSeleccinados = useCallback(() => {
    let colors = [];
    let medidas = [];
    const copy_presentaciones = [...presentaciones];

    copy_presentaciones.forEach((element) => {
      if (element.color._id) colors.push(element.color);
      if (element.medida._id) medidas.push(element.medida);
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

    setColoresSeleccionados([...colores_existentes]);
    setMedidasSeleccionadas([...medidas_existentes]);
  }, [presentaciones]);

  // const obtenerAlmacenes = (event, child) => {
  // 	setAlmacenInicial({
  // 		...almacen_inicial,
  // 		[event.target.name]: event.target.value,
  // 		[child.props.name]: child.props.id
  // 	});
  // };

  useEffect(() => {
    obtenerColoresSeleccinados();
  }, [obtenerColoresSeleccinados]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={9}>
          <TablaPresentaciones
            from={from}
            setOnUpdate={setOnUpdate}
            onUpdate={onUpdate}
          />
        </Grid>
        <Grid item md={3}>
          <Box
            width="100%"
            my={2}
            style={
              onUpdate.length > 0
                ? {
                    pointerEvents: "none",
                    opacity: 0.4,
                  }
                : null
            }
          >
            <Typography>
              {datos_generales.tipo_producto === "ROPA" ? "Talla" : "Número"}
            </Typography>
            <CrearTallasProducto
              setMedidasSeleccionadas={setMedidasSeleccionadas}
              refetch={refetch}
            />
            <Grid container>
              {medidas.map((talla, index) => (
                <RenderTallas
                  key={index}
                  talla={talla}
                  coloresSeleccionados={coloresSeleccionados}
                  medidasSeleccionadas={medidasSeleccionadas}
                  setMedidasSeleccionadas={setMedidasSeleccionadas}
                  // datos={datos}
                />
              ))}
            </Grid>
          </Box>
          <Divider />
          <Box
            width="100%"
            mt={1}
            style={
              onUpdate.length > 0
                ? {
                    pointerEvents: "none",
                    opacity: 0.4,
                  }
                : null
            }
          >
            <Typography>Color</Typography>
            <CrearColorProducto refetch={refetch} />
            <Grid container>
              {colores.map((color, index) => (
                <Colores
                  key={index}
                  color={color}
                  coloresSeleccionados={coloresSeleccionados}
                  setColoresSeleccionados={setColoresSeleccionados}
                  medidasSeleccionadas={medidasSeleccionadas}
                  // datos={datos}
                />
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

const RenderTallas = ({
  talla,
  coloresSeleccionados,
  medidasSeleccionadas,
  setMedidasSeleccionadas,
  // datos
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    setPresentaciones,
    presentaciones,
    datos_generales,
    preciosP,
    precios,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
  } = useContext(RegProductoContext);
  const [selected, setSelected] = useState(false);

  // const seleccionarMedidas = useCallback(
  // 	() => {
  // 		medidasSeleccionadas.forEach((res) => {
  // 			if (res._id === talla._id) setSelected(true);
  // 		});
  // 	},
  // 	[ talla._id, medidasSeleccionadas ]
  // );

  // useEffect(
  // 	() => {
  // 		if (datos.medidas_registradas) {
  // 			return seleccionarMedidas();
  // 		}
  // 	},
  // 	[ seleccionarMedidas ]
  // );

  const handleAddTallas = (value) => {
    const medidas_seleccionadas_temp = [...medidasSeleccionadas];

    if (!selected) {
      medidas_seleccionadas_temp.push(talla);
      setSelected(value);
    } else {
      medidas_seleccionadas_temp.forEach((res, index) => {
        if (res._id === talla._id) {
          medidas_seleccionadas_temp.splice(index, 1);
          setSelected(value);
          presentaciones.forEach((presentacion) => {
            if (!presentacion.nuevo) {
              if (presentacion.medida._id === res._id) {
                setPresentacionesEliminadas([
                  ...presentaciones_eliminadas,
                  presentacion,
                ]);
              }
            }
          });
        }
      });
    }

    let presentacion_temp = [];
    const array_medidad_finales = [...presentaciones];
    const { iva, ieps } = precios;

    if (!coloresSeleccionados.length && !array_medidad_finales.length) {
      /* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
      for (let i = 0; i < medidas_seleccionadas_temp.length; i++) {
        const producto_medida = medidas_seleccionadas_temp[i];
        let varIVA = iva < 10 ? `0${iva}` : iva;
        let varIEPS = ieps < 10 ? `0${ieps}` : ieps;
        let iva_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIVA}`)
        );
        let ieps_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIEPS}`)
        );
        presentacion_temp.push({
          _id: "",
          existencia: false,
          codigo_barras: GenCodigoBarras(),
          nombre_comercial: datos_generales.nombre_comercial,
          medida: producto_medida,
          color: { nombre: "", hex: "" },
          precio: preciosP[0].precio_neto,
          cantidad: 0,
          nuevo: true,
          precio_unidad: {
            numero_precio: 1,
            precio_venta: preciosP[0].precio_venta,
            precio_neto: preciosP[0].precio_neto,
            unidad_mayoreo: 0,
            iva_precio: parseFloat(iva_precio.toFixed(2)),
            ieps_precio: parseFloat(ieps_precio.toFixed(2)),
            utilidad: preciosP[0].utilidad,
            unidad_maxima: false,
          },
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
          (res) => res.medida._id === producto_medida._id
        );
        let varIVA = iva < 10 ? `0${iva}` : iva;
        let varIEPS = ieps < 10 ? `0${ieps}` : ieps;

        let iva_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIVA}`)
        );
        let ieps_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIEPS}`)
        );
        if (result.length) {
          presentacion_temp.push(result[0]);
        } else {
          presentacion_temp.push({
            _id: "",
            existencia: false,
            codigo_barras: GenCodigoBarras(),
            nombre_comercial: datos_generales.nombre_comercial,
            medida: producto_medida,
            color: { nombre: "", hex: "" },
            precio: preciosP[0].precio_neto,
            cantidad: 0,
            nuevo: true,
            precio_unidad: {
              numero_precio: 1,
              precio_venta: preciosP[0].precio_venta,
              precio_neto: preciosP[0].precio_neto,
              unidad_mayoreo: 0,
              iva_precio: parseFloat(iva_precio.toFixed(2)),
              ieps_precio: parseFloat(ieps_precio.toFixed(2)),
              utilidad: preciosP[0].utilidad,
              unidad_maxima: false,
            },
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
            _id: "",
            existencia: array_medidad_finales[i].existencia,
            codigo_barras: array_medidad_finales[i].codigo_barras,
            nombre_comercial: array_medidad_finales[i].nombre_comercial,
            medida: medidas_seleccionadas_temp[k],
            color: array_medidad_finales[i].color,
            precio: array_medidad_finales[i].precio,
            cantidad: array_medidad_finales[i].cantidad,
            nuevo: true,
            precio_unidad: array_medidad_finales[i].precio_unidad,
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
              producto_array_final.medida._id === producto_medida._id &&
              producto_color._id === producto_array_final.color._id
          );
          let varIVA = iva < 10 ? `0${iva}` : iva;
          let varIEPS = ieps < 10 ? `0${ieps}` : ieps;
          let iva_precio = parseFloat(
            preciosP[0].precio_venta * parseFloat(`0.${varIVA}`)
          );
          let ieps_precio = parseFloat(
            preciosP[0].precio_venta * parseFloat(`0.${varIEPS}`)
          );
          if (!presentacion_existente.length) {
            presentacion_temp.push({
              _id: "",
              existencia: false,
              codigo_barras: GenCodigoBarras(),
              nombre_comercial: datos_generales.nombre_comercial,
              medida: producto_medida,
              color: producto_color,
              precio: preciosP[0].precio_neto,
              cantidad: 0,
              nuevo: true,
              precio_unidad: {
                numero_precio: 1,
                precio_venta: preciosP[0].precio_venta,
                precio_neto: preciosP[0].precio_neto,
                unidad_mayoreo: 0,
                iva_precio: parseFloat(iva_precio.toFixed(2)),
                ieps_precio: parseFloat(ieps_precio.toFixed(2)),
                utilidad: preciosP[0].utilidad,
                unidad_maxima: false,
              },
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
        (producto) => producto.medida._id
      );
      if (presentaciones_existentes.length) {
        for (let x = 0; x < array_medidad_finales.length; x++) {
          const objeto_presentaciones_final = array_medidad_finales[x];
          presentacion_temp.push({
            _id: objeto_presentaciones_final._id,
            existencia: objeto_presentaciones_final.existencia,
            codigo_barras: objeto_presentaciones_final.codigo_barras,
            nombre_comercial: objeto_presentaciones_final.nombre_comercial,
            medida: {},
            color: objeto_presentaciones_final.color,
            precio: objeto_presentaciones_final.precio,
            cantidad: objeto_presentaciones_final.cantidad,
            nuevo: true,
            precio_unidad: objeto_presentaciones_final.precio_unidad,
          });
        }
      }
    }
    setMedidasSeleccionadas([...medidas_seleccionadas_temp]);
    setPresentaciones(presentacion_temp);
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
        <Typography
          variant="button"
          style={{
            color: theme.palette.getContrastText(
              selected ? theme.palette.primary.main : "#FFFFFF"
            ),
            fontSize: 16,
          }}
        >
          {talla.talla}
        </Typography>
      </div>
    </Grid>
  );
};

const Colores = ({
  color,
  coloresSeleccionados,
  setColoresSeleccionados,
  medidasSeleccionadas,
  datos,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const {
    presentaciones,
    setPresentaciones,
    datos_generales,
    preciosP,
    precios,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
  } = useContext(RegProductoContext);

  const [selected, setSelected] = useState(false);

  // const seleccionarColores = useCallback(
  // 	() => {
  // 		coloresSeleccionados.forEach((res) => {
  // 			if (res._id === color._id) setSelected(true);
  // 		});
  // 	},
  // 	[ color._id, coloresSeleccionados ]
  // );

  // useEffect(
  // 	() => {
  // 		if (datos.medidas_registradas) {
  // 			return seleccionarColores();
  // 		}
  // 	},
  // 	[ seleccionarColores ]
  // );

  const obtenerColores = (value) => {
    if (!selected) {
      coloresSeleccionados.push(color);
      setSelected(value);
    } else {
      coloresSeleccionados.forEach((res, index) => {
        if (res._id === color._id) {
          coloresSeleccionados.splice(index, 1);
          setSelected(value);
          presentaciones.forEach((presentacion) => {
            if (!presentacion.nuevo) {
              if (presentacion.color._id === res._id) {
                setPresentacionesEliminadas([
                  ...presentaciones_eliminadas,
                  presentacion,
                ]);
              }
            }
          });
        }
      });
    }
    let presentacion_temp = [];
    const array_medidad_finales = [...presentaciones];
    const { iva, ieps } = precios;

    if (!medidasSeleccionadas.length && !array_medidad_finales.length) {
      /* SI NO HAY COLORES NI VALORES EN EL ARRAY FINAL SE AGREGA EL PRIMER ELEMENTO */
      for (let i = 0; i < coloresSeleccionados.length; i++) {
        const producto_color = coloresSeleccionados[i];
        let varIVA = iva < 10 ? `0${iva}` : iva;
        let varIEPS = ieps < 10 ? `0${ieps}` : ieps;
        let iva_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIVA}`)
        );
        let ieps_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIEPS}`)
        );
        presentacion_temp.push({
          _id: "",
          existencia: false,
          codigo_barras: GenCodigoBarras(),
          nombre_comercial: datos_generales.nombre_comercial,
          medida: {},
          color: producto_color,
          precio: preciosP[0].precio_neto,
          cantidad: 0,
          nuevo: true,
          precio_unidad: {
            numero_precio: 1,
            precio_venta: preciosP[0].precio_venta,
            precio_neto: preciosP[0].precio_neto,
            unidad_mayoreo: 0,
            iva_precio: parseFloat(iva_precio.toFixed(2)),
            ieps_precio: parseFloat(ieps_precio.toFixed(2)),
            utilidad: preciosP[0].utilidad,
            unidad_maxima: false,
          },
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
          (res) => res.color._id === producto_color._id
        );
        let varIVA = iva < 10 ? `0${iva}` : iva;
        let varIEPS = ieps < 10 ? `0${ieps}` : ieps;
        let iva_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIVA}`)
        );
        let ieps_precio = parseFloat(
          preciosP[0].precio_venta * parseFloat(`0.${varIEPS}`)
        );
        if (result.length) {
          presentacion_temp.push(result[0]);
        } else {
          presentacion_temp.push({
            _id: "",
            existencia: false,
            codigo_barras: GenCodigoBarras(),
            nombre_comercial: datos_generales.nombre_comercial,
            medida: {},
            color: producto_color,
            precio: preciosP[0].precio_neto,
            cantidad: 0,
            nuevo: true,
            precio_unidad: {
              numero_precio: 1,
              precio_venta: preciosP[0].precio_venta,
              precio_neto: preciosP[0].precio_neto,
              unidad_mayoreo: 0,
              iva_precio: parseFloat(iva_precio.toFixed(2)),
              ieps_precio: parseFloat(ieps_precio.toFixed(2)),
              utilidad: preciosP[0].utilidad,
              unidad_maxima: false,
            },
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
            _id: "",
            existencia: array_medidad_finales[i].existencia,
            codigo_barras: array_medidad_finales[i].codigo_barras,
            nombre_comercial: array_medidad_finales[i].nombre_comercial,
            medida: array_medidad_finales[i].medida,
            color: coloresSeleccionados[k],
            precio: array_medidad_finales[i].precio,
            cantidad: array_medidad_finales[i].cantidad,
            nuevo: true,
            precio_unidad: array_medidad_finales[i].precio_unidad,
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
              producto_array_final.medida._id === producto_medida._id &&
              producto_color._id === producto_array_final.color._id
          );
          let varIVA = iva < 10 ? `0${iva}` : iva;
          let varIEPS = ieps < 10 ? `0${ieps}` : ieps;
          let iva_precio = parseFloat(
            preciosP[0].precio_venta * parseFloat(`0.${varIVA}`)
          );
          let ieps_precio = parseFloat(
            preciosP[0].precio_venta * parseFloat(`0.${varIEPS}`)
          );
          if (!presentacion_existente.length) {
            presentacion_temp.push({
              _id: "",
              existencia: false,
              codigo_barras: GenCodigoBarras(),
              nombre_comercial: datos_generales.nombre_comercial,
              medida: producto_medida,
              color: producto_color,
              precio: preciosP[0].precio_neto,
              cantidad: 0,
              nuevo: true,
              precio_unidad: {
                numero_precio: 1,
                precio_venta: preciosP[0].precio_venta,
                precio_neto: preciosP[0].precio_neto,
                unidad_mayoreo: 0,
                iva_precio: parseFloat(iva_precio.toFixed(2)),
                ieps_precio: parseFloat(ieps_precio.toFixed(2)),
                utilidad: preciosP[0].utilidad,
                unidad_maxima: false,
              },
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
        (producto) => producto.color._id
      );
      if (presentaciones_existentes.length) {
        for (let x = 0; x < array_medidad_finales.length; x++) {
          const objeto_presentaciones_final = array_medidad_finales[x];
          presentacion_temp.push({
            _id: objeto_presentaciones_final._id,
            existencia: objeto_presentaciones_final.existencia,
            codigo_barras: objeto_presentaciones_final.codigo_barras,
            nombre_comercial: objeto_presentaciones_final.nombre_comercial,
            medida: objeto_presentaciones_final.medida,
            color: { nombre: "", hex: "" },
            precio: objeto_presentaciones_final.precio,
            cantidad: objeto_presentaciones_final.cantidad,
            nuevo: true,
            precio_unidad: objeto_presentaciones_final.precio_unidad,
          });
        }
      }
    }

    setColoresSeleccionados([...coloresSeleccionados]);
    setPresentaciones(presentacion_temp);
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
          onClick={() => obtenerColores(!selected)}
        >
          {selected ? <Done /> : null}
        </div>
      </Tooltip>
    </Grid>
  );
};
