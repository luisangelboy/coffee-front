import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CrearProducto from "./crearProducto";
import DescuentoProductos from "./Descuentos/Descuento";
import EliminarProducto from "./EliminarProducto";
import Tooltip from "@material-ui/core/Tooltip";
import GenerarEtiquetaBarcode from "./GenerarEtiquetaBarcode";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "65vh",
    "& ::-webkit-scrollbar": {
      display: "none",
    },
  },
  avatar: {
    width: 130,
    height: 130,
  },
});

export default function ListaProductos({
  obtenerProductos,
  productosRefetch,
  page,
  setPage,
  limit,
  isOnline,
}) {
  const classes = useStyles();

  const handleChangePage = (_, nextPage) => {
    setPage(nextPage);
  };

  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Codigo barras</TableCell>
              <TableCell>Clave alterna</TableCell>
              <TableCell>Nombre comercial</TableCell>
              <TableCell>Existencia</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="hide-scroll">
            {obtenerProductos.docs.map((producto, index) => {
              return (
                <RenderTableRows
                  key={index}
                  producto={producto}
                  productosRefetch={productosRefetch}
                  isOnline={isOnline}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={obtenerProductos.totalDocs}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
      />
    </div>
  );
}

const RenderTableRows = ({ producto, productosRefetch, isOnline }) => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <GenerarEtiquetaBarcode
            barcode={producto.datos_generales.codigo_barras}
          />
        </TableCell>
        <TableCell>{producto.datos_generales.clave_alterna}</TableCell>
        <TableCell>{producto.datos_generales.nombre_comercial}</TableCell>
        <TableCell>
          {producto.inventario_general.map(
            (existencia) =>
              `${existencia.cantidad_existente} ${existencia.unidad_inventario}`
          )}
        </TableCell>
        <TableCell>{producto.datos_generales.tipo_producto}</TableCell>
        <TableCell align="center" padding="checkbox">
          {sesion.accesos.catalogos.productos.editar === false ? null : (
            <CrearProducto
              isOnline={isOnline}
              accion={true}
              datos={producto}
              productosRefetch={productosRefetch}
            />
          )}
        </TableCell>
        <TableCell align="center" padding="checkbox">
          <DescuentoProductos
            isOnline={isOnline}
            datos={producto}
            productosRefetch={productosRefetch}
          />
        </TableCell>
        <TableCell align="center" padding="checkbox">
          {sesion.accesos.catalogos.productos.eliminar === false ? null : (
            <Tooltip
              title="Solo se puede eliminar un producto si este tiene 0 en inventarios"
              arrow
            >
              <EliminarProducto
                isOnline={isOnline}
                datos={producto}
                productosRefetch={productosRefetch}
              />
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  );
};
