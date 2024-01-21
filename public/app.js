document.addEventListener('DOMContentLoaded', async () => {
    // Lógica del lado del cliente aquí
    // Puedes hacer solicitudes a tu servidor para obtener o enviar datos a PostgreSQL
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      console.log('Datos desde el servidor:', data);
    } catch (error) {
      console.error('Error al obtener datos desde el servidor:', error);
    }
  });