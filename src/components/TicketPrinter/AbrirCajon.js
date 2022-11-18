const puerto = "8080";

export const abrirCajonQuery = async (impresora) => {
  try {
    const result = await fetch(
      `http://localhost:${puerto}/?impresora=${impresora}`
    );
    const resultDecodificada = await result.json();
    if (result.status === 200) {
      return { success: true, message: "Cajon abierto" };
    } else {
      return { success: false, message: resultDecodificada };
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: "Error al abrir cajon, No se detecto impresora" };
  }
};
