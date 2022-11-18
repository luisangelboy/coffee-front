import React, { createContext, useState } from 'react';

export const TraspasosAlmacenContext = createContext();

export const TraspasosProvider = ({ children }) => {


    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);
    const [ productos, setProductos ] = useState([]);
    const [ productosTo, setProductosTo ] = useState([]);
     const [ productosEmpTo, setProductosEmpTo ] = useState([]);
    const [ productosTras, setProductosTras ] = useState([]);
    const [ dataExcel, setDataExcel ] = useState([]);

	return (
		<TraspasosAlmacenContext.Provider value={
            { 
                
                update,
                setUpdate,
                error,
                setError,
                openRegistro,
                setOpenRegistro,
                productos,
                setProductos,
                productosTras,
                setProductosTras,
                productosTo,
                setProductosTo,
                productosEmpTo, 
                setProductosEmpTo,
                dataExcel,
                setDataExcel
                
            }
        }>
			{children}
		</TraspasosAlmacenContext.Provider>
	);
};
