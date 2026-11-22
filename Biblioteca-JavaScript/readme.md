# 📚 Biblioteca Ohara - Aplicación SPA (Segunda Parte)

Bienvenido al repositorio de la **Segunda Parte** del proyecto **Biblioteca Ohara**. Este sistema es una aplicación web desarrollada como **SPA (Single Page Application)** con una arquitectura modular en **PHP nativo** en el servidor, **JavaScript asíncrono (AJAX)** en el cliente, y **Bootstrap 5** para la interfaz visual (utilizando exclusivamente las clases y componentes de Bootstrap sin hojas de estilo CSS personalizadas), respaldada por un entorno **LAMP** (Linux, Apache, MySQL, PHP) gestionado mediante **Docker Compose**.

---

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu equipo:
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/) (incluido de serie en Docker Desktop)

---

## 🌐 Enlaces del Proyecto

* **Repositorio en GitHub:** <https://github.com/Equipo42DAM/Biblioteca-JavaScript>
* **Despliegue / Alojamiento Web:** <https://bibliotecaoharaspa.infinityfree.me>

---

## 👥 Equipo de Desarrollo y Entidades Asignadas

| Alumno | Entidad / Tabla Responsable | Descripción de la Responsabilidad |
| :--- | :--- | :--- |
| **Carlos** | `editorial_carlos` | Gestión de casas editoras, datos de contacto y origen |
| **Manuel** | `libros_manuel` | Ficha catalográfica de obras e ISBN |
| **JuanJo** | `ejemplares_juanjo` | Control físico de copias, signaturas y código de barras |
| **Juan josé R.P.** | `prestamos_juanjorpa` | Gestión de transacciones de préstamos y fianzas |

> *Tablas maestras y auxiliares del sistema (`paises`, `estados_ejemplar`, `usuarios`) administradas conjuntamente.*

## 🔑 Datos de Conexión a la Base de Datos

* **Nombre de la Base de Datos:** `biblioteca_ohara`
* **Usuario BD:** `admin`
* **Contraseña BD:** `admin`
* **Servidor / Host (Docker):** `db` (usar `localhost` o `127.0.0.1` en entornos locales sin Docker)
* **Gestor web (phpMyAdmin):** <http://localhost:8081>
---

## 🗄️ Estructura del Proyecto

El proyecto sigue la siguiente estructura de directorios y archivos en la raíz:

```text
nombre_proyecto/
│
├── docs/                     # Documentación 
├── js/                       # Scripts de JS 
├── img/                      # Recursos gráficos e imágenes del sistema
├── php/                      # Recursos para conectarte a la BBDD, listar, editar y borrar
│   └── config.php            # Fichero php para establecer la conexión con la BBDD
├── sql/
│   ├── backup.sql            # Copia de seguridad con estructura relacional y datos de prueba (10+ registros por tabla)
│   └── diagrama_er.png       # Imagen del diagrama Entidad-Relación generado en phpMyAdmin
│
├── .gitignore                # Archivos y carpetas ignorados por Git
├── docker-compose.yml        # Configuración de los contenedores Docker (LAMP)
├── index.html                # Página única contenedora de la SPA
└── README.md                 # Documentación técnica del proyecto
```

---

## 📊 Estructura de la Base de Datos y Modelo Relacional

La base de datos **`biblioteca_ohara`** consta de tablas relacionadas entre sí mediante claves ajenas con cardinalidad **1:N**:

1. **`paises`**: Tabla auxiliar de soporte geográfico.
2. **`editorial_carlos`**: Almacena las casas editoras asociadas a los libros (Relación 1:N con `paises`).
3. **`libros_manuel`**: Registro bibliográfico de las obras (Relación 1:N con `editorial_carlos`).
4. **`estados_ejemplar`**: Tabla auxiliar de estados físicos.
5. **`ejemplares_juanjo`**: Copias físicas individuales de cada libro (Relación 1:N con `libros_manuel` y `estados_ejemplar`).
6. **`prestamos_juanjorpa`**: Control histórico de salidas y préstamos de cada ejemplar (Relación 1:N con `ejemplares_juanjo`).
7. **`usuarios`**: Gestión de usuarios del sistema con roles y control de acceso.

*Las columnas de las tablas combinan correctamente tipos de datos enteros/reales (no PK/FK), cadenas de texto, booleanos y fechas (`DATE` / `DATETIME`), utilizando claves primarias autoincrementadas (*A.I.*).*

---

## ⚙️ Instrucciones de Instalación y Ejecución Local

1. **Clonar o descargar el repositorio** en tu equipo local.
2. **Arrancar los contenedores con Docker** ejecutando en la raíz del proyecto:
   ```bash
   docker compose up -d --build
   ```
3. **Base de datos:** El script de volcado en `sql/backup.sql` (o el sistema automatizado) se inicializará en el contenedor de MySQL, cargando la estructura relacional y los datos de prueba iniciales con las credenciales indicadas (`admin` / `admin`).
4. **Acceso:** Abre tu navegador web y accede a `http://localhost` (o el puerto configurado en tu entorno Docker) para interactuar con la SPA.

---

## 👥 Credenciales de Prueba del Sistema

Puedes iniciar sesión en la aplicación con los siguientes usuarios predefinidos:

* **Administrador:**
  * *Usuario:* `admin`
  * *Contraseña:* `admin123`
* **Personal de Gestión:**
  * *Usuario:* `usuario1`
  * *Contraseña:* `user123`