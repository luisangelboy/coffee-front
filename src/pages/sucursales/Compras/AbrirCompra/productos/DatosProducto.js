import React, {
  Fragment,
  useContext,
  useState,
  forwardRef,
  useEffect,
} from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";

import PreciosProductos from "./PreciosProductos";
import TallasProductos from "./TallasProducto";
import Add from "@material-ui/icons/Add";

import {
  initial_state_almacen_inicial,
  initial_state_centro_de_costos,
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_preciosPlazos,
  initial_state_unidadVentaXDefecto,
  initial_state_unidadVentaSecundaria,
} from "../../../../../context/Catalogos/initialStatesProducto";

import CrearProducto, {
  initial_state_preciosP,
} from "../../../Catalogos/Producto/crearProducto";
import { ComprasContext } from "../../../../../context/Compras/comprasContext";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import { useApolloClient } from "@apollo/client";
import { OBTENER_PRODUCTOS } from "../../../../../gql/Catalogos/productos";
import PreciosDeVentaCompras from "./PreciosVenta";
import { validateJsonEdit } from "../../../Catalogos/Producto/validateDatos";
import { Alert, AlertTitle } from "@material-ui/lab";
import { InfoOutlined } from "@material-ui/icons";
import DescuentosInputs from "./Descuentos";
import DatosProveedorAlmacen from "./DatosProveedorAlmacen";
import { initial_state_datosProducto } from "../initial_states";
import MostrarPrecios from "./mostrar_precios";
import { useDebounce } from "use-debounce/lib";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import { calculos_precios } from "./calculos_compra";

