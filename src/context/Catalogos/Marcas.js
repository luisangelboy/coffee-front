import React, { createContext, useState } from 'react';

export const CreateMarcasContext = createContext();

export const MarcasProvider = ({ children }) => {
	const [ datosMarcas, setDatosMarcas ] = useState({
        nombre_marca: ""
    });

    const [ update, setUpdate ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ openRegistro, setOpenRegistro ] = useState(false);

	return (
		<CreateMarcasContext.Provider value={
            { 
                datosMarcas, 
                setDatosMarcas,
                update,
                setUpdate,
                error,
                setError,
                openRegistro,
                setOpenRegistro
            }
        }>
			{children}
		</CreateMarcasContext.Provider>
	);
};
