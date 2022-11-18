import React, { useState } from 'react';
import { Box, Button, DialogActions, Dialog, DialogContent, Divider, Grid, Typography, Slide } from '@material-ui/core'
import useStyles from '../styles';
import { FcSearch } from 'react-icons/fc';
import CajonIcon from "../../../icons/ventas/cajon.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function BuscarProducto() {

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => { 
		setOpen(!open);
	};

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 119){ 
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
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <FcSearch style={{fontSize: 45}} />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Productos</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F8</b>
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
                        textAlign="center" 
                        justifyContent="center" 
                        alignContent="center" 
                        alignSelf="center"
                        justifySelf="center"
                    >
                        <Box>
                            <img 
                                src={CajonIcon} 
                                alt="icono caja"
                                style={{width: 40}}
                        />
                        </Box>
                        <Box m={2} >
                            <Divider orientation="vertical" />
                        </Box>
                        <Box mt={3}>
                            <Typography variant="h5">
                                Cajon Abierto
                            </Typography>
                        </Box>
                    </Box>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClickOpen} 
                    variant="contained" 
                    color="primary"
                >
                    Aceptar
                </Button>
            </DialogActions>
            </Dialog>
        </>
    )
}
