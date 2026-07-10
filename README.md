
## 🌐 Deploy

👉 [https://woop1.github.io/whatsapp-templates/](https://woop1.github.io/whatsapp-templates/)

---

# 📌 Proyecto: Plantillas WhatsApp

## 📦 Clase Template

La clase `Template` representa una plantilla de mensaje.

Cada objeto contiene:

* `id`: identificador único generado con `crypto.randomUUID()`
* `titulo`: nombre de la plantilla
* `mensaje`: texto del mensaje (puede incluir `{nombre}`)
* `hashtag`: etiqueta de la plantilla
* `fecha`: fecha automática de creación usando `new Date()`

Esta clase permite crear plantillas de forma estructurada y guardarlas en una lista central del sistema.

---

## 🧠 Métodos de String utilizados

### 1. `trim()`

Se utilizó para eliminar espacios en blanco al inicio y al final de los campos ingresados por el usuario.

Ejemplo:

* `"  ventas  "` → `"ventas"`

---

### 2. `toLowerCase()`

Se utilizó para convertir el hashtag a minúsculas.

Ejemplo:

* `"VENTAS"` → `"ventas"`

---

### 3. `startsWith()`

Se utilizó para verificar si el hashtag ya comienza con `#`.

Si no lo tiene, se le agrega automáticamente.

---

### 4. `replaceAll()`

Se utilizó para reemplazar la variable `{nombre}` dentro del mensaje.

Ejemplo:

* `"Hola {nombre}"` → `"Hola Ana"`

---

## 🧩 Delegación de eventos

La delegación de eventos se implementó escuchando los clics en el contenedor principal de la lista de plantillas (`listaPlantillas`), en lugar de agregar un evento a cada botón individual.

```js
lista.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;

  if (evento.target.classList.contains("btn-eliminar")) {
    eliminarPlantilla(id);
  }

  if (evento.target.classList.contains("btn-editar")) {
    cargarEnFormulario(id);
  }
});
```

### 📌 ¿Cómo funciona?

* Se coloca un solo listener en el elemento padre (`ul`).
* Cuando el usuario hace clic en un botón, el evento se detecta desde el contenedor.
* Se identifica el botón usando:

  * `classList.contains()`
  * `dataset.id`

### 🎯 ¿Para qué sirve?

* Evita múltiples eventos por cada botón.
* Permite que los botones funcionen aunque las tarjetas se eliminen o se re-rendericen.
* Hace el código más eficiente y fácil de mantener.

---

## 📊 Función `contarPorHashtag`

Esta función es una función pura que analiza las plantillas y cuenta cuántas existen por cada hashtag.

```js
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
```

### 📌 ¿Cómo funciona?

* Recibe un array de plantillas.
* Recorre cada plantilla.
* Usa un objeto como acumulador:

  * clave = hashtag
  * valor = cantidad de apariciones
* Devuelve un objeto con el conteo final.

### 🎯 ¿Para qué sirve?

* Generar estadísticas en tiempo real.
* Mostrar cuántas plantillas existen por hashtag.
* Mantener el panel de estadísticas actualizado automáticamente al agregar, editar o eliminar plantillas.


---

# 💾 Persistencia de datos

La aplicación permite conservar las plantillas creadas por el usuario incluso después de cerrar o recargar el navegador.

La persistencia se realiza utilizando `localStorage` del navegador y se encuentra centralizada en el archivo:

```
js/persistence.js
```

---

## 💾 Guardado del estado

Para almacenar las plantillas se utiliza una clave única:

```js
const CLAVE = "whatsapp-templates";
```

Como `localStorage` solamente permite guardar información en formato texto, el array de objetos `state.plantillas` debe convertirse a JSON antes de almacenarse.

Ejemplo:

```js
localStorage.setItem(
  CLAVE,
  JSON.stringify(state.plantillas)
);
```

### 📌 ¿Cómo funciona?

* El estado actual de las plantillas se convierte en una cadena JSON.
* Esa información se guarda dentro del navegador.
* Cada modificación realizada en las plantillas actualiza automáticamente los datos almacenados.

El guardado ocurre dentro de la función `render()`, ya que todas las acciones importantes terminan ejecutando esta función:

* Crear una plantilla.
* Editar una plantilla.
* Eliminar una plantilla.
* Vaciar la lista completa.

---

## 🗑️ Eliminación cuando no existen datos

Cuando la lista de plantillas queda vacía, se elimina la información almacenada:

```js
localStorage.removeItem(CLAVE);
```

### 🎯 ¿Para qué sirve?

* Evita guardar información innecesaria.
* Mantiene limpio el almacenamiento del navegador.
* Permite que la aplicación inicie correctamente sin datos antiguos.

---

# 📥 Carga del estado

Al iniciar la aplicación, se recuperan automáticamente las plantillas almacenadas:

```js
state.plantillas = cargar();
```

La función `cargar()` obtiene la información guardada en `localStorage` y la convierte nuevamente en un array:

```js
const guardado = localStorage.getItem(CLAVE);

return guardado ? JSON.parse(guardado) : [];
```

### 📌 ¿Cómo funciona?

* Busca los datos almacenados utilizando la clave correspondiente.
* Convierte el texto JSON nuevamente en objetos JavaScript.
* Si no existen datos guardados, devuelve una lista vacía.

Ejemplo:

```js
[]
```

Esto permite que la aplicación funcione correctamente incluso cuando se utiliza por primera vez.

---

# ⚠️ Manejo de datos corruptos

Para evitar que la aplicación falle cuando los datos almacenados tienen un formato incorrecto, se utiliza `try/catch`.

Ejemplo de dato corrupto:

```text
[{titulo
```

Al intentar convertirlo con:

```js
JSON.parse(guardado);
```

JavaScript genera un error porque el contenido no es un JSON válido.

Para manejar este caso se utiliza:

```js
try {
  return JSON.parse(guardado);
} catch (error) {
  console.warn("Datos corruptos, empiezo de cero:", error);
  return [];
}
```

### 📌 ¿Qué ocurre si los datos están dañados?

* Se muestra una advertencia en la consola.
* La aplicación continúa funcionando.
* Las plantillas se reinician como una lista vacía.

### 🎯 ¿Para qué sirve?

Permite que un dato corrupto dentro de `localStorage` no bloquee el funcionamiento completo de la aplicación.

---

# 🔎 Persistencia del filtro de búsqueda

Además de las plantillas, también se guarda el filtro utilizado por el usuario.

Para esto se utiliza una segunda clave:

```js
const CLAVE_FILTRO = "whatsapp-templates-filtro";
```

Como el filtro ya es texto, no necesita convertirse con `JSON.stringify()`:

```js
localStorage.setItem(
  CLAVE_FILTRO,
  state.filtro ?? ""
);
```

Al abrir nuevamente la aplicación:

* Se recupera el último filtro utilizado.
* El buscador mantiene el mismo valor.
* El usuario puede continuar trabajando desde donde dejó la aplicación.

---

# 📅 Manejo de fechas

Cada plantilla guarda una fecha automática de creación utilizando:

```js
new Date()
```

Sin embargo, JSON no conserva objetos `Date` como objetos JavaScript, sino que los convierte en texto.

Por este motivo, al mostrar la fecha nuevamente en pantalla se reconstruye:

```js
new Date(plantilla.fecha).toLocaleDateString("es-PE")
```

### 📌 ¿Cómo funciona?

* La fecha se guarda como texto dentro del JSON.
* Al cargar la información, se vuelve a convertir en un objeto `Date`.
* Se muestra utilizando el formato de fecha local de Perú.

### 🎯 ¿Para qué sirve?

Permite seguir mostrando correctamente las fechas de creación después de cerrar y volver a abrir la aplicación.

---

# ✅ Resultado final

Gracias al uso de `localStorage`, la aplicación logra:

* Mantener las plantillas creadas por el usuario.
* Recuperar la información automáticamente al iniciar.
* Evitar errores causados por datos dañados.
* Recordar el filtro de búsqueda.
* Conservar las fechas de creación.

Esto proporciona una experiencia más completa sin necesidad de utilizar una base de datos externa.

---
