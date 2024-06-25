document.addEventListener("DOMContentLoaded", function () {
    const registrosTabla = document.getElementById("registrosTabla");
    const descargarJsonBtn = document.getElementById("descargarJsonBtn");
    let registros = JSON.parse(localStorage.getItem("registros")) || []; // Cargar registros desde el almacenamiento local

    // Función para actualizar la tabla con los registros actuales
    function actualizarTabla() {
        registrosTabla.innerHTML = '';

        // Recorrer los registros y agregarlos a la tabla
        registros.forEach(registro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.email}</td>
                <td>${registro.telefono}</td>
                <td>${registro.fechaNacimiento}</td>
                <td>${registro.nivelEstudios}</td>
                <td>${registro.experiencia}</td>
            `;
            registrosTabla.appendChild(fila);
        });
    }

    // Función para limpiar la tabla
    function limpiarTabla() {
        registrosTabla.innerHTML = '';
    }

    // Evento de envío del formulario para agregar un nuevo registro
    document.getElementById("trabajaForm").addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que se recargue la página
        // Obtener los valores del formulario
        const nombre = document.getElementById("nombre_trabaja").value;
        const email = document.getElementById("email_trabaja").value;
        const telefono = document.getElementById("telefono_trabaja").value;
        const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
        const nivelEstudios = document.getElementById("nivel_estudios").value;
        const experiencia = document.getElementById("experiencia").value;
        
        // Agregar el nuevo registro al arreglo de registros
        registros.push({
            nombre: nombre,
            email: email,
            telefono: telefono,
            fechaNacimiento: fechaNacimiento,
            nivelEstudios: nivelEstudios,
            experiencia: experiencia
        });

        // Actualizar la tabla con el nuevo registro
        actualizarTabla();

        // Guardar los registros en el almacenamiento local
        localStorage.setItem("registros", JSON.stringify(registros));

        // Limpiar el formulario después de enviar los datos
        document.getElementById("trabajaForm").reset();
    });

    // Cargar los registros en la tabla al cargar la página
    actualizarTabla();

    // Evento para descargar los datos en formato JSON
    descargarJsonBtn.addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registros, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "registros.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });
});



