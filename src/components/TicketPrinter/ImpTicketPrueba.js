import { Impresora } from "./Impresora";
const RUTA_API = "http://localhost:8000";

export const imprimirTicketVenta = async () => {
  try {
    let impresora = new Impresora(RUTA_API);
    impresora.feed(1);
    impresora.setAlign("center");
    impresora.write("***Ticket de prueba***");
    impresora.feed(3);
    impresora.cut();
    /* impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial */

    await impresora.end();

  } catch (error) {
    console.log(error);
  }
};
