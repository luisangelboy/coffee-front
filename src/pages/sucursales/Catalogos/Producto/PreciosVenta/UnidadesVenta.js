import React, { Fragment, useContext, useEffect } from "react";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Box, TextField, Typography, Table, Checkbox } from "@material-ui/core";
import { Cached, LocalOffer } from "@material-ui/icons";
import { FormControl } from "@material-ui/core";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { formatoMexico } from "../../../../../config/reuserFunctions";
import { useState } from "react";

export default function PreciosDeCompra() {
  const {
    datos_generales,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
  } = useContext(RegProductoContext);

  const descuentoUnidadXdefecto = (descuento_activo) => {
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      descuento_activo,
    });
  };

  const checkUnidadDefault = (checked) => {
    setUnidadVentaXDefecto({
      ...unidadVentaXDefecto,
      unidad_principal: true,
    });
    if (checked) {
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        unidad_principal: false,
      });
    }
  };

  return (
    <Fragment>
      <Box>
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Código de barras</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Aplicar Descuento</TableCell>
                <TableCell>Unidad Principal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow /* selected={actualizarUnidad ? true : false} */>
                <TableCell>{datos_generales.codigo_barras}</TableCell>
                <TableCell>{unidadVentaXDefecto.unidad}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {unidadVentaXDefecto.descuento_activo &&
                    unidadVentaXDefecto.descuento_activo !== null ? (
                      <LocalOffer
                        color={
                          unidadVentaXDefecto.descuento_activo === true
                            ? "primary"
                            : "action"
                        }
                      />
                    ) : null}
                    <Box mr={1} />
                    <Typography>
                      <b>
                        $
                        {formatoMexico(
                          unidadVentaXDefecto.descuento_activo &&
                            unidadVentaXDefecto.descuento_activo === true
                            ? unidadVentaXDefecto.descuento.precio_neto
                            : unidadVentaXDefecto.precio
                        )}
                      </b>
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{unidadVentaXDefecto.cantidad}</TableCell>
                <TableCell>
                  {unidadVentaXDefecto.descuento_activo &&
                  unidadVentaXDefecto.descuento_activo !== null ? (
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={
                          unidadVentaXDefecto.descuento_activo === true
                            ? unidadVentaXDefecto.descuento_activo
                            : false
                        }
                        onChange={(e) =>
                          descuentoUnidadXdefecto(e.target.checked)
                        }
                        inputProps={{ "aria-label": "check descuento" }}
                        color="primary"
                        disabled={unidadVentaXDefecto.descuento_activo === null}
                      />
                      <Typography color="primary">
                        %
                        {parseFloat(
                          unidadVentaXDefecto.descuento_activo !== null
                            ? unidadVentaXDefecto.descuento.porciento
                            : 0
                        )}
                      </Typography>
                    </Box>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={unidadVentaXDefecto.unidad_principal}
                    onChange={(e) => checkUnidadDefault(e.target.checked)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </TableCell>
              </TableRow>
              {datos_generales.tipo_producto !== "OTROS" ? null : (
                <UnidadesVentaSecundaria />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fragment>
  );
}

const UnidadesVentaSecundaria = () => {
  const {
    precios,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
  } = useContext(RegProductoContext);
  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    let price =
      unidadVentaSecundaria.descuento_activo &&
      unidadVentaSecundaria.descuento_activo === true
        ? unidadVentaSecundaria.descuento.precio_neto
        : unidadVentaSecundaria.precio;

    setPrecio(price);
  }, [unidadVentaSecundaria]);

  const GenCodigoBarras = () => {
    const max = 999999999999;
    const min = 100000000000;
    const codigo_barras = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      codigo_barras,
    });
  };

  const obtenerCantidad = (e) => {
    let { value } = e.target;
    if (value) {
      value = parseFloat(value);
    }
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      cantidad: value,
    });
  };

  const obtenerPrecio = (e) => {
    let { value } = e.target;
    if (value) {
      value = parseFloat(value);
    }

    if (
      unidadVentaSecundaria.descuento_activo &&
      unidadVentaSecundaria.descuento_activo === true
    ) {
      console.log("a");
      setPrecio(value);
      calcularUnidadDesucuento(value);
    } else {
      setPrecio(value);
    }
  };

  const calcularUnidadDesucuento = (value) => {
    const { cantidad, precio_unidad } = unidadVentaSecundaria;
    if (!value || !cantidad) return;

    const precio_unit = value / cantidad;
    const { iva, ieps, unidad_de_compra } = precios;
    const { precio_venta, numero_precio, unidad_maxima } = precio_unidad;
    const precio_venta_unit = precio_venta / cantidad;

    let suma_impuestos =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let PVSI = parseFloat(precio_unit / (suma_impuestos + 1));
    let porcentaje = parseFloat(((PVSI / precio_venta_unit) * 100).toFixed(2));
    let descuento = parseFloat(100 - porcentaje);

    let PVCDSI = parseFloat((precio_venta_unit * porcentaje) / 100);
    let dineroDescontado = parseFloat(precio_venta_unit - PVCDSI);

    let iva_precio = parseFloat(
      PVCDSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
    );
    let ieps_precio = parseFloat(
      PVCDSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
    );
    let PCSI = unidad_de_compra.precio_unitario_sin_impuesto;
    let utilidad = parseFloat(((PVCDSI - PCSI) / PCSI) * 100);
    let precio_neto = parseFloat(PVCDSI + iva_precio + ieps_precio);
    let precio_general = parseFloat(precio_neto * cantidad);

    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      descuento: {
        cantidad_unidad: cantidad,
        numero_precio: numero_precio,
        unidad_maxima: unidad_maxima,
        precio_general: parseFloat(precio_general.toFixed(2)),
        precio_neto: parseFloat(precio_general.toFixed(2)),
        precio_venta: parseFloat(PVCDSI.toFixed(2)),
        iva_precio: parseFloat(iva_precio.toFixed(2)),
        ieps_precio: parseFloat(ieps_precio.toFixed(2)),
        utilidad: parseFloat(utilidad.toFixed(2)),
        porciento: parseFloat(descuento.toFixed(2)),
        dinero_descontado: parseFloat(dineroDescontado.toFixed(2)),
      },
    });
  };

  const calcularUnidadDesucuentoCheck = (boolean) => {
    const { cantidad, precio_unidad, descuento } = unidadVentaSecundaria;
    if (!precio || !cantidad) return;

    /* const precio_unit = value / cantidad; */
    const { iva, ieps, unidad_de_compra } = precios;
    const { precio_venta, numero_precio, unidad_maxima } = precio_unidad;

    const precio_venta_unit = precio / cantidad;

    let suma_impuestos =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let PVSI = parseFloat(precio_venta_unit / (suma_impuestos + 1));
    /* let porcentaje = parseFloat(((PVSI / precio_venta_unit) * 100)));
    let descuento = parseFloat(((100 - porcentaje))); */

    let PVCDSI = parseFloat((PVSI * descuento.porciento) / 100);
    let dineroDescontado = parseFloat(PVSI - PVCDSI);

    let iva_precio = parseFloat(
      PVCDSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
    );
    let ieps_precio = parseFloat(
      PVCDSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
    );
    let PCSI = unidad_de_compra.precio_unitario_sin_impuesto;
    let utilidad = parseFloat(((PVCDSI - PCSI) / PCSI) * 100);
    let precio_neto = parseFloat(PVCDSI + iva_precio + ieps_precio);
    let precio_general = parseFloat(precio_neto * cantidad);

    setPrecio(precio_general);
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      descuento_activo: boolean,
      precio,
      descuento: {
        cantidad_unidad: cantidad,
        numero_precio: numero_precio,
        unidad_maxima: unidad_maxima,
        precio_general: parseFloat(precio_general.toFixed(2)),
        precio_neto: parseFloat(precio_general.toFixed(2)),
        precio_venta: parseFloat(PVCDSI.toFixed(2)),
        iva_precio: parseFloat(iva_precio.toFixed(2)),
        ieps_precio: parseFloat(ieps_precio.toFixed(2)),
        utilidad: parseFloat(utilidad.toFixed(2)),
        porciento: descuento.porciento,
        dinero_descontado: parseFloat(dineroDescontado.toFixed(2)),
      },
    });
  };

  const calcularUnidad = (e) => {
    if (e.target.value === "") {
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        unidad_principal: false,
        precio: 0,
      });
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad_principal: true,
      });
      return;
    }
    if (!unidadVentaSecundaria.precio || !unidadVentaSecundaria.cantidad)
      return;

    const { cantidad } = unidadVentaSecundaria;

    const { iva, ieps } = precios;

    let suma_impuestos =
      parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`) +
      parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`);
    let PVCI = parseFloat(precio / cantidad);
    let PVSI = parseFloat(PVCI / (suma_impuestos + 1));

    let PCSI = precios.unidad_de_compra.precio_unitario_sin_impuesto;
    let iva_precio = parseFloat(
      PVSI * parseFloat(`0.${iva < 10 ? `0${iva}` : iva}`)
    );
    let ieps_precio = parseFloat(
      PVSI * parseFloat(`0.${ieps < 10 ? `0${ieps}` : ieps}`)
    );
    let utilidad = parseFloat(((PVSI - PCSI) / PCSI) * 100);
    let precio_venta = PVSI * cantidad;
    let precio_neto = PVCI * cantidad;

    let unidad_secundaria = {
      ...unidadVentaSecundaria,
      precio,
      cantidad,
      precio_unidad: {
        numero_precio: 1,
        precio_venta: parseFloat(precio_venta.toFixed(2)),
        precio_neto: parseFloat(precio_neto.toFixed(2)),
        unidad_mayoreo: 0,
        iva_precio: parseFloat((cantidad * iva_precio).toFixed(2)),
        ieps_precio: parseFloat((cantidad * ieps_precio).toFixed(2)),
        utilidad: parseFloat(utilidad.toFixed(2)),
        unidad_maxima: true,
        precio_general: precio,
        cantidad_unidad: cantidad,
      },
    };

    setUnidadVentaSecundaria(unidad_secundaria);
  };

  const checkUnidadPrincipal = (checked) => {
    setUnidadVentaSecundaria({
      ...unidadVentaSecundaria,
      unidad_principal: true,
    });
    if (checked) {
      setUnidadVentaXDefecto({
        ...unidadVentaXDefecto,
        unidad_principal: false,
      });
    }
  };

  const aplicarDescuento = (boolean) => {
    let precio = boolean
      ? unidadVentaSecundaria.descuento.precio_neto
      : unidadVentaSecundaria.precio;
    if (boolean) {
      calcularUnidadDesucuentoCheck(boolean);
    } else {
      setUnidadVentaSecundaria({
        ...unidadVentaSecundaria,
        descuento_activo: boolean,
      });
      setPrecio(precio);
    }
  };

  return (
    <TableRow>
      <TableCell width={220}>
        <FormControl variant="outlined" size="small" name="codigo_barras">
          <OutlinedInput
            id="input-codigo-barras"
            name="codigo_barras"
            value={unidadVentaSecundaria.codigo_barras}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => GenCodigoBarras()}
                >
                  <Cached />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </TableCell>
      <TableCell>{unidadVentaSecundaria.unidad}</TableCell>
      <TableCell width={200}>
        <TextField
          type="number"
          name="precio"
          variant="outlined"
          size="small"
          onBlur={(e) => calcularUnidad(e)}
          onChange={obtenerPrecio}
          value={precio}
          disabled={
            unidadVentaSecundaria.descuento_activo !== null &&
            unidadVentaSecundaria.descuento_activo === true
          }
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                {unidadVentaSecundaria.descuento_activo !== null ? (
                  <LocalOffer
                    color={
                      unidadVentaSecundaria.descuento_activo
                        ? "primary"
                        : "disabled"
                    }
                  />
                ) : null}
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell width={110}>
        <Tooltip
          title={<Typography variant="subtitle2">Pz/Kg por Unidad</Typography>}
          placement="top"
          arrow
        >
          <TextField
            InputProps={{ inputProps: { min: 0 } }}
            type="number"
            variant="outlined"
            size="small"
            name="cantidad"
            onBlur={calcularUnidad}
            onChange={obtenerCantidad}
            value={unidadVentaSecundaria.cantidad}
            /* onBlur={(e) => {
              if (e.target.value === "") {
                setUnidadVentaSecundaria({
                  ...unidadVentaSecundaria,
                  cantidad: precios.unidad_de_compra.cantidad,
                });
              }
            }} */
          />
        </Tooltip>
      </TableCell>
      <TableCell>
        {unidadVentaSecundaria.descuento_activo !== null ? (
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={
                unidadVentaSecundaria.descuento_activo
                  ? unidadVentaSecundaria.descuento_activo
                  : false
              }
              onChange={(e) => aplicarDescuento(e.target.checked)}
              inputProps={{ "aria-label": "check descuento" }}
              color="primary"
              disabled={unidadVentaSecundaria.descuento_activo === null}
            />
            <Typography color="primary">
              %
              {parseFloat(
                unidadVentaSecundaria.descuento &&
                  unidadVentaSecundaria.descuento !== null
                  ? unidadVentaSecundaria.descuento.porciento
                  : 0
              )}
            </Typography>
          </Box>
        ) : null}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={unidadVentaSecundaria.unidad_principal}
          onChange={(e) => checkUnidadPrincipal(e.target.checked)}
          inputProps={{ "aria-label": "primary checkbox" }}
          disabled={unidadVentaSecundaria.precio === 0}
        />
      </TableCell>
    </TableRow>
  );
};
