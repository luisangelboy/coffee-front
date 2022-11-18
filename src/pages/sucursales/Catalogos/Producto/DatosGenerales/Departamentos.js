import React, { Fragment, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Typography } from "@material-ui/core";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import RegistrarNuevoSelect from "./RegistrarNuevoSelect";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  titulos: {
    fontWeight: 500,
  },
}));

export default function DepartamentosProducto({ departamentos, refetch }) {
  const classes = useStyles();
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);

  const obtenerDatos = (_, value) => {
    if (!value) {
      setDatosGenerales({
        ...datos_generales,
        departamento: "",
        id_departamento: "",
      });
      return;
    }
    setDatosGenerales({
      ...datos_generales,
      departamento: value.nombre_departamentos,
      id_departamento: value._id,
    });
  };

  return (
    <Fragment>
      <Typography className={classes.titulos}>Departamento</Typography>
      <Box display="flex">
        <Autocomplete
          id="form-producto-departamento"
          size="small"
          fullWidth
          options={departamentos}
          getOptionLabel={(option) =>
            option.nombre_departamentos
              ? option.nombre_departamentos
              : option.departamento
          }
          renderInput={(param) => {
            let params = {...param}
            params.inputProps.style = { textTransform: "uppercase" };
            return(<TextField {...params} variant="outlined" />)
          }}
          onChange={(_, value) => obtenerDatos(_, value)}
          getOptionSelected={(option, value) =>
            option.nombre_departamentos === value.departamento
          }
          value={datos_generales.departamento ? datos_generales : null}
        />
        <RegistrarNuevoSelect
          tipo="departamento"
          name="nombre_departamentos"
          refetch={refetch}
        />
      </Box>
    </Fragment>
  );
}
