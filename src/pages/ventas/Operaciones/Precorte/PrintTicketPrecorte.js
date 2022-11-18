import { Impresora } from "../../../../components/TicketPrinter/Impresora";
import { formatoMexico } from "../../../../config/reuserFunctions";
import moment from "moment";
const RUTA_API = "http://localhost:8000";

export const imprimirTicketPrecorte = async (datos) => {
  try {
    const { monto, turno, sesion } = datos;

    let impresora = new Impresora(RUTA_API);
    impresora.setFontSize(1, 1);
    impresora.setEmphasize(0);
    impresora.setAlign("center");
    impresora.write("Punto de venta CAFI\n");
    impresora.write("****PRE CORTE CAJA****\n");
    impresora.feed(1);
    impresora.write(`Caja ${turno.numero_caja}\n`);
    impresora.write(`Usuario: ${sesion.nombre}\n`);
    impresora.write(
      `Fecha: ${moment()
        .locale("es-mx")
        .format("DD/MM/YYYY")} Hora: ${moment()
        .locale("es-mx")
        .format("LTS")}\n`
    );
    impresora.feed(1);
    impresora.setFontSize(2,1);
    impresora.write("Monto total en caja\n")
    impresora.setFontSize(2,2);
    impresora.write(`$ ${formatoMexico(monto)}\n`);
    impresora.setFontSize(1, 1);
    impresora.feed(3);
    impresora.cut();
    impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial

    await impresora.end();

  } catch (error) {
    console.log(error);
  }
};
