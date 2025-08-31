// =================================================================================
// IMPORTACIONES DE FIREBASE
// =================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, onSnapshot, setDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// =================================================================================
// CONFIGURACIÓN PRINCIPAL DE LA APP
// =================================================================================

// --- URL Pública de la Aplicación ---
const PUBLIC_APP_URL = "https://911apruebadefuego.github.io/";

// --- Configuración de Firebase ---
// IMPORTANTE: REEMPLAZA ESTE BLOQUE con el objeto de configuración que copiaste 
// desde tu Consola de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyAGQ7LfHVBT4zJIAGzjliRDHw_XscyfBis",
  authDomain: "bomberos-jm-fichas.firebaseapp.com",
  projectId: "bomberos-jm-fichas",
  storageBucket: "bomberos-jm-fichas.appspot.com",
  messagingSenderId: "847464331656",
  appId: "1:847464331656:web:961de4993430f86e2ce23d"
};

// Este es un identificador único para tu aplicación dentro de la base de datos. Puedes dejarlo así.
const appId = 'bomberos-jesus-maria-qr';

let db, auth;
let bomberosCollectionRef;

try {
    // Verifica que las claves no sean las de ejemplo
    if (firebaseConfig.apiKey === "TU_API_KEY_AQUI") {
        throw new Error("Las claves de Firebase no han sido configuradas.");
    }
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    // La ruta de la base de datos ahora es más simple para una app pública
    bomberosCollectionRef = collection(db, `bomberos-data`);
} catch (e) {
    console.error("Error crítico inicializando Firebase:", e);
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.innerHTML = `<div class="bg-white p-8 rounded-2xl shadow-lg"><p class="text-red-600 text-center font-semibold">Error de configuración de Firebase. La aplicación no puede funcionar. Revisa que las claves en script.js sean correctas y no las de ejemplo.</p></div>`;
    adminPanel.classList.remove('hidden');
}

// =================================================================================
// ELEMENTOS DEL DOM Y HELPERS DE UI
// =================================================================================
const adminPanel = document.getElementById('admin-panel');
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
        setTimeout(() => notification.remove(), 300);
    }, 5000);
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
    const fields = [
        { label: 'Nombre Completo', value: data.nombreCompleto, bold: true, full: true },
        { label: 'DNI', value: data.dni },
        { label: 'Fecha de Nacimiento', value: data.fechaNacimiento ? new Date(data.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-AR') : 'No especificada' },
        { label: 'Grupo Sanguíneo', value: data.grupoSanguineo, important: true },
        { label: 'Alergias', value: data.alergias || 'Ninguna conocida', important: true, full: true },
        { label: 'Enfermedades Crónicas', value: data.enfermedadesCronicas || 'Ninguna conocida', full: true },
        { label: 'Medicación Actual', value: data.medicamentos || 'Ninguna', full: true },
        { label: 'Contacto de Emergencia', value: `${data.contactoNombre || 'N/A'} (${data.contactoParentesco || 'N/A'}) - ${data.contactoTelefono || 'N/A'}`, full: true },
        { label: 'Observaciones', value: data.observaciones || 'Sin observaciones', full: true },
    ];
    bomberoDataContainer.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">${fields.map(field => `<div class="py-3 border-b border-gray-200 ${field.full ? 'md:col-span-2' : ''}"><p class="text-sm font-medium text-gray-500">${field.label}</p><p class="text-lg ${field.bold ? 'font-bold' : ''} ${field.important ? 'text-red-600 font-semibold' : 'text-gray-900'}">${field.value || 'No especificado'}</p></div>`).join('')}</div>`;
    fichaView.classList.remove('hidden');
    adminPanel.classList.add('hidden');
};

const listenToBomberos = () => {
     onSnapshot(bomberosCollectionRef, (snapshot) => {
        loadingList.classList.add('hidden');
        if (snapshot.empty) {
            bomberosListContainer.innerHTML = '<p class="p-4 text-center text-gray-500">Aún no hay integrantes cargados.</p>';
            return;
        }
        const bomberos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        bomberosListContainer.innerHTML = `<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th></tr></thead><tbody class="bg-white divide-y divide-gray-200">${bomberos.map(b => `<tr><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${b.nombreCompleto}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${b.dni}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"><button data-id="${b.id}" data-nombre="${b.nombreCompleto}" class="generate-qr-btn text-indigo-600 hover:text-indigo-900">QR</button><button data-id="${b.id}" class="edit-btn text-green-600 hover:text-green-900">Editar</button><button data-id="${b.id}" class="delete-btn text-red-600 hover:text-red-900">Borrar</button></td></tr>`).join('')}</tbody></table>`;
    }, (error) => {
        console.error("Error al escuchar cambios en bomberos: ", error);
        showNotification("Error al cargar la lista de integrantes.", true);
    });
};

const clearForm = () => {
    bomberoForm.reset();
    bomberoIdField.value = '';
};

document.getElementById('clear-form-btn').addEventListener('click', clearForm);

bomberoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = bomberoForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    const id = bomberoIdField.value;
    const bombero = {
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
        if (id) {
            await setDoc(doc(db, "bomberos-data", id), bombero);
            showNotification('¡Datos actualizados correctamente!');
        } else {
            await addDoc(bomberosCollectionRef, bombero);
            showNotification('¡Integrante guardado correctamente!');
        }
        clearForm();
    } catch (error) {
        console.error("Error al guardar datos:", error);
        showNotification('Hubo un error al guardar los datos.', true);
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
         if (await confirmAction('¿Estás seguro de que quieres borrar a este integrante? Esta acción es irreversible.')) {
            try {
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

// =================================================================================
// INICIALIZACIÓN Y ENRUTAMIENTO
// =================================================================================
const router = async () => {
    const params = new URLSearchParams(window.location.search);
    const bomberoId = params.get('id');
    if (bomberoId) {
        try {
            const docRef = doc(db, "bomberos-data", bomberoId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) renderFicha(docSnap.data());
            else {
                bomberoDataContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Ficha no encontrada.</p>';
                fichaView.classList.remove('hidden');
            }
        } catch (error) {
             bomberoDataContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Error al cargar la ficha.</p>';
             fichaView.classList.remove('hidden');
        }
    } else {
        adminPanel.classList.remove('hidden');
        fichaView.classList.add('hidden');
        listenToBomberos();
    }
};

const main = async () => {
    if (!db || !auth) return;
    try {
        await signInAnonymously(auth);
        router();
    } catch (error) {
        console.error("Error de autenticación:", error);
        adminPanel.innerHTML = `<div class="bg-white p-8 rounded-2xl shadow-lg"><p class="text-red-600 text-center font-semibold">Error de autenticación. La aplicación no puede funcionar.</p></div>`;
        adminPanel.classList.remove('hidden');
    }
};

main();


