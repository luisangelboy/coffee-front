export function validaciones(generales, precios, almacen, presentaciones) {
    /* si no hay generales y datos 2 */
    /* console.log(almacen); */
    if (
        !generales.clave_alterna ||
        !generales.tipo_producto ||
        !generales.nombre_generico ||
        !generales.nombre_comercial
    ) {
        if (!precios.precio_de_compra.precio_con_impuesto ||
            !precios.precio_de_compra.precio_sin_impuesto ||
            !precios.unidad_de_compra.cantidad) {
            return { error: true, message: 'Campo obligatorio', vista1: true, vista2: true };
        }
        return { error: true, message: 'Campo obligatorio', vista1: true };
    } else if (
        /* si solo hay generales */
        !precios.precio_de_compra.precio_con_impuesto || !precios.precio_de_compra.precio_sin_impuesto || !precios.unidad_de_compra.cantidad
    ) {
        return { error: true, message: 'Campo obligatorio', vista2: true };
    } else if (
        /* si solo hay precios */
        !generales.clave_alterna || !generales.tipo_producto || !generales.nombre_generico || !generales.nombre_comercial
    ) {
        return { error: true, message: 'Campo obligatorio', vista1: true };
    } else if(
        /* si hay cantidad almacen pero no hay almacen seleccionado */
        almacen.cantidad > 0 && !almacen.almacen && generales.tipo_producto === "OTROS"
    ) {
        console.log("si hay cantidad almacen pero no hay almacen seleccionado");
        return { error: true, message: 'Campo obligatorio', vista3: true };
    }/*  else if(
        //si no hay almacen seleccionado
        presentaciones.length > 0 && !almacen.almacen && !almacen_existente
    ){
        console.log("no hay present");
        return { error: true, message: 'Campo obligatorio', vista7: true };
    } */ else {
        /* si hay todos los datos */
        return { error: false, message: '' };
    }
}