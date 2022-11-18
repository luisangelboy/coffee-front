import React, { createContext, useState } from "react";

export const AbonosCtx = createContext();

export const AbonosProvider= ({ children }) => {

    const [alert, setAlert] = useState({ message: "", status: "", open: false });
    const [ventas, setVentas] = useState([]);
    const [reload, setReload] = useState(false);
    const [openAbonar, setOpenAbonar] = useState(false);
    const [abonos, setAbonos] = useState([]);

    return (
        <AbonosCtx.Provider
            value={{
                alert, 
                setAlert,
                ventas, 
                setVentas,
                reload, 
                setReload,
                openAbonar, 
                setOpenAbonar,
                abonos,
                setAbonos,
            
            }}
        >
            {children}
        </AbonosCtx.Provider>
    );
};
