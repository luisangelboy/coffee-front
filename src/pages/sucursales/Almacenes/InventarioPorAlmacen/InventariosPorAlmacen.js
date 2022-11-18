import React, { forwardRef, useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  FormControl,
  Slide,
  Button,
  Box,
  Dialog,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import { useQuery } from "@apollo/client";
import { Close } from "@material-ui/icons";
import ListaProductos from "./ListaProductos";
import ExportarExcel from "../../../../components/ExportExcel";
import ErrorPage from "../../../../components/ErrorPage";
import { useDebounce } from "use-debounce";
import { TraspasosAlmacenContext } from "../../../../context/Almacenes/traspasosAlmacen";
import {
  OBTENER_CATEGORIAS,
  OBTENER_ALMACENES,
} from "../../../../gql/Almacenes/Almacen";
import conceptosAlmacenImg from "../../../../icons/conceptosAlmacen.svg"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  boxControl: {
    margin: theme.spacing(2.5),
    marginTop: 0,
    minWidth: "20%",
    maxWidth: "20%",
  },
  icon: {
    fontSize: 100,
  },
  imagen: {
    width: 100,
  },
  inputBox: {
    margin: 20,
  },
  button: {
    margin: theme.spacing(3),
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InventariosPorAlmacen(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    props.productosAlmacenQuery.refetch();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={conceptosAlmacenImg}
              alt="icono almacen"
              className={classes.imagen}
            />
          </Box>
          Inventario por almacen
        </Box>
      </Button>
      <InventarioPorAlmacen
        open={open}
        productos={props.productos}
        productosAlmacenQuery={props.productosAlmacenQuery}
        handleClose={handleClose}
        page={props.page}
        setPage={props.setPage}
        limit={props.limit}
      />
    </div>
  );
}

const InventarioPorAlmacen = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const [filtro, setFiltro] = useState("");

  const { dataExcel, setDataExcel } = useContext(TraspasosAlmacenContext);

  const [obtenerAlmacenes, setObtenerAlmacenes] = useState([]);
  // const [ almacen, setAlmacen ] = React.useState('');

  const [value] = useDebounce(filtro, 700);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  // let tipos = ['ROPA','CALZADO','OTROS'];
  const [columns, setColumns] = useState([]);

  /* Queries */
  //const {  data, error, refetch } = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
  /* 	const [getQuery, { data, error }] = useLazyQuery(OBTENER_PRODUCTOS_ALMACEN, {
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			filtro: value
		},
		fetchPolicy: "network-only"
	}); */
  /*  const productosAlmacenQuery = useQuery(OBTENER_PRODUCTOS_ALMACEN,{
		variables: {
            empresa: sesion.empresa._id,
			sucursal: sesion.sucursal._id,
			filtro: ''
		},
		fetchPolicy: "network-only"
	});	  */

  const categoriasQuery = useQuery(OBTENER_CATEGORIAS, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    },
    fetchPolicy: "network-only",
  });

  const queryObtenerAlmacenes = useQuery(OBTENER_ALMACENES, {
    variables: {
      id: sesion.sucursal._id,
    },
    fetchPolicy: "network-only",
  });

  /* useEffect(() => {
		queryObtenerAlmacenes.refetch();
	},[ queryObtenerAlmacenes.update, queryObtenerAlmacenes ]);  */

  useEffect(() => {
    try {
      if (props.open) {
        setDataExcel([]);
        queryObtenerAlmacenes.refetch();
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.open]);

  useEffect(() => {
    if (value !== "") {
      props.productosAlmacenQuery.refetch({
        input: {
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
          filtro: value,
        },
        limit: 10,
        offset: 0,
      });
      props.setPage(0);
    }
  }, [value]);

  /* useEffect(() => {
		try {
			if(props.productosAlmacenQuery.data){
				
				setProductos(props.productosAlmacenQuery.data.obtenerProductosAlmacenes);
				setLoading(false);
			}
		} catch (error) {
			
		}
	},[ props.productosAlmacenQuery.data]);  */

  useEffect(() => {
    if (queryObtenerAlmacenes.data) {
      const columnsEffect = [
        {
          id: "codigo_barras",
          label: "Código de barras",
          minWidth: 60,
          widthPx: 160,
        },
        {
          id: "nombre_comercial",
          label: "Nombre comercial",
          minWidth: 170,
          widthPx: 160,
        },
        {
          id: "costo_producto",
          label: "Costo producto",
          minWidth: 60,
          widthPx: 100,
        },
        {
          id: "costo_total_produc",
          label: "Costo total productos",
          minWidth: 60,
          widthPx: 100,
        },
      ];
      let almace = queryObtenerAlmacenes.data.obtenerAlmacenes;
      almace.forEach((element) => {
        columnsEffect.push({
          id: element._id,
          label: element.nombre_almacen,
          minWidth: 60,
          widthPx: 160,
        });
      });
      columnsEffect.push({
        id: "total",
        label: "Total existencias",
        minWidth: 60,
        widthPx: 160,
      });
      setObtenerAlmacenes(almace);
      setColumns(columnsEffect);
    }
  }, [queryObtenerAlmacenes.data]);

  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Inventario por almacén
          </Typography>
          <Box mx={3}>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setLoading(true);
                  props.handleClose();
                }}
                size="large"
              >
                <Close style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Box>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          ></IconButton>
        </Toolbar>
      </AppBar>
      <Box mt={2}>
        <Box ml={4}>
          <Typography className={classes.subtitle}>
            <b>Buscar producto</b>
          </Typography>
        </Box>
        <Box ml={4} display="flex">
          <Box style={{ width: "35%" }}>
            <FormControl variant="outlined" fullWidth size="small">
              <OutlinedInput
                id="search-producto"
                type="text"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                endAdornment={
                  <InputAdornment position="start">
                    <IconButton
                      type="submit"
                      aria-label="search producto"
                      edge="end"
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          {props.productos.docs?.length > 0 ? (
            <Box
              ml={4}
              mrstyle={{ backgroundColor: "red", alignContent: "flex-end" }}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Box>
                <ExportarExcel
                  fileName="Inventarios almacen"
                  data={dataExcel}
                  columnName={columns}
                />
              </Box>
            </Box>
          ) : (
            <div />
          )}
        </Box>
      </Box>

      {loading && props.productos.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <CircularProgress />
        </Box>
      ) : props.productosAlmacenQuery.error || categoriasQuery.error ? (
        <ErrorPage error={props.productosAlmacenQuery.error} />
      ) : props.open ? (
        <Box mx={5} mt={1}>
          <ListaProductos
            productos={props.productos}
            obtenerAlmacenes={obtenerAlmacenes}
            columns={columns}
            page={props.page}
            setPage={props.setPage}
            limit={props.limit}
            loading={props.productosAlmacenQuery.loading}
          />
        </Box>
      ) : (
        <CircularProgress />
      )}
    </Dialog>
  );
};
