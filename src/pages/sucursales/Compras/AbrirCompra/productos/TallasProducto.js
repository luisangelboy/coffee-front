import React, { Fragment, useContext, useState } from "react";
import { Button, CircularProgress, Tooltip } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { Done, SquareFoot } from "@material-ui/icons";
import { useQuery } from "@apollo/client";
import { OBTENER_CONSULTAS } from "../../../../../gql/Catalogos/productos";
import ErrorPage from "../../../../../components/ErrorPage";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import TallasProducto from "../../../Catalogos/Producto/TallasColores/TallasColores";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({verificate, setVerificate}) {
  const [open, setOpen] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datosProducto, datosCompra, setLoadingProductos } = useContext(ComprasContext);

  /* Queries */
  const { loading, data, error, refetch } = useQuery(OBTENER_CONSULTAS, {
    variables: { empresa: sesion.empresa._id, sucursal: sesion.sucursal._id },
  });

  /* useEffect(() => {
    if(loading){
      setLoadingProductos(true);
    }else{
      setLoadingProductos(false);
    }
  }, [loading]); */

  if (loading)
    return (
      <Button
        color="primary"
        size="medium"
        disabled={true}
        startIcon={<CircularProgress size={16} color="inherit" />}
      >
        Medidas
      </Button>
    );

  if (error) return <ErrorPage error={error} />;

  const { obtenerConsultasProducto } = data;

  const toggleDrawer = () => {
    setOpen(!open);
    setVerificate(false);
  }

  return (
    <Fragment>
      <Tooltip title="Selecciona medidas y colores" disableHoverListener={true} open={verificate} placement="top">
        <Button
          color={verificate ? "secondary" :"inherit"}
          variant="outlined"
          size="medium"
          onClick={() => toggleDrawer()}
          startIcon={<SquareFoot />}
          disabled={!datosProducto.producto.datos_generales}
        >
          Medidas
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={toggleDrawer}
        aria-labelledby="alert-tallas-compra"
        aria-describedby="alert-tallas-compra-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <TallasProducto
            datos={datosProducto.producto}
            obtenerConsultasProducto={obtenerConsultasProducto}
            refetch={refetch}
            from="compra"
            almacen={datosCompra.almacen}
            withoutPrice={true}
          />
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            onClick={() => toggleDrawer()}
            startIcon={<Done />}
            color="primary"
            variant="contained"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
