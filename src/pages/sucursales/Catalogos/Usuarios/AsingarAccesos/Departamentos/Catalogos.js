import {
  Box,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Parametros from "../Parametros";

export default function Catalogos({ obtenerAccesos, arregloAccesos }) {
    
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
                                    <b>Clientes</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'clientes'}
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
                                    <b>Usuarios</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'usuarios'}
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
                                    <b>Productos</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'productos'}
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
                                    <b>Marcas</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'marcas'}
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
                                    <b>Provedores</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'provedores'}
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
                                    <b>Contabilidad</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'contabilidad'}
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
                                    <b>Cajas</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'cajas'}
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
                                    <b>Departamento</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'departamentos'}
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
                                    <b>Centro de costos</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'centro_costos'}
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
                                    <b>Conceptos almacen</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'conceptos_almacen'}
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
                                    <b>Categorias</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'categorias'}
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
                                    <b>Colores</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'colores'}
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
                                    <b>Tallas y Numeros</b>
                                </Typography>
                            </Box>
                            <Parametros 
                                arregloAccesos={arregloAccesos} 
                                obtenerAccesos={obtenerAccesos}
                                departamento={'catalogos'}
                                subDepartamento={'tallas_numeros'}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Fragment>
    );
};

