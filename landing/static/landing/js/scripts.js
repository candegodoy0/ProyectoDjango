document.addEventListener('DOMContentLoaded', () => {
    // se captura el formulario principal y el contenedor de alertas
    const form = document.querySelector('#formulario-principal');
    const alertContainer = document.querySelector('#alert-container');

    if (form) {
        // listener para el formulario principal
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('.btn-enviar');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }

            // limpia mensajes de error previos
            document.querySelectorAll('p.error').forEach(p => p.remove());
            alertContainer.innerHTML = ''; // Limpia mensajes flash previos

            // obtiene los datos del formulario
            const formData = new FormData(form);
            const url = form.action || window.location.href;

            const csrfToken = formData.get('csrfmiddlewaretoken');

            try {
                // se envia la solicitud post
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                // se procesa la respuesta
                if (response.ok) {
                    const data = await response.json();

                    displayFlashMessage(data.user_message, data.status_class);
                    actualizarResultados(data);
                } else {
                    const errorData = await response.json();

                    displayFlashMessage(errorData.user_message || 'El formulario contiene errores.', 'danger');
                    mostrarErrores(errorData);
                }
            } catch (error) {
                console.error('Error al enviar el formulario (Fetch):', error);
                displayFlashMessage('Ocurrió un error de conexión. Por favor, inténtalo de nuevo.', 'danger');
            } finally {
                // se rehabilita el boton al finalizar
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'ENVIAR';
                }
            }
        });
    }
});


function displayFlashMessage(message, type) {
    const alertContainer = document.querySelector('#alert-container');
    if (!alertContainer) return;

    let title = '';
    if (type === 'success') title = '¡Éxito!';
    else if (type === 'warning') title = 'Atención:';
    else title = 'Error:';

    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${title}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHtml;
    alertContainer.scrollIntoView({ behavior: 'smooth' });
}

function actualizarResultados(data) {
    const perfilContainer = document.querySelector('.resultado-item:first-child .resultado-contenido');
    const cursosContainer = document.querySelector('.resultado-item:last-child .resultado-contenido');

    if (perfilContainer) {
        let perfilHTML = '';
        if (data.perfil) {
            perfilHTML += `<p><strong>Tu perfil profesional es: ${data.perfil.toUpperCase()}</strong></p>`;
            perfilHTML += `<p>${data.descripcion}</p>`;

            if (data.traduccion_descripcion) {
                perfilHTML += `<p class="text-muted fst-italic">Traducción (EN): ${data.traduccion_descripcion}</p>`;
            }
        } else {
            perfilHTML += '<p>Acá se mostrará el perfil obtenido y una breve descripción del mismo.</p>';
        }
        perfilContainer.innerHTML = perfilHTML;
    }

    if (cursosContainer) {
        let cursosHTML = '';
        if (data.cursos && data.cursos.length > 0) {
            cursosHTML += '<h3>Los cursos que te recomendamos son:</h3>';

            // inciio del formulario
            cursosHTML += `<form action="/inscribir/" method="post" id="form-inscribir">`;
            cursosHTML += `<input type="hidden" name="csrfmiddlewaretoken" value="${data.csrf_token || ''}">`;
            cursosHTML += `<input type="hidden" name="nombre" value="${data.nombre || ''}">`;
            cursosHTML += `<input type="hidden" name="correo" value="${data.correo || ''}">`;

            cursosHTML += '<div class="lista-cursos">';

            data.cursos.forEach(item => {
                cursosHTML += `<label class="curso-item">
                                 <input type="checkbox" name="cursos" value="${item.nombre}">
                                 ${item.nombre}`;
                if (item.traduccion) {
                    cursosHTML += ` <span class="text-muted fst-italic">(${item.traduccion})</span>`;
                }
                cursosHTML += '</label><br>';
            });

            cursosHTML += '</div>';
            cursosHTML += '<button type="submit" class="btn-inscribir">INSCRIBIRME</button>';
            cursosHTML += '</form>';
            // fin del formulario

        } else {
            cursosHTML += '<p>No se encontraron recomendaciones de cursos.</p>';
        }

        cursosContainer.innerHTML = cursosHTML;

        // listeneer del boton inscribir,e
        const formInscribir = document.querySelector('#form-inscribir');
        if (formInscribir) {
            formInscribir.addEventListener('submit', () => {
                const submitButton = formInscribir.querySelector('.btn-inscribir');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Procesando...';
                }
            });
        }

        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function mostrarErrores(errorData) {
    for (const [campo, errores] of Object.entries(errorData.errors || {})) {

        // remover errores previos
        document.querySelectorAll(`[name="${campo}"]`).forEach(input => {
            input.closest('.campo')?.querySelectorAll('p.error').forEach(p => p.remove());
            input.closest('.pregunta')?.querySelectorAll('p.error').forEach(p => p.remove());
        });

        const inputElement = document.querySelector(`[name="${campo}"]`);
        if (inputElement) {
            const campoDiv = inputElement.closest('.campo') || inputElement.closest('.pregunta');

            errores.forEach(errorText => {
                const errorP = document.createElement('p');
                errorP.className = 'error';
                errorP.textContent = errorText;
                if (campoDiv) {
                    campoDiv.appendChild(errorP);
                }
            });
        }
    }
}
