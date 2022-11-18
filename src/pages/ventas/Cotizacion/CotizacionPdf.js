import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { makeStyles } from "@material-ui/core/styles";
import html2canvas from 'html2canvas';
import { Box, Button, Container, Typography } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import Avatar from "@material-ui/core/Avatar";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
	formatoFechaCorta,
	formatoMexico,
  } from "../../../config/reuserFunctions";
//import { formatoFechaCertificado } from '../../../../config/reuserFunction';
//import Spin from '../../../../components/Spin/spin';
//import MessageSnackbar from '../../../../components/Snackbar/snackbar';


const useStyles = makeStyles((theme) => ({
	root: {
		/* top: 0,
		left: 0, */
		zIndex: 9999,
		position: 'absolute',
		width: '250mm',
		minHeight: '210mm',
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		/* border: 'solid 1px black' */
		/* display: 'none' */
	},
	nombre: {
		marginTop: theme.spacing(54),
		marginLeft: theme.spacing(61)
	},
	textoSecundario: {
		marginTop: theme.spacing(2),
		marginLeft: theme.spacing(55),
		width: 600
	},
	firma: {
		marginTop: theme.spacing(12),
		marginLeft: theme.spacing(76)
	},
	intructor: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(85)
	},
	codigo: {
		marginTop: theme.spacing(1),
		marginLeft: theme.spacing(126)
	}
}));

export default function CotizacionPdf(props) {
	const [ cotizacion, setCotizacion ] = useState(props.cotizacion);
	const [ show, setShow ] = useState(false);
	const classes = useStyles();
/* 	const [ loading, setLoading ] = useState(false);
	const [ snackbar, setSnackbar ] = useState({
		open: false,
		mensaje: '',
		status: ''
	}); */

	useEffect(() => {
	  if(show){
		  printDocument();
	  }
	}, [show])
	
	
	const printDocument = () => {

		const divInformation = document.getElementById('divInformation');
		/* const divTitleProductos = document.getElementById('divTitleProductos'); */
		/* console.log(divInformation) */
		setShow(false);
		const pdf = new jsPDF('p', 'mm', 'letter');
		//Information
		html2canvas(divInformation).then((canvas) => {

			const imgData = canvas.toDataURL('image/png');
		
			const imgProps = pdf.getImageProperties(imgData);

			const pdfWidth = pdf.internal.pageSize.getWidth() - 5 ;
             
			const pdfHeight = imgProps.height * pdfWidth / imgProps.width;

			pdf.addImage(imgData, 'JPEG', 2, 5, pdfWidth, pdfHeight);
			pdf.addPage();
			// pdf.output('dataurlnewwindow');
			pdf.save('cotizacion' + cotizacion.folio + '.pdf');

		}); 
		//Productos
	/* 	html2canvas(divTitleProductos).then((canvas) => {

			const imgData = canvas.toDataURL('image/png');
		
			const imgProps = pdf.getImageProperties(imgData);

			const pdfWidth = pdf.internal.pageSize.getWidth() - 5 ;
             
			const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
console.log('PDF' , pdfWidth, ',',imgProps.height );
			
			pdf.addImage(imgData, 'JPEG', 2, 50, pdfWidth, pdfHeight);
			// pdf.output('dataurlnewwindow');
			
		}); */
		
	};

	//if (loading) return <Spin loading={loading} />;

	return (
		<Box mt={1}>
			{/* <MessageSnackbar
				open={snackbar.open}
				mensaje={snackbar.mensaje}
				status={snackbar.status}
				setSnackbar={setSnackbar}
			/> */}
			<Box display="flex" justifyContent="center" m={1} mb={0}>
				<Button variant="outlined" color="primary" onClick={() => setShow(true)} startIcon={<GetAppIcon />}>
					Descargar PDF
				</Button>
			</Box>
			<Container >
				{
					(show) ? 
					<div>
						<CotizacionInformation cotizacion={cotizacion} classes={classes} /> 
					
					</div>
					:
					<div/>
				}
				
			</Container>
		</Box>
	);
}

