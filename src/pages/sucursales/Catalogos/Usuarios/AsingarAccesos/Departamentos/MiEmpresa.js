import {
    Box,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";
  
export default function MiEmpresa({ obtenerAccesos, arregloAccesos }) {
      return (
            <Fragment>
                <Box p={1}  display='flex' justifyContent= 'center'>
                    <Box width='80%'>
                        <Typography variant="h6">
                            Marca los permisos que deseas asignar a este usuario
                        </Typography>
                    </Box>
                </Box>
                <Box p={1}  display='flex' justifyContent= 'center'>
                    <Box width='80%'>
                        <Paper elevation={3}>
                            <Box display='flex'>
                                <Box ml={1} p={1} flexGrow={1} >
                                    <Typography variant="h6">
                                        <b>Datos de Empresa</b>
                                    </Typography>
                                </Box>
                                <Parametros 
                                    arregloAccesos={arregloAccesos} 
                                    obtenerAccesos={obtenerAccesos}
                                    departamento={'mi_empresa'}
                                    subDepartamento={'datos_empresa'}
                                />
                            </Box>
                        </Paper>
                    </Box>
                </Box>
                <Box p={1}  display='flex' justifyContent= 'center'>
                    <Box width='80%'>
                        <Paper elevation={3}>
                            <Box display='flex'>
                                <Box ml={1} p={1} flexGrow={1} >
                                    <Typography variant="h6">
                                        <b>Información Fiscal</b>
                                    </Typography>
                                </Box>
                                <Parametros 
                                    arregloAccesos={arregloAccesos} 
                                    obtenerAccesos={obtenerAccesos}
                                    departamento={'mi_empresa'}
                                    subDepartamento={'informacion_fiscal'}
                                />
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Fragment>
      )
}