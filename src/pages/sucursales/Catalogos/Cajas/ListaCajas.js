import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Badge, Box, CircularProgress, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { ELIMINAR_CAJA } from "../../../../gql/Cajas/cajas";
import { useMutation } from "@apollo/client";
import { withStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    height: "55vh",
  },
}));

export default function TablaCajas({
  obtenerCajasSucursal,
  setAlert,
  refetch,
  isOnline,
}) {
  const permisos = JSON.parse(localStorage.getItem("sesionCafi"));
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper variant="outlined">
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Cajas</TableCell>
                {permisos.accesos.catalogos.cajas.eliminar === false ? null : (
                  <TableCell padding="default">Eliminar</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {obtenerCajasSucursal.map((row) => {
                return (
                  <RowCajasRender
                    key={row.numero_caja}
                    row={row}
                    permisos={permisos}
                    setAlert={setAlert}
                    refetch={refetch}
                    isOnline={isOnline}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const StyledBadge = withStyles((theme) => ({
  badge: {
    color: ({ props }) => props.color,
    background: ({ props }) => props.color,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const RowCajasRender = ({ row, permisos, setAlert, refetch, isOnline }) => {
  const styleProps = {
    color: row.activa ? "#44b700" : "red",
  };

  return (
    <TableRow role="checkbox" tabIndex={-1}>
      <TableCell>
        <Box display="flex">
          <StyledBadge
            overlap="circular"
            props={styleProps}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            variant="dot"
          />
          <Box mx={1} />
          <Box>
            CAJA {row.numero_caja} {row.principal ? "PRINCIPAL" : ""}
          </Box>
        </Box>
      </TableCell>
      {permisos.accesos.catalogos.cajas.eliminar === false ? null : (
        <TableCell padding="checkbox">
          <EliminarCajasModal
            isOnline={isOnline}
            data={row}
            setAlert={setAlert}
            refetch={refetch}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

const EliminarCajasModal = ({ data, setAlert, refetch, isOnline }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [eliminarCaja] = useMutation(ELIMINAR_CAJA);

  const deleteCaja = async () => {
    try {
      setLoading(true);
      await eliminarCaja({
        variables: {
          id: data._id,
        },
      });
      refetch();
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      handleClose();
      if (error.message) {
        setAlert({ message: error.message, status: "error", open: true });
        return;
      }
      setAlert({ message: "Hubo un error", status: "error", open: true });
    }
  };

  return (
    <div>
      <IconButton
        onClick={() => handleClickOpen()}
        color="secondary"
        disabled={(!isOnline && data.activa) || (isOnline && data.principal)}
      >
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"¿Seguro que quieres eliminar esto?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            color="secondary"
            autoFocus
            variant="contained"
            onClick={() => deleteCaja()}
            startIcon={
              loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Delete />
              )
            }
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