const CotizacionInformation = ({ cotizacion, classes}) => {
	

/* 	if (!cotizacion) {
		return null;
	} */
	
	return (
        <div id="divInformation" className={classes.root} >
			
			<Box style={{ display: "flex", justifyContent: "space-between" }}>
		{/* 	<Typography>
                <b>Caja: </b>
                {` ${cotizacion.id_caja.numero_caja}`}
                </Typography>
            <Box>
               
                <Box mx={1} />
                <Typography>
                <b>Usuario en caja:</b> {` ${cotizacion.usuario.nombre}`}
                </Typography>
            </Box> */}
            <Box>
                <Typography align="right">
                <b>Folio:</b>
                {` ${cotizacion.folio}`}
                </Typography>
                <Box mx={1} />
                <Typography>
                <b>Fecha:</b>
                {` ${formatoFechaCorta(cotizacion.fecha_registro)}`}
                </Typography>
            </Box>
           
        </Box>
    
        {(cotizacion.cliente) ? (
          <Box my={1}>
            <Box display="flex" alignItems="center">
              <Avatar>
                <AccountBoxIcon size={12} />
              </Avatar>
              <Box mx={1} />
              <Box>
                <Typography size={18}>Cliente</Typography>
              </Box>
            </Box>
            <Box my={1}>
              <Paper variant="outlined">
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Numero de Cliente</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Clave</TableCell>
                        <TableCell>Telefono</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{cotizacion.cliente.numero_cliente}</TableCell>
                        <TableCell>{cotizacion.cliente.nombre_cliente}</TableCell>
                        <TableCell>{cotizacion.cliente.clave_cliente}</TableCell>
                        <TableCell>{cotizacion.cliente.telefono}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        ) : null}
        <Box my={2}>
          <Box display="flex" alignItems="center">
            <Avatar>
              <AttachMoneyIcon size={12}/>
            </Avatar>
            <Box mx={1} />
            <Box>
              <Typography size={18}>Venta</Typography>
            </Box>
          </Box>
          <Box my={1}>
            <Paper variant="outlined">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Venta Crédito</TableCell>
                      <TableCell>Descuento</TableCell>
                      <TableCell>Monedero</TableCell>
                      <TableCell>IVA</TableCell>
                      <TableCell>IEPS</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell>Impuestos</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{cotizacion.credito ? "SI" : "NO"}</TableCell>
                      <TableCell>
                        ${cotizacion.descuento ? formatoMexico(cotizacion.descuento) : 0}
                      </TableCell>
                      <TableCell>
                        ${cotizacion.monedero ? formatoMexico(cotizacion.monedero) : 0}
                      </TableCell>
                      <TableCell>
                        ${cotizacion.iva ? formatoMexico(cotizacion.iva) : 0}
                      </TableCell>
                      <TableCell>
                        ${cotizacion.ieps ? formatoMexico(cotizacion.ieps) : 0}
                      </TableCell>
                      <TableCell>${formatoMexico(cotizacion.subTotal)}</TableCell>
                      <TableCell>${formatoMexico(cotizacion.impuestos)}</TableCell>
                      <TableCell>{formatoMexico(cotizacion.total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
        <Box my={2}>
          <Box display="flex" alignItems="center">
            <Avatar>
              <ShoppingCartIcon  size={12} />
            </Avatar>
            <Box mx={1} />
            <Box>
              <Typography size={18}>Artículos</Typography>
            </Box>
          </Box>
          <Box my={1}>
            <Paper variant="outlined">
              <TableContainer >
                <Table size="small">
					<TableHead>
						<TableRow>
						{/* <TableCell>Cód. de barras</TableCell> */}
						<TableCell>Producto</TableCell>
						{/* <TableCell>Med.</TableCell>
						<TableCell>Uni.</TableCell> */}
						<TableCell>Cant.</TableCell>
						<TableCell>Precio</TableCell>
						<TableCell>Desc.</TableCell>
						<TableCell>IVA</TableCell>
						<TableCell>IEPS</TableCell>
						<TableCell>SubTotal.</TableCell>
						<TableCell>Impues.</TableCell>
						<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
                  

					<TableBody>
						{cotizacion.productos.map((row, index) => {return(
							<TableRow key={index}>
						{/* 	<TableCell>
								{row.id_producto.datos_generales.codigo_barras}
							
							</TableCell> */}
							<TableCell>
								{row.id_producto.datos_generales.nombre_comercial}
							</TableCell>
						{/* 	<ComponenteMedidaColor producto={row} />
							<TableCell>{row.unidad}</TableCell> */}
							<TableCell>{row.cantidad_venta}</TableCell>
							<TableCell>
								${formatoMexico(row.precio_a_vender)}
							</TableCell>
							<ComponenteDescuento producto={cotizacion} />
							<TableCell>
								$
								{row.iva_total_producto
								? formatoMexico(row.iva_total_producto)
								: "0.00"}
							</TableCell>
							<TableCell>
								$
								{row.ieps_total_producto
								? formatoMexico(row.ieps_total_producto)
								: "0.00"}
							</TableCell>
							<TableCell>${formatoMexico(row.subtotal_total_producto)}</TableCell>
							<TableCell>${formatoMexico(row.impuestos_total_producto)}</TableCell>
							<TableCell>${formatoMexico(row.total_total_producto)}</TableCell>
							</TableRow>
						)})}
					</TableBody>

                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
		</div>
	);
	
};

/* const EncabezadoTablaProductos = (cotizacion, classes) => {
	return(
		<div id="divTitleProductos" className={classes.root} >
		
		  </div>
	)
} */

/* const CotizacionRowProducto = (cotizacion) =>{
	
}
 */
/* const ComponenteMedidaColor = ({ producto }) => {
	const classes = useStyles();
	const theme = useTheme();
  
	if (producto.color.nombre && producto.medida.talla) {
	  return (
		<TableCell align="center">
		  <Tooltip title={producto.color.nombre} placement="top" arrow>
			<div
			  className={classes.colorContainer}
			  style={{
				backgroundColor: producto.color.hex,
				color: theme.palette.getContrastText(producto.color.hex),
			  }}
			>
			  {producto.medida.talla}
			</div>
		  </Tooltip>
		</TableCell>
	  );
	} else {
	  return <TableCell align="center">{"N/A"}</TableCell>;
	}
  }; */
  
  const ComponenteDescuento = ({ producto }) => {
	if (producto.descuento_general_activo === true) {
	  const { dinero_descontado, porciento } = producto.descuento_general;
	  return (
		<TableCell>
		  {`$${formatoMexico(dinero_descontado)} - %${porciento}`}
		</TableCell>
	  );
	} else {
	  return <TableCell>{"$0.00"}</TableCell>;
	}
  };
  