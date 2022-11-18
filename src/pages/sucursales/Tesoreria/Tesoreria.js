import React, { useContext } from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import CajaPrincipal from './CajaPrincipal/CajaPrincipal';
import AbonosProveedores from './Abonos/Provedores/AbonosProovedores';
import AbonosClientes from './Abonos/Clientes/AbonosClientes';
import {AbonosProvider} from "../../../context/Tesoreria/abonosCtx";
// import Transferencias from './Transferencias/Transferencias';

import SnackBarMessages from '../../../components/SnackBarMessages';
import { TesoreriaCtx } from '../../../context/Tesoreria/tesoreriaCtx';

export default function Tesoreria() {
  
	const { alert, setAlert } = useContext(TesoreriaCtx);
	const permisosUsuario = JSON.parse(localStorage.getItem('sesionCafi'));

	return (
		<Container>
            <SnackBarMessages alert={alert} setAlert={setAlert} />
			<Grid container spacing={2} justifyContent="center">
				{permisosUsuario.accesos.tesoreria.cuentas_empresa.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<CajaPrincipal />
						</Box>
					</Grid>
				)}
				{/* {permisosUsuario.accesos.tesoreria.egresos.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Egresos />
						</Box>
					</Grid>
				)} */}
				{permisosUsuario.accesos.tesoreria.abonos_proveedores.ver === false ? (null):(
					<Grid item lg={2}>
						<Box display="flex" justifyContent="center" alignItems="center">
							<AbonosProveedores />
						</Box>
					</Grid>
				)}
				{permisosUsuario.accesos.tesoreria.abonos_clientes.ver === false ? (null):(
					<AbonosProvider>
						<Grid item lg={2}>
							<Box display="flex" justifyContent="center" alignItems="center">
								<AbonosClientes fromVentas={false} />
							</Box>
						</Grid>
					</AbonosProvider>
				)}
                {/* <Grid item lg={2}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Transferencias />
					</Box>
				</Grid> */}
			</Grid>
		</Container>
	);
}
