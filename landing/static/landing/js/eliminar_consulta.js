document.addEventListener('DOMContentLoaded', function() {
    const modalEliminar = document.getElementById('modalConfirmarEliminar');
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');

    // si no existe el modal, no se continua
    if (!modalEliminar) return;

    const inputConsultaId = document.getElementById('consulta-id');
    const modalBodyNombre = modalEliminar.querySelector('.modal-body p strong');

    // se cargan datos en el modal al abrirse
    modalEliminar.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;

        // se obtiene la informacion de los atributos data
        const id = button.getAttribute('data-id');
        const nombre = button.getAttribute('data-nombre');

        // se cargan datos en los elementos del modal
        inputConsultaId.value = id;
        modalBodyNombre.textContent = `${nombre} (ID: ${id})`;
    });

    // se ejecuta la eliminacion por ajax al hacer clic en eliminar
    btnConfirmar.addEventListener('click', function() {
        const consultaId = inputConsultaId.value;
        const url = `/eliminar/${consultaId}/`;

        // se obtiene el token csrf del DOM
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // se bloquea el boton mientras se procesa
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Eliminando...';

        fetch(url, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
            },
        })
        .then(response => {
            // si la respuesta no es ok
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error del servidor.');
                });
            }
            return response.json();
        })
        .then(data => {
            // se oculta el modal
            const modal = bootstrap.Modal.getInstance(modalEliminar);
            modal.hide();

            if (data.success) {
                // se elimina la fila de la tabla de forma dinamica para reflejar el cambio
                const fila = document.getElementById(`consulta-${consultaId}`);
                if (fila) {
                    fila.remove();
                }
                alert('Registro eliminado exitosamente.');
            }
        })
        .catch(error => {
            console.error('Error en la eliminación AJAX:', error);
            alert(`Error al eliminar: ${error.message}`);

            // se oculta el modal en caso de error
            const modal = bootstrap.Modal.getInstance(modalEliminar);
            modal.hide();
        })
        .finally(() => {
            // restaurar el boton
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = 'Eliminar';
        });
    });
});
