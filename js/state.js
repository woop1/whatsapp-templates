export const state = {
  plantillas: [],
  editandoId: null,
  filtro: "",
  orden: "recientes"
};


export function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();
  return limpio.startsWith("#")
    ? limpio
    : "#" + limpio;
}


export function contarPorHashtag(plantillas) {
  const conteo = {};
  plantillas.forEach(function (plantilla) {
    const hashtag = plantilla.hashtag;
    if (conteo[hashtag]) {
      conteo[hashtag]++;
    } else {
      conteo[hashtag] = 1;
    }
  });

  return conteo;
}



export function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  const filtradas = filtroTexto === ""
    ? state.plantillas
    : state.plantillas.filter(plantilla =>
        plantilla.hashtag.toLowerCase().includes(filtroTexto)
      );
  return ordenar(filtradas);
}


function ordenar(plantillas) {
  const copia = [...plantillas];
  return state.orden === "antiguas"
    ? copia.sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      )
    : copia.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
}
