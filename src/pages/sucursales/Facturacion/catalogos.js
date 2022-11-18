import moment from "moment";

export const usosCfdi = [
  {
    Value: "G01",
    Name: "Adquisición de mercancías",
  },
  {
    Value: "G02",
    Name: "Devoluciones, descuentos o bonificaciones",
  },
  {
    Value: "G03",
    Name: "Gastos en general",
  },
  {
    Value: "I01",
    Name: "Construcciones",
  },
  {
    Value: "I02",
    Name: "Mobiliario y equipo de oficina por inversiones",
  },
  {
    Value: "I03",
    Name: "Equipo de transporte",
  },
  {
    Value: "I04",
    Name: "Equipo de cómputo y accesorios",
  },
  {
    Value: "I05",
    Name: "Dados, troqueles, moldes, matrices y herramental",
  },
  {
    Value: "I06",
    Name: "Comunicaciones telefónicas",
  },
  {
    Value: "I07",
    Name: "Comunicaciones satelitales",
  },
  {
    Value: "I08",
    Name: "Otra maquinaria y equipo",
  },
  {
    Value: "D01",
    Name: "Honorarios médicos, dentales y gastos hospitalarios",
  },
  {
    Value: "D02",
    Name: "Gastos médicos por incapacidad o discapacidad",
  },
  {
    Value: "D03",
    Name: "Gastos funerales.",
  },
  {
    Value: "D04",
    Name: "Donativos",
  },
  {
    Value: "D05",
    Name:
      "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).",
  },
  {
    Value: "D06",
    Name: "Aportaciones voluntarias al SAR.",
  },
  {
    Value: "D07",
    Name: "Primas por seguros de gastos médicos.",
  },
  {
    Value: "D08",
    Name: "Gastos de transportación escolar obligatoria.",
  },
  {
    Value: "D09",
    Name:
      "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.",
  },
  {
    Value: "D10",
    Name: "Pagos por servicios educativos (colegiaturas)",
  },
  {
    Value: "P01",
    Name: "Por definir",
  },
];
export const tiposCfdi = [
  {
    NameId: 1,
    Name: "Factura",
    Value: "I",
  },
  {
    NameId: 2,
    Name: "Nota de Crédito",
    Value: "E",
  },
  {
    NameId: 14,
    Name: "Complemento de pago",
    Value: "P",
  },
];
export const tipoCambio = [
  {
    Value: "MXN",
    Name: "Peso Mexicano",
  },
  {
    Value: "EUR",
    Name: "Euro",
  },
  {
    Value: "USD",
    Name: "Dolar Americano",
  },
];
export const formaPago = [
  {
    Name: "Efectivo",
    Value: "01",
  },
  {
    Name: "Cheque nominativo",
    Value: "02",
  },
  {
    Name: "Transferencia electrónica de fondos",
    Value: "03",
  },
  {
    Name: "Tarjeta de crédito",
    Value: "04",
  },
  {
    Name: "Monedero electrónico",
    Value: "05",
  },
  {
    Name: "Dinero electrónico",
    Value: "06",
  },
  {
    Name: "Vales de despensa",
    Value: "08",
  },
  /* {
        Name: "Dación en pago",
        Value: "12"
    },
    {
        Name: "Pago por subrogación",
        Value: "13"
    },
    {
        Name: "Pago por consignación",
        Value: "14"
    },
    {
        Name: "Condonación",
        Value: "15"
    },
    {
        Name: "Compensación",
        Value: "17"
    },
    {
        Name: "Novación",
        Value: "23"
    },
    {
        Name: "Confusión",
        Value: "24"
    },
    {
        Name: "Remisión de deuda",
        Value: "25"
    },
    {
        Name: "Prescripción o caducidad",
        Value: "26"
    },
    {
        Name: "A satisfacción del acreedor",
        Value: "27"
    }, */
  {
    Name: "Tarjeta de débito",
    Value: "28",
  },
  /* {
        Name: "Tarjeta de servicios",
        Value: "29"
    }, */
  {
    Name: "Aplicación de anticipos",
    Value: "30",
  },
  /* {
        Name: "Intermediarios",
        Value: "31"
    }, */
  {
    Name: "Por definir",
    Value: "99",
  },
];
export const metodoPago = [
  {
    Value: "PPD",
    Name: "Pago en parcialidades ó diferido",
  },
  {
    Value: "PUE",
    Name: "Pago en una sola exhibición",
  },
];
export const regimenFiscal = [
  {
    Natural: false,
    Moral: true,
    Name: "General de Ley Personas Morales",
    Value: "601",
  },
  {
    Natural: false,
    Moral: true,
    Name: "Personas Morales con Fines no Lucrativos",
    Value: "603",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
    Value: "605",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Arrendamiento",
    Value: "606",
  },
  {
    Natural: false,
    Moral: true,
    Name: "Régimen de Enajenación o Adquisición de Bienes",
    Value: "607",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Demás ingresos",
    Value: "608",
  },
  {
    Natural: true,
    Moral: true,
    Name:
      "Residentes en el Extranjero sin Establecimiento Permanente en México",
    Value: "610",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Ingresos por Dividendos (socios y accionistas)",
    Value: "611",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Personas Físicas con Actividades Empresariales y Profesionales",
    Value: "612",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Ingresos por intereses",
    Value: "614",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Régimen de los ingresos por obtención de premios",
    Value: "615",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Sin obligaciones fiscales",
    Value: "616",
  },
  {
    Natural: false,
    Moral: true,
    Name:
      "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
    Value: "620",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Incorporación Fiscal",
    Value: "621",
  },
  {
    Natural: true,
    Moral: true,
    Name: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
    Value: "622",
  },
  {
    Natural: false,
    Moral: true,
    Name: "Opcional para Grupos de Sociedades",
    Value: "623",
  },
  {
    Natural: false,
    Moral: true,
    Name: "Coordinados",
    Value: "624",
  },
  {
    Natural: true,
    Moral: false,
    Name:
      "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
    Value: "625",
  },
  {
    Natural: false,
    Moral: true,
    Name: "Hidrocarburos",
    Value: "628",
  },
  {
    Natural: true,
    Moral: false,
    Name:
      "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales",
    Value: "629",
  },
  {
    Natural: true,
    Moral: false,
    Name: "Enajenación de acciones en bolsa de valores",
    Value: "630",
  },
];

