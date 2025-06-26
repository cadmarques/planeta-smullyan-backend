// backend/app.js (ou routes/testRoutes.js)
const express = require('express');
const Image = require('../models/Image'); // Importa o modelo de Imagem

const router = express.Router();

// Rota para testar a criação de uma imagem
router.post('/test-image', async (req, res) => {
  try {
    const newImage = new Image({
      name: 'Teste de Imagem',
      description: 'Esta é uma imagem de teste.',
      url: '/images/test-image.jpg',
    });

    await newImage.save();
    res.status(201).json({ message: 'Imagem criada com sucesso!', image: newImage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;