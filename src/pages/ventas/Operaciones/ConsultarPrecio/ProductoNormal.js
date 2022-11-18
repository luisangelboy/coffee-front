import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ItemsCarousel from "react-items-carousel";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import useStyles from "../../styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";

export default function VistaProductoNormal({
  productoBase,
  agregarProductos,
}) {
  const classes = useStyles();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;

  return (
    <Grid container spacing={2}>
      <Grid item sm={4} xs={12}>
        {productoBase.id_producto.imagenes.length > 0 ? (
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
              {productoBase.id_producto.imagenes.map((image, index) => {
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
                {productoBase.id_producto?.datos_generales.nombre_comercial}
              </b>
            </Typography>
            <Typography>
              {`Codigo de barras: `}
              <b>{productoBase.codigo_barras}</b>
            </Typography>
            <Box display="flex">
              <Box textAlign="center" mr={2}>
                <Typography>
                  {`Unidad: `}
                  <b>{productoBase.unidad}</b>
                </Typography>
              </Box>
              <Box textAlign="center" mx={1}>
                <Typography>
                  {`Existencias: `}
                  <b>
                    {productoBase.inventario_general
                      ? productoBase.inventario_general[0].cantidad_existente
                      : 0}
                  </b>
                </Typography>
              </Box>
            </Box>
            {productoBase.descuento_activo === true ? (
              <Typography color="primary">
                <b>Descuento activo </b>
              </Typography>
            ) : null}
            <Box my={1} display="flex">
              {productoBase.descuento_activo === true ? (
                <Box mr={2}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    style={{ textDecoration: "line-through" }}
                  >
                    <b> ${formatoMexico(productoBase.precio)} </b>
                  </Typography>
                </Box>
              ) : null}
              <Box>
                <Typography variant="h4">
                  {productoBase.descuento_activo === true ? (
                    <b>${formatoMexico(productoBase.descuento.precio_neto)}</b>
                  ) : (
                    <b>${formatoMexico(productoBase.precio)}</b>
                  )}
                </Typography>
              </Box>
              <Box mx={2} />
              <Button
                size="large"
                onClick={() => agregarProductos(productoBase)}
                color="primary"
                startIcon={<Add />}
              >
                Agregar
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
