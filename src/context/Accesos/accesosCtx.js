import React, { createContext, useState, useEffect } from 'react';
import { UP_TURNO } from "../../gql/Ventas/abrir_cerrar_turno";
import { useMutation } from "@apollo/client";
export const AccesosContext = createContext();

export const AccesosProvider = ({ children }) => {
    const [ isOnline, setIsOnline ] = useState(false);
    const [ ventasToCloud, setVentasToCloud ] = useState([]);
    const [ abrirPanelAcceso, setAbrirPanelAcceso ] = useState(false);
    const [ departamentos, setDepartamentos ] = useState({departamento: '', subDepartamento: '', tipo_acceso: ''});

    const [ reloadAdministrador, setReloadAdministrador ] = useState(false);
    const [ reloadProductoRapido, setReloadProductoRapido ] = useState(false);
    const [ reloadCancelarVenta, setReloadCancelarVenta ] = useState(false);
    const [ reloadVerPrecios, setReloadVerPrecios ] = useState(false);
    const [ reloadVerPreCorte, setReloadVerPreCorte ] = useState(false);
    const [ reloadEliminarVentaEspera, setReloadEliminarVentaEspera ] = useState(false);
    const [ reloadCrearCotizacion, setReloadCrearCotizacion ] = useState(false);
    const [loadingPage, setLoadingPage] = React.useState(false);
    const [subirTurnoCloud] = useMutation(UP_TURNO);
    const saveVentasToCloud = (objectVenta) => {
        try {
            let oldItems = (JSON.parse(localStorage.getItem('ventasToCloud'))) ? 
                (JSON.parse(localStorage.getItem('ventasToCloud')))
                :
                [];
            ;
           
            oldItems.push(objectVenta);
            localStorage.setItem("ventasToCloud", JSON.stringify(oldItems));
            setVentasToCloud(oldItems); 
        } catch (error) {
            console.log(error);
        }
       
    };
     
    const saveVentasToCloudFail = (arrayVentas) => {
        try {
            localStorage.removeItem('ventasToCloud');
            setVentasToCloud(arrayVentas); 
            localStorage.setItem("ventasToCloud", JSON.stringify(arrayVentas));
        } catch (error) {
            console.log(error);
        }
       
    };
    const removeStorageVentas = (objetcVenta) => {
        try {
            localStorage.removeItem('ventasToCloud');
            setVentasToCloud([]); 
        } catch (error) {
            console.log(error);
        }
       
    };
    
    useEffect(() => {
        let ventasCloud = JSON.parse(localStorage.getItem('ventasToCloud'))
        setVentasToCloud((ventasCloud) ? ventasCloud : []);
    }, []);

    useEffect(() => {
        if(isOnline !== undefined && isOnline === true){
            let turno = JSON.parse(localStorage.getItem('turnoEnCurso'));
            if(turno){
                if(!turno.OnCloud){
                    upTurno(turno, isOnline);  
                }
            }
            
        }
 
    }, [isOnline]);
    
    const upTurno = async (turno, isOnline) => {
        try {
            if(!turno.onCloud){

                const variableTurnoAbierto = await subirTurnoCloud({
                    variables: {
                    activa: true,
                    input:turno,
                    isOnline: isOnline
                    },
                }); 
        
                turno.onCloud = variableTurnoAbierto.data.subirTurnoCloud.done;
                localStorage.removeItem('turnoEnCurso');
            
                localStorage.setItem('turnoEnCurso',  JSON.stringify(turno));
            }
        } catch (error) {
            if (error.networkError.result) {
            console.log(error.networkError.result.errors);
            } else if (error.graphQLErrors) {
            console.log(error.graphQLErrors.message);
            }
        }
    }
    return (
		<AccesosContext.Provider value={
            { 
                departamentos, 
                setDepartamentos,
                reloadProductoRapido, 
                setReloadProductoRapido,
                reloadAdministrador, 
                setReloadAdministrador,
                abrirPanelAcceso, 
                setAbrirPanelAcceso,
                reloadCancelarVenta, 
                setReloadCancelarVenta,
                reloadVerPrecios, 
                setReloadVerPrecios,
                reloadVerPreCorte, 
                setReloadVerPreCorte,
                reloadEliminarVentaEspera, 
                setReloadEliminarVentaEspera,
                reloadCrearCotizacion, 
                setReloadCrearCotizacion,
                setReloadCrearCotizacion,
                isOnline,
                setIsOnline,
                ventasToCloud,
                saveVentasToCloud,
                removeStorageVentas,
                saveVentasToCloudFail,
                loadingPage,
                setLoadingPage
            }
        }>
			{children}
		</AccesosContext.Provider>
	);
};