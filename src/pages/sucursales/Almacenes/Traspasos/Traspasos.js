import React, { forwardRef, useEffect, useContext, useState,useCallback } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Slide,
         Button, Box, Dialog, Grid, DialogActions, TextField,Divider,
         InputLabel, Select, Input, MenuItem, FormControl, useTheme, OutlinedInput, InputAdornment,
         Stepper, Step, StepLabel, DialogTitle } from '@material-ui/core';
import { Search } from "@material-ui/icons";
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import 'moment/locale/es';
import { useDebounce } from 'use-debounce';
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import {Close} from '@material-ui/icons';
//import ErrorPage from '../../../../components/ErrorPage';
import SnackBarMessages from '../../../../components/SnackBarMessages';

import { FcAdvance } from 'react-icons/fc';
import almacenIcon from '../../../../icons/almacen.svg';
import TableSelectProducts from '../../../../components/Traspasos/TableSelectProducts';

import { useQuery, useMutation } from '@apollo/client';
import { OBTENER_CONCEPTOS_ALMACEN} from '../../../../gql/Catalogos/conceptosAlmacen';
import { OBTENER_ALMACENES, REALIZAR_TRASPASO, OBTENER_CATEGORIAS, OBTENER_PRODUCTOS_EMPRESA} from '../../../../gql/Almacenes/Almacen';

import { OBTENER_PRODUCTOS } from "../../../../gql/Catalogos/productos";


