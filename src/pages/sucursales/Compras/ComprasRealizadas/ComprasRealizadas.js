import React, { Fragment, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { FcInspection } from "react-icons/fc";
import ListaCompras from "./ListaCompras";
import { useQuery } from "@apollo/client";
import { OBTENER_COMPRAS_REALIZADAS } from "../../../../gql/Compras/compras";
import ErrorPage from "../../../../components/ErrorPage";
import { SearchOutlined } from "@material-ui/icons";
import moment from "moment";
import ExportarComprasExcel from "./ExportarComprasExcel";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  icon: {
    fontSize: 100,
  },
  formInputFlex: {
    display: "flex",
    "& > *": {
      margin: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  },
  formInput: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ComprasRealizadas() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
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
            <FcInspection className={classes.icon} />
          </Box>
          Compras realizadas
        </Box>
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Compras realizadas
            </Typography>
            <Box m={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                size="large"
              >
                <CloseIcon style={{ fontSize: 30 }} />
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <ContentDialogCompras />
        </Container>
      </Dialog>
    </div>
  );
}

const ContentDialogCompras = () => {
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [filtro, setFiltro] = useState("");
  const [filtroFecha, setFiltroFecha] = useState({ fecha: "", since: "todos" });
  const [page, setPage] = useState(0);
  const searchfilter = useRef(null);
  const filterDate = useRef(null);
  const limit = 20;

  /* Queries */
  const { loading, data, error, refetch } = useQuery(
    OBTENER_COMPRAS_REALIZADAS,
    {
      variables: {
        empresa: sesion.empresa._id,
        sucursal: sesion.sucursal._id,
        fecha: filtroFecha.fecha,
        limit,
        offset: 0,
      },
      fetchPolicy: "network-only",
    }
  );

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        <CircularProgress />
        <Typography variant="h5">Cargando</Typography>
      </Box>
    );
  if (error) {
    return <ErrorPage error={error} altura={300} />;
  }

  let obtenerComprasRealizadas = [];
  if (data) obtenerComprasRealizadas = data.obtenerComprasRealizadas;

  const obtenerBusqueda = (e, value) => {
    e.preventDefault();
    refetch({ filtro: value, fecha: filtroFecha.fecha, offset: 0 });
    setFiltro(value);
    setPage(0);
  };

  const handleDeleteFiltro = () => {
    refetch({ filtro: "", fecha: filtroFecha.fecha, offset: 0 });
    setFiltro("");
    setPage(0);
    searchfilter.current.value = "";
  };
  const handleDeleteFecha = () => {
    setPage(0);
    refetch({ filtro, fecha: "", offset: 0 });
    setFiltroFecha({ since: "todos", fecha: "" });
    filterDate.current.value = "todos";
  };

  const obtenerFecha = (value) => {
    switch (value) {
      case "7 dias":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(7, "d").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(7, "d").format(),
          offset: 0,
        });
        setPage(0);
        break;
      case "2 semanas":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(2, "w").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(2, "w").format(),
          offset: 0,
        });
        setPage(0);
        break;
      case "1 mes":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(1, "M").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(1, "M").format(),
          offset: 0,
        });
        setPage(0);
        break;
      case "3 meses":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(3, "M").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(3, "M").format(),
          offset: 0,
        });
        setPage(0);
        break;
      case "6 meses":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(6, "M").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(6, "M").format(),
          offset: 0,
        });
        setPage(0);
        break;
      case "8 meses":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(8, "M").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(8, "M").format(),
          offset: 0,
        });
        setPage(0);
        break;
      case "1 año":
        setFiltroFecha({
          since: value,
          fecha: moment().subtract(1, "y").format(),
        });
        refetch({
          filtro,
          fecha: moment().subtract(1, "y").format(),
          offset: 0,
        });
        setPage(0);
        break;
      default:
        setFiltroFecha({ since: "todos", fecha: "" });
        refetch({ filtro, fecha: "", offset: 0 });
        setPage(0);
        break;
    }
  };

  return (
    <Fragment>
      <Box my={3}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
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
          </Grid>
          <Grid item md={4} xs={12}>
            <FormControl variant="outlined" fullWidth size="small">
              <InputLabel id="label-select-fecha-filter">
                Filtrar desde...
              </InputLabel>
              <Select
                inputRef={filterDate}
                labelId="label-select-fecha-filter"
                value={filtroFecha.since}
                onChange={(e) => obtenerFecha(e.target.value)}
                label="Filtrar desde..."
              >
                <MenuItem value="todos">
                  <em>Todos los registros</em>
                </MenuItem>
                <MenuItem value="7 dias">hace 7 días</MenuItem>
                <MenuItem value="2 semanas">hace 2 semanas</MenuItem>
                <MenuItem value="1 mes">hace 1 mes</MenuItem>
                <MenuItem value="3 meses">hace 3 meses</MenuItem>
                <MenuItem value="6 meses">hace 6 meses</MenuItem>
                <MenuItem value="8 meses">hace 8 meses</MenuItem>
                <MenuItem value="1 año">hace 1 año</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <ExportarComprasExcel
                obtenerComprasRealizadas={obtenerComprasRealizadas}
                filtro={filtro}
                filtroFecha={filtroFecha}
                refetch={refetch}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      {filtro || filtroFecha.fecha ? (
        <Box display="flex" mb={1}>
          <Typography variant="h6">Resultados de:</Typography>
          <Box mr={1} />
          {filtro ? (
            <Chip
              variant="outlined"
              size="medium"
              label={filtro}
              onDelete={handleDeleteFiltro}
            />
          ) : null}
          <Box mx={1} />
          {filtroFecha.fecha ? (
            <Chip
              variant="outlined"
              size="medium"
              label={`Desde hace ${filtroFecha.since}`}
              onDelete={handleDeleteFecha}
            />
          ) : null}
        </Box>
      ) : null}

      <ListaCompras
        obtenerComprasRealizadas={obtenerComprasRealizadas}
        refetch={refetch}
        page={page}
        setPage={setPage}
        limit={limit}
        filtro={filtro}
        filtroFecha={filtroFecha}
      />
    </Fragment>
  );
};
