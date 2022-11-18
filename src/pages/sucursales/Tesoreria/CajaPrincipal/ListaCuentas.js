import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, CircularProgress} from '@material-ui/core';
import { useQuery } from '@apollo/client';

import RetiroDeposito from './RetiroDeposito';
import HistorialCuentas from './HistorialCuentas';
import { OBTENER_SUCURSALES } from '../../../../gql/Empresa/sucursales';
import { OBTENER_DATOS_EMPRESA } from '../../../../gql/Empresa/empresa';
import { formatoMexico } from '../../../../config/reuserFunctions';

const columns = [
	{ id: 'name', label: 'Origen', minWidth: 150, align: 'left' },
	{ id: 'tipo', label: 'Tipo Cuenta', minWidth: 150, align: 'left' },
	{ id: 'dinero', label: 'Dinero Existencia', minWidth: 100, align: 'left' },
	{ id: 'movimiento', label: 'Realizar Movimiento', minWidth: 100, align: 'center' },	
	{ id: 'historial', label: 'Historial', minWidth: 100, align: 'center' },
];

const useStyles  = makeStyles((theme) => ({
	root: {
		width: '100%',
        height: '50vh'
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
}));

export default function ListaCuentas() {
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const {  data, loading, refetch } = useQuery(OBTENER_SUCURSALES, {
		variables: {
            id: sesion.empresa._id
		}
	});	


    const cuentaEmpresa = useQuery(OBTENER_DATOS_EMPRESA, {
		variables: {
            id: sesion.empresa._id
		}
	});	

	const classes = useStyles();
    let cuentasSucursalesEmpresa = [];
    let cuentaPrincipal = [];


    if(cuentaEmpresa.data){
        cuentaPrincipal = cuentaEmpresa.data.obtenerEmpresa;
    };

    if (data) {
        cuentasSucursalesEmpresa = data.obtenerSucursalesEmpresa
    };

    if (loading && cuentaEmpresa.loading) 
        return (
            <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="50vh"
            >
                <CircularProgress/>
            </Box>
        );
    
	return (
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
                        <TableRow
                            hover
                            role="checkbox"handleClickOpen
                            tabIndex={-1}
                        >
                            <TableCell >{cuentaPrincipal?.nombre_empresa}</TableCell>
                            <TableCell >CUENTA PRINCIPAL</TableCell>
                            <TableCell >
                                <b style={{fontSize: 17}}>${formatoMexico(cuentaPrincipal?.cuenta_empresa?.dinero_actual)}</b>
                            </TableCell>
                            {sesion.accesos.tesoreria.cuentas_empresa.editar === false ? (
                                <TableCell align='center'>  </TableCell>
                            ):(
                                <TableCell align='center'> <RetiroDeposito cuenta={cuentaPrincipal} refetch={cuentaEmpresa.refetch} tipo={true} /> </TableCell>
                            )}
                            <TableCell align='center'> <HistorialCuentas cuenta={cuentaPrincipal}  tipo={true} /> </TableCell>
                        </TableRow>
                            {cuentasSucursalesEmpresa?.map((cuenta, index) => {
                                return(
                                    <RowsCuentas 
                                        key={index}
                                        refetch={refetch}
                                        cuenta={cuenta}
                                        loading={loading}
                                        
                                    /> 
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
	);
};

function RowsCuentas ({cuenta, refetch}) {
	const permisosUsuario = JSON.parse(localStorage.getItem('sesionCafi'));

    return(
        <TableRow
            hover
            role="checkbox"handleClickOpen
            tabIndex={-1}
        >
            <TableCell >{cuenta.nombre_sucursal}</TableCell>
            <TableCell >SUCURSAL</TableCell>
            <TableCell >
                <b style={{fontSize: 17}}>${formatoMexico(cuenta?.cuenta_sucursal?.dinero_actual)}</b>
            </TableCell>
            {permisosUsuario.accesos.tesoreria.cuentas_empresa.editar === false ? (
                <TableCell align='center'>  </TableCell>
            ):(
                <TableCell align='center'> <RetiroDeposito cuenta={cuenta} refetch={refetch} tipo={false} /> </TableCell>
            )}
            <TableCell align='center'> <HistorialCuentas cuenta={cuenta} tipo={false}/> </TableCell>
        </TableRow>
    );
}
