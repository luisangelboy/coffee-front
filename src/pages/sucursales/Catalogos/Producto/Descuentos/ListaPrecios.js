import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Delete } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Switch,
  Tooltip,
} from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";

import {
  DESACTIVAR_DESCUENTOS,
  ELIMINAR_DESCUENTOS,
} from "../../../../../gql/Catalogos/descuentos";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../../components/SnackBarMessages";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";
import BackdropComponent from "../../../../../components/Layouts/BackDrop";

const headCells = [
  { id: "cantidad", label: "Cantidad" },
  { id: "tipo", label: "Tipo" },
  { id: "precio", label: "Precio U." },
  { id: "precioDes", label: "Precio Desc." },
  { id: "descuento", label: "% Desc." },
  { id: "eliminar", label: "Eliminar" },
  { id: "activo", label: "Activo" },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount, datosPrecios } = props;
  let variable = false;
  datosPrecios?.forEach((element) => {
    if (element.medida) {
      return (variable = true);
    }
  });
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
        {variable === true ? (
          <>
            <TableCell>Talla</TableCell>
            <TableCell>Color</TableCell>
          </>
        ) : null}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
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
    height: 300,
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
  colorContainer: {
    border: "1px solid rgba(0,0,0, .3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 30,
    margin: 1,
    borderRadius: "15%",
    cursor: "pointer",
  },
}));

