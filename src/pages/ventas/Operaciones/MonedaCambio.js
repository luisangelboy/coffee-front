import React, { useState } from 'react';

import { AppBar, Box, Button, Dialog, InputBase, makeStyles, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';

import moneda from '../../../icons/ventas/peso.svg';
import CloseIcon from '@material-ui/icons/Close';

const columns = [
	{ id: "icono", label: 'Icono', minWidth: 50 },
    { id: "moneda", label: 'Moneda', minWidth: 50 },
	{ id: "descripcion", label: 'Descripcion', minWidth: 190 },
	{ id: "cambio", label: 'Cambio', minWidth: 20 },

];

function createData(moneda, descripcion, cambio ) {
	return { moneda, descripcion, cambio };
}

const rows = [
	createData(2, 'Pesos Mex.', 18.90),
	createData(2, 'Dolar E.U.', 18.90),
    createData(2, 'Dolar Canadiense', 18.90),
    createData(2, 'Euro', 18.90),
];

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		height: '30vh',
		backgroundColor: theme.palette.background.paper
	},
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconSvg: {
		width: 100
	},
    iconSize: {
		width: 28,
	},
    rootBusqueda: {
        height: 35,
		display: 'flex'
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function MonedaCambio() {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClickOpen =()=>{ setOpen(!open) }

    return (
        <div>
            <Box 
                width="100%"
                display="flex"
                justifyItems="center"
                alignSelf="center"
                justifySelf="center"
                alignItems="center"
            >
                <Box mt={1}>
                    <img src={moneda} alt="iconoBander" className={classes.iconSize} /> 
                </Box>
                <Box width="100%" ml={1} onClick={() => handleClickOpen()}>
                    <Paper width="100%">
                        <InputBase className={classes.rootBusqueda} />
                    </Paper>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClickOpen} TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							Tipo de Moneda
						</Typography>
						<Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                            <CloseIcon />
                        </Button>
					</Toolbar>
				</AppBar>
				<div className={classes.root}>
					
                    <Box p={1}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column, index) => (
                                            <TableCell key={index} style={{ minWidth: column.minWidth }}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                {columns.map((column, index) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={index} align={column.align}>
                                                            {column.format && typeof value === 'number' ? (
                                                                column.format(value)
                                                            ) : (
                                                                value
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
				</div>
			</Dialog>
        </div>
    )
}
