import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { Box, Container } from "@material-ui/core";
import RegistroCentroCostos from "./RegistroCentroCostos";
import DescripcionCatalogo from "../../../../components/DescripcionCatalogo";
import CostosImg from "../../../../icons/costos.svg";
import { AccesosContext } from "../../../../context/Accesos/accesosCtx";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CentroCostos() {
  const { isOnline } = useContext(AccesosContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const descripcion =
    "En este apartado podrás registrar tus cuentas y subcuentas que utilizarás al momento de llevar tu control financiero. Por ejemplo: Compras, Ventas.";
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={CostosImg}
              alt="icono numero calzado"
              className={classes.icon}
            />
          </Box>
          Centro de costos
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
              Centro de costos
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

        <Box>
          <Container maxWidth="md">
            <RegistroCentroCostos isOnline={isOnline} />
          </Container>
        </Box>
      </Dialog>
    </div>
  );
}
