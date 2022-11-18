import React, { useState } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid,   IconButton, 
        Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, 
        TablePagination, TableRow, Typography 
    } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Apartadoicon from "../../../icons/ventas/tag.svg"

import useStyles from '../styles';

const columns = [
	{ id: 'folio', label: 'Folio', minWidth: 20, align: 'center' },
    { id: 'nombre', label: 'Nombre', minWidth: 160, align: 'center' },
	{ id: 'producto', label: 'Producto', minWidth: 160, align: 'center'},
    { id: 'fechaInicio', label: 'Fecha Inicio', minWidth: 160, align: 'center'},
    { id: 'fechaVencimiento', label: 'Fecha Limite', minWidth: 160, align: 'center'},
    { id: 'enganche', label: 'Enganche', minWidth: 160, align: 'center'},
    { id: 'total', label: 'Total', minWidth: 160, align: 'center'}
];

function createData(folio, nombre, producto, fechaInicio, fechaVencimiento, enganche, total) {
	return { folio, nombre, producto, fechaInicio, fechaVencimiento, enganche, total};
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const rows = [
	createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
    createData(123, "Anuel", "Refrigerador", "10/12/2021", "18/12/2021", 2501, 5000 ),
];

export default function ListaApartados() {
    
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(8);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 121){ 
            handleClickOpen();
        } 
    };

    return (
        <>
            <Button 
                className={classes.borderBotonChico}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src={Apartadoicon} 
                            alt="icono apartados" 
                            style={{width: 38}} 
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Lista Apartados</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F10</b>
                        </Typography>
                    </Box>
                </Box>
            </Button>
            <Dialog
				maxWidth='lg'
				open={open} 
				onClose={handleClickOpen} 
				TransitionComponent={Transition}
			>

                <DialogContent>
                    <Grid container item lg={12}>
                        <Box 
                            display="flex" 
                            flexGrow={1}
                        >
                            <Box>
                                <img src={Apartadoicon} alt="icono apartados" className={classes.iconSizeDialogs} />
                            </Box>
                            <Box m={2} >
                                <Divider orientation="vertical" />
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">
                                    Productos Apartados
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                                <CloseIcon />
                            </Button>
                        </Box>
                    </Grid>
                        <Grid>
                            
                            <Paper className={classes.root}>
                                <TableContainer className={classes.container}>
                                    <Table stickyHeader size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell key={column.id} align={column.align} style={{ width: column.minWidth }}>
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                                <TableCell align='center' style={{ width: 35 }}>
                                                    Eliminar
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number' ? (
                                                                        column.format(value)
                                                                    ) : (
                                                                        value
                                                                    )}
                                                                </TableCell>
                                                            );
                                                        })}
                                                        <TableCell align='center' >
                                                            <IconButton aria-label="delete" size='small'>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[ 10, 25, 100 ]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Box display="flex" justifyContent="flex-end">
                        <Box>
                            <Button
                                color="primary"
                                variant="contained"
                                size="large"
                            >
                                Continuar Compra
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}
