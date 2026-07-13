import { state } from "./state.js";


export const CLAVE = "whatsapp-templates";
export const CLAVE_FILTRO = "whatsapp-templates-filtro";

export function guardar() {
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
}

export function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }

}