import React from "react";

import AbonosClientes from '../../sucursales/Tesoreria/Abonos/Clientes/AbonosClientes';
import {AbonosProvider} from "../../../context/Tesoreria/abonosCtx";


export default function Abonos() {

  return (
    <>
    <AbonosProvider>
      <AbonosClientes fromVentas={true} />
    </AbonosProvider>  
    </>
  );
}
