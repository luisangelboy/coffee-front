import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { FcDonate } from "react-icons/fc";
import { Box, TextField, Grid, CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import BackdropComponent from "../../../../../components/Layouts/BackDrop";
import { AbonosCtx } from "../../../../../context/Tesoreria/abonosCtx";
import { useApolloClient } from "@apollo/client";
import TablaVentasCredito from "./Components/TablaVentasCredito";
import ButtonLiquidar from "./Components/Liquidar";
import AbonosIcon from "../../../../../icons/salary.svg"

import { useQuery } from "@apollo/client";
import { OBTENER_HISTORIAL_ABONOS_CLIENTE } from "../../../../../gql/Tesoreria/abonos";
import { OBTENER_CLIENTES_VENTAS } from "../../../../../gql/Ventas/ventas_generales";
import { useDebounce } from "use-debounce/lib";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  titleSelect: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: 18,
  },
  icon: {
    width: 100,
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  iconSize: {
    width: 32,
  },
  borderBotonChico: {
    minWidth: "100%",
    minHeight: "100%",
    border: ".6px solid #DBDBDB",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbonosClientes(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const context = useContext(AbonosCtx);

  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [selectedClient, setSelectedClient] = useState("");
  const [pageCliente, setPageCliente] = useState(0);
  const [pageHistorial, setPageHistorial] = useState(0);
  const client = useApolloClient();
  const limit = 6;
  const [dataDocsClientes, setDataDocsClientes] = useState([]);
  const [totalDocsClientes, setTotalDocsClientes] = useState(0);

  const turnoEnCurso = JSON.parse(localStorage.getItem("turnoEnCurso"));
  //const searchfilter = useRef(null);
  const [totalVentas, setTotalVentas] = useState([]);
  let historialVentasACredito = { docs: [], totalDocs: 0 };
  let clientes = [];
  const handleClickOpen = () => setOpen(!open);

  window.addEventListener("keydown", Mi_función);
  function Mi_función(e) {
    if (e.keyCode === 117 && props.fromVentas) {
      handleClickOpen();
    }
  }

  const [VALUE] = useDebounce(textValue, 500);
  const inputRef = useRef(null);

  const obtenerVentasCredito = useQuery(OBTENER_HISTORIAL_ABONOS_CLIENTE, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      idCliente: selectedClient._id,
      limit,
      offset: pageHistorial,
    },
    fetchPolicy: "network-only",
  });

  /* 	const obtenerClientes= useQuery(OBTENER_CLIENTES_VENTAS, {
		variables: {
		  empresa: sesion.empresa._id,
		  sucursal: sesion.sucursal._id,
		  limit,
      	  offset: page,
		},
		fetchPolicy: "network-only",
	});  
 */

  const getClientes = async (filtro = "", page = 0, reset = false) => {
    try {
		setLoadingClientes(true);
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
	  setLoadingClientes(false);
	  if (response.data) {
        setDataDocsClientes(
          filtro
            ? response.data.obtenerClientesVentas.docs
            : reset ? response.data.obtenerClientesVentas.docs
            : [
				...dataDocsClientes,
				...response.data.obtenerClientesVentas.docs,
			  ]
        );
		 setTotalDocsClientes(response.data.obtenerClientesVentas.totalDocs);
		}
      /* if (response.data) {
        setDataDocsClientes();
       
      } */
    } catch (error) {
		setLoadingClientes(false);
      console.log(error);
      setAlert({
        message: "Hubo un error al cargar los clientes",
        status: "error",
        open: true,
      });
    }
  };

  const ChangeClientAutocomplate = (value) => {
	if(!value){
		setPageCliente(0);
		getClientes("", 0, true);
	  }
    try {
      let setVal = value !== null ? value : "";

      setSelectedClient(setVal);
    } catch (error) {
      console.log(error);
    }
  };

  /* useEffect(() => {
    getClientes();
  }, []); */
  useEffect(() => {
    setPageCliente(0);
    getClientes(VALUE, 0, true);
  }, [VALUE]);

  useEffect(() => {
    setLoading(obtenerVentasCredito.loading);
  }, [obtenerVentasCredito.loading]);

  useEffect(() => {
    try {
      if (obtenerVentasCredito.data) {
        let arrayToset = [];
        let total_ventas = 0;
        if (obtenerVentasCredito.data.historialVentasACredito.docs.length > 0) {
          obtenerVentasCredito.data.historialVentasACredito.docs.forEach(
            (element) => {
              total_ventas += element.saldo_credito_pendiente;

              arrayToset.push({
                id_venta: element._id,
                monto_total_abonado: 0,
                saldo_credito_pendiente: parseFloat(
                  element.saldo_credito_pendiente
                ),
              });
            }
          );
          setTotalVentas(parseFloat(total_ventas.toFixed(2)));
          context.setAbonos(arrayToset);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [obtenerVentasCredito.data]);

  if (obtenerVentasCredito.data) {
    historialVentasACredito = obtenerVentasCredito.data.historialVentasACredito;
  }
  /* 
	if(obtenerClientes.data){
		clientes = obtenerClientes.data.obtenerClientesVentas;
	}
	 */
  if (obtenerVentasCredito.error) {
    console.log(obtenerVentasCredito.error);
    if (obtenerVentasCredito.error.networkError.result) {
      console.log(obtenerVentasCredito.error.networkError.result.errors);
    } else if (obtenerVentasCredito.error.graphQLErrors) {
      console.log(obtenerVentasCredito.error.graphQLErrors.message);
    }
  }

  const enviarCantidad = (cantidad, index, _id) => {
    let copyArray = [...context.abonos];

    if (cantidad > 0) {
      copyArray.splice(index, 1, {
        id_venta: _id,
        monto_total_abonado: cantidad,
      });
    } else {
      copyArray.splice(index, 1);
    }
    context.setAbonos(copyArray);
  };

  const loadMoreClientes = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - parseInt(scrollTop + 1) === clientHeight) {
      if (dataDocsClientes.length < totalDocsClientes) {
		console.log("entra")
        let newPage = pageCliente + 1;
        setPageCliente(newPage);
        getClientes("", newPage, false);
      }
    }
  };

  return (
    <Fragment>
      <BackdropComponent loading={loading} setLoading={setLoading} />
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      {props.fromVentas ? (
        <Button
          className={classes.borderBotonChico}
          onClick={handleClickOpen}
          disabled={!turnoEnCurso}
        >
          <Box>
            <Box>
              <FcDonate style={{ fontSize: 35 }} />
            </Box>
            <Box>
              <Typography variant="body2">
                <b>Abonos</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" style={{ color: "#808080" }}>
                <b>F6</b>
              </Typography>
            </Box>
          </Box>
        </Button>
      ) : (
        <Button fullWidth onClick={handleClickOpen}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={AbonosIcon}
                alt="icono abono"
                className={classes.icon}
              />
            </Box>
            Abonos de Clientes
          </Box>
        </Button>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Abonos de Clientes
            </Typography>

            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item md={5}>
            <Box ml={2} mt={1}>
              <Typography
                className={classes.titleSelect}
                color="textPrimary"
                gutterBottom
              >
                <b>Seleccionar cliente </b>
              </Typography>
            </Box>
            <Box ml={3} style={{ width: "80%" }}>
              <Autocomplete
                id="combo-box-producto-codigo"
                size="small"
                fullWidth
                options={dataDocsClientes}
                loading={loadingClientes}
                getOptionLabel={(option) =>
                  option.nombre_cliente ? option.nombre_cliente : "N/A"
                }
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
                          {loadingClientes ? (
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
                  option.nombre_cliente === value.nombre_cliente
                }
				
                ListboxProps={{
                  style: {
                    maxHeight: "150px",
                  },
                  onScroll: loadMoreClientes,
                }}
                value={selectedClient ? selectedClient : null}
              />
            </Box>
          </Grid>

          <Grid item md={7}>
            <Box
              mt={3}
              mr={2}
              display="flex"
              justifyContent="flex-end"
              alignContent="space-between"
            >
              {/*
								context.abonos.length > 0  ?( 
									<ButtonAbonar setOpenAbonar={context.setOpenAbonar}  openAbonar={context.openAbonar}  setSelectedClient={setSelectedClient} selectedClient={selectedClient} ventas={context.ventas} abonos={context.abonos} setAbonos={context.setAbonos} />)
								:
								<div/>
							*/}
              {historialVentasACredito.length > 0 && totalVentas > 0 ? (
                <ButtonLiquidar
                  cliente={selectedClient}
                  total_ventas={totalVentas}
                  setAlert={setAlert}
                  liquidarTodas={true}
                  recargar={obtenerVentasCredito.refetch}
                  setLoading={setLoading}
                />
              ) : (
                <div />
              )}
            </Box>
          </Grid>
        </Grid>
        {/* 	<Grid container >
                    {
                        historialVentasACredito.map((venta, index) =>{
							
                            return(
                                <CardVentaAbono datos={venta} index={index}  setSelectedClient={setSelectedClient} selectedClient={selectedClient}  setOpen={setOpen} enviarCantidad={enviarCantidad}  empresa={sesion.empresa._id} sucursal={sesion.sucursal._id} setAlert={setAlert} />   
                            )
                        })
						
                    } 
                </Grid>  */}
        {historialVentasACredito?.docs.length ? (
          <Box p={2}>
            <TablaVentasCredito
              rows={historialVentasACredito}
              setSelectedClient={setSelectedClient}
              selectedClient={selectedClient}
              setOpen={setOpen}
              enviarCantidad={enviarCantidad}
              setAlert={setAlert}
              setLoading={setLoading}
              recargar={obtenerVentasCredito.refetch}
              limit={limit}
              page={pageHistorial}
              setPage={setPageHistorial}
            />
          </Box>
        ) : (
          <Box />
        )}
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <div />
        )}
      </Dialog>
    </Fragment>
  );
}
