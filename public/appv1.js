// Contenido del archivo app.js
function enviarFormulario() {
    const formulario = document.getElementById('miFormulario');
    const formData = new FormData(formulario);
  
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
            <p><strong>Enero:</strong> ${item.enero}</p>
            <p><strong>Febrero:</strong> ${item.febrero}</p>
            <p><strong>Marzo:</strong> ${item.marzo}</p>
            <p><strong>Abril:</strong> ${item.abril}</p>
            <p><strong>Mayo:</strong> ${item.mayo}</p>
            <p><strong>Junio:</strong> ${item.junio}</p>
            <p><strong>Julio:</strong> ${item.julio}</p>
            <p><strong>Agosto:</strong> ${item.agosto}</p>
            <p><strong>Septiembre:</strong> ${item.septiembre}</p>
            <p><strong>Octubre:</strong> ${item.octubre}</p>
            <p><strong>Noviembre:</strong> ${item.noviembre}</p>
            <p><strong>Diciembre:</strong> ${item.diciembre}</p>
            <p><strong>Total año:</strong> ${item.totalano}</p>
            <p><strong>Año:</strong> ${item.ano}</p>
  
            <!-- Agrega más campos según tus columnas -->
  
            <button onclick="editItem(${item.id})">Editar</button>
            <button onclick="deleteItem(${item.id})">Eliminar</button>
            <hr>
          `;
          itemList.appendChild(listItem);
        });
      } catch (error) {
        console.error('Error al obtener datos desde el servidor:', error);
      }
    };
  
    // Resto de la lógica del lado del cliente...
  
    // Llamar a la función para cargar items al cargar la página
    loadItems();
  });
  

