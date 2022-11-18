import React, { Fragment} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import {
  Dialog,
  Typography,
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Chip,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core";

import {  Done } from "@material-ui/icons";
import { formatoMexico } from "../../../../../../../config/reuserFunctions";

const useStyles = makeStyles({
    
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
export default function DetalleVentaCredito(props){
    const classes = useStyles();
    const theme = useTheme();
    const handleOpen = () =>{
        props.setOpenDetalle(!props.openDetalle)
    }
    return(
       <Fragment>
            <Dialog
                open={props.openDetalle}
                onClose={handleOpen}
                fullWidth
                maxWidth="lg"
                TransitionComponent={Transition}
            >
            <DialogTitle>
                <Box display="flex">
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Datos de compra
                    </Typography>
                    <Button
                    variant="text"
                    color="primary"
                    onClick={handleOpen}
                    size="large"
                    >
                    <CloseIcon style={{ fontSize: 30 }} />
                    </Button>
                </Box>
                </DialogTitle>
                <DialogContent>
                    <Paper className={classes.root}>
                            <TableContainer className={classes.container}>
                            <Table stickyHeader size="small" aria-label="a dense table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Producto</TableCell>
                                    <TableCell>Medida</TableCell>
                                    <TableCell>Color</TableCell>
                                    <TableCell>Unidad</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>C. regalo</TableCell>
                                    <TableCell>C. total</TableCell>
                                    {/* <TableCell>Descuento</TableCell> */}
                                    <TableCell>Subtotal</TableCell>
                                    <TableCell>Impuestos</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {props.datos?.productos?.map((producto, index) => {
                                   
                                    return (
                                    <TableRow hover tabIndex={-1} key={index}>
                                        <TableCell>
                                        {producto.producto.datos_generales.nombre_comercial}
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                        {producto.medida && producto.medida.medida ? producto.medida.medida : "N/A"}
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                        {producto.color && producto.color.hex ? (
                                            <Chip
                                            label={producto.color.color}
                                            size="small"
                                            style={{
                                                backgroundColor: producto.color.hex,
                                                color: theme.palette.getContrastText(
                                                    producto.color.hex
                                                ),
                                            }}
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                        </TableCell>
                                        <TableCell>{producto.unidad}</TableCell>
                                        <TableCell>{producto.cantidad_venta}</TableCell>
                                        <TableCell>{producto.cantidad_regalo}</TableCell>
                                        <TableCell>{producto.cantidad_total}</TableCell>
                                        {/* <TableCell>{`$${producto.descuento_precio} - %${producto.descuento_porcentaje}`}</TableCell> */}
                                        <TableCell>
                                        <b>${formatoMexico(producto.subtotal)}</b>
                                        </TableCell>
                                        <TableCell>
                                        <b>${formatoMexico(producto.impuestos)}</b>
                                        </TableCell>
                                        <TableCell>
                                        <b>${formatoMexico(producto.total)}</b>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </Paper>
                </DialogContent>
                <DialogActions>
                <Button
                    variant="text"
                    color="primary"
                    size="large"
                    startIcon={<Done />}
                    onClick={() => handleOpen()}
                >
                    Aceptar
                </Button>
                </DialogActions>
            </Dialog>   
       </Fragment>
    )
};
