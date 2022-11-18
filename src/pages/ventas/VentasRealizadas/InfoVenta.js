import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  formatoFechaCorta,
  formatoMexico,
} from "../../../config/reuserFunctions";
import { Snackbar, Tooltip } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import CancelarFolio from "./CancelarFolio";
import { ClienteCtx } from "../../../context/Catalogos/crearClienteCtx";
import { VentasContext } from "../../../context/Ventas/ventasContext";

const useStyles = makeStyles((theme) => ({
  colorContainer: {
    /* border: "1px solid rgba(0,0,0, .3)", */
    /* marginLeft: 8, */
    height: 28,
    width: 28,
    borderRadius: "15%",
    fontSize: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InfoVentaFolio({ venta, open, handleClose, refetch, handleCloseListaVentas }) {
  const [openSnack, setOpenSnack] = React.useState(false);
  const { updateClientVenta, setUpdateClientVenta } = React.useContext(
    ClienteCtx
  );
  const { updateTablaVentas, setUpdateTablaVentas } = React.useContext(VentasContext);

  const updateDataStorage = () => {
    setUpdateTablaVentas(!updateTablaVentas);
    setUpdateClientVenta(!updateClientVenta);
  };

  const handleClickOpen = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const restaurarVenta = () => {
    if(venta.nota_credito.length) return
    let datosVenta = JSON.parse(localStorage.getItem("DatosVentas"));
    if (datosVenta === null) {
      //armar array de productos
      let productos = [];

      venta.productos.forEach((res) => {
        productos.push({
          cantidad: res.cantidad,
          cantidad_venta: res.cantidad_venta,
          cantidad_venta_original: res.cantidad_venta,
          codigo_barras: res.id_producto.datos_generales.codigo_barras,
          codigo_unidad: res.codigo_unidad,
          color: res.color,
          concepto: res.concepto,
          default: res.default,
          descuento: res.id_unidad_venta.descuento,
          descuento_activo: res.id_unidad_venta.descuento_activo,
          granel_producto: res.granel_producto,
          id_producto: res.id_producto,
          id_unidad_venta: res.id_unidad_venta,
          ieps_total_producto: res.ieps_total,
          impuestos_total_producto: res.impuestos,
          inventario_general: res.inventario_general,
          iva_total_producto: res.iva_total,
          medida: res.medida,
          precio: res.precio,
          precio_a_vender: res.precio_a_vender,
          precio_actual_object: res.precio_actual_object,
          precio_actual_producto: res.precio_actual_producto,
          precio_anterior: res.precio_actual_producto,
          precio_unidad: res.precio_unidad,
          subtotal_total_producto: res.subtotal,
          total_total_producto: res.total,
          unidad: res.unidad,
          unidad_principal: res.id_unidad_venta.unidad_principal,
          _id: res.id_unidad_venta._id,
        });
      });

      //armar objeto para Storage

      let datosVenta = {
        _id: venta._id,
        cliente: venta.cliente,
        descuento: venta.descuento,
        ieps: venta.ieps,
        impuestos: venta.impuestos,
        iva: venta.iva,
        monedero: venta.monedero,
        productos,
        subTotal: venta.subTotal,
        total: venta.total,
        venta_cliente: venta.venta_cliente,
        usuario: venta.usuario,
        tipo_emision: venta.tipo_emision,
        folio: venta.folio,
        montos_en_caja: venta.montos_en_caja,
        credito: venta.credito,
        abono_minimo: venta.abono_minimo,
        descuento_general_activo: venta.descuento_general_activo,
        dias_de_credito_venta: venta.dias_de_credito_venta,
        fecha_de_vencimiento_credito: venta.fecha_de_vencimiento_credito,
        cambio: venta.cambio,
        metodo_pago: venta.metodo_pago,
        id_caja: venta.id_caja,
        forma_pago: venta.forma_pago,
        factura: venta.factura,
        empresa: venta.empresa,
        sucursal: venta.sucursal,
        fecha_registro: venta.fecha_registro,
        status: venta.status,
        nota_credito: true,
        total_original: venta.total,
        saldo_favor: 0,
      };

      //se agregan la venta a localStorage
      localStorage.setItem("DatosVentas", JSON.stringify(datosVenta));
      updateDataStorage();
      handleClose();
      handleCloseListaVentas();
    } else {
      handleClickOpen();
    }
  };

  if (!venta) return null;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnack}
        autoHideDuration={5000}
        onClose={handleSnackClose}
        message="No pudes realizar esta acción, tienes una venta en curso."
      />
      <DialogTitle>
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography>
              <b>Caja: </b>
              {` ${venta.id_caja.numero_caja}`}
            </Typography>
            <Box mx={1} />
            <Typography>
              <b>Usuario en caja:</b> {` ${venta.usuario.nombre}`}
            </Typography>
          </Box>
          <Box>
            <Typography align="right">
              <b>Folio:</b>
              {` ${venta.folio}`}
            </Typography>
            <Box mx={1} />
            <Typography>
              <b>Fecha:</b>
              {` ${formatoFechaCorta(venta.fecha_registro)}`}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        {venta.cliente !== null ? (
          <Box my={2}>
            <Box display="flex" alignItems="center">
              <Avatar>
                <AccountBoxIcon />
              </Avatar>
              <Box mx={1} />
              <Box>
                <Typography variant="h6">Cliente</Typography>
              </Box>
            </Box>
            <Box my={1}>
              <Paper variant="outlined">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Numero de Cliente</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Clave</TableCell>
                        <TableCell>Telefono</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{venta.cliente.numero_cliente}</TableCell>
                        <TableCell>{venta.cliente.nombre_cliente}</TableCell>
                        <TableCell>{venta.cliente.clave_cliente}</TableCell>
                        <TableCell>{venta.cliente.telefono}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        ) : null}
        <Box my={2}>
          <Box display="flex" alignItems="center">
            <Avatar>
              <AttachMoneyIcon />
            </Avatar>
            <Box mx={1} />
            <Box>
              <Typography variant="h6">Venta</Typography>
            </Box>
          </Box>
          <Box my={1}>
            <Paper variant="outlined">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Venta Crédito</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>Monedero</TableCell>
                      <TableCell>IVA</TableCell>
                      <TableCell>IEPS</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell>Impuestos</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{venta.credito ? "SI" : "NO"}</TableCell>
                      <TableCell>
                        ${venta.descuento ? formatoMexico(venta.descuento) : 0}
                      </TableCell>
                      <TableCell>
                        ${venta.monedero ? formatoMexico(venta.monedero) : 0}
                      </TableCell>
                      <TableCell>
                        ${venta.iva ? formatoMexico(venta.iva) : 0}
                      </TableCell>
                      <TableCell>
                        ${venta.ieps ? formatoMexico(venta.ieps) : 0}
                      </TableCell>
                      <TableCell>${formatoMexico(venta.subTotal)}</TableCell>
                      <TableCell>${formatoMexico(venta.impuestos)}</TableCell>
                      <TableCell>{formatoMexico(venta.total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
        <Box my={2}>
          <Box display="flex" alignItems="center">
            <Avatar>
              <ShoppingCartIcon />
            </Avatar>
            <Box mx={1} />
            <Box>
              <Typography variant="h6">Artículos</Typography>
            </Box>
          </Box>
          <Box my={1}>
            <Paper variant="outlined">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código de barras</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell padding="checkbox">Medida</TableCell>
                      <TableCell padding="checkbox">Unidad</TableCell>
                      <TableCell padding="checkbox">Cant</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell>Impuestos</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venta.productos.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {row.id_unidad_venta.codigo_barras}
                        </TableCell>
                        <TableCell>
                          {row.id_producto.datos_generales.nombre_comercial}
                        </TableCell>
                        <ComponenteMedidaColor producto={row} />
                        <TableCell>{row.unidad}</TableCell>
                        <TableCell>{row.cantidad_venta}</TableCell>
                        <TableCell>
                          ${formatoMexico(row.precio_a_vender)}
                        </TableCell>
                        <ComponenteDescuento producto={row} />
                        <TableCell>${formatoMexico(row.subtotal)}</TableCell>
                        <TableCell>${formatoMexico(row.impuestos)}</TableCell>
                        <TableCell>${formatoMexico(row.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box display="flex">
          <CancelarFolio
            venta={venta}
            handleCloseInfoVenta={handleClose}
            refetch={refetch}
            selected={venta}
          />
          <Box mx={1} />
          <Button
            color="primary"
            variant="outlined"
            startIcon={venta.nota_credito.length ? null : <Edit />}
            onClick={() => restaurarVenta()}
            disableRipple={venta.nota_credito.length ? true : false}
            disableFocusRipple={venta.nota_credito.length ? true : false}

          >
            {venta.nota_credito.length ? "Ya se realizo nota de crédito" : "Nota de crédito"}
          </Button>
        </Box>

        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const ComponenteMedidaColor = ({ producto }) => {
  const classes = useStyles();
  const theme = useTheme();

  if (producto.color.color && producto.medida.medida) {
    return (
      <TableCell align="center">
        <Tooltip title={producto.color.color} placement="top" arrow>
          <div
            className={classes.colorContainer}
            style={{
              backgroundColor: producto.color.hex,
              color: theme.palette.getContrastText(producto.color.hex),
            }}
          >
            {producto.medida.medida}
          </div>
        </Tooltip>
      </TableCell>
    );
  } else {
    return <TableCell align="center">{"N/A"}</TableCell>;
  }
};

const ComponenteDescuento = ({ producto }) => {
  if (producto.id_unidad_venta.descuento_activo === true) {
    const { dinero_descontado, porciento } = producto.id_unidad_venta.descuento;
    return (
      <TableCell>
        {`$${formatoMexico(dinero_descontado)} - %${porciento}`}
      </TableCell>
    );
  } else {
    return <TableCell>{"$0.00"}</TableCell>;
  }
};
