import React, { useState, useContext } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import DoneAll from '@material-ui/icons/DoneAll';
import { Box, Button, Dialog,  DialogContent,  InputAdornment, Grid,
    DialogTitle, Slide, TextField, Typography,MenuItem,
     makeStyles, IconButton, Select, FormControl} from '@material-ui/core'
import { useMutation } from '@apollo/client';
import { withRouter } from "react-router";
import {  CREAR_ABONO_CLIENTE } from "../../../../../../gql/Tesoreria/abonos";
import {AbonosCtx} from "../../../../../../context/Tesoreria/abonosCtx";
import { formaPago } from '../../../../Facturacion/catalogos';
import BackdropComponent from '../../../../../../components/Layouts/BackDrop';   
import RemoveCircleTwoToneIcon from "@material-ui/icons/RemoveCircleTwoTone";
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles({

title: {
    fontSize: 16,
},

});
function Liquidar(props) {
    //listo
    const classes = useStyles();
    
    const [open, setOpen] = useState(false);
    const {abonos} = useContext(AbonosCtx);
  
    const [metodoPago, setMetodoPago] = useState('');
    const [value, setValue] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cuentaTotalDescuento, setCuentaTotalDescuento] = useState(0);
    const [dineroDescontado, setDineroDescontado] = useState(0);
    const [ crearAbonoVentaCredito ] = useMutation(CREAR_ABONO_CLIENTE);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));

    const handleClick = () => { 
        if(turnoEnCurso || sesion.accesos.tesoreria.caja_principal.ver){
            setOpen(!open);
        }else{
            props.history.push('/ventas/venta-general');
        }
    } 
   
    const obtenerPrecioText = (e) => {
        
        let valorText = parseFloat(e.target.value);
        if(valorText >= 0 && valorText <= props.total_ventas){
            let porcentaje  = parseFloat((((valorText * 100) / props.total_ventas ).toFixed(2)));
            let dineroDescontado = parseFloat((props.total_ventas - valorText).toFixed(2));
                setCuentaTotalDescuento(valorText);
                setDineroDescontado(dineroDescontado);
                setValue(porcentaje);
                setTotal(dineroDescontado);
        }
    };
    
    const obtenerPorcientoSlide = (e) => {
       
        let porcentaje = parseFloat(e.target.value);
        if(porcentaje >= 0 && porcentaje <= 100 ){
            setValue(porcentaje);
            //let porcentaje  =  parseFloat((100 - newValue).toFixed(2));//Porcentaje para calculos de descuento
           
            let cuenta_con_descuento = parseFloat((props.total_ventas * porcentaje / 100).toFixed(2));
            let dineroDescontado = parseFloat((props.total_ventas - cuenta_con_descuento).toFixed(2));
            setCuentaTotalDescuento(cuenta_con_descuento);
            setDineroDescontado(dineroDescontado);
            setTotal(dineroDescontado);
        }
      
    };
    const quitarDescuento = () =>{
        setValue('');
        setCuentaTotalDescuento('');
        setDineroDescontado('');
        setTotal(props.total_ventas);
    }
    const liquidarVentas = async() =>{
        try {
         setLoading(true);
            let ObjectMetodoPago = {};
            formaPago.forEach((val) => {
                if (metodoPago === val.Value) { 
                    ObjectMetodoPago = val;
                }
            });

            const input = {
                tipo_movimiento: "ABONO_CLIENTE",
                rol_movimiento: ( turnoEnCurso) ? "CAJA" : "CAJA_PRINCIPAL",
                numero_caja: (turnoEnCurso) ? parseInt(turnoEnCurso.numero_caja) : 0,
                id_Caja: (turnoEnCurso) ? turnoEnCurso.id_caja : '',
                fecha_movimiento: {
                    year: moment().locale("es-mx").format('YYYY'),
                    mes: moment().locale("es-mx").format('MM'),
                    dia: moment().locale("es-mx").format('DD'),
                    no_semana_year: moment().week().toString(),
                    no_dia_year: moment().dayOfYear().toString(),
                    completa: moment().locale('es-mx').format()
                },
                concepto: 'ABONO_CLIENTE',
                monto_total: props.total_ventas,
                descuento: {
                    porciento_descuento: value,
                    dinero_descontado: dineroDescontado,
                    total_con_descuento: cuentaTotalDescuento
                },
                horario_turno: (turnoEnCurso) ? turnoEnCurso.horario_en_turno : '',
                hora_moviento: {
                    hora: moment().locale("es-mx").format('hh'),
                    minutos: moment().locale("es-mx").format('mm'),
                    segundos: moment().locale("es-mx").format('ss'),
                    completa: moment().locale("es-mx").format('HH:mm:ss')
                },
                metodo_de_pago:{
                    clave: ObjectMetodoPago.Value,
                    metodo:  ObjectMetodoPago.Name,
                },
                
                id_usuario: sesion._id,
                numero_usuario_creador: sesion.numero_usuario,
                nombre_usuario_creador: sesion.nombre,
                id_cliente: props.cliente._id,
                credito_disponible: props.cliente.credito_disponible,
                numero_cliente: props.cliente.numero_cliente,
                nombre_cliente: props.cliente.nombre_cliente ,
                telefono_cliente: props.cliente.telefono_cliente  ,
                email_cliente: props.cliente.email_cliente,
                ventas: (props.isIcon) ? 
                    [
                        { monto_total_abonado: 0, 
                            id_venta:abonos[props.index].id_venta,
                            saldo_credito_pendiente:abonos[props.index].saldo_credito_pendiente
                        }
                    ]
                    :
                    abonos, 
                liquidar: true,
                caja_principal: sesion.accesos.tesoreria.caja_principal.ver
                
            }
            if(metodoPago){
                await crearAbonoVentaCredito({
                    variables: {
                        empresa: sesion.empresa._id,
                        sucursal: sesion.sucursal._id,
                        input
                    },
                });
                props.recargar();
                setOpen(false);
                setLoading(false);
                props.setAlert({ 
                    message: 'Venta liquidada con éxito.', 
                    status: 'success', 
                    open: true 
                });
            }else{
                setLoading(false);
                props.setAlert({ 
                    message: 'Elige un método de pago.', 
                    status: 'error', 
                    open: true 
                });
            }

            
        } catch (error) {
          
            if (error.networkError) {
                console.log(error.networkError.result);
            } else if (error.graphQLErrors) {
                console.log(error.graphQLErrors);
            }
        }
    }
  
    return (
        <Box m={1}>
            {
                (props.isIcon) ? 
                <IconButton aria-label="liquidar" onClick={handleClick} disabled={props.estatus_credito === "PAGADA"} size="small" >
                    <DoneAll />
                   
                </IconButton>
                :
                <Button
                size="large"
                variant="contained" 
                color="primary"
                onClick={handleClick}
                >
                     Liquidar TODAS
                </Button>
            }
           
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <BackdropComponent loading={loading} setLoading={setLoading} />
                <DialogTitle id="alert-dialog-slide-title">
                    <Box display="flex">
                        <Box width='100%' display="flex" justifyContent="flex-start">
                                {(props.isIcon) ? 'Liquidar cuenta':'Liquidar todas las cuentas'}   
                        </Box>
                        <Box width='42%' display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon />
							</Button>
                        </Box>
                    </Box>
                    
                </DialogTitle>
                <DialogContent>
                   
                  
                <Box mt={4}>
                    
                        <Box textAlign={"center"}>
                        <Typography style={{ fontSize: 17 }}>
                            <b>Agregar descuento</b>
                        </Typography>
                        <Alert severity="info">
                            Aplica un descuento por pronto pago a tu cuenta
                        </Alert>
                        </Box>
                        <Box p={2}>
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                            <Typography>
                                <b>Porcentaje:</b>
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name="descuento"
                                id="form-venta-porsentaje-descuento"
                                variant="outlined"
                                value={value}
                                onChange={obtenerPorcientoSlide}
                                type="number"
                                disabled={false}
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">%</InputAdornment>
                                ),
                                }}
                            />
                            </Grid>
                            <Grid item md={6}>
                            <Typography>
                                <b>Dinero a descontar</b>
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                name="precioConDescuento"
                                onChange={obtenerPrecioText}
                                value={cuentaTotalDescuento ? cuentaTotalDescuento : 0 }
                                className={classes.input}
                                variant="outlined"
                            />
                            </Grid>
                        </Grid>
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                            variant="text"
                            color="secondary"
                            size="medium"
                            onClick={quitarDescuento}
                            startIcon={<RemoveCircleTwoToneIcon />}
                            >
                            Quitar descuento
                            </Button>
                        </Box>
                        </Box>
                    
                </Box>
  
                <Box width="65%"  >
                        <Typography><b>Método de pago:</b></Typography>
                        <FormControl 
                            variant="outlined"
                            fullWidth
                            size="small"
                        >
                            <Select
                                width="100%"
                                name="metodo_pago"
                                variant='outlined'
                                value={metodoPago ? metodoPago : ''}
                                onChange={(e) => setMetodoPago(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Selecciona uno</em>
                                </MenuItem>
                                {formaPago.map((metodo, index) => {
                                    return(
                                        <MenuItem key={index} value={metodo.Value}>{metodo.Name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box width="100%" p={1} mt={1}>
                        <Typography><b>Nombre de Cliente:</b> {props.cliente.nombre_cliente}</Typography>
                    </Box>
                    <Box width="100%" p={1}>
                        <Typography><b>Total:</b>  {(total > 0) ? total : props.total_ventas}</Typography>
                    </Box>
                    {/* <Box p={1}>
                        <Alert severity="info">Si desea editar el abono del cliente, <br/>
                        procure este sea mayor al establecido</Alert>
                    </Box> */}
                    
                
                </DialogContent>
                <Box display="flex" justifyContent="flex-end" alignContent="center" p={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 16}}
                        onClick={liquidarVentas}
                    >
                        Liquidar
                    </Button>
                </Box>
            </Dialog>
        </Box>
    )
}
export default withRouter(Liquidar);
/* 
<Box width="100%">
<Typography>Cuenta No. 2501265</Typography>
<TextField
    fullWidth
    size="small"
    /* error 
    name="nombre_comercial"
    id="form-producto-nombre-comercial"
    variant="outlined"
    value="$150,000.00 Mx" 
    /* helperText="Incorrect entry." 
    /* onChange={obtenerCampos} 
/>
</Box>
<Box width="100%">
<Typography>Cuenta No. 2501265</Typography>
<TextField
    fullWidth
    size="small"
    /* error 
    name="nombre_comercial"
    id="form-producto-nombre-comercial"
    variant="outlined"
    value="$150,000.00 Mx" 
    /* helperText="Incorrect entry." 
    /* onChange={obtenerCampos} 
/>
</Box> */