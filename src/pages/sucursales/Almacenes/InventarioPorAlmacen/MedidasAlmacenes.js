import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
	root: {
		width: '100%',
		height: '48vh'
	},
	container: {
		
		maxHeight: '74vh'
	},
	colorContainer: {
		border: "1px solid rgba(0,0,0, .3)",
		height: 30,
		width: 30,
		borderRadius: "15%",
	  },
});

export default function MedidasAlmacenes(props) {
	const classes = useStyles();


		return (
		<div className={classes.root}>
			<Paper >
				<TableContainer style={{height:'45vh'}}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size="small"
						aria-label="enhanced table"
					>
						<TableHead>
							<TableRow>
								<TableCell >Medida</TableCell>
								<TableCell >Color</TableCell>
								<TableCell >Cantidad existente</TableCell>
                            </TableRow>
						</TableHead>
						<TableBody>
							{/* {stableSort(producto.medidas_producto, getComparator(order, orderBy))
                			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((item, index) => { */}
							{props.producto.medidas_producto.map((item, index) => {	
								
								return (
									
									<Row item={item} key={index} almacenSeleccionado={props.almacen} />
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			{/* 	<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={producto.medidas_producto.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					// onRowsPerPageChange={handleChangeRowsPerPage}
				/> */}
			</Paper>
		</div>
	);
}

const Row = ({item, almacenSeleccionado}) =>{
	const classes = useStyles();
	
	try {
		let ItemReturn= <div/>;
		
		if(almacenSeleccionado._id  === item.almacen){
			ItemReturn = 
				<TableRow>
					<TableCell >
						{item.medida.talla}
					</TableCell>
					<TableCell >
						<Tooltip
							title={item.color.nombre}
							placement="top"
							arrow
						>
							<div
							className={classes.colorContainer}
							style={{
								backgroundColor: item.color.hex,
							}}
							/>
						</Tooltip>
					</TableCell>
					<TableCell >{item.cantidad}</TableCell>
				</TableRow>	
			;	
		}
		
		return(
			ItemReturn
		);
	} catch (error) {
		console.log(error)
	}
	
}