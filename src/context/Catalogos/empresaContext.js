import React, { createContext, useState } from 'react';

export const EmpresaContext = createContext();

export const EmpresaProvider = ({ children }) => {
   
	const [ empresa, setEmpresa ] = useState({
		nombre_empresa:'',
        nombre_dueno:'',
		telefono_dueno:'',
		celular:'',
		correo_empresa:'',
        nombre_fiscal:'',
        rfc:'',
        regimen_fiscal:'',
        curp:'',
        info_adicio:'',
		direccion: {
			calle: '',
			no_ext: '',
			no_int: '',
			codigo_postal: '',
			colonia: '',
			municipio: '',
			localidad: '',
			estado: '',
			pais: ''
		},
        direccionFiscal: {
            calle: '',
			no_ext: '',
			no_int: '',
			codigo_postal: '',
			colonia: '',
			municipio: '',
			localidad: '',
			estado: '',
			pais: ''
        },
        datosBancarios:{
            cuenta: '',
            sucursal: '',
            clave_banco: ''
        },
		imagen: null
	});
	const [ toUpdate, setToUpdate ] = useState(false);
	const [ error, setError ] = useState({error: false, message: ''});
	const [ update, setUpdate ] = useState(false);

	return (
		<EmpresaContext.Provider
			value={{
				empresa,
				setEmpresa,
				toUpdate,
				setToUpdate,
				error,
				setError,
				update,
				setUpdate
			}}
		>
			{children}
		</EmpresaContext.Provider>
	);
};