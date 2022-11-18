import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { FcManager } from "react-icons/fc";
import { Box, Grid, IconButton, InputBase, Paper } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ListaClientes from "./ListaClientes";
import CrearCliente from "./CrearCliente";
import ClientesInactivosComponent from "./ClientesInactivos";
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
    fontSize: 100,
  },
  root: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cliente() {
  const { isOnline } = useContext(AccesosContext);
  const classes = useStyles();

  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") setValues(e.target.defaultValue);
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <FcManager className={classes.icon} />
          </Box>
          Cliente
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
              Cliente
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
        <Box mx={4} my={3}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={8}>
              <Paper className={classes.root}>
                <InputBase
                  fullWidth
                  placeholder="Buscar cliente..."
                  onChange={(e) => setValues(e.target.value)}
                  onKeyPress={pressEnter}
                  value={values}
                />
                <IconButton onClick={() => setValues(values)}>
                  <Search />
                </IconButton>
              </Paper>
            </Grid>
            <Grid
              item
              md={6}
              xs={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {permisosUsuario.accesos.catalogos.clientes.agregar ===
              false ? null : (
                <ClientesInactivosComponent
                  isOnline={isOnline}
                  tipo="CLIENTE"
                />
              )}
              <Box mx={1} />
              {permisosUsuario.accesos.catalogos.clientes.agregar ===
              false ? null : (
                <CrearCliente
                  isOnline={isOnline}
                  tipo="CLIENTE"
                  accion="registrar"
                />
              )}
            </Grid>
          </Grid>
        </Box>
        <Box mx={4}>
          <ListaClientes isOnline={isOnline} tipo="CLIENTE" filtro={values} />
        </Box>
      </Dialog>
    </div>
  );
}
