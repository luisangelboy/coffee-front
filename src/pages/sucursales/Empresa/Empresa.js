import { EmpresaProvider } from "../../../context/Catalogos/empresaContext";
import MiEmpresa from "./DatosEmpresa";
import { Box, Grid } from "@material-ui/core";
import Sucursal from "./Sucursal/DatosSucursal";

export default function Empresa() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  return (
    <div>
      <EmpresaProvider>
        <Grid container spacing={5} justifyContent="center">
          {sesion.accesos.mi_empresa.datos_empresa.ver === false ? null : (
            <Grid item lg={2}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <MiEmpresa />
              </Box>
            </Grid>
          )}
          <Grid item lg={2}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Sucursal />
            </Box>
          </Grid>
          {/*    {sesion.accesos.mi_empresa.informacion_fiscal.ver === false ? (null):(
                        <Grid item lg={2}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <InformacionFiscal />
                            </Box> 
                        </Grid>
                    )} */}
        </Grid>
      </EmpresaProvider>
    </div>
  );
}
