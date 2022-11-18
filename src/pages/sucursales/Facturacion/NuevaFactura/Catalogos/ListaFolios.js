import React, { Fragment, useContext, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core";
import { formatoMexico } from "../../../../../config/reuserFunctions"

import { Search } from "@material-ui/icons";
import Done from "@material-ui/icons/Done";
import { FacturacionCtx } from "../../../../../context/Facturacion/facturacionCtx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  container: {
    height: "50vh",
  },
}));

function createData(folio, serie, cliente, fecha, total) {
  return { folio, serie, cliente, fecha, total };
}

const rows = [
  createData("00234", "123543563", "Juanito", "19/nov/2021", 246342.34),
  createData("00235", "123345563", "Panchito", "18/nov/2021", 2354.234),
  createData("00236", "122309563", "Alfredito", "17/nov/2021", 23523.32),
  createData("00237", "123287443", "Marianita", "17/nov/2021", 1234.54),
];

export default function ListaFoliosFactura() {
  const [open, setOpen] = useState(false);
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={() => handleOpen()} size="small">
        <Search />
      </IconButton>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
      >
        <DialogTitle>Seleccionar Folio</DialogTitle>
        <DialogContent>
          <RenderLista />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={() => {
              handleClose();
              setDatosFactura({ ...datosFactura, folio: "", serie: "", concepto: [] });
            }}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            startIcon={<Done />}
            onClick={() => handleClose()}
            disabled={!datosFactura.folio}
          >
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const RenderLista = () => {
  const classes = useStyles();
  const [filtro, setFiltro] = useState("");
  const [values, setValues] = useState("");
  const { datosFactura, setDatosFactura } = useContext(FacturacionCtx);

  const pressEnter = (e) => {
    if (e.key === "Enter") setFiltro(e.target.value);
  };

  return (
    <Fragment>
      <Box mb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por: Numero de cliente, clave o nombre"
          variant="outlined"
          onChange={(e) => setValues(e.target.value)}
          onKeyPress={pressEnter}
          value={values}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setFiltro(values)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table stickyHeader size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell minwidth="100">Folio</TableCell>
                <TableCell minwidth="100">Serie</TableCell>
                <TableCell minwidth="100">Cliente</TableCell>
                <TableCell minwidth="100">Fecha</TableCell>
                <TableCell minwidth="150">total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    onClick={() =>
                      setDatosFactura({
                        ...datosFactura,
                        folio: row.folio,
                        serie: row.serie,
                        concepto: [row]
                      })
                    }
                    selected={row.folio === datosFactura.folio}
                  >
                    <TableCell>
                      <Typography>{row.folio}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.serie}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.cliente}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.fecha}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>$ {formatoMexico(row.total)}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};
