import React, { createContext, useState } from 'react';

export const VentasContext = createContext();

export const VentasProvider = ({ children }) => {
    const [DatosVentasActual, setDatosVentasActual] = useState({
        subTotal: 0,
        total: 0,
        impuestos: 0,
        iva: 0,
        ieps: 0,
        descuento: 0,
        monedero: 0,
        // tipo_cambio: {},
      });
    const [datosProductoVentas, setDatosProductoVentas] = useState(
        {
            _id: null,
            cantidad: null,
            codigo_barras: null,
            concepto: null,
            default: null,
            descuento: null,
            descuento_activo: null,
            id_producto: {},
            precio: null,
            unidad: null,
            unidad_principal: null
        }
    );
    
    const [productosVentas, setProductosVentas] = useState([]);
    const [datosVentas, setDatosVentas] = useState(
        {
            productos: [],
            cliente: {},
            subtotal: 0,
            impuestos: 0,
            total: 0,
            usuario: {}
        }
    );

    const [ productoCambioPrecio, setProductoCambioPrecio ] = useState({});
    const [ precioSelectProductoVenta, setPrecioSelectProductoVenta ] = useState([]);
    const [ clientesVentas, setClientesVentas ] = useState([]);
    const [ turnoActivo, setTurnoActivo ] = useState();
    const [ ubicacionTurno, setUbicacionTurno ] = useState('');

    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ alert, setAlert ] = useState({ message: "", status: "", open: false });
    const [ abrirTurnosDialog, setAbrirTurnosDialog ] = useState(false);
    const [ updateClientVenta, setUpdateClientVenta ] = useState(false);
    const [ venta_retomada, setVentaRetomada] = useState(null);

    const [open, setOpen] = useState(false);

    // const [precioSeleccionadoTabla, setPrecioSeleccionadoTabla] = useState(false);

    const [updateTablaVentas, setUpdateTablaVentas] = useState(false);
    const [openBackDrop, setOpenBackDrop] = useState(false);
    const [openBuscarProducto, setOpenBuscarProducto] = useState(false);

	return (
		<VentasContext.Provider value={
            { 
                alert, 
                setAlert,
                update,
                setUpdate,
                error,
                setError,
                datosProductoVentas,
                setDatosProductoVentas,
                productosVentas,
                setProductosVentas,
                datosVentas,
                setDatosVentas,
                abrirTurnosDialog, 
                setAbrirTurnosDialog,
                setUpdateClientVenta,
                updateClientVenta,
                setProductoCambioPrecio,
                productoCambioPrecio,
                setPrecioSelectProductoVenta,
                precioSelectProductoVenta,
                setUpdateTablaVentas,
                updateTablaVentas,
                setOpen,
                open,
                clientesVentas, 
                setClientesVentas,
                turnoActivo, 
                setTurnoActivo,
                ubicacionTurno, 
                setUbicacionTurno,
                DatosVentasActual, setDatosVentasActual,
                // precioSeleccionadoTabla,
                // setPrecioSeleccionadoTabla
                setOpenBackDrop,
                openBackDrop,
                venta_retomada, 
                setVentaRetomada,
                openBuscarProducto,
                setOpenBuscarProducto
            }
        }>
			{children}
		</VentasContext.Provider>
	);
};