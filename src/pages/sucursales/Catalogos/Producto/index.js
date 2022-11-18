import React from 'react'
import { RegProductoProvider } from '../../../../context/Catalogos/CtxRegProducto'
import Productos from './Productos'
 
export default function ProductoIndex(){

    return (
        <RegProductoProvider>
            <Productos />
        </RegProductoProvider>
    )
}