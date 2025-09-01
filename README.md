Ficha Médica QR - Bomberos

Esta es una aplicación web para gestionar las fichas médicas de los integrantes de un cuartel de bomberos y generar códigos QR para un acceso rápido en caso de emergencia.



La aplicación utiliza HTML, Tailwind CSS, y JavaScript, con Firebase como base de datos, sistema de autenticación y almacenamiento de archivos.



Estructura de Archivos

index.html: Estructura principal de la página.



style.css: Estilos personalizados y utilidades.



script.js: Toda la lógica de la aplicación (conexión a Firebase, autenticación, gestión de datos).



firebase-config.js: (NUEVO Y PRIVADO) Archivo donde guardarás tus claves de Firebase. No debe subirse a GitHub.



.gitignore: (NUEVO) Archivo que le indica a Git ignorar firebase-config.js.



Puesta en Marcha (¡Importante!)

Sigue estos pasos para que la aplicación funcione correctamente.



Paso 1: Configuración del Proyecto en Firebase

Crear Proyecto: Si aún no lo has hecho, crea un proyecto en la Consola de Firebase.



Añadir App Web: Dentro de tu proyecto, añade una nueva aplicación web (el icono </>). Dale un nombre y registra la aplicación.



Obtener Configuración: Firebase te mostrará un objeto firebaseConfig. Copia estas claves.



Crear firebase-config.js: En tu computadora, en la misma carpeta del proyecto, crea un archivo llamado firebase-config.js y pega dentro el siguiente contenido, reemplazando los valores con los que copiaste de Firebase:



// Este archivo contiene la configuración de tu proyecto de Firebase.

// ¡NUNCA subas este archivo a GitHub!



export const firebaseConfig = {

&nbsp; apiKey: "TU\_API\_KEY",

&nbsp; authDomain: "TU\_AUTH\_DOMAIN",

&nbsp; projectId: "TU\_PROJECT\_ID",

&nbsp; storageBucket: "TU\_STORAGE\_BUCKET",

&nbsp; messagingSenderId: "TU\_MESSAGING\_SENDER\_ID",

&nbsp; appId: "TU\_APP\_ID"

};



Paso 2: Configurar Servicios de Firebase

Authentication:



Ve a Compilación > Authentication.



En la pestaña Sign-in method, habilita el proveedor Correo electrónico/Contraseña.



En la pestaña Settings > Dominios autorizados, añade el dominio donde se alojará tu app (ej: 911apruebadefuego.github.io).



Crea un usuario administrador desde la pestaña Users para poder iniciar sesión.



Firestore Database:



Ve a Compilación > Firestore Database.



Haz clic en Crear base de datos (inicia en modo de producción).



Ve a la pestaña Reglas, borra el contenido y pega estas reglas:



rules\_version = '2';

service cloud.firestore {

&nbsp; match /databases/{database}/documents {

&nbsp;   // Lectura pública para los QR, escritura solo para administradores autenticados.

&nbsp;   match /bomberos-data/{bomberoId} {

&nbsp;     allow read: if true;

&nbsp;     allow write: if request.auth != null;

&nbsp;   }

&nbsp; }

}



Haz clic en Publicar.



Storage:



Ve a Compilación > Storage.



Completa el asistente de configuración si es la primera vez.



Ve a la pestaña Reglas, borra el contenido y pega estas reglas:



rules\_version = '2';

service firebase.storage {

&nbsp; match /b/{bucket}/o {

&nbsp;   // Permite la lectura pública de las fotos de perfil.

&nbsp;   match /profile\_images/{bomberoId}/{allPaths=\*\*} {

&nbsp;     allow read: if true;

&nbsp;   }

&nbsp;   // Permite la escritura (subir/borrar fotos) solo a administradores autenticados.

&nbsp;   match /profile\_images/{bomberoId}/{allPaths=\*\*} {

&nbsp;     allow write: if request.auth != null;

&nbsp;   }

&nbsp; }

}



Haz clic en Publicar.



Paso 3: Subir los archivos a GitHub

Asegúrate de tener todos los archivos (index.html, style.css, script.js, .gitignore) en tu repositorio.



MUY IMPORTANTE: Verifica que el archivo firebase-config.js NO se suba a GitHub. El archivo .gitignore se encargará de esto.



Sube los cambios a tu repositorio. Una vez desplegado, la aplicación funcionará de forma segura.

