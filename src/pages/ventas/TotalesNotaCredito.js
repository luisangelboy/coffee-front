import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { formatoMexico } from "../../config/reuserFunctions";
import { FcBusinessman, FcCalendar, FcSalesPerformance } from "react-icons/fc";
import { FaBarcode, FaMoneyCheckAlt } from "react-icons/fa";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { VentasContext } from "../../context/Ventas/ventasContext";

function TotalesNotaCredito() {
  const { clientesVentas, DatosVentasActual } = React.useContext(VentasContext);
  let datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));

  //useEffect(() => {
  //  datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
  //}, [updateTablaVentas])
  

  return (
    <Paper variant="outlined">
      <Grid container>
        <Grid item md={7} sm={7} xs={12}>
          <Box mx={2}>
            <Grid container>
              <Grid item md={6} xs={12}>
                <Box display="flex" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <FcBusinessman style={{ fontSize: 19 }} />
                    <Box mr={1} />
                    <Typography variant="subtitle1">
                      Cliente:{" "}
                      <b style={{ fontSize: 16 }}>
                        {clientesVentas && clientesVentas.nombre_cliente
                          ? clientesVentas.nombre_cliente
                          : "Público en general"}
                      </b>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box display="flex" alignItems="center">
                  <FaBarcode style={{ fontSize: 19 }} />
                  <Box mr={1} />
                  <Typography variant="subtitle1">
                    Clave Cliente:{" "}
                    <b style={{ fontSize: 16 }}>
                      {clientesVentas ? clientesVentas.clave_cliente : ""}
                    </b>
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box display="flex" alignItems="center">
                  <FcCalendar style={{ fontSize: 19 }} />
                  <Box mr={1} />
                  <Typography variant="subtitle1">
                    Dias Credito:{" "}
                    <b style={{ fontSize: 16 }}>
                      {clientesVentas && clientesVentas.dias_credito
                        ? clientesVentas.dias_credito
                        : 0}
                    </b>
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={6} xs={12}>
                <Box display="flex" alignItems="center">
                  <FaMoneyCheckAlt style={{ fontSize: 19 }} />
                  <Box mr={1} />
                  <Typography variant="subtitle1">
                    Limite Credito:{" "}
                    <b style={{ fontSize: 16 }}>
                      $
                      {clientesVentas && clientesVentas.limite_credito
                        ? formatoMexico(clientesVentas.limite_credito)
                        : 0}
                    </b>
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={7} xs={12}>
                <Box display="flex" alignItems="center">
                  <FcSalesPerformance style={{ fontSize: 19 }} />
                  <Box mr={1} />
                  <Typography variant="subtitle1">
                    Monedero electrónico:{" "}
                    <b style={{ fontSize: 16 }}>
                      $
                      {DatosVentasActual
                        ? DatosVentasActual.monedero
                          ? formatoMexico(DatosVentasActual.monedero)
                          : 0
                        : 0}
                    </b>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item md={5} sm={5} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={6} xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="subtitle1">
                  Descuento:{" "}
                  <b style={{ fontSize: 17 }}>
                    ${" "}
                    {DatosVentasActual
                      ? DatosVentasActual.descuento
                        ? formatoMexico(DatosVentasActual.descuento)
                        : 0
                      : 0}
                  </b>
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Box flexDirection="row-reverse" display="flex" mr={1}>
                <Typography variant="subtitle1">
                  Subtotal:{" "}
                  <b style={{ fontSize: 17 }}>
                    ${" "}
                    {DatosVentasActual?.subTotal
                      ? formatoMexico(DatosVentasActual.subTotal)
                      : 0}
                  </b>
                </Typography>
              </Box>
              <Box display="flex" flexDirection="row-reverse" mr={1}>
                <Typography variant="subtitle1">
                  Impuestos:{" "}
                  <b style={{ fontSize: 17 }}>
                    ${" "}
                    {DatosVentasActual?.impuestos
                      ? formatoMexico(DatosVentasActual.impuestos)
                      : 0}
                  </b>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" alignItems="center" p={1} width="100%">
            <Typography variant="h4">
              Total:{" "}
              <b style={{ color: "green" }}>
                $
                {DatosVentasActual?.total
                  ? formatoMexico(DatosVentasActual.total)
                  : 0}
              </b>
            </Typography>
            <Box mx={2} />
            <Typography variant="h4">
              Cambio:{" "}
              <b style={{ color: "green" }}>
                $
                {datosVentas.saldo_favor
                  ? formatoMexico(datosVentas.saldo_favor)
                  : 0}
              </b>
            </Typography>
          </Box>
      </Grid>
    </Paper>
  );
}

export default TotalesNotaCredito;
