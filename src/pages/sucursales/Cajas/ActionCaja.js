/* import React, {  useContext,useState, useEffect, Fragment } from 'react';
import {useMutation } from '@apollo/client';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import {Typography, Dialog, Button, Toolbar, Grid, CircularProgress,
    FormControl, Select, InputLabel, useTheme, Input, MenuItem, TextField} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {Badge, Box} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        margin:5
    },
    title: {
		marginLeft: theme.spacing(2),
		flex: 1,

	},
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        maxWidth: 250,
    },
    input:{
		width:'100%',
      
	},
}));
const ITEM_HEIGHT = 200;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};
function getStyles(caja, cajaName, theme) {
  return {
    fontWeight:
      cajaName.indexOf(caja) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

export default function ActionCaja(props) {
    const [ loading, setLoading ] = React.useState(false);
    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
     const [ cajaSelected, setCajaSelected ] = React.useState('');
     const [ nameCajaSelected, setNameCajaSelected ] = React.useState('');
    
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const theme = useTheme();
    const classes = useStyles();

    const handleChange = (event) => {
       props.setCajaDestino(event.target.value)
    };
    const setCant = (value) => {
        const onlyNums = value.toString().replace(/()^0-9]/g, '');
    
        props.setCantidadMovimiento(onlyNums)
     };
    const textoButton = (props.action.depositar) ? 'DEPOSITAR' : (props.action.retirar) ? 'RETIRAR' :'TRANSFERIR';
    return (
        <React.Fragment>
            {
            (props.action.depositar || props.action.retirar || props.action.transferir) ?
                <Box display="flex" mr={5}  flexDirection="row" ml={5} m={5} mb={1}>
            
                
                    
                    
                    <Box width="250px"  ml={5}>
                        <Typography>
                            Cantidad
                        </Typography>
                        <TextField
                            fullWidth
                            className={classes.input}
                            type="text"
                            size="small"
                            name="nombreQuien"
                            variant="outlined"
                            value={props.cantidadMovimiento}
                            error={props.errorCantidad}
                            onChange={(e) => setCant(e.target.value)}
                        />
                    </Box>
                    {
                (props.action.transferir) ? 
                <FormControl className={classes.formControl} error={props.errorCajaDestino} ml={1}>
                    <InputLabel id="caja-label">Caja destino</InputLabel>
                    <Select
                    labelId="caja-label"
                    id="caja-name"
                    value={props.cajaDestino}
                    onChange={handleChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                   
                    >
                    {props.cajas?.map((caja, index) => {
                        console.log(caja._id, props.idCaja)
                        if(caja._id !== props.idCaja){
                            return(
                                <MenuItem key={caja} value={caja}style={getStyles(caja.numero_caja, (cajaSelected.numero_caja) ? "" + cajaSelected.numero_caja : '', theme)} >
                                Caja {caja.numero_caja}
                                </MenuItem>
                            )
                        }	
                    })} 
                
                    </Select>
                </FormControl>
                : 
                
                <div/>
            }
                    <Box width="250px"  ml={8} mt={2} >	
                    <FormControl className={classes.formControl}>
                        <Button
                            onClick={()=>props.nuevoHistorial()}
                            color="primary"
                            variant="contained"
                            autoFocus
                            endIcon={loading ? <CircularProgress color="inherit" size={25} /> : null}
                        >
                            {textoButton}
                        </Button>
                    </FormControl>
                    </Box>
                    
                </Box>
            :
            <div/>
            }
          
        
        </React.Fragment>
    )
} */
