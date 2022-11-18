import React, { createContext, useState } from "react";
import {
  initial_state_datos_generales,
  initial_state_precios,
  initial_state_unidadVentaXDefecto,
  initial_state_preciosP,
  initial_state_unidadesVenta,
  initial_state_almacen_inicial,
  initial_state_centro_de_costos,
  initial_state_preciosPlazos,
  initial_state_subcategorias,
  initial_state_imagenes,
  initial_state_imagenes_eliminadas,
  initial_state_onPreview,
  initial_state_validacion,
  initial_state_subcostos,
  initial_state_selectedDate,
  initial_state_presentaciones,
  initial_state_unidadVentaSecundaria,
} from "./initialStatesProducto";

export const RegProductoContext = createContext();

export const RegProductoProvider = ({ children }) => {
  const [datos_generales, setDatosGenerales] = useState(
    initial_state_datos_generales
  );
  const [precios, setPrecios] = useState(initial_state_precios);
  const [unidadVentaXDefecto, setUnidadVentaXDefecto] = useState(
    initial_state_unidadVentaXDefecto
  );
  const [unidadVentaSecundaria, setUnidadVentaSecundaria] = useState(
    initial_state_unidadVentaSecundaria
  );
  const [preciosP, setPreciosP] = useState(initial_state_preciosP);
  
  const [unidadesVenta, setUnidadesVenta] = useState(
    initial_state_unidadesVenta
  );
  const [almacen_inicial, setAlmacenInicial] = useState(
    initial_state_almacen_inicial
  );
  const [centro_de_costos, setCentroDeCostos] = useState(
    initial_state_centro_de_costos
  );
  const [preciosPlazos, setPreciosPlazos] = useState(
    initial_state_preciosPlazos
  );
  const [subcategorias, setSubcategorias] = useState(
    initial_state_subcategorias
  );
  const [imagenes, setImagenes] = useState(initial_state_imagenes);
  const [imagenes_eliminadas, setImagenesEliminadas] = useState(
    initial_state_imagenes_eliminadas
  );
  const [onPreview, setOnPreview] = useState(initial_state_onPreview);
  const [validacion, setValidacion] = useState(initial_state_validacion);
  const [subcostos, setSubcostos] = useState(initial_state_subcostos);
  const [selectedDate, setSelectedDate] = useState(initial_state_selectedDate);
  const [update, setUpdate] = useState(false);
  const [presentaciones, setPresentaciones] = useState(
    initial_state_presentaciones
  );
  const [presentaciones_eliminadas, setPresentacionesEliminadas] = useState([]);
  const [actualizarLista, setActualizarLista] = React.useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  // USESTATES DE DESCUENTOS DE PRODUCTOS
  const [ datosPreciosProducto, setDatosPreciosProducto ] = useState([]);
  const [ preciosDescuentos, setPreciosDescuentos] = useState([]);
  const [ preciosProductos, setPreciosProductos ] = useState([]);
  const [ datosEnDescuentos, setDatosEnDescuentos ] = useState([]);
  const [ almacen_existente, setAlmacenExistente] = useState(false);

  return (
    <RegProductoContext.Provider
      value={{
        datos_generales,
        setDatosGenerales,
        precios,
        setPrecios,
        almacen_inicial,
        setAlmacenInicial,
        imagenes,
        setImagenes,
        imagenes_eliminadas,
        setImagenesEliminadas,
        onPreview,
        setOnPreview,
        validacion,
        setValidacion,
        preciosP,
        setPreciosP,
        preciosPlazos,
        setPreciosPlazos,
        unidadesVenta,
        setUnidadesVenta,
        centro_de_costos,
        setCentroDeCostos,
        unidadVentaXDefecto,
        setUnidadVentaXDefecto,
        subcategorias,
        setSubcategorias,
        subcostos,
        setSubcostos,
        selectedDate,
        setSelectedDate,
        update,
        setUpdate,
        presentaciones,
        setPresentaciones,
        presentaciones_eliminadas,
        setPresentacionesEliminadas,
        actualizarLista,
        setActualizarLista,
        alert,
        setAlert,

        datosPreciosProducto, 
        setDatosPreciosProducto,
        preciosDescuentos, 
        setPreciosDescuentos,
        preciosProductos, 
        setPreciosProductos,
        datosEnDescuentos, 
        setDatosEnDescuentos,
        almacen_existente, 
        setAlmacenExistente,
        unidadVentaSecundaria, 
        setUnidadVentaSecundaria
      }}
    >
      {children}
    </RegProductoContext.Provider>
  );
};
