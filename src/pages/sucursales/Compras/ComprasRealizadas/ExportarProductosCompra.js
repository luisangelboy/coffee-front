import React, { Fragment } from "react";
import { CloudDownloadOutlined } from "@material-ui/icons";
import { Grid, Button, Box } from "@material-ui/core";
import ReactExport from "react-export-excel";
import {
  formatoFecha,
  formatoMexico,
} from "../../../../config/reuserFunctions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default function ExportarProductosComprasExcel({ compra }) {
  const {
    almacen,
    proveedor,
    fecha_registro,
    subtotal,
    impuestos,
    total,
    productos,
  } = compra;

  const compra_realizada = [
    {
      almacen: almacen.nombre_almacen,
      proveedor: proveedor.nombre_cliente,
      fecha_registro: formatoFecha(fecha_registro),
      subtotal: formatoMexico(subtotal),
      impuestos: formatoMexico(impuestos),
      total: formatoMexico(total),
    },
  ];

  const productos_detalles = productos.map((productos) => {
    const {
      producto,
      medida,
      color,
      unidad,
      cantidad,
      Cantidad_regalo,
      cantidad_total,
      descuento_precio,
      descuento_porcentaje,
      subtotal,
      impuestos,
      total,
    } = productos;
    const detalle_producto = {
      producto: producto.datos_generales.nombre_comercial,
      medida: medida ? medida.medida : "N/A",
      color: color ? color.color : "N/A",
      unidad,
      cantidad,
      Cantidad_regalo,
      cantidad_total,
      descuento_precio,
      descuento_porcentaje,
      subtotal: formatoMexico(subtotal),
      impuestos: formatoMexico(impuestos),
      total: formatoMexico(total),
    };

    return detalle_producto;
  });

  return (
    <Fragment>
      <ExcelFile
        element={
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadOutlined />}
            >
              Exportar a Excel
            </Button>
          </Box>
        }
        filename={"Detalle de compra"}
      >
        <ExcelSheet data={compra_realizada} name="Detalle compra">
          <ExcelColumn label="Almacen" value="almacen" />
          <ExcelColumn label="Proveedor" value="proveedor" />
          <ExcelColumn label="Fecha de compra" value="fecha_registro" />
          <ExcelColumn label="Subtotal" value="subtotal" />
          <ExcelColumn label="Impuestos" value="impuestos" />
          <ExcelColumn label="Total" value="total" />
        </ExcelSheet>
        <ExcelSheet data={productos_detalles} name="Productos de la compra">
          <ExcelColumn label="Producto" value="producto" />
          <ExcelColumn label="Medida" value="medida" />
          <ExcelColumn label="Color" value="color" />
          <ExcelColumn label="Unidad" value="unidad" />
          <ExcelColumn label="Cantidad" value="cantidad" />
          <ExcelColumn label="Cantidad de regalo" value="cantidad_regalo" />
          <ExcelColumn label="Cantidad total" value="cantidad_total" />
          <ExcelColumn label="Precio de descuento" value="descuento_precio" />
          <ExcelColumn
            label="Porcentaje de descuento"
            value="descuento_porcentaje"
          />
          <ExcelColumn label="Subtotal" value="subtotal" />
          <ExcelColumn label="Impuestos" value="impuestos" />
          <ExcelColumn label="Total" value="total" />
        </ExcelSheet>
      </ExcelFile>
    </Fragment>
  );
}
