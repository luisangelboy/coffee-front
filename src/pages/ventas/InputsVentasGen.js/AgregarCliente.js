import React from "react";
import Box from "@material-ui/core/Box";
import useStyles from "../styles";
import ClientesVentas from "../ClientesVentas";
import ClienteIcon from "../../../icons/usuarios.svg"

export default function AgregarClienteVenta() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();

  return (
    <Box
      width="100%"
      display="flex"
      justifyItems="center"
      alignSelf="center"
      justifySelf="center"
      alignItems="center"
    >
      <Box mt={1} mr={1}>
        <img
          src={ClienteIcon}
          alt="iconoBander"
          className={classes.iconSize}
        />
      </Box>
      <Box width="100%" alignItems="center">
        <ClientesVentas sesion={sesion} />
      </Box>
    </Box>
  );
}
