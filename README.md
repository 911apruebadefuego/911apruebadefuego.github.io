Ficha Médica QR - Bomberos Voluntarios
Esta es una aplicación web diseñada para gestionar las fichas médicas de los integrantes de un cuartel de bomberos. Permite cargar datos médicos relevantes y generar un código QR único para cada integrante, facilitando el acceso rápido a su información en caso de una emergencia.

Características
Gestión de Fichas: Formulario completo para añadir y editar la información médica de cada bombero (datos personales, alergias, medicación, contacto de emergencia, etc.).

Base de Datos en Tiempo Real: Utiliza Firebase Firestore para almacenar los datos de forma segura y sincronizada.

Generación de Códigos QR: Crea un código QR único para cada ficha, que enlaza a una vista simplificada y de fácil lectura en dispositivos móviles.

Interfaz Limpia: Diseño claro y funcional utilizando TailwindCSS.

Tecnologías Utilizadas
HTML5

CSS3 (con TailwindCSS)

JavaScript (ESM - Módulos)

Firebase Firestore (Base de datos)

qrcode.js (Generación de QR)

Publicación en GitHub Pages
Para que la aplicación funcione en la URL https://911apruebadefuego.github.io/, sigue estos pasos:

1. Requisitos
Una cuenta de GitHub.

El usuario de GitHub debe ser 911apruebadefuego.

2. Creación del Repositorio
Es crucial que el repositorio tenga un nombre específico para que GitHub Pages lo sirva desde la raíz de tu dominio de usuario.

Crea un nuevo repositorio en GitHub con el nombre exacto: 911apruebadefuego.github.io.

3. Subir los Archivos
Sube los tres archivos de este proyecto (index.html, style.css y script.js) a la raíz de tu nuevo repositorio.

4. Configurar GitHub Pages
Ve a la pestaña "Settings" de tu repositorio.

En el menú de la izquierda, selecciona "Pages".

En la sección "Build and deployment", bajo "Source", asegúrate de que esté seleccionada la opción "Deploy from a branch".

En la sección "Branch", selecciona la rama main (o master) y la carpeta / (root).

Haz clic en "Save".

GitHub tardará unos minutos en construir y desplegar tu sitio. Una vez que termine, tu aplicación estará disponible públicamente en https://911apruebadefuego.github.io/.

5. Configuración de la URL en el Código
El archivo script.js ya está configurado para usar esta URL. La siguiente constante es la que define la dirección a la que apuntarán los códigos QR:

const PUBLIC_APP_URL = "[https://911apruebadefuego.github.io/](https://911apruebadefuego.github.io/)";

Si en el futuro decides cambiar la URL, solo necesitas modificar esta línea en script.js y volver a subir el archivo al repositorio.