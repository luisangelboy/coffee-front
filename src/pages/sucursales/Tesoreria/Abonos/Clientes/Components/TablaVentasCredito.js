import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import HistoryIcon from "@material-ui/icons/History";
import Table from "@material-ui/core/Table";
import IconButton from "@material-ui/core/IconButton";
import { Box, Typography } from "@material-ui/core";

import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";

import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DetalleVentaCredito from "./AbonarSeleccion/DetalleVentaCredito";
import HistorialAbonos from "./AbonarSeleccion/HistorialAbonos";
import IconLiquidar from "./Liquidar";
import Abonar from "./Abonar";
import { formatoFechaCorta } from "../../../../../../config/reuserFunctions";
import { Dehaze } from "@material-ui/icons";
//import DetallesCuenta from './DetalleCuenta/DetallesCuenta';

const rows = [];

const headCells = [
  { id: "folio", numeric: false, disablePadding: true, label: "Folio" },
  { id: "fecha", numeric: false, disablePadding: true, label: "Fecha" },
  {
    id: "fechaVencimiento",
    numeric: false,
    disablePadding: true,
    label: "Fecha de vencimiento",
  },
  {
    id: "totalVenta",
    numeric: false,
    disablePadding: true,
    label: "Total venta",
  },
  {
    id: "faltaPagar",
    numeric: false,
    disablePadding: true,
    label: "Falta por pagar",
  },

  {
    id: "detalle",
    numeric: false,
    disablePadding: true,
    label: "Detalles",
  },
  {
    id: "historialAbonos",
    numeric: false,
    disablePadding: true,
    label: "Historial",
  },
  { id: "abonar", numeric: false, disablePadding: true, label: "Abonar" },
  { id: "liquidar", numeric: false, disablePadding: true, label: "Liquidar" },
];

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  // onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  // order: PropTypes.oneOf([ 'asc', 'desc' ]).isRequired,
  // orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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
  vencer: {
    backgroundColor: "#FFF",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
}));

export default function TablaVentasCredito(props) {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  /* const { setVentas} = useContext(AbonosCtx); */
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [rowSelected, setRowSelected] = useState({});
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /* const handleClick = (event, item) => {
         try {
			let newSelected = [];
			const selectedIndex = selected.indexOf(item);
			//console.log(selected,selectedIndex);
			
			if (selectedIndex === -1) {
				newSelected = newSelected.concat(selected, item);
			} else if (selectedIndex === 0) {
				newSelected = newSelected.concat(selected.slice(1));
			} else if (selectedIndex === selected.length - 1) {
				newSelected = newSelected.concat(selected.slice(0, -1));
			} else if (selectedIndex > 0) {
				newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
			}
			
			setSelected(newSelected);
			setVentas(newSelected); 
		 } catch (error) {
			 
		 }
	
		
	}; */
  const detalle = (row) => {
    setOpenDetalle(true);
    setRowSelected(row);
  };

  const historial = (row) => {
    setOpenHistorial(true);
    setRowSelected(row);
  };

  const isSelected = (item) => selected.indexOf(item) !== -1;
  const handleChangePage = (_, nextPage) => {
		props.setPage(nextPage);
		
	};	

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
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
            <b>- Ventas vencidas </b>
          </Typography>
          {/* <Box
				border={1}
				borderColor="#FF8A8A"
				bgcolor="#FFF4F4"
				height="24px"
				width="24px"
			/>
			<Box mx={1} />
				<Typography>
				<b>- Ventas por vencer</b>
			</Typography> */}
        </Box>

        <TableContainer style={{ height: "58vh" }}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            stickyHeader
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {props.rows.docs.map((row, index) => {
             
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;
      
                return (
                  <TableRow
                    hover
                    key={index}
                    // onClick={(event) => handleClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    className={
                      row.estatus_credito === "PAGADA"
                        ? classes.pagada
                        : row.estatus_credito === "VENCIDA"
                        ? classes.vencidas
                        : classes.vencer
                    }
                  >
                    {/* <TableCell padding="checkbox">
											<Checkbox
												checked={isItemSelected}
												inputProps={{ 'aria-labelledby': labelId }}
											/> 
										</TableCell>*/}
                    <TableCell id={labelId}>{row.folio}</TableCell>
                    <TableCell>{` ${formatoFechaCorta(
                      row.fecha_registro
                    )}`}</TableCell>
                    <TableCell>
                      {formatoFechaCorta(row.fecha_de_vencimiento_credito)}
                    </TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{row.saldo_credito_pendiente}</TableCell>
                    <TableCell align="center" padding="checkbox">
                      <IconButton
                        aria-label="detalle"
                        onClick={() => {
                          detalle(row);
                        }}
                        size="small"
                      >
                        <Dehaze />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" padding="checkbox">
                      <IconButton
                        aria-label="historial"
                        onClick={() => {
                          historial(row);
                        }}
                        size="small"
                      >
                        <HistoryIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" padding="checkbox">
                      <Abonar
                        cliente={props.selectedClient}
                        total_ventas={row.saldo_credito_pendiente}
                        setLoading={props.setLoading}
                        venta={row}
                        setAlert={props.setAlert}
                        index={index}
                        recargar={props.recargar}
                        estatus_credito={row.estatus_credito}
                      />
                    </TableCell>
                    <TableCell align="center" padding="checkbox">
                      <IconLiquidar
                        isIcon={true}
                        cliente={props.selectedClient}
                        total_ventas={row.saldo_credito_pendiente}
                        setAlert={props.setAlert}
                        index={index}
                        setLoading={props.setLoading}
                        recargar={props.recargar}
                        estatus_credito={row.estatus_credito}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* {emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
					rowsPerPageOptions={[]}
					component="div"
					count={props.rows.totalDocs}
					rowsPerPage={props.limit}
					page={props.page}
					onPageChange={handleChangePage}
				/>
       
        <DetalleVentaCredito
          openDetalle={openDetalle}
          setOpenDetalle={setOpenDetalle}
          datos={rowSelected}
        />
        <HistorialAbonos
          openHistorial={openHistorial}
          setOpenHistorial={setOpenHistorial}
          rowSelected={rowSelected}
          recargar={props.recargar}
          setAlert={props.setAlert}
        />
      </Paper>
    </div>
  );
}
