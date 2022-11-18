import { Impresora } from "../../../../components/TicketPrinter/Impresora";
import { formatoMexico } from "../../../../config/reuserFunctions";
import table from "text-table";
import moment from "moment";
const RUTA_API = "http://localhost:8000";

export const imprimirTicketCorte = async (
  corte,
  montos,
  fechaInicio,
  fechaFin
) => {
  const {
    monto_efectivo,
    monto_tarjeta_debito,
    monto_tarjeta_credito,
    monto_transferencia,
    monto_monedero,
    monto_creditos,
    monto_cheques,
    monto_vales_despensa,
  } = corte.montos_en_caja;

  let tableHead = table([
    ["Concepto", "     ", "Caja", "   ", "Sistema", "Diferencia"],
  ]);

  var tableBody = table([
    [
      "EFECTIVO ",
      `${formatoMexico(monto_efectivo.monto)}`,
      ` ${formatoMexico(montos.monto_efectivo)}`,
      `${formatoMexico(monto_efectivo.monto - montos.monto_efectivo)}`,
    ],
    [
      "T. DEBITO",
      `${formatoMexico(monto_tarjeta_debito.monto)}`,
      `${formatoMexico(montos.monto_tarjeta_debito)}`,
      `${formatoMexico(
        monto_tarjeta_debito.monto - montos.monto_tarjeta_debito
      )}`,
    ],
    [
      "T. CREDITO",
      `${formatoMexico(monto_tarjeta_credito.monto)}`,
      `${formatoMexico(montos.monto_tarjeta_credito)}`,
      `${formatoMexico(
        monto_tarjeta_credito.monto - montos.monto_tarjeta_credito
      )}`,
    ],
    [
      "TRANSFERENCIAS",
      `${formatoMexico(monto_transferencia.monto)}`,
      `${formatoMexico(montos.monto_transferencia)}`,
      ` ${formatoMexico(
        monto_transferencia.monto - montos.monto_transferencia
      )}`,
    ],
    [
      "MONEDERO",
      `${formatoMexico(monto_monedero.monto)}`,
      `${formatoMexico(montos.monto_monedero)}`,
      `${formatoMexico(monto_monedero.monto - montos.monto_monedero)}`,
    ],
    [
      "CREDITOS",
      `${formatoMexico(monto_creditos.monto)}`,
      `${formatoMexico(montos.monto_creditos)}`,
      `${formatoMexico(monto_creditos.monto - montos.monto_creditos)}`,
    ],
    [
      "CHEQUES",
      `${formatoMexico(monto_cheques.monto)}`,
      `${formatoMexico(montos.monto_cheques)}`,
      `${formatoMexico(monto_cheques.monto - montos.monto_cheques)}`,
    ],
    [
      "VALES DESP.",
      `${formatoMexico(monto_vales_despensa.monto)}`,
      `${formatoMexico(montos.monto_vales_despensa)} `,
      `${formatoMexico(
        monto_vales_despensa.monto - montos.monto_vales_despensa
      )}`,
    ],
  ]);

  try {
    let impresora = new Impresora(RUTA_API);
    impresora.cut();
    impresora.setFontSize(1, 1);
    impresora.setEmphasize(0);
    impresora.setAlign("center");
    impresora.write("Punto de venta CAFI\n");
    impresora.write("****CORTE CAJA****\n");
    impresora.write("Fecha y hora\n");
    impresora.write(
      `Del ${moment(fechaInicio).locale("es-mx").format("lll")}\n`
    );
    impresora.write(`Al ${moment(fechaFin).locale("es-mx").format("lll")}\n`);
    impresora.feed(1);
    impresora.write(`Usuario: ${corte.usuario_en_turno.nombre}\n`);
    impresora.write(
      `No. usuario: ${corte.usuario_en_turno.numero_usuario} Caja: ${corte.numero_caja}\n`
    );
    impresora.write(`Turno: ${corte.horario_en_turno}\n`);
    impresora.write(`Sucursal: ${corte.sucursal.nombre_sucursal}\n`);
    impresora.feed(1);
    impresora.setFontSize(2, 1);
    impresora.write("Montos\n");
    impresora.feed(1);
    impresora.setFontSize(1, 1);
    impresora.setAlign("left");
    impresora.write(`${tableHead}\n`);
    impresora.write("________________________________________________\n");
    impresora.write(`${tableBody}\n`);
    impresora.feed(3);
    impresora.cut();
    impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial

    await impresora.end();
  } catch (error) {
    console.log(error);
  }
};
