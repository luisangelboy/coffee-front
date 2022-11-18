import React, { useState, Fragment, useContext, useCallback } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import RegistrarInfoBasica from "./RegistrarInfoBasica";
import RegistrarInfoCredito from "./RegistroInfoCredito";
import { Add, Close, Done, Edit } from "@material-ui/icons";
import { ClienteCtx } from "../../../../context/Catalogos/crearClienteCtx";
// import { VentasContext } from "../../../../context/Ventas/ventasContext";
import BackdropComponent from "../../../../components/Layouts/BackDrop";
import SnackBarMessages from "../../../../components/SnackBarMessages";

import { useMutation } from "@apollo/client";
import {
  CREAR_CLIENTE,
  ACTUALIZAR_CLIENTE,
} from "../../../../gql/Catalogos/clientes";
import { Toolbar } from "@material-ui/core";

export default function CrearCliente({
  tipo,
  accion,
  datos,
  refetch,
  fromCompras,
  ventas,
  handleClickOpen,
  isOnline,
}) {
  const {
    cliente,
    setCliente,
    setError,
    updateClientVenta,
    setUpdateClientVenta,
    update,
    setUpdate,
  } = useContext(ClienteCtx);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const limpiarCampos = useCallback(() => {
    setCliente({
      direccion: {
        calle: "",
        no_ext: "",
        no_int: "",
        codigo_postal: "",
        colonia: "",
        municipio: "",
        localidad: "",
        estado: "",
        pais: "",
      },
      estado_cliente: true,
    });
  }, [setCliente]);

  const toggleModal = () => {
    setOpen(true);
    if (datos) {
      setCliente(datos);
    }
  };

  const onCloseModal = () => {
    setOpen(false);
    limpiarCampos();
  };

  /* Mutations */
  const [crearCliente] = useMutation(CREAR_CLIENTE);
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  const saveData = async (e) => {
    e.preventDefault();
    let copy_cliente = { ...cliente };
    if (
      !copy_cliente.nombre_cliente ||
      !copy_cliente.telefono ||
      !copy_cliente.email
    ) {
      if (tipo !== "CLIENTE" && !copy_cliente.representante) {
        setError(true);
        return;
      }
      setError(true);
      return;
    }
    if (tipo === "CLIENTE") {
      if (
        !copy_cliente.clave_cliente ||
        !copy_cliente.direccion.calle ||
        !copy_cliente.direccion.municipio ||
        !copy_cliente.direccion.estado ||
        !copy_cliente.direccion.pais
      ) {
        setError(true);
        return;
      }
    }
    if (
      accion !== "registrar" &&
      datos.limite_credito &&
      datos.credito_disponible
    ) {
      let credito_usado = datos.limite_credito - datos.credito_disponible;
      if (credito_usado > copy_cliente.limite_credito) {
        setAlert({
          message: "Crédito utilizado es mayor al límite de crédito",
          status: "error",
          open: true,
        });
        return;
      }
    }
    setLoading(true);
    try {
      if (accion === "registrar") {
        copy_cliente.tipo_cliente = tipo;
        copy_cliente.empresa = sesion.empresa._id;
        copy_cliente.sucursal = sesion.sucursal._id;
        if (tipo === "CLIENTE") {
          copy_cliente.representante = "";
        }
        const input = copy_cliente;
        const clienteBase = await crearCliente({
          variables: {
            input,
          },
        });

        if (ventas === true) {
          const venta = JSON.parse(localStorage.getItem("DatosVentas"));
          let venta_actual = venta === null ? {} : venta;
          // console.log(venta_actual);
          localStorage.setItem(
            "DatosVentas",
            JSON.stringify({
              subTotal:
                venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
              total: venta_actual.total === undefined ? 0 : venta_actual.total,
              impuestos:
                venta_actual.impuestos === undefined
                  ? 0
                  : venta_actual.impuestos,
              iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
              ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
              descuento:
                venta_actual.descuento === undefined
                  ? 0
                  : venta_actual.descuento,
              monedero:
                venta_actual.monedero === undefined ? 0 : venta_actual.monedero,
              // tipo_cambio: venta_actual.tipo_cambio
              //   ? venta_actual.tipo_cambio
              //   : {},
              cliente: clienteBase.data.crearCliente,
              venta_cliente: true,
              productos:
                venta_actual.productos?.length > 0
                  ? venta_actual.productos
                  : [],
              tipo_emision: venta_actual.tipo_emision
                ? venta_actual.tipo_emision
                : "TICKET",
            })
          );
          setUpdateClientVenta(!updateClientVenta);
          onCloseModal();
          handleClickOpen();
        }
      } else {
        const {
          numero_cliente,
          _id,
          clave_cliente,
          sucursal,
          empresa,
          ...input
        } = copy_cliente;
        await actualizarCliente({
          variables: {
            input: input,
            id: copy_cliente._id,
            empresa: sesion.empresa._id,
            sucursal: sesion.sucursal._id,
          },
        });
      }
      if (refetch) {
        refetch();
      }
      setUpdate(!update);
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setError(false);
      setLoading(false);
      onCloseModal();
    } catch (error) {
      setAlert({ message: error.message, status: "error", open: true });
      setLoading(false);
      console.log(error);
      if (error.networkError) {
        console.log(error.networkError.result);
      } else if (error.graphQLErrors) {
        console.log(error.graphQLErrors);
      }
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      {accion === "registrar" ? (
        fromCompras ? (
          <IconButton
            color="primary"
            disabled={!isOnline}
            onClick={toggleModal}
          >
            <Add />
          </IconButton>
        ) : (
          <Button
            disabled={!isOnline}
            color="primary"
            variant="contained"
            onClick={toggleModal}
            startIcon={<Add />}
          >
            Agregar
          </Button>
        )
      ) : (
        <IconButton disabled={!isOnline} size="small" onClick={toggleModal}>
          <Edit />
        </IconButton>
      )}
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            onCloseModal();
          }
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle style={{ padding: 0 }}>
          <BackdropComponent loading={loading} setLoading={setLoading} />
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6">
                {accion === "registrar" ? "Registrar" : "Actualizar"}
              </Typography>
              <Box flexGrow={1} />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => onCloseModal()}
              >
                <Close />
              </Button>
            </Toolbar>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          <Container>
            <form id="crear-cliente-form" onSubmit={saveData}>
              <Typography>
                <b>Información básica</b>
              </Typography>
              <Divider />
              <RegistrarInfoBasica tipo={tipo} accion={accion} />
              <Box my={2} />
              <Typography>
                <b>Información de credito</b>
              </Typography>
              <Divider />
              <RegistrarInfoCredito
                tipo={tipo}
                accion={accion}
                cliente_base={datos}
              />
            </form>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Done />}
            type="submit"
            form="crear-cliente-form"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
