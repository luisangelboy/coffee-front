import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";

export default function Parametros({
  arregloAccesos,
  obtenerAccesos,
  departamento,
  subDepartamento,
}) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <FormControlLabel
        control={
          <Checkbox
            checked={
              arregloAccesos
                ? arregloAccesos[departamento][subDepartamento]?.ver
                : false
            }
            name="ver"
            color="primary"
            onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
          />
        }
        label={
          <Box mr={2} display="flex">
            {departamento === "ventas" && subDepartamento !== "cancelar_venta"
              ? "Autorizar"
              : "Ver"}
          </Box>
        }
      />
      {subDepartamento === "informacion_fiscal" ||
      subDepartamento === "datos_empresa" ||
      subDepartamento === "abrir_compra" ||
      subDepartamento === "compras_realizadas" ||
      subDepartamento === "compras_espera" ||
      subDepartamento === "traspasos" ||
      subDepartamento === "inventario_almacen" ||
      subDepartamento === "cuentas_empresa" ||
      subDepartamento === "generar_cdfi" ||
      subDepartamento === "cdfi_realizados" ||
      departamento === "reportes" ||
      departamento === "ventas" ||
      subDepartamento === "caja_principal" ||
      subDepartamento === "egresos" ? null : (
        <FormControlLabel
          control={
            <Checkbox
              checked={
                arregloAccesos
                  ? arregloAccesos[departamento][subDepartamento]?.agregar
                  : false
              }
              name="agregar"
              disabled={
                arregloAccesos
                  ? arregloAccesos[departamento][subDepartamento]?.ver === false
                  : true
              }
              color="primary"
              onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
            />
          }
          label={
            <Box mr={2} display="flex">
              Agregar
            </Box>
          }
        />
      )}
      {subDepartamento === "cajas" ||
      subDepartamento === "abrir_compra" ||
      subDepartamento === "compras_realizadas" ||
      subDepartamento === "traspasos" ||
      subDepartamento === "inventario_almacen" ||
      subDepartamento === "abonos_proveedores" ||
      subDepartamento === "abonos_clientes" ||
      subDepartamento === "egresos" ||
      subDepartamento === "caja_principal" ||
      subDepartamento === "generar_cdfi" ||
      subDepartamento === "cdfi_realizados" ||
      subDepartamento === "registro_series_cdfi" ||
      departamento === "reportes" ? null : departamento === "ventas" &&
        subDepartamento !== "cancelar_venta" ? null : (
        <FormControlLabel
          control={
            <Checkbox
              checked={
                arregloAccesos
                  ? arregloAccesos[departamento][subDepartamento]?.editar
                  : false
              }
              name="editar"
              disabled={
                arregloAccesos
                  ? arregloAccesos[departamento][subDepartamento]?.ver === false
                  : true
              }
              color="primary"
              onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
            />
          }
          label={
            <Box mr={2} display="flex">
              Editar
            </Box>
          }
        />
      )}
      {subDepartamento === "informacion_fiscal" ||
      subDepartamento === "datos_empresa" ||
      subDepartamento === "abrir_compra" ||
      subDepartamento === "compras_realizadas" ||
      subDepartamento === "traspasos" ||
      subDepartamento === "inventario_almacen" ||
      subDepartamento === "cuentas_empresa" ||
      subDepartamento === "abonos_proveedores" ||
      subDepartamento === "generar_cdfi" ||
      subDepartamento === "cdfi_realizados" ||
      subDepartamento === "abonos_clientes" ||
      subDepartamento === "egresos" ||
      subDepartamento === "caja_principal" ||
      departamento === "reportes" ||
      departamento === "ventas" ? null : (
        <FormControlLabel
          control={
            <Checkbox
              checked={
                arregloAccesos
                  ? arregloAccesos[departamento][subDepartamento]?.eliminar
                  : false
              }
              name="eliminar"
              color="primary"
              disabled={
                arregloAccesos
                  ? arregloAccesos[departamento][subDepartamento]?.ver === false
                  : true
              }
              onChange={(e) => obtenerAccesos(e, departamento, subDepartamento)}
            />
          }
          label={<Box display="flex">Eliminar</Box>}
        />
      )}
    </Box>
  );
}
