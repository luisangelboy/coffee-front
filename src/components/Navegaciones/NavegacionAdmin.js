import React,{useContext} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Box, Typography, Grid, CircularProgress } from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { Link, withRouter } from "react-router-dom";
import { grey } from "@material-ui/core/colors";
import { Cached, ShoppingCart } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import ComponentOnline from "../../components/Connection/ComponentOnline";
import { AccesosContext } from "../../context/Accesos/accesosCtx";
import BackDrop from "../../components/Layouts/BackDrop";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: theme.palette.navbar,
    color: grey[800],
    height: "5vh",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  avatar: {
    height: 24,
    width: 24,
  },
}));

function NavegacionAdmin(props) {
  const classes = useStyles();
  const token = localStorage.getItem("sesionCafi");
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [reloadPage, setReloadPage] = React.useState(false);
  const {
    isOnline,
    ventasToCloud,
    loadingPage, 
    setLoadingPage
  } = useContext(AccesosContext);
  let usuario;

  if (token !== null) usuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const signOut = () => {
    localStorage.removeItem("sesionCafi");
    localStorage.removeItem("tokenCafi");
    localStorage.removeItem("ListaEnEspera");
    props.history.push("/");
  };

  const reloadApp = () =>{
    setReloadPage(true);
    window.location.reload()
  }

  return (
    <Grid container alignItems="center">
      <Grid item md={6}>
        <Box display="flex" mx={1}>
          <Avatar
            alt="Remy Sharp"
            className={classes.avatar}
            src={usuario.imagen}
          />
          <Box mx={1} />
            <Typography color="textSecondary">
              Bienvenido {`${usuario.nombre}`}
            </Typography>
        </Box>
      </Grid>
      <Grid item md={6} style={{ display: "flex", justifyContent: "flex-end" }}>
      <ComponentOnline isOnline={isOnline} classes={classes} ventasToCloud={ventasToCloud} sesion={sesion} fromVentas={false}/>
        <Box display="flex" alignItems={'center'}>
        <Button
          onClick={() => reloadApp()}
          startIcon={reloadPage ? <CircularProgress color="inherit" size={20} /> : <Cached />}
        />
        <Button
          component={Link}
          to="/ventas/venta-general"
          size="medium"
          className={classes.menuButton}
          startIcon={<ShoppingCart />}
        >
          Panel de venta
        </Button>
        {sesion.turno_en_caja_activo === true && turnoEnCurso ? (
          <Button
            color="secondary"
            size="medium"
            className={classes.menuButton}
            variant="text"
            disabled={true}
            startIcon={<PowerSettingsNewIcon />}
          >
            TURNO ACTIVO
          </Button>
        ) : (
          <CerrarSesionDialog signOut={signOut} />
        )}
        </Box>
      </Grid>
      <BackDrop loading={loadingPage} setLoading={setLoadingPage} />
    </Grid>
  );
}

const CerrarSesionDialog = ({ signOut }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="secondary"
        size="medium"
        className={classes.menuButton}
        startIcon={<PowerSettingsNewIcon />}
        variant="text"
        onClick={handleClickOpen}
      >
        Cerrar sesión
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>¿Seguro que deseas cerrar sesión?</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={signOut} color="secondary" variant="contained">
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(NavegacionAdmin);
