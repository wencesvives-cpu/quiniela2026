# ⚽ Quiniela Familia Vives y Asociados — Mundial 2026
## Instrucciones de configuración y uso

---

## ¿Qué hay nuevo? (actualización junio 2026)

- **Fases de eliminatoria** añadidas: Dieciseisavos, Octavos, Cuartos, Semis, Final (102 partidos en total)
- **Puntuación ponderada**: 1 pto fase de grupos · 2 ptos dieciseisavos y octavos · 4 cuartos · 8 semis · 16 final
- **Resultados automáticos**: si tienes clave de football-data.org, la app actualiza resultados sola cada hora
- **Equipos en eliminatoria**: el admin puede introducirlos a mano o se rellenan solos al llegar resultados de la API

---

## CONFIGURACIÓN INICIAL (si ya tienes el Firebase configurado, salta al PASO 5)

### PASO 1 — Crear proyecto Firebase
*(si ya lo tienes creado y funcionando, omite este paso)*

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com) e inicia sesión.
2. Crea un nuevo proyecto → nombre sugerido: `quiniela-mundial-2026`
3. Ve a **Firestore Database** → **Crear base de datos** → Modo de prueba
4. Ve a ⚙️ Configuración del proyecto → "Tus apps" → icono Web `</>` → copia el bloque `firebaseConfig`

### PASO 2 — Pegar la configuración en index.html

1. Abre `index.html` con un editor de texto.
2. Cerca de la línea `const firebaseConfig = {` sustituye los valores por los de tu proyecto Firebase.
3. (Opcional) Cambia `const ADMIN_PASSWORD = "mundial2026admin"` por tu contraseña preferida.

### PASO 3 — Clave de resultados automáticos (OPCIONAL pero recomendado)

1. Regístrate gratis en [https://www.football-data.org/client/register](https://www.football-data.org/client/register)
2. Te mandarán un email con tu API key.
3. Pégala en el archivo `index.html` donde dice:
   ```js
   const FOOTBALL_DATA_KEY = "";  // ← pega aquí tu clave
   ```
4. Con la clave puesta, los resultados de cada partido se cargan automáticamente cada hora sin que tengas que hacer nada.

### PASO 4 — Subir a Netlify

1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Arrastra el archivo `index.html` al área de "Drag and drop"
3. Obtendrás una URL tipo `https://vivesquiniela2026.netlify.app`

---

## ⚠️ CRÍTICO — Renovar reglas de Firestore antes del 12 de julio

Las reglas de Firestore en "modo de prueba" expiran 30 días después de haberse creado.
**Si no las renuevas, la app dejará de funcionar antes de la Final (19 julio).**

**Cómo renovarlas:**
1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto → **Firestore Database** → pestaña **Rules**
3. Verás algo así:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2026, 7, 12);
       }
     }
   }
   ```
4. Cambia la fecha a `timestamp.date(2026, 8, 1)` (1 de agosto):
   ```
   allow read, write: if request.time < timestamp.date(2026, 8, 1);
   ```
5. Haz clic en **Publicar** (Publish).

**Hazlo antes del 12 de julio.**

---

## PASO 5 — Compartir con los participantes

Envía la URL a todos. Cada persona:
1. Entra a la URL
2. Escribe su nombre/alias
3. Selecciona 1, X o 2 para cada partido de la fase de grupos
4. Pulsa **Guardar**

Para la eliminatoria, los botones cambian a solo **1 o 2** (sin empate). Los partidos cuyas equipos aún no están confirmados aparecen bloqueados hasta que se sepa quién juega.

---

## Plazos para hacer pronósticos

| Fase | Plazo máximo (hora CDMX) |
|------|--------------------------|
| Jornada 1 (11-17 Jun) | 10 jun · 23:59 |
| Jornada 2 (18-23 Jun) | 17 jun · 23:59 |
| Jornada 3 (24-27 Jun) | 23 jun · 23:59 |
| Dieciseisavos (29 Jun-2 Jul) | 28 jun · 23:59 |
| Octavos (4-7 Jul) | 3 jul · 23:59 |
| Cuartos (9-10 Jul) | 8 jul · 23:59 |
| Semifinales (14-15 Jul) | 13 jul · 23:59 |
| 3er puesto + Final (18-19 Jul) | 17 jul · 23:59 |

---

## Puntuación

| Fase | Puntos por acierto |
|------|--------------------|
| Fase de grupos (Jornadas 1, 2 y 3) | 1 |
| Dieciseisavos y Octavos | 2 |
| Cuartos de final | 4 |
| Semifinales | 8 |
| 3er puesto y Final | 16 |

---

## Panel de administrador

Accede añadiendo `#admin` al final de la URL: `https://tu-url.netlify.app/#admin`

Aparece un icono ⚙️ en la esquina inferior derecha. Al pulsarlo:

- **Resultados** — marca el resultado (1/X/2) de cada partido de forma manual (si no tienes clave de API o quieres corregir algo)
- **Actualizar ahora** — fuerza la descarga de resultados desde football-data.org en ese momento
- **Equipos eliminatoria** — cuando se sepan los cruces, escribe los nombres de los equipos en cada partido
- **Cerrar pronósticos** — cierra todos los pronósticos manualmente (además del cierre automático por fecha)
- Al guardar, los puntos de todos los participantes se recalculan automáticamente

---

## Preguntas frecuentes

**¿Dos personas pueden usar el mismo nombre?**
Pueden tener problemas (se sobreescribirían los datos). Pide que usen alias únicos.

**¿Qué pasa si alguien no rellena un partido?**
Cuenta como 0 puntos.

**¿La eliminatoria muestra "Por definir" en los equipos?**
Normal — esos partidos se desbloquean cuando el admin introduce los equipos o cuando la API los detecta automáticamente al terminar cada fase.

**¿Funciona sin clave de football-data.org?**
Sí, pero deberás introducir los resultados a mano desde el panel de admin.

**¿Es segura la base de datos?**
Para una quiniela entre familia y amigos, sí. No hay información sensible y el acceso es público (modo prueba de Firebase).
