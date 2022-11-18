import {
    Box,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";
  
export default function Compras({ obtenerAccesos, arregloAccesos }) {
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
                                    <b>Abrir una compra</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'compras'}
                                subDepartamento={'abrir_compra'}
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
                                    <b>Compras realizadas</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'compras'}
                                subDepartamento={'compras_realizadas'}
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
                                    <b>Compras en espera</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'compras'}
                                subDepartamento={'compras_espera'}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Fragment>
    )
}