import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import Cajas from './Cajas/Cajas';
import ReportesTurnosUsuarios from './TurnosUsuarios/ReportesTurnosUsuarios';
import ReportesCompras from './Compras/ReportesCompras';
import ReportesVentas from './Ventas/ReportesVentas';
import ReportesAlmacen from './Almacenes/ReportesAlmacen';
import ReportesCortes from './Cortes/ReportesCortes';
import ReportesTesoreria from './Tesoreria/Reporte_Tesoreria';

export default function Reportes() {
	const permisosUsuario = JSON.parse(localStorage.getItem('sesionCafi'));

	return (
		<Container>
			<Grid container spacing={3} justifyContent="center">
				{permisosUsuario.accesos.reportes.reporte_historial_cajas.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<Cajas />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.reportes.reporte_turnos.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<ReportesTurnosUsuarios />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.reportes.reporte_compras.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<ReportesCompras />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.reportes.reporte_ventas.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<ReportesVentas />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.reportes.rerporte_almacen.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<ReportesAlmacen />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.reportes.reporte_corte_caja.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<ReportesCortes />
						</Box>
					</Grid>
				)}
				{/* {permisosUsuario.accesos.reportes.reporte_tesoreria.ver === false ? (null) : (
					<Grid item lg={2} >
						<Box display="flex" justifyContent="center" alignItems="center">
							<ReportesTesoreria />
						</Box>
					</Grid>
				)} */}
			</Grid>
		</Container>
	);
}