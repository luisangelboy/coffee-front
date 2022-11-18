import React from 'react';

import { Box, Button,  makeStyles, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

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
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
}));

export default function FormTransferencia({handleClickOpen}) {

    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <Box p={2} display="flex" alignItems="center"> 
                    <Box flexGrow={1}>
                        <Typography variant="h6">
                            Nueva Transferencia
                        </Typography>
                    </Box>
                    <Box m={1} >
                        <Button variant="contained" color="secondary" onClick={handleClickOpen} size="large">
                            <CloseIcon />
                        </Button>
                    </Box>
                </Box>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>Usuario:</Typography>
                        <TextField
                            disabled={true}
                            fullWidth
                            size="small"
                            /* error */
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            value="Manuel"
                            /* helperText="Incorrect entry." */
                            /* onChange={obtenerCampos} */
                        />
                    </Box>
                    <Box width="100%" pt={3}>
                            <Button color="primary" variant="outlined" size="large">
                                Editar usuario
                            </Button>
                    </Box>                
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>Fecha:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            /* error */
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            type="date"
                            defaultValue="2017-05-24"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            /* value="" */
                            /* helperText="Incorrect entry." */
                            /* onChange={obtenerCampos} */
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>Hora:</Typography>
                        <TextField
                            id="time"
                            label="Alarm clock"
                            type="time"
                            defaultValue="07:30"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                        />
                    </Box>                
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>Origen:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            /* error */
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            /* value="" */
                            /* helperText="Incorrect entry." */
                            /* onChange={obtenerCampos} */
                        />
                    </Box>
                    <Box width="100%">
                        <Typography>Destino:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            /* error */
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            /* value="" */
                            /* helperText="Incorrect entry." */
                            /* onChange={obtenerCampos} */
                        />
                    </Box>
                </div>
                <div className={classes.formInputFlex}>
                    <Box width="100%">
                        <Typography>Motivos:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={4}
                            /* error */
                            name="nombre_comercial"
                            id="form-producto-nombre-comercial"
                            variant="outlined"
                            /* value="" */
                            /* helperText="Incorrect entry." */
                            /* onChange={obtenerCampos} */
                        />
                    </Box>
                </div>
            </div>
				
        </>
    )
}
