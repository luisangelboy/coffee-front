import { gql } from '@apollo/client';

export const OBTENER_HISTORIAL_EGRESOS = gql`
    query ObtenerHistorialEgresos($input: ObtenerHistorialEgresosInput, $empresa: ID!, $sucursal: ID!){
        obtenerHistorialEgresos(input: $input, empresa: $empresa, sucursal: $sucursal){
            folio_egreso
            folio_factura
            empresa_distribuidora
            provedor
            productos {
                cantidad_productos
                precio_unitario
                producto
                total
            }
            categoria
            subCategoria
            metodo_pago
            fecha_compra
            fecha_registro
            fecha_vencimiento
            observaciones
            compra_credito
            credito_pagado
            saldo_credito_pendiente
            saldo_total
            numero_usuario_creador
            nombre_usuario_creador
            id_user
            empresa
            sucursal         
        }
    }
`

export const CREAR_EGRESO = gql`
    mutation CrearEgreso($input: CrearEgresosInput, $empresa: ID!, $sucursal: ID!){
        crearEgreso(input: $input, empresa: $empresa, sucursal: $sucursal){
            message
        }
    }
`;