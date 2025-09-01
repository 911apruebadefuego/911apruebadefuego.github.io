// =================================================================================
// IMPORTACIONES DE FIREBASE
// =================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, onSnapshot, setDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // CONFIGURACIÓN PRINCIPAL DE LA APP
    // =================================================================================
    const PUBLIC_APP_URL = "https://911apruebadefuego.github.io/";
    const firebaseConfig = {
      apiKey: "AIzaSyAGQ7LfHVBT4zJIAGzjliRDHw_XscyfBis",
      authDomain: "bomberos-jm-fichas.firebaseapp.com",
      projectId: "bomberos-jm-fichas",
      storageBucket: "bomberos-jm-fichas.appspot.com",
      messagingSenderId: "847464331656",
      appId: "1:847464331656:web:961de4993430f86e2ce23d"
    };

    let db, auth, storage;
    let bomberosCollectionRef;

    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        bomberosCollectionRef = collection(db, `bomberos-data`);
    } catch (e) {
        console.error("Error crítico inicializando Firebase:", e);
        document.body.innerHTML = `<div class="bg-white p-8 rounded-2xl shadow-lg m-10"><p class="text-red-600 text-center font-semibold">Error de configuración de Firebase. Revisa las claves en script.js.</p></div>`;
        return;
    }

    // =================================================================================
    // ELEMENTOS DEL DOM Y HELPERS DE UI
    // =================================================================================
    const loadingView = document.getElementById('loading-view');
    const loginView = document.getElementById('login-view');
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const logoutBtn = document.getElementById('logout-btn');
    const fichaView = document.getElementById('ficha-view');
    const bomberoDataContainer = document.getElementById('bombero-data');
    const bomberoForm = document.getElementById('bombero-form');
    const bomberosListContainer = document.getElementById('bomberos-list');
    const loadingList = document.getElementById('loading-list');
    const bomberoIdField = document.getElementById('bombero-id');

    const showNotification = (message, isError = false) => {
        const notificationArea = document.getElementById('notification-area');
        const notification = document.createElement('div');
        notification.className = `transition-all duration-300 ease-in-out opacity-0 transform translate-x-10 px-4 py-3 rounded-lg shadow-lg text-white mb-2 ${isError ? 'bg-red-600' : 'bg-green-600'}`;
        notification.innerText = message;
        notificationArea.appendChild(notification);
        setTimeout(() => notification.classList.remove('opacity-0', 'translate-x-10'), 10);
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-x-10');
            setTimeout(() => notification.remove(), 6000); // Duración extendida para leer el error
        }, 6000);
    };

    const confirmAction = (message) => {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const messageEl = document.getElementById('confirm-message');
            const okBtn = document.getElementById('confirm-ok-btn');
            const cancelBtn = document.getElementById('confirm-cancel-btn');
            messageEl.textContent = message;
            modal.classList.remove('hidden');
            const okListener = () => {
                modal.classList.add('hidden');
                cancelBtn.removeEventListener('click', cancelListener);
                resolve(true);
            };
            const cancelListener = () => {
                modal.classList.add('hidden');
                okBtn.removeEventListener('click', okListener);
                resolve(false);
            };
            okBtn.addEventListener('click', okListener, { once: true });
            cancelBtn.addEventListener('click', cancelListener, { once: true });
        });
    };

    // =================================================================================
    // LÓGICA DE LA APLICACIÓN
    // =================================================================================
    const renderFicha = (data) => {
        const imageUrl = data.imageUrl || 'https://placehold.co/150x150/e0e0e0/757575?text=S/F';
        bomberoDataContainer.innerHTML = `
            <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <img src="${imageUrl}" alt="Foto de ${data.nombreCompleto}" class="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg">
                <div class="text-center md:text-left">
                    <h2 class="text-2xl font-bold text-gray-800">${data.nombreCompleto}</h2>
                    <p class="text-gray-600">DNI: ${data.dni || 'No especificado'}</p>
                    <p class="text-gray-600">Nacimiento: ${data.fechaNacimiento ? new Date(data.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-AR') : 'No especificada'}</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div class="py-3 border-b border-gray-200 md:col-span-2"><p class="text-sm font-medium text-gray-500">Grupo Sanguíneo</p><p class="text-xl text-red-600 font-semibold">${data.grupoSanguineo || 'No especificado'}</p></div>
                <div class="py-3 border-b border-gray-200 md:col-span-2"><p class="text-sm font-medium text-gray-500">Alergias</p><p class="text-lg text-red-600 font-semibold">${data.alergias || 'Ninguna conocida'}</p></div>
                <div class="py-3 border-b border-gray-200 md:col-span-2"><p class="text-sm font-medium text-gray-500">Enfermedades Crónicas</p><p class="text-lg">${data.enfermedadesCronicas || 'Ninguna conocida'}</p></div>
                <div class="py-3 border-b border-gray-200 md:col-span-2"><p class="text-sm font-medium text-gray-500">Medicación Actual</p><p class="text-lg">${data.medicamentos || 'Ninguna'}</p></div>
                <div class="py-3 border-b border-gray-200 md:col-span-2"><p class="text-sm font-medium text-gray-500">Contacto de Emergencia</p><p class="text-lg">${data.contactoNombre || 'N/A'} (${data.contactoParentesco || 'N/A'}) - ${data.contactoTelefono || 'N/A'}</p></div>
                <div class="py-3 border-b border-gray-200 md:col-span-2"><p class="text-sm font-medium text-gray-500">Observaciones</p><p class="text-lg">${data.observaciones || 'Sin observaciones'}</p></div>
            </div>
        `;
    };

    const listenToBomberos = () => {
         onSnapshot(bomberosCollectionRef, (snapshot) => {
            loadingList.classList.add('hidden');
            if (snapshot.empty) {
                bomberosListContainer.innerHTML = '<p class="p-4 text-center text-gray-500">Aún no hay integrantes cargados.</p>';
                return;
            }
            const bomberos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            bomberosListContainer.innerHTML = `<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th></tr></thead><tbody class="bg-white divide-y divide-gray-200">${bomberos.map(b => `<tr><td class="px-4 py-2"><img src="${b.imageUrl || 'https://placehold.co/48x48/e0e0e0/757575?text=S/F'}" alt="Foto de ${b.nombreCompleto}" class="w-12 h-12 rounded-full object-cover"></td><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${b.nombreCompleto}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${b.dni}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"><button data-id="${b.id}" data-nombre="${b.nombreCompleto}" class="generate-qr-btn text-indigo-600 hover:text-indigo-900">QR</button><button data-id="${b.id}" class="edit-btn text-green-600 hover:text-green-900">Editar</button><button data-id="${b.id}" class="delete-btn text-red-600 hover:text-red-900">Borrar</button></td></tr>`).join('')}</tbody></table>`;
        }, (error) => {
            console.error("Error al escuchar cambios en bomberos: ", error);
            showNotification("Error al cargar la lista de integrantes.", true);
        });
    };

    const clearForm = () => {
        bomberoForm.reset();
        bomberoIdField.value = '';
    };

    // =================================================================================
    // EVENT LISTENERS
    // =================================================================================

    document.getElementById('clear-form-btn').addEventListener('click', clearForm);
    document.getElementById('qr-modal-close').addEventListener('click', () => { document.getElementById('qr-modal').style.display = 'none'; });
    
    bomberoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = bomberoForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';

        const id = bomberoIdField.value;
        const fotoFile = document.getElementById('fotoPerfil').files[0];
        const bomberoData = {
            nombreCompleto: document.getElementById('nombreCompleto').value.trim(),
            dni: document.getElementById('dni').value.trim(),
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            grupoSanguineo: document.getElementById('grupoSanguineo').value.trim(),
            alergias: document.getElementById('alergias').value.trim(),
            medicamentos: document.getElementById('medicamentos').value.trim(),
            enfermedadesCronicas: document.getElementById('enfermedadesCronicas').value.trim(),
            contactoNombre: document.getElementById('contactoNombre').value.trim(),
            contactoParentesco: document.getElementById('contactoParentesco').value.trim(),
            contactoTelefono: document.getElementById('contactoTelefono').value.trim(),
            observaciones: document.getElementById('observaciones').value.trim(),
        };

        try {
            let docRef;
            let oldImageUrl = null;

            if (id) {
                docRef = doc(db, "bomberos-data", id);
                const oldDocSnap = await getDoc(docRef);
                if (oldDocSnap.exists()) { oldImageUrl = oldDocSnap.data().imageUrl || null; }
            } else {
                docRef = doc(bomberosCollectionRef);
            }

            if (fotoFile) {
                const imagePath = `profile_images/${docRef.id}/${fotoFile.name}`;
                const storageRef = ref(storage, imagePath);
                const snapshot = await uploadBytes(storageRef, fotoFile);
                bomberoData.imageUrl = await getDownloadURL(snapshot.ref);

                if (oldImageUrl && oldImageUrl !== bomberoData.imageUrl) {
                    try { await deleteObject(ref(storage, oldImageUrl)); } catch (err) { console.warn("No se pudo borrar la imagen anterior:", err); }
                }
            } else if (id) {
                bomberoData.imageUrl = oldImageUrl;
            }

            await setDoc(docRef, bomberoData);
            showNotification('¡Datos guardados correctamente!');
            clearForm();
        } catch (error) {
            console.error("Error al guardar datos:", error);
            // *** INICIO DE LA MEJORA DE ERRORES ***
            let userMessage = 'Hubo un error al guardar los datos.';
            if (error.code) {
                switch (error.code) {
                    case 'storage/unauthorized':
                        userMessage = 'Error de permisos al subir la foto. Revisa las reglas de Storage en Firebase.';
                        break;
                    case 'permission-denied':
                        userMessage = 'Error de permisos al guardar los datos. Revisa las reglas de Firestore en Firebase.';
                        break;
                    default:
                        userMessage = `Error inesperado: ${error.code}. Revisa la consola para más detalles.`;
                }
            }
            showNotification(userMessage, true);
            // *** FIN DE LA MEJORA DE ERRORES ***
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar Datos';
        }
    });

    bomberosListContainer.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;
        
        const bomberoDocRef = doc(db, "bomberos-data", id);

        if (target.classList.contains('delete-btn')) {
             if (await confirmAction('¿Estás seguro? Se borrarán los datos y la foto de perfil.')) {
                try {
                    const docSnap = await getDoc(bomberoDocRef);
                    if (docSnap.exists() && docSnap.data().imageUrl) {
                        await deleteObject(ref(storage, docSnap.data().imageUrl));
                    }
                    await deleteDoc(bomberoDocRef);
                    showNotification('Integrante borrado.');
                } catch (error) {
                    showNotification('No se pudo borrar al integrante.', true);
                    console.error("Error al borrar:", error);
                }
             }
        } else if (target.classList.contains('edit-btn')) {
            const docSnap = await getDoc(bomberoDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                Object.keys(data).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) input.value = data[key] || '';
                });
                bomberoIdField.value = id;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else if (target.classList.contains('generate-qr-btn')) {
            const nombre = target.dataset.nombre;
            const url = `${PUBLIC_APP_URL.split('?')[0]}?id=${id}`;
            const qrcodeContainer = document.getElementById('qrcode');
            qrcodeContainer.innerHTML = '';
            new QRCode(qrcodeContainer, { text: url, width: 256, height: 256 });
            document.getElementById('qr-title').innerText = nombre;
            document.getElementById('qr-modal').style.display = 'flex';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Ingresando...';
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            showNotification('Error: Email o contraseña incorrectos.', true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Ingresar';
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try { await signOut(auth); showNotification('Has cerrado la sesión.'); } catch (error) { showNotification('No se pudo cerrar la sesión.', true); }
    });

    // =================================================================================
    // INICIALIZACIÓN Y ENRUTAMIENTO
    // =================================================================================
    const showAdminPanel = () => { loadingView.classList.add('hidden'); loginView.classList.add('hidden'); fichaView.classList.add('hidden'); adminPanel.classList.remove('hidden'); listenToBomberos(); };
    const showLoginView = () => { loadingView.classList.add('hidden'); adminPanel.classList.add('hidden'); fichaView.classList.add('hidden'); loginView.classList.remove('hidden'); };
    const showFichaView = async (bomberoId) => {
        loadingView.classList.add('hidden');
        adminPanel.classList.add('hidden');
        loginView.classList.add('hidden');
        try {
            const docRef = doc(db, "bomberos-data", bomberoId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                renderFicha(docSnap.data());
            } else {
                bomberoDataContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Ficha no encontrada.</p>';
            }
        } catch (error) {
             console.error("Error al cargar la ficha:", error);
             bomberoDataContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Error al cargar la ficha.</p>';
        } finally {
            fichaView.classList.remove('hidden');
        }
    };

    const main = () => {
        const params = new URLSearchParams(window.location.search);
        const bomberoId = params.get('id');
        if (bomberoId) {
            showFichaView(bomberoId);
        } else {
            onAuthStateChanged(auth, (user) => {
                if (user && !user.isAnonymous) {
                    showAdminPanel();
                } else {
                    showLoginView();
                }
            });
        }
    };

    main();
});

