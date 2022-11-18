import React, { createContext, useState } from 'react';

export const CreateDepartamentosContext = createContext();

export const DepartamentosProvider = ({ children }) => {
    const [data, setData] = useState({
		nombre_departamentos:''
	});
    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ accion, setAccion ] = useState(true);
    const [ openRegistro, setOpenRegistro ] = useState(false);
    const [ idDepartamento, setIdDepartamento ] = useState("");
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const [  loading, setLoading ] = useState(false);


	return (
		<CreateDepartamentosContext.Provider value={
            { 
                data, 
                setData,
                update,
                setUpdate,
                error,
                setError,
                openRegistro,
                setOpenRegistro,
                accion,
                setAccion,
                idDepartamento, 
                setIdDepartamento,
                alert,
                setAlert,
                loading,
                setLoading
            }
        }>
			{children}
		</CreateDepartamentosContext.Provider>
	);
};
