import React, { Fragment, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
//import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { Box, Chip, IconButton, Tooltip, Zoom } from "@material-ui/core";
import { Cached, Close, Edit } from "@material-ui/icons";
import { fade } from "@material-ui/core/styles/colorManipulator";

const compareFunction = (a, b) => {
  if (a.medida.talla && b.medida.talla) {
    return a.medida.talla.localeCompare(b.medida.talla);
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  container: {},
  tableRow: {
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  colorContainer: {
    border: "1px solid rgba(0,0,0, .3)",
    height: 30,
    width: 30,
    borderRadius: "15%",
  },
}));

export default function TablaPresentaciones({
  productoData,
  datos,
  setOnUpdate,
  onUpdate,
  setNew_medidas,
}) {
  const classes = useStyles();
  //const { presentaciones, setPresentaciones } = useContext([]);
  //let mostrar_presentaciones = [];

  /* let mostrar_presentaciones = [...datos].sort((a, b) => compareFunction(a, b)); */

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell>Existencia</TableCell>
                <TableCell>Código de barras</TableCell>
                <TableCell width={200}>Nombre</TableCell>
                <TableCell padding="checkbox">Medida</TableCell>
                <TableCell padding="checkbox">Color</TableCell>
                <TableCell padding="checkbox">Precio</TableCell>
                {/* <TableCell padding="checkbox">Descuento</TableCell> */}
                {/* {!onlyPrice ? (
                  <Fragment>
                    <TableCell padding="checkbox">Cantidad</TableCell>
                  </Fragment>
                ) : null} */}
                <Fragment>
                  <TableCell padding="checkbox">Cantidad</TableCell>
                </Fragment>
                <TableCell padding="checkbox">Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datos.map((producto, index) => {
                return (
                  <RenderPresentacionesRows
                    key={index}
                    productoData={productoData}
                    producto={producto}
                    index={index}
                    datos={datos}
                    setNew_medidas={setNew_medidas}
                    setOnUpdate={setOnUpdate}
                    onUpdate={onUpdate}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const RenderPresentacionesRows = ({
  productoData,
  producto,
  index,
  datos,
  setNew_medidas,
  from,
  setOnUpdate,
  onUpdate,
  withoutPrice,
  onlyPrice,
}) => {
  /* const { presentaciones, setPresentaciones, preciosP } = useContext(
    RegProductoContext
  ); */
  const [disabledInput, setDisabledInput] = useState(true);
  const classes = useStyles();
  const textfield = useRef(null);

  const copy_presentaciones = [...datos].sort((a, b) => compareFunction(a, b));
  const copy_element_presentacion = { ...copy_presentaciones[index] };
  //const copy_element_presentacion = {  };
  //const copy_element_presentacion_descuento = { ...copy_presentaciones[index].descuento };
  const copy_element_presentacion_descuento = {};
  const copy_producto = { ...producto };

  /* if(from && from === 'compra'){
		copy_producto.cantidad_nueva = 0
	} */

  const handleEditCancel = () => {
    if (!copy_producto.medida.cantidad) {
      copy_element_presentacion.medida.cantidad = 0;
    }
    if (!copy_producto.nuevaCantidad) {
      copy_element_presentacion.nuevaCantidad = 0;
    }
    if (!copy_producto.precio) {
      copy_element_presentacion.precio = copy_producto.precio;
      //copy_element_presentacion.medida.precio = 0;
    }
    copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setNew_medidas(copy_presentaciones);
    setDisabledInput(true);
  };

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    if (name === "cantidad") {
      if (!value) {
        copy_element_presentacion.medida.cantidad = "";
        copy_element_presentacion.medida.existencia = false;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setNew_medidas(setNew_medidas);
        return;
      }
      copy_element_presentacion.medida.cantidad = parseFloat(value);
      copy_element_presentacion.medida.existencia = true;
    } else if (name === "nuevaCantidad") {
      if (!value) {
        copy_element_presentacion.nuevaCantidad = "";
        copy_element_presentacion.medida.existencia =
          copy_producto.medida.existencia;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setNew_medidas(copy_presentaciones);
        return;
      }
      copy_element_presentacion.nuevaCantidad = parseFloat(value);
      copy_element_presentacion.medida.existencia = true;
    } else if (name === "precio") {
      if (!value) {
        copy_element_presentacion.medida.precio = 0;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setNew_medidas(copy_presentaciones);
        return;
      }

      let precio_neto = parseFloat(value);
      let { iva, ieps } = productoData.precios;

      let suma_impuestos =
        parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
        parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
      let precio_venta = parseFloat(
        (precio_neto / (suma_impuestos + 1))
      );
      let iva_precio = parseFloat(
        (precio_venta * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`))
      );
      let ieps_precio = parseFloat(
        (
          precio_venta * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
        )
      );
      let PUCSI =
        productoData.precios.unidad_de_compra.precio_unitario_sin_impuesto;
      let utilidad = parseFloat(
        (((precio_venta - PUCSI) / PUCSI) * 100)
      );

      let { descuento_activo, descuento } = copy_element_presentacion;
      if (descuento_activo && descuento_activo === true) {
        let new_precio_venta_desc = (precio_venta * descuento.porciento) / 100;
        let new_iva_precio =
          new_precio_venta_desc * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
        let new_ieps_precio =
          new_precio_venta_desc *
          parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
        let new_impuestos = new_iva_precio + new_ieps_precio;
        let precio_con_descuento = new_precio_venta_desc + new_impuestos;

        copy_element_presentacion_descuento.precio_neto = parseFloat(
          precio_con_descuento.toFixed(2)
        );
        copy_element_presentacion.medida.precio = parseFloat(value);
        copy_element_presentacion.medida.descuento = copy_element_presentacion_descuento;
      } else {
        copy_element_presentacion.medida.precio = parseFloat(value);
      }

      copy_element_presentacion.medida.precio_unidad.precio_venta = parseFloat(precio_venta.toFixed(2));
      copy_element_presentacion.medida.precio_unidad.precio_neto = parseFloat(precio_neto.toFixed(2));
      copy_element_presentacion.medida.precio_unidad.utilidad = parseFloat(utilidad.toFixed(2));
      copy_element_presentacion.medida.precio_unidad.iva_precio = parseFloat(iva_precio.toFixed(2));
      copy_element_presentacion.medida.precio_unidad.ieps_precio = parseFloat(ieps_precio.toFixed(2));
    } else if (name === "descuento") {
      /* if (!value) {
        copy_element_presentacion.medida.precio = 0;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setNew_medidas(copy_presentaciones);
        return;
      }
      if(copy_element_presentacion.medida.descuento_activo && copy_element_presentacion.medida.descuento_activo === true){
        let precio_con_descuento = Math.round(
          (value * copy_element_presentacion.medida.descuento.porciento) / 100
        );
        copy_element_presentacion_descuento.medida.precio_con_descuento = parseFloat(precio_con_descuento);
        copy_element_presentacion.medida.precio = parseFloat(value);
        copy_element_presentacion.medida.descuento = copy_element_presentacion_descuento
      }else{
        copy_element_presentacion.medida.precio = parseFloat(value);
      } */
      copy_element_presentacion.medida.descuento = value;
    } else {
      if (!value) {
        copy_element_presentacion.medida.codigo_barras = "";
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setNew_medidas(copy_presentaciones);
        return;
      }
      copy_element_presentacion.medida.codigo_barras = value;
    }
    copy_presentaciones.splice(index, 1, copy_element_presentacion);

    setNew_medidas(copy_presentaciones);
    //console.log(copy_presentaciones)
  };

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    copy_element_presentacion.medida.codigo_barras = codigo_barras;
    /*     copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones); */
  };

  const actionButton = () => {
    if (!disabledInput) {
      handleEditCancel();
      /* quitar del array	 */
      onUpdate.splice(onUpdate.length - 1, 1);
      setOnUpdate([...onUpdate]);
    } else {
      setDisabledInput(!disabledInput);
      /*  agregar al array */
      setOnUpdate([...onUpdate, index]);
    }
  };

  /*  const aplicarDescuento = (value) => {
    copy_element_presentacion.medida.descuento_activo = value;
/*     copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones); 
  }; */

  return (
    <TableRow hover selected={!disabledInput} className={classes.tableRow}>
      <TableCell align="center" padding="checkbox">
        <Checkbox checked={copy_producto.medida.existencia} color="primary" />
      </TableCell>
      <TableCell width={220}>
        <Box display="flex">
          <Input
            inputRef={textfield}
            onChange={(e) => obtenerDatos(e)}
            /* disabled={disabledInput} */
            value={copy_producto.medida.codigo_barras}
            type="number"
            name="codigo_barras"
            disabled={
              datos.medidas_registradas && !copy_producto.medida.nuevo
                ? true
                : disabledInput
            }
          />
          {!datos.medidas_registradas && copy_producto.medida.nuevo ? (
            <IconButton
              color="primary"
              size="small"
              onClick={() => GenCodigoBarras()}
            >
              <Cached />
            </IconButton>
          ) : datos.medidas_registradas && copy_producto.medida.nuevo ? (
            <IconButton
              color="primary"
              size="small"
              onClick={() => GenCodigoBarras()}
            >
              <Cached />
            </IconButton>
          ) : null}
        </Box>
      </TableCell>
      <TableCell width={200}>{copy_producto.medida.nombre_comercial}</TableCell>
      <TableCell padding="checkbox">
        {copy_producto.medida.medida._id ? (
          <Chip label={copy_producto.medida.medida.talla} color="primary" />
        ) : (
          ""
        )}
      </TableCell>
      <TableCell padding="checkbox">
        {copy_producto.medida.color._id ? (
          <Tooltip
            title={copy_producto.medida.color.nombre}
            placement="top"
            arrow
            TransitionComponent={Zoom}
          >
            <div
              className={classes.colorContainer}
              style={{
                backgroundColor: copy_producto.medida.color.hex,
              }}
            />
          </Tooltip>
        ) : null}
      </TableCell>

      <Fragment>
        <TableCell width={110}>
          <Input
            inputRef={textfield}
            inputMode="numeric"
            type="number"
            onChange={(e) => obtenerDatos(e)}
            disabled={disabledInput}
            value={copy_producto.medida.precio}
            name="precio"
          />
        </TableCell>
        {/*  <TableCell>
              <Input
                inputRef={textfield}
                onChange={(e) => obtenerDatos(e)}
                disabled={disabledInput}
                value={copy_producto.medida.descuento}
                type="tel"
                name="descuento"
              />
            </TableCell> */}
        <TableCell padding="checkbox">
          <Input
            inputRef={textfield}
            onChange={(e) => obtenerDatos(e)}
            disabled={disabledInput}
            value={copy_producto.nuevaCantidad}
            type="tel"
            name="nuevaCantidad"
          />
        </TableCell>
      </Fragment>

      <TableCell padding="checkbox">
        <IconButton size="small" onClick={() => actionButton()}>
          {!disabledInput ? <Close /> : <Edit />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
