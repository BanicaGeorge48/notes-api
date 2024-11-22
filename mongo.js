const mongoose = require('mongoose')

// Obtén la cadena de conexión desde las variables de entorno
const connectionString = process.env.MONGO_DB_URI

// Verifica si la cadena de conexión existe
if (!connectionString) {
  console.error(
    'Recuerda que tienes que tener un archivo .env con las variables de entorno definidas y el MONGO_DB_URI que servirá de connection string. En las clases usamos MongoDB Atlas pero puedes usar cualquier base de datos de MongoDB (local incluso).'
  )
  process.exit(1) // Finaliza el proceso con un error
}

// Conexión a MongoDB
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err)
    process.exit(1) // Finaliza el proceso si no se puede conectar
  })

// Manejo de cierre de la conexión al detener el proceso
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close() // Cierra la conexión correctamente
    console.log('Conexión cerrada correctamente')
    process.exit(0) // Finaliza el proceso sin errores
  } catch (err) {
    console.error('Error al cerrar la conexión:', err)
    process.exit(1) // Finaliza el proceso con un error
  }
})

// Manejo de errores no capturados
process.on('uncaughtException', async (err) => {
  console.error('Excepción no capturada:', err)
  try {
    await mongoose.connection.close() // Intenta cerrar la conexión antes de salir
    console.log('Conexión cerrada correctamente tras uncaughtException')
  } catch (closeErr) {
    console.error('Error al cerrar conexión tras uncaughtException:', closeErr)
  }
  process.exit(1) // Finaliza con un error
})
