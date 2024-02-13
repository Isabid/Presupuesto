function formatearYMostrar(input) {
  let valorOriginal = input.value;

  // Si el valor original es una cadena vacía, asignamos '0' para evitar NaN
  let valorLimpio = valorOriginal.trim() === '' ? '0' : valorOriginal.replace(/,/g, '').replace(/\./g, '');

  let valorFormateado = new Intl.NumberFormat('es-ES').format(parseFloat(valorLimpio));

  input.value = valorFormateado;
  input.setAttribute('data-original', valorLimpio);
}



function obtenerValoresLimpios(formulario) {
  const inputs = formulario.querySelectorAll("input[type=number]");
  
  inputs.forEach((input) => {
    const valorOriginal = input.getAttribute("data-original-value");
    const valorFormateado = new Intl.NumberFormat('es-ES').format(parseFloat(valorOriginal.replace(',', '.')));

    input.value = valorFormateado;
  });

  return true; // Para permitir el envío del formulario
}

function limpiarNumerosEnFormulario(formulario) {
  const camposNumericos = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', 'totalano', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13'];

  camposNumericos.forEach(campo => {
    const valorOriginal = formulario.get(campo);
    const valorLimpio = limpiarNumero(valorOriginal);
    formulario.set(campo, valorLimpio);
  });
}

function limpiarNumero(numero) {
  // Reemplaza las comas y puntos por nada
  return numero.replace(/[\,\ .]/g, '');
}


function enviarFormulario() {
  const addItemForm = document.getElementById('addItemForm');
  const formData = new FormData(addItemForm);

  // Llamas a esta función antes de enviar el formulario
  limpiarNumerosEnFormulario(formData);

  // muestra lo que convirtio
  console.log('Datos del formulario:', formData);

  // Validación de campos obligatorios
  const codigo = formData.get('codigo');
  const nombre = formData.get('nombre');
  const ano = formData.get('ano');

  if (!codigo || !nombre || !ano) {
    console.error('Código, Nombre y año son campos obligatorios.');
    return;
  }

  // Realiza la solicitud al servidor
  fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error al enviar el formulario:', error);
    });
}


// Función para eliminar un item
function eliminarItem(itemId) {
  console.log('Ingreso a app delete', itemId);
  fetch(`/api/items/${itemId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor al eliminar:', data);
      // Recarga la lista después de eliminar un item
      loadItems();
    })
    .catch(error => {
      console.error('Error al enviar la solicitud de eliminación:', error);
    });
}

function loadItems() {
  // Código de carga de items
}


document.addEventListener('DOMContentLoaded', async () => {
  const itemList = document.getElementById('itemList');

  // Lógica del lado del cliente aquí
  // Puedes hacer solicitudes a tu servidor para obtener o enviar datos a PostgreSQL

  // Función para cargar y mostrar la lista de items
  const loadItems = async () => {
    try {
      const response = await fetch('/api/items');
      const items = await response.json();

      // Limpiar la lista antes de agregar nuevos elementos
      itemList.innerHTML = '';

      items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `
        <p><strong>Código:</strong> ${item.codigo}</p>
        <p><strong>Nombre:</strong> ${item.nombre}</p>

        <!-- Agrega más campos según tus columnas -->

        <button onclick="editItem(${item.id})">Editar</button>

        <button onclick="eliminarItem(${item.codigo})">Eliminar
        </button>
        <hr>
        `;
        itemList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error al obtener datos desde el servidor:', error);
    }
  };



  // Función para agregar un nuevo item
  addItemForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(addItemForm);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Item agregado exitosamente.');
        // Puedes recargar la lista de items después de agregar uno nuevo
        loadItems();
        // Limpia el formulario después de agregar un item
        addItemForm.reset();
      } else {
        console.error('Error al agregar item:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });

  // Resto de la lógica del lado del cliente...

  // Llamar a la función para cargar items al cargar la página
  loadItems();
});