export default function TablaPreciosDescuentos({
  value,
  datos,
  setCleanList,
  cleanList,
  verificarDatos,
  setPrecioPrueba,
  productosRefetch,
  setLoading,
  loading,
}) {
  const classes = useStyles();
  const {
    //es este
    datosPreciosProducto,
    setPreciosProductos,
    setDatosPreciosProducto,
  } = useContext(RegProductoContext);

  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  var porcentaje = parseFloat((100 - value).toFixed(2));
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (datos) {
    if (datos.medidas_producto.length > 0) {
      setDatosPreciosProducto(datos.medidas_producto);
    } else {
      setDatosPreciosProducto(datos.unidades_de_venta);
    }
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = datosPreciosProducto.map((n) => n);
      setSelected(newSelecteds);
      verificarDatos(newSelecteds);
      setPreciosProductos(newSelecteds);
      return;
    }
    setPreciosProductos([]);
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setPrecioPrueba(newSelected.length === 0 ? 0 : newSelected);
    setPreciosProductos(newSelected);
    verificarDatos(newSelected);
    setSelected(newSelected);
  };

  useEffect(() => {
    setSelected([]);
    setCleanList(false);
  }, [cleanList]);

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, datosPreciosProducto.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <SnackBarMessages alert={alert} setAlert={setAlert} />
      <Paper className={classes.paper}>
        <BackdropComponent loading={loading} setLoading={setLoading} />
        <TableContainer className={classes.table}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="a dense table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={datosPreciosProducto.length}
              datosPrecios={datosPreciosProducto}
            />
            <TableBody>
              {datosPreciosProducto.map((row, index) => {
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RowsRender
                    key={row._id}
                    setLoading={setLoading}
                    productosRefetch={productosRefetch}
                    handleClick={handleClick}
                    selected={selected}
                    row={row}
                    setAlert={setAlert}
                    porcentaje={porcentaje}
                    value={value}
                    datos={datos}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                  />
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

function RowsRender({
  row,
  value,
  isItemSelected,
  setLoading,
  datos,
  labelId,
  setAlert,
  porcentaje,
  productosRefetch,
  handleClick,
  selected,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const { setDatosPreciosProducto } = useContext(RegProductoContext);
  const [DesactivarDescuentoUnidad] = useMutation(DESACTIVAR_DESCUENTOS);
  const [ELiminarDescuentoUnidad] = useMutation(ELIMINAR_DESCUENTOS);

  const handleChangeActivo = async () => {
    setLoading(true);
    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    try {
      await DesactivarDescuentoUnidad({
        variables: {
          input: {
            descuento_activo: !row.descuento_activo,
          },
          id: row._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      setLoading(false);
      productosRefetch();
      setAlert({
        message: "Estado de descuento actualizado",
        status: "success",
        open: true,
      });
    } catch (error) {
      setAlert({
        message: "Ocurrio un problema en el servidor",
        status: "error",
        open: true,
      });
    }
  };

  const handleModal = () => {
    setOpenModal(!openModal);
    editarDatos();
  };

  const editarDatos = () => {
    if (datos.medidas_producto.length > 0) {
      setDatosPreciosProducto(datos.medidas_producto);
      setLoading(false);
    } else {
      setDatosPreciosProducto(datos.unidades_de_venta);
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
    setLoading(true);
    try {
      productosRefetch();
      const resultado = await ELiminarDescuentoUnidad({
        variables: {
          id: row._id,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      });
      handleModal();
      editarDatos();
      setAlert({
        message: resultado.data.eliminarDescuentoUnidad.message,
        status: "success",
        open: true,
      });
    } catch (error) {
      setAlert({ message: error.message, status: "error", open: true });
    }
  };

  return (
    <TableRow
      hover
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row._id}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          onClick={(event) => {
            handleClick(event, row);
          }}
          checked={isItemSelected}
          inputProps={{ "aria-labelledby": labelId }}
        />
      </TableCell>
      <TableCell align="center">{row.cantidad}</TableCell>
      <TableCell align="center">{row?.unidad}</TableCell>
      <TableCell align="center">{row.precio}</TableCell>
      <TableCell align="center">
        {isItemSelected === true && selected.length > 1 ? (
          <b style={{ color: "green" }}>
            {" "}
            ${parseFloat(((row.precio * porcentaje) / 100).toFixed(2))}{" "}
          </b>
        ) : row.descuento === null ? (
          0
        ) : (
          <b style={{ color: "green" }}> ${row.descuento.precio_neto} </b>
        )}
      </TableCell>
      <TableCell align="center">
        {isItemSelected === true && selected.length > 1 ? (
          <b style={{ color: "red" }}> {value}% </b>
        ) : !row.descuento || row.descuento === null ? (
          0
        ) : (
          <b style={{ color: "red" }}> {row.descuento.porciento}% </b>
        )}
      </TableCell>
      <TableCell align="center">
        <Modal
          row={row}
          handleModal={handleModal}
          openModal={openModal}
          handleDelete={handleDelete}
        />
      </TableCell>
      <TableCell key={row._id} align="center">
        <Switch
          key={row._id}
          onChange={handleChangeActivo}
          color="primary"
          disabled={
            !row.descuento ? true : row.descuento.porciento === 0 ? true : false
          }
          defaultChecked={row.descuento_activo ? row.descuento_activo : false}
          name="descuento_activo"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />
      </TableCell>
      {row.medida ? (
        <TableCell align="center">{row?.medida?.talla}</TableCell>
      ) : null}

      {row.color ? (
        <TableCell align="center">
          <Tooltip
            title={row?.color?.nombre}
            placement="top"
            arrow
            TransitionComponent={Zoom}
          >
            <div
              className={classes.colorContainer}
              style={{
                backgroundColor: row?.color?.hex,
                color: theme.palette.getContrastText(row?.color?.hex),
              }}
            ></div>
          </Tooltip>
        </TableCell>
      ) : null}
    </TableRow>
  );
}

// MODAL PARA ELIMINAR EL DESCUENTO DE LOS PRODUCTOS
const Modal = ({ row, handleModal, openModal, handleDelete }) => {
  return (
    <div>
      <IconButton
        color="secondary"
        onClick={handleModal}
        disabled={
          !row.descuento ? true : row.descuento.porciento === 0 ? true : false
        }
      >
        <Delete />
      </IconButton>
      <Dialog open={openModal} onClose={handleModal}>
        <DialogTitle>{"¿Seguro que quieres eliminar esto?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleModal} color="primary">
            Cancelar
          </Button>
          <Button
            color="secondary"
            autoFocus
            variant="contained"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
