import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TablaUnidades from './ListaUnidades';

export default function RegistroUnidades() {
	return (
		<Box>
			<Box display="flex" justifyContent="center" alignItems="center" my={2}>
				<TextField
					/* error */
					id="outlined-error-helper-text"
					label="Unidad de medida"
					defaultValue="Kg"
					/* helperText="Incorrect entry." */
					variant="outlined"
					size="small"
				/>
				<Box ml={1} />
				<Button color="primary" variant="contained" size="large" disableElevation>
					<Add />Guardar
				</Button>
			</Box>
			<TablaUnidades />
		</Box>
	);
}
