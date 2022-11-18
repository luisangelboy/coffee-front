import {
    Box,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";
  
export default function Ventas({ obtenerAccesos, arregloAccesos }) {
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
                                    <b>Cancelar ventas</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'cancelar_venta'}
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
                                    <b>Precios de productos</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'precios_productos'}
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
                                    <b>Pre cortes de caja</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'pre_corte'}
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
                                    <b>Cotizaciones</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'cotizaciones'}
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
                                    <b>Producto Rapido</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'producto_rapido'}
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
                                    <b>Panel de administrador</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'administrador'}
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
                                    <b>Eliminar ventas pendientes</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'ventas'}
                                subDepartamento={'eliminar_ventas'}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Fragment>
    )
}