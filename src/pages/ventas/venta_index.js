import React, { /* useContext, useEffect, */ useState } from "react";
import VentasGenerales from "./VentasGenerales";
import AbrirTurno from "../ventas/AbrirCerrarTurno/AbrirTurno";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
/* import { VentasContext } from "../../context/Ventas/ventasContext"; */
import { DialogTitle } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VentaIndex() {
  /* const { turnoActivo, setTurnoActivo } = useContext(VentasContext);
  const [varActive, setVarActive] = useState(false); */
  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  /* useEffect(() => {
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    setVarActive(sesion.turno_en_caja_activo);
    setTurnoActivo(false);
  }, [turnoActivo]) */;

  return (
    <Box height="100%">
      {sesion.turno_en_caja_activo && turnoEnCurso ? (
        <VentasGenerales />
      ) : (
        <AbrirTurnoEnVentas />
      )}
    </Box>
  );
}

function AbrirTurnoEnVentas() {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      keepMounted
      TransitionComponent={Transition}
      disableEscapeKeyDown={false}
    >
      <DialogTitle>
        Si deseas realizar ventas inicia tu turno primeramente.
      </DialogTitle>
      <AbrirTurno type="FRENTE" setLoading={setLoading} loading={loading} />
    </Dialog>
  );
}
