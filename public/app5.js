function formatearYMostrar(input) {
  let valorOriginal = input.value;

  // Si el valor original es una cadena vacía, asignamos '0' para evitar NaN
  let valorLimpio = valorOriginal.trim() === '' ? '0' : valorOriginal.replace(/,/g, '').replace(/\./g, '');

  let valorFormateado = new Intl.NumberFormat('es-ES').format(parseFloat(valorLimpio));

  input.value = valorFormateado;
  input.setAttribute('data-original', valorLimpio);
}



/*function obtenerValoresLimpios(formulario) {
  const inputs = formulario.querySelectorAll("input[type=number]");
  
  inputs.forEach((input) => {
    const valorOriginal = input.getAttribute("data-original-value");
    const valorFormateado = new Intl.NumberFormat('es-ES').format(parseFloat(valorOriginal.replace(',', '.')));

    input.value = valorFormateado;
  });

  return true; // Para permitir el envío del formulario
}
*/

function limpiarNumerosEnFormulario(formulario) {
  const camposNumericos = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', 'totalano', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13'];

  camposNumericos.forEach(campo => {
    const valorOriginal = formulario.get(campo);
    const valorLimpio = limpiarNumero(valorOriginal);
    formulario.set(campo, valorLimpio);
  });
}

function limpiarNumero(numero) {
  if (numero.trim() === '') {
     numero = '0'
     return numero
  }
  // Reemplaza las comas y puntos por nada
  return numero.replace(/[\,\ .]/g, '');
}


// Función consultar items de la tabla
function consultarItems() {
  fetch(`/api/items/`, {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
       return response.text(); // Obtener el cuerpo como texto en caso de error
    }
    return response.json();
  })
  .then(data => {
    const mensajeTexto = JSON.stringify(data);
    // Puedes mostrar el mensaje en algún elemento HTML en tu página
    document.getElementById('mensajeContainer').innerText = mensajeTexto;
    // Puedes mostrar el mensaje en algún elemento HTML en tu página
    // document.getElementById('mensajeContainer').innerText = data;
  })
  .catch(error => {
    console.error('Error al enviar la solicitud de Consulta a la base de datos', error);
  
    // Verificar si hay un mensaje de error en el formato esperado
    if (typeof error === 'string') {
      // Si el error es una cadena de texto, mostrarla directamente
      document.getElementById('mensajeContainer').innerText = 'Error: ' + error;
    } else {
      // Si no es una cadena de texto, mostrar un mensaje genérico
      document.getElementById('mensajeContainer').innerText = 'Error al enviar la solicitud de Consultar. Verifica la consola para más detalles.';
    }
  });
}

