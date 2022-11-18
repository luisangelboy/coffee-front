import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  makeStyles,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Divider,
} from "@material-ui/core";
import { Autorenew } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { formatoMexico } from "../../../../config/reuserFunctions";
import { TesoreriaCtx } from "../../../../context/Tesoreria/tesoreriaCtx";
import { OBTENER_CUENTAS } from "../../../../gql/Catalogos/centroCostos";
import { CREAR_EGRESO } from "../../../../gql/Tesoreria/egresos";
import TablaProductosEgresos from "./TablaProductosEgresos";

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
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  formComboBox: {
    height: "50%",
  },
  input: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
}));

export default function FormRegistroEgresos({ tipo, handleClickOpen }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { setAlert } = useContext(TesoreriaCtx);
  const [CrearEgreso] = useMutation(CREAR_EGRESO);

  const classes = useStyles();
  const [upload, setUpload] = useState(false);
  const [datosEgreso, setDatosEgreso] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  const [subCuentas, setSubCuentas] = useState([]);
  const [producto, setProducto] = useState([]);
  const [productos, setProductos] = useState([]);

  const obtenerCuentas = useQuery(OBTENER_CUENTAS, {
    variables: { empresa: sesion.empresa._id },
  });

  let cuentas = [];

  if (obtenerCuentas.data) {
    cuentas = obtenerCuentas.data.obtenerCuentas;
  }

  const GenFolio = () => {
    const max = 999999999999;
    const min = 100000000000;
    const folio_egreso = Math.floor(
      Math.random() * (max - min + 1) + min
    ).toString();
    setDatosEgreso({
      ...datosEgreso,
      folio_egreso,
    });
  };

  const obtenerDatos = (e) => {
    setDatosEgreso({ ...datosEgreso, [e.target.name]: e.target.value });
  };

  const obtenerSubCuentas = (cuenta) => {
    setSubCuentas(cuenta.subcuentas);
  };

  const obtenerDatoProductos = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const agregarProducto = () => {
    let producto_guardado = {
      cantidad_productos: parseFloat(producto.cantidad_productos),
      precio_unitario: parseFloat(producto.precio_unitario),
      producto: producto.producto,
      total:
        parseFloat(producto.cantidad_productos) *
        parseFloat(producto.precio_unitario),
    };

    productos.push(producto_guardado);

    setDatosEgreso({
      ...datosEgreso,
      productos,
    });
    totalCompraVenta();
    setProducto([]);
  };

  function borrarProducto(index) {
    productos.forEach(function (elemento, indice, array) {
      if (index === indice) {
        productos.splice(index, 1);
      }
    });
    setUpload(true);
  }

  useEffect(() => {
    totalCompraVenta();
    setProductos(productos);
    setUpload(false);
  }, [upload, productos]);

  const totalCompraVenta = () => {
    let total = 0;
    for (let i = 0; i < productos.length; i++) {
      total += productos[i].total;
    }
    setTotalCompra(total);
  };

  const input = {
    folio_egreso: datosEgreso.folio_egreso,
    folio_factura: datosEgreso.id_factura,
    empresa_distribuidora: datosEgreso.empresa_distribuidora,
    provedor: datosEgreso.provedor,
    productos: datosEgreso.productos ? datosEgreso.productos : [],
    categoria: datosEgreso.categoria,
    subCategoria: datosEgreso.subCategoria,
    metodo_pago: datosEgreso.metodo_pago,
    fecha_compra: datosEgreso.fecha_compra,
    fecha_vencimiento: datosEgreso.fecha_vencimiento0
      ? datosEgreso.fecha_vencimiento
      : "",
    observaciones: datosEgreso.observaciones,
    compra_credito: datosEgreso.compra_credito
      ? datosEgreso.compra_credito
      : false,
    credito_pagado: datosEgreso.credito_pagado
      ? datosEgreso.credito_pagado
      : false,
    saldo_credito_pendiente: datosEgreso.saldo_credito_pendiente
      ? datosEgreso.saldo_credito_pendiente
      : 0,
    numero_usuario_creador: sesion.numero_usuario.toString(),
    nombre_usuario_creador: sesion.nombre,
    id_user: sesion._id,
    saldo_total: totalCompra ? totalCompra : 0,
  };

  const enviarDatos = async () => {
    try {
      if (!datosEgreso.folio_egreso) {
        setAlert({
          message: "Por favor genere un folio.",
          status: "error",
          open: true,
        });
        return null;
      }

      const egreso = await CrearEgreso({
        variables: {
          input,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      handleClickOpen();
      setDatosEgreso([]);
      setAlert({
        message: egreso.data.crearEgreso.message,
        status: "success",
        open: true,
      });
    } catch (error) {
      setAlert({
        message: error.message,
        status: "error",
        open: true,
      });
    }
  };

  return (
    <Fragment>
      <Box p={1}>
        <Box>
          <Typography>
            <b>Datos Generales</b>
          </Typography>
        </Box>
        <Divider />
      </Box>
      <div className={classes.formInputFlex}>
        <Box width="100%">
          <FormControl
            variant="outlined"
            size="small"
            name="folio_egreso"
            fullWidth
          >
            <Typography>Folio</Typography>
            <OutlinedInput
              style={{ padding: 0 }}
              id="form-producto-codigo-barras"
              name="folio_egreso"
              value={datosEgreso.folio_egreso ? datosEgreso.folio_egreso : ""}
              onChange={obtenerDatos}
              endAdornment={
                <InputAdornment position="start">
                  <IconButton
                    onClick={() => GenFolio()}
                    color="primary"
                    size="small"
                  >
                    <Autorenew />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box width="100%">
          <Typography>ID Factura:</Typography>
          <TextField
            fullWidth
            size="small"
            name="id_factura"
            variant="outlined"
            onChange={obtenerDatos}
          />
        </Box>
        <Box width="100%">
          <Typography>Fecha de Compra:</Typography>
          <TextField
            fullWidth
            size="small"
            name="fecha_compra"
            variant="outlined"
            onChange={obtenerDatos}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box width="100%">
          <Typography>Metodo de pago:</Typography>
          <Select
            className={classes.formComboBox}
            size="small"
            variant="outlined"
            onChange={obtenerDatos}
            name="metodo_pago"
            fullWidth
          >
            <MenuItem value="TARJETA">Tarjeta</MenuItem>
            <MenuItem value="EFECTIVO">Efectivo</MenuItem>
            <MenuItem value="CHEQUE">Cheque</MenuItem>
            <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
            <MenuItem value="MONEDERO ELECTRONICO">
              Monedero electronico
            </MenuItem>
          </Select>
        </Box>
      </div>
      <div className={classes.formInputFlex}>
        <Box width="100%">
          <Typography>Categoria:</Typography>
          <Select
            className={classes.formComboBox}
            size="small"
            variant="outlined"
            onChange={obtenerDatos}
            name="categoria"
            fullWidth
          >
            <MenuItem value="Ninguno" onClick={() => setSubCuentas([])}>
              Ninguno
            </MenuItem>
            {cuentas?.map((cuenta) => {
              return (
                <MenuItem
                  key={cuenta._id}
                  onClick={() => obtenerSubCuentas(cuenta)}
                  value={cuenta.cuenta}
                >
                  {cuenta.cuenta}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        <Box width="100%">
          <Typography>SubCatergoria:</Typography>
          <Select
            className={classes.formComboBox}
            size="small"
            variant="outlined"
            onChange={obtenerDatos}
            name="subCategoria"
            fullWidth
          >
            <MenuItem value="Ninguno">Ninguno</MenuItem>
            {subCuentas?.map((subCuenta) => {
              return (
                <MenuItem value={subCuenta.subcuenta}>
                  {subCuenta.subcuenta}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
        <Box width="100%">
          <Typography>Empresa:</Typography>
          <TextField
            fullWidth
            size="small"
            name="empresa_distribuidora"
            onChange={obtenerDatos}
            variant="outlined"
          />
        </Box>
        <Box width="100%">
          <Typography>Provedor: </Typography>
          <TextField
            fullWidth
            size="small"
            name="provedor"
            onChange={obtenerDatos}
            variant="outlined"
          />
        </Box>
      </div>
      <Box p={1} mt={1}>
        <Box>
          <Typography>
            <b>Productos Adquiridos</b>
          </Typography>
        </Box>
        <Divider />
      </Box>
      <div className={classes.formInputFlex}>
        <Box width="100%">
          <Typography>Cantidad:</Typography>
          <TextField
            fullWidth
            className={classes.input}
            size="small"
            name="cantidad_productos"
            value={
              producto.cantidad_productos ? producto.cantidad_productos : ""
            }
            onChange={obtenerDatoProductos}
            variant="outlined"
            type="number"
          />
        </Box>
        <Box width="100%">
          <Typography>Producto:</Typography>
          <TextField
            fullWidth
            size="small"
            name="producto"
            value={producto.producto ? producto.producto : ""}
            onChange={obtenerDatoProductos}
            variant="outlined"
          />
        </Box>
        <Box width="100%">
          <Typography>Precio Unitario:</Typography>
          <TextField
            className={classes.input}
            fullWidth
            size="small"
            name="precio_unitario"
            value={producto.precio_unitario ? producto.precio_unitario : ""}
            onChange={obtenerDatoProductos}
            variant="outlined"
            type="number"
          />
        </Box>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="large"
            color="primary"
            onClick={agregarProducto}
            startIcon={<AddIcon />}
          >
            Agregar
          </Button>
        </Box>
      </div>
      <Box p={1}>
        <TablaProductosEgresos
          productos={productos}
          borrarProducto={borrarProducto}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" p={1}>
        <Typography variant="h6">
          Total: ${formatoMexico(totalCompra)}
        </Typography>
      </Box>
      <div className={classes.formInputFlex}>
        <Box width="100%">
          <Typography>Observaciónes:</Typography>
          <TextField
            multiline
            rows={2}
            fullWidth
            size="small"
            name="observaciones"
            onChange={obtenerDatos}
            variant="outlined"
          />
        </Box>
      </div>
      <Box display="flex" justifyContent="flex-end">
        <Box p={1}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={enviarDatos}
          >
            Guardar Egreso
          </Button>
        </Box>
        {/* <Box p={1}>
          <Button size="large" variant="contained" color="secondary">
            Cancelar
          </Button>
        </Box> */}
      </Box>
    </Fragment>
  );
}
