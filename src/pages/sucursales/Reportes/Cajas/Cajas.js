import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid  } from '@material-ui/core';
import HistorialCaja from './HistorialCaja';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import CardCaja from './CardCaja';
import CajaIcon from "../../../../icons/cajas.svg"

import { OBTENER_CAJAS } from '../../../../gql/Cajas/cajas';
import { useQuery } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	icon: {
		width: 100
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Cajas() {
	const classes = useStyles();
    const [ loading, setLoading ] = React.useState(false);
	const [ open, setOpen ] = React.useState(false);
    const [ openHistorial, setOpenHistorial ] = React.useState(false);
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
    const [ cajaSelected, setCajaSelected ] = React.useState({name:''});
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    let obtenerCajasSucursal = []; 

	
    /* Queries */
    const {  data, refetch } = useQuery(OBTENER_CAJAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		}
	});	

    useEffect(
		() => {
			setLoading(true);
			refetch();
			setLoading(false);
		},
		[ refetch ]
	); 
	
	if(data){
		obtenerCajasSucursal = data.obtenerCajasSucursal;
	}
	const handleClickOpen = () => {
		setOpen(true);
	};
    const handleClickOpenHistorial = () => {
		setOpenHistorial(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
    const handleCloseHistorial = () => {
		setOpenHistorial(false);
	};

	return (
		<div>
            <SnackBarMessages alert={alert} setAlert={setAlert} />	
			<BackdropComponent loading={loading} setLoading={setLoading} />
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
						<img src={CajaIcon} alt="icono numero calzado" className={classes.icon} />
					</Box>
					Historial de Cajas
				</Box>
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Historial de Cajas
						</Typography>
						<Box m={1}>
							<Button variant="contained" color="secondary" onClick={handleClose} size="large">
								<CloseIcon style={{fontSize: 30}} />
							</Button>
						</Box>
					</Toolbar>
				</AppBar>
				<Grid container spacing={1} justifyContent="center" >
					{obtenerCajasSucursal?.map((caja, index) => {
						return(
							<Button key={index} onClick={()=>{handleClickOpenHistorial(); setCajaSelected(caja)}}>
								<CardCaja name={caja.numero_caja} activa={caja.activa} cantidad_efectivo_actual={caja.cantidad_efectivo_actual} />
							</Button>
						)	
					})} 
				</Grid> 	
			</Dialog>
            <HistorialCaja open={openHistorial} fetchCajas={refetch} handleClickOpen={handleClickOpenHistorial} cajaSelected={cajaSelected} handleClose={handleCloseHistorial} obtenerCajasSucursal={obtenerCajasSucursal} />
		</div>
	);
}
