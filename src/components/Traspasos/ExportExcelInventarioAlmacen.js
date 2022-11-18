import React, { Fragment, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { withRouter } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import ExcelFile from 'react-export-excel/dist/ExcelPlugin/components/ExcelFile'

import ExcelSheet from 'react-export-excel/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel/dist/ExcelPlugin/elements/ExcelColumn';
import { OBTENER_PRODUCTOS_ALMACEN } from '../../gql/Almacenes/Almacen';

//Este componente requiere el ArrayData, ArrayColumn, fileName
function ExportarExcelInventarioAlmacen(props) {
    const [data, setData] = useState([]);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    
    const productosAlmacenQuery = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
			input:{
				empresa: sesion.empresa._id,
				sucursal: sesion.sucursal._id,
				filtro: ''	
			},
			limit:0,
      		offset: 0,
            
		},
		fetchPolicy: "network-only"
	});

    useEffect(() => {
		try {
			if(productosAlmacenQuery.data){
                productosAlmacenQuery.data.forEach((producto, index) => {
                    let key = index;
                       //aquí falta llenar el arreglo que contiene los datos a exportar en excel 
				setData(productosAlmacenQuery.data.obtenerProductosAlmacenes);
			    })
            }
		} catch (error) {
			
		}
	},[ productosAlmacenQuery.data]); 
	return (
		<Fragment>
            <Grid>
                <Grid item>
                <ExcelFile
					
					element={
						<Button variant="contained" color="primary"startIcon={<DescriptionOutlinedIcon />}>
							Exportar a Excel
						</Button>
					}
					filename={props.fileName}
				>
					<ExcelSheet data={data} name={props.fileName}>
                        {props.columnName.map((element) => {
                            return(
                                <ExcelColumn key={element.id} label={element.label} value={element.id} />
                            )
                        }
                        )}
					</ExcelSheet>
				</ExcelFile>
                </Grid>
            </Grid>
		</Fragment>
	);
}

export default withRouter(ExportarExcelInventarioAlmacen);