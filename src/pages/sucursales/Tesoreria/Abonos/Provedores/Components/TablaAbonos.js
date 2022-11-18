import React, { Fragment, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { formatoMexico } from "../../../../../../config/reuserFunctions";
import DetallesCuenta from "./DetalleCuenta/DetallesCuenta";
import LiquidarCuenta from "./LiquidarCuenta";
import moment from "moment";

import {
  Box,
  CircularProgress,
  Dialog,
  Slide,
  TableHead,
  Typography,
} from "@material-ui/core";
import "moment/locale/es";
import { TesoreriaCtx } from "../../../../../../context/Tesoreria/tesoreriaCtx";

const columns = [
  { id: "folio", label: "Folio", minWidth: 100, align: "center" },
  { id: "fecha", label: "Fecha Compra", minWidth: 100, align: "center" },
  { id: "provedor", label: "Provedor", minWidth: 100, align: "center" },
  { id: "total", label: "Total", minWidth: 100, align: "center" },
  { id: "abonado", label: "Abonado", minWidth: 100, align: "center" },
  { id: "restante", label: "Restante", minWidth: 100, align: "center" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minHeight: "60vh",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  pagada: {
    backgroundColor: "#EDFFF3",
    "&:hover": {
      backgroundColor: "#D8FFE5",
    },
  },
  vencidas: {
    backgroundColor: "#FFF4F4",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TablaAbonos(props) {
  const { cuentas } = useContext(TesoreriaCtx);

  const classes = useStyles();

  if (props.loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  const handleChangePage = (_, nextPage) => {
    props.setPage(nextPage);
  };

  console.log(cuentas);

  return (
    <Fragment>
      <div className={classes.root}>
        <Box my={1} m={2} display="flex">
          <Fragment>
            <Box
              border={1}
              borderColor="#58ff8f"
              bgcolor="#EDFFF3"
              height="24px"
              width="24px"
            />
            <Box mx={1} />
            <Typography>
              <b>- Pagadas </b>
            </Typography>
            <Box mx={2} />
          </Fragment>

          <Box
            border={1}
            borderColor="#FF8A8A"
            bgcolor="#FFF4F4"
            height="24px"
            width="24px"
          />
          <Box mx={1} />
          <Typography>
            <b>- Compras vencidas </b>
          </Typography>
        </Box>
        <Paper className={classes.paper}>
          <TableContainer className={classes.table}>
            <Table
              aria-labelledby="tableTitle"
              stickyHeader
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align={"center"} style={{ minWidth: 100 }}>
                    Liquidar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cuentas?.docs?.map((row, index) => (
                  <RowsCuentas
                    loading={props.loading}
                    cuentaSelect={row}
                    key={index}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={cuentas?.totalDocs ? cuentas?.totalDocs : 0}
            rowsPerPage={props.limit}
            page={props.page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </div>
    </Fragment>
  );
}

function RowsCuentas(props) {
  const permisosUsuario = JSON.parse(localStorage.getItem("sesionCafi"));
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleClick = () => {
    setOpen(!open);
  };

  const TwoClickInRowTableBuy = (e) => {
    try {
      let timer;
      clearTimeout(timer);
      if (e.detail === 2) {
        handleClick();
      }
    } catch (error) {}
  };

  return (
    <Fragment>
      <TableRow
        hover
        tabIndex={-1}
        onClick={(e) => TwoClickInRowTableBuy(e)}
        className={
          props.cuentaSelect.estatus_credito === "PAGADA"
            ? classes.pagada
            : props.cuentaSelect.estatus_credito === "VENCIDA"
            ? classes.vencidas
            : classes.vencer
        }
      >
        <TableCell align="center">
          {props.cuentaSelect.folio ? props.cuentaSelect.folio : "SIN FOLIO"}
        </TableCell>
        <TableCell align="center">
          {moment(props.cuentaSelect.fecha_registro).format("D MMMM YYYY")}
        </TableCell>
        <TableCell align="center">
          {props.cuentaSelect.proveedor.id_proveedor.nombre_cliente}
        </TableCell>
        <TableCell align="center">
          ${formatoMexico(props.cuentaSelect.total)}
        </TableCell>
        <TableCell align="center">
          $
          {formatoMexico(
            props.cuentaSelect.total -
              props.cuentaSelect.saldo_credito_pendiente
          )}
        </TableCell>
        <TableCell align="center">
          ${formatoMexico(props.cuentaSelect.saldo_credito_pendiente)}
        </TableCell>

        {permisosUsuario.accesos.tesoreria.abonos_proveedores.editar ===
        false ? (
          <TableCell align="center"></TableCell>
        ) : (
          <TableCell align="center">
            {props.cuentaSelect.credito_pagado ? (
              <div />
            ) : (
              <LiquidarCuenta cuenta={props.cuentaSelect} />
            )}
          </TableCell>
        )}
      </TableRow>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClick}
        TransitionComponent={Transition}
      >
        <DetallesCuenta
          cuenta={props.cuentaSelect}
          loading={props.loading}
          handleClick={handleClick}
          recargar={props.refetch}
        />
      </Dialog>
    </Fragment>
  );
}
