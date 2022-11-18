import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid,Box, TextField } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination} from '@material-ui/core';
import {Toolbar, Typography, Paper, IconButton, Tooltip, Dialog, Checkbox ,Slide, Button, DialogTitle, DialogActions} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close'; 
import CircularProgress from '@material-ui/core/CircularProgress';

import { TraspasosAlmacenContext } from "../../context/Almacenes/traspasosAlmacen";
import TallasColoresTraspasos from './TallasColoresTraspasos';
import TableSelectMedidas from './TableSelectMedidas';
import { useQuery } from '@apollo/client';
import {  OBTENER_CONSULTAS } from "../../gql/Catalogos/productos";
import SnackBarMessages from '../../components/SnackBarMessages';
// function createData(name, cantidad, precio) {
//   return { name, cantidad, precio };
// }

/* function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
} */

/* function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
} */

const headCells = (add) => {

let hC = (add) ? 

  [
    { id: 'codeBarras', numeric: false, disablePadding: false, label: 'Código de barras' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'tipo', numeric: true, disablePadding: false, label: 'Tipo' },
    { id: 'cantidad', numeric: true, disablePadding: false, label: 'Cantidad' },

  ]
  :

  [
    { id: 'codeBarras', numeric: false, disablePadding: false, label: 'Código de barras' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Nombre' },
    { id: 'tipo', numeric: true, disablePadding: false, label: 'Tipo' },
    { id: 'cantidad', numeric: true, disablePadding: false, label: 'Cantidad' },
    { id: 'solo', numeric: true, disablePadding: false, label: ' ' },
  ]

  return hC;
}
;
const getUnidadMax  = (cantidad_existente_maxima,unidadMaxima) => {
  //console.log('getCantidad',cantidad_nueva, cantidad_medida, accion)
  const UNIDAD_MAXIMA = {
    'Caja' :  'Cantidad existente en cajas: ' + cantidad_existente_maxima,
    'Costal' : 'Cantidad existente en costales: ' + cantidad_existente_maxima,
  }  
  return UNIDAD_MAXIMA[unidadMaxima];
}

const  EnhancedTableHead = (props) => {
  const { classes,  order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const headCellsNames =  headCells(props.add);
  return (
    <TableHead>
      <TableRow>
     
        {headCellsNames.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  // product_selected: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
   
  },
  input:{
    width:180
  }
  ,
  inputCantidad:{
    width:120,
    height:10
  },
  inputCantidadTable:{
    width:'20%',
    height:10
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    fontSize:16,
    flex: '1',
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const DialogTallas = (props) => {
 
  const [new_medidas, setNew_medidas] = useState([]);
  const {setProductosTras, productosTras} = useContext(TraspasosAlmacenContext);
  

  
  const setProd = () =>{
    let newMedidasCopy = new_medidas;
    let cantidad_total = 0;
    
    

     try {
     
       let prodSelect = null;
    prodSelect = (props.almacenOrigen !== null) ? {
      _id: props.product_selected._id,
      datos_generales:  props.product_selected.datos_generales,
      medidas_producto: props.product_selected.medidas_producto,
      inventario_general: props.product_selected.inventario_general,
      unidades_de_venta: props.product_selected.unidades_de_venta,
      precios: props.product_selected.precios,
      empresa:props.product_selected.empresa,
      sucursal:props.product_selected.sucursal,
      usuario: props.product_selected.usuario
    }
    :

    {
       _id: props.product_selected._id,
      datos_generales:  props.product_selected.datos_generales,
      precios: props.product_selected.precios,
       medidas_producto: [],
      inventario_general: [{unidad_maxima:''}],
      unidades_de_venta: [],
      empresa:props.product_selected.empresa,
      sucursal:props.product_selected.sucursal,
      usuario: props.product_selected.usuario 
    }; 

    let existe = false;
    let copyProductosTras = productosTras;
    let medidasTo =[];
    //Count all new_medidas from array
    
    if (newMedidasCopy.length > 0) {
    
      const pres = newMedidasCopy.filter(
        (res) => res.medida.color._id && res.medida.medida._id
      );

      if (pres.length !== newMedidasCopy.length) {
        props.setError({
           message: `Faltan medidas o colores en tus presentaciones`,
          status: "error",
          open: true
        });
        
        return;
      }
    }

    for (let newMed in newMedidasCopy){ 
        cantidad_total +=  newMedidasCopy[newMed].nuevaCantidad;
        //cantidad_total += newMedidasCopy[newMed];
      medidasTo.push(newMedidasCopy[newMed])
    } 

    if(cantidad_total > 0){
    
      if(copyProductosTras.length){//Check have data context
        copyProductosTras.forEach(element => {
          if(element.product_selected._id === props.product_selected._id){
            existe = true;
            ///VA A SUMAR EN LAS MEDIDAS LAS CANTIDADES
            element.new_medidas = medidasTo;
            element.cantidad_total = cantidad_total;
            return;
          }
        });
    
        if(!existe){
          //console.log("NO está este producto", element.product_selected._id , props.product_selected._id );
          let obj= {product_selected:prodSelect, new_medidas:medidasTo, cantidad_total:parseInt(cantidad_total), unidad_maxima: false}
          copyProductosTras.push(obj)
      
        } 
      }else{ 
          let obj= {product_selected:prodSelect, new_medidas:medidasTo, cantidad_total:parseInt(cantidad_total), unidad_maxima: false}
          copyProductosTras.push(obj)
      }
         
      setProductosTras([...copyProductosTras])  
      setNew_medidas([]);
      close();
    }else{
      props.setError({
        message: `La cantidad debe ser mayor a 0`,
       status: "error",
       open: true
     });
    }  
     } catch (error) {
       console.log('MANDH',error)
     }
    
  }

  const close= () => {
    try {
      props.setOpenTallas();
      props.setproduct_selected(undefined)
    } catch (error) {
      //console.log(error)
    }
  }
 
  useEffect(() => {
    let new_medidasCopia = [];

    productosTras.forEach(prod => {
		
		if(prod.product_selected._id ===  props.product_selected._id){
			let element = null;
        for (const med in prod.new_medidas) {
          if (Object.hasOwnProperty.call(prod.new_medidas, med)) {
            element = prod.new_medidas[med];
            new_medidasCopia.push(element)
          }
        }
      }
    })  
    setNew_medidas(new_medidasCopia);
  }, [productosTras, props.product_selected._id])
     

  return(
    <Dialog open={props.openTallas} TransitionComponent={Transition} fullWidth maxWidth={"md"} >
      	
      <DialogTitle>
        <Box display='flex' >
          <Box width="88%">
            Tallas y medidas
          </Box>
          <Box m={1} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="secondary" onClick={() => close()} size="large">
              <CloseIcon />
            </Button>
          </Box>
        </Box>
      </DialogTitle>
      {
        (props.almacenOrigen === null) ? 
          <div>
            <TallasColoresTraspasos 
              obtenerConsultasProducto={props.obtenerConsultasProducto}
              refetch={props.refetch}
              producto={props.product_selected}
              new_medidas={new_medidas} 
              setNew_medidas={setNew_medidas}
            />
          </div>
        :
        <div>
          <TableSelectMedidas producto = {props.product_selected} new_medidas={new_medidas} setNew_medidas={setNew_medidas} add={props.add} />
        </div> 
      }    
      <Box display="flex" justifyContent="flex-end" m={1} mr={5}>
        <Button  variant="contained" color="primary"style={{width:"20%"}} onClick={setProd} >
          AGREGAR 
        </Button>
      </Box>   
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [cantidadTo, setCantidadTo] = useState('');
  const [openEnd, setOpenEnd] = useState(false);
 
 
  const { product_selected, setproduct_selected, tipoPieza, update } = props;
   const {
        setProductosTras,
        productosTras
    } = useContext(TraspasosAlmacenContext);



const setValueToTrans =(cantidad_total) =>{
  try {
    props.setError({error:false, mensaje:''})
   
    if(cantidad_total === 0 || cantidad_total === '') return;
   let element = productosTras.find(element => element.product_selected._id === product_selected._id);
  /*   let elementTablaTo = (props.almacenOrigen !== null) ? 
        productosEmpTo.find(element => element.product_selected._id === product_selected._id)
        :
        productosTo.find(element => element.product_selected._id === product_selected._id) */
    if(element) {
 //console.log(cantidad_total, element)
      let totalCantExistMasNuevaCantidad = parseFloat(cantidad_total);
      //SUMA CANTIDAD TOTAL
      
      if(props.add){
        if(product_selected.inventario_general !== undefined){
          if( !tipoPieza.piezas ){
            if(totalCantExistMasNuevaCantidad <=  product_selected.inventario_general[0].cantidad_existente_maxima){
              element.cantidad_total = totalCantExistMasNuevaCantidad;
            }else{
              props.setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente del producto seleccionado.'})
            }  
          }else{
            if(totalCantExistMasNuevaCantidad <=  product_selected.inventario_general[0].cantidad_existente){
              element.cantidad_total = totalCantExistMasNuevaCantidad;
            
            }else{
              props.setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente del producto seleccionado.'})
            }
          }
        }else{
          element.cantidad_total = totalCantExistMasNuevaCantidad;
        /*   if(props.add){
            elementTablaTo.inventario_general[0].cantidad_existente -= cantidad_total;
          }else{
            elementTablaTo.cantidad_total -= cantidad_total
          } */

          
        }
      }else{

        element.cantidad_total = parseFloat(cantidad_total);
      }  
      setProductosTras([...productosTras]);
      /*  if(props.almacenOrigen !== null){
           setProductosEmpTo([...productosTras]);
        }else{
           setProductosTo([...productosTras]);
        } */

      return;


    }else{
      //Cuando sea el caso que no hay almacen de origen cambiar los datos que van a ir vacíos
      //
     
      //console.log(props.product_selected.precios)
      let prodSelect = {
        _id: props.product_selected._id,
        datos_generales:  props.product_selected.datos_generales,
        inventario_general: props.product_selected.inventario_general,
        unidades_de_venta: props.product_selected.unidades_de_venta,
        medidas_producto: props.product_selected.medidas_producto,
      
        precios: props.product_selected.precios,
        empresa:props.product_selected.empresa,
        sucursal:props.product_selected.sucursal,
        usuario: props.product_selected.usuario
      } 
    //VERIFICA CANTIDAD MAXIMA
    if(product_selected.inventario_general !== undefined){
      if(cantidad_total <=  product_selected.inventario_general[0].cantidad_existente){
      
        let obj= {product_selected:prodSelect, new_medidas:[], cantidad_total, unidad_maxima: tipoPieza.cajas};
        setProductosTras([...productosTras, obj]);
      }
      else{
        props.setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente.'})
      }
    }else{
       let obj= {product_selected:prodSelect, new_medidas:[], cantidad_total, unidad_maxima: tipoPieza.cajas};
        setProductosTras([...productosTras, obj]);
    }
    }
    setproduct_selected(undefined);
     return;
  } catch (error) {
     //console.log(error)
  }
}

const deletesItems =() =>{
  try {
  
    setproduct_selected(undefined)
    //console.log(prodSet.filter(item => item.product_selected._id !== product_selected._id))
    setProductosTras([]);
    setOpenEnd(false);

  } catch (error) {

  }
}


useEffect(() => {
  try {
    if(props.add){
      props.setOpenTallas(true)
    }
    setCantidadTo(props.cant)
    
  } catch (error) {
    
  }
  
}, [product_selected])   
  
  const pressEnter = (e) => {
    try {
      if (e.key === "Enter") {
        setValueToTrans(parseFloat(e.target.value))
      }
    } catch (error) {
      
    }
  };        


  function onlyNumbers(value){
    props.setError({error:false, mensaje:''})
      //const onlyNums = value.toString().replace(/[^0-9]/g, '');
      const intValue = (value !== '') ? parseFloat(value) : 0;
      try {
        if(props.almacenOrigen !== null){
          
          if( !tipoPieza.piezas  ){
            if(intValue <= product_selected.inventario_general[0].cantidad_existente_maxima){
              setCantidadTo((intValue !== 0) ? intValue : '');
              //console.log(intValue)
              return;
            }else{
              props.setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente.'})
              return;
            } 
          }else{
            
              if(intValue <= product_selected.inventario_general[0].cantidad_existente){
                 setCantidadTo((intValue !== 0) ? intValue : '');
                return;
              }
              else{
              props.setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente.'})
              return;
            } 
            }
          }else{
          
            setCantidadTo(intValue);
            return;
          }
      } catch (error) {
        
      }
    
  }



  const TipoPiezaComponent = () => {
     try {
     
      const TIPO_PIEZA = {
        'Pz' :  {unidad_maxima: null, unidad_minima: 'Pz' },
        'Caja' : {unidad_maxima: 'Caja', unidad_minima: 'Pz' },
        'Kg' : {unidad_maxima: null, unidad_minima: 'Kg' },
        'Costal' : {unidad_maxima: 'Costal', unidad_minima: 'Kg' },
        'Lt' : {unidad_maxima: null, unidad_minima: 'Lt' }
      }
      

    
      return (
        <Box flexDirection={'row'} display="flex">
          <Box flexDirection={'row'}  >
          <Checkbox checked={tipoPieza.piezas}   color="primary" onChange={() => {update(); setCantidadTo(0)}} disabled={TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_maxima === null} />
            <Typography color="primary" style={{marginLeft:10}}>{TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_minima}</Typography> 
          </Box>
    
          
        { 
          (TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_maxima !== null) ? 
            <Box flexDirection={'row'} >
              <Checkbox checked={tipoPieza.cajas} color="primary" onChange={() => {update(); setCantidadTo(0)}}/>
              <Typography color="primary" style={{marginLeft:10}}>{TIPO_PIEZA[product_selected.precios.unidad_de_compra.unidad].unidad_maxima} </Typography> 
            </Box>
          :
            <div/>
          
          }
      
        </Box>
      );
     } catch (error) {
       
     }
    
    
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: product_selected !== undefined && props.add,
      })}
    
    >
    <Grid container>
      {product_selected !== undefined  && props.add ? (
        <Box style={{width:'100%'}}>
         
          <Typography className={classes.title} color="inherit" variant="subtitle2"  >
            {product_selected.datos_generales.nombre_comercial} 
          </Typography>
        </Box>
      ) : (
        <Box style={{width:'100%'}} flexDirection={'row'} display="flex">
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {props.title}
          </Typography>
          {
            (productosTras.length > 0 && !props.add) ? 
            <Tooltip title="Eliminar todos">
              <IconButton aria-label="delete" onClick={() => setOpenEnd(true)} >
                  <DeleteIcon />
              </IconButton>
            </Tooltip>
            :
            <div/>
          }
          
         </Box>  
      )}

      {(product_selected !== undefined )? (
      <Box > 
        {
          (props.error.error) ?
          <Typography color="inherit">{props.error.mensaje}</Typography>
          :
          <div/>
        } 
            {
            (props.add ) ?
                (product_selected.datos_generales.tipo_producto === 'OTROS') ? 
                  <Grid container  justifyContent="space-evenly" ml={1}>
                
                      {
                        (props.almacenOrigen === null)?
                        
                        <TipoPiezaComponent />
                        :
                        <Box flexDirection={'row'} display="flex">
                          <Box flexDirection={'row'}  >
                            <Checkbox checked={tipoPieza.piezas}   color="primary" onChange={() => {update(); setCantidadTo(0)}} disabled={props.product_selected.inventario_general[0].cantidad_existente_maxima === null} />
                            <Typography color="primary" style={{marginLeft:10}}>{props.product_selected.inventario_general[0].unidad_inventario}</Typography> 
                          </Box>
                          {
                            (props.product_selected.inventario_general[0].unidad_maxima !== null ) ?
                              <Box flexDirection={'row'} >
                                <Checkbox checked={tipoPieza.cajas} color="primary" onChange={() => {update(); setCantidadTo(0)}}/>
                                <Typography color="primary" style={{marginLeft:10}}>{"" + props.product_selected.inventario_general[0].unidad_maxima} </Typography> 
                              </Box>
                            :
                              <div/>
                          }
                        </Box>
                      }
                        
                      <Box width="180px" ml={2}>
                    
                        <Typography color="primary">Cantidad</Typography>
                        <TextField
                            className={classes.inputCantidad}
                            
                            size="small"
                            name="cantidad"
                            variant="outlined"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={cantidadTo}
    
                            onKeyPress={pressEnter}
                            onChange={(value) => onlyNumbers(value.target.value)}
                            
                        />
                      
                        <Tooltip title="Agregar">
                            <IconButton aria-label="add" onClick={() => setValueToTrans(cantidadTo)} >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                      </Box>
                      {
                        (props.almacenOrigen) ? 
                          <Box  width="150px" >
                            {
                              (props.product_selected.inventario_general[0].cantidad_existente_maxima !== null ) ? 
                                <Typography color="primary" style={{flexWrap: "wrap"}}>
                                  {getUnidadMax(props.product_selected.inventario_general[0].cantidad_existente_maxima,props.product_selected.inventario_general[0].unidad_maxima)}
                                  </Typography>
                              :
                              <div/>
                            }
                          </Box>
                        :
                        <div/>
                      }
                    </Grid>
                   
                  :    
                  <div>
                    <DialogTallas openTallas={props.openTallas} setOpenTallas={props.setOpenTallas} setproduct_selected={setproduct_selected}  product_selected={product_selected} almacenOrigen={props.almacenOrigen} obtenerConsultasProducto={props.obtenerConsultasProducto} refetch={props.refetch} setError={props.setError} /> 
                  </div> 
                :
                <div>
                   <DialogTallas openTallas={props.openTallas} setOpenTallas={props.setOpenTallas} setproduct_selected={setproduct_selected}  product_selected={product_selected} almacenOrigen={props.almacenOrigen} obtenerConsultasProducto={props.obtenerConsultasProducto} refetch={props.refetch} setError={props.setError}/> 
                </div>
                /* <Grid width={'100%'} container>
                  { (product_selected.datos_generales.tipo_producto === 'OTROS') ? 
                    <div>
                     
                      <Typography color="primary">Cantidad</Typography>
                      <TextField
                          className={classes.inputCantidad}
                          size="small"
                          name="cantidad"
                          variant="outlined"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={cantidadTo}
                          onChange={(value) => onlyNumbers(value.target.value)}
                          
                      />
                    
                      <Tooltip title="Agregar">
                          <IconButton aria-label="add" onClick={() => setValueToTrans(cantidadTo)} >
                              <AddIcon />
                          </IconButton>
                      </Tooltip>
                    </div>
                    :
                    
                    <DialogTallas openTallas={openTallas} setOpenTallas={setOpenTallas} setproduct_selected={setproduct_selected}  product_selected={product_selected} almacenOrigen={props.almacenOrigen} obtenerConsultasProducto={props.obtenerConsultasProducto}refetch={props.refetch}/> 
                     
                     
                  }
                  <Box mt={3} >
                  { (product_selected.datos_generales.tipo_producto !== 'OTROS') ? 
                     <Tooltip title="Editar">
                        <IconButton aria-label="delete" onClick={() => editItem()} >
                            <EditIcon />
                        </IconButton>
                    </Tooltip> 
                    :
                    <div/>
                    }
                    <Tooltip title="Eliminar">
                        <IconButton aria-label="delete" onClick={() => deleteItem()} >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                  </Box> 
                </Grid> */
            }
                
         
        </Box>
      ) : (
        <div/>
      )}
       <SnackBarMessages alert={props.error} setAlert={props.setError} />  
      </Grid>
      <Dialog open={openEnd} onClose={() => setOpenEnd(false)}>
            <DialogTitle>{'¿Está seguro de realizar esta acción?'}</DialogTitle>
            <DialogActions>
                <Button onClick={() => setOpenEnd(false)} color="primary">
                    Cancelar
                </Button>
                <Button color="secondary" autoFocus variant="contained" onClick={() => deletesItems()}>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    </Toolbar>
  );
};

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

const useStyles = makeStyles((theme) => ({
  root: {
   
    marginLeft:theme.spacing(1),
    marginRight:theme.spacing(1),


  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
  
    
   
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState(undefined);
  const [ openTallas, setOpenTallas] = useState(false);
  const [ data, setData] = useState([]);
  const [cant, setCant] = useState(0);
   const [error, setError] = useState({error:false, mensaje:''});
  //const [data, setData] = useState([]);
 

  const [tipoPieza, setTipoPieza] = useState({piezas: true, cajas: false});
  const sesion = JSON.parse(localStorage.getItem('sesionCafi'));



  const update = () => {
   setTipoPieza({...tipoPieza, piezas: !tipoPieza.piezas, cajas: !tipoPieza.cajas})
 }
 
  const {
        productosTras, productosTo,   productosEmpTo, setProductosTras
    } = useContext(TraspasosAlmacenContext);

  const obtenerConsultasProducto = useQuery(OBTENER_CONSULTAS, {
    variables: { 
      empresa: sesion.empresa._id, 
      sucursal: sesion.sucursal._id  },
    fetchPolicy: "network-only"
  });

  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      //const newSelecteds = data.map((n) => n.name);
      setSelected(event.target.checked);
      return;
    }
    setSelected([]);
  };
 // const data = (!props.add) ?  productosTras  : (!props.almacenOrigen) ? productosEmpTo : productosTo  ; 
  useEffect(() => {
    
    setData((!props.add) ?  productosTras  : (!props.almacenOrigen) ? productosEmpTo : productosTo)
  }, [productosEmpTo, productosTo, productosTras])
  
  const handleClick = (event, elemento, cant) => {
  setError({error:false, mensaje:''})
    if(elemento.datos_generales.tipo_producto === 'OTROS'){
      let haveCant= 0;
      productosTras.forEach(producto => {
        if(producto.product_selected._id === elemento._id){
      	  
          haveCant = producto.cantidad_total;		
        }
      });
      
        setCant(props.add ? haveCant : cant)
    }

    
    if(selected!== undefined){
      const selectedIndex = selected._id === elemento._id;
     
      // let newSelected = [];
      if(selectedIndex){
          setSelected(undefined);
      }else{
          setSelected(elemento);
      } 
    }else{
      //console.log(elemento)
      setSelected(elemento);
    }
   
    
  };
    
 /*  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }; */
  const deleteItem =(row) =>{
    try {
      
      let prodSet =  [] ;
      
    
      if(productosTras.length){
        prodSet = productosTras;
      }
      
    
      //console.log(prodSet.filter(item => item.product_selected._id !== product_selected._id))
      setProductosTras(prodSet.filter(item => item.product_selected._id !== row._id));

    } catch (error) {

    }
  }
  const setValueToTrans =(cantidad_total, rowSelected) =>{
  try {
    //setError({error:false, mensaje:''})
   
    
   let element = productosTras.find(element => element.product_selected._id === rowSelected._id);
   if(cantidad_total === 0 || cantidad_total === '') {element.cantidad_total = 0;return;};
  /*   let elementTablaTo = (props.almacenOrigen !== null) ? 
        productosEmpTo.find(element => element.product_selected._id === product_selected._id)
        :
        productosTo.find(element => element.product_selected._id === product_selected._id) */
  if(element) {
 //console.log(cantidad_total, element)
      let totalCantExistMasNuevaCantidad = parseFloat(cantidad_total + element.cantidad_total);
      //SUMA CANTIDAD TOTAL
      
      if(props.add){
        if(rowSelected.inventario_general !== undefined){
          if( !tipoPieza.piezas ){
            if(totalCantExistMasNuevaCantidad <=  rowSelected.inventario_general[0].cantidad_existente_maxima){
              element.cantidad_total = totalCantExistMasNuevaCantidad;
            }else{
              setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente del producto seleccionado.'})
            }  
          }else{
            if(totalCantExistMasNuevaCantidad <=  rowSelected.inventario_general[0].cantidad_existente){
              element.cantidad_total = totalCantExistMasNuevaCantidad;
            
            }else{
              setError({error:true, mensaje:'La cantidad ingresada sobrepasa la cantidad existente del producto seleccionado.'})
            }
          }
        }else{
          element.cantidad_total = totalCantExistMasNuevaCantidad;
        /*   if(props.add){
            elementTablaTo.inventario_general[0].cantidad_existente -= cantidad_total;
          }else{
            elementTablaTo.cantidad_total -= cantidad_total
          } */

          
        }
      }else{

        element.cantidad_total = parseFloat(cantidad_total);
      }  
      setProductosTras([...productosTras]);
      /*  if(props.almacenOrigen !== null){
           setProductosEmpTo([...productosTras]);
        }else{
           setProductosTo([...productosTras]);
        } */

      return;


    }
     return;
  } catch (error) {
     //console.log(error)
  }
}

  
  function onlyNumbers(value, rowSelected){
   
    
   setError({error:false, mensaje:''})
      //const onlyNums = value.toString().replace(/[^0-9]/g, '');
      if(value === '') {setValueToTrans('', rowSelected);return;}
      const intValue = parseFloat(value);

      try {
         
        if(props.almacenOrigen !== null){
            if( !tipoPieza.piezas  ){
              if(intValue <= rowSelected.inventario_general[0].cantidad_existente_maxima){
                setValueToTrans(intValue, rowSelected)
                //console.log(intValue)
                return;
              } 
            }else{
            
              if(intValue <= rowSelected.inventario_general[0].cantidad_existente){
                
                setValueToTrans(intValue, rowSelected)
                return;
              }
            }
           
        }else{
           
           
            setValueToTrans(intValue, rowSelected)
            return;
          }
      } catch (error) {
        console.log(error);
      }
    
  }
  const isSelected = (id) => {
    //return selected.indexOf(name) !== -1;
    
    if(selected!== undefined){
      const selectedIndex = selected._id === id;
   
      // let newSelected = [];
      if(!selectedIndex){
        return false;
      }else{
        return true;
      } 
    }else{
      return false;
    }
    
  } 

  const editItem =(prod_sel) =>{
  try {
  
  
    if(prod_sel.datos_generales.tipo_producto !== 'OTROS') {
      setOpenTallas(true);
      obtenerConsultasProducto.refetch();
      //console.log(props)
    }
   
  } catch (error) {

  }
}
  //const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const handleChangePage = (_, nextPage) => {
    if(props.almacenOrigen){
      props.setPageAlm(nextPage);
    }else{
      props.setPage(nextPage);
    }
  
    /* refetch({
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtros: filtro,
      offset: nextPage,
    }); */
  };
  
  if(props.loading && props.add){
    return (
      <div className={classes.root}>
        <Box mt={5} style={{display:'flex', justifyContent: 'center'}}>
          <CircularProgress  />
        </Box>
      </div>
    )
  }
  
  let datosMap = (props.add ? data?.docs : data);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
       
        <EnhancedTableToolbar 
          product_selected={selected} 
          setproduct_selected={setSelected} 
          openTallas={openTallas}
          setOpenTallas={setOpenTallas}
          error={error}
          setError={setError}
          title={props.title} 
          add={props.add} 
          almacenOrigen={props.almacenOrigen} 
          productosTras ={productosTras} 
          tipoPieza={tipoPieza} 
          update={update} 
          cant={cant} 
          obtenerConsultasProducto={(obtenerConsultasProducto.data) ? obtenerConsultasProducto.data.obtenerConsultasProducto :[]}
          refetch={( obtenerConsultasProducto.refetch ) ? obtenerConsultasProducto.refetch : null}  />
        <TableContainer style={{height:'38vh'}}>
          <Table
          
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="a dense table"
          >
            <EnhancedTableHead
              classes={classes}
              product_selected={selected}
              add = {props.add}
              order={order}
              orderBy={orderBy}
              handleSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              //rowCount={data.length}
            />
            <TableBody>
              {datosMap?.map((row, index) => {
                
                  const isItemSelected = isSelected((props.add === true) ? row._id: row.product_selected._id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                
                  if(props.add){
              
                    if(props.almacenOrigen) {
                 
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={(props.add === true) ? row._id : row.product_selected._id}
                        selected={isItemSelected}
                        
                      >
                        <TableCell  id={labelId} scope="row">
                          {(row.datos_generales.codigo_barras == null)? 'SIN CÓDIGO' : row.datos_generales.codigo_barras}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.datos_generales.nombre_comercial}
                        </TableCell>
                        
                        <TableCell align="left"> {row.datos_generales.tipo_producto}</TableCell>
                        <TableCell align="left"> {row.inventario_general[0].cantidad_existente }  {row.inventario_general[0].unidad_inventario} </TableCell>

                      </TableRow>
                    );
                    }else{
                      return(
                        <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id}
                        selected={isItemSelected}
                        
                      >
                        <TableCell  id={labelId} scope="row">
                          {(row.datos_generales.codigo_barras == null)? 'SIN CÓDIGO' : row.datos_generales.codigo_barras}
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.datos_generales.nombre_comercial}
                        </TableCell>
                        <TableCell align="left"> {row.datos_generales.tipo_producto}</TableCell>
                        <TableCell align="left"> N/A</TableCell>
                      </TableRow>
                      );
                    }
                  }else{
                    
                    return(
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.product_selected, row.cantidad_total)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={(props.add === true) ? row._id : row.product_selected._id}
                      selected={isItemSelected}
                      
                    >
                      <TableCell  id={labelId} component="th" width={100}>
                        {(row.product_selected.datos_generales.codigo_barras == null)? 'SIN CÓDIGO' : row.product_selected.datos_generales.codigo_barras}
                      </TableCell>
                      <TableCell id={labelId}  width={200}>
                        {row.product_selected.datos_generales.nombre_comercial}
                      </TableCell>
                      <TableCell align="left" > {row.product_selected.datos_generales.tipo_producto}</TableCell>
                      {
                        (row.product_selected.datos_generales.tipo_producto  === "OTROS" ) ? 
                          <TableCell align="left"  width={20} > 
                            <TextField
                              size="small"
                              name="cantidad"
                              variant="outlined"
                              type="number"
                              InputProps={{ inputProps: { min: 0 } }}
                              value={row.cantidad_total} 
                              onChange={(value) => onlyNumbers(value.target.value, row.product_selected)}
                            
                            />
                          </TableCell> 
                          :
                          <TableCell align="left"> {row.cantidad_total}</TableCell> 

                      }

                      <TableCell align="left" width={10}>
                        <Box flexDirection={'row'} display="flex" style={{width:75}}>
                          { (row.product_selected.datos_generales.tipo_producto !== 'OTROS') ? 
                          <Tooltip title="Editar">
                              <IconButton aria-label="edit" onClick={() => editItem(row.product_selected)} >
                                  <EditIcon />
                              </IconButton>
                          </Tooltip> 
                          :
                          <div/>
                          } 
                          <Tooltip title="Eliminar">
                            <IconButton aria-label="delete" onClick={() => deleteItem(row.product_selected)} >
                                <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell> 
                    </TableRow>
                    )
                  }
                })}
                
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {
          (props.add)?
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={data?.totalDocs}
            rowsPerPage={props.limit}
            page={(props.almacenOrigen) ? props.pageAlm : props.page}
            onPageChange={handleChangePage}
          />
          :
          <div/>
        }
       
       
      </Paper>
      
    </div>
  );
}