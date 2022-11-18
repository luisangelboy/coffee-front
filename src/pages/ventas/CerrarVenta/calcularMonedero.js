export const calcularMonedero = (venta) => {
    let suma = 0;
    if (venta) {
      venta.productos.forEach((element) => {
        if (element.id_producto.precios.monedero) {
          //multiplicacion del puntos de este producto con el total de este
          const { monedero_electronico } = element.id_producto.precios;
          const resultado = monedero_electronico * element.precio_a_vender;
          suma += resultado;
        }
      });
    }
    return suma;
  };