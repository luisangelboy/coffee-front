import React from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Box, Typography } from '@material-ui/core';

export default function ErrorPage({ error, altura}) {
	let height = altura
	if(!height) height = 400;
	return (
		<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={height}>
			<ErrorOutlineIcon style={{ fontSize: 100, color: 'rgba(17,85,204, 0.7)' }} />
			<Typography align="center" style={{ fontSize: 18, color: 'rgba(17,85,204)' }}>
				Hubo un problema
			</Typography>
		</Box>
	);
}
