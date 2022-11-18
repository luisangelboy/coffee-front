import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import { formatoMexico } from '../../../../config/reuserFunctions';

const columns = [
	{ id: 'cantidad', label: 'Cantidad', minWidth: 100 },
	{ id: 'nombre', label: 'Nombre', minWidth: 100 },
	{ id: 'precioU', label: 'Precio Unitario', minWidth: 100 },
    { id: 'total', label: 'Total', minWidth: 100 }
];

const useStyles  = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	container: {
		maxHeight: '100%'
	},
    appBar: {	
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
    table: {
        minWidth: 650,
    },
}));

export default function TablaProductosEgresos({productos, borrarProducto}) {
	const classes = useStyles();
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(3);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader className={classes.table} size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
							<TableCell align={'center'} style={{ minWidth: 100 }}>
								Eliminar
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{productos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((producto, index) => {
							return (
								<RowsProductos 
									index={index}
									producto={producto}
									borrarProducto={borrarProducto}
								/>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[]}
				component="div"
				count={productos.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};


function RowsProductos ({index, producto, borrarProducto}) {
	return(
		<TableRow hover role="checkbox" tabIndex={-1}>
			<TableCell>
				{producto?.cantidad_productos}
			</TableCell>
			<TableCell>
				{producto?.producto}
			</TableCell>
			<TableCell>
				${formatoMexico(producto?.precio_unitario)}
			</TableCell>
			<TableCell>
				${formatoMexico(producto?.total)}
			</TableCell>
			<TableCell align='center' >
				<IconButton 
					aria-label="delete" 
					size='small'
					onClick={() => borrarProducto(index)}
				>
					<DeleteIcon fontSize="medium" />
				</IconButton>
			</TableCell>
		</TableRow>
	)
}