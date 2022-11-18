import {
    Box,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";
  
export default function Facturacion({ obtenerAccesos, arregloAccesos }) {
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
                                    <b>Generar nuevo CDFI</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'facturacion'}
                                subDepartamento={'generar_cdfi'}
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
                                    <b>CDFIs realizados</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'facturacion'}
                                subDepartamento={'cdfi_realizados'}
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
                                    <b>Registrar series CDFI</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'facturacion'}
                                subDepartamento={'registro_series_cdfi'}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Fragment>
    )
}