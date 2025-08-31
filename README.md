# 911apruebadefuego.github.io
Fichas medicas BV JM
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha Médica QR - Bomberos Voluntarios Jesús María</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        .printable-qr {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        .printable-qr-content {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            position: relative;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
         @media print {
            body * {
                visibility: hidden;
            }
            .printable-area, .printable-area * {
                visibility: visible;
            }
            .printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
             .no-print {
                 display: none;
             }
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-800">

    <div id="app" class="container mx-auto p-4 md:p-8 max-w-5xl">

        <!-- Vista de la Ficha Médica (cuando se escanea el QR) -->
        <div id="ficha-view" class="hidden">
            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-4 border-red-600">
                <div class="flex flex-col md:flex-row items-center justify-between mb-6 pb-4 border-b-2 border-red-200">
                    <h1 class="text-2xl md:text-3xl font-bold text-red-700">FICHA MÉDICA DE EMERGENCIA</h1>
                    <div class="flex items-center mt-4 md:mt-0">
                        <svg class="w-10 h-10 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span class="text-lg font-semibold text-gray-700">Bomberos Voluntarios Jesús María</span>
                    </div>
                </div>

                <div id="bombero-data" class="space-y-6">
                    <!-- Los datos se insertarán aquí -->
                </div>
            </div>
        </div>

        <!-- Panel de Administración (para cargar datos y generar QRs) -->
        <div id="admin-panel" class="hidden space-y-12">
            <div>
                 <div class="text-center mb-8">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Gestión de Fichas Médicas</h1>
                    <p class="text-lg text-gray-600 mt-2">Cargue y administre los datos de los integrantes del cuartel.</p>
                </div>

                <!-- Formulario para agregar/editar bombero -->
                <form id="bombero-form" class="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-gray-200">
                    <h2 class="text-2xl font-bold text-red-700 border-b pb-3">Datos del Integrante</h2>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="form-group">
                            <label for="nombreCompleto" class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input type="text" id="nombreCompleto" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                        <div class="form-group">
                            <label for="dni" class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                            <input type="text" id="dni" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                        <div class="form-group">
                            <label for="fechaNacimiento" class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                            <input type="date" id="fechaNacimiento" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                        <div class="form-group">
                            <label for="grupoSanguineo" class="block text-sm font-medium text-gray-700 mb-1">Grupo Sanguíneo y Factor</label>
                            <input type="text" id="grupoSanguineo" placeholder="Ej: A+" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-800 pt-4 border-t mt-6">Información Médica Relevante</h3>

                    <div class="form-group">
                        <label for="alergias" class="block text-sm font-medium text-gray-700 mb-1">Alergias Conocidas (separadas por coma)</label>
                        <input type="text" id="alergias" placeholder="Penicilina, Yodo, etc." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                    </div>
                    <div class="form-group">
                        <label for="medicamentos" class="block text-sm font-medium text-gray-700 mb-1">Medicamentos que toma actualmente</label>
                        <textarea id="medicamentos" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="enfermedadesCronicas" class="block text-sm font-medium text-gray-700 mb-1">Enfermedades Crónicas / Preexistentes</label>
                        <textarea id="enfermedadesCronicas" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"></textarea>
                    </div>

                    <h3 class="text-xl font-semibold text-gray-800 pt-4 border-t mt-6">Contacto de Emergencia</h3>
                    <div class="grid md:grid-cols-3 gap-6">
                         <div class="form-group">
                            <label for="contactoNombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" id="contactoNombre" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                         <div class="form-group">
                            <label for="contactoParentesco" class="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
                            <input type="text" id="contactoParentesco" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                         <div class="form-group">
                            <label for="contactoTelefono" class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="text" id="contactoTelefono" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-1">Observaciones Adicionales</label>
                        <textarea id="observaciones" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"></textarea>
                    </div>
                    
                    <input type="hidden" id="bombero-id">
                    <div class="flex justify-end space-x-4 pt-6 border-t">
                        <button type="button" id="clear-form-btn" class="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200">Limpiar</button>
                        <button type="submit" class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50">Guardar Datos</button>
                    </div>
                </form>
            </div>

            <!-- Lista de Bomberos -->
            <div>
                 <h2 class="text-2xl font-bold text-gray-800 mb-6">Integrantes Cargados</h2>
                 <div id="bomberos-list" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                     <div class="p-4 text-center text-gray-500" id="loading-list">Cargando integrantes...</div>
                 </div>
            </div>
        </div>
    </div>

    <!-- Modal para mostrar QR -->
    <div id="qr-modal" class="printable-qr">
        <div class="printable-qr-content">
            <span class="close-button" onclick="document.getElementById('qr-modal').style.display='none'">&times;</span>
            <div class="printable-area">
                <h3 id="qr-title" class="text-2xl font-bold mb-4"></h3>
                <div id="qrcode" class="flex justify-center p-4 bg-white"></div>
                <p class="mt-4 text-gray-600">Escanee para ver la Ficha Médica</p>
            </div>
            <button onclick="window.print()" class="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 no-print">Imprimir QR</button>
        </div>
    </div>

    <!-- Area de Notificaciones -->
    <div id="notification-area" class="fixed top-5 right-5 z-[1001] w-80"></div>
    
    <!-- Modal de Confirmación -->
    <div id="confirm-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full z-[1000] flex justify-center items-center">
        <div class="relative p-5 border w-full max-w-sm shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
					<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
				</div>
                <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2" id="confirm-title">Confirmar Acción</h3>
                <div class="mt-2 px-7 py-3">
                    <p class="text-sm text-gray-500" id="confirm-message"></p>
                </div>
                <div class="items-center px-4 py-3 space-x-2">
                    <button id="confirm-ok-btn" class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                        Aceptar
                    </button>
                    <button id="confirm-cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        // =================================================================================
        // IMPORTACIONES DE FIREBASE
        // =================================================================================
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, collection, doc, getDoc, onSnapshot, setDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
        
        // =================================================================================
        // CONFIGURACIÓN PRINCIPAL DE LA APP
        // =================================================================================
        
        // --- URL Pública de la Aplicación ---
        // IMPORTANTE: Este es el paso más crítico. Reemplace la URL de ejemplo con la URL
        // pública donde alojará este archivo. Los códigos QR no funcionarán sin esto.
        // Ejemplo: "https://bomberos-jm.netlify.app/index.html"
        const PUBLIC_APP_URL = "https://911apruebadefuego.github.io/";
        
        // --- Configuración de Firebase ---
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id-bomberos-jm';
        
        let db, auth;
        let bomberosCollectionRef;

        try {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            bomberosCollectionRef = collection(db, `artifacts/${appId}/public/data/bomberos`);
        } catch (e) {
            console.error("Error crítico inicializando Firebase:", e);
            const adminPanel = document.getElementById('admin-panel');
            adminPanel.innerHTML = `<div class="bg-white p-8 rounded-2xl shadow-lg"><p class="text-red-600 text-center font-semibold">Error de configuración de Firebase. La aplicación no puede funcionar.</p></div>`;
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
                    await setDoc(doc(db, `artifacts/${appId}/public/data/bomberos`, id), bombero);
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
            
            const bomberoDocRef = doc(db, `artifacts/${appId}/public/data/bomberos`, id);

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
                if (PUBLIC_APP_URL.includes("YOUR_APP_URL_HERE")) {
                    showNotification("¡Atención! Debe configurar la URL pública para que los QR funcionen.", true);
                    return; 
                }
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
                    const docRef = doc(db, `artifacts/${appId}/public/data/bomberos`, bomberoId);
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
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
                router();
            } catch (error) {
                console.error("Error de autenticación:", error);
                adminPanel.innerHTML = `<div class="bg-white p-8 rounded-2xl shadow-lg"><p class="text-red-600 text-center font-semibold">Error de autenticación. La aplicación no puede funcionar.</p></div>`;
                adminPanel.classList.remove('hidden');
            }
        };
        
        main();
    </script>
</body>
</html>

