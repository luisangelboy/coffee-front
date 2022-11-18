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

export default function CategoriasProducto({ categorias, refetch }) {
  const classes = useStyles();
  const { datos_generales, setDatosGenerales, setSubcategorias } = useContext(
    RegProductoContext
  );

  const obtenerDatos = (_, value) => {
    if (!value) {
      setDatosGenerales({
        ...datos_generales,
        categoria: "",
        id_categoria: "",
      });
      setSubcategorias([]);
      return;
    }
    setDatosGenerales({
      ...datos_generales,
      categoria: value.categoria,
      id_categoria: value._id,
    });
    setSubcategorias(value.subcategorias);
  };

  return (
    <Fragment>
      <Typography className={classes.titulos}>Categoria</Typography>
      <Box display="flex">
        <Autocomplete
          id="form-producto-categoria"
          size="small"
          fullWidth
          options={categorias}
          getOptionLabel={(option) => option.categoria}
          renderInput={(param) => {
            let params = {...param}
            params.inputProps.style = { textTransform: "uppercase" };
            return(<TextField {...params} variant="outlined" />)
          }}
          onChange={(_, value) => obtenerDatos(_, value)}
          getOptionSelected={(option, value) =>
            option.categoria === value.categoria
          }
          value={datos_generales.categoria ? datos_generales : null}
        />
        <RegistrarNuevoSelect
          tipo="categoria"
          name="categoria"
          refetch={refetch}
        />
      </Box>
    </Fragment>
  );
}
