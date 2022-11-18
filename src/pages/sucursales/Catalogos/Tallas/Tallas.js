import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Container, Grid } from "@material-ui/core";
import RegistroTallas from "./RegistroTallas";
import DescripcionCatalogo from "../../../../components/DescripcionCatalogo";
import tallasImg from "../../../../icons/tallas.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100vh",
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  iconSvg: {
    width: 100,
  },
  icon: {
    fontSize: 100,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Tallas() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(!open);
  const descripcion =
    "En este apartado se registran las  tallas y/o números que se asignarán a un producto tipo Ropa o Calzado según sea el caso .";
  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img src={tallasImg} alt="icono ropa" className={classes.iconSvg} />
          </Box>
          Tallas y numeros
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Tallas y números
            </Typography>
            <Box m={1} flexDirection="row" display="flex">
              <DescripcionCatalogo texto={descripcion} />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container>
          <Box>
            <Grid container spacing={5}>
              <Grid item md={6} xs={12}>
                <RegistroTallas tipo="ROPA" />
              </Grid>
              <Grid item md={6} xs={12}>
                <RegistroTallas tipo="CALZADO" />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </div>
  );
}