function enviarFormulario() {
  const addItemForm = document.getElementById('addItemForm');
  const formData = new FormData(addItemForm);
  // Llamas a esta función antes de enviar el formulario
  limpiarNumerosEnFormulario(formData);

  // Validación de campos obligatorios
  const codigo = formData.get('codigo');
  const nombre = formData.get('nombre');
  const ano = formData.get('ano');

  // Obtén el elemento para mostrar mensajes de error
  const mensajeErrorElement = document.getElementById('mensajeContainer');

  if (!codigo || !nombre || !ano) {
    // Muestra el mensaje de error en el elemento
    mensajeErrorElement.innerText = 'Error...Código, Nombre y año son campos obligatorios.';
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
  .then(response => {
    if (!response.ok) {
      return response.text(); // Obtener el cuerpo como texto en caso de error
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      // Operación exitosa
      document.getElementById('mensajeContainer').innerText = data.mensaje;
    } else {
      // Error en el servidor
      console.error('Error al enviar la solicitud de Guardar:', data.error);
      document.getElementById('mensajeContainer').innerText = 'Error: ' + data.error;
    }
  })
  
          /* .then(data => {
            // Aquí puedes manejar la respuesta exitosa
            console.log("Trae mensaje del servidor", data)
            const mensajeTexto = JSON.stringify(data);
            // Puedes mostrar el mensaje en algún elemento HTML en tu página
            document.getElementById('mensajeContainer').innerText = mensajeTexto;
            // Puedes mostrar el mensaje en algún elemento HTML en tu página
            // document.getElementById('mensajeContainer').innerText = data;
          }) */
  
  .catch(error => {
    console.error('Error al enviar la solicitud de Guardar:', error);

    // Verificar si hay un mensaje de error en el formato esperado
    if (typeof error === 'string') {
      // Si el error es una cadena de texto, mostrarla directamente
      document.getElementById('mensajeContainer').innerText = 'Error: ' + error;
    } else {
      // Si no es una cadena de texto, mostrar un mensaje genérico
      document.getElementById('mensajeContainer').innerText = 'Error al enviar la solicitud a Guardar. Verifica la consola para más detalles.';
    }
  });
   // Mostrar un mensaje después de un retraso de 1,5 segundos
  setTimeout(function() {
    // reinicia app para que los datos queden actualizados
    reiniciarApp();
  }, 1500); // El tiempo está especificado en milisegundos (1,5 segundos en este caso)
}



//Actualizar un item
function actualizarItem(itemId) {
  // Obtén los datos del formulario
  const addItemForm = document.getElementById('addItemForm');
  const formData = new FormData(addItemForm);
   // Llamas a esta función que quita comas y demas a los nuemeros para poderlos guardar antes de enviar el formulario
   limpiarNumerosEnFormulario(formData);
   
    // Validación de campos obligatorios
    const codigo = formData.get('codigo');
    const nombre = formData.get('nombre');
    const ano = formData.get('ano');
    if (!codigo || !nombre || !ano) {
        mensajeErrorElement.innerText = 'Error...Código, Nombre y fecha de Pago, son campos obligatorios.';
        // Puedes mostrar un mensaje al usuario si lo deseas
        return;
    }
  //llamado al servidor mara actualizar regitros
  fetch(`/api/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', // Asegúrate de establecer el tipo de contenido como JSON
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
  .then(response => {
    if (!response.ok) {
      return response.text(); // Obtener el cuerpo como texto en caso de error
    }
    return response.json();
  })
  .then(data => {
    // Convertir el objeto a una cadena de texto
    const mensajeTexto = JSON.stringify(data);
    // Puedes mostrar el mensaje en algún elemento HTML en tu página
    document.getElementById('mensajeContainer').innerText = mensajeTexto;
    
  })
  .catch(error => {
    console.error('Error al enviar la solicitud a Modificar:', error);
  
    // Verificar si hay un mensaje de error en el formato esperado
    if (typeof error === 'string') {
      // Si el error es una cadena de texto, mostrarla directamente
      document.getElementById('mensajeContainer').innerText = 'Error: ' + error;
    } else {
      // Si no es una cadena de texto, mostrar un mensaje genérico
      document.getElementById('mensajeContainer').innerText = 'Error al enviar la solicitud a Modificar. Verifica la consola para más detalles.';
    }
  });
  // llamar funcion que muestra items actualizados
  //loadItems();
   // Mostrar un mensaje después de un retraso de 2 segundos
  setTimeout(function() {
  // reinicia app para que los datos queden actualizados
  reiniciarApp();
  }, 1500); // El tiempo está especificado en milisegundos (1.5 segundos en este caso)
}

// Función para eliminar un item
function eliminarItem(itemId) {
  fetch(`/api/items/${itemId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
       return response.text(); // Obtener el cuerpo como texto en caso de error
    }
    return response.json();
  })
  .then(data => {
    const mensajeTexto = JSON.stringify(data);
    // Puedes mostrar el mensaje en algún elemento HTML en tu página
    document.getElementById('mensajeContainer').innerText = mensajeTexto;
    // Puedes mostrar el mensaje en algún elemento HTML en tu página
    // document.getElementById('mensajeContainer').innerText = data;
  })
  .catch(error => {
    console.error('Error al enviar la solicitud de Guardar:', error);
  
    // Verificar si hay un mensaje de error en el formato esperado
    if (typeof error === 'string') {
      // Si el error es una cadena de texto, mostrarla directamente
      document.getElementById('mensajeContainer').innerText = 'Error: ' + error;
    } else {
      // Si no es una cadena de texto, mostrar un mensaje genérico
      document.getElementById('mensajeContainer').innerText = 'Error al enviar la solicitud a Guardar. Verifica la consola para más detalles.';
    }
  });
  // Mostrar un mensaje después de un retraso de 2 segundos
  setTimeout(function() {
  // reinicia app para que los datos queden actualizados
    reiniciarApp();
  }, 1500); // El tiempo está especificado en milisegundos (2 segundos en este caso)
}



