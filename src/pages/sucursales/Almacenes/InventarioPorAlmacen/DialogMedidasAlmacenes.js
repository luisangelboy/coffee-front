import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Close} from '@material-ui/icons';
import { Slide,Button, Box, Dialog, InputLabel, Select, Input, MenuItem, FormControl, DialogTitle } from '@material-ui/core';
import MedidasAlmacens from './MedidasAlmacenes'

	const ITEM_HEIGHT = 200;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
	  PaperProps: {
		style: {
		  maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
		  width: 400,
		},
	  },
	};
	
	const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	
	container: {

		height: '100%'
	},
	formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 300,
    },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function DialogMedidasAlmacenes(props) {
	const classes = useStyles();
	const [almacen, setAlmacen] = useState({});


	const handleChangeAlmacen = (e) =>{
		try {
		
			setAlmacen(e.target.value);
		
		} catch (error) {
			
		}
		
	}

	
	
		return (
			<Dialog open={props.medidasAlmacen.open} TransitionComponent={Transition} fullWidth maxWidth={"sm"} >
				<DialogTitle>
				
				<Box display='flex' >
					<Box width="88%">
					Tallas y medidas
					</Box>
					<Box  display='flex' justifyContent="flex-end" >
						<Button variant="contained" color="secondary" onClick={() => {props.setMedidasAlmacen({open:false, producto:{}}); setAlmacen({});}} size="large">
							<Close style={{ fontSize: 30}}/>
						</Button>
					</Box>
				</Box>
				</DialogTitle>
				<Box mx={3}>
				<FormControl className={classes.formControl}>
					<InputLabel id="almacen-label">Almacén</InputLabel>
					<Select
						labelId="almacen-label"
						id="almacen"
						value={(almacen) ? almacen.nombre_almacen : ""}
						onChange={ handleChangeAlmacen}
						input={<Input />}
					
						MenuProps={MenuProps}
						>
						
						{props.obtenerAlmacenes.map((alm) => {
							return(
								<MenuItem key={alm._id} value={alm} >
									{alm.nombre_almacen}
								</MenuItem>
							)})
						}
					</Select>
				</FormControl>
				</Box>
				{(props.medidasAlmacen.open) ?
				<Box height='100%' mx={3} mt={2}>
					<MedidasAlmacens producto={props.medidasAlmacen.producto}  almacen={almacen} />	
				</Box>
				:
				<div/>
				}
			
			</Dialog>
	);
}