import { TraspasosAlmacenContext } from "../../../../context/Almacenes/traspasosAlmacen";

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
    icon: {
		fontSize: 50
	},
    imagen: {
        width: 50
    },
    formInputFlex: {
		display: 'flex',
		'& > *': {
			margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`
		},
		'& span': {
			color: 'red'
		}
	},
    subtitle: {
		marginLeft: '10px',
		width:'50%',
     
	},
    boxUpData:{
        height: 80,

    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 300,
    },
    selected2:{
		width: '50%',
		height: 50,
		
    },
    selected:{
		width: '50%',
		height: 50,
		
    },
    input:{
		width:'100%'	
	},
    inputBox:{
		margin:20,
        marginTop:5,
        marginBottom:10,
       
	},
    button:{
		margin: theme.spacing(3),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(0)
	},
    boxControl: {
        margin: theme.spacing(2.5),
		marginTop: 0,
        minWidth: "20%",
        maxWidth: "20%",
        minHeight: 20,
      
    },
    centerControl:{
        marginTop:10,
      
    },
  
}));


function getStyles(almacen, almacenName, theme) {
  return {
    fontWeight:
      almacenName.indexOf(almacen) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Transition = forwardRef(function Transition(props, ref) {
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


const transportes = [
    'Barco',
    'Moto',
    'Carro',
    'Camioneta'
];

/* function createData(name, cantidad, precio, unidad) {
    return { name, cantidad, precio, unidad };
}  */


const steps = ['Datos traspaso', 'Seleccionar productos'];

export default function Traspasos(props) {
    const classes = useStyles();
    const theme = useTheme();
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));

    const {
        setProductos,
        setProductosTras,
        setProductosTo,
        setProductosEmpTo,
        productosTras 
    } = useContext(TraspasosAlmacenContext);

    const [ alert, setAlert ] = useState({ message: '', status: '', open: false });
	const [ open, setOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ filtro, setFiltro ] = useState('');
	const [value] = useDebounce(filtro, 700);

    const [ haveConcepto, setHaveConcepto ] = useState(false);
    const [ conceptoTraspaso, setConceptoTraspaso ] = useState(null);
    const [ isAlmacenOrigen, setIsAlmacenOrigen ] = useState(false);
    const [ isAlmacenDestino, setIsAlmacenDestino ] = useState(false);

    const [ almacenOrigen, setAlmacenOrigen ] = useState(null);
    const [ almacenDestino, setAlmacenDestino ] = useState(null);
    const [almacenesDestino, setAlmacenesDestino] =useState([])
    const [ transporte, setTransporte ] = useState('');
    const [ placas, setPlacas ] = useState('');
    const [ nombreQuien, setNombreQuien ] = useState('');
  
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [openEnd, setOpenEnd] = useState(false);
 
    const [ CrearTraspaso ] = useMutation(REALIZAR_TRASPASO); 

    let conceptos= [];
    let almacenes = [];
    
    
    const queryObtenerAlmacenes = useQuery(OBTENER_ALMACENES,{
        variables: {
            id: sesion.sucursal._id
        },
         fetchPolicy: "network-only"
    });	
   /*  const productosAlmacenQuery = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			filtro: value
		}
	});	 */
	const dataConceptos = useQuery(OBTENER_CONCEPTOS_ALMACEN,{
		variables: {
			empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id
		},
         fetchPolicy: "network-only"
	});
   
    const categoriasQuery = useQuery(OBTENER_CATEGORIAS,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,	
		},
        fetchPolicy: "network-only"
	});

    const productosQuery = useQuery(
    OBTENER_PRODUCTOS,
    {
      variables: { 
          empresa: sesion.empresa._id, 
          sucursal: sesion.sucursal._id,
          filtro: value,
          almacen: (almacenOrigen ) ? almacenOrigen._id : "",
          existencias: true,
          limit: props.limit,
          offset: props.pageAlm,
      },
      fetchPolicy: "network-only"

    }
  );

    const productosEmpresaQuery = useQuery(
    
        OBTENER_PRODUCTOS_EMPRESA,
    {
        variables: { 
          empresa: sesion.empresa._id, 
          filtro: value,
          limit: props.limit,
          offset: props.page,
        },
        fetchPolicy: "network-only"
     }
  );
    
    /* const obtenerAlmacenes= useCallback( () =>{
        try {
            console.log('obtenerAlmacenes')
            
        } catch (error) {
           console.log(error)
        }   
    },[]); */ 
    const setValueFilter = (val) =>{
       
        setFiltro(val);
        props.setPage(0);
    }

    const obtenerProductosAlmacen = useCallback(async() =>{
        try {
            
           productosQuery.refetch();
        } catch (error) {
            
        }   
    },[productosQuery]);
    
   
    
    useEffect(() => {
        if(almacenOrigen){
          
            setAlmacenesDestino(queryObtenerAlmacenes.data.obtenerAlmacenes.filter(element => element._id !== almacenOrigen._id));
            obtenerProductosAlmacen();
        }
    }, [almacenOrigen ])


    const obtenerProductosEmpresa = useCallback(async () =>{
        try {
             productosEmpresaQuery.refetch();
        } catch (error) {
            console.log('errorObtenerProductosEmpresa',error)
        }   
      },[productosEmpresaQuery]);

   

    useEffect(() => {
        try {
            if(conceptoTraspaso!== null){
                if(conceptoTraspaso.origen === 'N/A'){
                    obtenerProductosEmpresa();
                } else{
                    obtenerProductosAlmacen();
                }      
            }
        } catch (error) {
            console.log('conceptoTraspaso', error)
        }
       
    }, [conceptoTraspaso])    

 /*    useEffect(() => {
			dataConceptos.refetch();
	},[ dataConceptos ]);  */

     useEffect(() => {
        
        if(conceptoTraspaso !== null){
            if(conceptoTraspaso.destino === 'N/A'){
                if(almacenOrigen !== null){
                    setHaveConcepto(true)
                }else{
                     setHaveConcepto(false)
                }
            
            }else{
                if(conceptoTraspaso.origen === 'N/A'){
                    if(almacenDestino !== null){
                        setHaveConcepto(true);
                    }else{
                        setHaveConcepto(false);
                    } 
                }else{
                    if(almacenOrigen !== null && almacenDestino !== null){
                        setHaveConcepto(true);
                    }else{
                        setHaveConcepto(false);
                    } 
                }
                
            }    
        }
       
	},[conceptoTraspaso, almacenOrigen, almacenDestino ]); 

    

     
    useEffect(
		() => {
			 if(productosEmpresaQuery.data){
               
                //setProductos(productosEmpresaQuery.data.obtenerProductosPorEmpresa);
             
                setProductosEmpTo(productosEmpresaQuery.data.obtenerProductosPorEmpresa);
            }
    },[ productosEmpresaQuery.data, setProductosEmpTo ]);  


    useEffect(
		() => {
            if(productosQuery.data ){
                setProductos(productosQuery.data.obtenerProductos);
                setProductosTo(productosQuery.data.obtenerProductos)
            }    
		},
		[ productosQuery ]
	); 
    
    useEffect(
		() => {
			setLoading(true);
			categoriasQuery.refetch();
			setLoading(false);
		},
		[ categoriasQuery ]
	); 
  

   
    
	const handleClickOpen = () => {
		setOpen(true);
        productosEmpresaQuery.refetch();  
        productosQuery.refetch();   
        dataConceptos.refetch();   
        queryObtenerAlmacenes.refetch(); 
        props.productosAlmacenQuery.refetch();
	};

	const handleClose = () => {
		setOpen(false);
        setProductosTras([]);
        setAlmacenOrigen(null);
        setAlmacenDestino(null);
        setConceptoTraspaso(null);
        props.setPage(0);
        props.setPageAlm(0);
        let newSkipped = skipped;
       
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        setActiveStep((prevActiveStep) => 0);
	};

     const handleChange = (event) => {
       
        setAlmacenOrigen(event.target.value);
       /*   productosQuery.refetch({
            variables: { 
            
                almacen: event.target.value._id,
                existencias: true
            },
        });  */
        setProductosTras([]);
        return;
    };

    const handleChangeDestino = (event) => {
        //console.log(event)
        setAlmacenDestino(event.target.value);
        setProductosTras([]);
        return;
    };

     const handleChangeConcepto = (event) => {
        try {
            
            let concepto = event.target.value;  
            setAlmacenesDestino([]);
            almacenes = [];
            setAlmacenOrigen(null); 
            setAlmacenDestino(null);
            if(concepto.origen === 'N/A'){
                setAlmacenesDestino( queryObtenerAlmacenes.data.obtenerAlmacenes)
            }else{
                setAlmacenesDestino([])
            }
          
            setIsAlmacenOrigen((concepto.origen === 'N/A') ? false:true);
            setIsAlmacenDestino((concepto.destino === 'N/A') ? false:true);
           
            setConceptoTraspaso(concepto);    
        } catch (error) {
            //console.log(error)
        }
      
    };
    
      const handleChangeTransporte = (event) => {
        setTransporte(event.target.value);
    };

    /* const isStepOptional = (step) => {
        return step === 1;
    }; */

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        /* if(conceptoTraspaso === null ) {setAlert({message:'No es posible continuar sin seleccionar un concepto.', status: 'error', open: true });  return}
        if( isAlmacenOrigen && almacenOrigen === null)  {setAlert({message:'No es posible continuar sin seleccionar un almacén origen.', status: 'error', open: true });  return }   
        if(isAlmacenDestino && almacenDestino === null) { setAlert({message:'No es posible continuar sin seleccionar un almacén destino.', status: 'error', open: true }); return}    */
        
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        
    };

    const handleBack = () => {
        props.setPage(0);
        props.setPageAlm(0);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /* const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
        // You probably want to guard against something like this,
        // it should never occur unless someone's actively trying to break something.
        throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    }; */


   /*  if(categoriasQuery.data){
		categorias = categoriasQuery.data.obtenerCategorias;
	}  */
   
    if(dataConceptos.data){
		conceptos = dataConceptos.data.obtenerConceptosAlmacen;
	}

    if(queryObtenerAlmacenes.data){
        almacenes = queryObtenerAlmacenes.data.obtenerAlmacenes;
       
    }

   
   
   /*  const filtrarProductos = (event) => {
        event.preventDefault();
        if(almacenOrigen !== ''){
            productosQuery.refetch();
        }else{
            productosEmpresaQuery.refetch();
        }
    }; */

    const handleModal = () => {
        setOpenEnd(!openEnd)
    }

    const traspasar = async () => {
        try {
         
            if(productosTras.length){
               setOpenEnd(false)
               setLoading(true)
                //let productTrasTo = productosTras;
             const input =  {
                variables: {
                    input: {
                        concepto_traspaso: {
                            _id: conceptoTraspaso._id, 
                            nombre_concepto: conceptoTraspaso.nombre_concepto,
                            destino: conceptoTraspaso.destino,
                            origen: conceptoTraspaso.origen,
                            editable: conceptoTraspaso.editable,
                        },
                        almacen_origen: 
                            (almacenOrigen !== null) ? 
                                {_id: almacenOrigen._id,
                                nombre_almacen: almacenOrigen.nombre_almacen,
                                default_almacen: almacenOrigen.default_almacen }
                            : 
                                {_id:"",
                                nombre_almacen: "",
                                default_almacen: false }
                        ,
                        almacen_destino: 
                            (almacenDestino !== null) ?  
                            {_id: almacenDestino._id,
                            nombre_almacen: almacenDestino.nombre_almacen,
                            default_almacen: almacenDestino.default_almacen }
                        : 
                            {_id:"",
                            nombre_almacen: "",
                            default_almacen: false }
                        ,
                        productos: productosTras,
                        datos_transporte :{
                            transporte: transporte,
                            placas: placas,
                            nombre_encargado: nombreQuien
                        },
                        sucursalOrigen: sesion.sucursal._id,
                        sucursalDestino: sesion.sucursal._id,
                        fecha_registro: moment().locale("es-mx").format()
                    },
                    usuario: sesion._id,
                    empresa: sesion.empresa._id
                }
            }  
            
             const traspaso =    await CrearTraspaso(input) 
           
                //console.log(traspaso)
               
                if(traspaso.data.crearTraspaso.resp !== 'error'){
                    props.productosAlmacenQuery.refetch();
                    setAlert({message: traspaso.data.crearTraspaso.message, status: traspaso.data.crearTraspaso.resp, open: true })
                    setProductosTras([]);
                    setAlmacenOrigen(null);
                    setAlmacenDestino(null);
                    setConceptoTraspaso(null);
                    handleBack();
                }
                
            }else{
                
                setAlert({message:'No es posible realizar un traspaso sin agregar productos.', status: 'error', open: true })
           
            }
            
           
           
            setLoading(false);
        } catch (error) {
             setLoading(false);
             setOpenEnd(false)
          
           if(error.networkError !== undefined){
			  console.log('traspaso networkError', error.networkError.result)
            }else if(error.graphQLErrors!== undefined){
                console.log('traspaso graphQLErrors', error.graphQLErrors)
            }else{
             
              
            }
             setAlert({message: 'Ocurrió un error al realizar el traspaso...', status: 'error', open: true })
        }
    }

   

    return (
        <>
        <Box sx={{ width: '100%',  }}>
            <Button fullWidth onClick={handleClickOpen}>
                <Box display="flex" flexDirection="column">
                    <Grid container justifyContent="center">
                        <Grid item xs={12} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <FcAdvance className={classes.icon} />  
                            </Box>
                        </Grid>
                        <Grid item md={6} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img src={almacenIcon} alt="icono almacen" className={classes.imagen}/>
                            </Box>
                        </Grid>
                        <Grid item md={6} >
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img src={almacenIcon} alt="icono almacen" className={classes.imagen} />
                            </Box>
                        </Grid>
                    </Grid>
                    Traspasos
                </Box>
					
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition} >
                <BackdropComponent loading={loading} setLoading={setLoading} />
                <AppBar className={classes.appBar}>
               
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
                                Traspasos
						</Typography>
						<Box mx={3}>
                            <Box m={1}>
                                <Button  variant="contained" color="secondary"onClick={handleClose}>
                                    <Close style={{ fontSize: 30}}/>
                                </Button>
                            </Box>
                        </Box>
                    
					</Toolbar>
				</AppBar>
                <Box style={{ width: '50%',alignSelf:'center', alignContent:'center', alignItems:'center' }}>
                  
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                    
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                </Box>
                <Box >
                {
                (activeStep === 0) ? 
                    <Grid container  justify="center" >
                        <Grid item lg={7}>
                            <Box>
                                <Box >
                                    <Typography className={classes.subtitle}  >
                                        <b>Datos traspaso</b>
                                    </Typography>
                                    <Divider />
                                
                                    <Box mt={2} style={{display: 'flex', width:'100%', justifyContent: 'center' }}>
                                        <Box m={2}>
                                            <Typography><b>Usuario</b></Typography>
                                            <Typography> {sesion.nombre} </Typography>
                                        </Box>
                                        <Box m={2}>
                                            <Typography><b>Sucursal</b></Typography>
                                            <Typography> {sesion.sucursal.nombre_sucursal} </Typography>
                                        </Box>
                                        <Box m={2}>
                                            <Typography><b>Fecha</b></Typography>
                                            <Typography> 	{moment().locale("es-mx").format('MM/DD/YYYY')} </Typography>
                                        </Box>
                                    
                                    </Box>
                                    <Box m={1}   style={{width:'100%', justifyContent: 'center'}}>
                                        <Box style={{width:'100%'}}>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="concepto-label">Concepto traspaso</InputLabel>
                                                <Select
                                                labelId="concepto-label"
                                                id="concepto-name"
                                                value={(conceptoTraspaso) ? conceptoTraspaso : ""}
                                                onChange={handleChangeConcepto}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                                >
                                                {conceptos.map((concepto) => {
                                                
                                                    return(
                                                    <MenuItem key={concepto._id} value={concepto} >
                                                        {concepto.nombre_concepto}
                                                    </MenuItem>
                                                    )})
                                                }
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    {
                                        (conceptoTraspaso !== null) ? 
                                        <Box style={{display: 'flex'}}>
                                            {   
                                                
                                                (isAlmacenOrigen) ?
                                                <Box> 
                                                    <FormControl className={classes.formControl}>
                                                        <InputLabel id="almacen-origen-label">Almacén origen</InputLabel>
                                                        <Select
                                                        labelId="almacen-origen-label"
                                                        id="almacen-origen-name"
                                                        value={(almacenOrigen) ? almacenOrigen : ""}
                                                        onChange={handleChange}
                                                        input={<Input />}
                                                        MenuProps={MenuProps}
                                                        >
                                                        {almacenes.map((almacen) => (
                                                            <MenuItem key={almacen._id} value={almacen}>
                                                                {almacen.nombre_almacen}
                                                            </MenuItem>
                                                        ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                :
                                                <></>
                                            }
                                            
                                            {
                                                (isAlmacenDestino) ? 
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="almacen-destino-label">Almacén destino</InputLabel>
                                                    <Select
                                                    labelId="almacen-destino-label"
                                                    id="almacen-destino-name"
                                                    value={(almacenDestino) ? almacenDestino : ""}

                                                    onChange={handleChangeDestino}
                                                    input={<Input />}
                                                    MenuProps={MenuProps}
                                                    >
                                                    {almacenesDestino.map((almacen) => (
                                                        <MenuItem key={almacen._id} value={almacen} >
                                                        {almacen.nombre_almacen}
                                                        </MenuItem>
                                                    ))}
                                                    </Select>
                                                </FormControl>

                                                :
                                                <></>
                                            }
                                           
                                        </Box> 
                                        :
                                        <></>
                                        
                                    } 
                                    
                                    </Box>   
                                </Box>      
                                <Box className={classes.centerControl}   style={{width:'100%'}} >
                                    <Typography className={classes.subtitle}>
                                        <b>Datos transporte traspaso</b>
                                    </Typography>
                                    <Divider />
                                
                                    <Grid  justify="center" >
                                        
                                        <FormControl className={classes.formControl} style={{marginTop:15}}>
                                            
                                            <InputLabel id="transporte-label">Transporte</InputLabel>
                                            <Select
                                            labelId="transporte-label"
                                            id="transporte-name"
                                            value={transporte}
                                            onChange={handleChangeTransporte}
                                            input={<Input />}
                                            
                                            MenuProps={MenuProps}
                                            >
                                            {transportes.map((trans) => (
                                                <MenuItem key={trans} value={trans} style={getStyles(trans, transporte, theme)}>
                                                {trans}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                            
                                        </FormControl>
                                        <Box  justify="center" >
                                        <FormControl className={classes.formControl}>
                                        
                                            <Typography>
                                                Placas
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                className={classes.input}
                                                type="text"
                                                size="small"
                                                name="placas"
                                                variant="outlined"
                                                value={placas.toUpperCase()}
                                                
                                                onChange={(e) => setPlacas(e.target.value)}
                                            />
                                        
                                        </FormControl>
                                        <FormControl className={classes.formControl}>
                                        
                                            <Typography>
                                                Nombre de encargado de transporte
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                className={classes.input}
                                                type="text"
                                                size="small"
                                                name="nombreQuien"
                                                variant="outlined"
                                                value={nombreQuien}
                                                
                                                onChange={(e) => setNombreQuien(e.target.value)}
                                            />
                                        </FormControl>
                                        </Box>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                : 
                    <Box>
                        <Box ml={1} style={{width:'100%'}}  >
                            <Box ml={2}>
                            <Typography className={classes.subtitle}>
                                <b>Buscar producto</b>
                            </Typography>
                            <Box  style={{ width: "48%" }}>
                                
                                <FormControl variant="outlined" fullWidth size="small">
                                    <OutlinedInput
                                        id="search-producto"
                                        type="text"
                                        value={filtro}
                                        onChange={(e) => setValueFilter(e.target.value)}
                                        endAdornment={
                                        <InputAdornment position="start">
                                            <IconButton
                                            type="submit"
                                            aria-label="search producto"
                                            edge="end"
                                            >
                                            <Search />
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                    
                                
                            </Box>
                            </Box>
                            <Box  mt={1}>
                                <Grid container spacing={2} style={{width:'100%'}}>
                                    <Grid item md={6}>
                                    {
                                        (isAlmacenOrigen) ? 
                                    
                                        <TableSelectProducts title='Productos' add={true} almacenOrigen={almacenOrigen} refetch ={productosQuery.refetch} loading={productosQuery.loading} setAlert={setAlert} pageAlm={props.pageAlm}
                                        setPageAlm={props.setPageAlm } limit={props.limit}
                                        />
                                        :
                                        <TableSelectProducts title='Productos' add={true} almacenOrigen={null} refetch ={productosQuery.refetch}setAlert={setAlert} page={props.page}loading={productosQuery.loading} 
                                        setPage={props.setPage}limit={props.limit}
                                        />   
                                    }
                                    </Grid>
                                    <Grid item md={6}>
                                        <TableSelectProducts title='Productos a traspasar' add={false} almacenOrigen={almacenOrigen} refetch ={productosQuery.refetch} setAlert={setAlert}/>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                }
                
                   <DialogActions style={{justifyContent:'center'}}>
                    <Box sx={{ flexDirection: 'row',alignSelf: 'center',  width: '30%',display: 'flex', pt: 0 }} >
                            <Button
                            color="primary"
                            variant="contained"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            style={{width:'43%'}}
                            sx={{ mr: 1 }}
                            >
                            Atrás
                            </Button>
                            <Box style={{ flex: '1 1 auto' }} />
                            {/*     {isStepOptional(activeStep) && (
                                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    Skip
                                </Button>
                                )} */}
                            
                                <Button color="primary" variant="contained"    style={{width:'43%'}} disabled={!haveConcepto} onClick={() => (activeStep < steps.length -1) ? handleNext() : handleModal()}>
                                    {activeStep < steps.length -1   ? 'Siguiente' : 'Terminar'}
                                </Button>
                        
                        </Box>
                   </DialogActions>    
                </Box>
                <Dialog open={openEnd} onClose={handleModal}>
                    <DialogTitle>{'¿Está seguro de realizar este traspaso?'}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => handleModal()} color="primary">
                            Cancelar
                        </Button>
                        <Button color="secondary" autoFocus variant="contained" onClick={() => traspasar()}>
                            Traspasar
                        </Button>
                    </DialogActions>
                </Dialog>
               
	        <SnackBarMessages alert={alert} setAlert={setAlert} />  
            
			</Dialog>
            
               
        </Box>
        </>
    )
}