import { Box, Button, Dialog, DialogActions,
        DialogContent, makeStyles, 
        MenuItem, Select, Slide, TextField, Typography,
        Input, FormControl, InputLabel
} from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import moment from 'moment';
import SnackBarMessages from '../../../../components/SnackBarMessages';
import { CREAR_MOVIMIENTO_CUENTA } from '../../../../gql/Empresa/sucursales';
import {
    OBTENER_USUARIOS,
  } from "../../../../gql/Catalogos/usuarios";
import { OBTENER_CAJAS } from '../../../../gql/Cajas/cajas';
import { useMutation, useQuery } from '@apollo/client';
import RetirosIcon from "../../../../icons/retiro-de-dinero.svg"

const useStyles = makeStyles((theme) => ({
	formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		}
	},
	formInput: {
		margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
	},
    formComboBox:{
        height: '50%'
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: '96%',
        maxWidth: '96%',
    },
  
    icon: {
		width: 40
	},
}));


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

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

const conceptos = ['CORTE DE CAJA','TRANSFERENCIA DE EFECTIVO','APORTACION SOCIOS'];

export default function RetiroDeposito({cuenta, setReload, tipo }) {

    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem('turnoEnCurso'));
    const [ CrearMovimientoCuenta ] = useMutation(CREAR_MOVIMIENTO_CUENTA);

    const classes = useStyles();
    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [datosMovimiento, setDatosMovimiento] = useState({});
    const [concepto, setConcepto] = useState("");
    const [usuarioEntrega, setUsuarioEntrega] = useState({});
    const [origen, setOrigen] = useState({});
    const [destino, setDestino] = useState({});
    const [open, setOpen] = useState(false);
    const [fechaMovimientoEntrega, setFechaMovimientoEntrega] = useState("");
    let cajasArray = []; 
    let usuarios = [];
   

    
    const queryObtenerUsuarios =  useQuery(OBTENER_USUARIOS,{
        variables: {
            sucursal: `${sesion.sucursal._id}`,
            empresa: `${sesion.empresa._id}`,
            eliminado: false,
        },
        
         fetchPolicy: "network-only"
    });

    const queryObtenerCajas =  useQuery(OBTENER_CAJAS,{
        variables: {
            sucursal: `${sesion.sucursal._id}`,
            empresa: `${sesion.empresa._id}`,
		},
        
         fetchPolicy: "network-only"
    });

    const handleClickOpen =()=>{
        setOpen(!open);
    };

    const onChangeDatos = (e) => {
    
            setDatosMovimiento({...datosMovimiento, [e.target.name]: e.target.value })
        
       
    };

    const input ={
        tipo_movimiento: datosMovimiento.tipo_movimiento === 'RETIRO' ? 'CUENTA_RETIRO' : 'CUENTA_DEPOSITO',
        id_usuario: sesion._id,
        //rol_movimiento: tipo === true ? "CUENTA-EMPRESA" : "CUENTA",
        rol_movimiento:  "CAJA_PRINCIPAL",
        //numero_caja: turnoEnCurso ? parseInt(turnoEnCurso.numero_caja) : 0,
        //id_Caja: turnoEnCurso ? turnoEnCurso.id_caja : null,
        numero_usuario_creador: sesion.numero_usuario.toString(),
        nombre_usuario_creador: sesion.nombre,
        horario_turno: turnoEnCurso ? turnoEnCurso.horario_turno : '',
        concepto: concepto,
        usuario_entrega: usuarioEntrega._id,
        origen_entrega: origen._id,
        fecha_movimiento_entrega: fechaMovimientoEntrega,
        
        hora_moviento: {
            hora: moment().locale("es-mx").format('hh'),
            minutos: moment().locale("es-mx").format('mm'),
            segundos: moment().locale("es-mx").format('ss'),
            completa: moment().locale("es-mx").format('HH:mm:ss')
        },
        fecha_movimiento: {
            year: moment().locale("es-mx").format('YYYY'),
            mes: moment().locale("es-mx").format('MM'),
            dia: moment().locale("es-mx").format('DD'),
            no_semana_year: moment().locale("es-mx").week().toString(),
            no_dia_year: moment().locale("es-mx").dayOfYear().toString(),
            completa: moment().locale('es-mx').format()
        },
        montos_en_caja: {
            monto_efectivo: {
                monto: (datosMovimiento.tipo_movimiento === 'RETIRO') ? parseFloat(datosMovimiento.cantidad * -1) : parseFloat(datosMovimiento.cantidad),
                metodo_pago: "01"
            },
            monto_tarjeta_debito: {
                monto: 0,
                metodo_pago: "28"
            },
            monto_tarjeta_credito: {
                monto: 0,
                metodo_pago: "04"
            },
            monto_creditos: {
                monto: 0,
                metodo_pago: "99"
            },
            monto_monedero: {
                monto: 0,
                metodo_pago: "05"
            },
            monto_transferencia: {
                monto: 0,
                metodo_pago: "03"
            },
            monto_cheques: {
                monto: 0,
                metodo_pago: "02"
            },
            monto_vales_despensa: {
                monto: 0,
                metodo_pago: "08"
            },
        },
        comentarios: datosMovimiento.comentarios,
    };

    const enviarDatos = async () => { 
        try {

            if(datosMovimiento.tipo_movimiento !== 'RETIRO'){
                if (concepto  === ''|| !usuarioEntrega || fechaMovimientoEntrega === '' || !origen || !datosMovimiento.tipo_movimiento || !datosMovimiento.cantidad ) {
                
                   
                    setAlert({
                        message: 'Por favor complete los datos',
                        status: "error",
                        open: true,
                    });
                    return null;
                }
            }else{
                if (concepto  === ''|| !usuarioEntrega ||   !datosMovimiento.tipo_movimiento || !datosMovimiento.cantidad ) {
            
                    
                    setAlert({
                        message: 'Por favor complete los datos',
                        status: "error",
                        open: true,
                    });
                    return null;
                } 
            }
           
            const movimiento = await CrearMovimientoCuenta({
                variables: {
                    input,
                    empresa: sesion.empresa._id,
                    sucursal: sesion.sucursal._id,
                    tipo: tipo
                }
            });
            //refetch();
            
            setDatosMovimiento({}); 
            handleClickOpen();
            setAlert({
                message: movimiento.data.crearMovimientoCuenta.message,
                status: "success",
                open: true,
            });
            setReload(true);
        } catch (error) {
            console.log(error)
            setAlert({
                message: error.message,
                status: "error",
                open: true,
            });
            setDatosMovimiento({}); 
            handleClickOpen();
             /*  if (error.networkError.result) {
                console.log(error.networkError.result.errors);
              } else if (error.graphQLErrors) {
                console.log(error.graphQLErrors.message);
              } */
        }
    }

    const handleChangeConcepto = (event) => {
        try {    
            let con = event.target.value;  
            setConcepto(con);    
        } catch (error) {
            //console.log(error)
        }
      
    };
    const handleChangeUsuarioEntrega = (event) => {
        try {    
            let usu = event.target.value;  
            setUsuarioEntrega(usu);    
        } catch (error) {
            //console.log(error)
        }
      
    };
    const handleChangeOrigen = (event) => {
        try {    
            let ori = event.target.value;  
            setOrigen(ori);    
        } catch (error) {
            //console.log(error)
        }
      
    };
    const handleChangeDestino = (event) => {
        try {    
            let des = event.target.value;  
            setDestino(des);    
        } catch (error) {
            //console.log(error)
        }
      
    };
    const handleChangeFechaMovimiento = (event) => {
        try {    
            let fecMov = event.target.value;  
            setFechaMovimientoEntrega(fecMov);    
        } catch (error) {
            //console.log(error)
        }
      
    };

    
    if(queryObtenerUsuarios.data){
        try {
             usuarios = queryObtenerUsuarios.data.obtenerUsuarios;
        } catch (error) {
            console.log(error)
        }
       
    }

    if(queryObtenerCajas.data){
        try {
           
            cajasArray = queryObtenerCajas.data.obtenerCajasSucursal;
        } catch (error) {
            console.log(error)
        }
       
    }
   

    
    return (
        <Fragment>
          <SnackBarMessages alert={alert} setAlert={setAlert} />
            <Button  onClick={handleClickOpen}>
				<Box display="flex" flexDirection="row">
                    Realizar movimiento
                    <Box display="flex" alignItems="flex-end">
                        
                        <img src={RetirosIcon} alt="icono retiro" className={classes.icon} />
                    </Box>
                </Box>    
					
			
			</Button>
            <Dialog
                open={open} 
				TransitionComponent={Transition} 
				maxWidth="sm"
				fullWidth
            >
                <DialogContent>
                  
                    <Box textAlign={'center'} p={1}>
                        <Typography variant='h5'>
                            Movimiento en caja principal
                        </Typography>
                    </Box>
                    <div className={classes.formInputFlex}>
                        <Box width="100%">
                            <Typography>Recibe</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name="usuario"
                                variant="outlined"
                                disabled={true}
                                value={sesion?.nombre}
                            />
                        </Box>
                        <Box width="100%" >
                            <Typography>Fecha y hora</Typography>
                            <TextField
                                fullWidth
                                disabled={true}
                                size="small"
                                value={moment().locale("es-mx").format('D MMMM YYYY, h:mm:ss')}
                                name="fecha_movimiento"
                                variant="outlined"

                            />
                        </Box>
                    </div>
                    <div className={classes.formInputFlex}>
                        <Box width="50%">
                            <Typography>Movimiento a Realizar</Typography>
                            <Select
                                className={classes.formComboBox}    
                                size="small"
                                variant="outlined"
                                name="tipo_movimiento"
                                onChange={onChangeDatos}
                                fullWidth
                            >
                                <MenuItem value='DEPOSITO'>Depósito</MenuItem>
                                <MenuItem value='RETIRO'>Retiro</MenuItem>
                            </Select>
                        </Box>
                        <Box width="50%">
                            <Typography>Cantidad</Typography>
                            <TextField
                              
                                fullWidth
                                onChange={onChangeDatos}
                                size="small"
                                
                                InputProps={{type:'number'}}
                                name="cantidad"
                                variant="outlined"
                            />
                        </Box>
                    </div>
                    {
                        (datosMovimiento.tipo_movimiento) ? 
                              
                            (datosMovimiento.tipo_movimiento === 'DEPOSITO') ? 
                                <div>
                                    <div className={classes.formInputFlex}>
                                        <Box style={{width:'50%'}}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="concepto-label">Concepto</InputLabel>
                                                <Select
                                                labelId="concepto-label"
                                                id="concepto-name"
                                                value={(concepto) ? concepto : ""}
                                                onChange={handleChangeConcepto}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                                >
                                                {conceptos.map((concepto, index) => {
                                                
                                                    return(
                                                    <MenuItem key={index} value={concepto} >
                                                        {concepto}
                                                    </MenuItem>
                                                    )})
                                                }
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box style={{width:'50%'}}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="entrega-label">Quién entrega</InputLabel>
                                                <Select
                                                labelId="entrega-label"
                                                id="entrega-name"
                                                value={(usuarioEntrega) ? usuarioEntrega : ""}
                                                onChange={handleChangeUsuarioEntrega}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                                >
                                                {usuarios.map((usuario) => {
                                                
                                                    return(
                                                    <MenuItem key={usuario._id} value={usuario} >
                                                        {usuario.nombre}
                                                    </MenuItem>
                                                    )})
                                                }
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        </div>
                                        <div className={classes.formInputFlex}>
                                        <Box style={{width:'50%'}}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="origen-label">Origen</InputLabel>
                                            <Select
                                            labelId="origen-label"
                                            id="origen-name"
                                            value={(origen) ? origen : ""}
                                            onChange={handleChangeOrigen}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            >
                                            {
                                                cajasArray.map((caja) => {
                                                    
                                                    return(
                                                        <MenuItem key={caja._id} value={caja} >
                                                        Caja {(caja.principal) ? 'principal': caja.numero_caja}
                                                        </MenuItem>
                                                    )})
                                            }
                                            </Select>
                                        </FormControl>
                                        </Box>
                                        <Box style={{width:'50%'}}>
                                        <Typography>
                                            <b>Fecha Movimiento :</b>
                                        </Typography>
                                        <Box display="flex">
                                            <TextField
                                                fullWidth
                                                type="date"
                                                onChange={handleChangeFechaMovimiento}
                                                size="small"
                                                name="fecha_movimiento"
                                                variant="outlined"
                                            />
                                        </Box>
                                        </Box>
                                    </div>
                                </div>
                                
                            :
                                <div className={classes.formInputFlex}>
                                    <Box style={{width:'50%'}}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="concepto-label">Concepto</InputLabel>
                                            <Select
                                            labelId="concepto-label"
                                            id="concepto-name"
                                            value={(concepto) ? concepto : ""}
                                            onChange={handleChangeConcepto}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            >
                                            {conceptos.map((concepto, index) => {
                                            
                                                return(
                                                <MenuItem key={index} value={concepto} >
                                                    {concepto}
                                                </MenuItem>
                                                )})
                                            }
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box style={{width:'50%'}}>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="origen-label">Destino</InputLabel>
                                            <Select
                                            labelId="origen-label"
                                            id="origen-name"
                                            value={(destino) ? destino : ""}
                                            onChange={handleChangeDestino}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            >
                                            <MenuItem key='cuentaEfectivoEmpresa' value="Cuenta efectivo empresa">
                                               Cuenta efectivo empresa
                                            </MenuItem>
                                            {
                                                cajasArray.map((caja) => {
                                                    
                                                    return(
                                                        <MenuItem key={caja._id} value={caja} >
                                                        Caja {caja.numero_caja}
                                                        </MenuItem>
                                                    )})
                                            }
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>                    
                        :
                        <div/>
                    }
                    
                    <div className={classes.formInputFlex}>

                        
                        <Box width="100%">
                            <Typography>Comentarios</Typography>
                            <TextField
                                className={classes.input}
                                fullWidth
                                onChange={onChangeDatos}
                                size="small"
                                multiline
                                rows={2}
                                name="monto_movimiento"
                                variant="outlined"
                            />
                        </Box>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant='outlined'
                        onClick={handleClickOpen}
                        size="large"
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        variant='outlined'
                        onClick={enviarDatos}
                        size="large"
                    >
                        Realizar
                    </Button>
                   
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}
