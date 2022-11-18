import {
  initial_state_almacen_inicial,
  initial_state_centro_de_costos,
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_preciosPlazos,
  initial_state_unidadVentaXDefecto,
  initial_state_unidadVentaSecundaria,
} from "../../../../../context/Catalogos/initialStatesProducto";

import { initial_state_preciosP } from "../../../Catalogos/Producto/crearProducto";

export const SetOrResetData = (accion,setStates, producto) => {
  const {
    setDatosGenerales,
    setPrecios,
    setValidacion,
    setPreciosP,
    setImagenes,
    setUnidadesVenta,
    almacen_inicial,
    setAlmacenInicial,
    setUnidadVentaXDefecto,
    setUnidadVentaSecundaria,
    setCentroDeCostos,
    setPreciosPlazos,
    setSubcategorias,
    setOnPreview,
    setSubcostos,
    setImagenesEliminadas,
    setPresentaciones,
    setPresentacionesEliminadas,
    datosCompra
  } = setStates

  if (accion === "SET") {
    
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
      producto.presentaciones ? producto.presentaciones : []
    );
    /* if (datosCompra.almacen.id_almacen && !producto.medidas_registradas) */
    if (datosCompra.almacen.id_almacen && producto.presentaciones.length === 0) {
      setAlmacenInicial({
        ...almacen_inicial,
        id_almacen: datosCompra.almacen.id_almacen,
        almacen: datosCompra.almacen.nombre_almacen,
      });
    }
  } else {
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
  }
};
