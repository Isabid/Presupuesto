// Configuración de dotenv y logs de depuración
require('dotenv').config();
const debug = require('debug')('app:server');

debug('Puerto:', process.env.PORT);
debug('Usuario de la base de datos:', process.env.DB_USER);

// Inicialización de la aplicación express
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configuración del pool de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.json());
app.use(express.static('public'));


// Ruta para obtener todos los items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.items ORDER BY codigo');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// ruta para insertar registros
app.post('/api/items', async (req, res) => {
  // Tomar el código por separado para hacer la validación de si existe o no.
  const codigoDesdeCliente = req.body.codigo;
  const { codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13 } = req.body;

  try {
    // Verificar si ya existe un registro con el mismo código
    const existingItem = await pool.query('SELECT * FROM public.items WHERE codigo = $1', [codigoDesdeCliente]);

    console.log("Entre antes del if, para mostrar si encntre el codigo", existingItem, codigoDesdeCliente)

    if (existingItem.rows.length) {
      // Acceder a los campos del primer resultado para pruebas
      const primerResultado = existingItem.rows[0];
      // Acceder a campos específicos
      const nombre = primerResultado.nombre;
      const codigo1 = primerResultado.codigo;

      console.log("Aquí entro cuando encuentra el registro", codigoDesdeCliente, nombre, codigo);
      // Ya existe un registro con el mismo código, devolver un mensaje de error
      return res.status(400).json({ success: false, error: 'Ya existe un registro con el mismo código, desde Servidor' });
    }

    // Insertar un nuevo registro
    const result = await pool.query(
      'INSERT INTO public.items (codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *',
      [codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13]
    );
    console.log("Aqui entro cuando guardo el registro", codigoDesdeCliente)

    // Si todo está bien, devolver una respuesta exitosa
    return res.status(200).json({ success: true, mensaje: 'Registro guardado exitosamente.' });
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    // En caso de error, devolver una respuesta de error
    return res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});



// Endpoint para reiniciar la aplicación
app.post('/restart-app', async (req, res) => {
  try {
    // Lógica para reiniciar la aplicación (puedes utilizar nodemon o pm2 para hacerlo)
    // Realiza las tareas de reinicio aquí (si es necesario)
    
    // Envía la respuesta al cliente antes de reiniciar
    return res.status(200).json({ mensaje: 'Reiniciando la aplicación...' });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el reinicio aquí
    console.error('Error al reiniciar la aplicación:', error);
    return res.status(500).json({ error: 'Error en el servidor al reiniciar la aplicación' });
  }
});


// Actualización de un item
app.put('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const {nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13 } = req.body;
  // Crear un objeto con los datos recibidos
  const datosRecibidos = {itemId, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto,
    septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9,
    r10, r11, r12, r13 };


  try {
    const result = await pool.query(
      'UPDATE public.items SET nombre = $1, enero = $2, febrero = $3, marzo = $4, abril = $5, mayo = $6, junio = $7, julio = $8, agosto = $9, septiembre = $10, octubre = $11, noviembre = $12, diciembre = $13, totalano = $14, ano = $15, r1 = $16, r2 = $17, r3 = $18, r4 = $19, r5 = $20, r6 = $21, r7 = $22, r8 = $23, r9 = $24, r10 = $25, r11 = $26, r12 = $27, r13 = $28 WHERE codigo = $29 RETURNING *',
      [nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, itemId]
    );
    

    // Verifica si se actualizó algún registro
    if (result.rows.length > 0) {
      res.status(200).json({ Ok: 'Registro Actualizado exitosamente.' });
      //res.json({ mensaje: 'Registro actualizado exitosamente.' });
    } else {
      res.status(404).json({ error: 'No se encontró el registro para actualizar.' });
    }
  } catch (error) {
    console.error('Error al actualizar en la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});





// Eliminar un item por su ID
app.delete('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM public.items WHERE codigo = $1 RETURNING *', [itemId]);

    if (result.rows.length > 0) {
      res.json({ message: 'Item eliminado exitosamente'});
    } else {
      res.status(404).json({ error: 'Item no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar en la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});



// Resto de las operaciones CRUD...

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});