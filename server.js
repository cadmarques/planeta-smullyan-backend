const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Middleware para CORS
const islandRoutes = require('./routes/islandRoutes'); // Importa as rotas das ilhas

// Inicializa o Express
const app = express();

// Configurações do servidor
const PORT = process.env.PORT || 5000;

// Middleware para permitir JSON
app.use(express.json());

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:8080', // Substitua pela URL do frontend
}));

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/seu-banco-de-dados', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/islands', islandRoutes);

// Rota de teste para verificar logs
app.get('/test', (req, res) => {
    console.log('Rota /test chamada');
    res.send('Backend funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});