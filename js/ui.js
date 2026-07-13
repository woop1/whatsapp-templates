import { Template } from "./models/Template.js";
import { guardar } from "./storage.js";
import {
  state,
  normalizarHashtag,
  contarPorHashtag,
  plantillasVisibles
} from "./state.js";

const lista = document.getElementById("listaPlantillas");
const form = document.getElementById("form-plantilla");

const titulo = document.getElementById("titulo");
const mensaje = document.getElementById("mensaje");
const hashtag = document.getElementById("hashtag");

const selector = document.getElementById("selector");
const salida = document.getElementById("mensaje-final");

const modal = document.getElementById("modal");

let accionPendiente = null;


// MODAL HU1
function pedirConfirmacion(mensaje, accion) {
  document.getElementById("modal-texto").textContent = mensaje;
  accionPendiente = accion;
  modal.classList.remove("hidden");
}

document.getElementById("modal-cancelar")
.addEventListener("click", function () {
  modal.classList.add("hidden");
  accionPendiente = null;
});

document.getElementById("modal-confirmar")
.addEventListener("click", function () {
  if (accionPendiente) {
    accionPendiente();
  }

  modal.classList.add("hidden");
  accionPendiente = null;
});


// SELECTOR
function renderSelector() {
  selector.innerHTML = "";

  state.plantillas.forEach(function (plantilla) {

    const opcion = document.createElement("option");

    opcion.value = plantilla.id;
    opcion.textContent = plantilla.titulo;

    selector.appendChild(opcion);

  });
}


// AGREGAR
function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(
    titulo,
    mensaje,
    hashtag
  );

  state.plantillas.push(nueva);
}


// ELIMINAR
function eliminarPlantilla(id) {

  pedirConfirmacion(
    "¿Eliminar esta plantilla?",
    function () {

      state.plantillas = state.plantillas.filter(
        plantilla => plantilla.id !== id
      );

      render();

    }
  );

}


// EDITAR
function cargarEnFormulario(id) {

  const plantilla = state.plantillas.find(
    plantilla => plantilla.id === id
  );

  titulo.value = plantilla.titulo;
  mensaje.value = plantilla.mensaje;
  hashtag.value = plantilla.hashtag;

  state.editandoId = id;

}


// STATS
function renderStats() {

  const total = state.plantillas.length;
  const porTag = contarPorHashtag(state.plantillas);

  const etiquetas = Object.entries(porTag)
    .map(([hashtag, cantidad]) =>
      `<span class="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full">${hashtag} · ${cantidad}</span>`
    )
    .join("");

  document.getElementById("panel-stats").innerHTML = `
    <div class="flex items-center gap-2 flex-wrap">
      <span class="text-sm font-semibold text-slate-700">${total} plantilla(s)</span>
      ${etiquetas}
    </div>
  `;
}


// RENDER
export function render() {

  const visibles = plantillasVisibles();

  lista.innerHTML = "";

  if (visibles.length === 0) {

    const vacio = state.plantillas.length === 0
      ? "Aún no tienes plantillas. ¡Crea la primera!"
      : "No se encontraron plantillas con ese filtro.";

    lista.innerHTML = `
      <li class="sm:col-span-2 text-center text-slate-400 py-10">
        <div class="text-4xl mb-2">📭</div>
        ${vacio}
      </li>
    `;

  } else {

    visibles.forEach(function (plantilla) {

      const li = document.createElement("li");

      li.className = "bg-white p-4 rounded-lg shadow";

      li.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <strong class="text-slate-800">${plantilla.titulo}</strong>

          <span class="text-xs text-slate-400 shrink-0">
            ${new Date(plantilla.fecha).toLocaleDateString("es-PE")}
          </span>
        </div>

        <p class="text-sm text-slate-600 mt-1">
          ${plantilla.mensaje}
        </p>

        <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">
          ${plantilla.hashtag}
        </span>

        <div class="flex gap-2 mt-3 pt-2 border-t border-slate-100">

          <button class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            data-id="${plantilla.id}">
            Editar
          </button>

          <button class="btn-eliminar text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
            data-id="${plantilla.id}">
            Eliminar
          </button>

        </div>
      `;

      lista.appendChild(li);

    });

  }

  renderStats();
  renderSelector();

  document.getElementById("orden").value = state.orden;

  guardar();

  document.getElementById("estado").textContent =
    state.plantillas.length > 0
      ? "Guardado ✓"
      : "Vacío";

}


// CREAR / EDITAR
form.addEventListener("submit", function (evento) {

  evento.preventDefault();

  const tituloTexto = titulo.value.trim();
  const mensajeTexto = mensaje.value.trim();

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {
    alert("Título y mensaje son obligatorios");
    return;
  }

  if (state.editandoId) {

    state.plantillas = state.plantillas.map(plantilla =>
      plantilla.id === state.editandoId
        ? {
            ...plantilla,
            titulo: tituloTexto,
            mensaje: mensajeTexto,
            hashtag: normalizarHashtag(hashtag.value),
            editadaEl: new Date()
          }
        : plantilla
    );

    state.editandoId = null;

  } else {

    agregarPlantilla(
      tituloTexto,
      mensajeTexto,
      normalizarHashtag(hashtag.value)
    );

  }

  form.reset();
  render();

});


// EVENTOS LISTA
lista.addEventListener("click", function (evento) {

  const id = evento.target.dataset.id;

  if (evento.target.classList.contains("btn-eliminar")) {
    eliminarPlantilla(id);
  }

  if (evento.target.classList.contains("btn-editar")) {
    cargarEnFormulario(id);
  }

});


// BUSCADOR

document.getElementById("btn-limpiar-filtro")
.addEventListener("click", function () {

  state.filtro = "";

  document.getElementById("buscador").value = "";

  render();

});

document.getElementById("buscador")
.addEventListener("input", function (evento) {

  state.filtro = evento.target.value;

  render();

});


// VACIAR
document.getElementById("btn-vaciar")
.addEventListener("click", function () {

  pedirConfirmacion(
    "Esto borrará TODAS tus plantillas. ¿Continuar?",
    function () {

      state.plantillas = [];

      render();

    }
  );

});


// GENERAR MENSAJE
document.getElementById("btn-generar")
.addEventListener("click", function () {

  const plantilla = state.plantillas.find(
    plantilla => plantilla.id === selector.value
  );

  const nombre = document.getElementById("valorNombre").value;

  if (!plantilla) {
    salida.textContent = "Selecciona una plantilla";
    return;
  }

  salida.textContent =
    plantilla.mensaje.replaceAll("{nombre}", nombre);

});


// COPIAR
document.getElementById("btn-copiar")
.addEventListener("click", function () {

  navigator.clipboard.writeText(
    salida.textContent
  );

});


// ORDEN HU4
document.getElementById("orden")
.addEventListener("change", function (evento) {

  state.orden = evento.target.value;

  render();

});

modal.addEventListener("click", function (evento) {

  if (evento.target === modal) {

    modal.classList.add("hidden");

    accionPendiente = null;

  }

});