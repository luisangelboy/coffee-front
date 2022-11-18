import React, { Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import { CircularProgress } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductoConMedidas({
  agregarProductos,
  open,
  setOpen,
  productos,
}) {
  const handleClickOpen = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
            >
              <CloseIcon />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <VistaMedidasVenta
            productos={productos}
            agregarProductos={agregarProductos}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

const VistaMedidasVenta = ({ productos, agregarProductos }) => {
  if (!productos) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="53vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (productos && productos.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        NO HAY UNIDADES
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={5}>
        <Box width="100%" my={3}>
          <Typography variant="h6" align="center">
            <b>{productos[0]?.id_producto.datos_generales.nombre_comercial}</b>
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {productos.map((producto, index) => (
            <MappingProductos
              key={index}
              producto={producto}
              agregarProductos={agregarProductos}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  medida: {
    height: 64,
    width: 74,
    fontSize: 28,
  },
  badge: {
    "& .MuiBadge-badge": {
      height: 30,
      width: 30,
      borderRadius: "100%",
      fontSize: 18,
    },
  },
});

const MappingProductos = ({ producto, agregarProductos }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid item className={classes.badge}>
      <Tooltip title={producto.color.nombre} placement="top" arrow>
        <Badge badgeContent={producto.cantidad} color="primary" showZero={true}>
          <Button
            disableElevation
            variant="contained"
            className={classes.medida}
            style={{
              backgroundColor: producto.color.hex,
              color: theme.palette.getContrastText(producto.color.hex),
            }}
            onClick={() => agregarProductos(producto)}
          >
            {producto.medida.talla}
          </Button>
        </Badge>
      </Tooltip>
    </Grid>
  );
};
