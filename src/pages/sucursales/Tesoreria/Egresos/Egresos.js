import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { Box } from '@material-ui/core';
import VistaRegistroEgreso from './VistaRegistroEgreso';
import EgresosIcon from "../../../../icons/income.svg"

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
	},
	root: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundColor: theme.palette.background.paper
	},
	rootBusqueda: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
	iconSize: {
		fontSize: 40,
        color: theme.palette.info.main
	},
	iconSizeSecond: {
		width: 40,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Egresos() {
	const classes = useStyles();
	const [ open, setOpen ] = useState(false);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src={EgresosIcon} alt="icono egreso" className={classes.icon} />
					</Box>
					Egresos
				</Box>
			</Button>
			<Dialog 
				open={open} 
				TransitionComponent={Transition} 
				fullWidth 
				maxWidth="lg"
			>
				<VistaRegistroEgreso handleClickOpen={handleClickOpen} />
			</Dialog>
		</div>
	);
}
