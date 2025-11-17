document.addEventListener('DOMContentLoaded', function () {
    const formEdicion = document.getElementById('formulario-edicion');
    const mensajeContenedor = document.createElement('div');

    if (formEdicion) {
        // se coloca un contenedor de mensajes encima del formulario
        formEdicion.parentNode.insertBefore(mensajeContenedor, formEdicion);

        formEdicion.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(formEdicion);
            const csrfToken = formData.get('csrfmiddlewaretoken');
            const formURL = formEdicion.action;

            // se limpia y muestra estado
            limpiarMensajes();
            mostrarMensaje('Guardando cambios...', 'info');

            // enviar peticion ajax
            fetch(formURL, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                },
                body: formData
            })
            .then(response => {
                //se manejan las respuestas de error http
                if (!response.ok) {
                    return response.json().then(errorData => { throw errorData; });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    mostrarMensaje('✅ ¡Consulta actualizada exitosamente! Redirigiendo...', 'success');
                    // se redirige al listado
                    setTimeout(() => {
                        window.location.href = document.querySelector('a[href*="listado_consultas"]').href;
                    }, 1500);
                }
            })
            .catch(error => {
                // se manejan errores de validacion
                mostrarMensaje('❌ Error al guardar. Revise los campos marcados.', 'danger');
                mostrarErrores(error.errors || {});
            });
        });
    }


    function limpiarMensajes() {
        document.querySelectorAll('.error-feedback').forEach(el => el.remove());
        mensajeContenedor.innerHTML = '';
    }

    function mostrarMensaje(text, type) {
        mensajeContenedor.innerHTML = `<div class="alert alert-${type}" role="alert">${text}</div>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function mostrarErrores(errors) {
        for (const fieldName in errors) {
            const errorList = errors[fieldName];
            const fieldInput = document.getElementById(`id_${fieldName}`);

            if (fieldInput) {
                errorList.forEach(errorText => {
                    const errorP = document.createElement('p');
                    errorP.className = 'text-danger error-feedback';
                    errorP.textContent = errorText;
                    // se inserta el error despues del campo
                    fieldInput.parentNode.appendChild(errorP);
                });
            }
        }
    }
});