export default function DatosProducto({ status }) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const {
    datosProducto,
    setDatosProducto,
    productosCompra,
    setProductosCompra,
    datosCompra,
    productoOriginal,
    setProductoOriginal,
    setPreciosVenta,
    setDatosCompra,
    isEditing,
    setIsEditing,
    editFinish,
    setEditFinish,
    costo,
    setCosto,
    cantidad,
    setCantidad,
    loadingProductos,
    setLoadingProductos,
  } = useContext(ComprasContext);
  const {
    datos_generales,
    setDatosGenerales,
    precios,
    setPrecios,
    setValidacion,
    preciosP,
    setPreciosP,
    imagenes,
    setImagenes,
    setUnidadesVenta,
    almacen_inicial,
    setAlmacenInicial,
    unidadVentaXDefecto,
    setUnidadVentaXDefecto,
    unidadVentaSecundaria,
    setUnidadVentaSecundaria,
    centro_de_costos,
    setCentroDeCostos,
    preciosPlazos,
    setPreciosPlazos,
    setSubcategorias,
    setOnPreview,
    setSubcostos,
    imagenes_eliminadas,
    setImagenesEliminadas,
    presentaciones,
    setPresentaciones,
    presentaciones_eliminadas,
    setPresentacionesEliminadas,
    setAlmacenExistente,
  } = useContext(RegProductoContext);
  const [verificate, setVerificate] = useState(false);

  let count = 0;
  if (status === "enEspera" && datosCompra) count = 1;

  const [cargando, setCargando] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [textValue, setTextValue] = useState("");
  const client = useApolloClient();
  const [dataDocs, setDataDocs] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const limit = 15;

  /* Queries */
  const getProductos = async (id_almacen, filtro = "", page = 0) => {
    setPageLoaded(true);
    try {
      let almacen = id_almacen ? id_almacen : datosCompra.almacen._id;
      setLoadingProductos(true);
      const response = await client.query({
        query: OBTENER_PRODUCTOS,
        variables: {
          almacen,
          filtro,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          limit,
          offset: page,
        },
        fetchPolicy: "network-only",
      });
      setLoadingProductos(false);
      if (response.data) {
        setDataDocs(
          filtro
            ? response.data.obtenerProductos.docs
            : [...dataDocs, ...response.data.obtenerProductos.docs]
        );
        setTotalDocs(response.data.obtenerProductos.totalDocs);
      }
    } catch (error) {
      setLoadingProductos(false);
      setAlert({
        message: "Hubo un error al cargar los productos",
        status: "error",
        open: true,
      });
    }
  };

  const [COSTO] = useDebounce(costo, 500);
  const [CANTIDAD] = useDebounce(cantidad, 500);
  const [VALUE] = useDebounce(textValue, 500);

  /* useEffect(() => {
    if (loadingProductos) {
      setLoadingProductos(true);
    } else {
      setLoadingProductos(false);
    }
  }, [loadingProductos]); */

  useEffect(() => {
    if (dataDocs) obtenerCosto(COSTO);
  }, [COSTO]);

  useEffect(() => {
    if (dataDocs) {
      obtenerCantidad(CANTIDAD);
    }
  }, [CANTIDAD]);

  useEffect(() => {
    if (presentaciones.length > 0) {
      let cantida_suma = 0;
      let cantidad_total = 0;
      presentaciones.forEach((presentacion) => {
        const { cantidad_nueva } = presentacion;
        let nueva = cantidad_nueva ? cantidad_nueva : 0;
        cantida_suma += nueva;
        if (isNaN(cantida_suma)) cantidad_total = 0;
        cantidad_total = cantida_suma;
      });
      if (cantidad_total) {
        obtenerCantidad(cantidad_total);
      }
    }
  }, [presentaciones]);

  useEffect(() => {
    if (count === 1) {
      getProductos(datosCompra.almacen._id);
    }
  }, [count]);

  useEffect(() => {
    if (pageLoaded) {
      getProductos(datosCompra.almacen._id, VALUE);
    }
  }, [VALUE]);

  const obtenerSelectsProducto = (producto) => {
    if (!producto) {
      setDatosProducto(initial_state_datosProducto);
      setCosto(0);
      setCantidad(0);
      resetInitialStates();
      getProductos(datosCompra.almacen._id);
      return;
    }

    const {
      ieps,
      iva,
      precio_con_impuesto,
      precio_sin_impuesto,
    } = producto.precios.precio_de_compra;

    const impuestos = iva + ieps;

    setDatosProducto({
      ...datosProducto,
      producto,
      id_producto: producto._id,
      costo: precio_con_impuesto,
      cantidad: producto.datos_generales.tipo_producto === "OTROS" ? 1 : 0,
      unidad_regalo: producto.precios.unidad_de_compra.unidad,
      descuento_porcentaje: 0,
      descuento_precio: 0,
      subtotal: precio_sin_impuesto,
      impuestos: parseFloat(impuestos.toFixed(2)),
      total: precio_con_impuesto,
      subtotal_descuento: precio_sin_impuesto,
      total_descuento: precio_con_impuesto,
    });
    setInitialStates(producto);
    setCosto(precio_con_impuesto);
    setCantidad(producto.datos_generales.tipo_producto === "OTROS" ? 1 : 0);
    setProductoOriginal(producto);
    setPreciosVenta(producto.precios.precios_producto);
  };

  function obtenerCantidad(value) {
    const resultado = calculos_precios({
      productoOriginal,
      porcentaje: datosProducto.descuento_porcentaje,
      cantidad: value,
      costo: datosProducto.costo,
    });
    const { result, anterior } = resultado;
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        cantidad: "",
        impuestos_descuento: anterior.impuesto_actual * anterior.cantidad,
        subtotal_descuento: anterior.precio_sin_impuesto * anterior.cantidad,
        total_descuento: anterior.precio_con_impuesto * anterior.cantidad,
        iva_total: anterior.iva_precio_actual * anterior.cantidad,
        ieps_total: anterior.ieps_precio_actual * anterior.cantidad,
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      cantidad: parseFloat(value),
      iva_total: parseFloat(result.iva_precio.toFixed(2)),
      ieps_total: parseFloat(result.ieps_precio.toFixed(2)),
      impuestos_descuento: parseFloat(result.impuestos.toFixed(2)),
      descuento_porcentaje: result.porcentaje
        ? parseFloat(result.porcentaje)
        : 0,
      descuento_precio: result.cantidad_descontada
        ? parseFloat(result.cantidad_descontada.toFixed(2))
        : 0,
      subtotal_descuento: parseFloat(result.subtotal_con_descuento.toFixed(2)),
      total_descuento: parseFloat(result.total.toFixed(2)),
    });
  }

  const obtenerCantidadRegalo = (value) => {
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        cantidad_regalo: "",
      });
      return;
    }
    setDatosProducto({
      ...datosProducto,
      cantidad_regalo: parseFloat(value),
    });
  };

  const obtenerUnidadRegalo = (e) => {
    const { value, name } = e.target;
    setDatosProducto({
      ...datosProducto,
      [name]: value,
    });
  };

  function obtenerCosto(value) {
    /* const { name, value } = e.target; */
    const resultado = calculos_precios({
      productoOriginal,
      porcentaje: datosProducto.descuento_porcentaje,
      cantidad: datosProducto.cantidad,
      costo: parseFloat(value),
    });
    const { result, anterior } = resultado;
    if (!value) {
      setDatosProducto({
        ...datosProducto,
        costo: 0,
        impuestos_descuento: anterior.impuesto_actual * anterior.cantidad,
        subtotal_descuento: anterior.precio_sin_impuesto * anterior.cantidad,
        total_descuento: anterior.precio_con_impuesto * anterior.cantidad,
        iva_total: anterior.iva_precio_actual * anterior.cantidad,
        ieps_total: anterior.ieps_precio_actual * anterior.cantidad,
      });
      return;
    }

    /* const { iva, ieps, precio_de_compra } = datosProducto.producto.precios;
    const iva_precio = precio_de_compra.iva;
    const ieps_precio = precio_de_compra.ieps; 

    let precio_neto = parseFloat(value);
    let subtotal = 0;
    let total = 0;
    let cantidad_descontada = 0;
    let impuesto_actual = iva_precio + ieps_precio;

    let precio_sin_impuesto = precio_neto - impuesto_actual;
    let nuevo_iva =
      parseFloat(precio_sin_impuesto) *
      parseFloat(iva < 10 ? ".0" + iva : "." + iva);
    let nuevo_ieps =
      parseFloat(precio_sin_impuesto) *
      parseFloat(ieps < 10 ? ".0" + ieps : "." + ieps);
    let nuevo_impuesto = nuevo_ieps + nuevo_iva;

    if (datosProducto.descuento_porcentaje > 0) {
      cantidad_descontada = Math.round(
        (precio_sin_impuesto * datosProducto.descuento_porcentaje) / 100
      );
      subtotal = precio_sin_impuesto - cantidad_descontada;
      total = subtotal + nuevo_impuesto;

      setDatosProducto({
        ...datosProducto,
        impuestos_descuento: parseFloat(nuevo_impuesto.toFixed(2)),
        costo: parseFloat(precio_neto),
        descuento_precio: parseFloat(cantidad_descontada),
        subtotal_descuento: parseFloat(subtotal),
        total_descuento: parseFloat(total),
      });
      return;
    }*/
    setDatosProducto({
      ...datosProducto,
      /* impuestos_descuento: parseFloat(nuevo_impuesto.toFixed(2)), */
      costo: parseFloat(value),
      iva_total: parseFloat(result.iva_precio.toFixed(2)),
      ieps_total: parseFloat(result.ieps_precio.toFixed(2)),
      /* subtotal_descuento: parseFloat(precio_sin_impuesto), */
      /*  total_descuento: parseFloat(precio_sin_impuesto + nuevo_impuesto), */

      impuestos_descuento: parseFloat(result.impuestos.toFixed(2)),
      descuento_porcentaje: result.porcentaje
        ? parseFloat(result.porcentaje.toFixed(2))
        : 0,
      descuento_precio: result.cantidad_descontada
        ? parseFloat(result.cantidad_descontada.toFixed(2))
        : 0,
      subtotal_descuento: parseFloat(result.subtotal_con_descuento.toFixed(2)),
      total_descuento: parseFloat(result.total.toFixed(2)),
    });
  }

  const agregarCompra = async (actualizar_Precios) => {
    let copy_datosCompra = { ...datosCompra };
    let copy_datosProducto = { ...datosProducto };
    let copy_datosGenerales = { ...datos_generales };
    let copy_presentaciones = [...presentaciones];
    let copy_precios = { ...precios };
    let copy_preciosP = [...preciosP];
    let copy_almacenInicial = { ...almacen_inicial };
    let copy_centroCostos = { ...centro_de_costos };
    let copy_presentacionesEliminadas = [...presentaciones_eliminadas];
    let copy_precioPlazos = { ...preciosPlazos };

    /* Validaciones */
    setCargando(true);
    if (
      !copy_datosProducto.producto.datos_generales ||
      !copy_datosCompra.proveedor.nombre_cliente ||
      !copy_datosCompra.almacen.nombre_almacen
    ) {
      setCargando(false);
      return;
    }

    if (copy_datosGenerales.tipo_producto !== "OTROS") {
      if (copy_presentaciones.length > 0) {
        const pres = copy_presentaciones.filter(
          (res) => res.color._id && res.medida._id && res.existencia
        );
        if (pres.length !== copy_presentaciones.length) {
          setVerificate(true);
          setCargando(false);
          return;
        }
      } else {
        setVerificate(true);
        setCargando(false);
        return;
      }
    }

    let copy_unidadesVenta = [
      { ...unidadVentaXDefecto },
      { ...unidadVentaSecundaria },
    ];

    if (actualizar_Precios) {
      copy_datosProducto.mantener_precio = false;
    } else {
      copy_datosProducto.mantener_precio = true;
    }
    copy_precios.precios_producto = copy_preciosP;

    let producto = {
      datos_generales: await validateJsonEdit(
        copy_datosGenerales,
        "datos_generales"
      ),
      precios: copy_precios,
      imagenes,
      imagenes_eliminadas,
      almacen_inicial: copy_almacenInicial,
      centro_de_costos: copy_centroCostos,
      unidades_de_venta: await validateJsonEdit(
        copy_unidadesVenta,
        "unidades_de_venta"
      ),
      presentaciones: copy_presentaciones,
      presentaciones_eliminadas: copy_presentacionesEliminadas,
      precio_plazos: copy_precioPlazos,
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      usuario: sesion._id,
    };

    copy_datosProducto.producto = producto;

    if (copy_datosProducto.producto.datos_generales.tipo_producto !== "OTROS") {
      //si son medidas sumas las cantidades de las presetnaciones
      /* if (copy_datosProducto.producto.presentaciones.length > 0) {
        copy_datosProducto.cantidad = 0;
        copy_datosProducto.producto.presentaciones.forEach((presentacion) => {
          const { cantidad, cantidad_nueva } = presentacion;
          let nueva = cantidad_nueva ? cantidad_nueva : 0;
          copy_datosProducto.cantidad += nueva;
        });
        if (isNaN(copy_datosProducto.cantidad)) copy_datosProducto.cantidad = 0;
        copy_datosProducto.cantidad_total = copy_datosProducto.cantidad;
      } else {
        copy_datosProducto.cantidad = 0;
        copy_datosProducto.cantidad_total = copy_datosProducto.cantidad;
      }
      if (copy_datosProducto.cantidad === 0 || !copy_datosProducto.cantidad) {
        setVerificate(true);
        setCargando(false);
        return;
      } */
      copy_datosProducto.cantidad_total = copy_datosProducto.cantidad;
    } else {
      //Si hay cantidad regalo y es diferente unidad hacer las converciones
      const { cantidad_regalo, cantidad, unidad_regalo } = copy_datosProducto;
      //convertir todo a la unidad media y sumar (Pz, Kg, Lt)
      const factor =
        copy_datosProducto.producto.precios.unidad_de_compra.cantidad;
      const cantiad_media = cantidad * factor;
      let cantidad_regalo_media =
        unidad_regalo === "Pz" ||
        unidad_regalo === "Kg" ||
        unidad_regalo === "Lt"
          ? cantidad_regalo
          : cantidad_regalo * factor;
      let cantidad_total_media = cantiad_media + cantidad_regalo_media;

      //si factor es > 1 es caja o costal y dividir unidad media entre factor y si no mandar la cantidad total media;
      if (factor > 1) {
        copy_datosProducto.cantidad_regalo = cantidad_regalo_media / factor;
        copy_datosProducto.cantidad_total = cantidad_total_media / factor;
      } else {
        copy_datosProducto.cantidad_regalo = cantidad_regalo_media;
        copy_datosProducto.cantidad_total = cantidad_total_media;
      }
    }
    copy_datosProducto.impuestos = copy_datosProducto.impuestos_descuento;
    copy_datosProducto.subtotal = copy_datosProducto.subtotal_descuento;
    copy_datosProducto.total = copy_datosProducto.total_descuento;

    if (isEditing.producto) {
      //se tiene que actualizar el producto en la fila y sumar el subtotal
      let productosCompra_ordenados = [...productosCompra];
      //calculos de totales, subtotales e impuestos de compra general
      /* const {
        iva,
        ieps,
      } = copy_datosProducto.producto.precios.precio_de_compra; */

      //restar datos anteriores
      copy_datosCompra.impuestos -= isEditing.producto.impuestos;
      copy_datosCompra.subtotal -= isEditing.producto.subtotal;
      copy_datosCompra.total -= isEditing.producto.total;

      /* copy_datosProducto.iva_total = iva * copy_datosProducto.cantidad_total;
      copy_datosProducto.ieps_total = ieps * copy_datosProducto.cantidad_total;
      copy_datosProducto.subtotal =
        copy_datosProducto.subtotal_descuento *
        copy_datosProducto.cantidad_total;
      copy_datosProducto.impuestos =
        copy_datosProducto.impuestos_descuento *
        copy_datosProducto.cantidad_total;
      copy_datosProducto.total =
        copy_datosProducto.total_descuento * copy_datosProducto.cantidad_total; */

      let subtotal = parseFloat(
        (copy_datosCompra.subtotal += copy_datosProducto.subtotal).toFixed(2)
      );
      let impuestos = parseFloat(
        (copy_datosCompra.impuestos += copy_datosProducto.impuestos)
      );
      let total = parseFloat(
        (copy_datosCompra.total += copy_datosProducto.total).toFixed(2)
      );

      productosCompra_ordenados.splice(isEditing.index, 1, copy_datosProducto);

      setProductosCompra(productosCompra_ordenados);
      setDatosCompra({
        ...copy_datosCompra,
        subtotal,
        impuestos,
        total,
      });
      setIsEditing({});
      setEditFinish(!editFinish);
      setProductoOriginal({ precios: initial_state_precios });
      setDatosProducto(initial_state_datosProducto);
      setCosto(0);
      setCantidad(0);
      setCargando(false);
    } else {
      // se agregar el producto normal y verificar si ya esta el producto en la lista
      const existente = productosCompra
        .map((prod_exist, index) => {
          if (prod_exist.id_producto === copy_datosProducto.id_producto) {
            return { prod_exist, index };
          } else {
            return "";
          }
        })
        .filter(Boolean);

      if (existente.length > 0) {
        let productosCompra_ordenados = [...productosCompra];
        const { index, prod_exist } = existente[0];
        /* const {
          iva,
          ieps,
        } = copy_datosProducto.producto.precios.precio_de_compra; */

        copy_datosCompra.subtotal -= prod_exist.subtotal;
        copy_datosCompra.impuestos -= prod_exist.impuestos;
        copy_datosCompra.total -= prod_exist.total;

        /* copy_datosProducto.iva_total = iva * copy_datosProducto.cantidad_total;
        copy_datosProducto.ieps_total =
          ieps * copy_datosProducto.cantidad_total;
        copy_datosProducto.subtotal =
          copy_datosProducto.subtotal * copy_datosProducto.cantidad_total;
        copy_datosProducto.impuestos =
          copy_datosProducto.impuestos * copy_datosProducto.cantidad_total;
        copy_datosProducto.total =
          copy_datosProducto.total * copy_datosProducto.cantidad_total; */

        let subtotal = parseFloat(
          (copy_datosCompra.subtotal += copy_datosProducto.subtotal).toFixed(2)
        );
        let impuestos = parseFloat(
          (copy_datosCompra.impuestos += copy_datosProducto.impuestos).toFixed(
            2
          )
        );
        let total = parseFloat(
          (copy_datosCompra.total += copy_datosProducto.total).toFixed(2)
        );

        productosCompra_ordenados.splice(index, 1, copy_datosProducto);
        setProductosCompra(productosCompra_ordenados);
        setDatosCompra({
          ...copy_datosCompra,
          subtotal,
          impuestos,
          total,
        });
      } else {
        let array_ordenado = [...productosCompra];
        /* const {
          iva,
          ieps,
        } = copy_datosProducto.producto.precios.precio_de_compra; */

        /* copy_datosProducto.iva_total = iva * copy_datosProducto.cantidad_total;
        copy_datosProducto.ieps_total =
          ieps * copy_datosProducto.cantidad_total;
        copy_datosProducto.subtotal =
          copy_datosProducto.subtotal * copy_datosProducto.cantidad_total;
        copy_datosProducto.impuestos =
          copy_datosProducto.impuestos * copy_datosProducto.cantidad_total;
        copy_datosProducto.total =
          copy_datosProducto.total * copy_datosProducto.cantidad_total; */

        let subtotal = parseFloat(
          (copy_datosCompra.subtotal += copy_datosProducto.subtotal).toFixed(2)
        );
        let impuestos = parseFloat(
          (copy_datosCompra.impuestos += copy_datosProducto.impuestos).toFixed(
            2
          )
        );
        let total = parseFloat(
          (copy_datosCompra.total += copy_datosProducto.total).toFixed(2)
        );

        array_ordenado.splice(0, 0, copy_datosProducto);
        setProductosCompra(array_ordenado);
        setDatosCompra({
          ...copy_datosCompra,
          subtotal,
          impuestos,
          total,
        });
      }
      setProductoOriginal({ precios: initial_state_precios });
      setDatosProducto(initial_state_datosProducto);
      setCosto(0);
      setCantidad(0);
      setCargando(false);
    }
  };

  /* SET STATES WHEN UPDATING */
  const setInitialStates = (producto) => {
    const { precios_producto, ...new_precios } = producto.precios;
    const { unidades_de_venta } = producto;
    let unidades_secundaria = unidades_de_venta.filter(
      (res) => res.default === false
    );
    let unidadxdefecto = unidades_de_venta.filter(
      (res) => res.default === true
    );
    setDatosGenerales(producto.datos_generales);
    setPrecios(new_precios);
    setCentroDeCostos(
      producto.centro_de_costos
        ? producto.centro_de_costos
        : initial_state_centro_de_costos
    );
    setImagenes(producto.imagenes);
    setPreciosPlazos(producto.precio_plazos);
    setUnidadesVenta(unidades_de_venta);
    setPreciosP(producto.precios.precios_producto);
    setUnidadVentaXDefecto(unidadxdefecto[0]);
    setUnidadVentaSecundaria(unidades_secundaria[0]);
    setPresentaciones(
      producto.medidas_producto ? producto.medidas_producto : []
    );
    if (
      datosCompra.almacen.id_almacen &&
      producto.medidas_producto.length === 0
    ) {
      setAlmacenInicial({
        ...almacen_inicial,
        id_almacen: datosCompra.almacen.id_almacen,
        almacen: datosCompra.almacen.nombre_almacen,
      });
    }

    if (producto.inventario_general.length > 0) {
      setAlmacenExistente(true);
    } else {
      setAlmacenExistente(false);
    }
  };

  /* ###### RESET STATES ###### */
  const resetInitialStates = () => {
    setDatosGenerales(initial_state_datos_generales);
    setPrecios(initial_state_precios);
    setUnidadVentaXDefecto(initial_state_unidadVentaXDefecto);
    setUnidadVentaSecundaria(initial_state_unidadVentaSecundaria);
    setPreciosP(initial_state_preciosP);
    setUnidadesVenta([]);
    setAlmacenInicial(initial_state_almacen_inicial);
    setCentroDeCostos({});
    setPreciosPlazos(initial_state_preciosPlazos);
    setSubcategorias([]);
    setImagenes([]);
    setOnPreview({ index: "", image: "" });
    setValidacion({ error: false, message: "" });
    setSubcostos([]);
    setImagenesEliminadas([]);
    setPresentaciones([]);
    setPresentacionesEliminadas([]);
  };
  const loadMoreItems = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - parseInt(scrollTop + 1) === clientHeight) {
      if (dataDocs.length < totalDocs) {
        let newPage = page + 1;
        setPage(newPage);
        getProductos(datosCompra.almacen._id, "", newPage);
      }
    }
  };

  return (
    <Fragment>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <DatosProveedorAlmacen status={status} getProductos={getProductos} />
      <Box my={1} />
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Typography>Código de barras</Typography>
          <Box width={200}>
            <Autocomplete
              id="combo-box-producto-codigo"
              size="small"
              fullWidth
              loading={loadingProductos}
              options={dataDocs}
              getOptionLabel={(option) =>
                option.datos_generales.codigo_barras
                  ? option.datos_generales.codigo_barras
                  : "N/A"
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  onChange={(e) => setTextValue(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingProductos ? (
                          <CircularProgress color="primary" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              onChange={(_, value) => obtenerSelectsProducto(value)}
              getOptionSelected={(option, value) => option._id === value._id}
              value={
                datosProducto.producto.datos_generales
                  ? datosProducto.producto
                  : null
              }
              disabled={
                !datosCompra.almacen.id_almacen ||
                !datosCompra.proveedor.id_proveedor ||
                loadingProductos
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Producto</Typography>
          <Box display="flex" width={250} alignItems="center">
            <Autocomplete
              id="combo-box-producto-nombre"
              size="small"
              fullWidth
              loading={loadingProductos}
              options={dataDocs}
              getOptionLabel={(option) =>
                option.datos_generales.nombre_comercial
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTextValue(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingProductos ? (
                          <CircularProgress color="primary" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              onChange={(_, value) => obtenerSelectsProducto(value)}
              getOptionSelected={(option, value) => option._id === value._id}
              ListboxProps={{
                styles: {
                  height: 300,
                },
                onScroll: loadMoreItems,
              }}
              value={
                datosProducto.producto.datos_generales
                  ? datosProducto.producto
                  : null
              }
              disabled={
                !datosCompra.almacen.id_almacen ||
                !datosCompra.proveedor.id_proveedor ||
                loadingProductos
              }
            />
            {!datosCompra.almacen.id_almacen ||
            !datosCompra.proveedor.id_proveedor ? (
              <IconButton disabled>
                <Add />
              </IconButton>
            ) : (
              <CrearProducto
                accion={false}
                /* productosRefetch={refetch} */
                getProductos={getProductos}
                fromCompra={true}
              />
            )}
          </Box>
        </Grid>
        <Grid item>
          <Typography>Clave</Typography>
          <Box width={140}>
            <Autocomplete
              id="combo-box-producto-clave"
              size="small"
              fullWidth
              loading={loadingProductos}
              options={dataDocs}
              getOptionLabel={(option) => option.datos_generales.clave_alterna}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  onChange={(e) => setTextValue(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingProductos ? (
                          <CircularProgress color="primary" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              onChange={(_, value) => obtenerSelectsProducto(value)}
              getOptionSelected={(option, value) => option._id === value._id}
              value={
                datosProducto.producto.datos_generales
                  ? datosProducto.producto
                  : null
              }
              disabled={
                !datosCompra.almacen.id_almacen ||
                !datosCompra.proveedor.id_proveedor ||
                loadingProductos
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <Typography>Costo</Typography>
          <Box width={100}>
            <TextField
              inputMode="decimal"
              name="costo"
              variant="outlined"
              size="small"
              fullWidth
              disabled={!datosProducto.producto.datos_generales}
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Box>
        </Grid>
        {datosProducto.producto.datos_generales &&
        datosProducto.producto.datos_generales.tipo_producto === "OTROS" ? (
          <Fragment>
            <Grid item>
              <Typography>Unidad</Typography>
              <Box width={100}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  aria-readonly="true"
                  value={datosProducto.producto.precios.unidad_de_compra.unidad}
                  disabled
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Cantidad</Typography>
              <Box width={100}>
                <TextField
                  name="cantidad"
                  variant="outlined"
                  size="small"
                  fullWidth
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  disabled={!datosProducto.producto.datos_generales}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Cant. regalo</Typography>
              <Box width={100}>
                <TextField
                  name="cantidad_regalo"
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputMode="numeric"
                  disabled={!datosProducto.producto.datos_generales}
                  value={datosProducto.cantidad_regalo}
                  onChange={(e) => obtenerCantidadRegalo(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography>Unidad. regalo</Typography>
              <Box width={100}>
                <FormControl
                  variant="outlined"
                  size="small"
                  name="unidad_regalo"
                  fullWidth
                >
                  {datosProducto.producto.precios.granel ? (
                    <Select
                      id="select-unidad-regalo"
                      disabled={!datosProducto.producto.datos_generales}
                      name="unidad_regalo"
                      value={datosProducto.unidad_regalo}
                      onChange={obtenerUnidadRegalo}
                    >
                      <MenuItem value="Kg">Kg</MenuItem>
                      <MenuItem value="Costal">Costal</MenuItem>
                      <MenuItem value="Lt">Lt</MenuItem>
                    </Select>
                  ) : (
                    <Select
                      id="select-unidad-regalo"
                      disabled={!datosProducto.producto.datos_generales}
                      name="unidad_regalo"
                      value={datosProducto.unidad_regalo}
                      onChange={obtenerUnidadRegalo}
                    >
                      <MenuItem value="Caja">Caja</MenuItem>
                      <MenuItem value="Pz">Pz</MenuItem>
                    </Select>
                  )}
                </FormControl>
              </Box>
            </Grid>
          </Fragment>
        ) : (
          <Grid item>
            <Typography>Cantidad total</Typography>
            <Box width={110}>
              <TextField
                name="cantidad"
                variant="outlined"
                size="small"
                fullWidth
                type="number"
                disabled
                value={datosProducto.cantidad}
              />
            </Box>
          </Grid>
        )}

        <Grid item>
          <Typography>Descuento</Typography>
          <DescuentosInputs />
        </Grid>
      </Grid>
      <Box mt={1}>
        <Grid container>
          <Grid item xs={12} md={7} padding="checkbox">
            <PreciosDeVentaCompras />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box m={1}>
              <MostrarPrecios />
            </Box>
            <Box display="flex">
              {datosProducto.producto.datos_generales &&
              datosProducto.producto.datos_generales.tipo_producto !==
                "OTROS" ? (
                <TallasProductos
                  verificate={verificate}
                  setVerificate={setVerificate}
                />
              ) : null}

              <Box mx={1} />
              {datosProducto.costo !==
              productoOriginal.precios.precio_de_compra.precio_con_impuesto ? (
                <ModalAgregarCompra
                  agregarCompra={agregarCompra}
                  cargando={cargando}
                />
              ) : (
                <Button
                  style={
                    loadingProductos
                      ? {
                          pointerEvents: "none",
                          opacity: 0.4,
                        }
                      : null
                  }
                  variant="contained"
                  color="primary"
                  startIcon={
                    cargando ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <Add />
                    )
                  }
                  disableElevation
                  disabled={
                    datosProducto.producto.datos_generales
                      ? datosProducto.producto.datos_generales.tipo_producto ===
                        "OTROS"
                        ? !datosCompra.proveedor.nombre_cliente ||
                          !datosCompra.almacen.nombre_almacen ||
                          !datosProducto.costo ||
                          !datosProducto.cantidad
                          ? true
                          : false
                        : !datosCompra.proveedor.nombre_cliente ||
                          !datosCompra.almacen.nombre_almacen ||
                          !datosProducto.costo
                        ? true
                        : false
                      : true
                  }
                  onClick={() => agregarCompra()}
                >
                  {isEditing.producto ? "Actualizar " : "Agregar a compra"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalAgregarCompra = ({ agregarCompra, cargando }) => {
  const [open, setOpen] = useState(false);
  const {
    datosProducto,
    datosCompra,
    isEditing,
    loadingProductos,
  } = useContext(ComprasContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        style={
          loadingProductos
            ? {
                pointerEvents: "none",
                opacity: 0.4,
              }
            : null
        }
        variant="contained"
        color="primary"
        startIcon={<Add />}
        disableElevation
        disabled={
          datosProducto.producto.datos_generales
            ? datosProducto.producto.datos_generales.tipo_producto === "OTROS"
              ? !datosCompra.proveedor.nombre_cliente ||
                !datosCompra.almacen.nombre_almacen ||
                !datosProducto.costo ||
                !datosProducto.cantidad
                ? true
                : false
              : !datosCompra.proveedor.nombre_cliente ||
                !datosCompra.almacen.nombre_almacen ||
                !datosProducto.costo
              ? true
              : false
            : true
        }
        onClick={() => handleClickOpen()}
      >
        {isEditing.producto ? "Actualizar " : "Agregar a compra"}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => handleClose()}
        aria-labelledby="modal-agregar-compra"
      >
        <DialogTitle id="modal-agregar-compra" style={{ padding: 0 }}>
          <Alert
            severity="info"
            icon={<InfoOutlined style={{ fontSize: 30 }} />}
            style={{ padding: 16 }}
          >
            <AlertTitle style={{ fontSize: 20 }}>
              El costo es diferente al precio de compra actual
            </AlertTitle>
            <Typography style={{ fontSize: 18 }}>
              ¿Desea actualizar los precios o mantenerlos?
            </Typography>
          </Alert>
        </DialogTitle>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => handleClose()} color="default">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              agregarCompra();
              handleClose();
            }}
            color="primary"
          >
            Mantener
          </Button>
          <PreciosProductos
            cargando={cargando}
            handleClose={handleClose}
            agregarCompra={agregarCompra}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};
