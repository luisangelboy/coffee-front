import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

import DatosProducto from "./productos/DatosProducto";
import { FcPlus } from "react-icons/fc";
import { Box } from "@material-ui/core";
import ListaCompras from "./TablaCompras";
import {
  ComprasContext,
  ComprasProvider,
} from "../../../../context/Compras/comprasContext";
import "date-fns";
import { Done, Timer } from "@material-ui/icons";
import {
  initial_state_datosCompra,
  initial_state_datosProducto,
  initial_state_precios_venta,
  initial_state_productoOriginal,
  initial_state_productosCompra,
} from "./initial_states";
import { useMutation } from "@apollo/client";
import {
  CREAR_COMPRA,
  CREAR_COMPRA_ESPERA,
} from "../../../../gql/Compras/compras";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import ConfirmarCompra from "./ConfirmarCompra";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbrirCompra({
  compra,
  status,
  handleOpenDetalles,
  refetchEspera,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (status === "enEspera") {
      handleOpenDetalles();
      refetchEspera();
    }
  };

  return (
    <div>
      {status === "enEspera" ? (
        <Button
          fullWidth
          onClick={handleClickOpen}
          color="primary"
          variant="contained"
          size="large"
          startIcon={<Done />}
        >
          continuar compra
        </Button>
      ) : (
        <Button fullWidth onClick={handleClickOpen}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <FcPlus className={classes.icon} />
            </Box>
            Abrir una compra
          </Box>
        </Button>
      )}
      <ComprasProvider>
        <ModalCompra
          open={open}
          handleClose={handleClose}
          status={status}
          compra={compra}
        />
      </ComprasProvider>
    </div>
  );
}