// Función solicitar datos input un item
function ingresarItem() {
   // Limpiar el contenedor antes de agregar nuevos elementos
  itemListContainer.innerHTML = '';
  const itemListContainer = document.getElementById('itemListContainer');
  
}

function loadItems() {
  // Código de carga de items
}




document.addEventListener('DOMContentLoaded', async () => {
  const itemListContainer = document.getElementById('itemListContainer');
  const diferencia = document.getElementById('diferencia');
  const mensajeContainer = document.getElementById('mensajeContainer');
  const opcionesDiv = document.getElementById('opcionesDiv');
  const mensajeErrorElement = document.getElementById('mensajeError');


  // Variable para llevar el control del índice actual
  let indiceActual = 0;
  let items; // Declarar items fuera de la función loadItems
  codigoitem = ""
  // Limpiar el contenedor antes de agregar nuevos elementos
  itemListContainer.innerHTML = '';

  // Función para cargar y mostrar la lista de items
  const loadItems = async () => {
    try {
      const response = await fetch('/api/items');
      items = await response.json(); // Asignar a la variable items
      
      items.forEach(item => {
        // ... (mismo código para asignar valores a campos del formulario)
      });

      // Mostrar el primer registro
      mostrarItem(indiceActual);
    } catch (error) {
      console.error('Error al obtener datos desde el servidor:', error);
    }
  };
  loadItems();
  
  // Función para mostrar un item específico
  const mostrarItem = (indice) => {
    if (items && items.length > 0) {
      // Obtener el item actual
      const item = items[indice];
      // vamos a incluir en el objeto item los calculos que necesito
      item.d1 = item.enero - item.r1
      item.d2 = item.febrero - item.r2
      item.d3 = item.marzo - item.r3
      item.d4 = item.abril - item.r4
      item.d5 = item.mayo - item.r5
      item.d6 = item.junio - item.r6
      item.d7 = item.julio - item.r7
      item.d8 = item.agosto - item.r8
      item.d9 = item.septiembre - item.r9
      item.d10 = item.octubre - item.r10
      item.d11 = item.noviembre - item.r11
      item.d12 = item.diciembre - item.r12   
 
      // Aplicar formato con comas a los valores numéricos
      for (const prop in item) {
        if (item.hasOwnProperty(prop)) {
          const formElement = document.getElementById(prop);
          // toma el codigo para desde ahi poder hacer referencia a el en cualquier punto
          codigoitem = item.codigo
          
          if (formElement) {
            // Verificar si la cadena contiene solo caracteres numéricos y al menos un dígito
            const esNumero = /^\d+$/.test(item[prop]);
            if (esNumero) {
              const valorNumerico = parseFloat(item[prop]);
              //if (!isNaN(valorNumerico) && typeof valorNumerico === 'number') {
              // Si es numérico, formatear y mostrar
              formatearTMostrar(formElement, valorNumerico);
            } else {
              // Mantener el formato original para valores no numéricos
              formElement.value = item[prop];
            }
          }
        }
      }

      // Mostrar opciones de navegación
      mostrarOpciones(indice);
    } else {
      // Mostrar un mensaje en el contenedor de mensajes si no hay items
      mensajeContainer.innerHTML = 'No hay items para mostrar.';
      mostrarOpciones(indice);
    }
  };

  // Función para formatear y mostrar un número con comas
  const formatearTMostrar = (input, numero) => {
    // Convierte el número a cadena con formato de comas
    const valorFormateado = new Intl.NumberFormat('es-ES').format(numero);
    
    // Asigna el valor formateado al input
    input.value = valorFormateado;

    // Almacena el valor original sin formato en el atributo "data-original"
    input.setAttribute('data-original', numero);
  };

 
  // Función para mostrar opciones de navegación
  const mostrarOpciones = (indice) => {
    // Limpiar el contenedor de opciones
    opcionesDiv.innerHTML = '';

    // Crear botones de navegación
    const botonAnterior = document.createElement('button');
    botonAnterior.innerHTML = 'Anterior';
    botonAnterior.addEventListener('click', retroceder);

    const botonSiguiente = document.createElement('button');
    botonSiguiente.innerHTML = 'Siguiente';
    botonSiguiente.addEventListener('click', avanzar);

    const botonNuevo = document.createElement('button');
    botonNuevo.innerHTML = 'Nuevo';
    botonNuevo.addEventListener('click', nuevo);

    const botonGuardar = document.createElement('button');
    botonGuardar.innerHTML = 'Guardar';
    botonGuardar.addEventListener('click', guardar);

    const botonEliminar = document.createElement('button');
    botonEliminar.innerHTML = 'Eliminar';
    botonEliminar.addEventListener('click', eliminar);

    const botonModificar = document.createElement('button');
    botonModificar.innerHTML = 'Modificar';
    botonModificar.addEventListener('click', modificar);

    // Agregar botones al contenedor de opciones
    opcionesDiv.appendChild(botonAnterior);
    opcionesDiv.appendChild(botonSiguiente);
    opcionesDiv.appendChild(botonModificar);
    opcionesDiv.appendChild(botonEliminar);
    opcionesDiv.appendChild(botonNuevo);
    opcionesDiv.appendChild(botonGuardar);

    // Mostrar mensaje de posición actual si es el primer registro no entra

    if (indice >= 0) {
      mensajeContainer.innerHTML = `Mostrando item ${indice + 1} de ${items.length}.`;
    };
  };

  // Funciones de navegación
  const avanzar = () => {
    if (indiceActual < items.length - 1) {
      indiceActual++;
      mostrarItem(indiceActual);
    } else {
      mostrarMensaje('Ya estás en el último registro.');
    }
  };

  const retroceder = () => {
    if (indiceActual > 0) {
      indiceActual--;
      mostrarItem(indiceActual);
    } else {
      mostrarMensaje('Ya estás en el primer registro.');
    }
  };

  // Función para mostrar mensajes en el contenedor de mensajes
  const mostrarMensaje = (mensaje) => {
    mensajeContainer.innerHTML = mensaje;
  };

  const nuevo = () => {
   // llamar funcion
     limpiarFormulario(document.getElementById('itemForm'));
  };

  const guardar = () => {
    // llamar funcion
      enviarFormulario()
      // Llamas a la función cuando sea necesario para reiniciar la aplicacion una vez grabe los datos
     // reiniciarApp();
  };
  const modificar = () => {
      // llamar funcion
      actualizarItem(codigoitem)
  };

  const eliminar = () => {
    // llamar funcion
    eliminarItem(codigoitem);
  };
  
});



function limpiarFormulario(formulario) {
  const inputs = formulario.querySelectorAll('input, select, textarea');

  inputs.forEach((input) => {
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = false;
    } else {
      input.value = '';
    }
  });
}

// En algún lugar de tu código cliente (puede ser un botón clicado, una función llamada, etc.)
const reiniciarServidor = async () => {
  try {
    const response = await fetch('/restart-app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Puedes enviar datos adicionales en el cuerpo de la solicitud si es necesario
      // body: JSON.stringify({ /* datos adicionales */ }),
    });

    if (response.ok) {
      const data = await response.json();
    } else {
      console.error('Error al reiniciar la aplicación:', response.statusText);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud de reinicio:', error);
  }
};

// Esta funcion me permite reiniciar la pagina para que los datos carguen despues de actualizarlos
const reiniciarApp = () => {
  // Recarga la página, reiniciando la aplicación cliente
  location.reload();
};

