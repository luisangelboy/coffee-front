import React, { useContext } from "react";
import {
  Button,
  Box,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Container,
  makeStyles,
  Slide,
} from "@material-ui/core";
import { FcRating } from "react-icons/fc";
import CloseIcon from "@material-ui/icons/Close";
import VistaMarcas from "./VistaMarcas";
import { MarcasProvider } from "../../../../context/Catalogos/Marcas";
import DescripcionCatalogo from "../../../../components/DescripcionCatalogo";
import { AccesosContext } from "../../../../context/Accesos/accesosCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function Marcas() {
  const { isOnline } = useContext(AccesosContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const descripcion =
    "En este apartado se registran las marcas que se asignarán a un producto.";
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <MarcasProvider>
        <Button fullWidth onClick={handleClickOpen}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <FcRating className={classes.icon} />
            </Box>
            Marcas
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
                Marcas
              </Typography>
              <Box m={1} display="flex" flexDirection="row">
                <DescripcionCatalogo texto={descripcion} />
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

          <Box mt={4}>
            <Container maxWidth="md">
              <VistaMarcas isOnline={isOnline} />
            </Container>
          </Box>
        </Dialog>
      </MarcasProvider>
    </div>
  );
}
