import React from "react";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import { FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

export default function TipoDeCambio({ obtenerDatos }) {
  const [loading, setLoading] = React.useState(false);
  const [monedas, setMonedas] = React.useState([]);
  const { datosFactura } = React.useContext(FacturacionCtx);

  const obtenerMoneda = React.useCallback(async () => {
    try {
      setLoading(true);
      await Facturama.Catalogs.Currencies(
        function (result) {
          console.log(result);
          setMonedas(result);
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
    obtenerMoneda();
  }, [obtenerMoneda]);

  return (
    <React.Fragment>
      <Typography>Moneda:</Typography>
      <FormControl variant="outlined" fullWidth size="small" name="currency">
        <Select
          value={loading ? "cargando" : datosFactura.currency}
          name="currency"
          onChange={obtenerDatos}
          disabled={loading}
        >
          {loading ? <MenuItem value="cargando">Cargando...</MenuItem> : null}
          {monedas.map((res, index) => (
            <MenuItem key={index} value={res.Value}>
              {`${res.Value} - ${res.Name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
