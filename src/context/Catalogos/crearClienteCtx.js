import React, { createContext, useState } from 'react';

export const ClienteCtx = createContext();

export const ClienteProvider = ({ children }) => {
	const [ cliente, setCliente ] = useState({
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
		estado_cliente: true
	});
	const [ toUpdate, setToUpdate ] = useState(false);
	const [ error, setError ] = useState(false);
	const [ update, setUpdate ] = useState(false);
	const [ clientes, setClientes ] = useState([]);
	const [updateClientVenta, setUpdateClientVenta] = useState(false);


	return (
		<ClienteCtx.Provider
			value={{
				cliente,
				setCliente,
				toUpdate,
				setToUpdate,
				error,
				setError,
				update,
				setUpdate,
				setUpdateClientVenta,
				updateClientVenta,
				clientes,
				setClientes
			}}
		>
			{children}
		</ClienteCtx.Provider>
	);
};
