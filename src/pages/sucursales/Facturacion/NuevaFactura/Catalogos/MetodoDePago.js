import React from "react";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import { FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

export default function MetodoDePago({ obtenerDatos }) {
  const [loading, setLoading] = React.useState(false);
  const [metodos, setMetodos] = React.useState([]);
  const { datosFactura } = React.useContext(FacturacionCtx);

  const obtenerMetodosPago = React.useCallback(async () => {
    try {
      setLoading(true);
      await Facturama.Catalogs.PaymentMethods(
        function (result) {
          console.log(result);
          setMetodos(result);
          setLoading(false);
        },
        function (error) {
          if (error && error.responseJSON) {
            console.log(error.responseJSON);
          }
          setLoading(false);
        }
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    obtenerMetodosPago();
  }, [obtenerMetodosPago]);

  return (
    <React.Fragment>
      <Typography>Metodo de pago:</Typography>
      <FormControl variant="outlined" fullWidth size="small" name="payment_method">
        <Select
          value={loading ? "cargando" : datosFactura.payment_method}
          name="payment_method"
          onChange={obtenerDatos}
          disabled={loading}
        >
          {loading ? <MenuItem value="cargando">Cargando...</MenuItem> : null}
          {metodos.map((res, index) => (
            <MenuItem key={index} value={res.Value}>
              {`${res.Value} - ${res.Name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
