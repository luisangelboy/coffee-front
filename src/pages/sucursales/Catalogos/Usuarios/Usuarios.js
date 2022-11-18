import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { Search } from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Grid,
  Container,
} from "@material-ui/core";
import ListaUsuarios from "./ListaUsuario";
import CrearUsuario from "./CrearUsuario";
import { UsuarioProvider } from "../../../../context/Catalogos/usuarioContext";
import UsuariosInactivosComponent from "./UsuariosInactivos";
import UsuariosIcon from "../../../../icons/usuarios.svg";
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
  root: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Usuarios() {
  const { isOnline } = useContext(AccesosContext);
  const classes = useStyles();
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const [open, setOpen] = React.useState(false);
  const [filtro, setFiltro] = useState("");
  const [values, setValues] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") setFiltro(e.target.defaultValue);
  };

  return (
    <div>
      <UsuarioProvider>
        <Button fullWidth onClick={handleClickOpen}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={UsuariosIcon}
                alt="icono numero calzado"
                className={classes.icon}
              />
            </Box>
            Usuarios
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
                Usuarios
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

          <Box mt={3} display="flex" justifyContent="space-between">
            <Container>
              <Grid container spacing={2}>
                <Grid item xs={8} md={6}>
                  <Paper className={classes.root}>
                    <InputBase
                      fullWidth
                      placeholder="Buscar cliente..."
                      onChange={(e) => setValues(e.target.value)}
                      onKeyPress={pressEnter}
                      value={values}
                    />
                    <IconButton onClick={() => setFiltro(values)}>
                      <Search />
                    </IconButton>
                  </Paper>
                </Grid>
                <Grid item xs={4} md={6}>
                  <Box display="flex" justifyContent="flex-end">
                    {permisosUsuario.accesos.catalogos.usuarios.agregar ===
                    false ? null : (
                      <UsuariosInactivosComponent isOnline={isOnline} />
                    )}
                    <Box mx={1} />
                    {permisosUsuario.accesos.catalogos.usuarios.agregar ===
                    false ? null : (
                      <CrearUsuario
                        isOnline={isOnline}
                        accion="registrar"
                        datos={undefined}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Box my={3}>
                <ListaUsuarios
                  isOnline={isOnline}
                  sucursal={sesion.sucursal._id}
                  empresa={sesion.empresa._id}
                  filtro={filtro}
                />
              </Box>
            </Container>
          </Box>
        </Dialog>
      </UsuarioProvider>
    </div>
  );
}
