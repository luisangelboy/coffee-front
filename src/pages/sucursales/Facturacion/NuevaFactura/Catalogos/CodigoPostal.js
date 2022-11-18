import React from "react";
import Facturama from "../../../../../billing/Facturama/facturama.api";
import { CircularProgress, InputAdornment, TextField } from "@material-ui/core";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";
import { useDebounce } from "use-debounce/lib";
import { CheckCircle, Error } from "@material-ui/icons";

export default function CodigoPostal() {
  const [loading, setLoading] = React.useState(false);
  const {
    cp_valido,
    setCPValido,
    codigo_postal,
    setCodigoPostal,
    error_validation,
  } = React.useContext(FacturacionCtx);
  const [value, setValue] = React.useState("");

  const [CP] = useDebounce(value, 500);

  const obtenerCodigoPostal = React.useCallback(async (codigo_postal) => {
    if (!codigo_postal) return;
    try {
      setLoading(true);
      const result = await Facturama.Catalogs.PostalCodes(
        codigo_postal,
        function (result) {
          return result;
        }
      );

      if (result) {
        setCPValido(true);
        setLoading(false);
        setCodigoPostal(result[0].Value);
      }
    } catch (error) {
      setLoading(false);
      setCPValido(false);
      setCodigoPostal("");
    }
  }, []);

  React.useEffect(() => {
    obtenerCodigoPostal(CP);
  }, [CP]);

  return (
    <React.Fragment>
      {/* <Typography>Código Postal:</Typography> */}
      <form onSubmit={obtenerCodigoPostal}>
        <TextField
          fullWidth
          name="expedition_place"
          size="small"
          variant="outlined"
          value={value}
          label="Código postal"
          onChange={(e) => setValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {value ? (
                  loading ? (
                    <CircularProgress size={20} />
                  ) : cp_valido ? (
                    <CheckCircle color="primary" />
                  ) : (
                    <Error color="error" />
                  )
                ) : (
                  <div />
                )}
              </InputAdornment>
            ),
          }}
          /* error={value ? cp_valido ? false : true : false}
          helperText={value ? cp_valido ? "" : "Introduce un CP valido" : ""} */

          error={
            error_validation.status && !value
              ? true
              : value
              ? cp_valido
                ? false
                : true
              : false
          }
          helperText={
            error_validation.status && !value
              ? error_validation.message
              : value
              ? cp_valido
                ? ""
                : "Introduce un CP valido"
              : ""
          }
        />
      </form>
    </React.Fragment>
  );
}