const ModalCompra = ({ open, handleClose, compra, status }) => {
  const classes = useStyles();
  const {
    productosCompra,
    datosCompra,
    setDatosProducto,
    setProductosCompra,
    setDatosCompra,
    setProductoOriginal,
    setPreciosVenta,
  } = useContext(ComprasContext);
  const [openDelete, setOpenDelete] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [loading, setLoading] = useState(false);

  const [crearCompra] = useMutation(CREAR_COMPRA);
  const [crearCompraEnEspera] = useMutation(CREAR_COMPRA_ESPERA);

  const isAdmin = sesion ? sesion.accesos.tesoreria.caja_principal.ver : false;

  const limpiarCampos = () => {
    setDatosProducto(initial_state_datosProducto);
    setProductosCompra(initial_state_productosCompra);
    setDatosCompra(initial_state_datosCompra);
    setProductoOriginal(initial_state_productoOriginal);
    setPreciosVenta(initial_state_precios_venta);
  };

  useEffect(() => {
    if (status === "enEspera" && compra && open === true) {
      setDatosCompra(compra);
      setProductosCompra(compra.productos);
    }
  }, [open]);

  const realizarCompraBD = async (
    compra_en_espera,
    credito,
    handleClose,
    setLoadingModal,
    descuento_compra,
    productos_con_descuento
  ) => {
    let datos = { ...datosCompra };
    let copy_datosProducto = [...productosCompra];
    let productos = copy_datosProducto;
    if (status === "enEspera") {
      productos = copy_datosProducto.map((res) => {
        delete res.conflicto;
        return res;
      });
      delete datos.empresa;
      delete datos.sucursal;
      delete datos.usuario;
    }

    setLoading(true);
    if(setLoadingModal){
      setLoadingModal(true);
    }
    try {
      datos.productos = productos;

      if (compra_en_espera) {
        datos.en_espera = true;
        const result = await crearCompraEnEspera({
          variables: {
            input: datos,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
            usuario: sesion._id,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.crearCompraEnEspera.message}`,
          status: "success",
          open: true,
        });
      } else {
        if (credito) {
          datos.compra_credito = true;
          datos.saldo_credito_pendiente = datos.total;
        }
        if (descuento_compra.descuento_aplicado) {
          const {
            descuento_aplicado,
            subtotal,
            total,
            impuestos,
            ...descuento
          } = descuento_compra;
          datos.productos = productos_con_descuento;
          datos.descuento_aplicado = descuento_compra.descuento_aplicado;
          datos.subtotal = descuento_compra.subtotal;
          datos.impuestos = descuento_compra.impuestos;
          datos.total = descuento_compra.total;
          datos.descuento = descuento;
        }

        //mandar datos extras para realizar los retiros a cajas o cuentas
        //turno
        let turno = null;
        if (turnoEnCurso) {
          turno = {
            horario_en_turno: turnoEnCurso.horario_en_turno,
            numero_caja: turnoEnCurso
              ? parseInt(turnoEnCurso.numero_caja)
              : null,
            id_caja: turnoEnCurso.id_caja,
            id_usuario: sesion._id,
            token_turno_user: turnoEnCurso.token_turno_user,
            numero_usuario_creador: turnoEnCurso
              ? parseFloat(turnoEnCurso.usuario_en_turno.numero_usuario)
              : null,
            nombre_usuario_creador: turnoEnCurso.usuario_en_turno.nombre,
          };
        }
        datos.turnoEnCurso = turno;
        datos.admin = isAdmin;
        datos.sesion = {
          id_usuario: sesion._id,
          nombre_usuario: sesion.nombre,
          numero_usuario: sesion.numero_usuario,
        };

        const result = await crearCompra({
          variables: {
            input: datos,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
            usuario: sesion._id,
          },
        });
        setAlert({
          message: `¡Listo! ${result.data.crearCompra.message}`,
          status: "success",
          open: true,
        });
      }
      setLoading(false);
      limpiarCampos();
      if (handleClose) {
        handleClose();
        setLoadingModal(false);
      }
    } catch (error) {
      setLoading(false);
      if (handleClose) {
        handleClose();
        setLoadingModal(false);
      }
      console.log(error);
      if (error.message) {
        setAlert({
          message: error.message,
          status: "error",
          open: true,
        });
        return;
      }
      setAlert({
        message: `Error de servidor`,
        status: "error",
        open: true,
      });
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  const handleToggleDelete = () => {
    if (productosCompra.length > 0) {
      setOpenDelete(!openDelete);
    } else {
      limpiarCampos();
      handleClose();
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle style={{ padding: 0 }}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Nueva compra
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleToggleDelete}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
              <CancelarCompra
                handleClose={handleClose}
                handleToggleDelete={handleToggleDelete}
                openDelete={openDelete}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </DialogTitle>
      <DialogContent>
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <DatosProducto status={status} />
        <Box my={2} />
        <ListaCompras />
      </DialogContent>

      <DialogActions
        style={{
          justifyContent: status === "enEspera" ? "flex-end" : "space-between",
        }}
      >
        {status === "enEspera" ? null : (
          <Button
            autoFocus
            color="primary"
            variant="contained"
            size="large"
            onClick={() => realizarCompraBD(true)} //realiza la compra en espera en la funcion
            disabled={!productosCompra.length}
            startIcon={<Timer />}
          >
            Compra en espera
          </Button>
        )}
        <ConfirmarCompra realizarCompraBD={realizarCompraBD} />
      </DialogActions>
    </Dialog>
  );
};

const CancelarCompra = ({ handleClose, handleToggleDelete, openDelete }) => {
  const {
    setProductosCompra,
    setDatosCompra,
    setPreciosVenta,
    setProductoOriginal,
    setDatosProducto,
  } = useContext(ComprasContext);

  const cancelarCompra = () => {
    /* reset states */
    setDatosProducto(initial_state_datosProducto);
    setDatosCompra(initial_state_datosCompra);
    setPreciosVenta(initial_state_precios_venta);
    setProductoOriginal(initial_state_productoOriginal);
    setProductosCompra(initial_state_productosCompra);
    /* cerrar modales */
    handleToggleDelete();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleToggleDelete}
        aria-labelledby="modal-eliminar-compra"
      >
        <DialogTitle id="modal-eliminar-compra">
          ¿Quieres cancelar esta compra?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleToggleDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={cancelarCompra} color="secondary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
