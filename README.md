Aquí tienes el **README.md completo, integrado y listo para entrega**, con todo lo que ya tenías + lo que te pidieron agregar:

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

## 🌐 Deploy

👉 [https://woop1.github.io/whatsapp-templates/](https://woop1.github.io/whatsapp-templates/)

---
