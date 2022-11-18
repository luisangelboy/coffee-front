import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  Box,
  Button,
  TextField,
  FormControl,
  Input,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import ListaConceptos from "./ListaConceptos";
import {
  REGISTRAR_CONCEPTO_ALMACEN,
  ACTUALIZAR_CONCEPTO_ALMACEN,
} from "../../../../gql/Catalogos/conceptosAlmacen";
import { useMutation } from "@apollo/client";
import SnackBarMessages from "../../../../components/SnackBarMessages";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  flexGrow: {
    flexGrow: 1,
  },
  formControl: {
    marginLeft: theme.spacing(5),
    marginBottom: theme.spacing(3),
    minWidth: 200,
    maxWidth: 200,
  },
}));
const ITEM_HEIGHT = 200;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};
const tipos = ["SUMA", "RESTA", "N/A"];

function getStyles(tipo, tipoName, theme) {
  console.log(tipoName);
  return {
    fontWeight:
      tipoName.indexOf(tipo) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function RegistroServicios({ isOnline }) {
  const classes = useStyles();
  const theme = useTheme();
  const [updateData, setUpdateData] = useState(false);
  const [data, setData] = useState({
    nombre_concepto: "",
    destino: "",
    origen: "",
  });
  const [alert, setAlert] = useState({ message: "", status: "", open: false });
  const [error, setError] = useState(false);
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const [accion, setAccion] = useState(true);
  const [idConcepto, setIdConcepto] = useState("");

  const [crearConceptoAlmacen] = useMutation(REGISTRAR_CONCEPTO_ALMACEN);
  const [actualizarConceptoAlmacen] = useMutation(ACTUALIZAR_CONCEPTO_ALMACEN);
  const [openModal, setOpenModal] = useState(false);
  const handleModal = () => setOpenModal(!openModal);
  const handleChangeInput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeDestino = (event) => {
    setData({ ...data, destino: event.target.value });
  };
  const handleChangeOrigen = (event) => {
    setData({ ...data, origen: event.target.value });
  };
  const handleSubmit = async () => {
    try {
      setOpenModal(false);
      if (!data.nombre_concepto || !data.origen || !data.destino) {
        setError(true);
        return;
      } else {
        const input = data;
        if (accion) {
          if (sesion.accesos.catalogos.conceptos_almacen.agregar === false) {
            return setAlert({
              message: "Lo sentimos no tienes los permisos autorizados",
              status: "error",
              open: true,
            });
          } else {
            await crearConceptoAlmacen({
              variables: {
                input,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
                usuario: sesion._id,
              },
            });
          }
        } else {
          if (sesion.accesos.catalogos.conceptos_almacen.editar === false) {
            return setAlert({
              message: "Lo sentimos no tienes los permisos autorizados",
              status: "error",
              open: true,
            });
          } else {
            await actualizarConceptoAlmacen({
              variables: {
                input,
                id: idConcepto,
                empresa: sesion.empresa._id,
                sucursal: sesion.sucursal._id,
              },
            });
            setAccion(true);
          }
        }
        setAlert({ message: "¡Listo!", status: "success", open: true });
        setData({ nombre_concepto: "", origen: "", destino: "" });
        setError(false);
        setUpdateData(!updateData);
        setIdConcepto("");
      }
    } catch (error) {
      setAlert({ message: error.message, status: "error", open: true });
    }
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const Modal = ({ handleModal, openModal, handleSubmit, isOnline }) => {
    return (
      <div>
        <Dialog open={openModal} onClose={handleModal}>
          <DialogTitle>
            {
              "Editar este concepto afectará cálculos de estados de resultado ,¿Seguro que quieres editar esto?"
            }
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleModal} color="primary">
              Cancelar
            </Button>
            <Button
              color="secondary"
              autoFocus
              variant="contained"
              onClick={handleSubmit}
              disabled={!isOnline}
            >
              Editar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Box flexDirection="row">
        <Grid container>
          <SnackBarMessages alert={alert} setAlert={setAlert} />

          <Box display="flex" alignItems="center" mb={2}>
            <Typography>Concepto </Typography>
            <TextField
              error={error}
              id="outlined-error-helper-text"
              variant="outlined"
              size="small"
              name="nombre_concepto"
              style={{ marginLeft: 2 }}
              value={data.nombre_concepto}
              onChange={handleChangeInput}
              onKeyPress={pressEnter}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </Box>
          <FormControl className={classes.formControl}>
            <InputLabel id="origen-label">Origen</InputLabel>
            <Select
              error={error}
              labelId="origen-label"
              id="origen-name"
              value={data.origen}
              onChange={handleChangeOrigen}
              input={<Input />}
              MenuProps={MenuProps}
            >
              {tipos.map((tipo) => (
                <MenuItem
                  key={tipo}
                  value={tipo}
                  style={getStyles(tipo, data.origen, theme)}
                >
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="destino-label">Destino</InputLabel>
            <Select
              error={error}
              labelId="destino-label"
              id="destino-name"
              value={data.destino}
              onChange={handleChangeDestino}
              input={<Input />}
              MenuProps={MenuProps}
            >
              {tipos.map((tipo) => (
                <MenuItem
                  key={tipo}
                  value={tipo}
                  style={getStyles(tipo, data.destino, theme)}
                >
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display="flex" alignItems="center" mb={2}>
            <Box ml={5} />
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={() => (accion ? handleSubmit() : setOpenModal(true))}
              disableElevation
              disabled={!isOnline}
            >
              <Add />
              Guardar
            </Button>
          </Box>
        </Grid>
      </Box>
      <ListaConceptos
        setData={setData}
        idConcepto={idConcepto}
        setIdConcepto={setIdConcepto}
        setAccion={setAccion}
        updateData={updateData}
        setAlert={setAlert}
        isOnline={isOnline}
      />
      <Modal
        handleModal={handleModal}
        openModal={openModal}
        handleSubmit={handleSubmit}
        isOnline={isOnline}
      />
    </div>
  );
}
