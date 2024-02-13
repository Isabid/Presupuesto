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
    const result = await pool.query('SELECT * FROM public.items');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


app.post('/api/items', async (req, res) => {
  const { codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13} = req.body;
  // Validación de campos obligatorios
  if (!codigo || !nombre || !ano) {
    return res.status(400).json({ error: 'Código, Nombre y ano son campos obligatorios.' });
  }
  
  try {

    const result = await pool.query(
      'INSERT INTO public.items (codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *',
      [codigo, nombre, enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre, totalano, ano, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13]
    
      // Agrega más parámetros según tus columnas
    );
     res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


// Actualización de un item
app.put('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const { codigo, nombre } = req.body;

  try {
    const result = await pool.query(
      'UPDATE public.items SET codigo = $1, nombre = $2 WHERE id = $5 RETURNING *',
      [codigo, nombre, itemId]
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

// Eliminar un item por su ID
app.delete('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM public.items WHERE codigo = $1 RETURNING *', [itemId]);

    if (result.rows.length > 0) {
      res.json({ message: 'Item eliminado exitosamente', deletedItem: result.rows[0] });
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