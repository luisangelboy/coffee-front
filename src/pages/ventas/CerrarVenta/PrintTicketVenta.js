import { Impresora } from "../../../components/TicketPrinter/Impresora";
import { formatoMexico } from "../../../config/reuserFunctions";
import { formaPago } from "../../sucursales/Facturacion/catalogos";
import moment from "moment";
import table from 'text-table';
const RUTA_API = "http://localhost:8000";

export const imprimirTicketVenta = async (datos) => {
  try {
    const { ventaFinal, monto_pagado, turno, sesion } = datos;
    //sacar la forma de pago
    let forma_pago = "";
    formaPago.forEach((element) => {
      if (ventaFinal.forma_pago === element.Value) forma_pago = element.Name;
    });
    // obtener direccion
    let direccion = "";
    let municipio = "";
    let pais = "";
    const { direccionFiscal } = sesion.empresa;
    if (
      direccionFiscal &&
      direccionFiscal.calle &&
      direccionFiscal.no_ext &&
      direccionFiscal.municipio &&
      direccionFiscal.estado &&
      direccionFiscal.pais
    ) {
      direccion = `${direccionFiscal.calle} #${direccionFiscal.no_ext}`;
      municipio = `${direccionFiscal.municipio}, ${direccionFiscal.estado}`;
      pais = direccionFiscal.pais;
    }

    let tableHead = table([
      ['Articulo      ', 'Cantidad', 'Precio', 'Importe']
    ],{ align: [ 'l', 'r' ] });

    let tableBody = [{align: [ 'l', 'r' ]}];

    let tableTotal = table([
      [`SUBTOTAL:  `, `${formatoMexico(ventaFinal.subTotal)}`],
      [`IMPUESTOS:  `, `${formatoMexico(ventaFinal.impuestos)}`],
      [`TOTAL:  `, `${formatoMexico(ventaFinal.total)}`],
    ],{align: [ 'l', 'r' ]})
    let tablePago = table([
      [`Pago con: ${forma_pago}`, `${formatoMexico(monto_pagado)}`],
      [`Su cambio:  `, `${formatoMexico(ventaFinal.cambio)}`],
    ],{align: [ 'l', 'r' ]})

    ventaFinal.productos.forEach((res) => {
      const { nombre_comercial } = res.id_producto.datos_generales;
      tableBody.push([`${nombre_comercial}`, `${res.cantidad_venta} ${res.unidad}`, ` ${formatoMexico(res.precio_actual_object.precio_neto)}`, `${formatoMexico(res.precio_a_vender)}`])
    });

    tableBody = table(tableBody);

    let impresora = new Impresora(RUTA_API);
    impresora.cutPartial();
    impresora.setFontSize(1, 1);
    impresora.setEmphasize(0);
    impresora.write("Punto de venta CAFI\n");
    impresora.write(`RFC ${sesion.empresa.rfc}\n`);
    impresora.write(`Regimen fiscal ${sesion.empresa.regimen_fiscal}\n`);
    impresora.write(`Domicilio: ${direccion}\n`);
    impresora.write(`${municipio}\n`);
    impresora.write(`${pais}\n`);
    impresora.feed(1);
    impresora.write("****Ticket de venta****\n");
    impresora.write(`Caja ${turno.numero_caja}\n`);
    impresora.write(`Folio: ${ventaFinal.folio}\n`);
    impresora.write(
      `Fecha: ${moment()
        .locale("es-mx")
        .format("DD/MM/YYYY")} Hora: ${moment()
        .locale("es-mx")
        .format("LTS")}\n`
    );
    impresora.feed(1);
    impresora.write("=======================================\n");
    impresora.setAlign("right");
    impresora.write(`${tableHead}\n`);
    impresora.write("_______________________________________\n");
    impresora.write(`${tableBody}\n`);
    impresora.write("----------------------------------------\n");
    impresora.write(`${tableTotal}\n`);
    impresora.write("----------------------------------------\n");
    impresora.write(`${tablePago}\n`);
    impresora.write("========================================\n");
    impresora.feed(1);
    impresora.setAlign("center");
    impresora.write("***Gracias por su compra***");
    impresora.feed(3);
    impresora.cut();
    /* impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial */

    await impresora.end();

  } catch (error) {
    console.log(error);
  }
};
