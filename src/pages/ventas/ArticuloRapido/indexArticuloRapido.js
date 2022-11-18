import React from 'react'
import { RegProductoProvider } from '../../../context/Catalogos/CtxRegProducto'
import ArticuloRapido from './ArticuloRapido'
 
export default function ProductoRapidoIndex({handleClickOpen}){

    return (
        <RegProductoProvider>
            <ArticuloRapido handleClickOpen={handleClickOpen} />
        </RegProductoProvider>
    )
}