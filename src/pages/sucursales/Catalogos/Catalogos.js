import React from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import Cliente from './Cliente/Cliente';
import Productos from './Producto/';
import Tallas from './Tallas/Tallas';
/* import UnidadMedida from './UnidadMedida/UnidadMedida'; */
/* import Contabilidad from './Contabilidad/Contabilidad'; */
import Proveedores from './Proveedores/Proovedores';
import Cajas from './Cajas/Cajas'; 
import Usuarios from './Usuarios/Usuarios';
import Departamentos from './Departamentos/Departamentos';
import Categorias from './Categorias/Categorias';
import Colores from './Colores/Colores';
import Marcas from './Marcas/Marcas';
import CentroCostos from './CentroCostos/CentroCostos';
import ConceptosAlmacen from './ConceptosAlmacen/ConceptosAlmacen';

export default function Catalogos() {

	const permisosUsuario = JSON.parse(localStorage.getItem('sesionCafi'));
	
	return (
		<Container>
			<Grid container spacing={5} justifyContent="center">
				{permisosUsuario.accesos.catalogos.clientes.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Cliente />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.productos.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Productos />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.tallas_numeros.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Tallas />
						</Box>
					</Grid>
				)}
				{/* <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<UnidadMedida />
					</Box>
				</Grid> */}
				{/* {permisosUsuario.accesos.catalogos.contabilidad.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Contabilidad />
						</Box>
					</Grid>
				)} */}
				{permisosUsuario.accesos.catalogos.provedores.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Proveedores />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.cajas.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Cajas />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.usuarios.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Usuarios />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.departamentos.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Departamentos />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.categorias.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Categorias />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.colores.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Colores />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.marcas.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Marcas />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.centro_costos.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<CentroCostos />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.catalogos.conceptos_almacen.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<ConceptosAlmacen />
						</Box>
					</Grid>
				)}
			</Grid>
		</Container>
	);
}
