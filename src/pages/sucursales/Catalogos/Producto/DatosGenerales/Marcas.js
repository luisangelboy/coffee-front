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

export default function MarcasProducto({ marcas, refetch }) {
  const classes = useStyles();
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);

  const obtenerDatos = (_, value) => {
    if (!value) {
      setDatosGenerales({
        ...datos_generales,
        marca: "",
        id_marca: "",
      });
      return;
    }
    setDatosGenerales({
      ...datos_generales,
      marca: value.nombre_marca,
      id_marca: value._id,
    });
  };

  return (
    <Fragment>
      <Typography className={classes.titulos}>Marca</Typography>
      <Box display="flex">
        <Autocomplete
          id="form-producto-marca"
          size="small"
          fullWidth
          options={marcas}
          getOptionLabel={(option) =>
            option.nombre_marca ? option.nombre_marca : option.marca
          }
          renderInput={(param) => {
            let params = {...param}
            params.inputProps.style = { textTransform: "uppercase" };
            return(<TextField {...params} variant="outlined" />)
          }}
          onChange={(_, value) => obtenerDatos(_, value)}
          getOptionSelected={(option, value) =>
            option.nombre_marca === value.marca
          }
          value={datos_generales.marca ? datos_generales : null}
        />
        <RegistrarNuevoSelect
          tipo="marca"
          name="nombre_marca"
          refetch={refetch}
        />
      </Box>
    </Fragment>
  );
}
