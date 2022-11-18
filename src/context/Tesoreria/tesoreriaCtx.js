import React, { createContext, useState } from "react";

export const TesoreriaCtx = createContext();

export const TesoreriaProvider = ({ children }) => {

    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [cuentas, setCuentas] = useState([]);
    const [cuenta, setCuenta] = useState([]);
    const [reload, setReload] = useState(false);
    
    return (
        <TesoreriaCtx.Provider
            value={{
                alert, 
                setAlert,
                cuentas, 
                setCuentas,
                reload, 
                setReload,
                cuenta, 
                setCuenta
            }}
        >
            {children}
        </TesoreriaCtx.Provider>
    );
};
