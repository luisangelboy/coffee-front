import React, { useCallback, useContext, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";

export default function PreciosDeVentaCompras() {
  const { preciosVenta } = useContext(ComprasContext);

  return (
    <div>
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 150 }}>Precios de venta</TableCell>
              {[1, 2, 3, 4, 5, 6].map((numero, index) => (
                <TableCell style={{ minWidth: 100 }} key={index}>
                  {numero}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {["Utilidad", "Precio de venta"].map((tipo, index) => (
              <TableRow key={index}>
                <TableCell style={{ border: 0 }}>
                  <b>{tipo}</b>
                </TableCell>
                {preciosVenta.map((data, index) => (
                  <RenderPrecios
                    key={index}
                    data={data}
                    index={index}
                    tipo={tipo}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const RenderPrecios = ({ data, tipo, index }) => {
  const {
    preciosVenta,
    setPreciosVenta,
    datosProducto,
    productoOriginal,
  } = useContext(ComprasContext);
  const { precios } = productoOriginal;

  const [precio_neto, setPrecioNeto] = useState(data.precio_neto);

  //creamos variables para trabajar con ellas, no causar errores y afectar las originales
  let copy_preciosVenta = { ...preciosVenta[index] };
  let preciosVenta_base = [...preciosVenta];

  let precio_unitario_con_impuesto =
    /* datosProducto.costo / datosProducto.cantidad; */
    datosProducto.costo / precios.unidad_de_compra.cantidad;
  let precio_unitario_sin_impuesto =
    /* precios.precio_de_compra.precio_sin_impuesto / datosProducto.cantidad; */
    precios.precio_de_compra.precio_sin_impuesto /
    precios.unidad_de_compra.cantidad;

  if (isNaN(precio_unitario_sin_impuesto)) precio_unitario_sin_impuesto = 0;
  if (isNaN(precio_unitario_con_impuesto)) precio_unitario_con_impuesto = 0;

  const calculosCompra = useCallback(() => {
    if (copy_preciosVenta.numero_precio === data.numero_precio) {
      copy_preciosVenta.precio_neto = precio_unitario_con_impuesto;
      setPrecioNeto(precio_unitario_con_impuesto);

      let utilidad_base = data.utilidad ? data.utilidad : 0;
      let utilidad = utilidad_base / 100;

      const precio_venta = parseFloat(
        (
          precio_unitario_sin_impuesto * utilidad +
          precio_unitario_sin_impuesto
        ).toFixed(2)
      );

      copy_preciosVenta.precio_venta = parseFloat(precio_venta.toFixed(2));
      if (precios.iva_activo || precios.ieps_activo) {
        const precio_neto =
          precio_unitario_con_impuesto +
          precio_unitario_con_impuesto * utilidad;

        copy_preciosVenta.precio_neto = parseFloat(precio_neto.toFixed(2));
        setPrecioNeto(parseFloat(precio_neto.toFixed(2)));
      } else {
        copy_preciosVenta.precio_neto = parseFloat(precio_venta.toFixed(2));
        setPrecioNeto(parseFloat(precio_venta.toFixed(2)));
      }
      preciosVenta_base.splice(index, 1, copy_preciosVenta);
      setPreciosVenta(preciosVenta_base);
    }
  }, [datosProducto.costo, datosProducto.cantidad]);

  useEffect(() => {
    if (data.numero_precio === 1) {
      calculosCompra();
    } else if (data.numero_precio > 1 && precio_neto) {
      calculosCompra();
    }
  }, [calculosCompra]);

  switch (tipo) {
    case "Utilidad":
      return <TableCell style={{ border: 0 }}>{data.utilidad}%</TableCell>;
    case "Precio de venta":
      return (
        <TableCell style={{ border: 0 }}>
          ${parseFloat(precio_neto.toFixed(2))}
        </TableCell>
      );
    default:
      return null;
  }
};
