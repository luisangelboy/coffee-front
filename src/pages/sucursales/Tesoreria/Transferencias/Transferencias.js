import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DoneIcon from '@material-ui/icons/Done';
import Slide from '@material-ui/core/Slide';
import { Box, DialogActions, Paper } from '@material-ui/core';
import FormTransferencia from './FormTransferencia';
import TransferenciaIcon from "../../../../icons/transferencia-bancaria.svg"

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
	
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Transferencias() {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const handleClickOpen = () => setOpen(!open);

	return (
		<div>
			<Button fullWidth onClick={handleClickOpen}>
				<Box display="flex" flexDirection="column">
					<Box display="flex" justifyContent="center" alignItems="center">
                        <img src={TransferenciaIcon} alt="icono tranferencia" className={classes.icon} />
					</Box>
					Transferencias
				</Box>
			</Button>
			<Dialog open={open} TransitionComponent={Transition}>
				<Paper elevation={3} >
					<FormTransferencia handleClickOpen={handleClickOpen} />
					<DialogActions>
						<Button
							variant="contained"	
							color="primary"
							onClick={handleClickOpen}
							size="large"
							startIcon={<DoneIcon />}
						>
							Registrar
						</Button>
					</DialogActions>
				</Paper>
			</Dialog>
		</div>
	);
}
