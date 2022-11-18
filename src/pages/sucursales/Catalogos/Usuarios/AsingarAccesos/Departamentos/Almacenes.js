import {
    Box,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";
  
export default function Almacenes({ obtenerAccesos, arregloAccesos }) {
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
                                    <b>Almacenes</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'almacenes'}
                                subDepartamento={'almacen'}
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
                                    <b>Traspasos</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'almacenes'}
                                subDepartamento={'traspasos'}
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
                                    <b>Inventario por almacen</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'almacenes'}
                                subDepartamento={'inventario_almacen'}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Fragment>
    )
}