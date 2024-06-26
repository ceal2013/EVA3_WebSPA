document.addEventListener("DOMContentLoaded", function () {
    const registrosTabla = document.getElementById("registrosTabla");
    const descargarJsonBtn = document.getElementById("descargarJsonBtn");
    let registros = sessionStorage.getItem("registros") ? JSON.parse(sessionStorage.getItem("registros")) : [];
    let idCounter = registros.length > 0 ? Math.max(...registros.map(registro => registro.id)) + 1 : 1;

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function actualizarTabla() {
        registrosTabla.innerHTML = '';

        registros.forEach(registro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.email}</td>
                <td>${registro.telefono}</td>
                <td>${formatDate(registro.fechaNacimiento)}</td>
                <td>${registro.nivelEstudios}</td>
                <td>${registro.experiencia}</td>
                <td>
                    <button type="button" class="btn btn-info btn-sm editar-btn" data-id="${registro.id}">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm eliminar-btn" data-id="${registro.id}">Eliminar</button>
                </td>
            `;
            registrosTabla.appendChild(fila);
        });

        // Activar/desactivar botón de descarga según haya registros o no
        descargarJsonBtn.disabled = registros.length === 0;

        // Agregar event listeners a los botones de editar y eliminar
        const editarBtns = document.querySelectorAll('.editar-btn');
        editarBtns.forEach(btn => {
            btn.addEventListener('click', () => editarRegistro(parseInt(btn.getAttribute('data-id'))));
        });

        const eliminarBtns = document.querySelectorAll('.eliminar-btn');
        eliminarBtns.forEach(btn => {
            btn.addEventListener('click', () => eliminarRegistro(parseInt(btn.getAttribute('data-id'))));
        });
    }

    function editarRegistro(id) {
        const registro = registros.find(registro => registro.id === id);
        if (registro) {
            // Llenar el formulario con los datos del registro
            document.getElementById("nombre_trabaja").value = registro.nombre;
            document.getElementById("email_trabaja").value = registro.email;
            document.getElementById("telefono_trabaja").value = registro.telefono;
            document.getElementById("fecha_nacimiento").value = registro.fechaNacimiento;
            document.getElementById("nivel_estudios").value = registro.nivelEstudios;
            document.getElementById("experiencia").value = registro.experiencia;

            // Mostrar botón de actualizar y ocultar botón de enviar
            document.getElementById("actualizarBtn").style.display = "inline-block";
            document.getElementById("enviarBtn").style.display = "none";
            document.getElementById("cancelarBtn").style.display = "inline-block";

            // Guardar el ID del registro que se está editando
            document.getElementById("actualizarBtn").setAttribute('data-id', id.toString());

            // Remover el listener anterior del botón actualizar
            const actualizarBtn = document.getElementById("actualizarBtn");
            const newActualizarBtn = actualizarBtn.cloneNode(true);
            actualizarBtn.parentNode.replaceChild(newActualizarBtn, actualizarBtn);

            // Asignar nuevo evento click al botón actualizar
            newActualizarBtn.addEventListener('click', function() {
                // Validar que el checkbox de confirmación esté marcado
                if (!document.getElementById("confirma").checked) {
                    alert("Por favor, confirma los datos ingresados marcando la casilla.");
                    return;
                }

                const nombre = document.getElementById("nombre_trabaja").value;
                const email = document.getElementById("email_trabaja").value;
                const telefono = document.getElementById("telefono_trabaja").value;
                const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
                const nivelEstudios = document.getElementById("nivel_estudios").value;
                const experiencia = document.getElementById("experiencia").value;

                // Actualizar registro existente
                const index = registros.findIndex(registro => registro.id === id);
                if (index !== -1) {
                    registros[index] = {
                        id: id,
                        nombre: nombre,
                        email: email,
                        telefono: telefono,
                        fechaNacimiento: fechaNacimiento,
                        nivelEstudios: nivelEstudios,
                        experiencia: experiencia
                    };
                }

                // Limpiar formulario y actualizar tabla
                document.getElementById("trabajaForm").reset();
                document.getElementById("actualizarBtn").removeAttribute('data-id');
                document.getElementById("actualizarBtn").style.display = "none";
                document.getElementById("enviarBtn").style.display = "inline-block";
                document.getElementById("cancelarBtn").style.display = "none";
                sessionStorage.setItem("registros", JSON.stringify(registros));
                actualizarTabla();
            });
        }
    }

    function eliminarRegistro(id) {
        registros = registros.filter(registro => registro.id !== id);
        sessionStorage.setItem("registros", JSON.stringify(registros));
        actualizarTabla();
    }

    // Evento de envío del formulario para agregar un nuevo registro
    document.getElementById("trabajaForm").addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que se recargue la página

        // Validar que el checkbox de confirmación esté marcado
        if (!document.getElementById("confirma").checked) {
            alert("Por favor, confirma los datos ingresados marcando la casilla.");
            return;
        }

        const nombre = document.getElementById("nombre_trabaja").value;
        const email = document.getElementById("email_trabaja").value;
        const telefono = document.getElementById("telefono_trabaja").value;
        const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
        const nivelEstudios = document.getElementById("nivel_estudios").value;
        const experiencia = document.getElementById("experiencia").value;

        // Obtener el ID del registro si se está actualizando
        const id = document.getElementById("actualizarBtn").getAttribute('data-id');

        if (id) {
            // No debería ejecutarse aquí, ya que el evento click del botón actualizar se maneja dentro de editarRegistro
            return;
        }

        // Agregar nuevo registro
        registros.push({
            id: idCounter++,
            nombre: nombre,
            email: email,
            telefono: telefono,
            fechaNacimiento: fechaNacimiento,
            nivelEstudios: nivelEstudios,
            experiencia: experiencia
        });

        // Limpiar el formulario después de enviar los datos
        document.getElementById("trabajaForm").reset();

        // Guardar registros en sessionStorage y actualizar tabla
        sessionStorage.setItem("registros", JSON.stringify(registros));
        actualizarTabla();
    });

    // Evento para cancelar la edición
    document.getElementById("cancelarBtn").addEventListener('click', function() {
        document.getElementById("trabajaForm").reset();
        document.getElementById("actualizarBtn").removeAttribute('data-id');
        document.getElementById("actualizarBtn").style.display = "none";
        document.getElementById("enviarBtn").style.display = "inline-block";
        document.getElementById("cancelarBtn").style.display = "none";
    });

    // Evento para descargar los datos en formato JSON
    document.getElementById("descargarJsonBtn").addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registros, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "registros.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Cargar los registros en la tabla al cargar la página
    actualizarTabla();
});











