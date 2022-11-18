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
import { Box, IconButton, InputAdornment, TextField } from "@material-ui/core";
import TablaAbonos from "./Components/TablaAbonos";
import { useQuery } from "@apollo/client";
import { TesoreriaCtx } from "../../../../../context/Tesoreria/tesoreriaCtx";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import { OBTENER_ABONOS_PROVEEDORES } from "../../../../../gql/Tesoreria/abonos";
import AbonosIcon from "../../../../../icons/salary.svg"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    width: 100,
  },
  rootSearch: {
    display: "flex",
    paddingLeft: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AbonosProveedores(props) {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { reload, setReload, setCuentas } = useContext(TesoreriaCtx);

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const searchfilter = useRef(null);
  const [page, setPage] = useState(0);

  const limit = 15;

  const { loading, data, refetch } = useQuery(OBTENER_ABONOS_PROVEEDORES, {
    variables: {
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
      filtro: filtro,
      limit,
      offset: page,
    },
    fetchPolicy: "network-only",
  });

  if (data) {
    setCuentas(data.obtenerAbonosProveedores);
  }

  useEffect(() => {
    refetch();

    setReload(false);
  }, [reload, refetch]);

  useEffect(() => {
    try {
      refetch({ filtro: filtro, fecha: "" });
    } catch (error) {}
  }, [filtro]);

  const handleClickOpen = () => setOpen(!open);

  const obtenerBusqueda = (e, value) => {
    e.preventDefault();
    setFiltro(value);
  };

  return (
    <Fragment>
      <Button fullWidth onClick={handleClickOpen}>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="center" alignItems="center">
            <img
              src={AbonosIcon}
              alt="icono abono"
              className={classes.icon}
            />
          </Box>
          Abonos de provedores
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClickOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Abonos a Provedores
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
        <Box display="flex" p={2}>
          <Box minWidth="40%">
            <form onSubmit={(e) => obtenerBusqueda(e, e.target[0].value)}>
              <TextField
                inputRef={searchfilter}
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Buscar una compra..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" color="primary" size="medium">
                        <SearchOutlined />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
        </Box>
        <Box p={2}>
          <TablaAbonos
            loading={loading}
            refetch={refetch}
            limit={limit}
            setPage={setPage}
            page={page}
          />
        </Box>
      </Dialog>
    </Fragment>
  );
}
