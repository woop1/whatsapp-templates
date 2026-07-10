const state = {
  plantillas: cargar(),
  editandoId: null,
  filtro: ""
};

// DOM
const lista = document.getElementById("listaPlantillas");
const form = document.getElementById("form-plantilla");

const titulo = document.getElementById("titulo");
const mensaje = document.getElementById("mensaje");
const hashtag = document.getElementById("hashtag");

const selector = document.getElementById("selector");


function renderSelector() {

  selector.innerHTML = "";

  state.plantillas.forEach(function (plantilla) {

    const opcion = document.createElement("option");

    opcion.value = plantilla.id;
    opcion.textContent = plantilla.titulo;

    selector.appendChild(opcion);

  });

}

// HU3
function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();
  return limpio.startsWith("#") ? limpio : "#" + limpio;
}

// HU1
function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva);
}

// HU1 eliminar
function eliminarPlantilla(id) {
  state.plantillas = state.plantillas.filter(
    plantilla => plantilla.id !== id
  );
  render();
}

// HU2 editar (cargar datos)
function cargarEnFormulario(id) {
  const plantilla = state.plantillas.find(
    plantilla => plantilla.id === id
  );

  titulo.value = plantilla.titulo;
  mensaje.value = plantilla.mensaje;
  hashtag.value = plantilla.hashtag;

  state.editandoId = id;
}

// HU3 stats
function contarPorHashtag(plantillas) {
  const conteo = {};

  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;

    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;
    } else {
      conteo[elHashtag] = 1;
    }
  });

  return conteo;
}

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

// HU4 filtro
function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();

  if (filtroTexto === "") return state.plantillas;

  return state.plantillas.filter(plantilla =>
    plantilla.hashtag.toLowerCase().includes(filtroTexto)
  );
}

// HU2 generar mensaje
function generarMensajeFinal(plantilla, valorNombre) {
  return plantilla.mensaje.replaceAll("{nombre}", valorNombre);
}

const salida = document.getElementById("mensaje-final");

// RENDER
function render() {
  

  guardar();

  lista.innerHTML = "";

  plantillasVisibles().forEach(function (plantilla) {
    const li = document.createElement("li");
    li.className = "bg-white p-4 rounded-lg shadow";

    li.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <strong class="text-slate-800">${plantilla.titulo}</strong>
        <span class="text-xs text-slate-400 shrink-0">
          ${new Date(plantilla.fecha).toLocaleDateString("es-PE")}
        </span>
      </div>

      <p class="text-sm text-slate-600 mt-1">${plantilla.mensaje}</p>

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

  renderStats();
  renderSelector();
}

// SUBMIT crear / editar
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

  render();
  form.reset();
});

// DELEGACIÓN DE EVENTOS
lista.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;

  if (evento.target.classList.contains("btn-eliminar")) {
    eliminarPlantilla(id);
  }

  if (evento.target.classList.contains("btn-editar")) {
    cargarEnFormulario(id);
  }
});

// BUSCADOR HU4
document.getElementById("buscador")
  .addEventListener("input", function (evento) {
    state.filtro = evento.target.value;
    render();
  });

document.getElementById("btn-vaciar")
  .addEventListener("click", function () {

    state.plantillas = [];

    render();

  });

// GENERAR MENSAJE
document.getElementById("btn-generar")
  .addEventListener("click", function () {

    const idSeleccionado = selector.value;

    const plantilla = state.plantillas.find(
      plantilla => plantilla.id === idSeleccionado
    );

    const nombre = document.getElementById("valorNombre").value;

    if (!plantilla) {
      salida.textContent = "Selecciona una plantilla";
      return;
    }

    const resultado = generarMensajeFinal(
      plantilla,
      nombre
    );

    salida.textContent = resultado;

  });


  // COPIAR MENSAJE
document.getElementById("btn-copiar")
  .addEventListener("click", function () {

    const texto = salida.textContent;

    navigator.clipboard.writeText(texto);

  });

  // LOGRO 1 - Exportar JSON en consola
function exportarPlantillas() {
  console.log(
    JSON.stringify(state.plantillas, null, 2)
  );
}




// INIT
aumentarVisitas();

state.plantillas = cargar();

state.filtro = localStorage.getItem(CLAVE_FILTRO) ?? "";

document.getElementById("buscador").value = state.filtro;

render();