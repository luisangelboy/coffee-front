import React, {
  useContext,
  useState,
  forwardRef,
  useEffect,
  Fragment,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { ComprasContext } from "../../../../context/Compras/comprasContext";
import { Close, Edit, Error } from "@material-ui/icons";
import { initial_state_datosProducto } from "./initial_states";
import { SetOrResetData } from "./productos/setOrResetData";
import { RegProductoContext } from "../../../../context/Catalogos/CtxRegProducto";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "40vh",
  },
});

export default function ListaCompras() {
  const classes = useStyles();
  const { productosCompra, loadingProductos, datosCompra } = useContext(
    ComprasContext
  );

  const productos_ordernados = [...productosCompra];

  return (
    <Paper className={classes.root} variant="outlined">
      <TableContainer
        className={classes.container}
        style={
          loadingProductos
            ? {
                pointerEvents: "none",
                opacity: 0.4,
              }
            : null
        }
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código de barras</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Precio de compra</TableCell>
              <TableCell padding="checkbox">Cantidad</TableCell>
              <TableCell padding="checkbox">Cantidad regalo</TableCell>
              <TableCell padding="checkbox">Cantidad total</TableCell>
              <TableCell padding="checkbox">Presentaciones</TableCell>
              <TableCell>IVA Total</TableCell>
              <TableCell>IEPS Total</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Remover</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos_ordernados.map((producto, index) => {
              return (
                <RenderProductosCompra
                  key={index}
                  producto={producto}
                  index={index}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Typography style={{ fontSize: 18 }}>
            Subtotal:{" "}
            <b>
              ${datosCompra.subtotal ? formatoMexico(datosCompra.subtotal) : 0}
            </b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 18 }}>
            Impuestos:{" "}
            <b>
              $
              {datosCompra.impuestos ? formatoMexico(datosCompra.impuestos) : 0}
            </b>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontSize: 18 }}>
            <b>
              Total: ${datosCompra.total ? formatoMexico(datosCompra.total) : 0}
            </b>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

const RenderProductosCompra = ({ producto, index }) => {
  const {
    datosCompra,
    setDatosProducto,
    setProductoOriginal,
    setPreciosVenta,
    isEditing,
    setIsEditing,
    editFinish,
    setCosto,
    setCantidad,
    setIssue,
  } = useContext(ComprasContext);
  const [isSelected, setIsSelected] = useState(false);
  const productoCTX = useContext(RegProductoContext);

  const seStates = {
    setDatosGenerales: productoCTX.setDatosGenerales,
    setPrecios: productoCTX.setPrecios,
    setValidacion: productoCTX.setValidacion,
    setPreciosP: productoCTX.setPreciosP,
    setImagenes: productoCTX.setImagenes,
    setUnidadesVenta: productoCTX.setUnidadesVenta,
    almacen_inicial: productoCTX.almacen_inicial,
    setAlmacenInicial: productoCTX.setAlmacenInicial,
    setUnidadVentaXDefecto: productoCTX.setUnidadVentaXDefecto,
    setUnidadVentaSecundaria: productoCTX.setUnidadVentaSecundaria,
    setCentroDeCostos: productoCTX.setCentroDeCostos,
    setPreciosPlazos: productoCTX.setPreciosPlazos,
    setSubcategorias: productoCTX.setSubcategorias,
    setOnPreview: productoCTX.setOnPreview,
    setSubcostos: productoCTX.setSubcostos,
    setImagenesEliminadas: productoCTX.setImagenesEliminadas,
    setPresentaciones: productoCTX.setPresentaciones,
    setPresentacionesEliminadas: productoCTX.setPresentacionesEliminadas,
    datosCompra,
  };

  const handleEdit = () => {
    setIsSelected(true);
    setIsEditing({ producto, index, finish: false });
    setDatosProducto(producto);
    SetOrResetData("SET", seStates, producto.producto);
    setProductoOriginal(producto.producto);
    setPreciosVenta(producto.producto.precios.precios_producto);
    setCosto(producto.costo);
    setCantidad(producto.cantidad);
  };

  const handleCancelEdit = () => {
    setIsSelected(false);
    setIsEditing({});
    setDatosProducto(initial_state_datosProducto);
    SetOrResetData("RESET", seStates);
    setCosto(0);
    setCantidad(1);
  };

  useEffect(() => {
    setIsSelected(false);
  }, [editFinish]);

  useEffect(() => {
    if (!producto.cantidad) {
    } else {
      setIssue(false);
    }
  }, [producto.cantidad]);

  const unidad_producto = producto.producto.precios.unidad_de_compra.unidad;
  const { cantidad, cantidad_regalo, cantidad_total } = producto;

  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      selected={isSelected || !cantidad}
      style={
        isEditing.producto && !isSelected
          ? {
              pointerEvents: "none",
              opacity: 0.4,
            }
          : null
      }
    >
      <TableCell>
        {producto.producto.datos_generales
          ? producto.producto.datos_generales.codigo_barras
            ? producto.producto.datos_generales.codigo_barras
            : "-"
          : "-"}
      </TableCell>
      <TableCell>
        {producto.producto.datos_generales.nombre_comercial}
      </TableCell>
      <TableCell width={180}>
        {!cantidad ? (
          <Error color="error" />
        ) : (
          <b>$ {formatoMexico(producto.total)}</b>
        )}
      </TableCell>
      <TableCell>
        {cantidad}
        <b>({unidad_producto})</b>
      </TableCell>
      <TableCell>
        {cantidad_regalo}
        <b>({unidad_producto})</b>
      </TableCell>
      <TableCell>
        {cantidad_total}
        <b>({unidad_producto})</b>
      </TableCell>
      <TableCell>
        {producto.producto.presentaciones.length > 0
          ? producto.producto.presentaciones.length
          : "N/A"}
      </TableCell>
      <TableCell width={140}>{`${producto.producto.precios.iva}% - $${producto.iva_total ? formatoMexico(producto.iva_total) : 0}`}</TableCell>
      <TableCell width={140}>{`${producto.producto.precios.ieps}% - $${producto.ieps_total ? formatoMexico(producto.ieps_total) : 0}`}</TableCell>
      <TableCell width={50}>
        {isSelected ? (
          <IconButton
            color="inherit"
            size="small"
            onClick={() => handleCancelEdit()}
          >
            <Close />
          </IconButton>
        ) : (
          <IconButton color="primary" size="small" onClick={() => handleEdit()}>
            <Edit />
          </IconButton>
        )}
      </TableCell>
      <TableCell width={50}>
        <ModalDeleteProducto index={index} isSelected={isSelected} />
      </TableCell>
    </TableRow>
  );
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDeleteProducto = ({ index, isSelected }) => {
  const {
    productosCompra,
    setProductosCompra,
    datosCompra,
    setDatosCompra,
  } = useContext(ComprasContext);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const eliminarCompra = () => {
    let copy_compras = [...productosCompra];
    let objeto_eliminado = copy_compras.splice(index, 1);

    setDatosCompra({
      ...datosCompra,
      subtotal: datosCompra.subtotal - objeto_eliminado[0].subtotal,
      impuestos: datosCompra.impuestos - objeto_eliminado[0].impuestos,
      total: datosCompra.total - objeto_eliminado[0].total,
    });
    setProductosCompra([...copy_compras]);
    handleClose();
  };

  return (
    <Fragment>
      <IconButton
        color="secondary"
        size="small"
        onClick={handleClickOpen}
        disabled={isSelected}
      >
        <RemoveCircleOutlineIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="modal-eliminar-compra"
      >
        <DialogTitle id="modal-eliminar-compra">
          Seguro que quiere eliminar esto de la lista?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={eliminarCompra} color="secondary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
