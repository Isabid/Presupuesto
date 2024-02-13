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

// Rutas y lógica de la aplicación

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Consulta de todos los items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.items');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Inserción de un nuevo item
app.post('/api/items', async (req, res) => {
  const { codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano} = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO public.items (codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *',
      [codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano]
    );

    console.log('Resultado de la inserción:', result.rows[0]); // Agrega este log para verificar el resultado de la inserción

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Actualización de un item
app.put('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const { codigo, Nombre, enero, febrero } = req.body;

  try {
    const result = await pool.query(
      'UPDATE public.items SET codigo = $1, Nombre = $2, enero = $3, febrero = $4 WHERE id = $5 RETURNING *',
      [codigo, Nombre, enero, febrero, itemId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Item no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar en la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Eliminación de un item
app.delete('/api/items/:id', async (req, res) => {
  console.log('Ingreso a Server--- delete', itemId);
  const itemId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM public.items WHERE id = $1 RETURNING *', [itemId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Item no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar de la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Inicio del servidor
app.listen(port, () => {
  debug(`Servidor escuchando en el puerto ${port}`);
});

