import React, { useContext, useRef, useState } from "react";
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
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
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
  container: {
    maxHeight: "65vh",
  },
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

export default function TablaPresentaciones({ from, setOnUpdate, onUpdate }) {
  const classes = useStyles();
  const { presentaciones } = useContext(RegProductoContext);

  let mostrar_presentaciones = [...presentaciones].sort((a, b) =>
    compareFunction(a, b)
  );

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
                <TableCell>Precio</TableCell>
                {from && from === "compra" ? (
                  <TableCell padding="checkbox">Existente</TableCell>
                ) : null}
                <TableCell padding="checkbox">Cantidad</TableCell>
                <TableCell padding="checkbox">Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mostrar_presentaciones.map((producto, index) => {
                return (
                  <RenderPresentacionesRows
                    key={index}
                    producto={producto}
                    index={index}
                    from={from}
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
  producto,
  index,
  from,
  setOnUpdate,
  onUpdate,
}) => {
  const { presentaciones, setPresentaciones, preciosP, precios } = useContext(
    RegProductoContext
  );
  const [disabledInput, setDisabledInput] = useState(true);
  const classes = useStyles();
  const textfield = useRef(null);

  const copy_presentaciones = [...presentaciones].sort((a, b) =>
    compareFunction(a, b)
  );
  const copy_element_presentacion = { ...copy_presentaciones[index] };
  const copy_producto = { ...producto };

  if (from && from === "compra") {
    copy_producto.cantidad = 0;
  }

  const handleEditCancel = () => {
    if (!copy_producto.cantidad) {
      copy_element_presentacion.cantidad = 0;
    }
    if (!copy_producto.precio) {
      copy_element_presentacion.precio = preciosP[0].precio_neto;
    }
    copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones);
    setDisabledInput(true);
  };

  const obtenerDatos = (event) => {
    const { value, name } = event.target;
    console.log(name);
    if (name === "cantidad") {
      if (!value) {
        copy_element_presentacion.cantidad = "";
        copy_element_presentacion.existencia = false;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setPresentaciones(copy_presentaciones);
        return;
      }
      copy_element_presentacion.cantidad = parseFloat(value);
      copy_element_presentacion.existencia = true;
    } else if (name === "precio") {
      let { iva, ieps } = precios;
      if (!value) {
        copy_element_presentacion.precio = "";
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setPresentaciones(copy_presentaciones);
        return;
      }
      let precio_neto = parseFloat(value);
      let varIVA = iva < 10 ? `0${iva}` : iva;
      let varIEPS = ieps < 10 ? `0${ieps}` : ieps;

      let suma_impuestos =
        parseFloat(`0.${varIVA}`) + parseFloat(`0.${varIEPS}`);
      let precio_venta = parseFloat(precio_neto / (suma_impuestos + 1));
      let iva_precio = parseFloat(precio_venta * parseFloat(`0.${varIVA}`));
      let ieps_precio = parseFloat(precio_venta * parseFloat(`0.${varIEPS}`));
      let PUCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
      let utilidad = parseFloat(((precio_venta - PUCSI) / PUCSI) * 100);
      copy_element_presentacion.precio_unidad.precio_venta = parseFloat(
        precio_venta.toFixed(2)
      );
      copy_element_presentacion.precio_unidad.precio_neto = parseFloat(
        precio_neto.toFixed(2)
      );
      copy_element_presentacion.precio_unidad.utilidad = parseFloat(
        utilidad.toFixed(2)
      );
      copy_element_presentacion.precio_unidad.iva_precio = parseFloat(
        iva_precio.toFixed(2)
      );
      copy_element_presentacion.precio_unidad.ieps_precio = parseFloat(
        ieps_precio.toFixed(2)
      );

      copy_element_presentacion.precio = parseFloat(value);
    } else {
      if (!value) {
        copy_element_presentacion.codigo_barras = "";
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setPresentaciones(copy_presentaciones);
        return;
      }
      copy_element_presentacion.codigo_barras = value;
    }
    copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones);
  };

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    copy_element_presentacion.codigo_barras = codigo_barras;
    copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones);
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

  return (
    <TableRow hover selected={!disabledInput} className={classes.tableRow}>
      <TableCell align="center">
        <Checkbox checked={copy_producto.existencia} color="primary" />
      </TableCell>
      <TableCell width={220}>
        <Box display="flex">
          <Input
            inputRef={textfield}
            onChange={(e) => obtenerDatos(e)}
            /* disabled={disabledInput} */
            value={copy_producto.codigo_barras}
            type="number"
            name="precio"
            disabled={!copy_producto.nuevo ? true : disabledInput}
          />
          {copy_producto.nuevo ? (
            <IconButton
              color="primary"
              size="small"
              onClick={() => GenCodigoBarras()}
            >
              <Cached />
            </IconButton>
          ) : copy_producto.nuevo ? (
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
      <TableCell width={200}>{copy_producto.nombre_comercial}</TableCell>
      <TableCell padding="checkbox">
        {copy_producto.medida._id ? (
          <Chip label={copy_producto.medida.talla} color="primary" />
        ) : (
          ""
        )}
      </TableCell>
      <TableCell padding="checkbox">
        {copy_producto.color._id ? (
          <Tooltip
            title={copy_producto.color.nombre}
            placement="top"
            arrow
            TransitionComponent={Zoom}
          >
            <div
              className={classes.colorContainer}
              style={{
                backgroundColor: copy_producto.color.hex,
              }}
            />
          </Tooltip>
        ) : null}
      </TableCell>
      <TableCell width={110}>
        <Input
          inputRef={textfield}
          onChange={(e) => obtenerDatos(e)}
          disabled={disabledInput}
          value={copy_producto.precio}
          type="tel"
          name="precio"
        />
      </TableCell>
      {from && from === "compra" ? (
        <TableCell padding="checkbox">{producto.cantidad}</TableCell>
      ) : null}
      <TableCell padding="checkbox">
        <Input
          inputRef={textfield}
          onChange={(e) => obtenerDatos(e)}
          disabled={disabledInput}
          value={copy_producto.cantidad}
          type="tel"
          name="cantidad"
        />
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton size="small" onClick={() => actionButton()}>
          {!disabledInput ? <Close /> : <Edit />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
