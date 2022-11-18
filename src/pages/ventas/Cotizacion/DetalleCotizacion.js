import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import Dialog from "@material-ui/core/Dialog";
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
import { Tooltip } from "@material-ui/core";
import CotizacionPdf from "./CotizacionPdf";
//import { Done } from "@material-ui/icons";
//import CancelarFolio from "./CancelarFolio";

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

export default function DetalleCotizacion({ venta, open, handleClose, refetch }) {
  if (!venta) return null;
    console.log(venta);
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
    
    >
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
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <CotizacionPdf isIcon={false} cotizacion={venta} />
        </Box>
      </DialogTitle>
      <DialogContent>
        {(venta.cliente) ? (
          <Box my={1}>
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
                      <TableCell>Medida</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>IVA</TableCell>
                      <TableCell>IEPS</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell>Impuestos</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venta.productos.map((row, index) => {return(
                      <TableRow key={index}>
                        <TableCell>
                            {row.id_producto.datos_generales.codigo_barras}
                         {/* {row.id_unidad_venta.codigo_barras} */}
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
                        <ComponenteDescuento producto={venta} />
                        <TableCell>
                          $
                          {row.iva_total_producto
                            ? formatoMexico(row.iva_total_producto)
                            : "0.00"}
                        </TableCell>
                        <TableCell>
                          $
                          {row.ieps_total_producto
                            ? formatoMexico(row.ieps_total_producto)
                            : "0.00"}
                        </TableCell>
                        <TableCell>${formatoMexico(row.subtotal_total_producto)}</TableCell>
                        <TableCell>${formatoMexico(row.impuestos_total_producto)}</TableCell>
                        <TableCell>${formatoMexico(row.total_total_producto)}</TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
     {/*  <DialogActions
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <CancelarFolio
          venta={venta}
          handleCloseInfoVenta={handleClose}
          refetch={refetch}
          selected={venta}
        />
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          startIcon={<Done />}
        >
          Aceptar
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}

const ComponenteMedidaColor = ({ producto }) => {
  const classes = useStyles();
  const theme = useTheme();

  if (producto.color.nombre && producto.medida.talla) {
    return (
      <TableCell align="center">
        <Tooltip title={producto.color.nombre} placement="top" arrow>
          <div
            className={classes.colorContainer}
            style={{
              backgroundColor: producto.color.hex,
              color: theme.palette.getContrastText(producto.color.hex),
            }}
          >
            {producto.medida.talla}
          </div>
        </Tooltip>
      </TableCell>
    );
  } else {
    return <TableCell align="center">{"N/A"}</TableCell>;
  }
};

const ComponenteDescuento = ({ producto }) => {
  if (producto.descuento_general_activo === true) {
    const { dinero_descontado, porciento } = producto.descuento_general;
    return (
      <TableCell>
        {`$${formatoMexico(dinero_descontado)} - %${porciento}`}
      </TableCell>
    );
  } else {
    return <TableCell>{"$0.00"}</TableCell>;
  }
};
