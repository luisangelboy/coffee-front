import React from "react";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import { FormControl, MenuItem, Select, Typography } from "@material-ui/core";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

export default function TipoDeCfdi({ obtenerDatos }) {
  const [loading, setLoading] = React.useState(false);
  const [tipo_cfdi, setTipoCfdi] = React.useState([]);
  const { datosFactura } = React.useContext(FacturacionCtx);

  const obtenerTipoCfdi = React.useCallback(async () => {
    try {
      setLoading(true);
      await Facturama.Catalogs.CfdiTypes(
        function (result) {
          console.log(result);
          setTipoCfdi(result);
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
    obtenerTipoCfdi();
  }, [obtenerTipoCfdi]);

  return (
    <React.Fragment>
      <Typography>Tipo de factura:</Typography>
      <FormControl variant="outlined" fullWidth size="small" name="cfdi_type">
        <Select
          value={loading ? "cargando" : datosFactura.cfdi_type}
          name="cfdi_type"
          onChange={obtenerDatos}
          disabled={loading}
        >
          {loading ? <MenuItem value="cargando">Cargando...</MenuItem> : null}
          {tipo_cfdi.map((res, index) => (
            <MenuItem key={index} value={res.Value}>
              {`${res.Value} - ${res.Name}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
