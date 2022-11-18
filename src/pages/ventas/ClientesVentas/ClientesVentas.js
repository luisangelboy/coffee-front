import React, { Fragment, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ListaClientes from "../../sucursales/Catalogos/Cliente/ListaClientes";
import CrearCliente from "../../sucursales/Catalogos/Cliente/CrearCliente";
import CloseIcon from "@material-ui/icons/Close";
import { FcBusinessman } from "react-icons/fc";

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

export default function ClientesVentas() {
  const classes = useStyles();
  let turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

  const [values, setValues] = useState("");

  const pressEnter = (e) => {
    if (e.key === "Enter") setValues(e.target.defaultValue);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(!open);
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.altKey && e.keyCode === 67) {
      handleClickOpen();
    }
  }

  useEffect(() => {
    turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  }, [turnoEnCurso]);

  return (
    <Fragment>
      <Button
        style={{
          height: "100%",
          width: "100%",
          border: ".6px solid #DBDBDB",
        }}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso}
      >
        <Box>
          <Box
            style={
              !turnoEnCurso
                ? {
                    pointerEvents: "none",
                    opacity: 0.5,
                  }
                : null
            }
          >
            <FcBusinessman style={{ fontSize: 45 }} />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Clientes</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>aLT + C</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <FcBusinessman style={{ fontSize: 45 }} />
              <Box mx={1} />
              <Typography variant="h6">Clientes</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
              size="large"
            >
              <CloseIcon style={{ fontSize: 30 }} />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={8}>
              <TextField
                fullWidth
                placeholder="Buscar cliente..."
                onChange={(e) => setValues(e.target.value)}
                onKeyPress={pressEnter}
                value={values}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setValues(values)}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
              <CrearCliente
                tipo="CLIENTE"
                accion="registrar"
                ventas={true}
                handleClickOpen={handleClickOpen}
              />
            </Grid>
          </Grid>
          <Box mt={1} height="70vh">
            <ListaClientes
              tipo="CLIENTE"
              filtro={values}
              ventas={true}
              handleClickOpen={handleClickOpen}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
