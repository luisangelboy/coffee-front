import React, { useState } from 'react';
import { Box, Button,  Dialog, DialogActions, DialogContent, Slide, Typography } from '@material-ui/core'
import useStyles from '../styles';
import AddIcon from "../../../icons/ventas/add.svg"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
 
export default function VentasCredito() {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => { 
		setOpen(!open);
	};

    window.addEventListener('keydown', Mi_función); 
    function Mi_función(e){
        if(e.keyCode === 113){ 
            handleClickOpen();
        } 
    };

    return (
        <>
            <Button 
                className={classes.borderBoton}
                onClick={handleClickOpen}
            >
                <Box>
                    <Box>
                        <img 
                            src={AddIcon}
                            alt="icono credito" 
                            style={{width: 100}}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" >
                            <b>Venta Credito</b>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" style={{color: '#808080'}} >
                            <b>F2</b>
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
                    Ventas A credito
                </DialogContent>
                <DialogActions>

                </DialogActions>

            </Dialog>
            
        </>
    )
}
