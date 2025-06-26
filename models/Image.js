// backend/models/Image.js
const mongoose = require('mongoose');

// Definir o esquema para as imagens
const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // O nome da imagem é obrigatório
    trim: true, // Remove espaços extras no início e no fim
  },
  description: {
    type: String,
    default: 'Sem descrição', // Descrição opcional com valor padrão
    trim: true,
  },
  url: {
    type: String,
    required: true, // A URL da imagem é obrigatória
  },
  createdAt: {
    type: Date,
    default: Date.now, // Data de criação automática
  },
});

// Criar e exportar o modelo
module.exports = mongoose.model('Image', imageSchema);