const CLAVE = "whatsapp-templates";
const CLAVE_FILTRO = "whatsapp-templates-filtro";

function guardar() {

  state.plantillas.length === 0
    ? localStorage.removeItem(CLAVE)
    : localStorage.setItem(
        CLAVE,
        JSON.stringify(state.plantillas)
      );

  localStorage.setItem(
    CLAVE_FILTRO,
    state.filtro ?? ""
  );

  document.getElementById("estado").textContent =
    state.plantillas.length > 0
      ? "Guardado ✓"
      : "Vacío";
}


function cargar() {

  const guardado = localStorage.getItem(CLAVE);

  if (!guardado) return [];

  try {
    return JSON.parse(guardado);

  } catch (error) {
    console.warn("Datos corruptos, empiezo de cero:", error);
    return [];
  }
}


const CLAVE_VISITAS = "whatsapp-templates-visitas";


function aumentarVisitas() {

  const visitasActuales = localStorage.getItem(CLAVE_VISITAS);

  const nuevasVisitas = visitasActuales
    ? Number(visitasActuales) + 1
    : 1;

  localStorage.setItem(
    CLAVE_VISITAS,
    nuevasVisitas
  );

}