import React, { useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Backup } from "@material-ui/icons";
import SnackBarMessages from "../../components/SnackBarMessages";
import { SUBIR_VENTAS_CLOUD } from "../../gql/Ventas/ventas_generales";
import { useMutation } from "@apollo/client"; 
import {
    VentasContext,
  } from "../../context/Ventas/ventasContext";
import { AccesosContext } from "../../context/Accesos/accesosCtx";
import Badge from "@material-ui/core/Badge";

export default function ComponentVentasToCloud({ventasToCloud, isOnline, classes}) {
    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [subirVentasCloud] = useMutation(SUBIR_VENTAS_CLOUD);
    const { removeStorageVentas, saveVentasToCloudFail } = useContext(AccesosContext);
    const { setOpenBackDrop } = useContext(VentasContext);
    
    const subir_ventas_cloud= async () => {
      try {
        setOpenBackDrop(true);
        const up_ventas = await subirVentasCloud({variables: {arrayVentasCloud:ventasToCloud}});
        let {message, done, ventas_fail} = up_ventas.data.subirVentasCloud;
    
        if(done){
          removeStorageVentas();
        }else{
          console.log(up_ventas.data.subirVentasCloud)
          saveVentasToCloudFail(ventas_fail);
        }
       
        
        setOpenBackDrop(false);
        setAlert({ message: message, status: (done) ? 'success' : 'error'  ,open: true })
        //localStorage.removeItem('ventasToCloud')
      } catch (error) {
        setOpenBackDrop(false);
        console.log(error)
        if (error.networkError.result) {
          console.log(error.networkError.result.errors);
        } else if (error.graphQLErrors) {
          console.log(error.graphQLErrors.message);
        }
      }
    }
    
    return (
        <Box display="flex" alignItems={'center'} >
          <SnackBarMessages alert={alert} setAlert={setAlert} />
              <Button
                onClick={() => subir_ventas_cloud()}
                className={classes.buttonIcon}
                startIcon={
                  (ventasToCloud.length) ? 
                    <Badge
                      badgeContent={1}
                      variant="dot"
                      color="secondary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <Backup  style={{fontSize: 20}} />
                    </Badge>
                    :
                    <Backup  style={{fontSize: 20}} />
                  }
                disabled={(ventasToCloud.length > 0 && isOnline) ? false : true }
                style={
                  ventasToCloud.ventasToCloud ? { color: "white", borderColor: "white" } : null
                }
              >
                
                Guardar ventas en la nube
              </Button>
        </Box>
    );
  };