export const validateJsonEdit = async (data, tipo) => {
    if (tipo === "datos_generales") {
      let object_date = {
        clave_alterna: data.clave_alterna,
        tipo_producto: data.tipo_producto,
        nombre_comercial: data.nombre_comercial,
        nombre_generico: data.nombre_generico,
        receta_farmacia: data.receta_farmacia,
      };
      if (data.codigo_barras !== null && data.codigo_barras !== "")
        object_date = { ...object_date, codigo_barras: data.codigo_barras };
      if (data.descripcion !== null && data.descripcion !== "")
        object_date = { ...object_date, descripcion: data.descripcion };
      if (data.id_categoria !== null && data.id_categoria !== "")
        object_date = { ...object_date, id_categoria: data.id_categoria };
      if (data.categoria !== null && data.categoria !== "")
        object_date = { ...object_date, categoria: data.categoria };
      if (data.subcategoria !== null && data.subcategoria !== "")
        object_date = { ...object_date, subcategoria: data.subcategoria };
      if (data.id_subcategoria !== null && data.id_subcategoria !== "")
        object_date = { ...object_date, id_subcategoria: data.id_subcategoria };
      if (data.id_departamento !== null && data.id_departamento !== "")
        object_date = { ...object_date, id_departamento: data.id_departamento };
      if (data.departamento !== null && data.departamento !== "")
        object_date = { ...object_date, departamento: data.departamento };
      if (data.id_marca !== null && data.id_marca !== "")
        object_date = { ...object_date, id_marca: data.id_marca };
      if (data.marca !== null && data.marca !== "")
        object_date = { ...object_date, marca: data.marca };
      if (data.clave_producto_sat.Name !== null)
        object_date = {
          ...object_date,
          clave_producto_sat: data.clave_producto_sat,
        };
      return object_date;
    } else if (tipo === "unidades_de_venta") {
      let end_array = [];
      for (var i = 0; i < data.length; i++) {
        let object = {
          _id: data[i]._id,
          cantidad: data[i].cantidad,
          id_producto: data[i].id_producto,
          precio: data[i].precio,
          unidad_principal: data[i].unidad_principal,
          unidad: data[i].unidad,
          codigo_unidad: data[i].codigo_unidad,
          precio_unidad: data[i].precio_unidad
        };
        if (data[i].codigo_barras !== null && data[i].codigo_barras !== "")
          object = { ...object, codigo_barras: data[i].codigo_barras };
        if (data[i].default !== null && data[i].default !== "")
          object = { ...object, default: data[i].default };
        if (data[i].descuento_activo !== null && data[i].descuento_activo !== "")
          object = { ...object, descuento_activo: data[i].descuento_activo, descuento: data[i].descuento };
          
          end_array.push(object);
      }
      return end_array;
    }
  };