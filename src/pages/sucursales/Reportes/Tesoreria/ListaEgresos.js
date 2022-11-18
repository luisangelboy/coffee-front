import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, MenuItem, Select, Slide, TextField, Typography } from '@material-ui/core';
import { useDebounce } from 'use-debounce/lib';
import { useQuery } from '@apollo/client';
import { OBTENER_HISTORIAL_EGRESOS } from '../../../../gql/Tesoreria/egresos';
import moment from 'moment';
import { formatoMexico } from '../../../../config/reuserFunctions';

const columns = [
	{ id: 'folio', label: 'Folio', minWidth: 170 },
	{ id: 'nombre', label: 'Usuario', minWidth: 170 },
	{ id: 'fecha', label: 'Fecha', minWidth: 170 },
	{ id: 'folioF', label: 'Folio Factura', minWidth: 170 },
	{ id: 'tipo', label: 'Tipo Compra', minWidth: 170 },
];

const useStyles  = makeStyles((theme) => ({
		root: {
			width: '100%',
			height: '70vh'
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
	},
	rootBusqueda: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
	},
}));

export default function ListaEgresos() {
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

	const classes = useStyles();
	const [datosFiltro, setDatosFiltro] = useState([]);
	const [value] = useDebounce(datosFiltro, 500);


	const { loading, data, error, refetch  } = useQuery( OBTENER_HISTORIAL_EGRESOS,{
		variables: {
			input: {
                fecha_inicio: datosFiltro.fecha_inicio ? datosFiltro.fecha_inicio : "",
                fecha_fin: datosFiltro.fecha_fin ? datosFiltro.fecha_fin : "",
                usuario: value.usuario ? value.usuario : "", 
                tipo_movimiento: datosFiltro.tipo_movimiento ? (datosFiltro.tipo_movimiento === "CREDITO" ?  true : false) : null
            },
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});


	useEffect(() => {
		refetch();
	}, [refetch]);

	
	let historialEgresos = [];

	if(data){
		historialEgresos = data.obtenerHistorialEgresos
	}

	const obtenerDatos =(e)=>{
		setDatosFiltro({...datosFiltro, [e.target.name]: e.target.value})
    };

	const limpiarDatos = () => {
		setDatosFiltro([]);
	};

	return (
		<Grid>
			<Grid item lg={12} md={12} xs={12}>
				<div className={classes.formInputFlex}>
					<Box width="100%">
						<Typography>
							Fecha Inicio:
						</Typography>
						<TextField
							fullWidth
							size="small"
							name="fecha_inicio"
							variant="outlined"
							type="date"
							onChange={obtenerDatos}
							value={datosFiltro.fecha_inicio ? datosFiltro.fecha_inicio : ""}
						/>
					</Box>
					<Box width="100%">
						<Typography>
							Fecha Fin:
						</Typography>
						<TextField
							fullWidth
							size="small"
							name="fecha_fin"
							variant="outlined"
							type="date"
							onChange={obtenerDatos}
							value={datosFiltro.fecha_fin ? datosFiltro.fecha_fin : ""}
						/>
					</Box>
					<Box width="100%">
						<Typography>
							Usuario:
						</Typography>
						<TextField
							fullWidth
							size="small"
							name="usuario"
							variant="outlined"
							onChange={obtenerDatos}
							value={datosFiltro.usuario ? datosFiltro.usuario : ""}
						/>
					</Box>
					<Box width="100%">
						<Typography>
							Tipo Egreso:
						</Typography>
						<FormControl
							variant="outlined"
							fullWidth
							size="small"
						>
							<Select
								id="form-producto-tipo"
								name="tipo_movimiento"
								onChange={obtenerDatos}
							>
								<MenuItem value="TODOS">
									<em>Selecciona uno</em>
								</MenuItem>
								<MenuItem value='CONTADO'>
									Egreso Contado
								</MenuItem>
								<MenuItem value='CREDITO'>
									Egreso Credito
								</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box 
						width="100%" 
						display="flex" 
						justifyContent="center" 
						alignItems="center"
						mt={2}
					>
						<Button
							color="primary"
							size="large"
							variant="contained"
							onClick={limpiarDatos}
						>
							Limpiar Filtro
						</Button>
					</Box>
				</div>
			</Grid> 
			<Box p={2}>
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
								{historialEgresos.map((row, index) => {
									return (
										<RowsEgresos row={row} loading={loading} key={index} />
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Box>
		</Grid>
	);
};

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function RowsEgresos({row, loading}){

	const [open, setOpen] = useState(false);

	const handleClickOpen =()=> setOpen(!open);

	if (loading) 
	return (
		<Box
		display="flex"
		flexDirection="column"
		justifyContent="center"
		alignItems="center"
		height="80vh"
		>
			<CircularProgress />
		</Box>
	);

	return(
		<Fragment>
			<Dialog
				open={open} 
				TransitionComponent={Transition} 
				fullWidth 
				maxWidth="md"
			>
				<DialogCaracteristicas row={row}  />
				<DialogActions>
					<Button
						variant='outlined'
						color='secondary'
						size='large'
						onClick={handleClickOpen}
					>
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
			<TableRow 
				hover 
				tabIndex={-1} 
				key={row.code}
				onClick={handleClickOpen}
			>
				<TableCell>
					{row.folio_egreso}
				</TableCell>
				<TableCell>
					{row.nombre_usuario_creador}
				</TableCell>
				<TableCell>
					{row.fecha_compra}
				</TableCell>
				<TableCell>
					{row.folio_factura}
				</TableCell>
				<TableCell>
					{row.compra_credito === false ? "Contado" : "Credito"}
				</TableCell>
			</TableRow>
		</Fragment>
	);
};

function DialogCaracteristicas ({row}) {

	return(
		<Fragment>
			<DialogContent>
				<Grid container>
					<Grid item lg={12} xs={12}>
						<Box textAlign="center" p={2}>
							<Typography variant="h6">
								Información de movimiento
							</Typography>
						</Box>
					</Grid>
					<Grid item lg={5} xs={12}>
						<Box display="flex" textAlign="left" p={1}>
							<Typography>
								<b>Fecha Compra: </b> {moment(row.fecha_compra).format('YYYY-MM-DD')}
								<br/>
								<b>Folio movimiento: </b> {row.folio_egreso}
								<br/>
								<b>Usuario: </b> {row.nombre_usuario_creador}
								<br/>
								<b>Categoria: </b> {row.categoria}
								<br/>
								<b>Sub-Categoria: </b> {row.subCategoria}
								<br/>
								<b>Folio Factura: </b> {row.folio_factura}
								<br/>
								<b>Empresa: </b> {row.empresa_distribuidora}
								<br/>
								<b>Provedor: </b> {row.provedor}
								<br/>
								<b>Metodo de pago: </b> {row.metodo_pago}
								<br/>
								<b>Compra credito: </b> {row.compra_credito === false ? "NO" : "Si"}
								{row.compra_credito === false ? null : (
									<>
										<br/>
										<b>Fecha Vencimiento: </b> {row.fecha_vencimiento}
										<br/>
										<b>Saldo Pendiente: </b> {row.saldo_credito_pendiente}
									</>
								)}
							</Typography>
						</Box>
					</Grid>
					<Grid item lg={7} xs={12}>
						<Box textAlign="center">
							<Typography>
								Productos Adquiridos
							</Typography>
						</Box>
						<Box>
							<Paper style={{width: '100%', height: '30vh'}}>
								<TableContainer style={{maxHeight: '100%'}}>
									<Table stickyHeader size="small" aria-label="a dense table">
										<TableHead>
											<TableRow>
												<TableCell align='center' style={{ minWidth: 100 }}>
													CANTIDAD
												</TableCell>
												<TableCell align='center' style={{ minWidth: 100 }}>
													PRODUCTO
												</TableCell>
												<TableCell align='center' style={{ minWidth: 100 }}>
													P. UNITARIO
												</TableCell>
												<TableCell align='center' style={{ minWidth: 100 }}>
													TOTAL
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{row?.productos.map((row, index) => {
												return (
													<TableRow 
														hover 
														tabIndex={-1} 
														key={index}
													>
														<TableCell align='center' >
															{row.cantidad_productos}
														</TableCell>
														<TableCell align='center' >
															{row.producto}
														</TableCell>
														<TableCell align='center' >
															{row.precio_unitario}
														</TableCell>
														<TableCell align='center' >
															{row.total}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						</Box>
						<Box display='flex' justifyContent='flex-end' p={1}> 
							<Typography variant='h6'>
								Total: ${formatoMexico(row.saldo_total)}
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</DialogContent>
		</Fragment>
	);
}
