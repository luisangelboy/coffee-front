import React, { useEffect, useState, useContext } from "react";
import { TraspasosAlmacenContext } from "../../../../context/Almacenes/traspasosAlmacen";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatoMexico } from "../../../../config/reuserFunctions";
import BackdropComponent from '../../../../components/Layouts/BackDrop';
import DialogMedidasAlmacenes from "./DialogMedidasAlmacenes";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "76vh",
  },
});




export default function ListaAlmacenes(props) {
  const classes = useStyles();
  const [medidasAlmacen, setMedidasAlmacen] = useState({
    open: false,
    producto: {},
  });

  const toShowMedidasAlmacen = (producto) => {
    try {
      let tipo_producto = producto.datos_generales.tipo_producto;
      if (tipo_producto !== "OTROS") {
        setMedidasAlmacen({ open: true, producto });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangePage = (_, nextPage) => {
    props.setPage(nextPage);
   
  };
  if(props.loading){
   
    return <BackdropComponent loading={props.loading}  />
  }


  return (
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader size={"small"} aria-label="a dense table">
            <TableHead>
              <TableRow>
                {props.columns.map((column, index) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      textAlign: index > 1 ? "center" : "left",
                      minWidth: column.minWidth,
                      width: column.minWidth,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.productos.docs.map((row, index) => {
                let key = index;
              
                return (
                  <Rowrow
                    producto={row}
                    index={key}
                    key={index}
                    productosLength={props.productos.totalDocs}
                    dataExcel={props.dataExcel}
                    setDataExcel={props.setDataExcel}
                    obtenerAlmacenes={props.obtenerAlmacenes}
                    toShowMedidasAlmacen={toShowMedidasAlmacen}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={props.productos.totalDocs}
        rowsPerPage={props.limit}
        page={props.page}
        onPageChange={handleChangePage}
      />
        
      <DialogMedidasAlmacenes
        medidasAlmacen={medidasAlmacen}
        setMedidasAlmacen={setMedidasAlmacen}
        obtenerAlmacenes={props.obtenerAlmacenes}
      />
      </Paper>
  );
}

const Rowrow = (rowProps) => {
  const { dataExcel, setDataExcel } = useContext(TraspasosAlmacenContext);
  const [dataExcelHere, setDataExcelHere] = useState([]);
  const [arrayCantidades, setArrayCantidades] = useState([]);
  const [row, setRow] = useState({
    codigo_barras: rowProps.producto.datos_generales.codigo_barras,
    nombre_comercial: rowProps.producto.datos_generales.nombre_comercial,
    style: {
      font: { sz: "12" },
      alignment: { wrapText: true, horizontal: "center", vertical: "top" },
      border: { bottom: { style: "thin", color: { rgb: "000000" } } },
    },
  });
  const [total, setTotal] = useState(0);
  const [unidad_minima, setUnidad_Minima] = useState("");
  

  useEffect(() => {
    try {
     
    let tot = 0;
    let r = row;
    let datExc = dataExcel;
    let uniMin = 'pz';
    let arrayCantidadesInto = [];
    rowProps.obtenerAlmacenes.forEach((almacenColumna) => {
      
      const existencias = rowProps.producto.existencia_almacenes.filter(
        (existencia) => existencia._id.almacen._id === almacenColumna._id
      );

    
      if (existencias.length > 0) {
      
        if(existencias[0].unidad_maxima !== null){
          
          if(existencias[0].unidad_maxima === rowProps.producto.precios.inventario.unidad_de_inventario){
           
            arrayCantidadesInto.push(existencias[0].cantidad_existente_maxima);
            tot += existencias[0].cantidad_existente_maxima;
            uniMin = rowProps.producto.existencia_almacenes[0].unidad_maxima;
          }else{
            tot += existencias[0].cantidad_existente;
            arrayCantidadesInto.push(existencias[0].cantidad_existente);
            uniMin = rowProps.producto.existencia_almacenes[0].unidad_inventario;
          }
       
        }else{
          
          uniMin = rowProps.producto.existencia_almacenes[0].unidad_inventario;
          tot += existencias[0].cantidad_existente;
          arrayCantidadesInto.push(existencias[0].cantidad_existente);
        }
        
        setUnidad_Minima(
            uniMin
        );

        r = {
          ...r,
          [almacenColumna._id]:
            existencias[0].cantidad_existente + " " + uniMin,
        };
       
      } else {
        arrayCantidadesInto.push(0);
        r = { ...r, [almacenColumna._id]: 0 };
      }
    });
    
    r = { ...r, costo_producto: costoProducto(),costo_total_produc: totalProductosExcel(tot),total: tot + " " + uniMin };
    setArrayCantidades(arrayCantidadesInto);
    setTotal(tot);
    setRow(r);
    datExc.push(r);
    
    setDataExcelHere(datExc);
    if (rowProps.index === rowProps.productosLength - 1) {
   
      console.log('dataExcelHere',datExc)
     
    }
    } catch (error) {
      console.log(error)
    }
    
  }, [ rowProps.producto]);

  useEffect(() => {
    if (dataExcelHere) {
    
      setDataExcel(dataExcelHere);
    } 
  }, [dataExcelHere]);

  const costoProducto = () => {
    try {
      let costoProd = 0;
      costoProd = rowProps.producto.precios.unidad_de_compra.precio_unitario_con_impuesto;
      if(rowProps.producto.existencia_almacenes.length > 0){
        if(rowProps.producto.existencia_almacenes[0].unidad_maxima !== null){
          if(rowProps.producto.existencia_almacenes[0].unidad_maxima === rowProps.producto.precios.inventario.unidad_de_inventario){
            costoProd = rowProps.producto.precios.precio_de_compra.precio_con_impuesto;
          }
        }
      }
      

      return formatoMexico(costoProd);
    } catch (error) {
      console.log(error)
    }
  }
  const totalProductosExcel = (totalHere) =>{
    try {
      let tot =  0;
    
     
      tot = rowProps.producto.precios.unidad_de_compra.precio_unitario_con_impuesto *  totalHere;
      if(rowProps.producto.existencia_almacenes.length > 0){
        if(rowProps.producto.existencia_almacenes[0].unidad_maxima !== null){
          if(rowProps.producto.existencia_almacenes[0].unidad_maxima === rowProps.producto.precios.inventario.unidad_de_inventario){
            tot = rowProps.producto.precios.precio_de_compra.precio_con_impuesto *  totalHere;
          }
        }
      }

      return formatoMexico(tot);
    } catch (error) {
      console.log(error)
    }
  }

  const totalProductos = () =>{
    try {
      let tot =  0;
    
     
      tot = rowProps.producto.precios.unidad_de_compra.precio_unitario_con_impuesto *  total;
      if(rowProps.producto.existencia_almacenes.length > 0){
        if(rowProps.producto.existencia_almacenes[0].unidad_maxima !== null){
          if(rowProps.producto.existencia_almacenes[0].unidad_maxima === rowProps.producto.precios.inventario.unidad_de_inventario){
            tot = rowProps.producto.precios.precio_de_compra.precio_con_impuesto *  total;
          }
        }
      }

      return formatoMexico(tot);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      key={rowProps.producto._id}
      onClick={() => rowProps.toShowMedidasAlmacen(rowProps.producto)}
    >
      <TableCell style={{ minWidth: 60 }}>
        {rowProps.producto.datos_generales.codigo_barras}
      </TableCell>

      <TableCell style={{ minWidth: 170 }}>
        {rowProps.producto.datos_generales.nombre_comercial}
      </TableCell>
      <TableCell style={{ textAlign: "center", minWidth: 60 }}>
        $
        {
          costoProducto()
        }
      </TableCell>
      <TableCell style={{ textAlign: "center", minWidth: 80 }}>
        $
        {
          totalProductos()
        }
      </TableCell>
      {/* <TableCell style={{textAlign: 'center',}} >{(producto.datos_generales.receta_farmacia) ? "SI" : "NO"}</TableCell> */}
      {arrayCantidades.map((cantidad, index) => {
        return (
          <TableCell
            key={index}
            style={{
              backgroundColor: "rgba(255, 253, 150, 0.1)",
              color: "black",
              fontSize: 17,
              textAlign: "center",
              minWidth: 60,
            }}
          >
            {cantidad + " " + unidad_minima}
          </TableCell>
        );
      })}
      <TableCell
        style={{
          backgroundColor: "rgba(255, 253, 150, 0.1)",
          color: "black",
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          minWidth: 60,
        }}
      >
        {total + " " + unidad_minima}
      </TableCell>
    </TableRow>
  );
};
