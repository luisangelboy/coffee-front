import React, { forwardRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Slide,
  Button,
  Box,
  Dialog,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FcPlus } from "react-icons/fc";
import ContainerRegistroAlmacen from "./ContainerRegistroAlmacen";
import ListaAlmacen from "./ListaAlmacen";

import { AlmacenProvider } from "../../../../context/Almacenes/crearAlmacen";
import CloseIcon from "@material-ui/icons/Close";
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegistroAlmacen() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AlmacenProvider>
        <Button fullWidth onClick={handleClickOpen}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <FcPlus className={classes.icon} />
            </Box>
            Almacenes
          </Box>
        </Button>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Agregar almacen
              </Typography>
              <Box m={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                  size="large"
                >
                  <CloseIcon style={{ fontSize: 30 }} />
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Box m={3} display="flex" justifyContent="flex-end">
            {sesion.accesos.almacenes.almacen.agregar === false ? null : (
              <ContainerRegistroAlmacen accion="registrar" />
            )}
          </Box>
          <Box mx={4}>
            <ListaAlmacen />
          </Box>
        </Dialog>
      </AlmacenProvider>
    </div>
  );
}
