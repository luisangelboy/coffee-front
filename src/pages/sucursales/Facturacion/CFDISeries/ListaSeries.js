import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Slide from "@material-ui/core/Slide";
import { Close, Done } from "@material-ui/icons";
import { Backdrop, Checkbox, CircularProgress } from "@material-ui/core";
import SnackBarMessages from "../../../../components/SnackBarMessages";
import { useMutation } from "@apollo/client";
import {
  ACTUALIZAR_DEFAULT_SERIE,
  ELIMINAR_SERIE,
} from "../../../../gql/Facturacion/Facturacion";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "80vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function ListaSeriesCDFI({ obtenerSeriesCdfi, refetch }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));

  const { seriesCfdi } = obtenerSeriesCdfi;
  const [modificarDefaultSerie] = useMutation(ACTUALIZAR_DEFAULT_SERIE);

  const setPredeterminado = async (value, data) => {
    setLoading(true);
    try {
      const result = await modificarDefaultSerie({
        variables: {
          id: data._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      refetch();
      setLoading(false);
      setAlert({
        message: `¡Listo! ${result.data.modificarDefaultSerie.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "success",
        open: true,
      });
    }
  };

  return (
    <Paper variant="outlined">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <TableContainer className={classes.container}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Serie</TableCell>
              <TableCell>Folio</TableCell>
              <TableCell>Predeterminado</TableCell>
              <TableCell padding="checkbox">Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seriesCfdi.map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{row.serie}</TableCell>
                  <TableCell>{row.folio}</TableCell>
                  <TableCell align="center" padding="checkbox">
                    <Checkbox
                      checked={row.default}
                      onChange={(e) => setPredeterminado(e.target.checked, row)}
                      name="checkedA"
                    />
                  </TableCell>
                  <TableCell align="center" padding="checkbox">
                    {sesion.accesos.facturacion.registro_series_cdfi.eliminar === false ? (null) : (
                      <ModalDeleteSerie
                        row={row}
                        refetch={refetch}
                        setAlert={setAlert}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

const ModalDeleteSerie = ({ row, refetch, setAlert }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [eliminarSerie] = useMutation(ELIMINAR_SERIE);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const eliminarSerieBD = async () => {
    setLoading(true);
    try {
      const result = await eliminarSerie({
        variables: {
          id: row._id,
        },
      });
      refetch();
      setLoading(false);
      handleClose();
      setAlert({
        message: `¡Listo! ${result.data.eliminarSerie.message}`,
        status: "success",
        open: true,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert({
        message: `Error: ${error.message}`,
        status: "success",
        open: true,
      });
    }
  };

  return (
    <Fragment>
      <IconButton aria-label="delete" size="small" onClick={() => handleOpen()} disabled={row.default}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <DialogTitle>Se eliminara esta serie</DialogTitle>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button startIcon={<Close />} onClick={() => handleClose()}>
            Cancelar
          </Button>
          <Button
            color="secondary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Done />}
            onClick={() => eliminarSerieBD()}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
