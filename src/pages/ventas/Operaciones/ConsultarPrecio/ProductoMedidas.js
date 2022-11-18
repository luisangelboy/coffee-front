import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ItemsCarousel from "react-items-carousel";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles({
  colorContainer: {
    height: 28,
    width: 28,
    borderRadius: "15%",
    fontSize: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function VistaProductoMedidas({ productos, agregarProductos }) {
  const classes = useStyles();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;

  const producto_base = productos[0];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          {producto_base.id_producto.imagenes.length > 0 ? (
            <Box px={2} border={1}>
              <ItemsCarousel
                requestToChangeActive={setActiveItemIndex}
                activeItemIndex={activeItemIndex}
                numberOfCards={1}
                leftChevron={
                  <IconButton aria-label="delete" disabled color="primary">
                    <ArrowBackIosIcon />
                  </IconButton>
                }
                rightChevron={
                  <IconButton aria-label="delete" disabled color="primary">
                    <ArrowForwardIosIcon />
                  </IconButton>
                }
                infiniteLoop={true}
                outsideChevron
                chevronWidth={chevronWidth}
              >
                {producto_base.id_producto.imagenes.map((image, index) => {
                  return (
                    <Box
                      key={index}
                      className={classes.containerImagenesProducto}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img
                        alt="Imagen producto"
                        src={image.url_imagen}
                        className={classes.imagenProducto}
                      />
                    </Box>
                  );
                })}
              </ItemsCarousel>
            </Box>
          ) : (
            <Box
              height="150px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <PhotoLibraryIcon color="disabled" style={{ fontSize: 100 }} />
            </Box>
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          <Box display="flex" alignItems="center" height="100%">
            <Box width="100%">
              <Typography variant="h6">
                <b>
                  {producto_base.id_producto?.datos_generales.nombre_comercial}
                </b>
              </Typography>
              <Box display="flex">
                <Box textAlign="center" mr={2}>
                  <Typography>
                    {`Unidad: `}
                    <b>{producto_base.unidad}</b>
                  </Typography>
                </Box>
                <Box textAlign="center" mx={1}>
                  <Typography>
                    {`Existencias: `}
                    <b>
                      {producto_base.inventario_general
                        ? producto_base.inventario_general[0].cantidad_existente
                        : 0}
                    </b>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box my={1}>
        <TableContainer>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Código</TableCell>
                <TableCell padding="checkbox">Cantidad</TableCell>
                <TableCell padding="checkbox">Color/Talla</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Descuento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto, index) => (
                <MappingProductos
                  key={index}
                  producto={producto}
                  agregarProductos={agregarProductos}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

const MappingProductos = ({ producto, agregarProductos }) => {
  const classes = useStyles();
  const theme = useTheme();

  let TableCellMedidaColor = () => {
    if (producto.color && producto.medida) {
      return (
        <TableCell
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "56px",
          }}
        >
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

  let TableCellDescuento = () => {
    if (producto.descuento_activo === true && producto.descuento) {
      return (
        <TableCell>
          <Typography color="primary">
            ${formatoMexico(producto.descuento.precio_neto)}
          </Typography>
        </TableCell>
      );
    } else {
      return <TableCell align="center">$0.00</TableCell>;
    }
  };

  return (
    <TableRow>
      <TableCell padding="checkbox">
        <IconButton
          size="small"
          onClick={() => agregarProductos(producto)}
          color="primary"
        >
          <Add />
        </IconButton>
      </TableCell>
      <TableCell>{producto.codigo_barras}</TableCell>
      <TableCell>{producto.cantidad}</TableCell>
      <TableCellMedidaColor />
      <TableCell>${formatoMexico(producto.precio)}</TableCell>
      <TableCellDescuento />
    </TableRow>
  );
};
