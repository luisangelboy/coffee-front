import React, { useState, useEffect, useContext, useRef } from "react";
import { OBTENER_CLIENTES_VENTAS } from "../../gql/Ventas/ventas_generales";
import { useQuery, useApolloClient } from "@apollo/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CircularProgress, TextField } from "@material-ui/core";
// import { BlurLinear } from "@material-ui/icons";
// import { VentasContext } from "../../context/Ventas/ventasContext";
import { ClienteCtx } from "../../context/Catalogos/crearClienteCtx";
import { VentasContext } from "../../context/Ventas/ventasContext";
import { useDebounce } from "use-debounce/lib";

export default function ClientesVentas() {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const datosVentas = JSON.parse(localStorage.getItem("DatosVentas"));
  const { setUpdateClientVenta, updateClientVenta, setClientes } = useContext(
    ClienteCtx
  );
  const { setClientesVentas } = useContext(VentasContext);
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [dataDocs, setDataDocs] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const limit = 10;

  const [selectClient, setSelectClient] = useState({});

  // console.log(sesion.empresa._id);
  // console.log(sesion.sucursal._id);
  const [VALUE] = useDebounce(textValue, 500);
  const inputRef = useRef(null);

  const getClientes = async (filtro = "", page = 0, reset = false) => {
    setLoaded(true);
    try {
      setLoading(true);
      const response = await client.query({
        query: OBTENER_CLIENTES_VENTAS,
        variables: {
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          filtro,
          limit,
          offset: page,
        },
        fetchPolicy: "network-only",
      });
      setLoading(false);
      if (response.data) {
        setDataDocs(
          filtro
            ? response.data.obtenerClientesVentas.docs
            : reset ? response.data.obtenerClientesVentas.docs
            : [...dataDocs, ...response.data.obtenerClientesVentas.docs]
        );
        setTotalDocs(response.data.obtenerClientesVentas.totalDocs);
      }
      if(loaded){
        inputRef.current.focus();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  /* const { loading, data, refetch } = useQuery(OBTENER_CLIENTES_VENTAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
    fetchPolicy: "network-only",
  }); */

  // console.log(error);
  // console.log("data",data);
  /* console.log(data)
  let obtenerClientes = [];
  if (data) obtenerClientes = data.obtenerClientesVentas.docs; */
  // console.log(obtenerClientes);

  const loadMoreItems = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - parseInt(scrollTop + 1) === clientHeight) {
      if (dataDocs.length < totalDocs) {
        let newPage = page + 1;
        setPage(newPage);
        getClientes("", newPage, false);
      }
    }
  };

  useEffect(() => {
    try {
      setClientes(dataDocs);
    } catch (error) {}
  }, [dataDocs]);

  useEffect(() => {
    setPage(0);
    getClientes(VALUE, 0, true);
  }, [VALUE]);

  useEffect(() => {
    if (datosVentas && datosVentas.cliente) {
      if (datosVentas.cliente.nombre_cliente) {
        setSelectClient(datosVentas.cliente);
        setClientesVentas(datosVentas.cliente);
      } else {
        setSelectClient(null);
        setClientesVentas([]);
      }
    } else {
      setSelectClient(null);
      setClientesVentas([]);
    }
    //refetch();
  }, [/* refetch,  */ updateClientVenta]);

  const ChangeClientAutocomplate = (value) => {
    setTextValue("");
    if(!value){
      setPage(0);
      getClientes("", 0, true);
    }
    try {
      const venta = JSON.parse(localStorage.getItem("DatosVentas"));
      let venta_actual = venta === null ? {} : venta;
      setSelectClient(value);

      if (!value && venta.productos.length === 0) {
        localStorage.removeItem("DatosVentas");
        setUpdateClientVenta(!updateClientVenta);
        return;
      }

      // console.log(venta_actual);
      let dataCliente = {
        ...venta_actual,
        subTotal:
          venta_actual.subTotal === undefined ? 0 : venta_actual.subTotal,
        total: venta_actual.total === undefined ? 0 : venta_actual.total,
        impuestos:
          venta_actual.impuestos === undefined ? 0 : venta_actual.impuestos,
        iva: venta_actual.iva === undefined ? 0 : venta_actual.iva,
        ieps: venta_actual.ieps === undefined ? 0 : venta_actual.ieps,
        descuento:
          venta_actual.descuento === undefined ? 0 : venta_actual.descuento,
        monedero:
          venta_actual.monedero === undefined ? 0 : venta_actual.monedero,
        // tipo_cambio: venta_actual.tipo_cambio ? venta_actual.tipo_cambio : {},
        venta_cliente: value === null ? false : true,
        productos:
          venta_actual.productos?.length > 0 ? venta_actual.productos : [],
        tipo_emision: venta_actual.tipo_emision
          ? venta_actual.tipo_emision
          : "TICKET",
      };
      dataCliente = { ...dataCliente, cliente: value ? value : {} };
      localStorage.setItem("DatosVentas", JSON.stringify(dataCliente));
      setUpdateClientVenta(!updateClientVenta);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return (
    <Autocomplete
        size="small"
        fullWidth
        loading={true}
        disabled={true}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="primary" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
  );

  return (
    <div>
      <Autocomplete
        id="combo-box-producto-codigo"
        size="small"
        fullWidth
        openOnFocus={true}
        options={dataDocs}
        loading={loading}
        getOptionLabel={(option) =>
          option.nombre_cliente ? option.nombre_cliente : textValue ? textValue : "Público general"}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            inputRef={inputRef}
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="primary" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onChange={(_, value) => ChangeClientAutocomplate(value)}
        getOptionSelected={(option, value) =>
          option.nombre_cliente === value.nombre_cliente // ? option : "Público general"
        }
        value={selectClient ? selectClient : textValue ? textValue : "Público general"}
        ListboxProps={{
          styles: {
            height: 300,
          },
          onScroll: loadMoreItems,
        }}
      />
    </div>
  );
}
