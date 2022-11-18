import React, { useContext, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Box, Button, Dialog, 
        DialogContent,  DialogTitle, FormControl, makeStyles, 
        MenuItem, 
        Select, 
        Slide, TextField, Typography 
} from '@material-ui/core'
import { formaPago } from '../../../../../Facturacion/catalogos';
import { formatoMexico } from '../../../../../../../config/reuserFunctions';
import { useMutation } from '@apollo/client';
import { CREAR_ABONO } from '../../../../../../../gql/Tesoreria/abonos';
import moment from 'moment';
import BackdropComponent from '../../../../../../../components/Layouts/BackDrop';
import { TesoreriaCtx } from '../../../../../../../context/Tesoreria/tesoreriaCtx';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	input: {
        "& input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "& input[type=number]::-webkit-outer-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: 0,
        },
    },
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(.5)}px`
		},
		'& .obligatorio': {
			color: 'red'
		},
        paddingTop: 0,
        alignItems: "center",
        justifyItems: "center"
	},
}));

export default function AbonoaRecibir({cuenta}) {
    const [ CrearAbono ] = useMutation(CREAR_ABONO);
    
	const { setReload, setAlert } = useContext(TesoreriaCtx);

    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

    const classes = useStyles();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [abono, setAbono] = useState(''); 
    const [metodoPago, setMetodoPago] = useState('');

    
    const input = {
        tipo_movimiento: "ABONO",
        rol_movimiento: "PROVEEDOR",
        /* fecha_movimiento: {
            year: moment().locale("es-mx").format('YYYY'),
            mes: moment().locale("es-mx").format('MM'),
            dia: moment().locale("es-mx").format('DD'),
            no_semana_year: moment().week().toString(),
            no_dia_year: moment().dayOfYear().toString(),
            completa: moment().locale('es-mx').format()
        },
        monto_total_abonado: parseFloat(abono),
        montos_en_caja: {   
            monto_efectivo: {
                monto: metodoPago === '01' ? parseFloat(abono) : 0,
                metodo_pago: "01"
            },
            monto_tarjeta_debito: {
                monto: metodoPago === '28' ? parseFloat(abono) : 0,
                metodo_pago: "28"
            },
            monto_tarjeta_credito: {
                monto: metodoPago === '04' ? parseFloat(abono) : 0,
                metodo_pago: "04"
            },
            monto_creditos: {
                monto: metodoPago === '99' ? parseFloat(abono) : 0,
                metodo_pago: "99"
            },
            monto_monedero: {
                monto: metodoPago === '05' ? parseFloat(abono) : 0,
                metodo_pago: "05"
            },
            monto_transferencia: {
                monto: metodoPago === '03' ? parseFloat(abono) : 0,
                metodo_pago: "03"
            },
            monto_cheques: {
                monto: metodoPago === '02' ? parseFloat(abono) : 0,
                metodo_pago: "02"
            },
            monto_vales_despensa: {
                monto: metodoPago === '08' ? parseFloat(abono) : 0,
                metodo_pago: "08"
            },
        },
        metodo_de_pago:{
            clave: "",
            metodo:  "",
        },
        id_usuario: sesion._id,
        numero_usuario_creador: sesion.numero_usuario,
        nombre_usuario_creador: sesion.nombre,
        id_cliente: cuenta.proveedor.id_proveedor._id,
        numero_cliente: cuenta.proveedor.numero_cliente,
        nombre_cliente: cuenta.proveedor.nombre_cliente, 
        telefono_cliente: cuenta.proveedor.id_proveedor.telefono, 
        email_cliente: cuenta.proveedor.id_proveedor.email,
        id_compra: cuenta._id */
    };

    
    const enviarDatos = async () => { 
        setLoading(true);
        try {
            if(abono === '' || metodoPago === '' ){
                setAlert({ 
                    message: 'Por favor complete los datos', 
                    status: 'error', 
                    open: true 
                });
                setLoading(false);
                return 
            }; 
            await CrearAbono({
                variables: {
                    empresa: sesion.empresa._id,
                    sucursal: sesion.sucursal._id,
                    input
                },
            });
            setReload(true);
            setAbono('');
            setMetodoPago('');
            setAlert({ 
                message: 'Abono registrado', 
                status: 'success', 
                open: true 
            });
            handleClick();
            setLoading(false);
        } catch (error) {
            handleClick();
            setLoading(false);
            setAlert({ 
                message: 'Ocurrio un problema en el servidor', 
                status: 'error', 
                open: true 
            });

        }
    };

    const handleClick = () => {
        setReload(true);
        setOpen(!open);
    };

    return (
        <div>
            <Button
                size="large"
                variant="outlined" 
                fullWidth
                color="primary"
                startIcon={<AddCircleOutlineIcon style={{fontSize: 35}} />}
                onClick={handleClick}
            >
                <Typography variant="h6">
                    Abonar    
                </Typography>
            </Button>
            {/* <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClick}
                fullWidth
                maxWidth='xs'
            >
                <BackdropComponent loading={loading} setLoading={setLoading} />
                <DialogTitle id="alert-dialog-slide-title">
                    <Box display="flex">
                        <Box p={1} flexGrow={1}>
                            Registrar nuevo abono
                        </Box>
                        <Box p={1}>
                            <Button variant="contained" color="secondary" onClick={handleClick} size="large">
								<CloseIcon />
							</Button>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box width="100%"  mt={2} >
                        <Typography><b>Cantidad a abonar:</b></Typography>
                        <TextField
                            fullWidth
                            className={classes.input}
                            onChange={(e) => setAbono(e.target.value)}
                            value={abono}
                            size="small"
                            name="abono_recibir"
                            variant="outlined"
                            type='number'
                        />
                    </Box>
                    <div className={classes.formInputFlex}>
                        <Box width="100%" mt={2} >
                            <Typography><b>Metodo de pago:</b></Typography>
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
                    </div>
                    <Box width="100%" mt={2} display='flex'>
                        <Box flexGrow={1}>
                            <Typography variant='h6'>
                                <b>Total cuenta</b>
                            </Typography>
                        </Box>
                        <Typography style={{color: '#9B9B9B'}} variant='h6'>
                            <b>${formatoMexico(cuenta.total)}</b>
                        </Typography>
                    </Box>
                    <Box width="100%" display='flex'>
                        <Box flexGrow={1}>
                            <Typography  variant='h6'>
                                <b>Total abonado</b>
                            </Typography>
                        </Box>
                        <Typography style={{color: 'green'}} variant='h6'>
                            <b>${formatoMexico(cuenta.total - cuenta.saldo_credito_pendiente)}</b>
                        </Typography>
                    </Box>
                    <Box width="100%" display='flex'>
                        <Box flexGrow={1} >
                            <Typography  variant='h6'>
                                <b>Total restante</b>
                            </Typography>
                        </Box>
                        <Typography  variant='h6'>
                            <b>${formatoMexico(cuenta.saldo_credito_pendiente)}</b>
                        </Typography>
                    </Box>
                    
                </DialogContent>
                <Box display="flex" justifyContent="center" alignContent="center" p={2}>
                    <Button
                        size="large"
                        variant="contained" 
                        color="primary"
                        style={{fontSize: 18}}
                        onClick={enviarDatos}
                    >
                        Registrar Abono
                    </Button>
                </Box>
            </Dialog> */}
        </div>
    )
}
