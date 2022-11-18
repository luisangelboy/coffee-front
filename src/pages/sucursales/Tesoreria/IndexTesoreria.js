import React from 'react';
import { TesoreriaProvider } from '../../../context/Tesoreria/tesoreriaCtx';
import Tesoreria from './Tesoreria';

export default function IndexTesoreria() {
    return (
        <TesoreriaProvider>
            <Tesoreria />
        </TesoreriaProvider>
    )
}
