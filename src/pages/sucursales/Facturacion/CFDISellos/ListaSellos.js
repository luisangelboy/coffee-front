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
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import DeleteIcon from "@material-ui/icons/Delete";
import { Close, Done } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function createData(nombreCer, nombreKey, fechaSol, fechaVen, pfx) {
  return { nombreCer, nombreKey, fechaSol, fechaVen, pfx };
}

const rows = [
  createData(
    "file.cer",
    "file.key",
    "02/12/2021",
    "10/06/2022",
    "pfx_file.pfx"
  ),
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    height: "80vh",
  },
});

export default function ListaSellosCDFI() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Archivo .Cer</TableCell>
              <TableCell>Archivo .key</TableCell>
              <TableCell>Fecha de solicitud</TableCell>
              <TableCell>Fecha de vencimiento</TableCell>
              <TableCell>PFX File</TableCell>
              <TableCell align="center" padding="checkbox">
                Predeterminado
              </TableCell>
              <TableCell align="center" padding="checkbox">
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{row.nombreCer}</TableCell>
                  <TableCell>{row.nombreKey}</TableCell>
                  <TableCell>{row.fechaSol}</TableCell>
                  <TableCell>{row.fechaVen}</TableCell>
                  <TableCell>{row.pfx}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </TableCell>
                  <TableCell align="center">
					  <ModalDeleteSello row={row} />
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

const ModalDeleteSello = ({row}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const eliminarSelloBD = () => {
	  console.log(row);
	  handleClose();
  }

  return (
    <Fragment>
      <IconButton aria-label="delete" onClick={() => handleClickOpen()}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle>
          {"¿Eliminar sello digital?"}
        </DialogTitle>
        <DialogActions>
          <Button startIcon={<Close />} onClick={() => handleClose()}>
            Cancelar
          </Button>
          <Button startIcon={<Done />} onClick={() => eliminarSelloBD()} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
