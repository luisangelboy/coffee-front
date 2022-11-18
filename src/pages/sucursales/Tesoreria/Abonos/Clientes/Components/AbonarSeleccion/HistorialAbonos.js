import React, { Fragment, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Dialog,
  Typography,
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@material-ui/core";
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { withRouter } from "react-router";
import {  Done } from "@material-ui/icons";
import {  CANCELAR_ABONO_CLIENTE } from "../../../../../../../gql/Tesoreria/abonos";
import { formatoMexico,formatoFecha } from "../../../../../../../config/reuserFunctions";

import ExportarExcel from '../../../../../../../components/ExportExcel'
const useStyles = makeStyles({
    
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const columnsEffect = [
    { id: 'fecha_movimiento_credito', label: 'Fecha', minWidth: 60 , widthPx: 160, },
    { id: 'monto_total_abonado', label: 'Cantidad abono', minWidth: 170, widthPx: 160, },
    { id: 'cancelar', label: 'Cancelar abono', minWidth: 170, widthPx: 160, },
];
const columnsExcel = [
    { id: 'fecha_movimiento_credito', label: 'Fecha', minWidth: 60 , widthPx: 160, },
    { id: 'monto_total_abonado', label: 'Cantidad abono', minWidth: 170, widthPx: 160, },
    { id: 'estatus', label: 'Estado', minWidth: 200, widthPx: 200, },
];
function HistorialAbonos(props){
    const classes = useStyles();
    const [openCancelar, setOpenCancelar] = useState(false);
    const [loadingCancelar, setLoadingCancelar] = useState(false);
    const [abonoSelected, setAbonoSelected] = useState(false);
    const sesion = JSON.parse(localStorage.getItem('sesionCafi'));
    const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
    const [ cancelarAbonoCliente ] = useMutation(CANCELAR_ABONO_CLIENTE);
 
    const handleOpen = () =>{
        props.setOpenHistorial(!props.openHistorial)
      
    }

    let dataExcel = [];
    if(props.rowSelected.abonos){
        props.rowSelected.abonos.forEach(element => {
            dataExcel.push({
                fecha_movimiento_credito : formatoFecha(element.fecha_movimiento.completa),
                monto_total_abonado :   formatoMexico(element.monto_total_abonado),
                estatus: element.status
            })
        });
    }
    const affirmCancelar = (abono) =>{
        try {
            if(props.rowSelected.facturacion){
                props.setAlert({ 
                    message: 'No se puede cancelar un abono facturado.', 
                    status: 'error', 
                    open: true 
                });
            }else{
                if(turnoEnCurso || sesion.accesos.tesoreria.caja_principal.ver){
                    setOpenCancelar(true);
                    setAbonoSelected(abono)
                }else{
                    props.history.push('/ventas/venta-general');
                }
            }
           
            
        } catch (error) {
            console.log(error)
        }
    }

    const cancelAbono = async() =>{
        try {
         setLoadingCancelar(true);
       
         const input = {
            tipo_movimiento: "CANCELACION_ABONO_CLIENTE",
            rol_movimiento: ( turnoEnCurso) ? "CAJA" : "CAJA_PRINCIPAL",
            numero_caja: (turnoEnCurso) ? parseInt(turnoEnCurso.numero_caja) : 0,
            id_Caja: (turnoEnCurso) ? turnoEnCurso.id_caja : '',
            fecha_movimiento: {
                year: moment().locale("es-mx").format('YYYY'),
                mes: moment().locale("es-mx").format('MM'),
                dia: moment().locale("es-mx").format('DD'),
                no_semana_year: moment().locale("es-mx").week().toString(),
                no_dia_year: moment().locale("es-mx").dayOfYear().toString(),
                completa: moment().locale('es-mx').format()
            },
            monto_abono: abonoSelected.monto_total_abonado,
           
            horario_turno: (turnoEnCurso) ? turnoEnCurso.horario_en_turno : '',
            hora_moviento: {
                hora: moment().locale("es-mx").format('hh'),
                minutos: moment().locale("es-mx").format('mm'),
                segundos: moment().locale("es-mx").format('ss'),
                completa: moment().locale("es-mx").format('HH:mm:ss')
            },
            concepto: 'CANCELACION_ABONO_CLIENTE',
            
            id_usuario: sesion._id,
            numero_usuario_creador: sesion.numero_usuario,
            nombre_usuario_creador: sesion.nombre,
            id_cliente: props.rowSelected.cliente._id,
            credito_disponible: props.rowSelected.cliente.credito_disponible,
            numero_cliente: props.rowSelected.cliente.numero_cliente,
            nombre_cliente: props.rowSelected.cliente.nombre_cliente ,
            telefono_cliente: props.rowSelected.cliente.telefono,
            email_cliente: props.rowSelected.cliente.email,
            id_abono: abonoSelected._id,
            id_venta: props.rowSelected._id,
            metodo_de_pago: '01',
            caja_principal: sesion.accesos.tesoreria.caja_principal.ver,
        }



          await cancelarAbonoCliente({
            variables: {
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
                input:input
            },
        });
        props.recargar();
        setOpenCancelar(false);
        setLoadingCancelar(false);
        handleOpen();
        props.setAlert({ 
            message: 'Abono cancelado con éxito.', 
            status: 'success', 
            open: true 
        });

        } catch (error) {
            console.log(error)
            if (error.networkError) {
                console.log(error.networkError.result);
            } else if (error.graphQLErrors) {
                console.log(error.graphQLErrors);
            }
            setOpenCancelar(false);
            setLoadingCancelar(false);
            handleOpen();
            props.setAlert({ 
                message: 'La cancelación ha fallado.', 
                status: 'error', 
                open: true 
            });
    
        }
    }

    return(
      <Fragment>
           
      <Dialog
          open={props.openHistorial}
          onClose={handleOpen}
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
      >
        <Dialog
            open={openCancelar}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpenCancelar(false)}
            aria-labelledby="alert-eliminar-abono"
        >
            <DialogTitle id="alert-eliminar-abono">
            {"¿Está seguro de eliminar este abono?"}
            </DialogTitle>
            <DialogActions>
            <Button
                onClick={() => setOpenCancelar(false)}
                color="inherit"
                disabled={loadingCancelar}
            >
                Cancelar
            </Button>
            <Button
                onClick={() => cancelAbono()}
                color="secondary"
                disabled={loadingCancelar}
                startIcon={
                    loadingCancelar ? <CircularProgress size={20} color="inherit" /> : null
                }
            >
                Eliminar
            </Button>
            </DialogActions>
      </Dialog> 
      <DialogTitle>
          <Box display="flex">
              <Typography variant="h6" style={{ flexGrow: 1 }}>
              Historial de abonos
              </Typography>
              <Button
              variant="text"
              color="primary"
              onClick={handleOpen}
              size="large"
              >
              <CloseIcon style={{ fontSize: 30 }} />
              </Button>
          </Box>
          {(props.rowSelected.abonos?.length > 0) ?
                <Box mr={4} mrstyle={{ backgroundColor:'red', alignContent:'flex-end'}}  justifyContent="flex-end"  >
                    <Box  >
                        <ExportarExcel fileName="Historial Abonos" data={dataExcel} columnName={columnsExcel} />
                    </Box>
                </Box>
                :
                <div/>
            }
          </DialogTitle>
          <DialogContent>
              <Paper className={classes.root}>
                      <TableContainer className={classes.container}>
                      <Table stickyHeader size="small" aria-label="a dense table">
                          <TableHead>
                          <TableRow>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Cantidad abono</TableCell>
                              <TableCell>Cancelar abono</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {props.rowSelected.abonos?.map((abono, index) => {
                             
                              return (
                              <TableRow hover tabIndex={-1} key={index}>
                                <TableCell>
                                    {formatoFecha(abono.fecha_movimiento.completa)}
                                </TableCell>
                                <TableCell padding="checkbox">
                                    <b>${formatoMexico(abono.monto_total_abonado)}</b>
                                </TableCell>
                                {
                                    (abono.status === 'CANCELADO') ?
                                    <TableCell>
                                        {abono.status}
                                    </TableCell>
                                    :
                                    <TableCell padding="checkbox">
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={() => affirmCancelar(abono)}
                                        size="large"
                                    >
                                        <CloseIcon style={{ fontSize: 22 }} />
                                    </Button>
                                </TableCell>    
                                }
                               
                              </TableRow>
                              );
                          })}
                          </TableBody>
                      </Table>
                      </TableContainer>
                  </Paper>
          </DialogContent>
          <DialogActions>
          <Button
              variant="text"
              color="primary"
              size="large"
              startIcon={<Done />}
              onClick={() => handleOpen()}
          >
              Aceptar
          </Button>
          </DialogActions>
      </Dialog>
      
 </Fragment>
    )
};

export default withRouter(HistorialAbonos);