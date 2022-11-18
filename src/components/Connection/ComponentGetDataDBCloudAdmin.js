
import React, { useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { CloudDownload } from "@material-ui/icons";
import SnackBarMessages from "../../components/SnackBarMessages";
import { ACTUALIZAR_BD_LOCAL } from "../../gql/Catalogos/usuarios";
import { useMutation } from "@apollo/client";

import { AccesosContext } from "../../context/Accesos/accesosCtx";

export default function ComponentGetDataDBCloudViewAdmin ({isOnline, classes, empresa, sucursal}) {
    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [actualizarBDLocal] = useMutation(ACTUALIZAR_BD_LOCAL);
    const {
      setLoadingPage
    } = useContext(AccesosContext);
  
    const getData = async () =>{  
      try {
        setLoadingPage(true);
        const resp = await actualizarBDLocal({
          variables: {
            empresa:empresa._id,
            sucursal: sucursal._id
          }
        });
        let {message} = resp.data.actualizarBDLocal;
  
        setLoadingPage(false);
        setAlert({ message: message, status:'success', open: true })

      } catch (error) {
        console.log(error)
        setLoadingPage(false);
        if (error.networkError.result) {
          console.log(error.networkError.result.errors);
        } else if (error.graphQLErrors) {
          console.log(error.graphQLErrors.message);
        }
        
      
      }
    }
    return (
      <Box display="flex" alignItems={'center'}  >

        <SnackBarMessages alert={alert} setAlert={setAlert} />
      {
        (isOnline) ?
        <Button
          onClick={() => getData()}
          startIcon={<CloudDownload htmlColor="black" style={{fontSize: 20 }} />}
          className={classes.buttonIcon}
          style={
            { color: "black", 
            borderColor: "white",
            
            }
          }
        >
          
          Actualizar base de datos local
        </Button> 
        :
        <div />
      }
     
      </Box> 
    );
  };