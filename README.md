Ficha Médica QR - Bomberos
Esta es una aplicación web para gestionar las fichas médicas de los integrantes de un cuartel de bomberos y generar códigos QR para un acceso rápido en caso de emergencia.

La aplicación utiliza HTML, Tailwind CSS, y JavaScript, con Firebase como base de datos y sistema de autenticación.

Estructura de Archivos
index.html: Es la estructura principal de la página. Contiene el formulario de login y el panel de administración.

style.css: Contiene algunos estilos personalizados para mejorar la responsividad de la aplicación.

script.js: Contiene toda la lógica de la aplicación, incluyendo la conexión a Firebase, la autenticación de usuarios y la gestión de los datos de los bomberos.

Puesta en Marcha (¡Importante!)
Para que la aplicación funcione en tu página de GitHub (https://911apruebadefuego.github.io/), necesitas configurar correctamente tu proyecto de Firebase.

Paso 1: Configuración del Proyecto en Firebase
Si aún no lo has hecho, crea un proyecto en Firebase.

Crear Base de Datos (Firestore):

En el menú, ve a Compilación > Firestore Database.

Haz clic en Crear base de datos y elige una ubicación.

Importante: Inicia en modo de producción.

Configurar Autenticación:

Ve a Compilación > Authentication.

En la pestaña Sign-in method, habilita el proveedor Correo electrónico/Contraseña.

En la pestaña Settings > Dominios autorizados, asegúrate de que esté tu dominio 911apruebadefuego.github.io.

Paso 2: Crear el Usuario Administrador
En la sección de Authentication, ve a la pestaña Users.

Haz clic en Añadir usuario.

Ingresa el email y una contraseña segura que usarás para acceder al panel de administración.

Paso 3: Actualizar las Reglas de Seguridad
Estas reglas son cruciales para proteger tus datos, permitiendo que cualquiera pueda leer los QR pero que solo tú puedas modificar la información.

Ve a Compilación > Firestore Database.

Selecciona la pestaña Reglas.

Borra el contenido actual y pega estas nuevas reglas:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // La colección de bomberos es de lectura pública para los QR,
    // pero solo usuarios autenticados pueden escribir (crear, editar, borrar).
    match /bomberos-data/{bomberoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

Haz clic en Publicar.

Paso 4: Subir los archivos a GitHub
Asegúrate de que los archivos index.html, style.css y script.js estén actualizados en tu repositorio de GitHub. Una vez subidos y con la configuración de Firebase lista, la aplicación funcionará correctamente con el nuevo sistema de inicio de sesión seguro.