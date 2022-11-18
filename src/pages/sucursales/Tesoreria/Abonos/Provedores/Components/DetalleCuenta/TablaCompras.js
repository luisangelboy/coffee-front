import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const columns = [
	{ id: 'cantidad', label: 'Cantidad', minWidth: 80},
	{ id: 'cantidadR', label: 'Cant. Regalo', minWidth: 80},
	{ id: 'nombre', label: 'Producto', minWidth: 80},
	{ id: 'precio', label: 'Precio', minWidth: 80},
	{ id: 'total', label: 'Total', minWidth: 80},
];

const useStyles  = makeStyles((theme) => ({
	root: {
		width: '100%',
		height: '45vh'
	},
	container: {
		maxHeight: '100%'
	},
    appBar: {	
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	}
}));

export default function TablaCompras({productos}) {
	const classes = useStyles();


	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{productos?.map((producto, index) => {
							return (
								<TableRow key={index} hover role="checkbox" tabIndex={-1} >
									<TableCell>{producto.cantidad}</TableCell>
									<TableCell>{producto.cantidad_regalo}</TableCell>
									<TableCell>{producto.producto.datos_generales.nombre_comercial}</TableCell>
									<TableCell>{producto.costo}</TableCell>
									<TableCell>{producto.total}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}