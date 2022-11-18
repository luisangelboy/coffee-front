import React, { createContext, useState } from "react";
import arregloVacio from "../../pages/sucursales/Catalogos/Usuarios/AsingarAccesos/arregloVacioAcceso";

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({
    direccion: {
      calle: "",
      no_ext: "",
      no_int: "",
      codigo_postal: "",
      colonia: "",
      municipio: "",
      localidad: "",
      estado: "",
      pais: "",
    },
    estado_usuario: true,
    accesos: arregloVacio,
  });
  const [toUpdate, setToUpdate] = useState(false);
  const [error, setError] = useState({ error: false, message: "" });
  const [update, setUpdate] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <UsuarioContext.Provider
      value={{
        usuario,
        setUsuario,
        toUpdate,
        setToUpdate,
        error,
        setError,
        update,
        setUpdate,
        username,
        setUsername,
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};
