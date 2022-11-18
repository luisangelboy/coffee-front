import React, { Fragment, useContext, useState } from "react";
import { TextField, Button } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { RegProductoContext } from "../../../../../context/Catalogos/CtxRegProducto";

import { useMutation } from "@apollo/client";
import {
  CREAR_CATEGORIA,
  CREAR_SUBCATEGORIA,
} from "../../../../../gql/Catalogos/categorias";
import { REGISTRAR_DEPARTAMENTO } from "../../../../../gql/Catalogos/departamentos";
import { REGISTRAR_MARCAS } from "../../../../../gql/Catalogos/marcas";
import SnackBarMessages from "../../../../../components/SnackBarMessages";

export default function RegistrarNuevoSelect({
  tipo,
  name,
  refetch,
  subcategorias,
  setSubcategorias,
}) {
  const [open, setOpen] = useState(false);
  const [validacion, setValidacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const sesion = JSON.parse(localStorage.getItem("sesionCafi"));
  const { datos_generales, setDatosGenerales } = useContext(RegProductoContext);
  const [alert, setAlert] = useState({ message: "", status: "", open: false });

  /*  Categorias Mutation */
  const [crearCategoria] = useMutation(CREAR_CATEGORIA);
  /*  Subcategorias Mutation */
  const [crearSubcategoria] = useMutation(CREAR_SUBCATEGORIA);
  /*  Departamentos Mutation */
  const [CrearDepartamentos] = useMutation(REGISTRAR_DEPARTAMENTO);
  /*  Marcas Mutation */
  const [CrearMarca] = useMutation(REGISTRAR_MARCAS);

  const handleToggle = () => {
    setOpen(!open);
  };

  const obtenerDatos = (e) => {
    setValue(e.target.value);
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!value) {
      setValidacion(true);
      return;
    }
    let variables = {
      input: {
        [name]: value,
      },
      empresa: sesion.empresa._id,
      sucursal: sesion.sucursal._id,
    };
    if (tipo === "categoria") {
      variables = {
        input: {
          [name]: value,
          empresa: sesion.empresa._id,
          sucursal: sesion.sucursal._id,
        },
      };
    }
    if (tipo === "subcategoria") {
      variables = {
        input: {
          [name]: value,
        },
        idCategoria: datos_generales.id_categoria,
      };
    }
    setLoading(true);
    try {
      switch (tipo) {
        case "categoria":
          const categoria_creada = await crearCategoria({ variables });
          refetch();
          const id_categoria = categoria_creada.data.crearCategoria._id;
          setDatosGenerales({
            ...datos_generales,
            categoria: value,
            id_categoria,
          });
          break;
        case "subcategoria":
          const subcategoria_creada = await crearSubcategoria(
            {  
              empresa : sesion.empresa._id,
              sucursal :sesion.sucursal._id,
              ...variables 
            }
          );
          refetch();
          const id_subcategoria =
            subcategoria_creada.data.crearSubcategoria.message;
          setSubcategorias([
            ...subcategorias,
            { _id: id_subcategoria, subcategoria: value },
          ]);
          setDatosGenerales({
            ...datos_generales,
            subcategoria: value,
            id_subcategoria,
          });
          break;
        case "departamento":
          const departamento_creado = await CrearDepartamentos({ variables });
          refetch();
          const id_departamento =
            departamento_creado.data.crearDepartamentos.message;
          setDatosGenerales({
            ...datos_generales,
            departamento: value,
            id_departamento,
          });
          break;
        case "marca":
          const marca_creada = await CrearMarca({ variables });
          refetch();
          const id_marca = marca_creada.data.crearMarcas.message;
          setDatosGenerales({
            ...datos_generales,
            marca: value,
            id_marca,
          });
          break;
        default:
          break;
      }
      setAlert({ message: "¡Listo!", status: "success", open: true });
      setLoading(false);
      handleToggle();
    } catch (error) {
      setLoading(false);
      if(error.message){
        setAlert({ message: error.message, status: "error", open: true });
      }else{
        setAlert({ message: "Hubo un error", status: "error", open: true });
      }
    }
  };

  return (
    <Fragment>
      <Button
        color="primary"
        onClick={() => handleToggle()}
        disabled={tipo === "subcategoria" && !datos_generales.id_categoria}
      >
        <Add />
      </Button>
      <Dialog
        open={open}
        onClose={handleToggle}
        aria-labelledby={`modal-title-${tipo}`}
      >
        <SnackBarMessages alert={alert} setAlert={setAlert} />
        <DialogTitle id={`modal-title-${tipo}`}>Registrar {tipo}</DialogTitle>
        <DialogContent>
          <form id={`registro-${name}`} onSubmit={(e) => guardarDatos(e)}>
            <TextField
              error={validacion}
              name={name}
              autoFocus
              label={tipo}
              fullWidth
              variant="outlined"
              onChange={obtenerDatos}
              helperText={validacion ? "Campo obligatorio" : ""}
              inputProps={{ style: { textTransform: "uppercase" } }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggle()} color="primary">
            Cancelar
          </Button>
          <Button
            /* onClick={() => guardarDatos()} */
            form={`registro-${name}`}
            type="submit"
            variant="contained"
            color="primary"
            endIcon={
              loading ? <CircularProgress color="inherit" size={18} /> : null
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
