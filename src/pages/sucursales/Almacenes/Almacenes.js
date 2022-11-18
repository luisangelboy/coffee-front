import React, {useEffect, useState} from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import RegistroAlmacen from './RegistroAlmacen/RegistroAlmacen';
import Traspasos from './Traspasos/Traspasos';
import { useQuery } from '@apollo/client';
import InventariosPorAlmacen from './InventarioPorAlmacen/InventariosPorAlmacen';
import { TraspasosProvider } from "../../../context/Almacenes/traspasosAlmacen";
import { OBTENER_PRODUCTOS_ALMACEN } from '../../../gql/Almacenes/Almacen';

export default function Almacenes() {
	const [productos, setProductos] = useState([]);
	const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
	const [page, setPage] = useState(0);
	const [pageAlm, setPageAlm] = useState(0);
	const limit = 10;	

	const productosAlmacenQuery = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
			input:{
				empresa: sesion.empresa._id,
				sucursal: sesion.sucursal._id,
				filtro: ''	
			},
			limit:limit,
      		offset: page,
            
		},
		fetchPolicy: "network-only"
	});

	useEffect(() => {
		try {
			if(productosAlmacenQuery.data){
				setProductos(productosAlmacenQuery.data.obtenerProductosAlmacenes);
			}
		} catch (error) {
			
		}
	},[ productosAlmacenQuery.data]); 



	return (
		<Container>
			<Grid container spacing={3} justifyContent="center" alignItems="center">
			{sesion.accesos.almacenes.almacen.ver === false ? (null):(
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<RegistroAlmacen />
					</Box>
				</Grid> 
			)}
			{sesion.accesos.almacenes.traspasos.ver === false ? (null):(
				<Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<TraspasosProvider>
							<Traspasos productosAlmacenQuery={productosAlmacenQuery}  page={page} setPage={setPage}limit={limit} pageAlm={pageAlm} setPageAlm={setPageAlm}/>
						</TraspasosProvider>
					</Box>
				</Grid>
			)}
			{sesion.accesos.almacenes.inventario_almacen.ver === false ? (null):(
				<Grid item lg={2} >
					<Box display="flex" justifyContent="center" alignItems="center">
						<TraspasosProvider>
							<InventariosPorAlmacen productos={productos} productosAlmacenQuery={productosAlmacenQuery} 
								setProductos={setProductos} page={page} setPage={setPage}limit={limit} 
							/>
						</TraspasosProvider>
					</Box>
				</Grid>
			)}
			</Grid>
		</Container>
	);
}
