import React, { Fragment, useContext, useRef, useState } from "react";
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
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Zoom,
} from "@material-ui/core";
import {
  Cached,
  Close,
  Edit,
  LocalOffer,
  LocalOfferOutlined,
} from "@material-ui/icons";
import { alpha } from "@material-ui/core/styles/colorManipulator";

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
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
  input: {
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

export default function TablaPresentaciones({
  from,
  setOnUpdate,
  onUpdate,
  withoutPrice,
  onlyPrice,
}) {
  const classes = useStyles();
  const { presentaciones, setPresentaciones } = useContext(RegProductoContext);

  let mostrar_presentaciones = [...presentaciones].sort((a, b) =>
    compareFunction(a, b)
  );

  /* useEffect(() => {
    let nuevo_array = [];
    mostrar_presentaciones.forEach((element) => {
      let obj = {
        codigo_barras: element.codigo_barras,
        cantidad: parseFloat(element.cantidad),
        descuento: element.descuento,
        descuento_activo: element.descuento_activo,
        color: element.color,
        existencia: element.existencia,
        medida: element.medida,
        nombre_comercial: element.nombre_comercial,
      };

      if (element.descuento_activo === true) {
        obj.aplicar_descuento = true;
        obj.precio = parseFloat(element.descuento.precio_neto);
      } else {
        obj.aplicar_descuento = false;
        obj.precio = parseFloat(element.precio);
      }
      nuevo_array.push(obj);
    });
    setPresentaciones(nuevo_array);
  }, []); */

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
                {!withoutPrice ? (
                  <Fragment>
                    <TableCell>Precio</TableCell>
                    <TableCell padding="checkbox">Aplicar descuento</TableCell>
                  </Fragment>
                ) : null}
                {!onlyPrice ? (
                  <Fragment>
                    {from && from === "compra" ? (
                      <TableCell padding="checkbox">Existente</TableCell>
                    ) : null}
                    <TableCell padding="checkbox">Cantidad</TableCell>
                  </Fragment>
                ) : null}
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
                    withoutPrice={withoutPrice}
                    onlyPrice={onlyPrice}
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
  withoutPrice,
  onlyPrice,
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
  const copy_element_presentacion_descuento = {
    ...copy_presentaciones[index].descuento,
  };
  const copy_producto = { ...producto };

  /* if(from && from === 'compra'){
		copy_producto.cantidad_nueva = 0
	} */

  const handleEditCancel = () => {
    if (!copy_producto.cantidad) {
      copy_element_presentacion.cantidad = 0;
    }
    if (!copy_producto.cantidad_nueva) {
      copy_element_presentacion.cantidad_nueva = 0;
    }
    if (!copy_producto.precio) {
      copy_element_presentacion.precio = preciosP[0].precio_neto;
    }
    copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones);
    setDisabledInput(true);
  };

  const obtenerDatos = (e) => {
    const { name, value } = e.target;
    if (name === "cantidad") {
      if (!value) {
        copy_element_presentacion.cantidad = "";
        copy_element_presentacion.existencia = false;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setPresentaciones(copy_presentaciones);
        return;
      }
      if (value === "0") {
        copy_element_presentacion.existencia = false;
      } else {
        copy_element_presentacion.existencia = true;
      }
      copy_element_presentacion.cantidad = parseFloat(value);
    } else if (name === "cantidad_nueva") {
      if (!value) {
        copy_element_presentacion.cantidad_nueva = "";
        copy_element_presentacion.existencia = copy_producto.existencia;
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setPresentaciones(copy_presentaciones);
        return;
      }
      copy_element_presentacion.cantidad_nueva = parseFloat(value);
      copy_element_presentacion.existencia = true;
    } else if (name === "precio") {
      if (!value) {
        copy_element_presentacion.precio = "";
        copy_presentaciones.splice(index, 1, copy_element_presentacion);
        setPresentaciones(copy_presentaciones);
        return;
      }
      let precio_neto = parseFloat(value);
      let { iva, ieps } = precios;
      let suma_impuestos =
        parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
        parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
      let precio_venta = parseFloat(
        precio_neto / (suma_impuestos + 1)
      );
      let iva_precio = parseFloat(
        precio_venta * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
      );
      let ieps_precio = parseFloat(
        precio_venta *
          parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
      );
      let PUCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
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
        copy_element_presentacion.precio = parseFloat(value);
        copy_element_presentacion.descuento = copy_element_presentacion_descuento;
      } else {
        copy_element_presentacion.precio = parseFloat(value);
      }
      copy_element_presentacion.precio_unidad.precio_venta = parseFloat(precio_venta.toFixed(2));
      copy_element_presentacion.precio_unidad.precio_neto = parseFloat(precio_neto.toFixed(2));
      copy_element_presentacion.precio_unidad.utilidad = parseFloat(utilidad.toFixed(2));
      copy_element_presentacion.precio_unidad.iva_precio = parseFloat(iva_precio.toFixed(2));
      copy_element_presentacion.precio_unidad.ieps_precio = parseFloat(ieps_precio.toFixed(2));
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

  const aplicarDescuento = (value) => {
    copy_element_presentacion.descuento_activo = value;

    let precio_con_descuento = 0;
    let { iva, ieps } = precios;
    let { descuento, precio } = copy_element_presentacion;
    let suma =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let precio_venta = parseFloat((precio / (suma + 1)).toFixed(2));

    if (value) {
      let new_precio_venta_desc = (precio_venta * descuento.porciento) / 100;
      let new_iva_precio =
        new_precio_venta_desc * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`);
      let new_ieps_precio =
        new_precio_venta_desc *
        parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
      let new_impuestos = new_iva_precio + new_ieps_precio;
      precio_con_descuento = new_precio_venta_desc + new_impuestos;
    } else {
      precio_con_descuento = precio;
    }

    copy_element_presentacion_descuento.precio_neto = parseFloat(
      precio_con_descuento.toFixed(2)
    );
    /* copy_element_presentacion.precio = parseFloat(value); */
    copy_element_presentacion.descuento = copy_element_presentacion_descuento;

    copy_presentaciones.splice(index, 1, copy_element_presentacion);
    setPresentaciones(copy_presentaciones);
  };

  return (
    <TableRow hover selected={!disabledInput} className={classes.tableRow}>
      <TableCell align="center" padding="checkbox">
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
            name="codigo_barras"
            disabled={
              presentaciones.length > 0 && !copy_producto.nuevo
                ? true
                : disabledInput
            }
          />
          {presentaciones.length === 0 && copy_producto.nuevo ? (
            <IconButton
              color="primary"
              size="small"
              onClick={() => GenCodigoBarras()}
            >
              <Cached />
            </IconButton>
          ) : presentaciones.length > 0 && copy_producto.nuevo ? (
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
      {!withoutPrice ? (
        <Fragment>
          <TableCell width={110} className={classes.input}>
            <Input
              inputRef={textfield}
              onChange={(e) => obtenerDatos(e)}
              disabled={disabledInput}
              value={copy_producto.precio}
              type="number"
              name="precio"
            />
          </TableCell>
          <TableCell width={200}>
            <Box display="flex" alignItems="center">
              {copy_producto.descuento_activo !== undefined &&
              copy_producto.descuento_activo !== null ? (
                <Fragment>
                  <Checkbox
                    checked={
                      copy_producto.descuento_activo === true
                        ? copy_producto.descuento_activo
                        : false
                    }
                    onChange={(e) => aplicarDescuento(e.target.checked)}
                    icon={<LocalOfferOutlined />}
                    checkedIcon={<LocalOffer />}
                    inputProps={{ "aria-label": "check descuento" }}
                    color="primary"
                    disabled={copy_producto.descuento_activo === null}
                  />
                  <Typography
                    color={
                      copy_producto.descuento_activo === true
                        ? "primary"
                        : "textSecondary"
                    }
                  >
                    %
                    {parseFloat(
                      copy_producto.descuento !== null
                        ? copy_producto.descuento.porciento
                        : 0
                    )}{" "}
                    $
                    {parseFloat(
                      copy_producto.descuento !== null
                        ? copy_producto.descuento.precio_neto
                        : 0
                    )}
                  </Typography>
                </Fragment>
              ) : null}
            </Box>
          </TableCell>
        </Fragment>
      ) : null}
      {!onlyPrice ? (
        <Fragment>
          {from && from === "compra" ? (
            <Fragment>
              <TableCell padding="checkbox">{producto.cantidad}</TableCell>
              <TableCell padding="checkbox">
                <Input
                  inputRef={textfield}
                  onChange={(e) => obtenerDatos(e)}
                  disabled={disabledInput}
                  value={copy_producto.cantidad_nueva}
                  type="tel"
                  name="cantidad_nueva"
                />
              </TableCell>
            </Fragment>
          ) : (
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
          )}
        </Fragment>
      ) : null}
      <TableCell padding="checkbox">
        <IconButton size="small" onClick={() => actionButton()}>
          {!disabledInput ? <Close /> : <Edit />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
