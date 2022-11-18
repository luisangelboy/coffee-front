import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useContext,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import EliminarProductoVenta from "./EliminarProductoVenta";

import { useDebounce } from "use-debounce";
import {
  findProductArray,
  verifiPrising,
  calculatePrices2,
  formatoMexico,
} from "../../config/reuserFunctions";
import { VentasContext } from "../../context/Ventas/ventasContext";
import EliminarProductoNota from "./EliminarProductoNota";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "100%",
    maxHeight: "61vh",
    "& ::-webkit-scrollbar": {
      display: "none",
    },
    [theme.breakpoints.up("xl")]: {
      maxHeight: "65vh",
    },
  },
}));

export default function EnhancedTable({ setDatosVentasActual }) {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  /* const sesion = JSON.parse(localStorage.getItem("sesionCafi")); */
  let datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));

  const {
    setProductoCambioPrecio,
    setPrecioSelectProductoVenta,
    updateTablaVentas,
    setUpdateTablaVentas,
  } = useContext(VentasContext);

  const [datosTabla, setDatosTabla] = useState([]);

  useEffect(() => {
    datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
    setDatosTabla(datosVentas === null ? [] : datosVentas.productos);
  }, [updateTablaVentas]);

  const handleClick = (name) => {
    if (name.unidad === "Caja" || name.unidad === "Costal") return;
    let newSelected = [];
    const exist = selected.indexOf(name) !== -1;
    if (exist) {
      newSelected = [];
      setPrecioSelectProductoVenta([]);
      setProductoCambioPrecio({});
      setSelected(newSelected);
      return;
    }
    newSelected = newSelected.concat([], name);
    const producto = name.id_producto.precios.precios_producto.filter(
      (p) => p.precio_neto === name.precio_actual_producto
    );
    if (producto.length > 0) setPrecioSelectProductoVenta(producto);
    setProductoCambioPrecio(name);
    setSelected(newSelected);
  };

  const TwoClickInRowTableBuy = (e, producto) => {
    try {
      /* let timer;
      clearTimeout(timer); */
      if (e.detail === 2) {
        handleClick(producto);
        /* setProductoCambioPrecio(producto); */
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  };

  return (
    <div className={classes.root}>
      <Paper>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            size="small"
            aria-labelledby="tableTitle"
            aria-label="a dense table"
          >
            <TableHead style={{padding: 0}}>
              <TableRow >
                <TableCell padding="checkbox"></TableCell>
                <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }}>Granel</TableCell>
                {datosVentas && datosVentas.nota_credito ? (
                  <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }} padding="checkbox">
                    Cant. Vendida
                  </TableCell>
                ) : null}
                <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }} padding="checkbox">
                  Cantidad
                </TableCell>
                <TableCell>Artículo</TableCell>
                <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }} padding="checkbox">
                  Exist.
                </TableCell>
                <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }} padding="checkbox">Desc.</TableCell>
                <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }} padding="checkbox">
                  Receta
                </TableCell>
                <TableCell style={{ textAlign: "center", padding: "0 8px 0 8px" }} padding="checkbox">
                  U.
                </TableCell>
                <TableCell style={{ width: 130, textAlign: "center", padding: "0 8px 0 8px" }}>
                  Precio Unit.
                </TableCell>
                <TableCell style={{ width: 130, textAlign: "center", padding: "0 8px 0 8px" }}>
                  Total
                </TableCell>
                <TableCell padding="checkbox" />
              </TableRow>
            </TableHead>
            <TableBody>
              {datosTabla.map((producto, index) => {
                const isItemSelected = isSelected(producto);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RenderTableRows
                    key={index}
                    producto={producto}
                    setUpdateTablaVentas={setUpdateTablaVentas}
                    updateTablaVentas={updateTablaVentas}
                    setDatosVentasActual={setDatosVentasActual}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    handleClick={handleClick}
                    selected={selected}
                    TwoClickInRowTableBuy={TwoClickInRowTableBuy}
                    setSelected={setSelected}
                    index={index}
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

const RenderTableRows = ({
  producto,
  setUpdateTablaVentas,
  updateTablaVentas,
  setDatosVentasActual,
  TwoClickInRowTableBuy,
  handleClick,
  isItemSelected,
  labelId,
  setSelected,
  selected,
  index
}) => {
  // const [actuallyProduct, setActuallyProduct] = useState(producto);
  const [newCantidadProduct, setNewCantidadProduct] = useState(
    producto.cantidad_venta
  );

  const [tempAmount, setTempAmount] = useState(producto.cantidad_venta);
  let datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));

  const textfield = useRef(null);
  const [value] = useDebounce(newCantidadProduct, 500);

  useEffect(() => {
    setTempAmount(producto.cantidad_venta);
  }, [producto.cantidad_venta]);

  const [count, setCount] = useState(false);

  useEffect(() => {
    if (count) {
      CalculeDataPricing(value);
    }
  }, [value]);

  const calculateNewPricingAmount = (cantidad) => {
    setCount(true);
    if (
      (datosVentas &&
      datosVentas.nota_credito &&
      cantidad > producto.cantidad_venta_original) || (cantidad === "0")
    ) {
      return;
    } else if (producto.concepto === "medidas") {
      if (cantidad > producto.cantidad) return;
    } else {
      if (cantidad > producto.inventario_general[0].cantidad_existente) return;
    }
    try {
      setTempAmount(cantidad);
      setNewCantidadProduct(cantidad);
    } catch (error) {
      return false;
    }
  };

  const CalculeDataPricing = async (new_cant) => {
    if (new_cant === "" || new_cant === 0) {
      setTempAmount(producto.cantidad_venta);
    } else {
      let venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let productosVentas = venta === null ? [] : venta.productos;
      const venta_actual = venta === null ? [] : venta;
      let productosVentasTemp = productosVentas;
      let venta_existente =
        venta === null
          ? {
              subTotal: 0,
              total: 0,
              impuestos: 0,
              iva: 0,
              ieps: 0,
              descuento: 0,
              monedero: 0,
            }
          : venta;

      let CalculosData = {};

      //Buscar y obtener ese producto en el array de ventas
      const producto_encontrado = await findProductArray(producto);

      if (producto_encontrado.found) {
        const {
          cantidad_venta,
          ...newP
        } = producto_encontrado.producto_found.producto;

        newP.cantidad_venta = parseFloat(new_cant);
        const verify_prising = await verifiPrising(newP);
        const newPrising = verify_prising.found
          ? verify_prising.object_prising
          : newP.precio_actual_object;

        const new_resta = await calculatePrices2({
          newP,
          cantidad: newP.granel_producto.granel ? 1 : cantidad_venta,
          precio_boolean: true,
          precio: newP.precio_actual_object,
          granel: newP.granel_producto,
          origen: "Tabla",
        });

        if (newP.granel_producto.granel) {
          newP.granel_producto = {
            granel: true,
            valor: parseFloat(new_cant),
          };
        }

        const new_suma = await calculatePrices2({
          newP,
          cantidad: newP.granel_producto.granel ? 1 : parseFloat(new_cant),
          precio_boolean: true,
          precio: newPrising,
          granel: newP.granel_producto,
          origen: "Tabla",
        });

        newP.iva_total_producto = parseFloat(new_suma.ivaCalculo);
        newP.ieps_total_producto = parseFloat(new_suma.iepsCalculo);
        newP.impuestos_total_producto = parseFloat(new_suma.impuestoCalculo);
        newP.subtotal_total_producto = parseFloat(new_suma.subtotalCalculo);
        newP.total_total_producto = parseFloat(new_suma.totalCalculo);

        if (verify_prising.found) {
          newP.precio_a_vender = new_suma.totalCalculo;
          newP.precio_anterior = newP.precio_actual_porducto;
          newP.precio_actual_producto = verify_prising.pricing;
          newP.precio_actual_object = verify_prising.object_prising;

          newP.precio_actual_object = {
            cantidad_unidad: verify_prising.object_prising.cantidad_unidad
              ? verify_prising.object_prising.cantidad_unidad
              : null,
            numero_precio: verify_prising.object_prising.numero_precio
              ? verify_prising.object_prising.numero_precio
              : null,
            unidad_maxima: verify_prising.object_prising.unidad_maxima
              ? verify_prising.object_prising.unidad_maxima
              : null,
            precio_general: verify_prising.object_prising.precio_general
              ? verify_prising.object_prising.precio_general
              : null,
            precio_neto: verify_prising.object_prising.precio_neto
              ? verify_prising.object_prising.precio_neto
              : null,
            precio_venta: verify_prising.object_prising.precio_venta
              ? verify_prising.object_prising.precio_venta
              : null,
            iva_precio: verify_prising.object_prising.iva_precio
              ? verify_prising.object_prising.iva_precio
              : null,
            ieps_precio: verify_prising.object_prising.ieps_precio
              ? verify_prising.object_prising.ieps_precio
              : null,
            utilidad: verify_prising.object_prising.utilidad
              ? verify_prising.object_prising.utilidad
              : null,
            porciento: verify_prising.object_prising.porciento
              ? verify_prising.object_prising.porciento
              : null,
            dinero_descontado: verify_prising.object_prising.dinero_descontado
              ? verify_prising.object_prising.dinero_descontado
              : null,
          };
        } else {
          newP.cantidad_venta = parseFloat(new_cant);
          newP.precio_anterior = newP.precio_actual_producto;
          newP.precio_a_vender = new_suma.totalCalculo;
        }

        productosVentasTemp.splice(
          producto_encontrado.producto_found.index,
          1,
          newP
        );

        CalculosData = {
          subTotal:
            parseFloat(venta_existente.subTotal) -
            parseFloat(new_resta.subtotalCalculo) +
            new_suma.subtotalCalculo,
          total:
            parseFloat(venta_existente.total) -
            parseFloat(new_resta.totalCalculo) +
            new_suma.totalCalculo,
          impuestos:
            parseFloat(venta_existente.impuestos) -
            parseFloat(new_resta.impuestoCalculo) +
            new_suma.impuestoCalculo,
          iva:
            parseFloat(venta_existente.iva) -
            parseFloat(new_resta.ivaCalculo) +
            new_suma.ivaCalculo,
          ieps:
            parseFloat(venta_existente.ieps) -
            parseFloat(new_resta.iepsCalculo) +
            new_suma.iepsCalculo,
          descuento:
            parseFloat(venta_existente.descuento) -
            parseFloat(new_resta.descuentoCalculo) +
            new_suma.descuentoCalculo,
          monedero:
            parseFloat(venta_existente.monedero) -
            parseFloat(new_resta.monederoCalculo) +
            new_suma.monederoCalculo,
        };
      } else {
        console.log("El producto no existe");
      }

      let saldo_favor = 0;
      if (venta.nota_credito) {
        saldo_favor = venta.total_original - CalculosData.total;
      }

      localStorage.setItem(
        "DatosVentas",
        JSON.stringify({
          ...venta,
          ...CalculosData,
          saldo_favor,
          cliente:
            venta_actual.venta_cliente === true ? venta_actual.cliente : {},
          venta_cliente:
            venta_actual.venta_cliente === true
              ? venta_actual.venta_cliente
              : false,
          productos: productosVentasTemp,
          tipo_emision: venta_actual.tipo_emision
            ? venta_actual.tipo_emision
            : "TICKET",
        })
      );
      setDatosVentasActual(CalculosData);
      //Recargar la tabla de los productos
      setUpdateTablaVentas(!updateTablaVentas);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="checkbox"
        style={{ padding: 0, margin: 0 }}
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={producto._id}
        selected={isItemSelected}
        onClick={(e) =>
          datosVentas && datosVentas.nota_credito
            ? null
            : TwoClickInRowTableBuy(e, producto)
        }
      >
        <TableCell padding="checkbox" style={{ padding: "0 0 0 5px" }}>
          <Checkbox
            onClick={(event) => {
              if (selected.length > 0) setSelected([]);
              handleClick(producto);
            }}
            disabled={datosVentas && datosVentas.nota_credito}
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>
        <TableCell style={{ textAlign: "center", padding: 0 }} padding="checkbox">
          {producto.granel_producto.granel
            ? `${producto.granel_producto.valor} ${producto.unidad}`
            : "N/A"}
        </TableCell>
        {datosVentas && datosVentas.nota_credito ? (
          <TableCell style={{ textAlign: "center", padding: 0 }}>
            {producto.cantidad_venta_original}
          </TableCell>
        ) : null}
        <TableCell style={{padding: 0}}>
          <Input
            inputRef={textfield}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => calculateNewPricingAmount(e.target.value)}
            value={tempAmount}
            type="number"
            name="cantidad_venta"
            inputProps={{
              min: 1,
              max:
                datosVentas && datosVentas.nota_credito
                  ? producto.cantidad_venta_original
                  : producto.concepto === "medidas"
                  ? producto.cantidad
                  : producto.inventario_general.map(
                      (existencia) => `${existencia.cantidad_existente}`
                    ),
            }}
          />
        </TableCell>
        <TableCell style={{padding: 0}}>
          <Typography noWrap variant="body2">{producto.id_producto.datos_generales.nombre_comercial}</Typography>
        </TableCell>
        <TableCell style={{ textAlign: "center", padding: 0 }}>
          {producto.id_producto.datos_generales.tipo_producto === "OTROS"
            ? producto.unidad === "Costal" || producto.unidad === "Caja"
              ? producto.inventario_general[0].cantidad_existente_maxima
              : producto.inventario_general[0].cantidad_existente
            : producto.cantidad}
        </TableCell>
        <TableCell style={{ textAlign: "center",padding: 0 }}>
          %{" "}
          {producto.precio_actual_object.porciento !== null
            ? producto.precio_actual_object.porciento
            : 0}
        </TableCell>
        <TableCell style={{ textAlign: "center",padding: 0 }}>
          {producto.id_producto.datos_generales.receta_farmacia === true
            ? "Si"
            : "No"}
        </TableCell>
        <TableCell style={{ textAlign: "center",padding: 0 }}>{producto.unidad}</TableCell>
        <TableCell style={{ textAlign: "center",padding: 0 }}>
          ${" "}
          {producto.precio_actual_object.precio_neto
            ? formatoMexico(producto.precio_actual_object.precio_neto)
            : 0}
        </TableCell>
        <TableCell style={{ textAlign: "center",padding: 0 }}>
          ${" "}
          {producto.total_total_producto
            ? formatoMexico(producto.total_total_producto)
            : 0}
        </TableCell>
        <TableCell style={{padding: "0 5px 0 0"}}>
          {datosVentas && datosVentas.nota_credito ? (
            <EliminarProductoNota
            producto={producto}
            setDatosVentasActual={setDatosVentasActual}
            index={index}
          />
          ) :(
            <EliminarProductoVenta
            producto={producto}
            setDatosVentasActual={setDatosVentasActual}
          />
          )}
          
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
