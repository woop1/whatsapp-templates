# 📌 Proyecto: Plantillas WhatsApp

## 📦 Clase Template

La clase `Template` representa una plantilla de mensaje.

Cada objeto contiene:

- `titulo`: nombre de la plantilla
- `mensaje`: texto del mensaje (puede incluir `{nombre}`)
- `hashtag`: etiqueta de la plantilla
- `fecha`: fecha automática de creación usando `new Date()`

Esta clase permite crear plantillas de forma estructurada y guardarlas en una lista central del sistema.

---

## 🧠 Métodos de String utilizados

### 1. `trim()`
Se utilizó para eliminar espacios en blanco al inicio y al final de los campos ingresados por el usuario.

Ejemplo de uso:
- Evita que `"  ventas  "` se guarde con espacios innecesarios.

---

### 2. `toLowerCase()`
Se utilizó para convertir el hashtag a minúsculas.

Ejemplo:
- `"VENTAS"` → `"ventas"`

---

### 3. `startsWith()`
Se utilizó para verificar si el hashtag ya comienza con `#`.

Si no lo tiene, se le agrega automáticamente.

---

### 4. `replaceAll()`
Se utilizó para reemplazar la variable `{nombre}` dentro del mensaje.

Ejemplo:
- `"Hola {nombre}"` → `"Hola Ana"`

---

## 🌐 Deploy

👉 https://woop1.github.io/whatsapp-templates/