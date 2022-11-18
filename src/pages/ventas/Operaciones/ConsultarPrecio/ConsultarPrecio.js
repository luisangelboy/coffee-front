import React, { Fragment, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "../../styles";
import { Search } from "@material-ui/icons";
import { CONSULTA_PRODUCTO_UNITARIO } from "../../../../gql/Ventas/ventas_generales";
import { useApolloClient } from "@apollo/client";
import ProductosViewComponent from "./ContentProductos";
import PrecioIcon from "../../../../icons/ventas/precios.svg"
import ProductoIcon from "../../../../icons/productos.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConsultarPrecio() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  let turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [value, setValue] = useState("");
  const [dataQuery, setDataQuery] = useState({
    data: undefined,
    loading: false,
    error: undefined,
  });
  const client = useApolloClient();

  const obtenerProducto = async () => {
    try {
      setDataQuery({ ...dataQuery, loading: true });
      const response = await client.query({
        query: CONSULTA_PRODUCTO_UNITARIO,
        variables: {
          datosProductos: value.toUpperCase(),
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
        fetchPolicy: "network-only",
      });
      const { loading, data, error } = response;
      setDataQuery({ data, loading, error });
    } catch (error) {
      console.log(error);
      setDataQuery({ data: undefined, loading: false, error });
    }
  };

  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(!open);
    setDataQuery({
      data: undefined,
      loading: false,
      error: undefined,
    });
  };

  const keyUpEvent = async (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      obtenerProducto();
    }
  };

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.keyCode === 120) {
      handleClickOpen();
    }
  }

  useEffect(() => {
    turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  }, [turnoEnCurso]);

  return (
    <Fragment>
      <Button
        className={classes.borderBotonChico}
        onClick={handleClickOpen}
        disabled={!turnoEnCurso}
      >
        <Box>
          <Box>
            <img
              src={PrecioIcon}
              alt="icono ventas"
              style={{ width: 36 }}
            />
          </Box>
          <Box>
            <Typography variant="body2">
              <b>Consultar Precio</b>
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" style={{ color: "#808080" }}>
              <b>F9</b>
            </Typography>
          </Box>
        </Box>
      </Button>
      <Dialog
        open={open}
        fullWidth
        onClose={handleClickOpen}
        TransitionComponent={Transition}
        PaperProps={{ style: { minWidth: "650px" } }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <img
                src={ProductoIcon}
                alt="icono productos"
                style={{ width: 50 }}
              />
              <Box mx={1} />
              <Typography variant="h6">Precio Producto</Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
            >
              <CloseIcon />
            </Button>
          </Box>
          <Box mt={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Buscar producto por CLAVE ALTERNA"
              onKeyUp={keyUpEvent}
              onChange={(e) => setValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={(e) => obtenerProducto(e)}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <ProductosViewComponent
            dataQuery={dataQuery}
            handleClickOpen={handleClickOpen}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
