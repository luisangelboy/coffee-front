const data = `

    input CrearVentasInput {
        folio: String
        cliente: ClienteVentaInput
        descuento: Float
        ieps: Float
        impuestos: Float
        iva: Float
        monedero: Float
        productos: [ProductosVentasInput]
        subTotal: Float
        total: Float
        venta_cliente: Boolean
        montos_en_caja: {
            monto_efectivo: Float,
            monto_tarjeta: Float,
            monto_creditos: Float,
            monto_monedero: Float,
            monto_transferencia: Float,
            monto_cheques: Float,
            monto_vales_despensa: Float,
        },
        credito: Boolean
    }

    input ProductosVentasInput {
        cantidad: Int
        cantidad_venta: Int
        codigo_barras: String
        concepto: String
        default: Boolean
        descuento: DescuentoProductos
        descuento_activo: Boolean
        granel_producto: ProductoGranelVentasInput
        id_producto: ProductoPopulateVentas
        inventario_general: [InventarioGeneralPrecioVentas]
        precio: Float
        precio_a_vender: Float
        precio_actual_producto: Float
        unidad: String
        unidad_principal: Boolean
    }

    input InventarioGeneralPrecioVentas {
        cantidad_existente: Int
        cantidad_existente_maxima: Int
        unidad_inventario: String
        unidad_maxima: String
    }

    input ProductoPopulateVentas {
        _id: String
        datos_generales: DatosGeneralesVentasInput
        precios: PreciosProductoVentasInput
    }

    input PreciosProductoVentasInput {
        ieps: Float
        ieps_activo: Boolean
        inventario: InventarioVentasInput
        iva: Float
        iva_activo: Boolean
        monedero: Boolean
        monedero_electronico: Float
        precio_de_compra: PrecioCompraProductoVentasInput
        precios_producto: [PreciosProductoPopulateVentasInput]
        unidad_de_compra: UnidadCompraProductoVentasInput
    }

    input UnidadCompraProductoVentasInput {
        cantidad: Int
        precio_unitario_con_impuesto: Float
        precio_unitario_sin_impuesto: Float
        unidad: String
    }

    input PreciosProductoPopulateVentasInput {
        numero_precio: Int
        precio_neto: Float
        precio_venta: Float
        unidad_mayoreo: Int
        utilidad: Float
    }

    input PrecioCompraProductoVentasInput {
        precio_con_impuesto: Float
        precio_sin_impuesto: Float
        iva: Float
        ieps: Float
    }

    input InventarioVentasInput {
        inventario: Int
        inventario_minimo: Int
        unidad_de_inventario: String
    }

    input DatosGeneralesVentasInput {
        clave_alterna: String
        codigo_barras: String
        nombre_comercial: String
        tipo_producto: String
    }

    input ProductoGranelVentasInput {
        granel: Boolean
        valor: Float
    }

    input ClienteVentaInput {
        banco: String
        celular: String
        clave_cliente: String
        curp: String
        dias_credito: String
        direccion: DireccionInputCliente
        email: String
        imagen: String
        limite_credito: Int
        nombre_cliente: String
        numero_cliente: String
        numero_cuenta: String
        numero_descuento: Int
        razon_social: String
        rfc: String
        telefono: String
        monedero_electronico
    } 


    "input":{
        "folio": "1234343",
        "cliente": {
          "banco": "BBVA",
          "celular": "123456789",
          "clave_cliente": "1233",
          "curp": "121313",
          "dias_credito": "30",
          "direccion": {
            "calle": "qwwqwqw",
            "no_ext": "asasasas",
            "no_int": "asasasasa",
            "codigo_postal": "assasasa",
            "colonia": "sdsdsdsds",
            "municipio": "dsdsdsdsd",
            "localidad": "sdsdsdsds",
            "estado": "sdsdsdsdsd",
            "pais": "sdsdsdsdsd"
          },
          "email": "sdsdsdsd",
          "imagen": "sdsdsdsd",
          "limite_credito": 10,
          "nombre_cliente": "12112",
          "numero_cliente": "121211",
          "numero_cuenta": "121212",
          "numero_descuento": 12,
          "razon_social": "12112",
          "rfc": "0292812",
          "telefono": "123453",
          "monedero_electronico": 10.5
        },
        "descuento": 12.2,
        "ieps": 12.22,
        "impuestos": 10,
        "iva": 12,
        "monedero": 12,
        "productos": [
          {
            "cantidad": 12,
            "cantidad_venta": 10,
            "codigo_barras": "121",
            "concepto": "wewe",
            "default": true,
            "descuento": {
              "porciento": 12,
              "dinero_descontado": 10,
              "precio_con_descuento": 10
            },
            "descuento_activo": true,
            "granel_producto": {
                "granel": true,
                "valor": 12.2
            },
            "id_producto": {
                "_id": "12121",
                "datos_generales": {
                    "codigo_barras": "1212",
                    "clave_alterna": "AZU-M",
                    "nombre_comercial": "1121",
                    "tipo_producto": "12112",
                },
                "precios": {
                    "ieps": 1212,
                    "ieps_activo": true,
                    "inventario": {
                        "inventario_minimo": 12,
                        "inventario_maximo": 12,
                        "unidad_de_inventario": "sasas"
                    },
                    "iva": 212,
                    "iva_activo": true,
                    "monedero": true,
                    "monedero_electronico": 121,
                    "precio_de_compra": {
                        "precio_con_impuesto": 12,
                        "precio_sin_impuesto": 12,
                        "iva": 12,
                        "ieps": 121
                    },
                    "precios_producto": [
                        {
                            "numero_precio": 1,
                            "precio_neto": 1,
                            "precio_venta": 12,
                            "unidad_mayoreo": 12,
                            "utilidad": 12
                        }
                    ],
                    "unidad_de_compra": {
                        "cantidad": 12,
                        "precio_unitario_con_impuesto": 12,
                        "precio_unitario_sin_impuesto": 12,
                        "unidad": "qwq",
                    }
                }
            },
            "inventario_general": [
                  {
                      "cantidad_existente": 12,
                      "cantidad_existente_maxima": 12,
                      "unidad_inventario": "wsdsd",
                      "unidad_maxima": "sdsd",
                  }
              ],
              "precio": 121,
              "precio_a_vender": 121,
              "precio_actual_producto": 11,
              "unidad": "pz",
              "unidad_principal": true
          }
        ],
        "subTotal": 12
        "total": 12
        "venta_cliente": true,
        "montos_en_caja": {
          "monto_efectivo": 12,
          "monto_tarjeta": 12,
          "monto_creditos": 12,
          "monto_monedero": 12,
          "monto_transferencia": 23,
          "monto_cheques": 12,
          "monto_vales_despensa": 12
        },
        "credito": true
      },
      "empresa": "1212",
      "sucursal": "1212",
      "usuario": "2124"
    

`;