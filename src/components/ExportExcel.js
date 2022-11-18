import React, { Fragment } from 'react';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';


import { withRouter } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import ExcelFile from 'react-export-excel/dist/ExcelPlugin/components/ExcelFile'

import ExcelSheet from 'react-export-excel/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel/dist/ExcelPlugin/elements/ExcelColumn';

//Este componente requiere el ArrayData, ArrayColumn, fileName
function ExportarExcel(props) {
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
					<ExcelSheet data={props.data} name={props.fileName}>
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

export default withRouter(ExportarExcel);