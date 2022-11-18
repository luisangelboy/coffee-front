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

export default function SubcategoriasProducto({ refetch }) {
  const classes = useStyles();
  const { datos_generales, setDatosGenerales, subcategorias, setSubcategorias } = useContext(RegProductoContext);

  const obtenerDatos = (_, value) => {
    if (!value) {
      setDatosGenerales({
        ...datos_generales,
        subcategoria: "",
        id_subcategoria: "",
      });
      return;
    }
    setDatosGenerales({
      ...datos_generales,
      subcategoria: value.subcategoria,
      id_subcategoria: value._id,
    });
  };

  return (
    <Fragment>
      <Typography className={classes.titulos}>Subcategoria</Typography>
      <Box display="flex">
        <Autocomplete
          id="form-producto-subcategoria"
          size="small"
          fullWidth
          options={subcategorias}
          getOptionLabel={(option) => option.subcategoria}
          renderInput={(param) => {
            let params = {...param}
            params.inputProps.style = { textTransform: "uppercase" };
            return(<TextField {...params} variant="outlined" />)
          }}
          onChange={(_, value) => obtenerDatos(_, value)}
          getOptionSelected={(option, value) =>
            option.subcategoria === value.subcategoria
          }
          value={datos_generales.subcategoria ? datos_generales : null}
        />
        <RegistrarNuevoSelect
          tipo="subcategoria"
          name="subcategoria"
          refetch={refetch}
          subcategorias={subcategorias}
          setSubcategorias={setSubcategorias}
        />
      </Box>
    </Fragment>
  );
}
